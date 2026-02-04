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
	Input,
	Button,
	Text,
	VStack,
	useColorModeValue,
	FormHelperText,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import SearchUsers from 'views/admin/whatsapp-v2/WhatsappSettings/SearchUsers';
import {
	useCreateItemMutation,
	useFetchItemsQuery,
	useUpdateItemMutation,
} from 'api/apiSlice';
import { useModalColors } from 'hooks/useModalColors';
import Loader from 'components/loading/Loader';
import * as yup from 'yup';
import { useMemo } from 'react';

const LEAD_LIMIT_USERS = ['Manager', 'Team Leader', 'Agent'];

const userLeadLimitSchema = yup.object({
	user: yup.string().required('User is required'),
	limit: yup
		.number()
		.typeError('Lead limit must be a number')
		.min(0, 'Lead limit must be at least 0')
		.required('Lead limit is required'),
});

const AddUserLeadLimit = ({
	isOpen,
	onClose,
	initialData = null, // { user, limit }
	onSuccess = null,
}) => {
	const isEditMode = Boolean(initialData?.user);

	const { headerBg, headerText } = useModalColors();
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const focusColor = useColorModeValue('brand.500', 'brand.300');

	const { data: usersData, isLoading: usersLoading } = useFetchItemsQuery(
		{
			path: '/v2/user/search_users',
		},
		{
			skip: isEditMode,
			refetchOnMountOrArgChange: true,
			refetchOnFocus: false,
			refetchOnReconnect: false,
		},
	);

	const [create, { isLoading: creating }] = useCreateItemMutation();
	const [update, { isLoading: updating }] = useUpdateItemMutation();

	const {
		handleSubmit,
		reset,
		setValue,
		register,
		formState: { errors, isDirty, isValid },
	} = useForm({
		mode: 'onChange',
		resolver: yupResolver(userLeadLimitSchema),
		defaultValues: {
			user: initialData?.user?._id || '',
			limit: initialData?.limit ?? '',
		},
	});

	const agents = useMemo(
		() =>
			usersData?.doc?.filter((user) =>
				LEAD_LIMIT_USERS.includes(user?.roles?.[0]?.roleName),
			) || [],
		[usersData],
	);

	const handleSelectUser = (user) => {
		setValue('user', user?._id, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const submitHandler = async (data) => {
		try {
			const payload = {
				limit: Number(data.limit),
			};

			if (!data.user) {
				return toast.error('User is required');
			}

			const res = isEditMode
				? await update({
						path: `/lead/user-lead-limits/${initialData.user._id}`,
						body: payload,
					}).unwrap()
				: await create({
						path: '/lead/user-lead-limits',
						body: {
							userId: data.user,
							...payload,
						},
					}).unwrap();

			toast.success(
				`User lead limit ${isEditMode ? 'updated' : 'added'} successfully`,
			);

			let updatedData = res?.doc;
			if (updatedData?._id) {
				onSuccess?.(
					updatedData?._id,
					updatedData,
					isEditMode ? 'update' : 'add',
				);
			}

			reset();
			onClose();
		} catch (err) {
			toast.error(err?.data?.message || 'Failed to save lead limit');
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
			size='lg'
			closeOnOverlayClick={!creating && !updating}
		>
			<ModalOverlay backdropFilter='blur(4px)' bg='blackAlpha.600' />

			<ModalContent borderRadius='2xl' boxShadow='2xl'>
				<ModalHeader
					bg={headerBg}
					color={headerText}
					borderTopRadius='2xl'
					borderBottom='1px'
					borderColor={borderColor}
				>
					{isEditMode ? 'Edit User Lead Limit' : 'Add User Lead Limit'}
				</ModalHeader>

				<ModalCloseButton isDisabled={creating || updating} />

				<ModalBody py={6}>
					{usersLoading ? (
						<Loader />
					) : (
						<VStack spacing={6} align='stretch'>
							{/* User */}
							{!isEditMode && (
								<FormControl isInvalid={!!errors.user} isRequired>
									<FormLabel fontSize='sm' fontWeight='600'>
										User
									</FormLabel>
									<SearchUsers
										selectedUserId={initialData?.user?._id || null}
										onSelectUser={handleSelectUser}
										users={agents}
									/>
									<FormHelperText fontSize='xs' color='blue.600'>
										ℹ️ Only agents are eligible for assignment.
									</FormHelperText>
									{errors.user && (
										<Text fontSize='sm' color='red.500' mt={1}>
											{errors.user.message}
										</Text>
									)}
								</FormControl>
							)}

							{/* Lead Limit */}
							<FormControl isInvalid={!!errors.limit} isRequired>
								<FormLabel fontSize='sm' fontWeight='600'>
									Lead Limit
								</FormLabel>
								<Input
									type='number'
									min='0'
									placeholder='e.g. 50'
									focusBorderColor={focusColor}
									borderColor={borderColor}
									{...register('limit', { valueAsNumber: true })}
								/>
								{errors.limit && (
									<Text fontSize='sm' color='red.500' mt={1}>
										{errors.limit.message}
									</Text>
								)}
							</FormControl>
						</VStack>
					)}
				</ModalBody>

				<ModalFooter borderTop='1px' borderColor={borderColor} gap={3}>
					<Button
						variant='outline'
						onClick={handleClose}
						isDisabled={creating || updating}
					>
						Cancel
					</Button>

					<Button
						colorScheme='brand'
						isLoading={creating || updating}
						onClick={handleSubmit(submitHandler)}
						isDisabled={!isValid || (!isDirty && isEditMode)}
					>
						{isEditMode ? 'Update' : 'Save'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddUserLeadLimit;
