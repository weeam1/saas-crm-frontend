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
import { HStack } from '@chakra-ui/react';
import { usePermissions } from 'hooks/usePermissions';
import WhatsappQRLogin from './WhatsappQRLogin';
import { useWhatsappEvents } from 'hooks/useWhatsappEvents';
import useUserSession from 'hooks/useUserSession';

const UserWhatsapp = () => {
	const { id } = useParams();

	const [userId, setUserId] = useState('');

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

	const { whatsappInitilize } = useWhatsappEvents();

	// const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
	// 	{
	// 		path: `/user/v2/view/${param.id}`,
	// 	},
	// 	{
	// 		skip: isSuperAdmin,
	// 		refetchOnMountOrArgChange: true,
	// 	}
	// );

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

			{isWhatsappLoggedIn ? <Whatsapp /> : <WhatsappQRLogin />}
		</>
	);
};

export default UserWhatsapp;
