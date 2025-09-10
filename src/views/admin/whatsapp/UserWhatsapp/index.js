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

const UserWhatsapp = () => {
	const { id } = useParams();

	const [userId, setUserId] = useState('');

	const loginUser = JSON.parse(localStorage.getItem('user'));

	const userRole = loginUser?.roles[0]?.roleName || loginUser?.role;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	useEffect(() => {
		if (!hasPermission('whatsapp')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (id) {
			setUserId(id);
		} else if (loginUser?._id && userRole !== 'superAdmin') {
			setUserId(loginUser?._id);
		} else redirect('/');
	}, [id, loginUser?._id, userRole]);

	const { data: contactsData, isLoading: usersLoading } = useFetchItemsQuery(
		{
			path: '/whatsapp/contacts',
			params: { userId },
		},
		{
			refetchOnMountOrArgChange: true,
			skip: !userId,
		}
	);

	const contacts = contactsData?.doc;
	const user = contactsData?.userData;

	useEffect(() => {
		return () => dispatch(setActiveChat(null));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (contacts) {
			dispatch(setContacts(contacts));
			dispatch(setCurrentUser(user));
		}
	}, [contacts, dispatch, user]);

	return usersLoading ? (
		<Loader />
	) : (
		<>
			{userRole === 'superAdmin' && (
				<HStack justify='space-between' mb='2'>
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/whatsapp/chats')}
					>
						Back
					</AppButton>
				</HStack>
			)}

			<Whatsapp />
		</>
	);
};

export default UserWhatsapp;
