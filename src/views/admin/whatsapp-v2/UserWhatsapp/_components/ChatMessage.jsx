import { useRef, useEffect, useCallback } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { MessageAck } from '../constants';
import { getTimeFormat } from '../../components/helpers';
import { whatsappColors } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { getMessagesByChatId } from '../../../../../redux/whatsappWebSlice';
import ParticipantAvatar from './groups/ParticipantAvatar';
import ChatDate from './ChatDate';
import MessageContent from './MessageContent';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';

const ChatMessage = ({ chat, chatId, sessionId }) => {
	const messagesEndRef = useRef(null);
	const containerRef = useRef();

	const messages = useSelector((state) => getMessagesByChatId(state, chatId));

	const { downloadMedia } = useWhatsapp();

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

	const handleDownloadMedia = useCallback(
		(messageId, action) => {
			downloadMedia({ sessionId, messageId, action });
		},
		[downloadMedia, sessionId]
	);

	return (
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
					{messages?.map((msg, idx) => {
						if (msg.isStatus) return null;

						const isGroupChat = chat?.isGroup;
						// const participant = isGroupChat
						// 	? chat?.participants?.find((p) => p.id === msg.author)
						// 	: null;

						return (
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
										<MessageContent
											msg={msg}
											onDownload={handleDownloadMedia}
										/>

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
	);
};

export default ChatMessage;
