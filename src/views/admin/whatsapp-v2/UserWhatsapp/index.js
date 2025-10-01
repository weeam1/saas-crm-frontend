import { useFetchItemsQuery } from 'api/apiSlice';
import React, { useEffect, useState } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import Whatsapp from '../index';
import {
	setActiveChat,
	setContacts,
	setCurrentUser,
} from '../../../../redux/whatsappSlice';
import { useDispatch } from 'react-redux';

import Loader from 'components/loading/Loader';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import { HStack, Text } from '@chakra-ui/react';
import { usePermissions } from 'hooks/usePermissions';
import WhatsappQRLogin from './WhatsappQRLogin';
import { useWhatsappEvents } from 'hooks/whatsapp/useWhatsappEvents';
import useUserSession from 'hooks/useUserSession';
import ErrorMessage from 'components/Message/ErrorMessage';

const UserWhatsapp = () => {
	const { id } = useParams();

	const [userId, setUserId] = useState('');
	const [whatsappErrorMessage, setWhatsappErrorMessage] = useState(null);

	const { user: loginUser, userRoleName, isSuperAdmin } = useUserSession();

	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	useEffect(() => {
		if (!hasPermission('whatsapp')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (id) {
			setUserId(id);
		} else if (loginUser?._id && userRoleName !== 'superAdmin') {
			setUserId(loginUser?._id);
		} else redirect('/');
	}, [id, loginUser?._id, userRoleName]);

	const [isWhatsappLoggedIn, setIsWhatsppLoggedIn] = useState(false);

	const {
		whatsappInitialize,
		isSocketConnected,
		qr,
		isReady,
		getChats,
		chats,
	} = useWhatsappEvents();

	console.log({ qr });

	useEffect(() => {
		if (isReady && userId) {
			// call socket event get chats
			getChats(userId);
		}
	}, [getChats, isReady, userId]);

	console.log({ isReady });
	const {
		data: userDetails,
		isLoading,
		refetch,
		isFetching,
	} = useFetchItemsQuery(
		{
			path: `/user/v2/view/${userId}`,
		},
		{
			skip: !userId,
			refetchOnMountOrArgChange: true,
		}
	);

	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (initialized) return;
		if (!isSocketConnected || !userDetails) return;

		if (!userDetails?.whatsappDetails?.phoneNumber) {
			setWhatsappErrorMessage('This User has no whatsapp account');
			return;
		}

		whatsappInitialize({
			userId,
			phoneNumber: userDetails.whatsappDetails.phoneNumber,
		});
		setInitialized(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSocketConnected, userDetails, userId, initialized]);

	useEffect(() => {
		if (!hasPermission('whatsapp')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{userRoleName === 'superAdmin' && (
				<HStack justify='space-between' mb='2'>
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/whatsapp/chats')}
					>
						Back
					</AppButton>
				</HStack>
			)}

			{whatsappErrorMessage ? (
				<ErrorMessage message='This user has no whatsapp account' />
			) : isWhatsappLoggedIn ? (
				<Whatsapp />
			) : isReady && chats ? (
				<>
					{chats?.map((chat) => (
						<Text>{chat?.name}</Text>
					))}
				</>
			) : isReady ? (
				<Text>Whatsapp is Connected Now!</Text>
			) : (
				<WhatsappQRLogin qr={qr} />
			)}
		</>
	);
};

export default UserWhatsapp;
