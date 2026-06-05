import React, { useState } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Select,
	Textarea,
	Button,
	VStack,
	Flex,
	FormErrorMessage,
	useColorModeValue,
	Text,
	Icon,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateItemMutation } from 'api/apiSlice';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import { toast } from 'react-toastify';
import SearchUsers from 'views/admin/whatsapp/WhatsappSettings/SearchUsers';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { FiCalendar, FiCheckSquare, FiPlus, FiUser } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const validationSchema = Yup.object().shape({
	title: Yup.string().required('Title is required'),
	description: Yup.string().required('Description is required'),
	due_date: Yup.date().required('Due date is required'),
	assigned_to: Yup.string().required('Assigned to is required'),
	priority: Yup.string().required('Priority is required'),
	type: Yup.string().required('Type is required'),
});

const AddTaskModal = ({
	isOpen,
	onClose,
	onSuccess,
	users,
	user,
	usersData,
}) => {
	const [createTask] = useCreateItemMutation();
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const { createUserLog } = useUserActivityLog();

	// const bgColor = useColorModeValue('white', 'gray.800');
	// const headerBg = useColorModeValue('brand.300', 'brand.100');
	// const headerText = useColorModeValue('brand.700', 'brand.900');
	// const footerBg = useColorModeValue('gray.50', 'gray.700');
	// const borderColor = useColorModeValue('gray.200', 'gray.600');

	const mc = useModalColors();

	const formik = useFormik({
		initialValues: {
			title: '',
			description: '',
			due_date: null,
			assigned_to: '',
			priority: 'Medium',
			type: 'Custom',
		},
		validationSchema,
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			try {
				const payload = {
					...values,
					assigned_by: user._id,
					created_by: user._id,
					status: 'Pending',
				};

				const response = await createTask({
					path: '/taskV2',
					body: payload,
				}).unwrap();

				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'Task',
					entityType: 'TaskV2',
					entityId: response._id,
					status: 'success',
					message: `${user?.fullName} created task "${response?.title || 'Untitled'}".`,
				});

				toast.success('Task created successfully');
				onSuccess();
				resetForm();
				onClose();
			} catch (error) {
				toast.error(error.data?.message || 'Error creating task');
				const errorMsg =
					error?.data?.message || 'Failed to create task. Please try again.';
				createUserLog({
					userId: user?._id,
					action: 'CREATE',
					entity: 'Task',
					entityType: 'TaskV2',
					status: error?.status === '500' ? 'error' : 'fail',
					message: errorMsg,
				});
			} finally {
				setSubmitting(false);
			}
		},
	});

	const handleClose = () => {
		formik.resetForm();
		onClose();
	};

	const handleSelectUser = (user) => {
		formik.setFieldValue('assigned_to', user?._id || null);
	};
	return (
		// <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
		//   <ModalOverlay />
		//   <ModalContent
		//     bg={bgColor}
		//     borderRadius="2xl"
		//     shadow="2xl"
		//     maxW={{ base: "full", sm: "90vw", md: "600px" }}
		//     overflow="hidden"
		//     mx={{ base: 3, md: 0 }}
		//   >
		//     <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
		//       <Flex
		//         align="center"
		//         bg={headerBg}
		//         color={headerText}
		//         px={6}
		//         py={3}
		//         position="sticky"
		//         top="0"
		//         zIndex="10"
		//         boxShadow="md"
		//       >
		//         <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
		//           Create New Task
		//         </Text>
		//         <ModalCloseButton
		//           position="absolute"
		//           right="12px"
		//           top="10px"
		//           color={headerText}
		//           _hover={{ bg: "whiteAlpha.200" }}
		//         />
		//       </Flex>
		//     </ModalHeader>

		//     <form onSubmit={formik.handleSubmit}>
		//       <ModalBody
		//         p={5}
		//         overflowY="auto"
		//         maxH="65vh"
		//         borderBottom="1px solid"
		//         borderColor={borderColor}
		//       >
		//         <VStack spacing={5} align="stretch">
		//           <FormControl
		//             isInvalid={
		//               formik.errors.assigned_to && formik.touched.assigned_to
		//             }
		//           >
		//             <FormLabel fontWeight="semibold">Assigned To</FormLabel>
		//             <SearchUsers
		//               selectedUserId={formik.values.assigned_to || null}
		//               users={
		//                 user?.roles[0]?.roleName === "Manager"
		//                   ? users
		//                   : usersData?.doc || []
		//               }
		//               onSelectUser={handleSelectUser}
		//             />
		//             <FormErrorMessage>{formik.errors.assigned_to}</FormErrorMessage>
		//           </FormControl>

		//           <FormControl
		//             isInvalid={formik.errors.title && formik.touched.title}
		//           >
		//             <FormLabel fontWeight="semibold">Title</FormLabel>
		//             <Input
		//               name="title"
		//               value={formik.values.title}
		//               onChange={formik.handleChange}
		//               onBlur={formik.handleBlur}
		//               placeholder="Enter task title"
		//               focusBorderColor="brand.500"
		//             />
		//             <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
		//           </FormControl>

		//           <FormControl
		//             isInvalid={
		//               formik.errors.description && formik.touched.description
		//             }
		//           >
		//             <FormLabel fontWeight="semibold">Description</FormLabel>
		//             <Textarea
		//               name="description"
		//               value={formik.values.description}
		//               onChange={formik.handleChange}
		//               onBlur={formik.handleBlur}
		//               placeholder="Enter task description"
		//               focusBorderColor="brand.500"
		//             />
		//             <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
		//           </FormControl>

		//           <Flex gap={4} w="100%" direction={{ base: "column", md: "row" }}>
		//             <FormControl
		//               isInvalid={formik.errors.due_date && formik.touched.due_date}
		//             >
		//               <FormLabel fontWeight="semibold">Due Date</FormLabel>
		//               <CustomDatePicker
		//                 selectedDate={formik.values.due_date}
		//                 handleDateChange={(date) =>
		//                   formik.setFieldValue("due_date", date)
		//                 }
		//                 minDate={new Date()}
		//                 isCalendarOpen={isCalendarOpen}
		//                 toggleCalendar={() => setIsCalendarOpen(!isCalendarOpen)}
		//                 placeholder="Select due date"
		//               />
		//               <FormErrorMessage>{formik.errors.due_date}</FormErrorMessage>
		//             </FormControl>

		//             <FormControl
		//               isInvalid={formik.errors.priority && formik.touched.priority}
		//             >
		//               <FormLabel fontWeight="semibold">Priority</FormLabel>
		//               <Select
		//                 name="priority"
		//                 value={formik.values.priority}
		//                 onChange={formik.handleChange}
		//                 onBlur={formik.handleBlur}
		//                 focusBorderColor="brand.500"
		//               >
		//                 <option value="Low">Low</option>
		//                 <option value="Medium">Medium</option>
		//                 <option value="High">High</option>
		//                 <option value="Urgent">Urgent</option>
		//               </Select>
		//               <FormErrorMessage>{formik.errors.priority}</FormErrorMessage>
		//             </FormControl>
		//           </Flex>

		//           <FormControl
		//             isInvalid={formik.errors.type && formik.touched.type}
		//           >
		//             <FormLabel fontWeight="semibold">Type</FormLabel>
		//             <Select
		//               name="type"
		//               value={formik.values.type}
		//               onChange={formik.handleChange}
		//               onBlur={formik.handleBlur}
		//               focusBorderColor="brand.500"
		//             >
		//               <option value="Follow-up">Follow-up</option>
		//               <option value="Meeting">Meeting</option>
		//               <option value="Site Visit">Site Visit</option>
		//               <option value="Call">Call</option>
		//               <option value="Email">Email</option>
		//               <option value="Document Collection">
		//                 Document Collection
		//               </option>
		//               <option value="Custom">Custom</option>
		//             </Select>
		//             <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
		//           </FormControl>
		//         </VStack>
		//       </ModalBody>

		//       <ModalFooter
		//         position="sticky"
		//         bottom="0"
		//         bg={footerBg}
		//         borderTop="1px solid"
		//         borderColor={borderColor}
		//         py={3}
		//         px={5}
		//         zIndex="10"
		//         justifyContent="flex-end"
		//         gap={3}
		//       >
		//         <Button
		//           variant="outline"
		//           colorScheme="gray"
		//           onClick={handleClose}
		//           borderRadius="md"
		//         >
		//           Cancel
		//         </Button>
		//         <Button
		//           colorScheme="brand"
		//           type="submit"
		//           isLoading={formik.isSubmitting}
		//           borderRadius="md"
		//         >
		//           Create Task
		//         </Button>
		//       </ModalFooter>
		//     </form>
		//   </ModalContent>
		// </Modal>
		<Modal isOpen={isOpen} onClose={handleClose} size='lg' isCentered>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				bg={mc.bg}
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				border='1px solid'
				borderColor={mc.borderColor}
				maxW={{ base: 'full', sm: '90vw', md: '600px' }}
				overflow='hidden'
				mx={{ base: 3, md: 0 }}
			>
				{/* Header — Gold Gradient */}
				<ModalHeader p={0}>
					<Flex
						align='center'
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					>
						<Icon as={FiCheckSquare} boxSize={5} mr={3} />
						<Text
							fontSize={{ base: 'md', md: 'lg' }}
							color='inherit'
							fontWeight='bold'
						>
							Create New Task
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
				</ModalHeader>

				<form onSubmit={formik.handleSubmit}>
					<ModalBody
						p={6}
						overflowY='auto'
						maxH='65vh'
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
							{/* Assigned To */}
							<FormControl
								isInvalid={
									formik.errors.assigned_to && formik.touched.assigned_to
								}
							>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									<Icon as={FiUser} mr={1} />
									Assigned To
								</FormLabel>
								<SearchUsers
									selectedUserId={formik.values.assigned_to || null}
									users={
										user?.roles[0]?.roleName === 'Manager'
											? users
											: usersData?.doc || []
									}
									onSelectUser={handleSelectUser}
								/>
								<FormErrorMessage color='red.300'>
									{formik.errors.assigned_to}
								</FormErrorMessage>
							</FormControl>

							{/* Title */}
							<FormControl
								isInvalid={formik.errors.title && formik.touched.title}
							>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									Title
								</FormLabel>
								<Input
									name='title'
									value={formik.values.title}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder='Enter task title'
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={mc.headingText}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									_placeholder={{ color: mc.mutedText }}
									borderRadius='md'
								/>
								<FormErrorMessage color='red.300'>
									{formik.errors.title}
								</FormErrorMessage>
							</FormControl>

							{/* Description */}
							<FormControl
								isInvalid={
									formik.errors.description && formik.touched.description
								}
							>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									Description
								</FormLabel>
								<Textarea
									name='description'
									value={formik.values.description}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									placeholder='Enter task description'
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={mc.headingText}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									_placeholder={{ color: mc.mutedText }}
									borderRadius='md'
								/>
								<FormErrorMessage color='red.300'>
									{formik.errors.description}
								</FormErrorMessage>
							</FormControl>

							{/* Due Date & Priority Row */}
							<Flex gap={4} w='100%' direction={{ base: 'column', md: 'row' }}>
								<FormControl
									isInvalid={formik.errors.due_date && formik.touched.due_date}
									flex={1}
								>
									<FormLabel fontWeight='semibold' color={mc.labelColor}>
										<Icon as={FiCalendar} mr={1} />
										Due Date
									</FormLabel>
									<CustomDatePicker
										selectedDate={formik.values.due_date}
										handleDateChange={(date) =>
											formik.setFieldValue('due_date', date)
										}
										minDate={new Date()}
										isCalendarOpen={isCalendarOpen}
										toggleCalendar={() => setIsCalendarOpen(!isCalendarOpen)}
										placeholder='Select due date'
									/>
									<FormErrorMessage color='red.300'>
										{formik.errors.due_date}
									</FormErrorMessage>
								</FormControl>

								<FormControl
									isInvalid={formik.errors.priority && formik.touched.priority}
									flex={1}
								>
									<FormLabel fontWeight='semibold' color={mc.labelColor}>
										Priority
									</FormLabel>
									<Select
										name='priority'
										value={formik.values.priority}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										bg={mc.bgInput}
										borderColor={mc.borderColor}
										color={
											formik.values.priority ? mc.headingText : mc.mutedText
										}
										_hover={{ borderColor: mc.borderFocus }}
										_focus={{
											borderColor: mc.borderFocus,
											boxShadow: `0 0 0 1px ${mc.borderFocus}`,
										}}
										borderRadius='md'
										iconColor={mc.labelColor}
									>
										<option value='Low'>Low</option>
										<option value='Medium'>Medium</option>
										<option value='High'>High</option>
										<option value='Urgent'>Urgent</option>
									</Select>
									<FormErrorMessage color='red.300'>
										{formik.errors.priority}
									</FormErrorMessage>
								</FormControl>
							</Flex>

							{/* Type */}
							<FormControl
								isInvalid={formik.errors.type && formik.touched.type}
							>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									Type
								</FormLabel>
								<Select
									name='type'
									value={formik.values.type}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={formik.values.type ? mc.headingText : mc.mutedText}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
								>
									<option value='Follow-up'>Follow-up</option>
									<option value='Meeting'>Meeting</option>
									<option value='Site Visit'>Site Visit</option>
									<option value='Call'>Call</option>
									<option value='Email'>Email</option>
									<option value='Document Collection'>
										Document Collection
									</option>
									<option value='Custom'>Custom</option>
								</Select>
								<FormErrorMessage color='red.300'>
									{formik.errors.type}
								</FormErrorMessage>
							</FormControl>
						</VStack>
					</ModalBody>

					{/* Footer — Navy with gold accent */}
					<ModalFooter
						position='sticky'
						bottom='0'
						bg={mc.footerBg}
						borderTop='2px solid'
						borderColor={mc.headerBg}
						py={4}
						px={6}
						zIndex='10'
						gap={3}
					>
						<Button
							variant='ghost'
							onClick={handleClose}
							borderRadius='md'
							color={mc.secondaryBtnText}
							_hover={{
								bg: mc.secondaryBtnHoverBg,
								color: mc.secondaryBtnHoverText,
							}}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							isLoading={formik.isSubmitting}
							borderRadius='md'
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
							loadingText='Creating...'
							leftIcon={<FiPlus />}
						>
							Create Task
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
};

export default AddTaskModal;
