import { useFetchItemsQuery } from 'api/apiSlice';
import React, { useEffect, useState } from 'react';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import Whatsapp from '../index';
import { setContacts, setCurrentUser } from '../../../../redux/whatsappSlice';
import { useDispatch } from 'react-redux';

import Loader from 'components/loading/Loader';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import { HStack } from '@chakra-ui/react';

const UserWhatsapp = () => {
	const { id } = useParams();

	const [userId, setUserId] = useState('');

	const user = JSON.parse(localStorage.getItem('user'));

	const userRole = user?.roles[0]?.roleName || user?.role;

	useEffect(() => {
		if (id) {
			setUserId(id);
		} else if (user?._id && userRole !== 'superAdmin') {
			setUserId(user?._id);
		} else redirect('/');
	}, [id, user?._id, userRole]);

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

	const dispatch = useDispatch();

	useEffect(() => {
		if (contactsData?.doc) {
			dispatch(setContacts(contactsData?.doc));
			dispatch(setCurrentUser(contactsData?.userData));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contactsData?.doc]);

	const navigate = useNavigate();

	return usersLoading ? (
		<Loader />
	) : (
		<>
			{userRole === 'superAdmin' && (
				<HStack justify='space-between' mb='2'>
					<AppButton
						leftIcon={<FaChevronLeft />}
						onClick={() => navigate('/whatsapp')}
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
