// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	Button,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Select,
// 	FormErrorMessage,
// 	useColorModeValue,
// 	Flex,
// 	Text,
// } from "@chakra-ui/react";
// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import { buttonStyle } from "utils/btn";
// import { toast } from "react-toastify";
// import Loader from "components/loading/Loader";

// const ProjectFormModal = ({
// 	isOpen,
// 	onClose,
// 	onSubmit,
// 	developers = [],
// 	isSubmitting,
// 	isLoading,
// 	initialData = null,
// 	title = "Create Project",
// }) => {
// 	const {
// 		register,
// 		handleSubmit,
// 		reset,
// 		formState: { errors },
// 	} = useForm({
// 		defaultValues: {
// 			name: "",
// 			developerId: "",
// 		},
// 	});

// 	const headerBg = useColorModeValue("brand.300", "brand.100");
// 	const headerText = useColorModeValue("brand.700", "brand.900");
// 	const footerBg = useColorModeValue("gray.50", "gray.700");
// 	const borderColor = useColorModeValue("gray.200", "gray.600");
// 	const bgColor = useColorModeValue("white", "gray.800");

// 	useEffect(() => {
// 		if (initialData) {
// 			reset({
// 				name: initialData.name || "",
// 				developerId: initialData?.developer?._id || "",
// 			});
// 		} else {
// 			reset({
// 				name: "",
// 				developerId: "",
// 			});
// 		}
// 	}, [initialData, reset]);

// 	const submitForm = async (data) => {
// 		try {
// 			await onSubmit(data);
// 			onClose();
// 		} catch (err) {
// 			toast.error(err?.message || "Failed to submit project");
// 		}
// 	};

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
// 			<ModalOverlay />
// 			<ModalContent
// 				m="2"
// 				borderRadius="2xl"
// 				bg={bgColor}
// 				shadow="2xl"
// 				overflow="hidden"
// 				maxH="85vh"
// 				display="flex"
// 				flexDirection="column"
// 			>
// 				<Flex
// 					align="center"
// 					justify="space-between"
// 					bg={headerBg}
// 					color={headerText}
// 					px={6}
// 					py={3}
// 					borderBottom="1px solid"
// 					borderColor={borderColor}
// 					position="sticky"
// 					top="0"
// 					zIndex="10"
// 				>
// 					<Text fontSize="lg" fontWeight="bold">
// 						{initialData ? "Edit Project" : title}
// 					</Text>
// 					<ModalCloseButton position="static" />
// 				</Flex>

// 				{isLoading ? (
// 					<Loader />
// 				) : (
// 					<form id="project-form" onSubmit={handleSubmit(submitForm)}>
// 						<ModalBody
// 							p={5}
// 							overflowY="auto"
// 							maxH="65vh"
// 							scrollBehavior="smooth"
// 							sx={{
// 								"&::-webkit-scrollbar": { width: "6px" },
// 								"&::-webkit-scrollbar-thumb": {
// 									background: "#c1c1c1",
// 									borderRadius: "10px",
// 								},
// 							}}
// 						>
// 							<FormControl mb={4} isRequired isInvalid={!!errors.name}>
// 								<FormLabel>Project Name</FormLabel>
// 								<Input
// 									_focus={{ borderColor: "brand.400" }}
// 									{...register("name", {
// 										required: "Project name is required",
// 										minLength: {
// 											value: 2,
// 											message: "Minimum 2 characters",
// 										},
// 									})}
// 									placeholder="Enter project name"
// 								/>
// 								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
// 							</FormControl>

// 							<FormControl mb={4} isRequired isInvalid={!!errors.developerId}>
// 								<FormLabel>Select Developer</FormLabel>
// 								<Select
// 									{...register("developerId", {
// 										required: "Developer is required",
// 									})}
// 									placeholder="Select developer"
// 									_focus={{ borderColor: "brand.400" }}
// 								>
// 									{developers.map((dev) => (
// 										<option key={dev._id} value={dev._id}>
// 											{dev.developer_name}
// 										</option>
// 									))}
// 								</Select>
// 								<FormErrorMessage>{errors.developerId?.message}</FormErrorMessage>
// 							</FormControl>
// 						</ModalBody>

// 						<ModalFooter
// 							bg={footerBg}
// 							borderTop="1px solid"
// 							borderColor={borderColor}
// 							position="sticky"
// 							bottom="0"
// 							zIndex="10"
// 							py={3}
// 							px={5}
// 							justifyContent="flex-end"
// 							gap={3}
// 						>
// 							<Button
// 								py="2"
// 								px="5"
// 								variant="outline"
// 								onClick={onClose}
// 								size="sm"
// 								borderRadius="md"
// 							>
// 								Close
// 							</Button>
// 							<Button
// 								colorScheme="brand"
// 								type="submit"
// 								size="sm"
// 								borderRadius="md"
// 								isDisabled={isSubmitting}
// 							>
// 								{initialData ? "Update" : "Create"}
// 							</Button>
// 						</ModalFooter>
// 					</form>
// 				)}
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default ProjectFormModal;

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
	Flex,
	Text,
	Icon,
	VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from 'components/loading/Loader';
import {
	FiFolderPlus,
	FiEdit3,
	FiSave,
	FiX,
	FiHome,
	FiUser,
} from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const ProjectFormModal = ({
	isOpen,
	onClose,
	onSubmit,
	developers = [],
	isSubmitting,
	isLoading,
	initialData = null,
	title = 'Create Project',
}) => {
	const mc = useModalColors();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			developerId: '',
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name || '',
				developerId: initialData?.developer?._id || '',
			});
		} else {
			reset({
				name: '',
				developerId: '',
			});
		}
	}, [initialData, reset]);

	const submitForm = async (data) => {
		try {
			await onSubmit(data);
			onClose();
		} catch (err) {
			toast.error(err?.message || 'Failed to submit project');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='lg'>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				m='2'
				borderRadius='2xl'
				bg={mc.bg}
				boxShadow={mc.modalShadow}
				border='1px solid'
				borderColor={mc.borderColor}
				overflow='hidden'
				maxH='85vh'
				display='flex'
				flexDirection='column'
			>
				{/* Header — Gold Gradient */}
				<Flex
					align='center'
					background={mc.headerBg}
					color={mc.headerText}
					px={6}
					py={4}
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					position='sticky'
					top='0'
					zIndex='10'
				>
					<Icon as={initialData ? FiEdit3 : FiFolderPlus} boxSize={5} mr={3} />
					<Text fontSize='lg' color='inherit' fontWeight='bold'>
						{initialData ? 'Edit Project' : title}
					</Text>
					<ModalCloseButton
						position='absolute'
						right='14px'
						top='14px'
						bg={mc.closeBtnBg}
						color={mc.closeBtnColor}
						borderRadius='full'
						_hover={{ bg: mc.closeBtnHoverBg }}
						_focus={{ boxShadow: 'none' }}
					/>
				</Flex>

				{isLoading ? (
					<Flex align='center' justify='center' py={20}>
						<Loader />
					</Flex>
				) : (
					<form id='project-form' onSubmit={handleSubmit(submitForm)}>
						<ModalBody
							p={6}
							overflowY='auto'
							maxH='65vh'
							scrollBehavior='smooth'
							sx={{
								'&::-webkit-scrollbar': {
									width: '6px',
								},
								'&::-webkit-scrollbar-track': {
									background: mc.bgDeep,
									borderRadius: '3px',
								},
								'&::-webkit-scrollbar-thumb': {
									background: mc.borderColor,
									borderRadius: '3px',
									_hover: { background: mc.borderFocus },
								},
							}}
						>
							<VStack spacing={5} align='stretch'>
								{/* Project Name */}
								<FormControl isRequired isInvalid={!!errors.name}>
									<FormLabel fontWeight='semibold' color={mc.labelColor}>
										<Icon as={FiHome} mr={1} />
										Project Name
									</FormLabel>
									<Input
										{...register('name', {
											required: 'Project name is required',
											minLength: {
												value: 2,
												message: 'Minimum 2 characters',
											},
										})}
										placeholder='Enter project name'
										bg={mc.bgInput}
										borderColor={errors.name ? 'red.300' : mc.borderColor}
										color={mc.headingText}
										_hover={{
											borderColor: errors.name ? 'red.300' : mc.borderFocus,
										}}
										_focus={{
											borderColor: errors.name ? 'red.300' : mc.borderFocus,
											boxShadow: `0 0 0 1px ${errors.name ? 'red.300' : mc.borderFocus}`,
										}}
										_placeholder={{ color: mc.mutedText }}
										borderRadius='md'
									/>
									<FormErrorMessage color='red.300'>
										{errors.name?.message}
									</FormErrorMessage>
								</FormControl>

								{/* Select Developer */}
								<FormControl isRequired isInvalid={!!errors.developerId}>
									<FormLabel fontWeight='semibold' color={mc.labelColor}>
										<Icon as={FiUser} mr={1} />
										Select Developer
									</FormLabel>
									<Select
										{...register('developerId', {
											required: 'Developer is required',
										})}
										placeholder='Select developer'
										bg={mc.bgInput}
										borderColor={
											errors.developerId ? 'red.300' : mc.borderColor
										}
										color={mc.headingText}
										_hover={{
											borderColor: errors.developerId
												? 'red.300'
												: mc.borderFocus,
										}}
										_focus={{
											borderColor: errors.developerId
												? 'red.300'
												: mc.borderFocus,
											boxShadow: `0 0 0 1px ${errors.developerId ? 'red.300' : mc.borderFocus}`,
										}}
										borderRadius='md'
										iconColor={mc.labelColor}
									>
										{developers.map((dev) => (
											<option key={dev._id} value={dev._id}>
												{dev.developer_name}
											</option>
										))}
									</Select>
									<FormErrorMessage color='red.300'>
										{errors.developerId?.message}
									</FormErrorMessage>
								</FormControl>
							</VStack>
						</ModalBody>

						{/* Footer — Navy with gold accent */}
						<ModalFooter
							bg={mc.footerBg}
							borderTop='2px solid'
							borderColor={mc.headerBg}
							position='sticky'
							bottom='0'
							zIndex='10'
							py={4}
							px={6}
							gap={3}
						>
							<Button
								variant='ghost'
								onClick={onClose}
								size='sm'
								borderRadius='md'
								color={mc.secondaryBtnText}
								_hover={{
									bg: mc.secondaryBtnHoverBg,
									color: mc.secondaryBtnHoverText,
								}}
								leftIcon={<FiX />}
							>
								Close
							</Button>
							<Button
								type='submit'
								size='sm'
								borderRadius='md'
								isDisabled={isSubmitting}
								background={mc.primaryBtnBg}
								color={mc.primaryBtnText}
								fontWeight='bold'
								px={6}
								_hover={{
									background: mc.primaryBtnHoverBg,
									boxShadow: mc.primaryBtnShadow,
									transform: 'translateY(-1px)',
								}}
								_active={{
									background: mc.primaryBtnActiveBg,
									transform: 'translateY(0)',
								}}
								_disabled={{
									opacity: 0.5,
									cursor: 'not-allowed',
									transform: 'none',
									boxShadow: 'none',
								}}
								leftIcon={initialData ? <FiSave /> : <FiFolderPlus />}
								isLoading={isSubmitting}
								loadingText={initialData ? 'Updating...' : 'Creating...'}
							>
								{initialData ? 'Update' : 'Create'}
							</Button>
						</ModalFooter>
					</form>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ProjectFormModal;
