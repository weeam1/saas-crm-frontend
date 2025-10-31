import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import ManagerAgentImport from './ManagerAgentImport';
import { fetchAgentLeadsSats } from 'api';
import { updateMultipleLeadFields } from '../../../../redux/leadsSlice';
import { sendBulkLeadNotification } from 'api';
import useUserSession from 'hooks/useUserSession';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { useModalColors } from 'hooks/useModalColors';

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
			if (key === 'managerAssigned' || key === 'agentAssigned') {
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
	const { createUserLog } = useUserActivityLog();
	const tree = useSelector((state) => state.user.activeTree);

	const closeHandler = () => {
		setBulkAssign(false);
	};

	const initialValues = {
		managerAssigned: '',
		agentAssigned: '',
	};

	const dispatch = useDispatch();

	const handleFormSubmit = async (values) => {
		try {
			// Collect selected leads and form data
			const payload = {
				selectedLeads: selectedValues,
				formData: values,
			};

			setIsLoading(true);

			let managerDetails = null;
			let agentDetails = null;

			if (values?.managerAssigned) {
				managerDetails = tree?.managers?.find(
					(user) =>
						user?._id?.toString() === values?.managerAssigned?.toString()
				);
			}

			if (values?.agentAssigned) {
				const stats = await fetchAgentLeadsSats(
					values.agentAssigned,
					'bulk',
					selectedValues?.length
				);

				if (!stats.canAddLeads) {
					setIsLoading(false);
					setErrorLeadData(stats);
					setErrorModal(true);
					return;
				}

				const managerAgents =
					tree?.agents[`manager-${values?.managerAssigned}`] || [];
				agentDetails = managerAgents?.find(
					(user) => user?._id?.toString() === values?.agentAssigned?.toString()
				);
			}

			let res = await putApi(`api/lead/bulk-assign`, payload);

			if (res.status === 200) {
				// refreshData();
				const updates = createUpdates(selectedValues, values);

				dispatch(
					updateMultipleLeadFields({
						updates,
					})
				);

				sendBulkLeadNotification(user?._id, values, selectedLeads);
				toast.success('Leads updated successfully');

				formikResetForm();
				setSelectedValues([]);
				setSelectedLeads([]);
				setSelectAllChecked(false);

				let message;

				if (managerDetails?.fullName && agentDetails?.fullName) {
					message = `Bulk leads assigned by ${user?.fullName} to Manager ${managerDetails.fullName} and Agent ${agentDetails.fullName}.`;
				} else if (managerDetails?.fullName) {
					message = `Bulk leads assigned by ${user?.fullName} to Manager ${managerDetails.fullName}.`;
				} else if (agentDetails?.fullName) {
					message = `Bulk leads assigned by ${user?.fullName} to Agent ${agentDetails.fullName}.`;
				} else {
					message = `Bulk leads assigned by ${user?.fullName}, but remain unassigned to any manager or agent.`;
				}

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
