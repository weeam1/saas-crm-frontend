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
// } from '@chakra-ui/react';
// import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
// import { useModalColors } from 'hooks/useModalColors';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';

// const UpsertCategory = ({
// 	isOpen,
// 	onClose,
// 	updateData,
// 	initialData = null,
// }) => {
// 	const isEditMode = Boolean(initialData);

// 	const {
// 		register,
// 		handleSubmit,
// 		formState: { errors },
// 		reset,
// 		watch,
// 	} = useForm({
// 		defaultValues: {
// 			name: initialData?.name || '',
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
// 				isActive: data.isActive ?? true,
// 			};

// 			let res;

// 			if (isEditMode) {
// 				// Edit Mode → Update
// 				res = await update({
// 					path: `finance/expenses/categories/${initialData?._id}`,
// 					body: payload,
// 				}).unwrap();

// 				toast.success('Category updated successfully');
// 			} else {
// 				// Create Mode → Add
// 				res = await create({
// 					path: 'finance/expenses/categories',
// 					body: payload,
// 				}).unwrap();

// 				toast.success('Category created successfully');
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
// 					{isEditMode ? 'Edit Category' : 'Add New Category'}
// 				</ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody>
// 					<Flex direction='column' gap={5}>
// 						<FormControl isRequired isInvalid={!!errors.name}>
// 							<FormLabel fontWeight='medium' color='gray.600'>
// 								Name
// 							</FormLabel>
// 							<Input
// 								placeholder={
// 									isEditMode
// 										? 'Update category name (e.g. Facilities)'
// 										: 'Enter category name (e.g. Marketing, Utilities)'
// 								}
// 								focusBorderColor='brand.400'
// 								{...register('name', {
// 									required: 'Name is required',
// 									validate: (value) =>
// 										value.trim() !== '' || 'Name cannot be empty',
// 								})}
// 							/>
// 							{errors.name && (
// 								<Text mt={1} fontSize='xs' color='red.500'>
// 									{errors.name.message}
// 								</Text>
// 							)}
// 						</FormControl>

// 						<FormControl>
// 							<FormLabel fontWeight='medium' color='gray.600'>
// 								Description
// 							</FormLabel>
// 							<Textarea
// 								focusBorderColor='brand.400'
// 								placeholder={
// 									isEditMode
// 										? 'Update category description (e.g. Facilities Expenses)'
// 										: 'Add details about this category (optional)'
// 								}
// 								resize='none'
// 								{...register('description')}
// 							/>
// 							<Text mt={1} fontSize='xs' color='gray.500'>
// 								Optional, but helps provide context for your team.
// 							</Text>
// 						</FormControl>

// 						<FormControl display='flex' alignItems='center'>
// 							<FormLabel fontWeight='medium' color='gray.600' mb='0'>
// 								Status
// 							</FormLabel>
// 							<Switch
// 								{...register('isActive')}
// 								isChecked={isActive}
// 								onChange={(e) =>
// 									reset(
// 										{ ...watch(), isActive: e.target.checked }
// 										// { keepValues: true }
// 									)
// 								}
// 								colorScheme='green'
// 								size='lg'
// 							/>
// 							<Text
// 								ml={3}
// 								fontSize='sm'
// 								color={isActive ? 'green.600' : 'gray.500'}
// 							>
// 								{isActive ? 'Active' : 'Inactive'}
// 							</Text>
// 						</FormControl>
// 					</Flex>
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
// 						{isEditMode ? 'Save Changes' : 'Add Category'}
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default UpsertCategory;

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
	Icon,
	VStack,
} from '@chakra-ui/react';
import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
import { useModalColors } from 'hooks/useModalColors';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiTag, FiPlusCircle, FiEdit3, FiSave, FiPlus } from 'react-icons/fi';

const UpsertCategory = ({
	isOpen,
	onClose,
	updateData,
	initialData = null,
}) => {
	const isEditMode = Boolean(initialData);
	const mc = useModalColors();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm({
		defaultValues: {
			name: initialData?.name || '',
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
				isActive: data.isActive ?? true,
			};

			let res;

			if (isEditMode) {
				res = await update({
					path: `finance/expenses/categories/${initialData?._id}`,
					body: payload,
				}).unwrap();
				toast.success('Category updated successfully');
			} else {
				res = await create({
					path: 'finance/expenses/categories',
					body: payload,
				}).unwrap();
				toast.success('Category created successfully');
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
						{isEditMode ? 'Edit Category' : 'Add New Category'}
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
					<VStack spacing={5} align='stretch'>
						{/* Name */}
						<FormControl isRequired isInvalid={!!errors.name}>
							<FormLabel fontWeight='semibold' color={mc.labelColor}>
								<Icon as={FiTag} mr={1} />
								Name
							</FormLabel>
							<Input
								placeholder={
									isEditMode
										? 'Update category name (e.g. Facilities)'
										: 'Enter category name (e.g. Marketing, Utilities)'
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
								placeholder={
									isEditMode
										? 'Update category description (e.g. Facilities Expenses)'
										: 'Add details about this category (optional)'
								}
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
							<Text mt={1} fontSize='xs' color={mc.mutedText}>
								Optional, but helps provide context for your team.
							</Text>
						</FormControl>

						{/* Status Switch */}
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
						{isEditMode ? 'Save Changes' : 'Add Category'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UpsertCategory;
