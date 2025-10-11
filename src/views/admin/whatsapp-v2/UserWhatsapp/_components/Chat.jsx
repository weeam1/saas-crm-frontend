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
	Avatar,
} from '@chakra-ui/react';
import { AttachmentIcon, PhoneIcon } from '@chakra-ui/icons';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { MessageAck } from '../constants';
import { getTimeFormat } from '../../components/helpers';
import { whatsappColors } from 'utils/helpers';
import { useSelector } from 'react-redux';
import {
	getChat,
	getMessagesByChatId,
} from '../../../../../redux/whatsappWebSlice';
import ChatDate from './ChatDate';
import ParticipantAvatar from './groups/ParticipantAvatar';
import { IoSend } from 'react-icons/io5';
import { FiUsers } from 'react-icons/fi';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';

const Chat = ({ chatId, sessionId }) => {
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef(null);
	const containerRef = useRef();

	const { sendMessage, activeChat } = useWhatsapp();

	const messages = useSelector((state) => getMessagesByChatId(state, chatId));
	const chat = useSelector((state) => getChat(state, chatId));

	console.log({ messages });

	// useEffect(() => {
	// 	if (!messages?.length) return;
	// 	requestAnimationFrame(() => {
	// 		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	// 	});
	// }, [messages]);

	useEffect(() => {
		if (!messages?.length) return;

		// Small timeout ensures DOM fully updates
		const timer = setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			});
		}, 30);

		return () => clearTimeout(timer);
	}, [messages]);

	// useEffect(() => {
	// 	if (!messages?.length) return;
	// 	const container = containerRef.current;
	// 	if (!container) return;

	// 	const isAtBottom =
	// 		Math.abs(
	// 			container.scrollHeight - container.scrollTop - container.clientHeight
	// 		) < 50;

	// 	console.log({ isAtBottom, msg: messages?.length });

	// 	// Always scroll to bottom on initial load or if user is already near bottom
	// 	if (isAtBottom || messages.length === 1) {
	// 		requestAnimationFrame(() => {
	// 			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	// 		});
	// 	}
	// }, [messages]);

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
						{msg.body && <Text whiteSpace='pre-wrap'>{msg.body}</Text>}
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
						{msg.body && <Text whiteSpace='pre-wrap'>{msg.body}</Text>}
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

	const getAvatarProps = (chat) => {
		if (chat.profilePicture) {
			return {
				src: activeChat?.profilePicture,
				name: activeChat.name,
			};
		}

		if (chat.isGroup) {
			return {
				bg: 'purple.500',
				icon: <FiUsers color='white' />,
			};
		}

		return {
			name: activeChat.name,
			bg: 'green.500',
			color: 'white',
		};
	};

	const avatarProps = getAvatarProps(chat);

	return (
		<Flex direction='column' h='100%'>
			{/* Header */}
			<Box
				p={4}
				borderBottom='1px solid #e0e0e0'
				bg={whatsappColors.headerBg}
				shadow='sm'
			>
				<HStack gap='2' align='center'>
					<Avatar size='sm' {...avatarProps} />

					<Text filter='blur(4px)' fontWeight='bold' fontSize='lg'>
						{activeChat?.name || '***********'}
					</Text>
					{/* <Text fontSize='sm' color='gray.500'>
							{chat?.phoneNumber || '***********'}
						</Text> */}
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
						{/* // ?.filter((msg) => !msg.hasMedia) // text chat messages for now in
						phase 1 */}
						{messages?.map((msg, idx) => {
							if (msg.isStatus) return null;

							const isGroupChat = chat?.isGroup;
							const participant = isGroupChat
								? chat?.participants?.find((p) => p.id === msg.author)
								: null;

							return (
								// <Box>
								// 	<ChatDate
								// 		timestamp={msg?.timestamp}
								// 		prevMsg={messages[idx - 1]}
								// 	/>

								// 	<Flex
								// 		key={idx}
								// 		justify={msg.fromMe ? 'flex-end' : 'flex-start'}
								// 		width='100%'
								// 	>
								// 		{/* If group chat then show participent avatar */}
								// 		{participant && (
								// 			<ParticipantAvatar
								// 				name={participant?.name}
								// 				number={participant?.number}
								// 			/>
								// 		)}
								// 		<Box
								// 			py={2}
								// 			px={3}
								// 			mx='4'
								// 			bg={
								// 				msg.fromMe
								// 					? whatsappColors.outgoingBg
								// 					: whatsappColors.incomingBg
								// 			}
								// 			rounded='lg'
								// 			maxW='70%'
								// 			position='relative'
								// 			shadow='sm'
								// 			// border='1px solid rgba(0,0,0,0.1)'
								// 		>
								// 			{renderMessageContent(msg)}

								// 			<Flex
								// 				justifyContent='flex-end'
								// 				align='center'
								// 				justifySelf='flex-end'
								// 				gap={1}
								// 				width='fit-content'
								// 			>
								// 				{/* Message time */}
								// 				<Text
								// 					fontSize='xs'
								// 					color='gray.500'
								// 					textAlign={msg.fromMe ? 'right' : 'left'}
								// 				>
								// 					{getTimeFormat(msg.timestamp)}
								// 				</Text>

								// 				{/* Message status indicator for outgoing messages */}
								// 				{msg.fromMe && (
								// 					<Box>
								// 						{msg.ack === MessageAck.ACK_PENDING && (
								// 							<BiCheck size={16} color='gray' /> // single gray tick
								// 						)}

								// 						{[
								// 							MessageAck.ACK_SERVER, // double gray tick (server received)
								// 							MessageAck.ACK_DEVICE, // double gray tick (delivered to device)
								// 						].includes(msg.ack) && (
								// 							<BiCheckDouble size={16} color='gray' />
								// 						)}

								// 						{[
								// 							MessageAck.ACK_READ, // double blue tick (read)
								// 							MessageAck.ACK_PLAYED, // double blue tick (played, same as read)
								// 						].includes(msg.ack) && (
								// 							<BiCheckDouble size={16} color='blue' />
								// 						)}
								// 					</Box>
								// 				)}
								// 			</Flex>
								// 		</Box>
								// 	</Flex>
								// </Box>
								<Box w='100%' mb={2} key={idx + msg.id?._serialized}>
									{/* Chat date separator */}
									<ChatDate
										key={idx + msg.from}
										timestamp={msg?.timestamp}
										prevMsg={messages[idx - 1]}
									/>

									<Flex
										justify={msg.fromMe ? 'flex-end' : 'flex-start'}
										align='flex-end'
										w='100%'
										px={2}
										gap={2}
									>
										{/* Incoming message avatar (group or non-me) */}
										{!msg.fromMe && isGroupChat && (
											<ParticipantAvatar
												name={''}
												number={msg?.author}
												size='sm'
											/>
										)}

										{/* Message bubble */}
										<Box
											position='relative'
											bg={
												msg.fromMe
													? whatsappColors.outgoingBg
													: whatsappColors.incomingBg
											}
											color={msg.fromMe ? 'gray.900' : 'gray.800'}
											px={3}
											py={2}
											maxW='75%'
											rounded='lg'
											shadow='sm'
											borderRadius={
												msg.fromMe
													? '20px 20px 4px 20px' // outgoing bubble shape
													: '20px 20px 20px 4px' // incoming bubble shape
											}
										>
											{/* Message Text / Media / Content */}
											<Box>{renderMessageContent(msg)}</Box>

											{/* Timestamp + Status */}
											<Flex
												justify='flex-end'
												align='center'
												gap={1}
												mt={1}
												opacity={0.7}
												fontSize='xs'
											>
												<Text>{getTimeFormat(msg.timestamp)}</Text>

												{msg.fromMe && (
													<Box>
														{msg.ack === MessageAck.ACK_PENDING && (
															<BiCheck size={15} color='gray' />
														)}
														{[
															MessageAck.ACK_SERVER,
															MessageAck.ACK_DEVICE,
														].includes(msg.ack) && (
															<BiCheckDouble size={15} color='gray' />
														)}
														{[
															MessageAck.ACK_READ,
															MessageAck.ACK_PLAYED,
														].includes(msg.ack) && (
															<BiCheckDouble size={15} color='blue' />
														)}
													</Box>
												)}
											</Flex>
										</Box>

										{/* Outgoing message avatar (optional for group view) */}
										{msg.fromMe && isGroupChat && (
											<ParticipantAvatar
												name={'You'}
												number={msg?.author}
												size='sm'
											/>
										)}
									</Flex>
								</Box>
							);
						})}
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
			<Box
				p={2}
				// borderTop='1px solid softgray.100'
				// bg='linear-gradient(135deg, rgba(250, 247, 231, 0.4), rgba(237, 209, 153, 0.4))'
				// bg={whatsappColors.inputBg}
			>
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
					<IconButton
						aria-label='Send message'
						icon={<IoSend size={20} />}
						colorScheme='green'
						bg={whatsappColors.primary}
						borderRadius='full'
						size='md'
						onClick={handleSendMessage}
						isDisabled={!message.trim()}
						_hover={{
							bg: '#128C7E',
							transform: 'scale(1.05)',
							transition: 'all 0.2s ease-in-out',
						}}
						_active={{
							transform: 'scale(0.95)',
						}}
					/>
				</HStack>
			</Box>
		</Flex>
	);
};

export default Chat;
