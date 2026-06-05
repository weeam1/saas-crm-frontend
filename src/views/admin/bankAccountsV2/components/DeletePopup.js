// import React from 'react';
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalFooter,
// 	ModalBody,
// 	ModalCloseButton,
// 	Button,
// 	Text,
// } from '@chakra-ui/react';

// const DeletePopup = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
// 	const handleConfirm = async () => {
// 		await onConfirm();
// 		onClose();
// 	};

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={onClose}
// 			isCentered
// 			motionPreset='slideInBottom'
// 		>
// 			<ModalOverlay bg='blackAlpha.600' />
// 			<ModalContent
// 				maxW={{ base: 'xs', md: 'sm' }}
// 				borderRadius='md'
// 				mx='auto'
// 				my='auto'
// 				data-testid='delete-confirmation-modal'
// 			>
// 				<ModalHeader>Confirm Deletion</ModalHeader>
// 				<ModalCloseButton />
// 				<ModalBody>
// 					<Text>
// 						Are you sure you want to delete{' '}
// 						<strong>
// 							{itemName ? `Account Name: ${itemName}` : 'this item'}
// 						</strong>
// 						? This action cannot be undone.
// 					</Text>
// 				</ModalBody>
// 				<ModalFooter>
// 					<Button variant='ghost' onClick={onClose} mr={3}>
// 						Cancel
// 					</Button>
// 					<Button
// 						bg='red.500'
// 						color='white'
// 						onClick={handleConfirm}
// 						isLoading={isDeleting}
// 						isDisabled={isDeleting}
// 						_hover={{
// 							bg: '#9E7A3B',
// 						}}
// 					>
// 						Delete
// 					</Button>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default DeletePopup;
import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Text,
	Flex,
	Icon,
	Box,
	HStack,
} from '@chakra-ui/react';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';

const DeletePopup = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
	const mc = useModalColors();

	const handleConfirm = async () => {
		await onConfirm();
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			size='lg'
			motionPreset='slideInBottom'
		>
			<ModalOverlay backdropFilter='blur(3px)' bg={mc.overlayBg} />
			<ModalContent
				borderRadius='2xl'
				mx='auto'
				my='auto'
				bg={mc.bg}
				boxShadow={mc.modalShadow}
				border='1px solid'
				borderColor={mc.borderColor}
				overflow='hidden'
				data-testid='delete-confirmation-modal'
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
							Confirm Deletion
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

						{/* Warning Message */}
						<Text fontSize='md' color={mc.bodyText} lineHeight='1.6'>
							Are you sure you want to delete{' '}
							<Text as='span' fontWeight='bold' color='text.heading'>
								{itemName ? `"${itemName}"` : 'this item'}
							</Text>
							?
						</Text>

						{/* Warning Subtext */}
						<Box
							mt={3}
							bg='rgba(238, 93, 80, 0.08)'
							border='1px solid'
							borderColor='rgba(238, 93, 80, 0.2)'
							borderRadius='lg'
							p={3}
							w='full'
						>
							<HStack spacing={2} align='flex-start'>
								<Icon
									as={FiAlertTriangle}
									color='red.400'
									boxSize={4}
									mt={0.5}
									flexShrink={0}
								/>
								<Text fontSize='sm' color='red.300' textAlign='left'>
									This action cannot be undone. All associated data will be
									permanently removed.
								</Text>
							</HStack>
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
						onClick={onClose}
						borderRadius='md'
						color={mc.secondaryBtnText}
						_hover={{
							bg: mc.secondaryBtnHoverBg,
							color: mc.secondaryBtnHoverText,
						}}
					>
						Cancel
					</Button>
					<Button
						bg='red.500'
						color='white'
						onClick={handleConfirm}
						isLoading={isDeleting}
						isDisabled={isDeleting}
						borderRadius='md'
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
					>
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DeletePopup;
