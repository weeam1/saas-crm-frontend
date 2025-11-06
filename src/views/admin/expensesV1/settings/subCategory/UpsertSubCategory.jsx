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
} from '@chakra-ui/react';
import { useCreateItemMutation, useUpdateItemMutation } from 'api/apiSlice';
import { useModalColors } from 'hooks/useModalColors';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const UpsertSubCategory = ({
	isOpen,
	onClose,
	updateData,
	initialData = null, // if provided → edit mode
}) => {
	const isEditMode = Boolean(initialData);

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

	const { headerBg, primaryBtnBg, headerText } = useModalColors();

	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	const submitHandler = async (data) => {
		try {
			// Build payload once
			const payload = {
				name: data.name || '',
				description: data.description || '',
				isActive: data.isActive ?? true,
			};

			let res;

			if (isEditMode) {
				// Edit Mode → Update
				res = await update({
					path: `finance/expenses/categories/${initialData?._id}`,
					body: payload,
				}).unwrap();

				toast.success('Category updated successfully');
			} else {
				// Create Mode → Add
				res = await create({
					path: 'finance/expenses/categories',
					body: payload,
				}).unwrap();

				toast.success('Category created successfully');
			}

			// Update parent state
			updateData(res?.doc?._id, res?.doc);

			// Reset form and close modal
			reset();
			onClose();
		} catch (error) {
			console.error('Error saving category:', error);
			toast.error(error?.data?.message || 'Failed to save category');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='lg' isCentered>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent mx='2' borderRadius='xl' boxShadow='xl'>
				<ModalHeader
					display='flex'
					gap='2'
					bg={headerBg}
					color={headerText}
					borderTopRadius='xl'
					py={4}
					alignItems='center'
					w='100%'
				>
					{isEditMode ? 'Edit Category' : 'Add New Category'}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Flex direction='column' gap={5}>
						<FormControl isRequired isInvalid={!!errors.name}>
							<FormLabel fontWeight='medium' color='gray.600'>
								Name
							</FormLabel>
							<Input
								placeholder={
									isEditMode
										? 'Update category name (e.g. Facilities)'
										: 'Enter category name (e.g. Marketing, Utilities)'
								}
								focusBorderColor='brand.400'
								{...register('name', {
									required: 'Name is required',
									validate: (value) =>
										value.trim() !== '' || 'Name cannot be empty',
								})}
							/>
							{errors.name && (
								<Text mt={1} fontSize='xs' color='red.500'>
									{errors.name.message}
								</Text>
							)}
						</FormControl>

						<FormControl>
							<FormLabel fontWeight='medium' color='gray.600'>
								Description
							</FormLabel>
							<Textarea
								focusBorderColor='brand.400'
								placeholder={
									isEditMode
										? 'Update category description (e.g. Facilities Expenses)'
										: 'Add details about this category (optional)'
								}
								resize='none'
								{...register('description')}
							/>
							<Text mt={1} fontSize='xs' color='gray.500'>
								Optional, but helps provide context for your team.
							</Text>
						</FormControl>

						<FormControl display='flex' alignItems='center'>
							<FormLabel fontWeight='medium' color='gray.600' mb='0'>
								Status
							</FormLabel>
							<Switch
								{...register('isActive')}
								isChecked={isActive}
								onChange={(e) =>
									reset(
										{ ...watch(), isActive: e.target.checked },
										{ keepValues: true }
									)
								}
								colorScheme='green'
								size='lg'
							/>
							<Text
								ml={3}
								fontSize='sm'
								color={isActive ? 'green.600' : 'gray.500'}
							>
								{isActive ? 'Active' : 'Inactive'}
							</Text>
						</FormControl>
					</Flex>
				</ModalBody>
				<ModalFooter gap={3}>
					<Button variant='ghost' onClick={onClose}>
						Cancel
					</Button>
					<Button
						px={6}
						isLoading={creating || updating}
						colorScheme='brand'
						color='gray.100'
						onClick={handleSubmit(submitHandler)}
						fontWeight='semibold'
					>
						{isEditMode ? 'Save Changes' : 'Add Category'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UpsertSubCategory;
