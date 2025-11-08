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

const UpsertSubCategory = ({
	isOpen,
	onClose,
	updateData,
	initialData = null,
}) => {
	const isEditMode = Boolean(initialData);

	const { data: categories, isLoading: categoriesLoading } = useFetchItemsQuery(
		{
			path: '/finance/expenses/categories/options',
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
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

	const { headerBg, headerText } = useModalColors();

	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	const submitHandler = async (data) => {
		try {
			// Build payload once
			const payload = {
				name: data.name || '',
				description: data.description || '',
				category: data.category ?? initialData?.category?._id,
				isActive: data.isActive ?? true,
			};

			let res;

			if (isEditMode) {
				// Edit Mode → Update
				res = await update({
					path: `finance/expenses/subcategories/${initialData?._id}`,
					body: payload,
				}).unwrap();

				toast.success('Subcategory updated successfully');
			} else {
				// Create Mode → Add
				res = await create({
					path: 'finance/expenses/subcategories',
					body: payload,
				}).unwrap();

				toast.success('Subcategory created successfully');
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
					{isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{categoriesLoading ? (
						<Loader />
					) : (
						<Flex direction='column' gap={5}>
							<FormControl isRequired isInvalid={!!errors.category}>
								<FormLabel fontWeight='medium' color='gray.600'>
									Main Category
								</FormLabel>
								<Select
									placeholder='Select main category'
									focusBorderColor='brand.400'
									{...register('category', {
										required: 'Main category is required',
									})}
									isDisabled={categoriesLoading || !categories?.doc?.length}
								>
									{categories?.doc?.map((cat) => (
										<option key={cat._id} value={cat._id}>
											{cat.name}
										</option>
									))}
								</Select>
								{errors.category && (
									<Text mt={1} fontSize='xs' color='red.500'>
										{errors.category.message}
									</Text>
								)}
							</FormControl>

							<FormControl isRequired isInvalid={!!errors.name}>
								<FormLabel fontWeight='medium' color='gray.600'>
									Name
								</FormLabel>
								<Input
									placeholder={
										isEditMode
											? 'Update sub category name (e.g. Internet)'
											: 'Enter sub category name (e.g. Internet, Dinner)'
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
									placeholder={'Add details about this category (optional)'}
									resize='none'
									{...register('description')}
								/>
							</FormControl>

							<FormControl display='flex' alignItems='center'>
								<FormLabel fontWeight='medium' color='gray.600' mb='0'>
									Status
								</FormLabel>
								<Switch
									{...register('isActive')}
									isChecked={isActive}
									onChange={(e) =>
										reset({ ...watch(), isActive: e.target.checked })
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
					)}
				</ModalBody>
				<ModalFooter gap={3}>
					<Button
						variant='ghost'
						isDisabled={creating || updating}
						onClick={onClose}
					>
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
						{isEditMode ? 'Save Changes' : 'Add'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default UpsertSubCategory;
