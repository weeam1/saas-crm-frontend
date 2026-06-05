// // import {
// // 	Modal,
// // 	ModalOverlay,
// // 	ModalContent,
// // 	ModalHeader,
// // 	ModalCloseButton,
// // 	ModalBody,
// // 	ModalFooter,
// // 	FormControl,
// // 	FormLabel,
// // 	Select,
// // 	Input,
// // 	Textarea,
// // 	Button,
// // 	Text,
// // 	VStack,
// // 	useColorModeValue,
// // 	Flex,
// // } from '@chakra-ui/react';
// // import { useForm } from 'react-hook-form';
// // import { yupResolver } from '@hookform/resolvers/yup';
// // import * as yup from 'yup';
// // import { useSelector } from 'react-redux';
// // import {
// // 	useCreateItemMutation,
// // 	useFetchItemsQuery,
// // 	useUpdateItemMutation,
// // } from 'api/apiSlice';
// // import { toast } from 'react-toastify';
// // import { useModalColors } from 'hooks/useModalColors';
// // import SearchUsers from 'views/admin/whatsapp-v2/WhatsappSettings/SearchUsers';
// // import { loanTypes } from '../helpers';

// // const loanSchema = yup.object().shape({
// // 	user: yup.string().required('Employee is required'),
// // 	type: yup
// // 		.string()
// // 		.min(1, 'Minimum loan type 2 characters')
// // 		.max(30, 'Maximum loan type 30 characters')
// // 		.required('Loan type is required'),
// // 	tenure: yup
// // 		.number()
// // 		.typeError('Tenure must be a number')
// // 		.min(1, 'Minimum tenure is 1 month')
// // 		.max(60, 'Maximum tenure is 60 months')
// // 		.required('Tenure is required'),
// // 	amount: yup
// // 		.number()
// // 		.typeError('Amount must be a number')
// // 		.positive('Amount must be greater than zero')
// // 		.required('Amount is required'),
// // 	description: yup
// // 		.string()
// // 		.max(300, 'Description cannot exceed 300 characters')
// // 		.required('Description is required'),
// // });

// // const UpsertLoan = ({
// // 	isOpen,
// // 	onClose,
// // 	initialData = null,
// // 	refetchSummary = null,
// // 	updateData = null,
// // 	isEmployeeLoans = false,
// // }) => {
// // 	const isEditMode = Boolean(initialData?.type);

// // 	const { headerBg, headerText } = useModalColors();

// // 	const { data: usersData, isLoading: usersLoading } = useFetchItemsQuery({
// // 		path: '/v2/user/search_users',
// // 	});

// // 	// Colors
// // 	const borderColor = useColorModeValue('gray.200', 'gray.600');
// // 	const focusColor = useColorModeValue('brand.500', 'brand.300');

// // 	// API mutations
// // 	const [create, { isLoading: creating }] = useCreateItemMutation();
// // 	const [update, { isLoading: updating }] = useUpdateItemMutation();

// // 	// Form setup
// // 	const {
// // 		register,
// // 		handleSubmit,
// // 		reset,
// // 		watch,
// // 		setValue,
// // 		formState: { errors, isDirty, isValid },
// // 	} = useForm({
// // 		mode: 'onChange',
// // 		resolver: yupResolver(loanSchema),
// // 		defaultValues: {
// // 			user: initialData?.user?._id || initialData?.user || '',
// // 			type: initialData?.type || '',
// // 			tenure: initialData?.tenure || '',
// // 			amount: initialData?.amount || '',
// // 			description: initialData?.description || '',
// // 			agency: initialData?.agency?._id || '',
// // 		},
// // 	});

// // 	const descriptionLength = watch('description')?.length || 0;

// // 	// Submit handler
// // 	const submitHandler = async (data) => {
// // 		try {
// // 			const payload = {
// // 				user: data?.user,
// // 				type: data.type,
// // 				amount: parseFloat(data.amount),
// // 				tenure: parseInt(data.tenure),
// // 				description: data.description.trim(),
// // 			};

// // 			const res = isEditMode
// // 				? await update({
// // 						path: `finance/loans/${initialData._id}`,
// // 						body: payload,
// // 					}).unwrap()
// // 				: await create({
// // 						path: 'finance/loans',
// // 						body: payload,
// // 					}).unwrap();

// // 			toast.success(`Loan ${isEditMode ? 'updated' : 'created'} successfully`);

// // 			if (refetchSummary) {
// // 				refetchSummary();
// // 			} else updateData(res?.doc?._id, res?.doc, isEditMode ? 'update' : 'add');

// // 			reset();
// // 			onClose();
// // 		} catch (error) {
// // 			console.log({ error });
// // 			toast.error(error?.data?.errors?.[0]?.msg || 'Failed to save loan');
// // 		}
// // 	};

// // 	const handleSelectUser = (user) => {
// // 		setValue('user', user?._id || null, {
// // 			shouldValidate: true,
// // 			shouldDirty: true,
// // 		});
// // 	};

// // 	const handleClose = () => {
// // 		reset();
// // 		onClose();
// // 	};

// // 	return (
// // 		<Modal
// // 			isOpen={isOpen}
// // 			onClose={handleClose}
// // 			isCentered
// // 			size='xl'
// // 			closeOnOverlayClick={false}
// // 			// closeOnOverlayClick={!creating && !updating}
// // 			scrollBehavior='inside'
// // 		>
// // 			<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />
// // 			<ModalContent mx='2' borderRadius='2xl' boxShadow='2xl'>
// // 				<ModalHeader
// // 					display='flex'
// // 					gap='3'
// // 					bg={headerBg}
// // 					color={headerText}
// // 					borderTopRadius='2xl'
// // 					py={4}
// // 					alignItems='center'
// // 					borderBottom='1px'
// // 					borderColor={borderColor}
// // 				>
// // 					{isEditMode ? 'Edit Loan' : 'Add New Loan'}
// // 				</ModalHeader>

// // 				<ModalCloseButton isDisabled={creating || updating} />

// // 				<ModalBody py={6}>
// // 					<VStack spacing={6} align='stretch'>
// // 						{/* Search Users */}
// // 						{isEmployeeLoans && (
// // 							<FormControl isInvalid={!!errors.user} isRequired>
// // 								<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
// // 									Select Employee
// // 								</FormLabel>
// // 								<SearchUsers
// // 									selectedUserId={
// // 										isEditMode ? (initialData?.user?._id ?? null) : null
// // 									}
// // 									users={usersData?.doc || []}
// // 									onSelectUser={handleSelectUser}
// // 								/>
// // 								{errors.user && (
// // 									<Text color='red.500' fontSize='sm' mt={1}>
// // 										{errors.user?.message}
// // 									</Text>
// // 								)}
// // 							</FormControl>
// // 						)}

// // 						{/* Loan Type */}
// // 						<FormControl isInvalid={!!errors.type} isRequired>
// // 							<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
// // 								Loan Type
// // 							</FormLabel>
// // 							<Input
// // 								type='text'
// // 								list='laon-types'
// // 								placeholder='e.g. Car Loan'
// // 								focusBorderColor={focusColor}
// // 								borderColor={borderColor}
// // 								bg='white'
// // 								{...register('type')}
// // 							/>

// // 							{/* Using for suggestions */}
// // 							<datalist id='laon-types'>
// // 								{loanTypes.map((item, i) => (
// // 									<option key={i} value={item} />
// // 								))}
// // 							</datalist>

// // 							{errors.type && (
// // 								<Text color='red.500' fontSize='sm' mt={1}>
// // 									{errors.type.message}
// // 								</Text>
// // 							)}
// // 						</FormControl>

// // 						{/* Tenure */}
// // 						<FormControl isInvalid={!!errors.tenure} isRequired>
// // 							<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
// // 								Installments (Months)
// // 							</FormLabel>
// // 							<Input
// // 								type='number'
// // 								min='1'
// // 								placeholder='Enter loan tenure...'
// // 								focusBorderColor={focusColor}
// // 								borderColor={borderColor}
// // 								bg='white'
// // 								{...register('tenure')}
// // 							/>
// // 							{errors.tenure && (
// // 								<Text color='red.500' fontSize='sm' mt={1}>
// // 									{errors.tenure.message}
// // 								</Text>
// // 							)}
// // 						</FormControl>

// // 						{/* Amount */}
// // 						<FormControl isInvalid={!!errors.amount} isRequired>
// // 							<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
// // 								Amount
// // 							</FormLabel>
// // 							<Input
// // 								type='number'
// // 								step='0.01'
// // 								min='0'
// // 								focusBorderColor={focusColor}
// // 								borderColor={borderColor}
// // 								placeholder='0.00'
// // 								{...register('amount')}
// // 							/>
// // 							{errors.amount && (
// // 								<Text color='red.500' fontSize='sm' mt={1}>
// // 									{errors.amount.message}
// // 								</Text>
// // 							)}
// // 						</FormControl>

// // 						{/* Description */}
// // 						<FormControl isInvalid={!!errors.description} isRequired>
// // 							<FormLabel
// // 								display='flex'
// // 								alignItems='center'
// // 								gap={2}
// // 								color='gray.700'
// // 								fontWeight='600'
// // 								fontSize='sm'
// // 							>
// // 								Description
// // 							</FormLabel>
// // 							<Textarea
// // 								placeholder='Write loan details...'
// // 								resize='vertical'
// // 								minH='100px'
// // 								focusBorderColor={focusColor}
// // 								borderColor={borderColor}
// // 								bg='white'
// // 								{...register('description')}
// // 							/>
// // 							<Flex justify='space-between' mt={2}>
// // 								<Text
// // 									fontSize='xs'
// // 									color={descriptionLength > 250 ? 'orange.500' : 'gray.500'}
// // 								>
// // 									{descriptionLength}/300
// // 								</Text>
// // 							</Flex>
// // 							{errors.description && (
// // 								<Text mt={2} fontSize='sm' color='red.500'>
// // 									{errors.description.message}
// // 								</Text>
// // 							)}
// // 						</FormControl>
// // 					</VStack>
// // 				</ModalBody>

// // 				<ModalFooter gap={3} borderTop='1px' borderColor={borderColor} py={4}>
// // 					<Button
// // 						variant='outline'
// // 						onClick={handleClose}
// // 						size='md'
// // 						rounded='md'
// // 						isDisabled={creating || updating}
// // 					>
// // 						Cancel
// // 					</Button>

// // 					<Button
// // 						size='md'
// // 						rounded='md'
// // 						colorScheme='brand'
// // 						isLoading={creating || updating}
// // 						onClick={handleSubmit(submitHandler)}
// // 						isDisabled={!isValid || (!isDirty && isEditMode)}
// // 					>
// // 						{isEditMode ? 'Update' : 'Create'}
// // 					</Button>
// // 				</ModalFooter>
// // 			</ModalContent>
// // 		</Modal>
// // 	);
// // };

// // export default UpsertLoan;

// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	FormControl,
// 	FormLabel,
// 	Select,
// 	Input,
// 	Textarea,
// 	Button,
// 	Text,
// 	VStack,
// 	Flex,
// 	Icon,
// } from '@chakra-ui/react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { useSelector } from 'react-redux';
// import {
// 	useCreateItemMutation,
// 	useFetchItemsQuery,
// 	useUpdateItemMutation,
// } from 'api/apiSlice';
// import { toast } from 'react-toastify';
// import { useModalColors } from 'hooks/useModalColors';
// import SearchUsers from 'views/admin/whatsapp-v2/WhatsappSettings/SearchUsers';
// import { loanTypes } from '../helpers';
// import {
// 	FiDollarSign,
// 	FiFileText,
// 	FiUser,
// 	FiType,
// 	FiClock,
// 	FiPlusCircle,
// 	FiEdit3,
// 	FiSave,
// 	FiPlus,
// } from 'react-icons/fi';

// const loanSchema = yup.object().shape({
// 	user: yup.string().required('Employee is required'),
// 	type: yup
// 		.string()
// 		.min(1, 'Minimum loan type 2 characters')
// 		.max(30, 'Maximum loan type 30 characters')
// 		.required('Loan type is required'),
// 	tenure: yup
// 		.number()
// 		.typeError('Tenure must be a number')
// 		.min(1, 'Minimum tenure is 1 month')
// 		.max(60, 'Maximum tenure is 60 months')
// 		.required('Tenure is required'),
// 	amount: yup
// 		.number()
// 		.typeError('Amount must be a number')
// 		.positive('Amount must be greater than zero')
// 		.required('Amount is required'),
// 	description: yup
// 		.string()
// 		.max(300, 'Description cannot exceed 300 characters')
// 		.required('Description is required'),
// });

// const UpsertLoan = ({
// 	isOpen,
// 	onClose,
// 	initialData = null,
// 	refetchSummary = null,
// 	updateData = null,
// 	isEmployeeLoans = false,
// }) => {
// 	const isEditMode = Boolean(initialData?.type);
// 	const mc = useModalColors();

// 	const { data: usersData, isLoading: usersLoading } = useFetchItemsQuery({
// 		path: '/v2/user/search_users',
// 	});

// 	// API mutations
// 	const [create, { isLoading: creating }] = useCreateItemMutation();
// 	const [update, { isLoading: updating }] = useUpdateItemMutation();

// 	// Form setup
// 	const {
// 		register,
// 		handleSubmit,
// 		reset,
// 		watch,
// 		setValue,
// 		formState: { errors, isDirty, isValid },
// 	} = useForm({
// 		mode: 'onChange',
// 		resolver: yupResolver(loanSchema),
// 		defaultValues: {
// 			user: initialData?.user?._id || initialData?.user || '',
// 			type: initialData?.type || '',
// 			tenure: initialData?.tenure || '',
// 			amount: initialData?.amount || '',
// 			description: initialData?.description || '',
// 			agency: initialData?.agency?._id || '',
// 		},
// 	});

// 	const descriptionLength = watch('description')?.length || 0;

// 	// Submit handler
// 	const submitHandler = async (data) => {
// 		try {
// 			const payload = {
// 				user: data?.user,
// 				type: data.type,
// 				amount: parseFloat(data.amount),
// 				tenure: parseInt(data.tenure),
// 				description: data.description.trim(),
// 			};

// 			const res = isEditMode
// 				? await update({
// 						path: `finance/loans/${initialData._id}`,
// 						body: payload,
// 					}).unwrap()
// 				: await create({
// 						path: 'finance/loans',
// 						body: payload,
// 					}).unwrap();

// 			toast.success(`Loan ${isEditMode ? 'updated' : 'created'} successfully`);

// 			if (refetchSummary) {
// 				refetchSummary();
// 			} else updateData(res?.doc?._id, res?.doc, isEditMode ? 'update' : 'add');

// 			reset();
// 			onClose();
// 		} catch (error) {
// 			console.log({ error });
// 			toast.error(error?.data?.errors?.[0]?.msg || 'Failed to save loan');
// 		}
// 	};

// 	const handleSelectUser = (user) => {
// 		setValue('user', user?._id || null, {
// 			shouldValidate: true,
// 			shouldDirty: true,
// 		});
// 	};

// 	const handleClose = () => {
// 		reset();
// 		onClose();
// 	};

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={handleClose}
// 			isCentered
// 			size='xl'
// 			closeOnOverlayClick={false}
// 			scrollBehavior='inside'
// 		>
// 			<ModalOverlay backdropFilter='blur(4px)' bg={mc.overlayBg} />
// 			<ModalContent
// 				mx='2'
// 				borderRadius='2xl'
// 				boxShadow={mc.modalShadow}
// 				bg={mc.bg}
// 				border='1px solid'
// 				borderColor={mc.borderColor}
// 				overflow='hidden'
// 			>
// 				{/* Header — Gold Gradient */}
// 				<ModalHeader
// 					display='flex'
// 					gap='3'
// 					background={mc.headerBg}
// 					color={mc.headerText}
// 					borderTopRadius='2xl'
// 					py={4}
// 					px={6}
// 					alignItems='center'
// 					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
// 				>
// 					<Icon as={isEditMode ? FiEdit3 : FiPlusCircle} boxSize={5} />
// 					<Text fontSize='lg' color='inherit' fontWeight='bold'>
// 						{isEditMode ? 'Edit Loan' : 'Add New Loan'}
// 					</Text>
// 				</ModalHeader>

// 				<ModalCloseButton
// 					top='14px'
// 					right='14px'
// 					bg={mc.closeBtnBg}
// 					color={mc.closeBtnColor}
// 					borderRadius='full'
// 					_hover={{ bg: mc.closeBtnHoverBg }}
// 					_focus={{ boxShadow: 'none' }}
// 					isDisabled={creating || updating}
// 				/>

// 				<ModalBody py={6} px={6}>
// 					<VStack spacing={5} align='stretch'>
// 						{/* Select Employee */}
// 						{isEmployeeLoans && (
// 							<FormControl isInvalid={!!errors.user} isRequired>
// 								<FormLabel fontWeight='semibold' color={mc.labelColor}>
// 									<Icon as={FiUser} mr={1} />
// 									Select Employee
// 								</FormLabel>
// 								<SearchUsers
// 									selectedUserId={
// 										isEditMode ? (initialData?.user?._id ?? null) : null
// 									}
// 									users={usersData?.doc || []}
// 									onSelectUser={handleSelectUser}
// 								/>
// 								{errors.user && (
// 									<Text color='red.300' fontSize='xs' mt={1}>
// 										{errors.user?.message}
// 									</Text>
// 								)}
// 							</FormControl>
// 						)}

// 						{/* Loan Type */}
// 						<FormControl isInvalid={!!errors.type} isRequired>
// 							<FormLabel fontWeight='semibold' color={mc.labelColor}>
// 								<Icon as={FiType} mr={1} />
// 								Loan Type
// 							</FormLabel>
// 							<Input
// 								type='text'
// 								list='loan-types'
// 								placeholder='e.g. Car Loan'
// 								bg={mc.bgInput}
// 								borderColor={errors.type ? 'red.300' : mc.borderColor}
// 								color={mc.headingText}
// 								_hover={{
// 									borderColor: errors.type ? 'red.300' : mc.borderFocus,
// 								}}
// 								_focus={{
// 									borderColor: errors.type ? 'red.300' : mc.borderFocus,
// 									boxShadow: `0 0 0 1px ${errors.type ? 'red.300' : mc.borderFocus}`,
// 								}}
// 								_placeholder={{ color: mc.mutedText }}
// 								borderRadius='md'
// 								{...register('type')}
// 							/>
// 							<datalist id='loan-types'>
// 								{loanTypes.map((item, i) => (
// 									<option key={i} value={item} />
// 								))}
// 							</datalist>
// 							{errors.type && (
// 								<Text color='red.300' fontSize='xs' mt={1}>
// 									{errors.type.message}
// 								</Text>
// 							)}
// 						</FormControl>

// 						{/* Tenure */}
// 						<FormControl isInvalid={!!errors.tenure} isRequired>
// 							<FormLabel fontWeight='semibold' color={mc.labelColor}>
// 								<Icon as={FiClock} mr={1} />
// 								Installments (Months)
// 							</FormLabel>
// 							<Input
// 								type='number'
// 								min='1'
// 								placeholder='Enter loan tenure...'
// 								bg={mc.bgInput}
// 								borderColor={errors.tenure ? 'red.300' : mc.borderColor}
// 								color={mc.headingText}
// 								_hover={{
// 									borderColor: errors.tenure ? 'red.300' : mc.borderFocus,
// 								}}
// 								_focus={{
// 									borderColor: errors.tenure ? 'red.300' : mc.borderFocus,
// 									boxShadow: `0 0 0 1px ${errors.tenure ? 'red.300' : mc.borderFocus}`,
// 								}}
// 								_placeholder={{ color: mc.mutedText }}
// 								borderRadius='md'
// 								{...register('tenure')}
// 							/>
// 							{errors.tenure && (
// 								<Text color='red.300' fontSize='xs' mt={1}>
// 									{errors.tenure.message}
// 								</Text>
// 							)}
// 						</FormControl>

// 						{/* Amount */}
// 						<FormControl isInvalid={!!errors.amount} isRequired>
// 							<FormLabel fontWeight='semibold' color={mc.labelColor}>
// 								<Icon as={FiDollarSign} mr={1} />
// 								Amount
// 							</FormLabel>
// 							<Input
// 								type='number'
// 								step='0.01'
// 								min='0'
// 								placeholder='0.00'
// 								bg={mc.bgInput}
// 								borderColor={errors.amount ? 'red.300' : mc.borderColor}
// 								color={mc.headingText}
// 								_hover={{
// 									borderColor: errors.amount ? 'red.300' : mc.borderFocus,
// 								}}
// 								_focus={{
// 									borderColor: errors.amount ? 'red.300' : mc.borderFocus,
// 									boxShadow: `0 0 0 1px ${errors.amount ? 'red.300' : mc.borderFocus}`,
// 								}}
// 								_placeholder={{ color: mc.mutedText }}
// 								borderRadius='md'
// 								{...register('amount')}
// 							/>
// 							{errors.amount && (
// 								<Text color='red.300' fontSize='xs' mt={1}>
// 									{errors.amount.message}
// 								</Text>
// 							)}
// 						</FormControl>

// 						{/* Description */}
// 						<FormControl isInvalid={!!errors.description} isRequired>
// 							<FormLabel fontWeight='semibold' color={mc.labelColor}>
// 								<Icon as={FiFileText} mr={1} />
// 								Description
// 							</FormLabel>
// 							<Textarea
// 								placeholder='Write loan details...'
// 								resize='vertical'
// 								minH='100px'
// 								bg={mc.bgInput}
// 								borderColor={errors.description ? 'red.300' : mc.borderColor}
// 								color={mc.headingText}
// 								_hover={{
// 									borderColor: errors.description ? 'red.300' : mc.borderFocus,
// 								}}
// 								_focus={{
// 									borderColor: errors.description ? 'red.300' : mc.borderFocus,
// 									boxShadow: `0 0 0 1px ${errors.description ? 'red.300' : mc.borderFocus}`,
// 								}}
// 								_placeholder={{ color: mc.mutedText }}
// 								borderRadius='md'
// 								{...register('description')}
// 							/>
// 							<Flex justify='space-between' mt={2}>
// 								<Text
// 									fontSize='xs'
// 									color={descriptionLength > 250 ? 'orange.400' : mc.mutedText}
// 								>
// 									{descriptionLength}/300
// 								</Text>
// 							</Flex>
// 							{errors.description && (
// 								<Text mt={2} fontSize='xs' color='red.300'>
// 									{errors.description.message}
// 								</Text>
// 							)}
// 						</FormControl>
// 					</VStack>
// 				</ModalBody>

// 				{/* Footer — Navy with gold accent */}
// 				<ModalFooter
// 					bg={mc.footerBg}
// 					borderTop='2px solid'
// 					borderColor={mc.headerBg}
// 					py={4}
// 					px={6}
// 					gap={3}
// 				>
// 					<Button
// 						variant='ghost'
// 						onClick={handleClose}
// 						size='md'
// 						borderRadius='md'
// 						isDisabled={creating || updating}
// 						color={mc.secondaryBtnText}
// 						_hover={{
// 							bg: mc.secondaryBtnHoverBg,
// 							color: mc.secondaryBtnHoverText,
// 						}}
// 					>
// 						Cancel
// 					</Button>

// 					<Button
// 						size='md'
// 						borderRadius='md'
// 						isLoading={creating || updating}
// 						onClick={handleSubmit(submitHandler)}
// 						isDisabled={!isValid || (!isDirty && isEditMode)}
// 						background={mc.primaryBtnBg}
// 						color={mc.primaryBtnText}
// 						fontWeight='bold'
// 						px={6}
// 						_hover={{
// 							background: mc.primaryBtnHoverBg,
// 							boxShadow: mc.primaryBtnShadow,
// 							transform: 'translateY(-1px)',
// 						}}
// 						_active={{
// 							background: mc.primaryBtnActiveBg,
// 							transform: 'translateY(0)',
// 						}}
// 						_disabled={{
// 							opacity: 0.5,
// 							cursor: 'not-allowed',
// 							transform: 'none',
// 							boxShadow: 'none',
// 						}}
// 						leftIcon={isEditMode ? <FiSave /> : <FiPlus />}
// 						loadingText={isEditMode ? 'Updating...' : 'Creating...'}
// 					>
// 						{isEditMode ? 'Update' : 'Create'}
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default UpsertLoan;

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
	Textarea,
	Button,
	Text,
	VStack,
	Flex,
	Icon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
	useCreateItemMutation,
	useFetchItemsQuery,
	useUpdateItemMutation,
} from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useModalColors } from 'hooks/useModalColors';
import SearchUsers from 'views/admin/whatsapp-v2/WhatsappSettings/SearchUsers';
import { loanTypes } from '../helpers';
import {
	FiDollarSign,
	FiFileText,
	FiUser,
	FiType,
	FiClock,
	FiPlusCircle,
	FiEdit3,
	FiSave,
	FiPlus,
} from 'react-icons/fi';

const loanSchema = yup.object().shape({
	user: yup.string().required('Employee is required'),
	type: yup
		.string()
		.min(1, 'Minimum loan type 2 characters')
		.max(30, 'Maximum loan type 30 characters')
		.required('Loan type is required'),
	tenure: yup
		.number()
		.typeError('Tenure must be a number')
		.min(1, 'Minimum tenure is 1 month')
		.max(60, 'Maximum tenure is 60 months')
		.required('Tenure is required'),
	amount: yup
		.number()
		.typeError('Amount must be a number')
		.positive('Amount must be greater than zero')
		.required('Amount is required'),
	description: yup
		.string()
		.max(300, 'Description cannot exceed 300 characters')
		.required('Description is required'),
});

const UpsertLoan = ({
	isOpen,
	onClose,
	initialData = null,
	refetchSummary = null,
	updateData = null,
	isEmployeeLoans = false,
}) => {
	const isEditMode = Boolean(initialData?.type);
	const mc = useModalColors();

	const { data: usersData, isLoading: usersLoading } = useFetchItemsQuery({
		path: '/v2/user/search_users',
	});

	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors, isDirty, isValid },
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(loanSchema),
		defaultValues: {
			user: initialData?.user?._id || initialData?.user || '',
			type: initialData?.type || '',
			tenure: initialData?.tenure || '',
			amount: initialData?.amount || '',
			description: initialData?.description || '',
		},
	});

	const descriptionLength = watch('description')?.length || 0;

	const submitHandler = async (data) => {
		try {
			const payload = {
				user: data?.user,
				type: data.type,
				amount: parseFloat(data.amount),
				tenure: parseInt(data.tenure),
				description: data.description.trim(),
			};

			const res = isEditMode
				? await update({
						path: `finance/loans/${initialData._id}`,
						body: payload,
					}).unwrap()
				: await create({
						path: 'finance/loans',
						body: payload,
					}).unwrap();

			toast.success(`Loan ${isEditMode ? 'updated' : 'created'} successfully`);

			if (refetchSummary) {
				refetchSummary();
			} else if (updateData) {
				updateData(res?.doc?._id, res?.doc, isEditMode ? 'update' : 'add');
			}

			reset();
			onClose();
		} catch (error) {
			console.error(error);
			toast.error(error?.data?.errors?.[0]?.msg || 'Failed to save loan');
		}
	};

	const handleSelectUser = (user) => {
		setValue('user', user?._id || null, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const isLoading = creating || updating;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			isCentered
			size='xl'
			closeOnOverlayClick={false}
			scrollBehavior='inside'
		>
			<ModalOverlay backdropFilter='blur(4px)' bg={mc.overlayBg} />
			<ModalContent
				mx='2'
				borderRadius='2xl'
				boxShadow={mc.modalShadow}
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
				overflow='hidden'
			>
				{/* Header — Gold Gradient */}
				<ModalHeader
					display='flex'
					gap='3'
					background={mc.headerBg}
					color={mc.headerText}
					borderTopRadius='2xl'
					py={4}
					px={6}
					alignItems='center'
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
				>
					<Icon as={isEditMode ? FiEdit3 : FiPlusCircle} boxSize={5} />
					<Text fontSize='lg' color='inherit' fontWeight='bold'>
						{isEditMode ? 'Edit Loan' : 'Add New Loan'}
					</Text>
				</ModalHeader>

				<ModalCloseButton
					top='14px'
					right='14px'
					bg={mc.closeBtnBg}
					color={mc.closeBtnColor}
					borderRadius='full'
					_hover={{ bg: mc.closeBtnHoverBg }}
					_focus={{ boxShadow: 'none' }}
					isDisabled={isLoading}
				/>

				<ModalBody py={6} px={6}>
					<VStack spacing={5} align='stretch'>
						{/* Select Employee */}
						{isEmployeeLoans && (
							<FormControl isInvalid={!!errors.user} isRequired>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									<Icon as={FiUser} mr={1} />
									Select Employee
								</FormLabel>
								<SearchUsers
									selectedUserId={
										isEditMode ? (initialData?.user?._id ?? null) : null
									}
									users={usersData?.doc || []}
									onSelectUser={handleSelectUser}
								/>
								{errors.user && (
									<Text color='red.300' fontSize='xs' mt={1}>
										{errors.user?.message}
									</Text>
								)}
							</FormControl>
						)}

						{/* Loan Type */}
						<FormControl isInvalid={!!errors.type} isRequired>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								<Icon as={FiType} mr={1} />
								Loan Type
							</FormLabel>
							<Input
								type='text'
								list='loan-types'
								placeholder='e.g. Car Loan'
								bg={mc.bgInput}
								borderColor={errors.type ? 'red.300' : mc.borderColor}
								color={mc.headingText}
								_hover={{
									borderColor: errors.type ? 'red.300' : mc.borderFocus,
								}}
								_focus={{
									borderColor: errors.type ? 'red.300' : mc.borderFocus,
									boxShadow: `0 0 0 1px ${
										errors.type ? 'red.300' : mc.borderFocus
									}`,
								}}
								_placeholder={{ color: mc.mutedText }}
								borderRadius='md'
								{...register('type')}
							/>
							<datalist id='loan-types'>
								{loanTypes.map((item, i) => (
									<option key={i} value={item} />
								))}
							</datalist>
							{errors.type && (
								<Text color='red.300' fontSize='xs' mt={1}>
									{errors.type.message}
								</Text>
							)}
						</FormControl>

						{/* Tenure */}
						<FormControl isInvalid={!!errors.tenure} isRequired>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								<Icon as={FiClock} mr={1} />
								Installments (Months)
							</FormLabel>
							<Input
								type='number'
								min='1'
								placeholder='Enter loan tenure...'
								bg={mc.bgInput}
								borderColor={errors.tenure ? 'red.300' : mc.borderColor}
								color={mc.headingText}
								_hover={{
									borderColor: errors.tenure ? 'red.300' : mc.borderFocus,
								}}
								_focus={{
									borderColor: errors.tenure ? 'red.300' : mc.borderFocus,
									boxShadow: `0 0 0 1px ${
										errors.tenure ? 'red.300' : mc.borderFocus
									}`,
								}}
								_placeholder={{ color: mc.mutedText }}
								borderRadius='md'
								{...register('tenure')}
							/>
							{errors.tenure && (
								<Text color='red.300' fontSize='xs' mt={1}>
									{errors.tenure.message}
								</Text>
							)}
						</FormControl>

						{/* Amount */}
						<FormControl isInvalid={!!errors.amount} isRequired>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								<Icon as={FiDollarSign} mr={1} />
								Amount
							</FormLabel>
							<Input
								type='number'
								step='0.01'
								min='0'
								placeholder='0.00'
								bg={mc.bgInput}
								borderColor={errors.amount ? 'red.300' : mc.borderColor}
								color={mc.headingText}
								_hover={{
									borderColor: errors.amount ? 'red.300' : mc.borderFocus,
								}}
								_focus={{
									borderColor: errors.amount ? 'red.300' : mc.borderFocus,
									boxShadow: `0 0 0 1px ${
										errors.amount ? 'red.300' : mc.borderFocus
									}`,
								}}
								_placeholder={{ color: mc.mutedText }}
								borderRadius='md'
								{...register('amount')}
							/>
							{errors.amount && (
								<Text color='red.300' fontSize='xs' mt={1}>
									{errors.amount.message}
								</Text>
							)}
						</FormControl>

						{/* Description */}
						<FormControl isInvalid={!!errors.description} isRequired>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								<Icon as={FiFileText} mr={1} />
								Description
							</FormLabel>
							<Textarea
								placeholder='Write loan details...'
								resize='vertical'
								minH='100px'
								bg={mc.bgInput}
								borderColor={errors.description ? 'red.300' : mc.borderColor}
								color={mc.headingText}
								_hover={{
									borderColor: errors.description ? 'red.300' : mc.borderFocus,
								}}
								_focus={{
									borderColor: errors.description ? 'red.300' : mc.borderFocus,
									boxShadow: `0 0 0 1px ${
										errors.description ? 'red.300' : mc.borderFocus
									}`,
								}}
								_placeholder={{ color: mc.mutedText }}
								borderRadius='md'
								{...register('description')}
							/>
							<Flex justify='space-between' mt={2}>
								<Text
									fontSize='xs'
									color={descriptionLength > 250 ? 'orange.400' : mc.mutedText}
								>
									{descriptionLength}/300
								</Text>
							</Flex>
							{errors.description && (
								<Text mt={2} fontSize='xs' color='red.300'>
									{errors.description.message}
								</Text>
							)}
						</FormControl>
					</VStack>
				</ModalBody>

				{/* Footer — Navy with gold accent */}
				<ModalFooter
					bg={mc.footerBg}
					borderTop='2px solid'
					borderColor={mc.headerBg}
					py={4}
					px={6}
					gap={3}
				>
					<Button
						variant='ghost'
						onClick={handleClose}
						size='md'
						borderRadius='md'
						isDisabled={isLoading}
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
					>
						Cancel
					</Button>

					<Button
						size='md'
						borderRadius='md'
						isLoading={isLoading}
						onClick={handleSubmit(submitHandler)}
						isDisabled={!isValid || (!isDirty && isEditMode)}
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
						leftIcon={isEditMode ? <FiSave /> : <FiPlus />}
						loadingText={isEditMode ? 'Updating...' : 'Creating...'}
					>
						{isEditMode ? 'Update' : 'Create'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UpsertLoan;
