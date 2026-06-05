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
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateItemMutation } from 'api/apiSlice';
import { useUpdateItemMutation } from 'api/apiSlice';
import SearchUsers from '../WhatsappSettings/SearchUsers';
import { toast } from 'react-toastify';
import { useModalColors } from 'hooks/useModalColors';

const schema = Yup.object().shape({
	userId: Yup.string().required('User is required'),
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
	const colors = useModalColors();
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
		mode: 'onChange',
		reValidateMode: 'onChange',
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
				res = await updateInstance({
					path: `/whatsapp/instances/${instance?._id}`,
					body: payload,
				}).unwrap();

				toast.success('WhatsApp chat updated successfully');
			} else {
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
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				mx='2'
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				bg={colors.bg}
				border='1px solid'
				borderColor={colors.borderColor}
				overflow='hidden'
			>
				<ModalHeader
					bg={colors.headerBg}
					color={colors.headerText}
					borderTopRadius='2xl'
					py={4}
					w='100%'
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					{mode} Whatsapp Chat
				</ModalHeader>
				<ModalCloseButton
					color={colors.headerText}
					_hover={{ bg: colors.closeBtnHoverBg }}
					_focus={{ outline: 'none' }}
				/>
				<ModalBody pb={4}>
					<FormControl isInvalid={errors.userId} mb={4}>
						<FormLabel color={colors.labelColor}>Select User</FormLabel>
						<SearchUsers
							selectedUserId={
								mode === 'Edit' ? (initialValues?.userId ?? null) : null
							}
							users={usersData?.doc || []}
							onSelectUser={handleSelectUser}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{errors.userId?.message}
						</FormErrorMessage>
					</FormControl>

					<FormControl mb='4' isInvalid={errors.instanceName}>
						<FormLabel color={colors.labelColor}>Chat Name</FormLabel>
						<Input
							placeholder='Enter chat name'
							{...register('instanceName')}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_placeholder={{ color: colors.mutedText }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
								outline: 'none',
							}}
							_hover={{ borderColor: colors.accentGold }}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{errors.instanceName?.message}
						</FormErrorMessage>
					</FormControl>
				</ModalBody>

				<ModalFooter
					bg={colors.footerBg}
					borderTop='1px solid'
					borderColor={colors.borderColor}
					py={4}
				>
					<Button
						variant='outline'
						onClick={onClose}
						mr={3}
						isDisabled={isCreating || isUpdating}
					>
						Cancel
					</Button>
					<Button
						variant='brand'
						onClick={handleSubmit(onSubmit)}
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