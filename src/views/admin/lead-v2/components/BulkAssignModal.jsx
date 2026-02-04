import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import ManagerAgentImport from './ManagerAgentImport';
import { fetchAgentLeadsStats } from 'api';
import { updateMultipleLeadFields } from '../../../../redux/leadsSlice';
import { sendBulkLeadNotification } from 'api';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { useModalColors } from 'hooks/useModalColors';
import { ASSIGNMENT_BY_PERMISSION, formatList } from './constants';

import { usePermissions } from 'hooks/usePermissions';
import { useTeamStructure } from 'hooks/user/useTeamStructure';

const {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	Spinner,
} = require('@chakra-ui/react');

// const createUpdates = (selectedValues, values) => {
// 	return selectedValues.flatMap((id) =>
// 		Object.entries(values).map(([key, value]) => ({
// 			id,
// 			key,
// 			value,
// 		}))
// 	);
// };

const createUpdates = (selectedValues, values) => {
	const updatesMap = new Map();

	selectedValues.forEach((id) => {
		if (!updatesMap.has(id)) {
			updatesMap.set(id, { id });
		}

		Object.entries(values).forEach(([key, value]) => {
			const updateObj = updatesMap.get(id);
			updateObj[key] = value;

			// Set date for managerAssignedDate or agentAssignedDate
			if (
				['teamLeadAssigned', 'managerAssigned', 'agentAssigned'].includes(key)
			) {
				updateObj[`${key}Date`] =
					value === null || value === '' ? null : new Date().toISOString();

				// updateObj.leadType = null;
				updateObj.isReleased = false;
			}
		});
	});

	return Array.from(updatesMap.values());
};

const BulkAssignModal = (props) => {
	const {
		bulkAssign,
		setBulkAssign,
		setErrorModal,
		setErrorLeadData,
		selectedValues,
		setSelectedValues,
		setSelectedLeads,
		selectedLeads,
		setSelectAllChecked,
	} = props;

	const [isMounted, setIsMounted] = useState(true);

	const { headerBg, closeBtnColor, primaryBtnBg, headerText } =
		useModalColors();

	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	const [isLoading, setIsLoading] = useState(false);

	const { user } = useUserSession();
	const { hasPermission } = usePermissions();
	const { createUserLog } = useUserActivityLog();
	const { team: managers, allAgents, allTeamLeaders } = useTeamStructure();

	const tree = useSelector((state) => state.user.activeTree);

	const resolvePermission = () => {
		if (hasPermission('leads', 'bulkAssign_all')) return 'bulkAssign_all';
		if (hasPermission('leads', 'bulkAssign_team')) return 'bulkAssign_teamLead';
		if (hasPermission('leads', 'bulkAssign_agents')) return 'bulkAssign_agents';
		return null;
	};

	const filterAssignmentValues = (values) => {
		const permission = resolvePermission();

		// If user has no assignment permission → send nothing
		if (!permission) return {};

		const allowedFields = ASSIGNMENT_BY_PERMISSION[permission];

		return Object.fromEntries(
			Object.entries(values).filter(([key]) => allowedFields.includes(key)),
		);
	};

	const closeHandler = () => {
		setBulkAssign(false);
	};

	const initialValues = {
		managerAssigned: '',
		teamLeadAssigned: '',
		agentAssigned: '',
	};

	const dispatch = useDispatch();

	const handleFormSubmit = async (values) => {
		try {
			// Collect selected leads and form data
			const finalValues = filterAssignmentValues(values);
			const payload = {
				selectedLeads: selectedValues,
				formData: finalValues,
			};

			setIsLoading(true);

			let managerDetails = null;
			let teamLeadDetails = null;
			let agentDetails = null;
			// let managerTeam = null;

			if (finalValues?.managerAssigned) {
				managerDetails = managers?.find(
					(user) =>
						user?._id?.toString() === values?.managerAssigned?.toString(),
				);
			}

			if (finalValues.teamLeadAssigned) {
				// managerTeam = tree?.agents[`manager-${values?.managerAssigned}`] || [];

				teamLeadDetails = allTeamLeaders?.find(
					(user) =>
						user?._id?.toString() === values?.teamLeadAssigned?.toString(),
				);
			}

			if (finalValues?.agentAssigned) {
				const stats = await fetchAgentLeadsStats(
					values.agentAssigned,
					'bulk',
					selectedValues?.length,
				);

				if (!stats.canAddLeads) {
					setIsLoading(false);
					setErrorLeadData(stats);
					setErrorModal(true);
					return;
				}

				// managerTeam = tree?.agents[`manager-${values?.managerAssigned}`] || [];

				agentDetails = allAgents?.find(
					(user) => user?._id?.toString() === values?.agentAssigned?.toString(),
				);
			}

			let res = await putApi(`api/lead/bulk-assign`, payload);

			if (res.status === 200) {
				// refreshData();
				const updates = createUpdates(selectedValues, finalValues);

				console.log({ updates });

				dispatch(
					updateMultipleLeadFields({
						updates,
					}),
				);

				sendBulkLeadNotification(user?._id, finalValues, selectedLeads);
				toast.success('Leads updated successfully');

				formikResetForm();
				setSelectedValues([]);
				setSelectedLeads([]);
				setSelectAllChecked(false);

				let message;

				// const ASSIGNMENT_FLOW = [
				// 	{ key: 'manager', label: 'Manager', value: managerDetails },
				// 	{ key: 'teamLead', label: 'Team Lead', value: teamLeadDetails },
				// 	{ key: 'agent', label: 'Agent', value: agentDetails },
				// ];

				// const assignedRoles = ASSIGNMENT_FLOW.filter(
				// 	(r) => r.value?.fullName
				// ).map((r) => `${r.label} ${r.value.fullName}`);

				// const message = assignedRoles.length
				// 	? `Bulk leads assigned by ${user?.fullName} to ${formatList(assignedRoles)}.`
				// 	: `Bulk leads assigned by ${user?.fullName}, but no Manager, Team Lead, or Agent was assigned.`;

				if (
					managerDetails?.fullName &&
					agentDetails?.fullName &&
					teamLeadDetails?.fullName
				) {
					message = `Bulk leads assigned by ${user?.fullName} to Manager ${managerDetails.fullName}, Team Lead ${teamLeadDetails?.fullName}, and Agent ${agentDetails.fullName}.`;
				} else if (agentDetails?.fullName && teamLeadDetails?.fullName) {
					message = `Bulk leads assigned by ${user?.fullName} to Team Lead ${teamLeadDetails?.fullName}, and Agent ${agentDetails.fullName}.`;
				} else if (managerDetails?.fullName) {
					message = `Bulk leads assigned by ${user?.fullName} to Manager ${managerDetails.fullName}.`;
				} else if (teamLeadDetails?.fullName) {
					message = `Bulk leads assigned by ${user?.fullName} to Team Lead ${teamLeadDetails.fullName}.`;
				} else if (agentDetails?.fullName) {
					message = `Bulk leads assigned by ${user?.fullName} to Agent ${agentDetails.fullName}.`;
				} else if (finalValues?.teamLeadAssigned === '') {
					message = `Bulk leads assigned by ${user?.fullName}, but remain unassigned to team lead or agent.`;
				} else if (finalValues.agentAssigned === '') {
					message = `Bulk leads assigned by ${user?.fullName}, but remain unassigned to no agent.`;
				} else
					message = `Bulk leads assigned by ${user?.fullName}, but remain unassigned to no manager, team lead or agent.`;

				const leadIds = selectedLeads.map((lead) => lead.intID);

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'BULK_ASSIGN',
					entity: 'Lead',
					enityType: 'Lead',
					leadAgent: values?.agentAssigned || null,
					leadManager: values?.managerAssigned || null,
					status: 'success',
					rawPayload: {
						leadIds,
					},
					message,
				});
			} else if (res.status === 400) {
				// const errorDetails =
				// 	res?.response?.data?.message || "Invalid input provided.";
				const errorHint =
					res?.response?.data?.hint ||
					'Please review the input and adjust as necessary.';

				toast.error(errorHint);

				// update user activity log
				createUserLog({
					userId: user?._id,
					action: 'BULK_ASSIGN',
					entity: 'Lead',
					enityType: 'Lead',
					status: 'fail',
					message: `Bulk Leads assigned failed: ${errorHint}`,
				});
			}
		} catch (error) {
			console.error('Error submitting bulk assign:', error);
			const errorMsg = error?.data?.message || 'Error submitting bulk assign';

			toast.error(errorMsg);

			// update user activity log
			createUserLog({
				userId: user?._id,
				action: 'BULK_ASSIGN',
				entity: 'Lead',
				enityType: 'Lead',
				status: error?.status === 500 ? 'error' : 'fail',
				message: `Bulk Leads assigned failed: ${errorMsg}`,
			});
		} finally {
			setIsLoading(false);
			closeHandler();
		}
	};

	const formik = useFormik({
		initialValues,
		onSubmit: handleFormSubmit,
	});

	const {
		errors,
		touched,
		values,
		handleChange,
		handleSubmit,
		resetForm: formikResetForm,
		dirty,
		setFieldValue,
	} = formik;

	return (
		<>
			<Modal
				size='2xl'
				onClose={closeHandler}
				isOpen={bulkAssign}
				isCentered
				motionPreset='slideInBottom'
			>
				<ModalOverlay backdropFilter='blur(2px)' />
				<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
					<ModalHeader
						display='flex'
						gap='2'
						bg={headerBg}
						color={headerText}
						borderTopRadius='xl'
						py={4}
						alignItems='center'
						w='100%'
					>
						Bulk Assign ({selectedValues?.length} Leads)
					</ModalHeader>
					<ModalBody>
						<ModalCloseButton onClick={closeHandler} />
						<ManagerAgentImport
							values={values}
							errors={errors}
							touched={touched}
							handleChange={handleChange}
							setFieldValue={setFieldValue}
							user={user}
							tree={tree}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='red'
							variant='outline'
							size='sm'
							mr='2'
							onClick={() => formikResetForm()}
						>
							Clear
						</Button>
						<Button
							colorScheme='brand'
							size='sm'
							onClick={handleSubmit}
							disabled={isLoading}
						>
							{isLoading ? <Spinner /> : 'Save'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default BulkAssignModal;
