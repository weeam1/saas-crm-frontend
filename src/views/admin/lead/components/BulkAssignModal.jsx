import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";
import ManagerAgentImport from "./ManagerAgentImport";
import ErrorMessageModal from "components/Message/ErrorMessageModal";

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
} = require("@chakra-ui/react");

const BulkAssignModal = (props) => {
	// const [errorModal, setErrorModal] = useState({
	// 	visible: false,
	// 	message: "",
	// });

	const {
		bulkAssign,
		setBulkAssign,
		selectedValues,
		setSelectedValues,
		setSelectAllChecked,
		refreshData,
	} = props;

	const [isLoading, setIsLoading] = useState(false);

	const user = JSON.parse(localStorage.getItem("user"));
	const tree = useSelector((state) => state.user.tree);

	const closeHandler = () => {
		setBulkAssign(false);
	};

	const initialValues = {
		managerAssigned: "",
		agentAssigned: "",
	};

	const handleFormSubmit = async (values) => {
		try {
			// Collect selected leads and form data
			const payload = {
				selectedLeads: selectedValues,
				formData: values,
			};
			setIsLoading(true);

			let res = await putApi(`api/lead/bulk-assign`, payload);
			if (res.status === 200) {
				toast.success("Leads updated successfully");
				refreshData();
				formikResetForm();
				setSelectedValues([]);
				setSelectAllChecked(false);
			} else if (res.status === 400) {
				console.log(res.response);

				const errorDetails =
					res?.response?.data?.message || "Invalid input provided.";
				// const errorHint =
				// 	res?.response?.data?.hint ||
				// 	"Please review the input and adjust as necessary.";

				toast.error(`${errorDetails}`);
			}
		} catch (error) {
			console.error("Error submitting bulk assign:", error);
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
			{/* {errorModal.visible && (
				<ErrorMessageModal
					isOpen={errorModal.visible}
					onClose={() => setErrorModal({ ...errorModal, visible: false })}
					message={errorModal.message}
				/>
			)} */}

			<Modal
				size="2xl"
				onClose={closeHandler}
				isOpen={bulkAssign}
				isCentered
				motionPreset="slideInBottom"
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
							colorScheme="brand"
							size="sm"
							mr={2}
							onClick={handleSubmit}
							disabled={isLoading || !dirty ? true : false}
						>
							{isLoading ? <Spinner /> : "Save"}
						</Button>
						<Button
							colorScheme="red"
							variant="outline"
							size="sm"
							onClick={() => formikResetForm()}
						>
							Clear
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default BulkAssignModal;
