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
	Select,
	Input,
	Textarea,
	Button,
	Text,
	VStack,
	useColorModeValue,
	Flex,
	Icon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useModalColors } from 'hooks/useModalColors';
import { paymentOptions } from '../helpers';
import { FiEdit3, FiPlus, FiPlusCircle, FiSave } from 'react-icons/fi';

// ----------------------
// Validation Schema
// ----------------------
const expenseSchema = yup.object().shape({
	paymentMethod: yup.string().required('Please select a payment method'),
	amount: yup
		.number()
		.typeError('Please enter a valid number')
		.positive('Amount must be positive')
		.required('Amount is required'),
	description: yup.string().max(300, 'Description too long').optional(),
	agency: yup.string().optional(),
});

// ----------------------
// Component
// ----------------------
// const UpsertIncomingBalance = ({
// 	isOpen,
// 	onClose,
// 	initialData = null,
// 	updateData,
// 	isAgenciesAllowed,
// 	selectedMonth,
// 	selectedYear,
// }) => {
// 	const isEditMode = Boolean(initialData);

// 	const { headerBg, headerText } = useModalColors();

// 	// Colors
// 	const borderColor = useColorModeValue('gray.200', 'gray.600');
// 	const focusColor = useColorModeValue('brand.500', 'brand.300');

// 	// Redux agencies list
// 	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

// 	// API mutations
// 	const [create, { isLoading: creating }] = useCreateItemMutation();
// 	const [update, { isLoading: updating }] = useUpdateItemMutation();

// 	// Form
// 	const {
// 		register,
// 		handleSubmit,
// 		reset,
// 		watch,
// 		formState: { errors, isDirty, isValid },
// 	} = useForm({
// 		mode: 'onChange',
// 		resolver: yupResolver(expenseSchema),
// 		defaultValues: {
// 			paymentMethod: initialData?.paymentMethod || '',
// 			amount: initialData?.amount || '',
// 			description: initialData?.description || '',
// 			agency: initialData?.agency?._id || '',
// 		},
// 	});

// 	const descriptionLength = watch('description')?.length || 0;

// 	// Submit Handler
// 	const submitHandler = async (data) => {
// 		try {
// 			const payload = {
// 				paymentMethod: data.paymentMethod || 'cash',
// 				amount: parseFloat(data.amount),
// 				description: data.description?.trim() || '',
// 				agency: data?.agency || null,
// 				month: selectedMonth,
// 				year: selectedYear,
// 			};

// 			const res = isEditMode
// 				? await update({
// 						path: `finance/cash/incoming/${initialData._id}`,
// 						body: payload,
// 					}).unwrap()
// 				: await create({
// 						path: 'finance/cash/incoming',
// 						body: payload,
// 					}).unwrap();

// 			toast.success(
// 				`Balance ${isEditMode ? 'updated' : 'created'} successfully`
// 			);
// 			updateData(res?.doc?._id, res?.doc, isEditMode ? 'update' : 'add');
// 			reset();
// 			onClose();
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to save balance');
// 		}
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
// 			<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />
// 			<ModalContent mx='2' borderRadius='2xl' boxShadow='2xl'>
// 				<ModalHeader
// 					display='flex'
// 					gap='3'
// 					bg={headerBg}
// 					color={headerText}
// 					borderTopRadius='2xl'
// 					py={4}
// 					alignItems='center'
// 					borderBottom='1px'
// 					borderColor={borderColor}
// 				>
// 					{isEditMode ? 'Edit Balance' : 'Add New Balance'}
// 				</ModalHeader>

// 				<ModalCloseButton isDisabled={creating || updating} />

// 				<ModalBody py={6}>
// 					<VStack spacing={6} align='stretch'>
// 						{/* Payment Method */}
// 						<FormControl isInvalid={!!errors.paymentMethod} isRequired>
// 							<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
// 								Payment Method
// 							</FormLabel>
// 							<Input
// 								type='text'
// 								list='payment-methods'
// 								placeholder='Enter or select payment method...'
// 								focusBorderColor={focusColor}
// 								borderColor={borderColor}
// 								bg='white'
// 								{...register('paymentMethod')}
// 							/>
// 							{/* Using for suggestions */}
// 							<datalist id='payment-methods'>
// 								{paymentOptions.map((item, i) => (
// 									<option key={i} value={item} />
// 								))}
// 							</datalist>

// 							{errors.paymentMethod && (
// 								<Text color='red.500' fontSize='sm' mt={1}>
// 									{errors.paymentMethod.message}
// 								</Text>
// 							)}
// 						</FormControl>

// 						{/* Amount */}
// 						<FormControl isInvalid={!!errors.amount} isRequired>
// 							<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
// 								Amount
// 							</FormLabel>
// 							<Input
// 								type='number'
// 								step='0.01'
// 								min='0'
// 								focusBorderColor={focusColor}
// 								borderColor={borderColor}
// 								placeholder='0.00'
// 								{...register('amount')}
// 							/>
// 							{errors.amount && (
// 								<Text color='red.500' fontSize='sm' mt={1}>
// 									{errors.amount.message}
// 								</Text>
// 							)}
// 						</FormControl>

// 						{/* Agency */}
// 						{isAgenciesAllowed && (
// 							<FormControl>
// 								<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
// 									Agency
// 								</FormLabel>
// 								<Select
// 									placeholder='Select agency...'
// 									focusBorderColor={focusColor}
// 									borderColor={borderColor}
// 									{...register('agency')}
// 								>
// 									{agencies?.map((a) => (
// 										<option key={a._id} value={a._id}>
// 											{a.name}
// 										</option>
// 									))}
// 								</Select>
// 							</FormControl>
// 						)}

// 						{/* Description */}
// 						<FormControl isInvalid={!!errors.description}>
// 							<FormLabel
// 								display='flex'
// 								alignItems='center'
// 								gap={2}
// 								color='gray.700'
// 								fontWeight='600'
// 								fontSize='sm'
// 							>
// 								{/* <Icon as={FiFileText} boxSize={4} /> */}
// 								Description
// 							</FormLabel>
// 							<Textarea
// 								placeholder='Write balance details...'
// 								resize='vertical'
// 								minH='100px'
// 								focusBorderColor={focusColor}
// 								borderColor={borderColor}
// 								bg='white'
// 								{...register('description')}
// 							/>
// 							<Flex justify='space-between' mt={2}>
// 								<Text
// 									fontSize='xs'
// 									color={descriptionLength > 250 ? 'orange.500' : 'gray.500'}
// 								>
// 									{descriptionLength}/300
// 								</Text>
// 							</Flex>
// 							{errors.description && (
// 								<Text mt={2} fontSize='sm' color='red.500'>
// 									{errors.description.message}
// 								</Text>
// 							)}
// 						</FormControl>
// 					</VStack>
// 				</ModalBody>

// 				<ModalFooter gap={3} borderTop='1px' borderColor={borderColor} py={4}>
// 					<Button
// 						variant='outline'
// 						onClick={handleClose}
// 						size='md'
// 						rounded='md'
// 						isDisabled={creating || updating}
// 					>
// 						Cancel
// 					</Button>

// 					<Button
// 						size='md'
// 						rounded='md'
// 						colorScheme='brand'
// 						isLoading={creating || updating}
// 						onClick={handleSubmit(submitHandler)}
// 						isDisabled={!isValid || (!isDirty && isEditMode)}
// 					>
// 						{isEditMode ? 'Update' : 'Create'}
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

const UpsertIncomingBalance = ({
	isOpen,
	onClose,
	initialData = null,
	updateData,
	isAgenciesAllowed,
	selectedMonth,
	selectedYear,
}) => {
	const isEditMode = Boolean(initialData);
	const mc = useModalColors();

	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isDirty, isValid },
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(expenseSchema),
		defaultValues: {
			paymentMethod: initialData?.paymentMethod || '',
			amount: initialData?.amount || '',
			description: initialData?.description || '',
			agency: initialData?.agency?._id || '',
		},
	});

	const descriptionLength = watch('description')?.length || 0;

	const submitHandler = async (data) => {
		try {
			const payload = {
				paymentMethod: data.paymentMethod || 'cash',
				amount: parseFloat(data.amount),
				description: data.description?.trim() || '',
				agency: data?.agency || null,
				month: selectedMonth,
				year: selectedYear,
			};

			const res = isEditMode
				? await update({
						path: `finance/cash/incoming/${initialData._id}`,
						body: payload,
					}).unwrap()
				: await create({
						path: 'finance/cash/incoming',
						body: payload,
					}).unwrap();

			toast.success(
				`Balance ${isEditMode ? 'updated' : 'created'} successfully`,
			);
			updateData(res?.doc?._id, res?.doc, isEditMode ? 'update' : 'add');
			reset();
			onClose();
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to save balance');
		}
	};

	const handleClose = () => {
		reset();
		onClose();
	};

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
						{isEditMode ? 'Edit Balance' : 'Add New Balance'}
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
					isDisabled={creating || updating}
				/>

				<ModalBody py={6} px={6}>
					<VStack spacing={5} align='stretch'>
						{/* Payment Method */}
						<FormControl isInvalid={!!errors.paymentMethod} isRequired>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								Payment Method
							</FormLabel>
							<Input
								type='text'
								list='payment-methods'
								placeholder='Enter or select payment method...'
								bg={mc.bgInput}
								borderColor={errors.paymentMethod ? 'red.300' : mc.borderColor}
								color={mc.headingText}
								_hover={{
									borderColor: errors.paymentMethod
										? 'red.300'
										: mc.borderFocus,
								}}
								_focus={{
									borderColor: errors.paymentMethod
										? 'red.300'
										: mc.borderFocus,
									boxShadow: `0 0 0 1px ${
										errors.paymentMethod ? 'red.300' : mc.borderFocus
									}`,
								}}
								_placeholder={{ color: mc.mutedText }}
								borderRadius='md'
								{...register('paymentMethod')}
							/>
							<datalist id='payment-methods'>
								{paymentOptions.map((item, i) => (
									<option key={i} value={item} />
								))}
							</datalist>
							{errors.paymentMethod && (
								<Text color='red.300' fontSize='xs' mt={1}>
									{errors.paymentMethod.message}
								</Text>
							)}
						</FormControl>

						{/* Amount */}
						<FormControl isInvalid={!!errors.amount} isRequired>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
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

						{/* Agency (optional) */}
						{isAgenciesAllowed && (
							<FormControl>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									Agency
								</FormLabel>
								<Select
									placeholder='Select agency...'
									bg={mc.bgInput}
									borderColor={mc.borderColor}
									color={mc.headingText}
									_hover={{ borderColor: mc.borderFocus }}
									_focus={{
										borderColor: mc.borderFocus,
										boxShadow: `0 0 0 1px ${mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
									{...register('agency')}
								>
									{agencies?.map((a) => (
										<option key={a._id} value={a._id}>
											{a.name}
										</option>
									))}
								</Select>
							</FormControl>
						)}

						{/* Description */}
						<FormControl isInvalid={!!errors.description}>
							<FormLabel
								display='flex'
								alignItems='center'
								gap={2}
								fontWeight='semibold'
								color={mc.labelColor}
							>
								Description
							</FormLabel>
							<Textarea
								placeholder='Write balance details...'
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
						isDisabled={creating || updating}
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
						isLoading={creating || updating}
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

export default UpsertIncomingBalance;
