import React, { useState, useRef } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Button,
	Grid,
	GridItem,
	IconButton,
	Text,
	Flex,
	Box,
	Stack,
	Center,
	Avatar,
	Badge,
	useDisclosure,
	useColorModeValue,
	ModalCloseButton,
	Icon,
} from '@chakra-ui/react';
import { CloseIcon, AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import Spinner from 'components/spinner/Spinner';
import { useCreateItemMutation } from 'api/apiSlice';
import { useUserActivityLog } from 'hooks/useUserActivityLog';
import { useModalColors } from 'hooks/useModalColors';
import {
	FiEdit3,
	FiImage,
	FiMail,
	FiPhone,
	FiPlus,
	FiSave,
	FiUploadCloud,
	FiUserPlus,
	FiUsers,
} from 'react-icons/fi';
import { BsFillBuildingFill } from 'react-icons/bs';

const userSchema = Yup.object().shape({
	trn: Yup.string().required('TRN is required'),
	developer_name: Yup.string().required('Developer Name is required'),
	email: Yup.string()
		.email('Invalid email format')
		.required('Email is required'),
	address: Yup.string()
		.required('Address is required')
		.min(5, 'Address must be at least 5 characters'),
	country: Yup.string().required('Country is required'),
	phoneNumber: Yup.string().required('Phone Number is required'),
});

const contactSchema = Yup.object().shape({
	name: Yup.string().required('Name is required'),
	role: Yup.string().required('Role is required'),
	phoneNumber: Yup.string().required('Phone number is required'),
	email: Yup.string().email('Invalid email format').optional(),
});

const AddUser = ({
	isOpen,
	onClose,
	setAction,
	fetchData,
	pageIndex,
	pageSize,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewImage, setPreviewImage] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [editingContactIndex, setEditingContactIndex] = useState(null);
	const [createItemMutation, { isLoading: mutationLoading }] =
		useCreateItemMutation();
	const { createUserLog } = useUserActivityLog();

	const {
		isOpen: isContactModalOpen,
		onOpen: onContactModalOpen,
		onClose: onContactModalClose,
	} = useDisclosure();
	const fileInputRef = useRef(null);

	const bgColor = useColorModeValue('gray.50', 'gray.700');
	const headerBg = useColorModeValue('brand.300', 'brand.100');
	const headerText = useColorModeValue('brand.700', 'brand.900');
	const footerBg = useColorModeValue('gray.50', 'gray.700');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: 'image/*',
		maxFiles: 1,
		onDrop: (acceptedFiles) => handleFileChange(acceptedFiles[0]),
	});
	const mc = useModalColors();

	const user = JSON.parse(localStorage.getItem('user')) || {};

	const formik = useFormik({
		initialValues: {
			trn: '',
			developer_name: '',
			address: '',
			email: '',
			country: '',
			phoneNumber: '',
		},
		validationSchema: userSchema,
		onSubmit: (values) => AddData(values),
	});

	const contactFormik = useFormik({
		initialValues: { name: '', role: '', phoneNumber: '', email: '' },
		validationSchema: contactSchema,
		onSubmit: (values, { resetForm }) => {
			if (editingContactIndex !== null) {
				const updated = [...contacts];
				updated[editingContactIndex] = values;
				setContacts(updated);
			} else {
				setContacts([...contacts, values]);
			}
			resetForm();
			setEditingContactIndex(null);
			onContactModalClose();
		},
	});

	const handleFileChange = (file) => {
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onloadend = () => setPreviewImage(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setSelectedFile(null);
		setPreviewImage(null);
	};

	const AddData = async (values) => {
		const invalidContacts = contacts.some(
			(c) => !c.name || !c.role || !c.phoneNumber,
		);
		if (invalidContacts)
			return toast.error('Please complete all contact details');

		const formData = new FormData();
		Object.entries(values).forEach(([key, val]) => formData.append(key, val));
		if (contacts.length > 0)
			formData.append('contactDetails', JSON.stringify(contacts));
		if (selectedFile) formData.append('image', selectedFile);

		try {
			setIsLoading(true);
			const response = await createItemMutation({
				path: '/developer/add',
				body: formData,
			}).unwrap();
			createUserLog({
				userId: user?._id,
				action: 'CREATE',
				entity: 'Developer',
				entityId: response.data._id,
				status: 'success',
				message: `${user?.fullName} created developer "${response?.data?.developer_name}".`,
			});

			toast.success('Developer added successfully');
			fetchData({ pageIndex, pageSize });
			setAction((prev) => !prev);
			resetState();
		} catch (e) {
			toast.error(e?.data?.message || 'Failed to create developer');
		} finally {
			setIsLoading(false);
		}
	};

	const resetState = () => {
		formik.resetForm();
		removeImage();
		setContacts([]);
		onClose();
	};

	const handleAddContact = () => {
		contactFormik.resetForm();
		setEditingContactIndex(null);
		onContactModalOpen();
	};

	const handleEditContact = (index) => {
		contactFormik.setValues(contacts[index]);
		setEditingContactIndex(index);
		onContactModalOpen();
	};

	const handleRemoveContact = (index) =>
		setContacts(contacts.filter((_, i) => i !== index));

	return (
		// <>
		// 	<Modal
		// 		isOpen={isOpen}
		// 		onClose={resetState}
		// 		size='3xl'
		// 		isCentered
		// 		scrollBehavior='inside'
		// 		motionPreset='slideInBottom'
		// 	>
		// 		<ModalOverlay />
		// 		<ModalContent borderRadius='2xl' shadow='xl' overflow='hidden'>
		// 			<ModalHeader
		// 				// p={0}
		// 				borderBottom='1px solid'
		// 				borderColor={borderColor}
		// 				bg={headerBg}
		// 				color={headerText}
		// 				px={6}
		// 				py={3}
		// 				fontWeight='bold'
		// 				fontSize='lg'
		// 				display='flex'
		// 				alignItems='center'
		// 				justifyContent='space-between'
		// 			>
		// 				Add Developer
		// 				<ModalCloseButton
		// 					position='absolute'
		// 					right='12px'
		// 					top='10px'
		// 					color={headerText}
		// 					_hover={{ bg: 'whiteAlpha.200' }}
		// 				/>
		// 			</ModalHeader>

		// 			<form onSubmit={formik.handleSubmit}>
		// 				<ModalBody
		// 					p={5}
		// 					overflowY='auto'
		// 					maxH='65vh'
		// 					borderBottom='1px solid'
		// 					borderColor={borderColor}
		// 				>
		// 					<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
		// 						<GridItem colSpan={2}>
		// 							<FormLabel>Developer Image</FormLabel>
		// 							<Flex
		// 								{...getRootProps()}
		// 								direction='column'
		// 								align='center'
		// 								justify='center'
		// 								p={6}
		// 								border='2px dashed'
		// 								borderColor={isDragActive ? 'brand.500' : borderColor}
		// 								borderRadius='md'
		// 								cursor='pointer'
		// 							>
		// 								<input {...getInputProps()} ref={fileInputRef} />
		// 								{previewImage ? (
		// 									<>
		// 										<Avatar size='xl' src={previewImage} mb={2} />
		// 										<Button
		// 											size='sm'
		// 											variant='outline'
		// 											onClick={(e) => {
		// 												e.stopPropagation();
		// 												removeImage();
		// 											}}
		// 										>
		// 											Remove
		// 										</Button>
		// 									</>
		// 								) : (
		// 									<Center flexDirection='column'>
		// 										<Text mb={2} color='brand.600'>
		// 											{isDragActive
		// 												? 'Drop image here'
		// 												: 'Drag & drop or click to select'}
		// 										</Text>
		// 										<Button size='sm' variant='outline'>
		// 											Select Image
		// 										</Button>
		// 									</Center>
		// 								)}
		// 							</Flex>
		// 						</GridItem>

		// 						{[
		// 							'trn',
		// 							'developer_name',
		// 							'phoneNumber',
		// 							'email',
		// 							'country',
		// 							'address',
		// 						].map((field) => (
		// 							<GridItem key={field} colSpan={field === 'address' ? 2 : 1}>
		// 								<FormLabel textTransform='capitalize'>
		// 									{field.replace('_', ' ')}
		// 								</FormLabel>
		// 								<Input
		// 									name={field}
		// 									value={formik.values[field]}
		// 									onChange={formik.handleChange}
		// 									onBlur={formik.handleBlur}
		// 									placeholder={field.replace('_', ' ')}
		// 									borderColor={
		// 										formik.errors[field] && formik.touched[field]
		// 											? 'red.300'
		// 											: borderColor
		// 									}
		// 									focusBorderColor='brand.500'
		// 								/>
		// 								{formik.errors[field] && formik.touched[field] && (
		// 									<Text color='red.500' fontSize='sm'>
		// 										{formik.errors[field]}
		// 									</Text>
		// 								)}
		// 							</GridItem>
		// 						))}

		// 						<GridItem colSpan={2}>
		// 							<Flex justify='space-between' align='center' mb={2}>
		// 								<FormLabel>Contact Details</FormLabel>
		// 								<Button
		// 									leftIcon={<AddIcon />}
		// 									size='sm'
		// 									variant='outline'
		// 									onClick={handleAddContact}
		// 									borderRadius={'md'}
		// 								>
		// 									Add Contact
		// 								</Button>
		// 							</Flex>

		// 							{contacts.length === 0 ? (
		// 								<Box
		// 									p={4}
		// 									borderWidth='1px'
		// 									borderRadius='md'
		// 									borderColor={borderColor}
		// 									textAlign='center'
		// 								>
		// 									<Text color='gray.500'>No contacts added yet</Text>
		// 								</Box>
		// 							) : (
		// 								<Stack spacing={3}>
		// 									{contacts.map((contact, i) => (
		// 										<Box
		// 											key={i}
		// 											p={4}
		// 											borderWidth='1px'
		// 											borderRadius='md'
		// 											borderColor={borderColor}
		// 										>
		// 											<Flex justify='space-between' align='center'>
		// 												<Box>
		// 													<Flex align='center' mb={1}>
		// 														<Text fontWeight='bold' mr={2}>
		// 															{contact.name}
		// 														</Text>
		// 														<Badge colorScheme='brand'>
		// 															{contact.role}
		// 														</Badge>
		// 													</Flex>
		// 													<Text fontSize='sm'>{contact.phoneNumber}</Text>
		// 													{contact.email && (
		// 														<Text fontSize='sm'>{contact.email}</Text>
		// 													)}
		// 												</Box>
		// 												<Flex>
		// 													<IconButton
		// 														icon={<EditIcon />}
		// 														size='sm'
		// 														variant='ghost'
		// 														onClick={() => handleEditContact(i)}
		// 														mr={1}
		// 													/>
		// 													<IconButton
		// 														icon={<DeleteIcon />}
		// 														size='sm'
		// 														variant='ghost'
		// 														colorScheme='red'
		// 														onClick={() => handleRemoveContact(i)}
		// 													/>
		// 												</Flex>
		// 											</Flex>
		// 										</Box>
		// 									))}
		// 								</Stack>
		// 							)}
		// 						</GridItem>
		// 					</Grid>
		// 				</ModalBody>

		// 				<ModalFooter
		// 					position='sticky'
		// 					bottom='0'
		// 					bg={footerBg}
		// 					borderTop='1px solid'
		// 					borderColor={borderColor}
		// 					py={3}
		// 					px={5}
		// 					justifyContent='flex-end'
		// 					gap={3}
		// 				>
		// 					<Button
		// 						onClick={resetState}
		// 						variant='outline'
		// 						size='sm'
		// 						borderRadius={'md'}
		// 					>
		// 						Cancel
		// 					</Button>
		// 					<Button
		// 						type='submit'
		// 						colorScheme='brand'
		// 						size='sm'
		// 						disabled={isLoading || mutationLoading}
		// 						borderRadius={'md'}
		// 					>
		// 						{isLoading || mutationLoading ? <Spinner /> : 'Save'}
		// 					</Button>
		// 				</ModalFooter>
		// 			</form>
		// 		</ModalContent>
		// 	</Modal>

		// 	{/* Contact Modal */}
		// 	<Modal
		// 		isOpen={isContactModalOpen}
		// 		onClose={onContactModalClose}
		// 		size='md'
		// 		isCentered
		// 	>
		// 		<ModalOverlay />
		// 		<ModalContent borderRadius='2xl' overflow='hidden'>
		// 			<ModalHeader
		// 				borderBottom='1px solid'
		// 				borderColor={borderColor}
		// 				bg={headerBg}
		// 				color={headerText}
		// 				px={6}
		// 				py={3}
		// 				fontWeight='bold'
		// 				display='flex'
		// 				justifyContent='space-between'
		// 				alignItems='center'
		// 			>
		// 				{editingContactIndex !== null ? 'Edit Contact' : 'Add Contact'}
		// 				<ModalCloseButton
		// 					position='absolute'
		// 					right='12px'
		// 					top='10px'
		// 					color={headerText}
		// 					_hover={{ bg: 'whiteAlpha.200' }}
		// 				/>
		// 			</ModalHeader>

		// 			<ModalBody p={5}>
		// 				<form onSubmit={contactFormik.handleSubmit}>
		// 					<Stack spacing={4}>
		// 						{['name', 'role', 'phoneNumber', 'email'].map((f) => (
		// 							<FormControl key={f}>
		// 								<FormLabel textTransform='capitalize'>{f}</FormLabel>
		// 								<Input
		// 									name={f}
		// 									type={f === 'email' ? 'email' : 'text'}
		// 									value={contactFormik.values[f]}
		// 									onChange={contactFormik.handleChange}
		// 									onBlur={contactFormik.handleBlur}
		// 									placeholder={`Enter ${f}`}
		// 									borderColor={
		// 										contactFormik.errors[f] && contactFormik.touched[f]
		// 											? 'red.300'
		// 											: borderColor
		// 									}
		// 									focusBorderColor='brand.500'
		// 								/>
		// 								{contactFormik.errors[f] && contactFormik.touched[f] && (
		// 									<Text color='red.500' fontSize='sm'>
		// 										{contactFormik.errors[f]}
		// 									</Text>
		// 								)}
		// 							</FormControl>
		// 						))}
		// 					</Stack>
		// 				</form>
		// 			</ModalBody>

		// 			<ModalFooter
		// 				bg={footerBg}
		// 				borderTop='1px solid'
		// 				borderColor={borderColor}
		// 				py={3}
		// 				px={5}
		// 				justifyContent='flex-end'
		// 				gap={3}
		// 			>
		// 				<Button
		// 					onClick={onContactModalClose}
		// 					variant='outline'
		// 					size='sm'
		// 					borderRadius={'md'}
		// 				>
		// 					Cancel
		// 				</Button>
		// 				<Button
		// 					colorScheme='brand'
		// 					size='sm'
		// 					onClick={() => contactFormik.handleSubmit()}
		// 					borderRadius={'md'}
		// 				>
		// 					{editingContactIndex !== null ? 'Update' : 'Add'}
		// 				</Button>
		// 			</ModalFooter>
		// 		</ModalContent>
		// 	</Modal>
		// </>
		<>
			{/* Main Developer Modal */}
			<Modal
				isOpen={isOpen}
				onClose={resetState}
				size='3xl'
				isCentered
				scrollBehavior='inside'
				motionPreset='slideInBottom'
			>
				<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
				<ModalContent
					borderRadius='2xl'
					boxShadow={mc.modalShadow}
					bg={mc.bg}
					border='1px solid'
					borderColor={mc.borderColor}
					overflow='hidden'
				>
					{/* Header — Gold Gradient */}
					<ModalHeader
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						fontWeight='bold'
						fontSize='lg'
						display='flex'
						alignItems='center'
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					>
						<Icon as={BsFillBuildingFill} boxSize={5} mr={3} />
						Add Developer
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
							<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={5}>
								{/* Image Upload */}
								<GridItem colSpan={2}>
									<FormLabel fontWeight='semibold' color={mc.labelColor}>
										<Icon as={FiImage} mr={1} />
										Developer Image
									</FormLabel>
									<Flex
										{...getRootProps()}
										direction='column'
										align='center'
										justify='center'
										p={6}
										border='2px dashed'
										borderColor={isDragActive ? mc.borderFocus : mc.borderColor}
										borderRadius='xl'
										cursor='pointer'
										bg={mc.bgDeep}
										transition='all 0.2s'
										_hover={{
											borderColor: mc.borderFocus,
											bg: 'rgba(212, 175, 55, 0.03)',
										}}
									>
										<input {...getInputProps()} ref={fileInputRef} />
										{previewImage ? (
											<>
												<Avatar size='xl' src={previewImage} mb={2} />
												<Button
													size='sm'
													variant='ghost'
													onClick={(e) => {
														e.stopPropagation();
														removeImage();
													}}
													color='red.400'
													_hover={{ bg: 'rgba(238, 93, 80, 0.1)' }}
												>
													Remove
												</Button>
											</>
										) : (
											<Center flexDirection='column'>
												<Icon
													as={FiUploadCloud}
													boxSize={10}
													color={mc.labelColor}
													mb={3}
												/>
												<Text mb={2} color={mc.bodyText} fontWeight='medium'>
													{isDragActive
														? 'Drop image here'
														: 'Drag & drop or click to select'}
												</Text>
												<Button
													size='sm'
													variant='outline'
													borderColor={mc.borderFocus}
													color={mc.borderFocus}
													_hover={{ bg: 'rgba(212, 175, 55, 0.08)' }}
												>
													Select Image
												</Button>
											</Center>
										)}
									</Flex>
								</GridItem>

								{/* Form Fields */}
								{[
									'trn',
									'developer_name',
									'phoneNumber',
									'email',
									'country',
									'address',
								].map((field) => (
									<GridItem key={field} colSpan={field === 'address' ? 2 : 1}>
										<FormLabel
											textTransform='capitalize'
											fontWeight='semibold'
											color={mc.labelColor}
										>
											{field.replace('_', ' ')}
										</FormLabel>
										<Input
											name={field}
											value={formik.values[field]}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											placeholder={field.replace('_', ' ')}
											bg={mc.bgInput}
											borderColor={
												formik.errors[field] && formik.touched[field]
													? 'red.300'
													: mc.borderColor
											}
											color={mc.headingText}
											_hover={{
												borderColor:
													formik.errors[field] && formik.touched[field]
														? 'red.300'
														: mc.borderFocus,
											}}
											_focus={{
												borderColor:
													formik.errors[field] && formik.touched[field]
														? 'red.300'
														: mc.borderFocus,
												boxShadow: `0 0 0 1px ${mc.borderFocus}`,
											}}
											_placeholder={{ color: mc.mutedText }}
											borderRadius='md'
										/>
										{formik.errors[field] && formik.touched[field] && (
											<Text color='red.300' fontSize='xs' mt={1}>
												{formik.errors[field]}
											</Text>
										)}
									</GridItem>
								))}

								{/* Contact Details Section */}
								<GridItem colSpan={2}>
									<Flex justify='space-between' align='center' mb={3}>
										<FormLabel
											fontWeight='semibold'
											color={mc.labelColor}
											mb={0}
										>
											<Icon as={FiUsers} mr={1} />
											Contact Details
										</FormLabel>
										<Button
											leftIcon={<AddIcon />}
											size='sm'
											variant='outline'
											onClick={handleAddContact}
											borderRadius='md'
											borderColor={mc.borderFocus}
											color={mc.borderFocus}
											_hover={{ bg: 'rgba(212, 175, 55, 0.08)' }}
										>
											Add Contact
										</Button>
									</Flex>

									{contacts.length === 0 ? (
										<Box
											p={6}
											borderWidth='1px'
											borderRadius='xl'
											borderColor={mc.borderColor}
											bg={mc.bgDeep}
											textAlign='center'
										>
											<Icon
												as={FiUserPlus}
												boxSize={8}
												color={mc.labelColor}
												mb={2}
											/>
											<Text color={mc.mutedText} fontSize='sm'>
												No contacts added yet
											</Text>
											<Text color={mc.mutedText} fontSize='xs' mt={1}>
												Click "Add Contact" to add a new contact person
											</Text>
										</Box>
									) : (
										<Stack spacing={3}>
											{contacts.map((contact, i) => (
												<Box
													key={i}
													p={4}
													borderWidth='1px'
													borderRadius='xl'
													borderColor={mc.borderColor}
													bg={mc.bgDeep}
													transition='all 0.2s'
													_hover={{
														borderColor: 'rgba(212, 175, 55, 0.3)',
														boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
													}}
												>
													<Flex justify='space-between' align='center'>
														<Box>
															<Flex align='center' mb={1}>
																<Text
																	fontWeight='bold'
																	mr={2}
																	color={mc.headingText}
																>
																	{contact.name}
																</Text>
																<Badge variant='gold'>{contact.role}</Badge>
															</Flex>
															<Flex align='center' gap={1} mb={0.5}>
																<Icon
																	as={FiPhone}
																	boxSize={3}
																	color={mc.labelColor}
																/>
																<Text fontSize='sm' color={mc.bodyText}>
																	{contact.phoneNumber}
																</Text>
															</Flex>
															{contact.email && (
																<Flex align='center' gap={1}>
																	<Icon
																		as={FiMail}
																		boxSize={3}
																		color={mc.labelColor}
																	/>
																	<Text fontSize='sm' color={mc.bodyText}>
																		{contact.email}
																	</Text>
																</Flex>
															)}
														</Box>
														<Flex>
															<IconButton
																icon={<EditIcon />}
																size='sm'
																variant='ghost'
																onClick={() => handleEditContact(i)}
																mr={1}
																color={mc.bodyText}
																_hover={{
																	bg: mc.secondaryBtnHoverBg,
																	color: mc.borderFocus,
																}}
																aria-label='Edit contact'
															/>
															<IconButton
																icon={<DeleteIcon />}
																size='sm'
																variant='ghost'
																onClick={() => handleRemoveContact(i)}
																color='red.400'
																_hover={{
																	bg: 'rgba(238, 93, 80, 0.1)',
																	color: 'red.300',
																}}
																aria-label='Delete contact'
															/>
														</Flex>
													</Flex>
												</Box>
											))}
										</Stack>
									)}
								</GridItem>
							</Grid>
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
								onClick={resetState}
								variant='ghost'
								size='sm'
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
								size='sm'
								disabled={isLoading || mutationLoading}
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
								_disabled={{
									opacity: 0.5,
									cursor: 'not-allowed',
									transform: 'none',
									boxShadow: 'none',
								}}
								leftIcon={
									isLoading || mutationLoading ? (
										<Spinner size='xs' />
									) : (
										<FiSave />
									)
								}
								isLoading={isLoading || mutationLoading}
								loadingText='Saving...'
							>
								Save
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>

			{/* Contact Modal */}
			<Modal
				isOpen={isContactModalOpen}
				onClose={onContactModalClose}
				size='md'
				isCentered
			>
				<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
				<ModalContent
					borderRadius='2xl'
					boxShadow={mc.modalShadow}
					bg={mc.bg}
					border='1px solid'
					borderColor={mc.borderColor}
					overflow='hidden'
				>
					{/* Contact Modal Header — Gold Gradient */}
					<ModalHeader
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						fontWeight='bold'
						display='flex'
						alignItems='center'
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					>
						<Icon
							as={editingContactIndex !== null ? FiEdit3 : FiUserPlus}
							boxSize={5}
							mr={3}
						/>
						{editingContactIndex !== null ? 'Edit Contact' : 'Add Contact'}
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
					</ModalHeader>

					<ModalBody p={6}>
						<form onSubmit={contactFormik.handleSubmit}>
							<Stack spacing={4}>
								{['name', 'role', 'phoneNumber', 'email'].map((f) => (
									<FormControl key={f}>
										<FormLabel
											textTransform='capitalize'
											fontWeight='semibold'
											color={mc.labelColor}
										>
											{f === 'phoneNumber' ? 'Phone Number' : f}
										</FormLabel>
										<Input
											name={f}
											type={f === 'email' ? 'email' : 'text'}
											value={contactFormik.values[f]}
											onChange={contactFormik.handleChange}
											onBlur={contactFormik.handleBlur}
											placeholder={`Enter ${f}`}
											bg={mc.bgInput}
											borderColor={
												contactFormik.errors[f] && contactFormik.touched[f]
													? 'red.300'
													: mc.borderColor
											}
											color={mc.headingText}
											_hover={{ borderColor: mc.borderFocus }}
											_focus={{
												borderColor: mc.borderFocus,
												boxShadow: `0 0 0 1px ${mc.borderFocus}`,
											}}
											_placeholder={{ color: mc.mutedText }}
											borderRadius='md'
										/>
										{contactFormik.errors[f] && contactFormik.touched[f] && (
											<Text color='red.300' fontSize='xs' mt={1}>
												{contactFormik.errors[f]}
											</Text>
										)}
									</FormControl>
								))}
							</Stack>
						</form>
					</ModalBody>

					{/* Contact Modal Footer — Navy with gold accent */}
					<ModalFooter
						bg={mc.footerBg}
						borderTop='2px solid'
						borderColor={mc.headerBg}
						py={4}
						px={6}
						gap={3}
					>
						<Button
							onClick={onContactModalClose}
							variant='ghost'
							size='sm'
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
							size='sm'
							onClick={() => contactFormik.handleSubmit()}
							borderRadius='md'
							background={mc.primaryBtnBg}
							color={mc.primaryBtnText}
							fontWeight='bold'
							_hover={{
								background: mc.primaryBtnHoverBg,
								boxShadow: mc.primaryBtnShadow,
								transform: 'translateY(-1px)',
							}}
							_active={{
								background: mc.primaryBtnActiveBg,
								transform: 'translateY(0)',
							}}
							leftIcon={editingContactIndex !== null ? <FiSave /> : <FiPlus />}
						>
							{editingContactIndex !== null ? 'Update' : 'Add'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddUser;
