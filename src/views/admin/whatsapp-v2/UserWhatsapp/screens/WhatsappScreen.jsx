import React, { useState } from 'react';
import { Flex, Box, Text, Spinner, Button } from '@chakra-ui/react';

import WhatsappQRLogin from '../_components/WhatsappQRLogin';
import WAConnectionSuccess from '../_components/WAConnectionSuccess';
import ChatList from '../_components/ChatList';
import Chat from '../_components/Chat';
import ErrorMessage from 'components/Message/ErrorMessage';

const WhatsappScreen = ({
	whatsappErrorMessage,
	error,
	fail,
	whatsapp_disconnect,
	loadingChats,
	isReady,
	isWhatsappAuth,
	allConversations,
	qr,
	userId,
}) => {
	const [selectedChat, setSelectedChat] = useState(null);

	// ---- State Handling ----
	const renderContent = () => {
		if (whatsappErrorMessage) {
			return (
				<ErrorMessage
					message='This user has no WhatsApp account'
					type='warning'
				/>
			);
		}

		if (error || fail) {
			return <Text color='red.500'>{error || fail}</Text>;
		}

		if (whatsapp_disconnect) {
			return (
				<Text color='orange.400'>WhatsApp disconnected. Please reconnect.</Text>
			);
		}

		if (
			!loadingChats &&
			isReady &&
			isWhatsappAuth &&
			allConversations?.length > 0
		) {
			return (
				<Flex h='100%'>
					{/* Left Sidebar (Chats List) */}
					<Box
						w='30%'
						borderRight='1px solid #ddd'
						overflowY='auto'
						bg='gray.50'
					>
						<ChatList
							allConversations={allConversations}
							userId={userId}
							onSelectChat={setSelectedChat}
							selectedChat={selectedChat}
						/>
					</Box>

					{/* Right Chat Screen */}
					<Box w='70%' h='100%' bg='white'>
						{selectedChat ? (
							<Chat chat={selectedChat} />
						) : (
							<Flex align='center' justify='center' h='100%' direction='column'>
								<Text fontSize='lg' fontWeight='semibold'>
									Select a chat to start messaging
								</Text>
								<Text fontSize='sm' color='gray.500'>
									Your conversations will appear here.
								</Text>
							</Flex>
						)}
					</Box>
				</Flex>
			);
		}

		if (isReady) {
			return <WAConnectionSuccess loadingChats={loadingChats} />;
		}

		return qr && <WhatsappQRLogin qr={qr} />;
	};

	return (
		<Flex h='100vh' w='100%' bg='gray.100'>
			<Box w='100%' h='100%'>
				{renderContent()}
			</Box>
		</Flex>
	);
};

export default WhatsappScreen;
