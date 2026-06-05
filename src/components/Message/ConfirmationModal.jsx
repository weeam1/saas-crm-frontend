// import { useState } from 'react';
// import {
// 	Button,
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// 	Text,
// } from '@chakra-ui/react';

// const ConfirmationModal = ({
// 	isOpen,
// 	onClose,
// 	onConfirm,
// 	title,
// 	message,
// 	isLoading = false,
// 	confirmText = 'Confirm',
// 	cancelText = 'Cancel',
// }) => {
// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} isCentered>
// 			<ModalOverlay />
// 			<ModalContent
// 				fontFamily="'DM Sans', sans-serif"
// 				mx={{ base: 2, sm: 4, md: 8 }}
// 			>
// 				<ModalHeader>{title || 'Are you sure?'}</ModalHeader>
// 				<ModalBody>
// 					<Text>{message || 'This action cannot be undone.'}</Text>
// 				</ModalBody>
// 				<ModalFooter>
// 					<Button rounded='md' onClick={onClose} isDisabled={isLoading} mr={3}>
// 						{cancelText}
// 					</Button>
// 					<Button
// 						colorScheme='red'
// 						rounded='md'
// 						isLoading={isLoading}
// 						isDisabled={isLoading}
// 						onClick={onConfirm}
// 					>
// 						{confirmText}
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default ConfirmationModal;

import { useState } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Text,
	Flex,
	Icon,
	Box,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const ConfirmationModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	isLoading = false,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
}) => {
	const mc = useModalColors();

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				fontFamily="'DM Sans', sans-serif"
				mx={{ base: 2, sm: 4, md: 8 }}
				borderRadius='2xl'
				bg={mc.bg}
				boxShadow={mc.modalShadow}
				border='1px solid'
				borderColor={mc.borderColor}
				overflow='hidden'
			>
				{/* Header — Gold Gradient with Warning Icon */}
				<ModalHeader p={0}>
					<Flex
						align='center'
						background={mc.headerBg}
						color={mc.headerText}
						px={6}
						py={4}
						boxShadow='0 2px 10px rgba(0,0,0,0.15)'
					>
						<Icon as={FiAlertTriangle} boxSize={5} mr={3} />
						<Text fontSize='lg' color='inherit' fontWeight='bold'>
							{title || 'Are you sure?'}
						</Text>
						<ModalCloseButton
							position='absolute'
							right='14px'
							top='14px'
							bg={mc.closeBtnBg}
							color={mc.closeBtnColor}
							borderRadius='full'
							_hover={{ bg: mc.closeBtnHoverBg }}
							_focus={{ boxShadow: 'none' }}
						/>
					</Flex>
				</ModalHeader>

				{/* Body — Warning Content */}
				<ModalBody py={6} px={6}>
					<Flex direction='column' align='center' textAlign='center'>
						{/* Warning Icon */}
						<Flex
							align='center'
							justify='center'
							bg='rgba(238, 93, 80, 0.12)'
							border='2px solid'
							borderColor='rgba(238, 93, 80, 0.3)'
							borderRadius='full'
							w='64px'
							h='64px'
							mb={4}
						>
							<Icon as={FiTrash2} color='red.400' boxSize={7} />
						</Flex>

						{/* Message */}
						<Text fontSize='md' color={mc.bodyText} lineHeight='1.6'>
							{message || 'This action cannot be undone.'}
						</Text>

						{/* Warning Subtext */}
						<Box
							mt={4}
							bg='rgba(238, 93, 80, 0.08)'
							border='1px solid'
							borderColor='rgba(238, 93, 80, 0.2)'
							borderRadius='lg'
							p={3}
							w='full'
						>
							<Flex align='center' gap={2}>
								<Icon
									as={FiAlertTriangle}
									color='red.400'
									boxSize={4}
									flexShrink={0}
								/>
								<Text fontSize='sm' color='red.300' textAlign='left'>
									This action is permanent and cannot be reversed.
								</Text>
							</Flex>
						</Box>
					</Flex>
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
						rounded='md'
						onClick={onClose}
						isDisabled={isLoading}
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
						leftIcon={<FiX />}
					>
						{cancelText}
					</Button>
					<Button
						rounded='md'
						isLoading={isLoading}
						isDisabled={isLoading}
						onClick={onConfirm}
						bg='red.500'
						color='white'
						fontWeight='bold'
						px={6}
						_hover={{
							bg: 'red.600',
							boxShadow: '0 4px 15px rgba(238, 93, 80, 0.4)',
							transform: 'translateY(-1px)',
						}}
						_active={{
							bg: 'red.700',
							transform: 'translateY(0)',
						}}
						_disabled={{
							opacity: 0.6,
							cursor: 'not-allowed',
							transform: 'none',
							boxShadow: 'none',
						}}
						leftIcon={<FiTrash2 />}
					>
						{confirmText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ConfirmationModal;
