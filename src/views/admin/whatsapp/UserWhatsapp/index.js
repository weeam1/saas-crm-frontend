import { useFetchItemsQuery } from 'api/apiSlice';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Whatsapp from '../index';
import { setContacts, setCurrentUser } from '../../../../redux/whatsappSlice';
import { useDispatch } from 'react-redux';

import Loader from 'components/loading/Loader';
import AppButton from 'components/shared/AppButton';
import { FaChevronLeft } from 'react-icons/fa';
import WhatsappConfigModal from './WhatsappConfigModal';
import { HStack } from '@chakra-ui/react';

const UserWhatsapp = () => {
	const { id } = useParams();

	const { data: contactsData, isLoading: usersLoading } = useFetchItemsQuery(
		{
			path: '/whatsapp/contacts',
			params: { userId: id },
		},
		{
			refetchOnMountOrArgChange: true,
			skip: !id,
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
			<HStack justify='space-between' mb='2'>
				<AppButton
					leftIcon={<FaChevronLeft />}
					onClick={() => navigate('/whatsapp')}
				>
					Back
				</AppButton>
				<WhatsappConfigModal />
			</HStack>
			<Whatsapp />
		</>
	);
};

export default UserWhatsapp;
