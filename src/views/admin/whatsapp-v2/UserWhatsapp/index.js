// import { useFetchItemsQuery } from 'api/apiSlice';
// import React, { useEffect, useRef, useState } from 'react';
// import { redirect, useNavigate, useParams } from 'react-router-dom';
// import Whatsapp from '../index';
// import {
// 	setActiveChat,
// 	setContacts,
// 	setCurrentUser,
// } from '../../../../redux/whatsappSlice';
// import { useDispatch } from 'react-redux';

// import Loader from 'components/loading/Loader';
// import AppButton from 'components/shared/AppButton';
// import { FaChevronLeft } from 'react-icons/fa';
// import { HStack, Spinner, Text } from '@chakra-ui/react';
// import { usePermissions } from 'hooks/usePermissions';
// import WhatsappQRLogin from './_components/WhatsappQRLoginScreen';
// import { useWhatsappEvents } from 'hooks/whatsapp/useWhatsappEvents';
// import useUserSession from 'hooks/useUserSession';
// import ErrorMessage from 'components/Message/ErrorMessage';
// import ChatList from './_components/ChatList';
// import WAConnectionSuccess from './_components/WAConnectionSuccess';
// import InitialLoadingScreen from './_components/InitialLoadingScreen';
// import InitialLoading from './_components/InitialLoading';
// import WhatsappScreen from './screens/WhatsappScreen';

// const UserWhatsapp = () => {
// 	const { id } = useParams();

// 	const [userId, setUserId] = useState('');
// 	const [whatsappErrorMessage, setWhatsappErrorMessage] = useState(null);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [loadingChats, setLoadingChats] = useState(false);

// 	// check whatsapp user account is authenticated or login pervoius session exisit
// 	const isWhatsappAuth = localStorage.getItem('whatsapp_auth') || false;

// 	const { user: loginUser, userRoleName, isSuperAdmin } = useUserSession();

// 	const navigate = useNavigate();
// 	const { hasPermission } = usePermissions();

// 	useEffect(() => {
// 		if (!hasPermission('whatsapp')) return navigate('/default');
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, []);

// 	useEffect(() => {
// 		if (id) {
// 			setUserId(id);
// 		} else redirect('/');
// 	}, [id]);

// 	const {
// 		// events
// 		whatsappInitialize,
// 		disconnectWhatsapp,
// 		getChats,

// 		// values
// 		isSocketConnected,
// 		qr,
// 		isReady,
// 		allConversations,
// 		error,
// 		fail,
// 		whatsapp_disconnect,
// 	} = useWhatsappEvents();

// 	const { data: userDetails, isLoading: userLoading } = useFetchItemsQuery(
// 		{
// 			path: `/user/v2/view/${userId}`,
// 		},
// 		{
// 			skip: !userId,
// 			refetchOnMountOrArgChange: true,
// 		}
// 	);

// 	const [initialized, setInitialized] = useState(false);

// 	useEffect(() => {
// 		// Handle WhatsApp initialization
// 		if (!initialized && isSocketConnected && userDetails) {
// 			if (!userDetails?.whatsappDetails?.phoneNumber) {
// 				setWhatsappErrorMessage('This user has no WhatsApp account');
// 				return;
// 			}

// 			whatsappInitialize({
// 				userId,
// 				phoneNumber: userDetails.whatsappDetails.phoneNumber,
// 			});

// 			setInitialized(true);
// 		}

// 		// Handle loading state
// 		if (isReady || (qr && qr.trim() !== '')) {
// 			setIsLoading(false);
// 		} else {
// 			setIsLoading(true);
// 		}

// 		// Fetch chats when ready
// 		if (isReady && userId) {
// 			!isWhatsappAuth && localStorage.setItem('whatsapp_auth', true);
// 			getChats(userId);
// 		}

// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [
// 		initialized,
// 		isSocketConnected,
// 		userDetails,
// 		userId,
// 		isReady,
// 		qr,
// 		getChats,
// 		whatsappInitialize,
// 		disconnectWhatsapp,
// 	]);

// 	useEffect(() => {
// 		if (isReady) {
// 			setLoadingChats(true);

// 			// Only start timer when chats exist
// 			if (allConversations?.length) {
// 				const timer = setTimeout(() => setLoadingChats(false), 3000);
// 				return () => clearTimeout(timer);
// 			}
// 		}
// 	}, [isReady, allConversations]);

// 	console.log({ qr, isReady, allConversations });

// 	console.log({ loadingChats });

// 	const disconnectedRef = useRef(false);

// 	const safeDisconnect = () => {
// 		if (!disconnectedRef.current && userId) {
// 			disconnectWhatsapp(userId);
// 			disconnectedRef.current = true; // mark as disconnected
// 		}
// 	};

// 	useEffect(() => {
// 		// Cleanup when component unmounts
// 		return () => {
// 			safeDisconnect();
// 		};
// 	}, [userId]);

// 	useEffect(() => {
// 		const handleBeforeUnload = () => safeDisconnect();

// 		window.addEventListener('beforeunload', handleBeforeUnload);
// 		window.addEventListener('unload', handleBeforeUnload);

// 		return () => {
// 			window.removeEventListener('beforeunload', handleBeforeUnload);
// 			window.removeEventListener('unload', handleBeforeUnload);
// 		};
// 	}, [userId]);

// 	if (whatsapp_disconnect) console.log(whatsapp_disconnect);
// 	if (error) console.log(error);

// 	return isLoading || userLoading ? (
// 		<InitialLoading />
// 	) : (
// 		<>
// 			{userRoleName === 'superAdmin' && (
// 				<HStack justify='space-between' mb='2'>
// 					<AppButton
// 						leftIcon={<FaChevronLeft />}
// 						onClick={() => navigate('/whatsapp/chats')}
// 					>
// 						Back
// 					</AppButton>
// 				</HStack>
// 			)}

// 			<WhatsappScreen loadingChats={loadingChats} />

// 			{whatsappErrorMessage ? (
// 				<ErrorMessage
// 					message='This user has no WhatsApp account'
// 					type='warning'
// 				/>
// 			) : error || fail ? (
// 				<Text>{error || fail}</Text>
// 			) : whatsapp_disconnect ? (
// 				<Text>{whatsapp_disconnect}</Text>
// 			) : !loadingChats &&
// 			  isReady &&
// 			  isWhatsappAuth &&
// 			  allConversations?.length > 0 ? (
// 				<ChatList allConversations={allConversations} userId={userId} />
// 			) : isReady ? (
// 				<WAConnectionSuccess loadingChats={loadingChats} />
// 			) : (
// 				qr && <WhatsappQRLogin qr={qr} />
// 			)}
// 		</>
// 	);
// };

// export default UserWhatsapp;
