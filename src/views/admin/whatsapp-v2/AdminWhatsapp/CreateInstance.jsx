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
	userId: Yup.string(),
	instanceName: Yup.string().required('Instance name is required'),
});

const CreateInstance = ({
	isOpen,
	onClose,
	instance,
	updateInstances,
	mode = 'add',
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
		formState: { errors },
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

			if (mode === 'edit') {
				// Edit Mode → Update existing instance
				res = await updateInstance({
					path: `/whatsapp/instances/${formData._id}`,
					body: payload,
				}).unwrap();

				toast.success('WhatsApp instance updated successfully');
			} else {
				// Create Mode → Create new instance
				res = await createInstance({
					path: '/whatsapp/instances',
					body: payload,
				}).unwrap();

				toast.success('WhatsApp instance created successfully');
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
		setValue('userId', user?._id || null);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='3xl'>
			<ModalOverlay />
			<ModalContent m={2}>
				<ModalHeader>{mode} Whatsapp Instance</ModalHeader>
				<ModalCloseButton _focus={{ outline: 'none' }} />
				<ModalBody pb={4}>
					{mode === 'Add' && (
						<FormControl isInvalid={errors.userId} mb={4}>
							<FormLabel>Select User (optional)</FormLabel>
							<SearchUsers
								selectedUserId={
									mode === 'Edit' ? (initialValues?.userId ?? null) : null
								}
								users={usersData?.doc || []}
								onSelectUser={handleSelectUser}
							/>
							<FormErrorMessage>{errors.userId?.message}</FormErrorMessage>
						</FormControl>
					)}

					<FormControl mb='4' isInvalid={errors.instanceName}>
						<FormLabel>Instance Name</FormLabel>
						<Input
							placeholder='Enter instance name'
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
					>
						{mode === 'Edit' ? 'Save' : 'Add'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateInstance;
