import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Box, Text, Spinner, Button, Image } from '@chakra-ui/react';

import WhatsappQRLogin from '../_components/WhatsappQRLogin';
import WAConnectionSuccess from '../_components/WAConnectionSuccess';
import ChatList from '../_components/ChatList';
import Chat from '../_components/Chat';
import Loader from 'components/loading/Loader';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../_components/ErrorState';
import BrandLogo from 'assets/logo/logo.png';
import { useSelector } from 'react-redux';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';

const CHATS_LIMIT_PER_PAGE = 30;

const WhatsappScreen = ({ sessionId, loadingChats }) => {
	const [selectedChat, setSelectedChat] = useState(null);

	const [fetchingChats, setFetchingChats] = useState(false);
	const [page, setPage] = useState(1);
	// check whatsapp user account is authenticated or login pervoius session exisit
	const isWhatsappAuth = localStorage.getItem('whatsapp_auth') || false;

	const navigate = useNavigate();

	const {
		// values
		getChats,
		userChats,
		qr,
		isReady,
		allConversations,
		error,
		fail,
		whatsapp_disconnect,
		logoutWhatsapp,
		getChat,
		hasMoreChats,
	} = useWhatsapp();

	const getMoreChats = useCallback(() => {
		if (allConversations?.length >= CHATS_LIMIT_PER_PAGE * page) {
			const nextPage = page + 1;
			setPage(nextPage);
			// setFetchingChats(true);
			getChats(sessionId, nextPage, CHATS_LIMIT_PER_PAGE);
		}
	}, [allConversations?.length, getChats, page, sessionId]);

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
				<Flex h='95%' bg='white' color='gray.700' rounded='md'>
					{/* Left Sidebar (Chats List) */}
					<Box w='25%' borderRight='1px solid #ddd'>
						<ChatList
							allConversations={allConversations}
							sessionId={sessionId}
							setSelectedChat={setSelectedChat}
							selectedChat={selectedChat}
							logoutHandler={logoutHandler}
							getChat={getChat}
							getMoreChats={getMoreChats}
							fetchingChats={fetchingChats}
							hasMoreChats={hasMoreChats}
						/>
					</Box>

					{/* Right Chat Screen */}
					<Box
						w='75%'
						// h='100%'
						bg='linear-gradient(135deg, rgba(250, 247, 231, 0.4), rgba(237, 209, 153, 0.4))'
						backdropFilter='blur(16px) saturate(180%)'
						webkitbackdropfilter='blur(16px) saturate(180%)'
						border='1px solid rgba(255, 255, 255, 0.3)'
						boxShadow='0 8px 32px rgba(31, 38, 135, 0.1)'
						borderRadius='xl'
						// overflowY='auto'
						// bg='#f7f7f7'
					>
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
