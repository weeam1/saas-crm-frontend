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
} from '@chakra-ui/react';
import { SearchIcon, CheckIcon } from '@chakra-ui/icons';
import { FiMessageSquare, FiUsers } from 'react-icons/fi';

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
	whatsappId,
	setSelectedChat,
	selectedChat,
	logoutHandler,
	getChat,
}) => {
	const onSelectedChatHandler = (chatId) => {
		setSelectedChat(chatId);
		getChat(whatsappId, chatId);
	};

	return (
		<Box
			// rounded='lg'
			shadow='sm'
			border='1px solid'
			borderColor='gray.100'
			// maxH='800px'
			h='full'
			overflow='hidden'
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
				<Box>
					<Text fontSize='sm' fontWeight='bold' color='gray.800'>
						Chats
					</Text>
					{/* <Text fontSize='xs' color='gray.500' mt={1}>
						{allConversations?.length} conversations
					</Text> */}
				</Box>

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
				overflowY='auto'
				maxH='full'
			>
				{allConversations?.map((chat) => (
					<ChatListItem
						key={chat.id}
						chat={chat}
						onSelectedChatHandler={onSelectedChatHandler}
						whatsappId={whatsappId}
						selectedChat={selectedChat}
					/>
				))}
			</VStack>
		</Box>
	);
};

const ChatListItem = ({
	chat,
	onSelectedChatHandler,
	whatsappId,
	selectedChat,
}) => {
	const getAvatarProps = (chat) => {
		if (chat.profilePicture) {
			return {
				src: chat.profilePicture,
				name: chat.name,
			};
		}

		if (chat.isGroup) {
			return {
				bg: 'purple.500',
				icon: <FiUsers color='white' />,
			};
		}

		return {
			name: chat.name,
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
			bg={selectedChat === chat?.id ? 'softGray.100' : 'transparent'}
			rounded={selectedChat === chat?.id ? 'md' : '1px'}
			borderLeft='4px solid transparent'
			_hover={{ borderLeftColor: 'green.400' }}
			onClick={() => onSelectedChatHandler(chat?.id)}
		>
			<Flex align='center' justify='space-between'>
				<Flex align='center' flex='1' minW='0'>
					<Avatar size='md' {...avatarProps} mr={3} />

					<Box flex='1' minW='0'>
						<Flex align='center' justify='space-between' mb={1}>
							<Text
								fontWeight='semibold'
								// color='gray.800'
								fontSize='sm'
								noOfLines={1}
								filter='blur(8px)'
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
								{chat.pinned && (
									<Badge colorScheme='yellow' size='xs' variant='subtle'>
										Pinned
									</Badge>
								)}
								{chat.archived && (
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
								<Text fontSize='xs' color='gray.500'>
									{chat.lastMessage?.timestamp
										? formatTime(chat.lastMessage.timestamp)
										: ''}
								</Text>

								{/* Unread Count */}
								{chat.unreadCount > 0 && (
									<Badge
										colorScheme='green'
										variant='solid'
										borderRadius='full'
										minW='20px'
										h='20px'
										display='flex'
										alignItems='center'
										justifyContent='center'
										fontSize='xs'
									>
										{chat.unreadCount}
									</Badge>
								)}
							</Flex>
						</Flex>

						{/* Last Message */}
						<Text fontSize='xs' color='gray.600' noOfLines={1} mb={1}>
							{chat.lastMessage
								? truncateMessage(chat.lastMessage.body)
								: 'No messages yet'}
						</Text>
					</Box>
				</Flex>
			</Flex>
		</Box>
	);
};

export default ChatList;
