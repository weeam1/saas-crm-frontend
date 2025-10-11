import {
	Box,
	Flex,
	Text,
	Avatar,
	Badge,
	VStack,
	HStack,
	Divider,
	Input,
	InputGroup,
	InputLeftElement,
	Icon,
	Button,
	IconButton,
	Spinner,
} from '@chakra-ui/react';
import { SearchIcon, CheckIcon } from '@chakra-ui/icons';
import { FiMessageSquare, FiUsers } from 'react-icons/fi';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useUserSession from 'hooks/useUserSession';
import { useSelector } from 'react-redux';

const formatTime = (timestamp) => {
	if (!timestamp) return '';
	const date = new Date(timestamp * 1000);
	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	});
};

const truncateMessage = (message, length = 35) => {
	if (!message) return 'No messages';
	return message.length > length
		? message.substring(0, length) + '...'
		: message;
};

const ChatList = ({
	allConversations,
	sessionId,
	setSelectedChat,
	selectedChat,
	logoutHandler,
	getChat,
	getMoreChats,
	hasMoreChats,
}) => {
	const onSelectedChatHandler = (chat) => {
		setSelectedChat(chat);
		getChat(sessionId, chat);
	};

	const { isChatsFetching } = useSelector((state) => state.whatsappWeb);

	const navigate = useNavigate();
	const { isSuperAdmin } = useUserSession();

	return (
		<Box
			// rounded='lg'
			shadow='sm'
			border='1px solid'
			borderColor='gray.100'
			// maxH='800px'
			// overflow='hidden'
			display='flex'
			flexDir='column'
			h='full'
		>
			{/* Header */}
			<Flex
				flexDir={{ base: 'column', md: 'row' }}
				alignItems='center'
				justifyContent='space-between'
				w='full'
				p={4}
				borderBottom='1px solid'
				borderColor='softGray.100'
			>
				<HStack>
					{isSuperAdmin && (
						<IconButton
							aria-label='Back'
							icon={<FaChevronLeft size={16} />}
							variant='ghost'
							onClick={() => navigate('/whatsapp/instances')}
						/>
					)}

					<Text fontSize='sm' fontWeight='bold' color='gray.800'>
						Chats
					</Text>
					{/* <Text fontSize='xs' color='gray.500' mt={1}>
						{allConversations?.length} conversations
					</Text> */}
				</HStack>

				<Button size='xs' onClick={logoutHandler}>
					Logout Whatsapp
				</Button>

				{/* Search Bar */}
				{/* <InputGroup mt={3}>
					<InputLeftElement pointerEvents='none'>
						<SearchIcon color='gray.400' />
					</InputLeftElement>
					<Input
						placeholder='Search chats...'
						bg='gray.50'
						border='1px solid'
						borderColor='gray.200'
						_focus={{
							borderColor: 'green.400',
							boxShadow: '0 0 0 1px green.400',
						}}
					/>
				</InputGroup> */}
			</Flex>

			{/* Chat List */}
			<VStack
				spacing={0}
				divider={<Divider />}
				p='2'
				flex='1'
				overflowY='auto'
				// maxH='full'
			>
				{allConversations?.map((chat, index) => (
					<ChatListItem
						key={chat.id + index}
						chat={chat}
						onSelectedChatHandler={onSelectedChatHandler}
						sessionId={sessionId}
						selectedChat={selectedChat}
					/>
				))}

				{/* Pagination / Load More */}
				<Flex
					p={3}
					justify='center'
					borderTop='1px solid'
					borderColor='gray.100'
				>
					{isChatsFetching ? (
						<Spinner />
					) : hasMoreChats ? (
						<Button
							variant='ghost'
							size='sm'
							onClick={getMoreChats}
							leftIcon={<FiMessageSquare />}
							colorScheme='green'
						>
							Load More
						</Button>
					) : (
						<Text fontSize='xs' color='gray.400'>
							All chats loaded ✅
						</Text>
					)}
				</Flex>
			</VStack>
		</Box>
	);
};

const ChatListItem = ({
	chat,
	onSelectedChatHandler,
	sessionId,
	selectedChat,
}) => {
	const getAvatarProps = (chat) => {
		if (chat?.profilePicture) {
			return {
				src: chat?.profilePicture,
				name: chat?.name,
			};
		}

		if (chat?.isGroup) {
			return {
				bg: 'purple.500',
				icon: <FiUsers color='white' />,
			};
		}

		return {
			name: chat?.name,
			bg: 'green.500',
			color: 'white',
		};
	};

	const avatarProps = getAvatarProps(chat);

	return (
		<Box
			p={2}
			w='100%'
			cursor='pointer'
			// _hover={{ bg: 'gray.50' }}
			transition='all 0.2s'
			bg={selectedChat?.id === chat?.id ? 'softGray.100' : 'transparent'}
			rounded={selectedChat?.id === chat?.id ? 'md' : '1px'}
			borderLeft='4px solid transparent'
			_hover={{ borderLeftColor: 'green.400' }}
			onClick={() => onSelectedChatHandler(chat)}
		>
			<Flex align='center' justify='space-between'>
				<Flex align='center' flex='1' minW='0'>
					<Avatar size='md' {...avatarProps} mr={3} />

					<Box flex='1' minW='0'>
						<Flex align='center' justify='space-between' mb={1}>
							<Text
								fontWeight='semibold'
								// color='gray.800'
								isTruncated
								maxW='70%'
								fontSize='sm'
								noOfLines={1}
								filter='blur(4px)'
							>
								{chat?.name || '***********'}
								{/* ************** */}
							</Text>

							{/* Badges */}
							{/* <HStack ml={2} spacing={1}>
								{chat.isGroup && (
									<Badge colorScheme='purple' size='xs' variant='subtle'>
										Group
									</Badge>
								)}
								{chat?.pinned && (
									<Badge colorScheme='yellow' size='xs' variant='subtle'>
										Pinned
									</Badge>
								)}
								{chat?.archived && (
									<Badge colorScheme='gray' size='xs' variant='subtle'>
										Archived
									</Badge>
								)}
							</HStack> */}

							{/* Message Status & Time */}
							<Flex
								align='center'
								justifySelf='flex-end'
								justify='space-between'
							>
								<Text
									fontSize='xs'
									color={chat.unreadCount ? 'green.500' : 'gray.500'}
								>
									{chat.lastMessage?.timestamp
										? formatTime(chat.lastMessage.timestamp)
										: ''}
								</Text>
							</Flex>
						</Flex>

						{/* Last Message */}
						<HStack justifyContent='space-between'>
							<Text fontSize='xs' color='gray.600' noOfLines={1} mb={1}>
								{chat.lastMessage
									? truncateMessage(chat.lastMessage.body)
									: 'No messages yet'}
							</Text>
							{/* Unread Count */}
							{chat?.unreadCount > 0 && (
								<Box
									bg='green.500'
									color='white'
									borderRadius='full'
									minW='18px'
									minH='18px'
									display='flex'
									alignItems='center'
									justifyContent='center'
									fontSize='xs'
									fontWeight='bold'
								>
									{chat.unreadCount}
								</Box>
							)}
						</HStack>
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
};

export default ChatList;
