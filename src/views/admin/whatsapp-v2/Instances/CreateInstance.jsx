import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	FormErrorMessage,
	Stack,
} from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { buttonStyle } from 'utils/btn';
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { useUpdateItemMutation } from 'api/apiSlice';
import SearchUsers from '../WhatsappSettings/SearchUsers';
import { toast } from 'react-toastify';

const schema = Yup.object().shape({
	userId: Yup.string().required('User is requried'),
	instanceName: Yup.string()
		.required('Instance name is required')
		.max(50, 'Max 50 characters'),
});

const CreateInstance = ({
	isOpen,
	onClose,
	instance,
	updateInstances,
	mode = 'Add',
}) => {
	const { data: usersData, isLoading: usersLoading } = useFetchItemsQuery({
		path: '/v2/user/search_users',
	});

	const initialValues = {
		instanceName: instance?.instanceName || '',
		userId: instance?.user?._id || '',
	};

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isDirty, isSubmitting, dirtyFields },
	} = useForm({
		defaultValues: initialValues,
		resolver: yupResolver(schema),
		mode: 'onChange', // validate on each keypress
		reValidateMode: 'onChange', // re-validate on each change
	});

	const [createInstance, { isLoading: isCreating }] = useCreateItemMutation();
	const [updateInstance, { isLoading: isUpdating }] = useUpdateItemMutation();

	const onSubmit = async (formData) => {
		try {
			const payload = {
				instanceName: formData?.instanceName?.trim(),
				userId: formData?.userId,
			};

			let res;

			if (mode === 'Edit') {
				// Build payload from dirty fields only
				// const dirtyKeys = Object.keys(dirtyFields);
				// payload = dirtyKeys.reduce((acc, key) => {
				// 	acc[key] = formData[key];
				// 	return acc;
				// }, {});
				// Edit Mode → Update existing instance
				res = await updateInstance({
					path: `/whatsapp/instances/${instance?._id}`,
					body: payload,
				}).unwrap();

				toast.success('WhatsApp chat updated successfully');
			} else {
				// Create Mode → Create new instance
				res = await createInstance({
					path: '/whatsapp/instances',
					body: payload,
				}).unwrap();

				toast.success('WhatsApp chat created successfully');
			}

			console.log('Response:', res);

			reset();
			updateInstances(res?.doc?._id, res?.doc);
			onClose();
		} catch (error) {
			console.error('Error saving instance:', error);
			toast.error(error?.data?.message || 'Failed to save WhatsApp instance');
		}
	};

	const handleSelectUser = (user) => {
		setValue('userId', user?._id || null, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='3xl'>
			<ModalOverlay />
			<ModalContent m={2}>
				<ModalHeader>{mode} Whatsapp Chat</ModalHeader>
				<ModalCloseButton _focus={{ outline: 'none' }} />
				<ModalBody pb={4}>
					<FormControl isInvalid={errors.userId} mb={4}>
						<FormLabel>Select User</FormLabel>
						<SearchUsers
							selectedUserId={
								mode === 'Edit' ? (initialValues?.userId ?? null) : null
							}
							users={usersData?.doc || []}
							onSelectUser={handleSelectUser}
						/>
						<FormErrorMessage>{errors.userId?.message}</FormErrorMessage>
					</FormControl>

					<FormControl mb='4' isInvalid={errors.instanceName}>
						<FormLabel>Chat Name</FormLabel>
						<Input
							placeholder='Enter chat name'
							{...register('instanceName')}
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
								outline: 'none',
							}}
						/>
						<FormErrorMessage>{errors.instanceName?.message}</FormErrorMessage>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
						{...buttonStyle}
						onClick={onClose}
						color='gray.800'
						bg='gray.100'
						mr={3}
						isDisabled={isCreating || isUpdating}
					>
						Cancel
					</Button>
					<Button
						{...buttonStyle}
						onClick={handleSubmit(onSubmit)}
						colorScheme='brand'
						isLoading={isCreating || isUpdating}
						isDisabled={isSubmitting}
					>
						{mode === 'Edit' ? 'Update' : 'Create'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateInstance;
