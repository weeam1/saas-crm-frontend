import React, { useCallback, useState } from 'react';
import { Flex, Box, Text, Spinner, Button, Image } from '@chakra-ui/react';

import WhatsappQRLogin from '../_components/WhatsappQRLogin';
import WAConnectionSuccess from '../_components/WAConnectionSuccess';
import ChatList from '../_components/ChatList';
import Chat from '../_components/Chat';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';
import Loader from 'components/loading/Loader';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../_components/ErrorState';
import BrandLogo from 'assets/logo/logo.png';

const WhatsappScreen = ({ sessionId, loadingChats }) => {
	const [selectedChat, setSelectedChat] = useState(null);
	// check whatsapp user account is authenticated or login pervoius session exisit
	const isWhatsappAuth = localStorage.getItem('whatsapp_auth') || false;

	const navigate = useNavigate();

	const {
		// values
		userChats,
		qr,
		isReady,
		allConversations,
		error,
		fail,
		whatsapp_disconnect,
		logoutWhatsapp,
		getChat,
	} = useWhatsapp();

	const logoutHandler = () => {
		logoutWhatsapp(sessionId);
		navigate('/');
	};

	// ---- State Handling ----
	const renderContent = () => {
		// Usage
		if (error || fail) {
			return <ErrorState message={error || fail} type='error' />;
		}

		if (whatsapp_disconnect) {
			return (
				<ErrorState
					message='WhatsApp disconnected. Please reconnect.'
					type='warning'
				/>
			);
		}

		if (!loadingChats && isReady && allConversations?.length > 0) {
			return (
				<Flex h='100%' bg='white' color='gray.700' rounded='md'>
					{/* Left Sidebar (Chats List) */}
					<Box w='30%' borderRight='1px solid #ddd' overflowY='auto'>
						<ChatList
							allConversations={allConversations}
							sessionId={sessionId}
							setSelectedChat={setSelectedChat}
							selectedChat={selectedChat}
							logoutHandler={logoutHandler}
							getChat={getChat}
						/>
					</Box>

					{/* Right Chat Screen */}
					<Box w='70%' h='100%' bg='#f7f7f7'>
						{userChats[selectedChat?.id] ? (
							<Chat chatId={selectedChat?.id} sessionId={sessionId} />
						) : selectedChat ? (
							<Loader />
						) : (
							<Flex
								align='center'
								justify='center'
								direction='column'
								h='full'
								color='gray.800'
							>
								{/* Illustration */}
								<Image src={BrandLogo} alt='Weeam CRM' maxW='60px' mb={6} />
								{/* Title */}
								<Text fontSize='xl' fontWeight='medium' mb={2}>
									Manage Your Customer Chats Seamlessly
								</Text>

								{/* Subtitle */}
								<Text
									fontSize='sm'
									color='gray.600'
									maxW='500px'
									textAlign='center'
									mb={6}
								>
									Stay connected with clients, track conversations, and boost
									productivity by handling all customer chats directly from your
									CRM Whatsapp.
								</Text>

								{/* Footer note */}
								<Text fontSize='xs' color='gray.500' mt={12}>
									🔒 Your personal messages are end-to-end encrypted
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

		if (qr) {
			return <WhatsappQRLogin qr={qr} />;
		}
	};

	return (
		<Flex h='90vh' w='100%'>
			<Box w='100%' h='100%'>
				{renderContent()}
			</Box>
		</Flex>
	);
};

export default WhatsappScreen;
