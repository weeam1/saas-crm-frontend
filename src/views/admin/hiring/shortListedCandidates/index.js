import React, { useState } from 'react';
import { Box, Button, Icon } from '@chakra-ui/react';
import InvitedData from './InvitedData';
import ShortListedData from './ShortListedData';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useFetchItemsQuery } from 'api/apiSlice';

import Loader from 'components/loading/Loader';
import MeetingSection from './components/MeetingSection';

const ShortListedCandidates = () => {
	const [activeTab, setActiveTab] = useState(0);

	// const [tabLoading, setTabLoading] = useState(false);

	const handleTabChange = (tabIndex) => {
		// setTabLoading(true);
		setActiveTab(tabIndex);

		// Simulate a brief loading state
		// setTimeout(() => {
		// 	setTabLoading(false);
		// }, 400); // Adjust time as needed
	};

	const {
		data: invitedCandidates,
		isLoading: invitedCandidatesLoading,
		refetch: invitedRefetch,
	} = useFetchItemsQuery({
		path: `/applications/invited-candidates`,
		params: {
			sort: 'interviewDate',
			limit: 4,
		},
	});

	const navigate = useNavigate();

	return invitedCandidatesLoading ? (
		<Loader />
	) : (
		<Box>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/hiring')}
				mb={4}
			>
				Back
			</Button>

			<MeetingSection
				invitedCandidates={invitedCandidates}
				refetch={invitedRefetch}
				setActiveTab={setActiveTab}
			/>

			{/* Tabs for navigation */}
			<Box>
				<Box display='flex' mb={2}>
					<Button
						onClick={() => handleTabChange(0)}
						colorScheme={activeTab === 0 ? 'brand' : 'gray'}
						bg={activeTab === 0 ? 'brand.500' : 'white'}
						color={activeTab === 0 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						mr={4}
						transition='background-color 0.1s ease, color 0.1s ease'
						borderRadius='5px'
						_hover={{
							bg: activeTab === 0 ? 'brand.600' : 'gray.100',
							color: activeTab === 0 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Short Listed
					</Button>
					<Button
						onClick={() => handleTabChange(1)}
						colorScheme={activeTab === 1 ? 'brand' : 'gray'}
						bg={activeTab === 1 ? 'brand.500' : 'white'}
						color={activeTab === 1 ? 'white' : 'gray.800'}
						_focus={{ outline: 'none' }}
						borderRadius='5px'
						transition='background-color 0.1s ease, color 0.1s ease'
						_hover={{
							bg: activeTab === 1 ? 'brand.600' : 'gray.100',
							color: activeTab === 1 ? 'white' : 'gray.800',
						}}
						fontWeight='normal'
					>
						Invited Candidates
					</Button>
				</Box>

				{/* Tab Panels */}
				{activeTab === 0 ? (
					<ShortListedData invitedRefetch={invitedRefetch} />
				) : (
					<InvitedData />
				)}

				{/* Tab Panels */}
				{/* {tabLoading ? (
					<Box textAlign='center' p={10}>
						<Loader />
					</Box>
				) : activeTab === 0 ? (
					<ShortListedData invitedRefetch={invitedRefetch} />
				) : (
					<InvitedData />
				)} */}
			</Box>
		</Box>
	);
};

export default ShortListedCandidates;
