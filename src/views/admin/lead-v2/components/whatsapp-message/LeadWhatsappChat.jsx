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
import { IoSend } from 'react-icons/io5';
import { FiUsers } from 'react-icons/fi';

import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import { maskPhoneNumber } from 'utils/webrtc';
import { getChat } from '../../../../../redux/whatsappWebSlice';
import MediaAttachment from 'views/admin/whatsapp-v2/UserWhatsapp/_components/_shared/MediaAttachment';
import ChatMessage from 'views/admin/whatsapp-v2/UserWhatsapp/_components/ChatMessage';

const LeadWhatsappChat = ({ chatId, sessionId }) => {
	const [message, setMessage] = useState('');
	const { sendMessage, activeChat } = useWhatsapp();

	const chat = useSelector((state) => getChat(state, chatId));

	const [sending, setSending] = useState(false);

	const handleSendMessage = ({ media, caption } = {}) => {
		if (message.trim() || media) {
			const whatsappPayload = {
				sessionId,
				to: chatId,
				message,
				...(media && { media }),
				...(caption && { options: { caption } }),
			};

			setSending(true);

			sendMessage(whatsappPayload);
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
		<Flex
			direction='column'
			maxH={{ base: '60dvh', md: '80dvh' }}
			overflow='scroll'
			scrollBehavior='smooth'
			bg='linear-gradient(135deg, rgba(250, 247, 231, 0.4), rgba(237, 209, 153, 0.4))'
			backdropFilter='blur(16px) saturate(180%)'
			webkitbackdropfilter='blur(16px) saturate(180%)'
			border='1px solid rgba(255, 255, 255, 0.3)'
			boxShadow='0 8px 32px rgba(31, 38, 135, 0.1)'
			borderRadius='xl'
		>
			{/* Header */}
			{/* <Box
				p={4}
				borderBottom='1px solid #e0e0e0'
				bg={whatsappColors.headerBg}
				shadow='sm'
			>
				<HStack gap='2' align='center'>
					<Avatar size='sm' {...avatarProps} />

					<Text
						// userSelect='none'
						// filter='blur(4px)'
						fontWeight='bold'
						fontSize={{ base: 'sm', md: 'md' }}
					>
						{maskPhoneNumber(activeChat?.name) || '***********'}
					</Text>
				</HStack>
			</Box> */}

			{/* Messages Container */}
			<ChatMessage
				chat={chat}
				chatId={chatId}
				sessionId={sessionId}
				setSending={setSending}
				sending={sending}
			/>

			{/* Input Area */}
			<Box p={2}>
				<HStack spacing={2}>
					<MediaAttachment onSend={handleSendMessage} />

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

export default LeadWhatsappChat;
