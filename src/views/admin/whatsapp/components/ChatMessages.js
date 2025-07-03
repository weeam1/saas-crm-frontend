import { Flex, Box, VStack, Text, Spinner, Button } from '@chakra-ui/react';
import { whatsappColors } from 'utils/helpers';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { getTimeFormat } from './helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
	setChatHistory,
	prependMessages,
} from '../../../../redux/whatsappSlice';
import { FiMessageCircle } from 'react-icons/fi';
import { MessageContent } from './MessageContent';
import ChatDate from './dates/ChatDate';

const MESSAGE_TYPES = [
	'text',
	'image',
	'template',
	'video',
	'audio',
	'document',
];

const ChatMessages = ({ chat, isSending, roomId, from, to }) => {
	const messagesEndRef = useRef(null);

	const messages = useSelector((state) => state.whatsapp.chats[roomId] || []);

	const [chatQuery, setChatQuery] = useState({
		roomId,
		page: 1,
		limit: 15,
	});

	const {
		data: chatData,
		isLoading: chatLoading,
		isFetching: chatFetching,
		refetch: refetchChat,
	} = useFetchItemsQuery(
		{
			path: '/whatsapp/chat_history',
			params: chatQuery,
		},
		{
			skip: !roomId,
			refetchOnMountOrArgChange: true,
		}
	);

	const dispatch = useDispatch();
	const containerRef = useRef(null);
	const prevScrollHeight = useRef(0);
	const [loadingOlder, setLoadingOlder] = useState(false);

	// --- initial + room change load -
	useEffect(() => {
		setChatQuery({ roomId, page: 1, limit: 10 });
	}, [roomId]);

	// --- when chatData arrives -------
	useEffect(() => {
		if (!chatData?.doc) return;

		if (chatQuery.page === 1) {
			dispatch(setChatHistory({ chatId: roomId, messages: chatData.doc }));
			// scroll to bottom
			requestAnimationFrame(() => {
				containerRef.current.scrollTop = containerRef.current.scrollHeight;
			});
		} else {
			// preserve scroll pos
			const c = containerRef.current;
			prevScrollHeight.current = c.scrollHeight;

			dispatch(prependMessages({ chatId: roomId, messages: chatData.doc }));
			setLoadingOlder(false);

			// restore
			requestAnimationFrame(() => {
				c.scrollTop = c.scrollHeight - prevScrollHeight.current;
			});
		}
	}, [chatData?.doc, chatQuery.page, dispatch, roomId]);

	// --- scroll listener -------------
	useEffect(() => {
		const c = containerRef.current;

		const onScroll = () => {
			if (
				c.scrollTop === 0 &&
				!loadingOlder &&
				!chatFetching &&
				chatQuery.page < (chatData?.pagination?.totalPages || Infinity)
			) {
				setLoadingOlder(true);
				setChatQuery((q) => ({ ...q, page: q.page + 1 }));
			}
		};
		c.addEventListener('scroll', onScroll);
		return () => c.removeEventListener('scroll', onScroll);
	}, [
		loadingOlder,
		chatFetching,
		chatQuery.page,
		chatData?.pagination?.totalPages,
	]);

	// useEffect(() => {
	// 	if (to) {
	// 		setChatQuery((prev) => ({ ...prev, roomId, page: 1 }));
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [roomId]);

	// // Append or prepend messages on data fetch
	// useEffect(() => {
	// 	if (chatData?.doc?.length > 0 && chatQuery.page > 1) {
	// 		dispatch(prependMessages({ chatId: roomId, messages: chatData?.doc }));
	// 	} else if (chatData?.doc?.length > 0 && chatQuery.page === 1) {
	// 		dispatch(setChatHistory({ chatId: roomId, messages: chatData?.doc }));
	// 	}
	// }, [chatData?.doc, chatQuery.page, dispatch]);

	return (
		<Box
			flex='1'
			ref={containerRef}
			px={4}
			py={2}
			overflowY='auto'
			scrollBehavior='smooth'
			maxH='100vh'
			bg='gray.100'
			color='white'
			whiteSpace='pre-wrap'
		>
			<VStack spacing={4} align='stretch'>
				{loadingOlder && <Spinner size='sm' alignSelf='center' mb={2} />}

				{chatLoading ? (
					<Loader />
				) : chatData?.doc?.length > 0 && messages?.length > 0 ? (
					messages?.map((message, index) => {
						if (!MESSAGE_TYPES.includes(message.type)) return null;

						const isSelf = message.from === from;

						return (
							<React.Fragment key={index + message?.messageId}>
								<ChatDate
									date={message.createdAt}
									prevDate={messages[index - 1]?.createdAt}
								/>

								<Flex
									direction='column'
									align={isSelf ? 'flex-end' : 'flex-start'}
									p={1}
									borderRadius='md'
								>
									<Box
										position='relative'
										bg={
											isSelf
												? whatsappColors.outgoingBg
												: whatsappColors.incomingBg
										}
										px={4}
										py={2}
										borderRadius='lg'
										// maxW={{ base: '90%', md: '60%' }}
										maxWidth={{ base: '200px', md: '250px', lg: '400px' }}
										boxShadow='sm'
										color={whatsappColors.textDark}
										borderTopLeftRadius={!isSelf ? '4px' : 'lg'}
										borderTopRightRadius={isSelf ? '4px' : 'lg'}
										wordBreak='break-word'
									>
										{/* Render dynamic message content */}
										<MessageContent message={message} isSelf={isSelf} />

										{message?.media?.caption && message?.media?.caption}

										{/* Time + Status Tick */}
										<Flex
											justifyContent='flex-end'
											align='center'
											gap={1}
											// mt={2}
										>
											<Text
												fontSize='10px'
												color={whatsappColors.timeStampColor}
											>
												{getTimeFormat(message.sentAt)}
											</Text>

											{isSelf && (
												<>
													{message.status === 'read' ? (
														<FaCheckDouble size='10px' color='#34B7F1' />
													) : message.status === 'delivered' ? (
														<FaCheckDouble
															size='10px'
															color={whatsappColors.timeStampColor}
														/>
													) : (
														<FaCheck
															size='10px'
															color={whatsappColors.timeStampColor}
														/>
													)}
												</>
											)}
										</Flex>
									</Box>

									{/* {message.type === 'text' && (
										<Box
											position='relative'
											bg={
												isSelf
													? whatsappColors.outgoingBg
													: whatsappColors.incomingBg
											}
											px={4}
											py={1}
											borderRadius='lg'
											maxW={{ base: '90%', md: '80%' }}
											boxShadow='sm'
											color={
												isSelf
													? whatsappColors.textDark
													: whatsappColors.textDark
											}
											borderTopLeftRadius={!isSelf ? '4px' : 'lg'}
											borderTopRightRadius={isSelf ? '4px' : 'lg'}
											wordBreak='break-word'
										>
											<Text whiteSpace='pre-wrap' overflowWrap='break-word'>
												{message.content}
											</Text>
											<Flex justifyContent={'flex-end'} align='center' gap={1}>
												<Text
													fontSize='10px'
													color={whatsappColors.timeStampColor}
													mr={1}
												>
													{getTimeFormat(message.sentAt)}
												</Text>
												{isSelf && (
													<>
														{message.status === 'read' ? (
															<FaCheckDouble size='10px' color='#34B7F1' />
														) : message.status === 'delivered' ? (
															<FaCheckDouble
																size='10px'
																color={whatsappColors.timeStampColor}
															/>
														) : (
															<FaCheck
																size='10px'
																color={whatsappColors.timeStampColor}
															/>
														)}
													</>
												)}
											</Flex>
										</Box>
									)} */}
									{/* {message.type === 'image' && (
										<Box
											position='relative'
											bg={
												isSelf
													? whatsappColors.outgoingBg
													: whatsappColors.incomingBg
											}
											color={isSelf ? 'white' : 'black'}
											p={2}
											borderRadius='lg'
											maxW={{ base: '90%', md: '80%' }}
											boxShadow='sm'
											borderTopRightRadius={isSelf ? '4px' : 'lg'}
										>
											{loadedMedia[message.media.id] ? (
												<img
													src={loadedMedia[message.media.id]}
													alt='shared'
													style={{
														maxWidth: '100%',
														borderRadius: '8px',
														maxHeight: '300px',
														objectFit: 'contain',
													}}
												/>
											) : isMediaLoading ? (
												<Spinner size='sm' />
											) : (
												<Button
													size='sm'
													colorScheme='whatsapp'
													color='white'
													leftIcon={<FiDownload />}
													onClick={() => fetchAndSetImage(message.media.id)}
												>
													Download
												</Button>
											)}

											<Flex justifyContent={'flex-end'} align='center' gap={1}>
												<Text
													fontSize='10px'
													color={whatsappColors.timeStampColor}
													mr={1}
												>
													{getTimeFormat(message.sentAt)}
												</Text>
												{isSelf && (
													<>
														{message.status === 'read' ? (
															<FaCheckDouble size='10px' color='#34B7F1' />
														) : message.status === 'delivered' ? (
															<FaCheckDouble
																size='10px'
																color={whatsappColors.timeStampColor}
															/>
														) : (
															<FaCheck
																size='10px'
																color={whatsappColors.timeStampColor}
															/>
														)}
													</>
												)}
											</Flex>
										</Box>
									)} */}
									{/* {message.type === 'video' && (
									<Box
										position='relative'
										bg={
											isSelf
												? whatsappColors.outgoingBg
												: whatsappColors.incomingBg
										}
										color={isSelf ? 'white' : 'black'}
										p={2}
										borderRadius='lg'
										maxW={{ base: '90%', md: '80%' }}
										boxShadow='sm'
										borderTopLeftRadius={!isSelf && !showAvatar ? '4px' : 'lg'}
										borderTopRightRadius={isSelf ? '4px' : 'lg'}
									>
										<video
											controls
											style={{
												maxWidth: '100%',
												borderRadius: '8px',
												maxHeight: '300px',
												objectFit: 'contain',
											}}
										>
											<source src={message.file.url} type={message.file.type} />
											Your browser does not support the video tag.
										</video>
										<Flex
											justifyContent={'space-between'}
											align='center'
											mt={2}
										>
											<Button
												size='sm'
												colorScheme='whatsapp'
												color='white'
												leftIcon={<FiDownload />}
												onClick={() => handleDownloadFile(message.file)}
											>
												Download
											</Button>
											<Flex align='center' gap={1}>
												<Text
													fontSize='10px'
													color={isSelf ? 'whiteAlpha.800' : 'gray.600'}
													mr={1}
												>
													{formatMessageTime(message.timestamp)}
												</Text>
												{isSelf && (
													<>
														{message.status === 'read' ? (
															<FaCheckDouble size='10px' color='#34B7F1' />
														) : message.status === 'delivered' ? (
															<FaCheckDouble
																size='10px'
																color={isSelf ? 'white' : 'gray.600'}
															/>
														) : (
															<FaCheck
																size='10px'
																color={isSelf ? 'white' : 'gray.600'}
															/>
														)}
													</>
												)}
											</Flex>
										</Flex>
									</Box>
								)} */}
									{/* {message.type === 'audio' && (
									<Box
										position='relative'
										bg={
											isSelf
												? whatsappColors.outgoingBg
												: whatsappColors.incomingBg
										}
										color={isSelf ? 'white' : 'black'}
										p={2}
										borderRadius='lg'
										maxW={{ base: '90%', md: '80%' }}
										boxShadow='sm'
										borderTopLeftRadius={!isSelf && !showAvatar ? '4px' : 'lg'}
										borderTopRightRadius={isSelf ? '4px' : 'lg'}
									>
										<audio
											controls
											style={{
												width: '100%',
											}}
										>
											<source src={message.file.url} type={message.file.type} />
											Your browser does not support the audio element.
										</audio>
										<Flex
											justifyContent={'space-between'}
											align='center'
											mt={2}
										>
											<Button
												size='sm'
												colorScheme='whatsapp'
												color='white'
												leftIcon={<FiDownload />}
												onClick={() => handleDownloadFile(message.file)}
											>
												Download
											</Button>
											<Flex align='center' gap={1}>
												<Text
													fontSize='10px'
													color={isSelf ? 'whiteAlpha.800' : 'gray.600'}
													mr={1}
												>
													{formatMessageTime(message.timestamp)}
												</Text>
												{isSelf && (
													<>
														{message.status === 'read' ? (
															<FaCheckDouble size='10px' color='#34B7F1' />
														) : message.status === 'delivered' ? (
															<FaCheckDouble
																size='10px'
																color={isSelf ? 'white' : 'gray.600'}
															/>
														) : (
															<FaCheck
																size='10px'
																color={isSelf ? 'white' : 'gray.600'}
															/>
														)}
													</>
												)}
											</Flex>
										</Flex>
									</Box>
								)} */}
									{/* {message.type === 'voice' && (
									<Box
										position='relative'
										bg={
											isSelf
												? whatsappColors.outgoingBg
												: whatsappColors.incomingBg
										}
										px={4}
										py={2}
										borderRadius='lg'
										maxW={{ base: '90%', md: '80%' }}
										minW='200px'
										boxShadow='sm'
										color={
											isSelf ? whatsappColors.textDark : whatsappColors.textDark
										}
										borderTopLeftRadius={!isSelf && !showAvatar ? '4px' : 'lg'}
										borderTopRightRadius={isSelf ? '4px' : 'lg'}
									>
										<VoiceMessagePlayer
											url={message.audioUrl}
											isSelf={isSelf}
											onPause={(paused) =>
												handleVoiceMessagePause(message.id, paused)
											}
										/>
										<Flex justifyContent={'flex-end'} align='center' gap={1}>
											<Text
												fontSize='10px'
												color={whatsappColors.timeStampColor}
												mr={1}
											>
												{formatMessageTime(message.timestamp)}
											</Text>
											{isSelf && (
												<>
													{message.status === 'read' ? (
														<FaCheckDouble size='10px' color='#34B7F1' />
													) : message.status === 'delivered' ? (
														<FaCheckDouble
															size='10px'
															color={whatsappColors.timeStampColor}
														/>
													) : (
														<FaCheck
															size='10px'
															color={whatsappColors.timeStampColor}
														/>
													)}
												</>
											)}
										</Flex>
									</Box>
								)} */}
									{/* {message.type === 'file' && (
									<FileMessage
										file={message.file}
										isSelf={isSelf}
										onDownload={() => handleDownloadFile(message.file)}
										timestamp={formatMessageTime(message.timestamp)}
										status={message.status}
									/>
								)} */}
								</Flex>
							</React.Fragment>
						);
					})
				) : (
					<Flex
						direction='column'
						align='center'
						justify='center'
						h='60vh'
						overflow='hidden'
						py={10}
						color='gray.500'
					>
						<FiMessageCircle size={48} />
						<Text mt={3} fontSize='md' fontWeight='medium'>
							No chat history available
						</Text>
						<Text fontSize='sm'>Start a conversation to see messages here</Text>
					</Flex>
				)}
				{/* <div ref={messagesEndRef} /> */}
				{isSending && (
					<Flex justify='flex-end' pr={4}>
						<Spinner size='sm' color={whatsappColors.primary} />
					</Flex>
				)}

				{/* Anchor to scroll to */}
				<Box ref={messagesEndRef} />
			</VStack>
		</Box>
	);
};

export default ChatMessages;
