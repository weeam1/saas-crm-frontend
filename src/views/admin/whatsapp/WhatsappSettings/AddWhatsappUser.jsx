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
import SearchUsers from './SearchUsers';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = Yup.object().shape({
	userId: Yup.string().required('User is required'),
	phoneNumber: Yup.string()
		.required('Phone number is required')
		.matches(/^[0-9]+$/, 'Invalid phone number: only digits allowed'),

	businessId: Yup.string()
		.required('Business ID is required')
		.matches(/^[0-9]+$/, 'Invalid business ID: only digits allowed'),

	isActive: Yup.boolean().required('Status is required'),
});

const AddWhatsappUser = ({
	isOpen,
	onClose,
	initialValues,
	onSubmit,
	isLoading,
	mode = 'Add',
}) => {
	const { data: usersData, isLoading: usersLoading } = useFetchItemsQuery({
		path: '/v2/user/search_users',
	});

	const {
		register,
		handleSubmit,
		setValue,

		formState: { errors },
	} = useForm({
		defaultValues: initialValues,
		resolver: yupResolver(schema),
		mode: 'onChange', // validate on each keypress
		reValidateMode: 'onChange', // re-validate on each change
	});

	const handleSelectUser = (user) => {
		setValue('userId', user?._id || null);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='3xl'>
			<ModalOverlay />
			<ModalContent m={2}>
				<ModalHeader>{mode} Whatsapp User</ModalHeader>
				<ModalCloseButton _focus={{ outline: 'none' }} />
				<ModalBody pb={4}>
					{mode === 'Add' && (
						<FormControl isInvalid={errors.userId} mb={4}>
							<FormLabel>User</FormLabel>
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

					<FormControl mb='4' isInvalid={errors.phoneNumber}>
						<FormLabel>Phone ID</FormLabel>
						<Input
							placeholder='Enter phone number id'
							{...register('phoneNumber')}
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
								outline: 'none',
							}}
						/>
						<FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
					</FormControl>

					<FormControl mb='4' isInvalid={errors.businessId}>
						<FormLabel>Business ID</FormLabel>
						<Input
							placeholder='Enter business id'
							{...register('businessId')}
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
								outline: 'none',
							}}
						/>
						<FormErrorMessage>{errors.businessId?.message}</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.isActive}>
						<FormLabel>Status</FormLabel>
						<Select
							{...register('isActive')}
							_focus={{
								borderColor: '#D99A36',
								boxShadow: '0 0 0 1px #D99A36',
								outline: 'none',
							}}
						>
							<option value={true}>Enable</option>
							<option value={false}>Disable</option>
						</Select>
						<FormErrorMessage>{errors.isActive?.message}</FormErrorMessage>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
						{...buttonStyle}
						onClick={onClose}
						color='gray.800'
						bg='gray.100'
						mr={3}
						isDisabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						{...buttonStyle}
						onClick={handleSubmit(onSubmit)}
						colorScheme='brand'
						isLoading={isLoading}
					>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AddWhatsappUser;
