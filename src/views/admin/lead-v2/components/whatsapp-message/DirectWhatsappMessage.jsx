import { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalCloseButton,
	Textarea,
	Button,
	Text,
	Input,
	VStack,
	HStack,
	Heading,
	Spinner,
	SimpleGrid,
	Icon,
	Center,
	Box,
} from '@chakra-ui/react';

import { FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { normalizePhone, formatToWhatsappId } from 'utils/phoneValidation';
import { safeValue } from 'utils';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import Loader from 'components/loading/Loader';
import { useFetchItemsQuery } from 'api/apiSlice';
import LeadWhatsappChat from './LeadWhatsappChat';

const DirectWhatsappMessage = ({
	isOpen,
	onClose,
	onSend,
	user,
	number,
	lead,
}) => {
	const [message, setMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [whatsappNumber, setWhatsappNumber] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [loadingChat, setLoadingChat] = useState(false);
	const [activeChat, setActiveChat] = useState(false);

	const { data: instanceData, isLoading: instanceLoading } = useFetchItemsQuery(
		{
			path: `/whatsapp/instances/user/${user?._id}`,
		},
		{
			refetchOnMountOrArgChange: true,
			skip: !user?._id,
		}
	);

	const isWhatsAppActive =
		(instanceData?.doc?.isActive && instanceData?.doc?.isWhatsapp) || false;

	const sessionId = instanceData?.doc?.sessionId || null;

	const { sendMessage, isReady, getChat } = useWhatsapp();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingChat(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, [loadingChat]);

	useEffect(() => {
		let timeout;

		const startReconnect = async () => {
			setLoading(true);

			if (isReady) {
				// If already ready → show only 2s loading
				timeout = setTimeout(() => {
					setLoading(false);
				}, 1000);
			} else {
				// If not ready → wait longer (5s)
				timeout = setTimeout(() => {
					setLoading(false);
				}, 5000);
			}
		};

		startReconnect();

		return () => clearTimeout(timeout);
	}, [isReady]);

	useEffect(() => {
		if (number) {
			const validNumber = normalizePhone(safeValue(number));

			if (validNumber) {
				setWhatsappNumber(formatToWhatsappId(validNumber));
			} else setErrorMessage('WhatsApp number is not correct!');
		} else {
			setErrorMessage('WhatsApp number is not correct!');
		}
	}, [number]);

	const handleSend = async () => {
		if (!message.trim()) {
			toast.warn('Message cannot be empty.', {
				position: 'top-right',
				autoClose: 2500,
			});
			return;
		}

		try {
			// console.log({ sessionId, to: whatsappId, message });

			sendMessage({ sessionId, to: whatsappNumber, message });
			toast.success('Message sent successfully!');
			onClose();
		} catch (err) {
			toast.error(
				err?.message || 'Failed to send message. Please try again later.'
			);
		} finally {
			setIsSending(false);
		}
	};

	const handleDirectChat = () => {
		console.log({ sessionId, whatsappNumber });
		if (sessionId && whatsappNumber) {
			getChat(sessionId, { id: whatsappNumber });
			setLoadingChat(true);
			setActiveChat(true);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='4xl' isCentered>
			<ModalOverlay />
			<ModalContent borderRadius='2xl' overflow='hidden'>
				<ModalHeader bg='whatsapp.500' color='white' py={4}>
					<HStack>
						<Icon as={FaWhatsapp} boxSize={5} />
						<Text fontSize='lg'>{lead?.leadName || 'Unknown'}</Text>
					</HStack>
				</ModalHeader>

				<ModalCloseButton color='whiteAlpha.900' />

				<ModalBody py={4}>
					{loading || instanceLoading ? (
						<Loader />
					) : errorMessage ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								{errorMessage}
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Please select a valid WhatsApp lead number in the CRM before
								sending your message.
							</Text>
						</Center>
					) : !isWhatsAppActive || !sessionId ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								WhatsApp account not found!
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Please add your WhatsApp account in CRM before sending messages.
							</Text>
						</Center>
					) : sessionId && !isReady ? (
						<Center flexDir='column' py={6}>
							<Text fontWeight='medium' color='red.400' mb={2}>
								WhatsApp not connected
							</Text>
							<Text color='gray.500' fontSize='sm' textAlign='center'>
								Reload the page and try again once your WhatsApp account is
								connected.
							</Text>
						</Center>
					) : (
						// <VStack align='stretch' spacing={4}>
						// 	{loadingChat ? (
						// 		<Loader />
						// 	) : activeChat ? (
						// 		<LeadWhatsappChat
						// 			chatId={whatsappNumber}
						// 			sessionId={sessionId}
						// 		/>
						// 	) : (
						// 		<Box h='75dvh'>
						// 			<Button colorScheme='whatsapp' onClick={handleDirectChat}>
						// 				Start Chat Now...
						// 			</Button>
						// 		</Box>
						// 	)}
						// </VStack>
						<VStack align='stretch' spacing={6} h='100%'>
							{loadingChat ? (
								<Center h='75dvh'>
									<VStack spacing={4}>
										<Spinner
											size='xl'
											color='green.400'
											thickness='4px'
											speed='0.65s'
										/>
										<Text color='gray.600' fontSize='sm'>
											Loading chat...
										</Text>
									</VStack>
								</Center>
							) : activeChat ? (
								<LeadWhatsappChat
									chatId={whatsappNumber}
									sessionId={sessionId}
								/>
							) : (
								<Center h='75dvh' p={8}>
									<VStack
										spacing={8}
										// maxW='md'
										textAlign='center'
										bg='white'
										p={8}
									>
										{/* Header */}
										<VStack spacing={3}>
											<Box
												p={4}
												bg='green.50'
												borderRadius='full'
												borderWidth='1px'
												borderColor='green.100'
											>
												<Icon
													as={FaWhatsapp}
													w={10}
													h={10}
													color='whatsapp.500'
												/>
											</Box>
											<Heading size='lg' color='gray.800'>
												Direct Chat with Lead
											</Heading>
											<Text color='gray.600' fontSize='md'>
												Start a conversation directly through WhatsApp
											</Text>
										</VStack>

										{/* Features Grid */}
										{/* <SimpleGrid
											columns={{ base: 1, md: 2 }}
											spacing={4}
											w='full'
										>
											<VStack
												spacing={2}
												p={4}
												bg='green.50'
												borderRadius='lg'
												align='flex-start'
											>
												<HStack spacing={2}>
													<Icon as={FaCheckCircle} color='green.500' />
													<Text fontWeight='600' fontSize='sm' color='gray.800'>
														Instant Connection
													</Text>
												</HStack>
												<Text fontSize='xs' color='gray.600' textAlign='left'>
													Connect instantly without waiting for lead response
												</Text>
											</VStack>

											<VStack
												spacing={2}
												p={4}
												bg='blue.50'
												borderRadius='lg'
												align='flex-start'
											>
												<HStack spacing={2}>
													<Icon as={FaShieldAlt} color='blue.500' />
													<Text fontWeight='600' fontSize='sm' color='gray.800'>
														Secure Chat
													</Text>
												</HStack>
												<Text fontSize='xs' color='gray.600' textAlign='left'>
													End-to-end encrypted conversation
												</Text>
											</VStack>

											<VStack
												spacing={2}
												p={4}
												bg='purple.50'
												borderRadius='lg'
												align='flex-start'
											>
												<HStack spacing={2}>
													<Icon as={FaHistory} color='purple.500' />
													<Text fontWeight='600' fontSize='sm' color='gray.800'>
														Chat History
													</Text>
												</HStack>
												<Text fontSize='xs' color='gray.600' textAlign='left'>
													Complete conversation record saved
												</Text>
											</VStack>

											<VStack
												spacing={2}
												p={4}
												bg='orange.50'
												borderRadius='lg'
												align='flex-start'
											>
												<HStack spacing={2}>
													<Icon as={FaPaperclip} color='orange.500' />
													<Text fontWeight='600' fontSize='sm' color='gray.800'>
														File Sharing
													</Text>
												</HStack>
												<Text fontSize='xs' color='gray.600' textAlign='left'>
													Share documents, images, and files
												</Text>
											</VStack>
										</SimpleGrid> */}

										{/* Additional Benefits */}
										<Box
											p={4}
											bg='gray.50'
											borderRadius='lg'
											borderLeft='4px solid'
											borderLeftColor='whatsapp.400'
											w='full'
										>
											<VStack spacing={1} align='flex-start'>
												<Text fontWeight='600' fontSize='sm' color='gray.800'>
													Benefits of Direct WhatsApp Chat:
												</Text>
												<Text fontSize='xs' color='gray.600' textAlign='left'>
													• Higher engagement rates with leads
													<br />
													• Faster response times
													<br />
													• Personal touch in communication
													<br />• Built-in customer relationship tool
												</Text>
											</VStack>
										</Box>

										{/* Action Button */}
										<Button
											size='lg'
											colorScheme='whatsapp'
											leftIcon={<FaWhatsapp />}
											rightIcon={<FaArrowRight />}
											onClick={handleDirectChat}
											w='full'
											py={6}
											borderRadius='lg'
											bgGradient='linear(to-r, whatsapp.500, whatsapp.600)'
											_hover={{
												bgGradient: 'linear(to-r, whatsapp.600, whatsapp.700)',
												transform: 'translateY(-2px)',
												boxShadow: 'xl',
											}}
											transition='all 0.3s'
											fontSize='md'
											fontWeight='600'
										>
											Start WhatsApp Chat Now
										</Button>

										{/* Helper Text */}
										<Text fontSize='xs' color='gray.500'>
											Chat opens directly in your WhatsApp. Make sure you have
											WhatsApp installed.
										</Text>
									</VStack>
								</Center>
							)}
						</VStack>
					)}
				</ModalBody>

				{!activeChat && (
					<ModalFooter borderTopWidth='1px' bg='gray.50'>
						<Button onClick={onClose} variant='ghost'>
							Close
						</Button>
						{/* {!isWhatsAppActive ? (
						<Button onClick={onClose}>Close</Button>
					) : (
						<HStack spacing={3}>
							<Button onClick={onClose} variant='ghost'>
								Close
							</Button>
							<Button
								colorScheme='whatsapp'
								onClick={handleSend}
								isLoading={isSending}
								isDisabled={!message.trim()}
							>
								Send
							</Button>
						</HStack>
					)} */}
					</ModalFooter>
				)}
			</ModalContent>
		</Modal>
	);
};

export default DirectWhatsappMessage;
{
	/* <Textarea
								placeholder='Type your message...'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								focusBorderColor='whatsapp.400'
								size='md'
								minH='120px'
							/> */
}
