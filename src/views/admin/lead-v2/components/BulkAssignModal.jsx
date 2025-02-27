import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { putApi } from 'services/api';
import ManagerAgentImport from './ManagerAgentImport';
import { fetchAgentLeadsSats } from 'api';
import { updateMultipleLeadFields } from '../../../../redux/leadsSlice';

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

const createUpdates = (selectedValues, values) => {
	return selectedValues.flatMap((id) =>
		Object.entries(values).map(([key, value]) => ({
			id,
			key,
			value,
		}))
	);
};

const BulkAssignModal = (props) => {
	const {
		bulkAssign,
		setBulkAssign,
		setErrorModal,
		setErrorLeadData,
		selectedValues,
		setSelectedValues,
		refreshData,
		setSelectAllChecked,
	} = props;

	const [isLoading, setIsLoading] = useState(false);

	const user = JSON.parse(localStorage.getItem('user'));
	const tree = useSelector((state) => state.user.tree);

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

			console.log({ values });
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

			const updates = createUpdates(selectedValues, values);

			let res = await putApi(`api/lead/bulk-assign`, payload);

			if (res.status === 200) {
				// refreshData();

				dispatch(
					updateMultipleLeadFields({
						updates,
					})
				);
				toast.success('Leads updated successfully');
				formikResetForm();
				setSelectedValues([]);
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
					<ModalHeader>Bulk Assign</ModalHeader>
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
