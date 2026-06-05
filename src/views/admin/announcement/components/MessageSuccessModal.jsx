import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Button,
	Text,
	Icon,
	Flex,
	Box,
	VStack,
	HStack,
	Divider,
} from '@chakra-ui/react';
import { MdCheckCircle, MdPeople, MdWifi, MdWifiOff } from 'react-icons/md';
import { useModalColors } from 'hooks/useModalColors';

const MessageSuccessModal = ({
	isOpen,
	onClose,
	onlineUsers,
	offlineUsers,
	totalReceivers,
}) => {
	const colors = useModalColors();
	const hasOnlineUsers = onlineUsers > 0;
	const hasOfflineUsers = offlineUsers > 0;

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered size='md'>
			<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
			<ModalContent
				borderRadius='xl'
				p={2}
				bg={colors.bg}
				boxShadow={colors.modalShadow}
				border="1px solid"
				borderColor={colors.badgeSuccessBorder}
			>
				{/* Success Icon */}
				<Flex direction='column' align='center' pt={8} pb={4}>
					<Box bg={colors.badgeSuccessBg} borderRadius='full' p={3} mb={3}>
						<Icon as={MdCheckCircle} boxSize={12} color={colors.badgeSuccessText} />
					</Box>

					<Text fontSize='2xl' fontWeight='bold' color={colors.headingText}>
						Announcement Sent!
					</Text>

					<Text fontSize='md' color={colors.mutedText} mt={1}>
						Your message has been delivered successfully
					</Text>
				</Flex>

				<Divider borderColor={colors.borderColor} />

				<ModalBody py={6} px={4}>
					{/* Summary Card */}
					<Box bg={colors.bgInput} borderRadius='lg' p={4} mb={4} border="1px solid" borderColor={colors.badgeSuccessBorder}>
						<HStack spacing={2} mb={3}>
							<Icon as={MdPeople} color={colors.badgeSuccessText} />
							<Text fontSize='sm' fontWeight='semibold' color={colors.headingText}>
								Delivery Summary
							</Text>
						</HStack>

						<VStack spacing={3} align='stretch'>
							{hasOnlineUsers && (
								<Flex justify='space-between' align='center'>
									<HStack spacing={2}>
										<Icon as={MdWifi} color={colors.badgeSuccessText} boxSize={4} />
										<Text color={colors.bodyText}>Online Users</Text>
									</HStack>
									<Text fontWeight='semibold' color={colors.badgeSuccessText}>
										{onlineUsers}
									</Text>
								</Flex>
							)}

							{hasOfflineUsers && (
								<Flex justify='space-between' align='center'>
									<HStack spacing={2}>
										<Icon as={MdWifiOff} color={colors.badgeWarningText} boxSize={4} />
										<Text color={colors.bodyText}>Offline Users</Text>
									</HStack>
									<Text fontWeight='semibold' color={colors.badgeWarningText}>
										{offlineUsers}
									</Text>
								</Flex>
							)}

							<Flex
								justify='space-between'
								align='center'
								pt={2}
								borderTop='1px dashed'
								borderColor={colors.borderColor}
							>
								<Text fontWeight='medium' color={colors.bodyText}>
									Total Recipients
								</Text>
								<Text fontWeight='bold' color={colors.badgeSuccessText} fontSize='lg'>
									{totalReceivers}
								</Text>
							</Flex>
						</VStack>
					</Box>

					{/* Status Message */}
					<Text fontSize='sm' color={colors.mutedText} textAlign='center'>
						{hasOfflineUsers
							? 'Offline users will receive the announcement when they come online'
							: 'All users are online and have received the announcement'}
					</Text>
				</ModalBody>

				{/* Footer with success button */}
				<Box px={6} pb={6}>
					<Button
						bg={colors.badgeSuccessText}
						color='white'
						size='lg'
						width='full'
						onClick={onClose}
						borderRadius='lg'
						fontWeight='medium'
						_hover={{
							bg: colors.badgeSuccessText,
							opacity: 0.9,
							transform: 'translateY(-1px)',
							boxShadow: `0 0 16px ${colors.badgeSuccessText}`,
						}}
						_active={{
							bg: colors.badgeSuccessText,
							opacity: 0.8,
						}}
						transition='all 0.2s ease'
					>
						Done
					</Button>
				</Box>
			</ModalContent>
		</Modal>
	);
};

export default MessageSuccessModal;