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
import SearchUsers from './SearchUsers';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useModalColors } from 'hooks/useModalColors';

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
	const colors = useModalColors();
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
		mode: 'onChange',
		reValidateMode: 'onChange',
	});

	const handleSelectUser = (user) => {
		setValue('userId', user?._id || null);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='3xl'>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				m={2}
				bg={colors.bg}
				borderRadius='2xl'
				boxShadow={colors.modalShadow}
				border='1px solid'
				borderColor={colors.borderColor}
				overflow='hidden'
			>
				<ModalHeader
					bg={colors.headerBg}
					color={colors.headerText}
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					{mode} Whatsapp User
				</ModalHeader>
				<ModalCloseButton
					color={colors.headerText}
					_hover={{ bg: colors.closeBtnHoverBg }}
					_focus={{ outline: 'none' }}
				/>
				<ModalBody pb={4}>
					{mode === 'Add' && (
						<FormControl isInvalid={errors.userId} mb={4}>
							<FormLabel color={colors.labelColor}>User</FormLabel>
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
					)}

					<FormControl mb='4' isInvalid={errors.phoneNumber}>
						<FormLabel color={colors.labelColor}>Phone ID</FormLabel>
						<Input
							placeholder='Enter phone number id'
							{...register('phoneNumber')}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_placeholder={{ color: colors.mutedText }}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
								outline: 'none',
							}}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{errors.phoneNumber?.message}
						</FormErrorMessage>
					</FormControl>

					<FormControl mb='4' isInvalid={errors.businessId}>
						<FormLabel color={colors.labelColor}>Business ID</FormLabel>
						<Input
							placeholder='Enter business id'
							{...register('businessId')}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_placeholder={{ color: colors.mutedText }}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
								outline: 'none',
							}}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{errors.businessId?.message}
						</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.isActive}>
						<FormLabel color={colors.labelColor}>Status</FormLabel>
						<Select
							{...register('isActive')}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: `0 0 0 1px ${colors.accentGold}`,
								outline: 'none',
							}}
						>
							<option value={true} style={{ background: colors.bg, color: colors.headingText }}>Enable</option>
							<option value={false} style={{ background: colors.bg, color: colors.headingText }}>Disable</option>
						</Select>
						<FormErrorMessage color={colors.badgeErrorText}>
							{errors.isActive?.message}
						</FormErrorMessage>
					</FormControl>
				</ModalBody>

				<ModalFooter
					bg={colors.footerBg}
					borderTop='1px solid'
					borderColor={colors.borderColor}
				>
					<Button
						variant='ghost'
						onClick={onClose}
						mr={3}
						isDisabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						variant='brand'
						onClick={handleSubmit(onSubmit)}
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