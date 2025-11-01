import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	FormErrorMessage,
	useColorModeValue,
	Flex,
	Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { buttonStyle } from "utils/btn";
import { toast } from "react-toastify";
import Loader from "components/loading/Loader";

const ProjectFormModal = ({
	isOpen,
	onClose,
	onSubmit,
	developers = [],
	isSubmitting,
	isLoading,
	initialData = null,
	title = "Create Project",
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			developerId: "",
		},
	});

	const headerBg = useColorModeValue("brand.300", "brand.100");
	const headerText = useColorModeValue("brand.700", "brand.900");
	const footerBg = useColorModeValue("gray.50", "gray.700");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	const bgColor = useColorModeValue("white", "gray.800");

	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name || "",
				developerId: initialData?.developer?._id || "",
			});
		} else {
			reset({
				name: "",
				developerId: "",
			});
		}
	}, [initialData, reset]);

	const submitForm = async (data) => {
		try {
			await onSubmit(data);
			onClose();
		} catch (err) {
			toast.error(err?.message || "Failed to submit project");
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
			<ModalOverlay />
			<ModalContent
				m="2"
				borderRadius="2xl"
				bg={bgColor}
				shadow="2xl"
				overflow="hidden"
				maxH="85vh"
				display="flex"
				flexDirection="column"
			>
				<Flex
					align="center"
					justify="space-between"
					bg={headerBg}
					color={headerText}
					px={6}
					py={3}
					borderBottom="1px solid"
					borderColor={borderColor}
					position="sticky"
					top="0"
					zIndex="10"
				>
					<Text fontSize="lg" fontWeight="bold">
						{initialData ? "Edit Project" : title}
					</Text>
					<ModalCloseButton position="static" />
				</Flex>

				{isLoading ? (
					<Loader />
				) : (
					<form id="project-form" onSubmit={handleSubmit(submitForm)}>
						<ModalBody
							p={5}
							overflowY="auto"
							maxH="65vh"
							scrollBehavior="smooth"
							sx={{
								"&::-webkit-scrollbar": { width: "6px" },
								"&::-webkit-scrollbar-thumb": {
									background: "#c1c1c1",
									borderRadius: "10px",
								},
							}}
						>
							<FormControl mb={4} isRequired isInvalid={!!errors.name}>
								<FormLabel>Project Name</FormLabel>
								<Input
									_focus={{ borderColor: "brand.400" }}
									{...register("name", {
										required: "Project name is required",
										minLength: {
											value: 2,
											message: "Minimum 2 characters",
										},
									})}
									placeholder="Enter project name"
								/>
								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
							</FormControl>

							<FormControl mb={4} isRequired isInvalid={!!errors.developerId}>
								<FormLabel>Select Developer</FormLabel>
								<Select
									{...register("developerId", {
										required: "Developer is required",
									})}
									placeholder="Select developer"
									_focus={{ borderColor: "brand.400" }}
								>
									{developers.map((dev) => (
										<option key={dev._id} value={dev._id}>
											{dev.developer_name}
										</option>
									))}
								</Select>
								<FormErrorMessage>{errors.developerId?.message}</FormErrorMessage>
							</FormControl>
						</ModalBody>

						<ModalFooter
							bg={footerBg}
							borderTop="1px solid"
							borderColor={borderColor}
							position="sticky"
							bottom="0"
							zIndex="10"
							py={3}
							px={5}
							justifyContent="flex-end"
							gap={3}
						>
							<Button
								py="2"
								px="5"
								variant="outline"
								onClick={onClose}
								size="sm"
								borderRadius="md"
							>
								Close
							</Button>
							<Button
								colorScheme="brand"
								type="submit"
								size="sm"
								borderRadius="md"
								isDisabled={isSubmitting}
							>
								{initialData ? "Update" : "Create"}
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ProjectFormModal;
