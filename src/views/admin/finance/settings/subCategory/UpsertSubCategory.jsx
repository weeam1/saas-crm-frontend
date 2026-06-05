// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// 	ModalCloseButton,
// 	Button,
// 	FormControl,
// 	FormLabel,
// 	Input,
// 	Textarea,
// 	Switch,
// 	Flex,
// 	Text,
// 	Select,
// } from '@chakra-ui/react';
// import {
// 	useCreateItemMutation,
// 	useFetchItemsQuery,
// 	useUpdateItemMutation,
// } from 'api/apiSlice';
// import Loader from 'components/loading/Loader';
// import { useModalColors } from 'hooks/useModalColors';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';

// const UpsertSubCategory = ({
// 	isOpen,
// 	onClose,
// 	updateData,
// 	initialData = null,
// }) => {
// 	const isEditMode = Boolean(initialData);

// 	const { data: categories, isLoading: categoriesLoading } = useFetchItemsQuery(
// 		{
// 			path: '/finance/expenses/categories/options',
// 		},
// 		{
// 			refetchOnMountOrArgChange: true,
// 			refetchOnFocus: true,
// 			refetchOnReconnect: true,
// 		}
// 	);

// 	const {
// 		register,
// 		handleSubmit,
// 		formState: { errors },
// 		reset,
// 		watch,
// 	} = useForm({
// 		defaultValues: {
// 			name: initialData?.name || '',
// 			category: initialData?.category?._id || '',
// 			description: initialData?.description || '',
// 			isActive: initialData?.isActive ?? true,
// 		},
// 	});

// 	// Watch isActive to show Active/Inactive text
// 	const isActive = watch('isActive');

// 	const { headerBg, headerText } = useModalColors();

// 	const [create, { isLoading: creating }] = useCreateItemMutation();
// 	const [update, { isLoading: updating }] = useUpdateItemMutation();

// 	const submitHandler = async (data) => {
// 		try {
// 			// Build payload once
// 			const payload = {
// 				name: data.name || '',
// 				description: data.description || '',
// 				category: data.category ?? initialData?.category?._id,
// 				isActive: data.isActive ?? true,
// 			};

// 			let res;

// 			if (isEditMode) {
// 				// Edit Mode → Update
// 				res = await update({
// 					path: `finance/expenses/subcategories/${initialData?._id}`,
// 					body: payload,
// 				}).unwrap();

// 				toast.success('Subcategory updated successfully');
// 			} else {
// 				// Create Mode → Add
// 				res = await create({
// 					path: 'finance/expenses/subcategories',
// 					body: payload,
// 				}).unwrap();

// 				toast.success('Subcategory created successfully');
// 			}

// 			// Update parent state
// 			updateData(res?.doc?._id, res?.doc);

// 			// Reset form and close modal
// 			reset();
// 			onClose();
// 		} catch (error) {
// 			console.error('Error saving category:', error);
// 			toast.error(error?.data?.message || 'Failed to save category');
// 		}
// 	};

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
// 			<ModalOverlay backdropFilter='blur(2px)' />
// 			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
// 				<ModalHeader
// 					display='flex'
// 					gap='2'
// 					bg={headerBg}
// 					color={headerText}
// 					borderTopRadius='xl'
// 					py={4}
// 					alignItems='center'
// 					w='100%'
// 				>
// 					{isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
// 				</ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody>
// 					{categoriesLoading ? (
// 						<Loader />
// 					) : (
// 						<Flex direction='column' gap={5}>
// 							<FormControl isRequired isInvalid={!!errors.category}>
// 								<FormLabel fontWeight='medium' color='gray.600'>
// 									Main Category
// 								</FormLabel>
// 								<Select
// 									placeholder='Select main category'
// 									focusBorderColor='brand.400'
// 									{...register('category', {
// 										required: 'Main category is required',
// 									})}
// 									isDisabled={categoriesLoading || !categories?.doc?.length}
// 								>
// 									{categories?.doc?.map((cat) => (
// 										<option key={cat._id} value={cat._id}>
// 											{cat.name}
// 										</option>
// 									))}
// 								</Select>
// 								{errors.category && (
// 									<Text mt={1} fontSize='xs' color='red.500'>
// 										{errors.category.message}
// 									</Text>
// 								)}
// 							</FormControl>

// 							<FormControl isRequired isInvalid={!!errors.name}>
// 								<FormLabel fontWeight='medium' color='gray.600'>
// 									Name
// 								</FormLabel>
// 								<Input
// 									placeholder={
// 										isEditMode
// 											? 'Update sub category name (e.g. Internet)'
// 											: 'Enter sub category name (e.g. Internet, Dinner)'
// 									}
// 									focusBorderColor='brand.400'
// 									{...register('name', {
// 										required: 'Name is required',
// 										validate: (value) =>
// 											value.trim() !== '' || 'Name cannot be empty',
// 									})}
// 								/>
// 								{errors.name && (
// 									<Text mt={1} fontSize='xs' color='red.500'>
// 										{errors.name.message}
// 									</Text>
// 								)}
// 							</FormControl>

// 							<FormControl>
// 								<FormLabel fontWeight='medium' color='gray.600'>
// 									Description
// 								</FormLabel>
// 								<Textarea
// 									focusBorderColor='brand.400'
// 									placeholder={'Add details about this category (optional)'}
// 									resize='none'
// 									{...register('description')}
// 								/>
// 							</FormControl>

// 							<FormControl display='flex' alignItems='center'>
// 								<FormLabel fontWeight='medium' color='gray.600' mb='0'>
// 									Status
// 								</FormLabel>
// 								<Switch
// 									{...register('isActive')}
// 									isChecked={isActive}
// 									onChange={(e) =>
// 										reset({ ...watch(), isActive: e.target.checked })
// 									}
// 									colorScheme='green'
// 									size='lg'
// 								/>
// 								<Text
// 									ml={3}
// 									fontSize='sm'
// 									color={isActive ? 'green.600' : 'gray.500'}
// 								>
// 									{isActive ? 'Active' : 'Inactive'}
// 								</Text>
// 							</FormControl>
// 						</Flex>
// 					)}
// 				</ModalBody>
// 				<ModalFooter gap={3}>
// 					<Button
// 						variant='ghost'
// 						isDisabled={creating || updating}
// 						onClick={onClose}
// 					>
// 						Cancel
// 					</Button>
// 					<Button
// 						px={6}
// 						isLoading={creating || updating}
// 						colorScheme='brand'
// 						color='gray.100'
// 						onClick={handleSubmit(submitHandler)}
// 						fontWeight='semibold'
// 					>
// 						{isEditMode ? 'Save Changes' : 'Add'}
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default UpsertSubCategory;

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
	Switch,
	Flex,
	Text,
	Select,
	Icon,
	VStack,
} from '@chakra-ui/react';
import {
	useCreateItemMutation,
	useFetchItemsQuery,
	useUpdateItemMutation,
} from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { useModalColors } from 'hooks/useModalColors';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
	FiTag,
	FiLayers,
	FiPlusCircle,
	FiEdit3,
	FiSave,
	FiPlus,
} from 'react-icons/fi';

const UpsertSubCategory = ({
	isOpen,
	onClose,
	updateData,
	initialData = null,
}) => {
	const isEditMode = Boolean(initialData);
	const mc = useModalColors();

	const { data: categories, isLoading: categoriesLoading } = useFetchItemsQuery(
		{
			path: '/finance/expenses/categories/options',
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		},
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm({
		defaultValues: {
			name: initialData?.name || '',
			category: initialData?.category?._id || '',
			description: initialData?.description || '',
			isActive: initialData?.isActive ?? true,
		},
	});

	// Watch isActive to show Active/Inactive text
	const isActive = watch('isActive');

	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	const submitHandler = async (data) => {
		try {
			const payload = {
				name: data.name || '',
				description: data.description || '',
				category: data.category ?? initialData?.category?._id,
				isActive: data.isActive ?? true,
			};

			let res;

			if (isEditMode) {
				res = await update({
					path: `finance/expenses/subcategories/${initialData?._id}`,
					body: payload,
				}).unwrap();
				toast.success('Subcategory updated successfully');
			} else {
				res = await create({
					path: 'finance/expenses/subcategories',
					body: payload,
				}).unwrap();
				toast.success('Subcategory created successfully');
			}

			updateData(res?.doc?._id, res?.doc);
			reset();
			onClose();
		} catch (error) {
			console.error('Error saving category:', error);
			toast.error(error?.data?.message || 'Failed to save category');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
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
						{isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
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
				/>

				<ModalBody py={6} px={6}>
					{categoriesLoading ? (
						<Flex justify='center' py={8}>
							<Loader />
						</Flex>
					) : (
						<VStack spacing={5} align='stretch'>
							{/* Main Category */}
							<FormControl isRequired isInvalid={!!errors.category}>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									<Icon as={FiLayers} mr={1} />
									Main Category
								</FormLabel>
								<Select
									placeholder='Select main category'
									bg={mc.bgInput}
									borderColor={errors.category ? 'red.300' : mc.borderColor}
									color={mc.headingText}
									_hover={{
										borderColor: errors.category ? 'red.300' : mc.borderFocus,
									}}
									_focus={{
										borderColor: errors.category ? 'red.300' : mc.borderFocus,
										boxShadow: `0 0 0 1px ${errors.category ? 'red.300' : mc.borderFocus}`,
									}}
									borderRadius='md'
									iconColor={mc.labelColor}
									isDisabled={categoriesLoading || !categories?.doc?.length}
									{...register('category', {
										required: 'Main category is required',
									})}
								>
									{categories?.doc?.map((cat) => (
										<option key={cat._id} value={cat._id}>
											{cat.name}
										</option>
									))}
								</Select>
								{errors.category && (
									<Text mt={1} fontSize='xs' color='red.300'>
										{errors.category.message}
									</Text>
								)}
							</FormControl>

							{/* Name */}
							<FormControl isRequired isInvalid={!!errors.name}>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									<Icon as={FiTag} mr={1} />
									Name
								</FormLabel>
								<Input
									placeholder={
										isEditMode
											? 'Update sub category name (e.g. Internet)'
											: 'Enter sub category name (e.g. Internet, Dinner)'
									}
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
									{...register('name', {
										required: 'Name is required',
										validate: (value) =>
											value.trim() !== '' || 'Name cannot be empty',
									})}
								/>
								{errors.name && (
									<Text mt={1} fontSize='xs' color='red.300'>
										{errors.name.message}
									</Text>
								)}
							</FormControl>

							{/* Description */}
							<FormControl>
								<FormLabel fontWeight='semibold' color={mc.labelColor}>
									Description
								</FormLabel>
								<Textarea
									placeholder='Add details about this category (optional)'
									resize='none'
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
									{...register('description')}
								/>
							</FormControl>

							{/* Status Switch Card */}
							<FormControl
								display='flex'
								alignItems='center'
								bg={mc.bgDeep}
								p={4}
								borderRadius='xl'
								border='1px solid'
								borderColor={mc.borderColor}
							>
								<FormLabel fontWeight='semibold' color={mc.labelColor} mb='0'>
									Status
								</FormLabel>
								<Switch
									{...register('isActive')}
									isChecked={isActive}
									onChange={(e) =>
										reset({ ...watch(), isActive: e.target.checked })
									}
									colorScheme='gold'
									size='lg'
								/>
								<Text
									ml={3}
									fontSize='sm'
									fontWeight='medium'
									color={isActive ? 'green.400' : mc.mutedText}
								>
									{isActive ? 'Active' : 'Inactive'}
								</Text>
							</FormControl>
						</VStack>
					)}
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
						isDisabled={creating || updating}
						onClick={onClose}
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
						px={6}
						isLoading={creating || updating}
						onClick={handleSubmit(submitHandler)}
						fontWeight='bold'
						borderRadius='md'
						background={mc.primaryBtnBg}
						color={mc.primaryBtnText}
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
						loadingText={isEditMode ? 'Saving...' : 'Adding...'}
					>
						{isEditMode ? 'Save Changes' : 'Add'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UpsertSubCategory;
