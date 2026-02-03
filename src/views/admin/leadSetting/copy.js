import React, { useEffect, useState } from 'react';
import LeadLimitForm from './LeadSettingModal';
import { Box, Button, Heading, Spinner } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { getApi } from 'services/api';
import { Link } from 'react-router-dom';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const LeadSetting = () => {
	const [leadLimit, setLeadLimit] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const navigate = useNavigate();

	// Fetch the lead settings when the component mounts
	useEffect(() => {
		setIsFetching(true);
		const fetchLeadSettings = async () => {
			try {
				const res = await getApi('api/lead-settings');
				if (res.status === 200) {
					// Set the initial input value
					setLeadLimit(res.data.doc.agentLeadLimit || 0);
				}
			} catch (error) {
				console.error('Error fetching lead settings:', error);
				toast.error('Could not retrieve current lead settings.');
			} finally {
				setIsFetching(false);
			}
		};

		fetchLeadSettings();
	}, []);

	return isFetching ? (
		<Spinner />
	) : (
		<Box p={6}>
			<AppButton
				ml='2'
				leftIcon={<IoArrowBack />}
				onClick={() => navigate(-1)}
				mb={4}
			>
				Back
			</AppButton>
			<Heading as='h1' size='md' textAlign='left' mb='4' color='brand.600'>
				Lead Settings
			</Heading>
			<LeadLimitForm leadLimit={leadLimit} setLeadLimit={setLeadLimit} />
		</Box>
	);
};

export default LeadSetting;
