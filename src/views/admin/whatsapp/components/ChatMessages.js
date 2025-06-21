import { Flex, Box, VStack, Text, Spinner } from '@chakra-ui/react';
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

const ChatMessages = ({ chat, isSending, from = '654212707774447', to }) => {
	const messagesEndRef = useRef(null);
	const scrollRef = useRef();

	const messages = useSelector((state) => state.whatsapp.chats[to] || []);

	const [chatQuery, setChatQuery] = useState({
		from,
		to,
		page: 1,
		limit: 10,
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
			skip: !to && !from,
			refetchOnMountOrArgChange: true,
		}
	);

	const dispatch = useDispatch();

	useEffect(() => {
		if (to) {
			setChatQuery((prev) => ({ ...prev, to, page: 1, limit: 10 }));
			refetchChat({
				path: '/whatsapp/chat_history',
				params: chatQuery,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [to]);

	// Append or prepend messages on data fetch
	useEffect(() => {
		if (chatData?.doc?.length > 0 && chatQuery.page > 1) {
			dispatch(prependMessages({ chatId: to, messages: chatData?.doc }));
		} else if (chatData?.doc?.length > 0 && chatQuery.page === 1) {
			dispatch(setChatHistory({ chatId: to, messages: chatData?.doc }));
		}

		const el = scrollRef.current;
		if (el && chatQuery.page === 1) {
			el.scrollTop = el.scrollHeight;
		}
	}, [chatData?.doc, chatQuery.page, dispatch, to]);

	// Scroll detection
	const handleScroll = useCallback(() => {
		const container = scrollRef.current;

		console.log('Scroll lookup: ', container.scrollTop);
		if (!container) return;

		if (
			container.scrollTop === 0 &&
			!chatFetching &&
			chatQuery?.page <= chatData?.pagination?.totalPages
		) {
			setChatQuery((prev) => ({
				...prev,
				page: prev.page + 1,
			}));
		}
	}, [chatFetching]);

	useEffect(() => {
		const container = scrollRef.current;
		if (container) {
			container.addEventListener('scroll', handleScroll);
			return () => container.removeEventListener('scroll', handleScroll);
		}
	}, [handleScroll]);

	return (
		<Box
			ref={scrollRef}
			flex='1'
			px={4}
			py={2}
			overflowY='auto'
			scrollBehavior='smooth'
			maxH='100vh'
			bg='gray.100'
			color='white'
		>
			<VStack spacing={4} align='stretch'>
				{chatFetching && <Loader />}

				{chatLoading ? (
					<Loader />
				) : chatData?.doc?.length > 0 && messages?.length > 0 ? (
					messages?.map((message) => {
						if (message.type === 'date') {
							return (
								<Flex key={message.id} justify='center' my={2}>
									<Box
										bg='rgba(0, 0, 0, 0.1)'
										px={3}
										py={1}
										borderRadius='full'
									>
										<Text fontSize='xs' color='gray.600'>
											{message.date}
										</Text>
									</Box>
								</Flex>
							);
						}
						// const isSelf = message.sender.id === currentUser.id;
						const isSelf = message.from === from;

						return (
							<React.Fragment key={message._id}>
								<Flex
									direction='column'
									align={isSelf ? 'flex-end' : 'flex-start'}
									_hover={{ bg: whatsappColors.messageHoverBg }}
									p={1}
									borderRadius='md'
									transition='background 0.2s ease'
									// mt={showAvatar ? 3 : 1}
								>
									{/* {showAvatar && (
									<Flex align='center' mb={1}>
										<Avatar src={message.sender.avatar} size='xs' mr={2} />
										<Text fontSize='xs' color={whatsappColors.timeStampColor}>
											{message.sender.name}
										</Text>
									</Flex>
								)} */}
									{/* Reply indicator */}
									{/* {message.replyTo && (
									<Box
										bg={whatsappColors.replyBg}
										borderLeft={`3px solid ${whatsappColors.replyBorder}`}
										borderRadius='md'
										p={2}
										mb={1}
										maxW={{ base: '90%', md: '80%' }}
										alignSelf={isSelf ? 'flex-end' : 'flex-start'}
									>
										<Text fontSize='xs' color={whatsappColors.textSecondary}>
											{message.replyTo.sender.name}
										</Text>
										<Text
											fontSize='sm'
											color={whatsappColors.textDark}
											isTruncated
										>
											{message.replyTo.text || 'Media message'}
										</Text>
									</Box>
								)} */}
									{message.type === 'text' && (
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
													{/* {formatMessageTime(message.sendAt)} */}
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
									)}
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
										borderTopLeftRadius={!isSelf && !showAvatar ? '4px' : 'lg'}
										borderTopRightRadius={isSelf ? '4px' : 'lg'}
									>
										<img
											src={message.file.url}
											alt='shared'
											style={{
												maxWidth: '100%',
												borderRadius: '8px',
												maxHeight: '300px',
												objectFit: 'contain',
												cursor: 'pointer',
											}}
											onClick={() => setSelectedImage(message.file.url)}
										/>
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
					<Text>No Chat data avaliable</Text>
				)}
				{/* <div ref={messagesEndRef} /> */}
				{isSending && (
					<Flex justify='flex-end' pr={4}>
						<Spinner size='sm' color={whatsappColors.primary} />
					</Flex>
				)}
			</VStack>
		</Box>
	);
};

export default ChatMessages;
