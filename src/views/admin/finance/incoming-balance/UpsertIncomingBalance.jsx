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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';
import { useModalColors } from 'hooks/useModalColors';
import { paymentOptions } from '../helpers';

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
const UpsertIncomingBalance = ({
	isOpen,
	onClose,
	initialData = null,
	updateData,
	isAgenciesAllowed,
}) => {
	const isEditMode = Boolean(initialData);

	const { headerBg, headerText } = useModalColors();

	// Colors
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const focusColor = useColorModeValue('brand.500', 'brand.300');

	// Redux agencies list
	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

	// API mutations
	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	// Form
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

	// Submit Handler
	const submitHandler = async (data) => {
		try {
			const payload = {
				paymentMethod: data.paymentMethod || 'cash',
				amount: parseFloat(data.amount),
				description: data.description?.trim() || '',
				agency: data?.agency || null,
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
				`Balance ${isEditMode ? 'updated' : 'created'} successfully`
			);
			updateData(res?.doc?._id, res?.doc);
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
			closeOnOverlayClick={!creating && !updating}
			scrollBehavior='inside'
		>
			<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />
			<ModalContent mx='2' borderRadius='2xl' boxShadow='2xl'>
				<ModalHeader
					display='flex'
					gap='3'
					bg={headerBg}
					color={headerText}
					borderTopRadius='2xl'
					py={4}
					alignItems='center'
					borderBottom='1px'
					borderColor={borderColor}
				>
					{isEditMode ? 'Edit Balance' : 'Add New Balance'}
				</ModalHeader>

				<ModalCloseButton isDisabled={creating || updating} />

				<ModalBody py={6}>
					<VStack spacing={6} align='stretch'>
						{/* Payment Method */}
						<FormControl isInvalid={!!errors.paymentMethod} isRequired>
							<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
								Payment Method
							</FormLabel>
							<Input
								type='text'
								list='payment-methods'
								placeholder='Enter or select payment method...'
								focusBorderColor={focusColor}
								borderColor={borderColor}
								bg='white'
								{...register('paymentMethod')}
							/>
							{/* Using for suggestions */}
							<datalist id='payment-methods'>
								{paymentOptions.map((item, i) => (
									<option key={i} value={item} />
								))}
							</datalist>

							{errors.paymentMethod && (
								<Text color='red.500' fontSize='sm' mt={1}>
									{errors.paymentMethod.message}
								</Text>
							)}
						</FormControl>

						{/* Amount */}
						<FormControl isInvalid={!!errors.amount} isRequired>
							<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
								Amount
							</FormLabel>
							<Input
								type='number'
								step='0.01'
								min='0'
								focusBorderColor={focusColor}
								borderColor={borderColor}
								placeholder='0.00'
								{...register('amount')}
							/>
							{errors.amount && (
								<Text color='red.500' fontSize='sm' mt={1}>
									{errors.amount.message}
								</Text>
							)}
						</FormControl>

						{/* Agency */}
						{isAgenciesAllowed && (
							<FormControl>
								<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
									Agency
								</FormLabel>
								<Select
									placeholder='Select agency...'
									focusBorderColor={focusColor}
									borderColor={borderColor}
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
								color='gray.700'
								fontWeight='600'
								fontSize='sm'
							>
								{/* <Icon as={FiFileText} boxSize={4} /> */}
								Description
							</FormLabel>
							<Textarea
								placeholder='Write balance details...'
								resize='vertical'
								minH='100px'
								focusBorderColor={focusColor}
								borderColor={borderColor}
								bg='white'
								{...register('description')}
							/>
							<Flex justify='space-between' mt={2}>
								<Text
									fontSize='xs'
									color={descriptionLength > 250 ? 'orange.500' : 'gray.500'}
								>
									{descriptionLength}/300
								</Text>
							</Flex>
							{errors.description && (
								<Text mt={2} fontSize='sm' color='red.500'>
									{errors.description.message}
								</Text>
							)}
						</FormControl>
					</VStack>
				</ModalBody>

				<ModalFooter gap={3} borderTop='1px' borderColor={borderColor} py={4}>
					<Button
						variant='outline'
						onClick={handleClose}
						size='md'
						rounded='md'
						isDisabled={creating || updating}
					>
						Cancel
					</Button>

					<Button
						size='md'
						rounded='md'
						colorScheme='brand'
						isLoading={creating || updating}
						onClick={handleSubmit(submitHandler)}
						isDisabled={!isValid || (!isDirty && isEditMode)}
					>
						{isEditMode ? 'Update' : 'Create'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UpsertIncomingBalance;
