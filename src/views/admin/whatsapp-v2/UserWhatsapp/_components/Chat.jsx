import { useState, useRef, useEffect, useMemo } from 'react';
import {
	Flex,
	Box,
	Text,
	Input,
	Button,
	Image,
	IconButton,
	HStack,
	VStack,
} from '@chakra-ui/react';
import { AttachmentIcon, PhoneIcon } from '@chakra-ui/icons';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { MessageAck } from '../constants';
import { getTimeFormat } from '../../components/helpers';
import { whatsappColors } from 'utils/helpers';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import { useSelector } from 'react-redux';
import { getMessagesByChatId } from '../../../../../redux/whatsappWebSlice';

const Chat = ({ chatId, sessionId }) => {
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef(null);
	const containerRef = useRef();

	const { sendMessage } = useWhatsapp();

	const messages = useSelector((state) => getMessagesByChatId(state, chatId));

	useEffect(() => {
		if (!messages?.length) return;

		const container = containerRef.current;
		const isNearBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight <
			100;

		if (isNearBottom) {
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const renderMessageContent = (msg) => {
		switch (msg.type) {
			case 'image':
				return (
					<Box>
						<Image
							src={msg.body || msg.url}
							alt='Shared image'
							maxW='300px'
							maxH='300px'
							borderRadius='md'
							fallbackSrc='https://via.placeholder.com/300x300?text=Image'
						/>
						{msg.caption && (
							<Text mt={2} fontSize='sm'>
								{msg.caption}
							</Text>
						)}
					</Box>
				);

			case 'audio':
				return (
					<HStack bg='blackAlpha.200' p={3} borderRadius='md' spacing={3}>
						<Box
							w='24px'
							h='24px'
							bg='green.500'
							borderRadius='full'
							display='flex'
							alignItems='center'
							justifyContent='center'
						>
							<PhoneIcon color='white' w='12px' h='12px' />
						</Box>
						<VStack align='start' spacing={0}>
							<Text fontSize='sm' fontWeight='bold'>
								Audio
							</Text>
							<Text fontSize='xs' color='gray.600'>
								{msg.duration || '0:00'}
							</Text>
						</VStack>
					</HStack>
				);

			case 'chat':
				return <Text whiteSpace='pre-wrap'>{msg.body}</Text>;
			default:
				return null;
		}
	};

	const handleSendMessage = () => {
		if (message.trim()) {
			// console.log('Sending message:', message);
			sendMessage(sessionId, chatId, message);
			setMessage('');
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<Flex direction='column' h='90vh'>
			{/* Header */}
			<Box
				p={4}
				borderBottom='1px solid #e0e0e0'
				bg={whatsappColors.headerBg}
				shadow='sm'
			>
				<HStack justify='space-between' align='center'>
					<VStack align='start' spacing={0}>
						<Text filter='blur(8px)' fontWeight='bold' fontSize='lg'>
							{'Unknown User'}
						</Text>
						{/* <Text fontSize='sm' color='gray.500'>
							{chat?.phoneNumber || '***********'}
						</Text> */}
					</VStack>
					{/* <HStack>
						<Text fontSize='xs' color='gray.500'>
							Last seen today at {formatTime(Date.now())}
						</Text>
					</HStack> */}
				</HStack>
			</Box>

			{/* Messages Container */}
			<Box
				flex='1'
				p={4}
				scrollBehavior='smoth'
				overflowY='auto'
				position='relative'
				maxH='100%'
				ref={containerRef}
			>
				{messages?.length ? (
					<Flex
						direction='column'
						justify='flex-end'
						align='stretch'
						spacing={2}
						gap='1'
						minH='100%'
					>
						{messages
							?.filter((msg) => !msg.hasMedia) // text chat messages for now in phase 1
							?.map((msg, idx) => (
								<Flex
									key={idx}
									justify={msg.fromMe ? 'flex-end' : 'flex-start'}
									width='100%'
								>
									<Box
										py={2}
										px={3}
										bg={
											msg.fromMe
												? whatsappColors.outgoingBg
												: whatsappColors.incomingBg
										}
										rounded='lg'
										maxW='70%'
										position='relative'
										shadow='sm'
										// border='1px solid rgba(0,0,0,0.1)'
									>
										{renderMessageContent(msg)}

										<Flex
											justifyContent='flex-end'
											align='center'
											justifySelf='flex-end'
											gap={1}
											width='fit-content'
										>
											{/* Message time */}
											<Text
												fontSize='xs'
												color='gray.500'
												textAlign={msg.fromMe ? 'right' : 'left'}
											>
												{getTimeFormat(msg.timestamp)}
											</Text>

											{/* Message status indicator for outgoing messages */}
											{msg.fromMe && (
												<Box>
													{msg.ack === MessageAck.ACK_PENDING && (
														<BiCheck size={16} color='gray' /> // single gray tick
													)}

													{[
														MessageAck.ACK_SERVER, // double gray tick (server received)
														MessageAck.ACK_DEVICE, // double gray tick (delivered to device)
													].includes(msg.ack) && (
														<BiCheckDouble size={16} color='gray' />
													)}

													{[
														MessageAck.ACK_READ, // double blue tick (read)
														MessageAck.ACK_PLAYED, // double blue tick (played, same as read)
													].includes(msg.ack) && (
														<BiCheckDouble size={16} color='blue' />
													)}
												</Box>
											)}
										</Flex>
									</Box>
								</Flex>
							))}
						<div ref={messagesEndRef} />
					</Flex>
				) : (
					<Flex align='center' justify='center' h='100vh' direction='column'>
						<Text color='gray.400' fontSize='lg' mb={2}>
							No messages yet
						</Text>
						<Text color='gray.400' fontSize='sm'>
							Start a conversation by sending a message
						</Text>
					</Flex>
				)}
			</Box>

			{/* Input Area */}
			<Box p={2} borderTop='1px solid #e0e0e0' bg={whatsappColors.inputBg}>
				<HStack spacing={2}>
					{/* Attachment Button */}
					{/* <IconButton
						aria-label='Attach file'
						icon={<AttachmentIcon />}
						variant='ghost'
						colorScheme='gray'
						size='md'
					/> */}

					{/* Message Input */}
					<Input
						placeholder='Type a message...'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						bg='white'
						borderRadius='full'
						size='md'
						border='1px solid #e0e0e0'
						_focus={{
							borderColor: whatsappColors.primary,
							boxShadow: 'none',
						}}
					/>

					{/* Send Button */}
					<Button
						colorScheme='green'
						bg={whatsappColors.primary}
						borderRadius='full'
						size='md'
						px={6}
						onClick={handleSendMessage}
						isDisabled={!message.trim()}
						_hover={{
							bg: '#128C7E',
						}}
					>
						Send
					</Button>
				</HStack>
			</Box>
		</Flex>
	);
};

export default Chat;
