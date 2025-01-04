import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { putApi } from "services/api";
import ManagerAgentImport from "./ManagerAgentImport";

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

const BlukImportModal = (props) => {
	const { isLoding, blukImport, setBlukImport, selectedValues, refetchData } =
		props;
	const [isLoading, setIsLoading] = useState(false);

	const user = JSON.parse(localStorage.getItem("user"));
	const tree = useSelector((state) => state.user.tree);

	console.log({ selectedValues });

	const closeHandler = () => {
		setBlukImport(false);
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

			// Submit data to the server or handle logic
			console.log("Submitting payload:", payload);

			let response = await putApi(`api/lead/bluk-import`, payload);
			if (response.status === 200) {
				toast.success("Leads successfully Updated!");
				formikResetForm();
				refetchData();
			}
		} catch (error) {
			console.error("Error submitting bulk import:", error);
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
		<Modal
			size="5xl"
			onClose={closeHandler}
			isOpen={blukImport}
			isCentered
			motionPreset="slideInBottom"
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Bluk Import</ModalHeader>
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
	);
};

export default BlukImportModal;
