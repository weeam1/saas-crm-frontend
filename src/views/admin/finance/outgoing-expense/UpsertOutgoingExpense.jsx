import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Flex,
	Text,
	Select,
	HStack,
	VStack,
	Box,
	useColorModeValue,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loader from 'components/loading/Loader';
import {
	useFetchItemsQuery,
	useCreateItemMutation,
	useUpdateItemMutation,
} from 'api/apiSlice';
import { useModalColors } from 'hooks/useModalColors';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useSelector } from 'react-redux';
import CustomDatePicker from 'components/datetime/CustomDatePicker';
import { useState } from 'react';

const expenseSchema = yup.object().shape({
	category: yup.string().required('Please select a category'),
	subCategory: yup.string().optional(),
	amount: yup
		.number()
		.typeError('Please enter a valid number')
		.positive('Amount must be positive')
		.required('Amount is required'),
	vat: yup
		.number()
		.transform((v, o) => (o === '' ? undefined : v))
		.typeError('VAT must be a number')
		.min(0, 'VAT cannot be negative')
		.max(100, 'VAT cannot exceed 100%')
		.optional(),
	description: yup.string().max(300, 'Description too long').optional(),
});

const UpsertExpense = ({
	isOpen,
	onClose,
	initialData = null,
	updateData,
	selectedYear,
	selectedMonth,
	isAgenciesAllowed,
}) => {
	const isEditMode = Boolean(initialData);
	const { headerBg, headerText } = useModalColors();

	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

	// Enhanced color scheme
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const focusColor = useColorModeValue('brand.500', 'brand.300');
	const subtleBg = useColorModeValue('gray.50', 'gray.700');
	const successColor = useColorModeValue('green.600', 'green.300');

	// Fetch categories
	const { data: categories, isLoading: categoriesLoading } = useFetchItemsQuery(
		{
			path: '/finance/expenses/categories/options',
		}
	);

	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	// compute month boundaries
	const minDate = new Date(selectedYear, selectedMonth - 1, 1);
	const maxDate = new Date(selectedYear, selectedMonth, 0); // last day of month

	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: { errors, isValid, isDirty },
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(expenseSchema),
		defaultValues: {
			category: initialData?.category?._id || '',
			subCategory: initialData?.subCategory?._id || '',
			amount: initialData?.amount || '',
			vat: initialData?.vatPercent || '',
			description: initialData?.description || '',
			date: initialData?.date ? new Date(initialData.date) : new Date(),
			agency: initialData?.agency?._id || '',
			source: initialData?.source || '',
		},
	});

	const selectedCategory = watch('category');
	const amount = parseFloat(watch('amount') || 0);
	const vat = parseFloat(watch('vat') || 0);
	const vatAmount = (amount * vat) / 100;
	const total = amount + vatAmount;
	const descriptionLength = watch('description')?.length || 0;

	// Dynamically load subcategories for selected category
	const subCategories =
		categories?.doc?.find((c) => c._id === selectedCategory)?.subCategories ||
		[];

	const submitHandler = async (data) => {
		try {
			const payload = {
				category: data.category,
				subCategory: data.subCategory || null,
				amount: parseFloat(data.amount),
				vat: parseFloat(data.vat) || 0,
				description: data.description?.trim() || '',
				date: data?.date || new Date(),
				agency: data?.agency || null,
				source: data?.source || '',
				month: selectedMonth,
				year: selectedYear,
			};

			const res = isEditMode
				? await update({
						path: `finance/cash/outgoing/${initialData._id}`,
						body: payload,
					}).unwrap()
				: await create({
						path: 'finance/cash/outgoing',
						body: payload,
					}).unwrap();

			toast.success(
				`Expense ${isEditMode ? 'updated' : 'created'} successfully`
			);
			updateData(res?.doc?._id, res?.doc, isEditMode ? 'update' : 'add');
			reset();
			onClose();
		} catch (error) {
			console.error(error);
			toast.error(error?.data?.message || 'Failed to save expense');
		}
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const [openCalendar, setOpenCalendar] = useState(null); // Track which calendar is open

	const toggleCalendar = (calendar) => {
		setOpenCalendar(openCalendar === calendar ? null : calendar);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size='3xl'
			isCentered
			closeOnOverlayClick={false}
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
					{/* <Icon as={FiDollarSign} boxSize={5} /> */}
					<Text fontsize='md' fontWeight='bold'>
						{isEditMode ? 'Edit Expense' : 'Add New Expense'}
					</Text>
				</ModalHeader>
				<ModalCloseButton top={4} right={4} isDisabled={creating || updating} />

				<ModalBody py={6}>
					{categoriesLoading ? (
						<Flex justify='center' py={8}>
							<Loader size='md' />
						</Flex>
					) : (
						<VStack spacing={4} align='stretch'>
							{/* Main Category */}
							<HStack align='flex-start'>
								<FormControl isRequired isInvalid={!!errors.category}>
									<FormLabel
										display='flex'
										alignItems='center'
										gap={2}
										color='gray.700'
										fontWeight='600'
										fontSize='sm'
									>
										{/* <Icon as={FiTag} boxSize={4} /> */}
										Category
									</FormLabel>
									<Select
										placeholder='Choose a category...'
										focusBorderColor={focusColor}
										borderColor={borderColor}
										size='md'
										bg='white'
										{...register('category')}
									>
										{categories?.doc?.map((cat) => (
											<option key={cat._id} value={cat._id}>
												{cat.name}
											</option>
										))}
									</Select>
									<Text h='5px' mt={1} fontSize='sm' color='red.500'>
										{errors.category?.message || ''}
									</Text>
								</FormControl>

								{/* Subcategory */}
								<FormControl>
									<FormLabel color='gray.700' fontWeight='600' fontSize='sm'>
										Subcategory
									</FormLabel>
									<Select
										placeholder={
											subCategories.length === 0
												? 'No subcategories available'
												: 'Choose subcategory (optional)'
										}
										focusBorderColor={focusColor}
										borderColor={borderColor}
										size='md'
										bg='white'
										isDisabled={subCategories.length === 0}
										{...register('subCategory')}
									>
										{subCategories.map((sub) => (
											<option key={sub._id} value={sub._id}>
												{sub.name}
											</option>
										))}
									</Select>
								</FormControl>
							</HStack>

							<HStack align='flex-start'>
								{/* Expense date */}
								<FormControl>
									<FormLabel color='gray.600' fontSize='sm' fontWeight='600'>
										Expense Date
									</FormLabel>

									<Controller
										name='date'
										control={control}
										render={({ field }) => (
											<CustomDatePicker
												selectedDate={field.value}
												handleDateChange={(date) => field.onChange(date)}
												// label='Expense Date'
												placeholder='Select date'
												minDate={minDate}
												maxDate={maxDate}
												isCalendarOpen={openCalendar === 'date'}
												toggleCalendar={() => toggleCalendar('date')}
											/>
										)}
									/>

									{/* <Input
										type='date'
										placeholder='Select date'
										focusBorderColor={focusColor}
										borderColor={borderColor}
										size='md'
										bg='white'
										{...register('date')}
									/> */}
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
							</HStack>

							{/* Source */}
							<FormControl>
								<FormLabel color='gray.600' fontSize='sm' fontWeight='600'>
									Source
								</FormLabel>
								<Input
									type='text'
									placeholder='Source'
									focusBorderColor={focusColor}
									borderColor={borderColor}
									size='md'
									bg='white'
									{...register('source')}
								/>
							</FormControl>

							{/* Amount & VAT */}
							<Box
								p={4}
								bg={subtleBg}
								borderRadius='xl'
								border='1px'
								borderColor={borderColor}
							>
								<Text fontSize='sm' fontWeight='600' color='gray.700' mb={4}>
									Amount Details
								</Text>
								<HStack spacing={2} align='flex-start'>
									<FormControl isRequired isInvalid={!!errors.amount}>
										<FormLabel color='gray.600' fontSize='sm' fontWeight='500'>
											Base Amount
										</FormLabel>
										<Input
											type='number'
											placeholder='0.00'
											step='0.01'
											min='0'
											focusBorderColor={focusColor}
											borderColor={borderColor}
											size='md'
											bg='white'
											{...register('amount')}
										/>
										{errors.amount && (
											<Text mt={2} fontSize='sm' color='red.500'>
												{errors.amount.message}
											</Text>
										)}
									</FormControl>

									<FormControl isInvalid={!!errors.vat}>
										<FormLabel color='gray.600' fontSize='sm' fontWeight='500'>
											VAT (%)
										</FormLabel>
										<Input
											type='number'
											placeholder='0'
											step='0.01'
											min='0'
											max='100'
											focusBorderColor={focusColor}
											borderColor={borderColor}
											size='md'
											bg='white'
											{...register('vat')}
										/>
										{errors.vat && (
											<Text mt={2} fontSize='sm' color='red.500'>
												{errors.vat.message}
											</Text>
										)}
									</FormControl>
								</HStack>

								{/* Total Display */}
								<Flex
									justify='space-between'
									alignItems='center'
									mt={3}
									pt={2}
									borderTop='1px'
									borderColor={borderColor}
								>
									<Text fontSize='sm' fontWeight='bold' color='gray.700'>
										Vat Amount:
									</Text>
									<Text fontsize='sm' fontWeight='bold' color='gray.600'>
										{vatAmount.toFixed(2)}
									</Text>
								</Flex>
								<Flex
									justify='space-between'
									alignItems='center'
									// mt={4}
									pt={2}
									// borderTop='1px'
									// borderColor={borderColor}
								>
									<Text fontSize='sm' fontWeight='bold' color='gray.700'>
										Total Amount:
									</Text>
									<Text fontsize='sm' fontWeight='bold' color={successColor}>
										{total.toFixed(2)}
									</Text>
								</Flex>
							</Box>

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
									placeholder='Add details about this expense... (e.g., purpose, vendor, notes)'
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
					)}
				</ModalBody>
				<ModalFooter gap={3} borderTop='1px' borderColor={borderColor} py={4}>
					<Button
						variant='outline'
						onClick={handleClose}
						isDisabled={creating || updating}
						size='md'
						rounded='md'
					>
						Cancel
					</Button>
					<Button
						isLoading={creating || updating}
						colorScheme='brand'
						onClick={handleSubmit(submitHandler)}
						size='md'
						rounded='md'
						fontWeight='semibold'
						isDisabled={!isValid || (!isDirty && isEditMode)}
					>
						{isEditMode ? 'Update' : 'Create'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UpsertExpense;
