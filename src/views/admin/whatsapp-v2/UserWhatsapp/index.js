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

	const [sessionId, setSessionId] = useState('');
	const [whatsappErrorMessage, setWhatsappErrorMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingChats, setLoadingChats] = useState(false);

	const { user: loginUser, isSuperAdmin } = useUserSession();

	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	const { data: instanceData, isLoading: instanceLoading } = useFetchItemsQuery(
		{
			path: `/whatsapp/instances/user/${loginUser?._id}`,
		},
		{
			refetchOnMountOrArgChange: true,
			skip: !loginUser?._id && isSuperAdmin,
		}
	);

	// ---------------------------
	// 1. Permission check + sessionId setup
	// ---------------------------
	useEffect(() => {
		if (!hasPermission('whatsapp')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (id) {
			setSessionId(id);
		}
		// whatsapp instance + instance is active
		else if (instanceData?.doc && instanceData?.doc?.isActive) {
			const _sessionId = instanceData?.doc?.sessionId;
			setSessionId(_sessionId);
			window.history.replaceState(null, '', `?session=${_sessionId}`);
		}
		// if account id disabled
		else if (!instanceData?.doc?.isActive) {
			console.log('whatsapp deisbaled');
			setWhatsappErrorMessage(
				'WhatsApp instance is inactive. Please contact your administrator to re-enable it.'
			);
		} else redirect('/');
	}, [id, instanceData?.doc, instanceData?.doc?.isActive]);

	console.log({ whatsappErrorMessage });

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
	// const { data: userDetails, isLoading: userLoading } = useFetchItemsQuery(
	// 	{ path: `/user/v2/view/${sessionId}` },
	// 	{ skip: !sessionId, refetchOnMountOrArgChange: true }
	// );

	const [initialized, setInitialized] = useState(false);

	// ---------------------------
	// 2. Initialize WhatsApp ONCE when socket + userDetails are ready
	// ---------------------------
	useEffect(() => {
		if (!isSocketConnected) {
			setWhatsappErrorMessage('Socket is not connected! Please reload.');
			return;
		}

		if (!initialized && sessionId) {
			whatsappInitialize({
				sessionId,
			});
			setInitialized(true);
		}
	}, [isSocketConnected, initialized, sessionId, whatsappInitialize]);

	// ---------------------------
	// 3. Fetch chats when ready (only once per ready state)
	// ---------------------------
	useEffect(() => {
		if (isReady && sessionId) {
			localStorage.setItem('whatsapp_auth', 'true');
			getChats(sessionId);
			setIsLoading(false);
		} else if (!qr) {
			setIsLoading(true);
		} else if (qr) {
			setIsLoading(false);
		}
	}, [isReady, sessionId, getChats, qr]);

	// ---------------------------
	// 4. Manage loadingChats animation
	// ---------------------------
	useEffect(() => {
		if (isReady) {
			setLoadingChats(true);

			if (allConversations?.length) {
				const timer = setTimeout(() => setLoadingChats(false), 1000);
				return () => clearTimeout(timer);
			}
		}
	}, [isReady, allConversations]);

	// ---------------------------
	// 5. Cleanup on unmount / reload
	// ---------------------------
	const disconnectedRef = useRef(false);

	const safeDisconnect = useCallback(() => {
		if (!disconnectedRef.current && sessionId) {
			disconnectWhatsapp(sessionId);
			disconnectedRef.current = true;
		}
	}, [disconnectWhatsapp, sessionId]);

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

			{isLoading && !whatsappErrorMessage ? (
				<InitialLoading />
			) : whatsappErrorMessage ? (
				<ErrorMessage message={whatsappErrorMessage} type='warning' />
			) : (
				<WhatsappScreen loadingChats={loadingChats} sessionId={sessionId} />
			)}
		</>
	);
};

export default UserWhatsapp;
