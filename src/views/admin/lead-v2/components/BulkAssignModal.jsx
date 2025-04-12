import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import ManagerAgentImport from './ManagerAgentImport';
import { fetchAgentLeadsSats } from 'api';
import { updateMultipleLeadFields } from '../../../../redux/leadsSlice';
import { sendBulkLeadNotification } from 'api';

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

				updateObj.leadType = null;
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

	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	const [isLoading, setIsLoading] = useState(false);

	const user = JSON.parse(localStorage.getItem('user'));
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

			if (values?.agentAssigned) {
				const stats = await fetchAgentLeadsSats(values.agentAssigned);

				if (!stats.canAddLeads) {
					setIsLoading(false);
					setErrorLeadData(stats);
					setErrorModal(true);
					return;
				}
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
			} else if (res.status === 400) {
				// const errorDetails =
				// 	res?.response?.data?.message || "Invalid input provided.";
				const errorHint =
					res?.response?.data?.hint ||
					'Please review the input and adjust as necessary.';

				toast.error(errorHint);
			}
		} catch (error) {
			console.error('Error submitting bulk assign:', error);
			toast.error(error);
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
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
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
