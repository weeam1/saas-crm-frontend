import { useFetchItemsQuery } from 'api/apiSlice';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import { HStack, Spinner, Text } from '@chakra-ui/react';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import ErrorMessage from 'components/Message/ErrorMessage';
import InitialLoading from './_components/InitialLoading';
import WhatsappScreen from './screens/WhatsappScreen';
import { useWhatsapp } from 'hooks/whatsapp/useWhatsapp';

const UserWhatsapp = () => {
	const { id } = useParams();

	const [userId, setUserId] = useState('');
	const [whatsappErrorMessage, setWhatsappErrorMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingChats, setLoadingChats] = useState(false);

	const { user: loginUser, isSuperAdmin } = useUserSession();

	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	// ---------------------------
	// 1. Permission check + userId setup
	// ---------------------------
	useEffect(() => {
		if (!hasPermission('whatsapp')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (id) {
			setUserId(id);
		} else if (loginUser?._id && !isSuperAdmin) {
			setUserId(loginUser?._id);
		} else redirect('/');
	}, [id, loginUser?._id, isSuperAdmin]);

	const {
		// events
		whatsappInitialize,
		disconnectWhatsapp,
		getChats,

		// values
		isSocketConnected,
		isAuthenticated,
		qr,
		isReady,
		allConversations,
	} = useWhatsapp();

	// --- user details query ---
	const { data: userDetails, isLoading: userLoading } = useFetchItemsQuery(
		{ path: `/user/v2/view/${userId}` },
		{ skip: !userId, refetchOnMountOrArgChange: true }
	);

	const [initialized, setInitialized] = useState(false);

	// ---------------------------
	// 2. Initialize WhatsApp ONCE when socket + userDetails are ready
	// ---------------------------
	useEffect(() => {
		if (!isSocketConnected) {
			setWhatsappErrorMessage('Socket is not connected! Please reload.');
			return;
		}

		if (!initialized && userDetails?.whatsappDetails?.phoneNumber) {
			whatsappInitialize({
				userId,
				phoneNumber: userDetails.whatsappDetails.phoneNumber,
			});
			setInitialized(true);
		}
	}, [isSocketConnected, initialized, userDetails, userId, whatsappInitialize]);

	// ---------------------------
	// 3. Fetch chats when ready (only once per ready state)
	// ---------------------------
	useEffect(() => {
		if (isReady && userId) {
			localStorage.setItem('whatsapp_auth', 'true');
			getChats(userId);
			setIsLoading(false);
		} else if (!qr) {
			setIsLoading(true);
		} else if (qr) {
			setIsLoading(false);
		}
	}, [isReady, userId, getChats, qr]);

	// ---------------------------
	// 4. Manage loadingChats animation
	// ---------------------------
	useEffect(() => {
		if (isReady) {
			setLoadingChats(true);

			if (allConversations?.length) {
				const timer = setTimeout(() => setLoadingChats(false), 3000);
				return () => clearTimeout(timer);
			}
		}
	}, [isReady, allConversations]);

	// ---------------------------
	// 5. Cleanup on unmount / reload
	// ---------------------------
	const disconnectedRef = useRef(false);

	const safeDisconnect = useCallback(() => {
		if (!disconnectedRef.current && userId) {
			disconnectWhatsapp(userId);
			disconnectedRef.current = true;
		}
	}, [disconnectWhatsapp, userId]);

	useEffect(() => {
		return () => safeDisconnect();
	}, [safeDisconnect]);

	useEffect(() => {
		const handleBeforeUnload = () => safeDisconnect();
		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('unload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('unload', handleBeforeUnload);
		};
	}, [safeDisconnect]);

	if (isLoading || userLoading) return <InitialLoading />;

	return (
		<>
			{/* {userRoleName === 'superAdmin' && (
				<HStack justify='space-between' mb='2'>
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/whatsapp/chats')}
					>
						Back
					</AppButton>
				</HStack>
			)} */}

			{whatsappErrorMessage ? (
				<ErrorMessage
					message='This user has no WhatsApp account'
					type='warning'
				/>
			) : (
				<WhatsappScreen loadingChats={loadingChats} userId={userId} />
			)}
		</>
	);
};

export default UserWhatsapp;
