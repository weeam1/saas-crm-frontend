import { useState, useRef, useEffect, useMemo } from 'react';
import {
	Flex,
	Box,
	Text,
	Input,
	IconButton,
	HStack,
	Avatar,
} from '@chakra-ui/react';

import { whatsappColors } from 'utils/helpers';
import { useSelector } from 'react-redux';
import { getChat } from '../../../../../redux/whatsappWebSlice';
import { IoSend } from 'react-icons/io5';
import { FiUsers } from 'react-icons/fi';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import ChatMessage from './ChatMessage';

const Chat = ({ chatId, sessionId }) => {
	const [message, setMessage] = useState('');

	const chat = useSelector((state) => getChat(state, chatId));

	const { sendMessage, activeChat } = useWhatsapp();

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
			<ChatMessage chat={chat} chatId={chatId} sessionId={sessionId} />

			{/* Input Area */}
			<Box p={2}>
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
