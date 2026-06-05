import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	FormErrorMessage,
	Button,
	HStack,
	Text,
} from '@chakra-ui/react';
import { FiHash } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const MetaIdModal = ({
	isOpen,
	onClose,
	editingMetaId,
	metaFormData,
	setMetaFormData,
	metaFormErrors,
	setMetaFormErrors,
	onSubmit,
	isSubmitting,
}) => {
	const colors = useModalColors();

	const handleClose = () => {
		setMetaFormErrors({});
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			size='lg'
			isCentered
			scrollBehavior='inside'
		>
			<ModalOverlay bg={colors.overlayBg} />
			<ModalContent
				bg={colors.bg}
				borderRadius='lg'
				overflow='hidden'
				maxH='90vh'
				boxShadow={colors.modalShadow}
			>
				<ModalHeader
					bg={colors.accentGold}
					color={colors.headerText}
					py={{ base: 3, md: 4 }}
					px={{ base: 4, md: 6 }}
					borderBottom='1px solid'
					borderColor={colors.borderColor}
				>
					<HStack justify='space-between' align='center'>
						<HStack spacing='2' align='center'>
							{/* <FiHash size="20" /> */}
							<Text
								color={colors.headerText}
								fontSize={{ base: 'md', md: 'lg' }}
								fontWeight='600'
							>
								{editingMetaId ? 'Edit Meta ID' : 'Add New Meta ID'}
							</Text>
						</HStack>
						<ModalCloseButton
							color={colors.headerText}
							position='relative'
							top='0'
							_hover={{ bg: 'rgba(0,0,0,0.1)' }}
						/>
					</HStack>
				</ModalHeader>

				<ModalBody
					px={{ base: 4, md: 8 }}
					py={6}
					maxH='60vh'
					overflowY='auto'
					bg={colors.bgDeep}
				>
					{/* Label - Required field */}
					<FormControl isInvalid={metaFormErrors.label} mb={4} isRequired>
						<FormLabel
							fontSize='sm'
							fontWeight='600'
							color={colors.bodyText}
							mb='1'
						>
							Name
						</FormLabel>
						<Input
							size='sm'
							value={metaFormData.label}
							onChange={(e) => {
								const value = e.target.value;
								setMetaFormData({ ...metaFormData, label: value });
								setMetaFormErrors((prev) => ({
									...prev,
									label: !value?.trim() ? 'Name is required' : '',
								}));
							}}
							placeholder='Enter Name'
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_placeholder={{ color: colors.mutedText }}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: colors.goldGlow,
							}}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{metaFormErrors.label}
						</FormErrorMessage>
					</FormControl>

					{/* Description - Optional field */}
					<FormControl isInvalid={metaFormErrors.description} mb={4}>
						<FormLabel
							fontSize='sm'
							fontWeight='600'
							color={colors.bodyText}
							mb='1'
						>
							Description (Optional)
						</FormLabel>
						<Textarea
							size='sm'
							value={metaFormData.description}
							onChange={(e) =>
								setMetaFormData({
									...metaFormData,
									description: e.target.value,
								})
							}
							placeholder='Enter description for this meta ID'
							rows={4}
							bg={colors.bgInput}
							borderColor={colors.borderColor}
							color={colors.headingText}
							_placeholder={{ color: colors.mutedText }}
							_hover={{ borderColor: colors.accentGold }}
							_focus={{
								borderColor: colors.accentGold,
								boxShadow: colors.goldGlow,
							}}
						/>
						<FormErrorMessage color={colors.badgeErrorText}>
							{metaFormErrors.description}
						</FormErrorMessage>
					</FormControl>
				</ModalBody>

				<ModalFooter
					gap={3}
					borderTop='1px solid'
					borderColor={colors.borderColor}
					bg={colors.bg}
				>
					<Button
						variant='outline'
						size='sm'
						onClick={handleClose}
						borderRadius='md'
						borderColor={colors.accentGold}
						color={colors.accentGold}
						_hover={{
							bg: `rgba(212, 175, 55, 0.1)`,
							borderColor: colors.goldLight,
							color: colors.goldLight,
						}}
					>
						Cancel
					</Button>
					<Button
						size='sm'
						variant='brand'
						type='submit'
						borderRadius='md'
						onClick={onSubmit}
						isLoading={isSubmitting}
						loadingText={editingMetaId ? 'Updating...' : 'Saving...'}
						bg={colors.accentGold}
						color={colors.headerText}
						_hover={{
							bg: colors.goldLight,
							transform: 'translateY(-1px)',
							boxShadow: colors.goldGlow,
						}}
						_active={{
							bg: colors.goldDark,
							transform: 'translateY(0)',
						}}
					>
						{editingMetaId ? 'Update' : 'Save'}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default MetaIdModal;
