import React, { useState } from 'react';
import { Box, Heading, Button, Icon, HStack, Grid } from '@chakra-ui/react';
import InvitedData from './InvitedData';
import ShortListedData from './ShortListedData';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { useFetchItemsQuery } from 'api/apiSlice';
import CandidateCard from './../candidates/components/CandidateCard';
import { FaClock } from 'react-icons/fa';
import Loader from 'components/loading/Loader';

const ShortListedCandidates = () => {
	const [activeTab, setActiveTab] = useState(0);

	const {
		data: invitedCandidates,
		isLoading: invitedCandidatesLoading,
		refetch,
	} = useFetchItemsQuery({
		path: `/applications/invited-candidates`,
		params: {
			sort: '-updatedAt',
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

			{/* Header */}
			<Box mb={4} bg='white' rounded='md' shadow='sm' p='1rem'>
				<Heading size='md' color='gray.800'>
					Short Listed Candidates
				</Heading>
			</Box>

			{/* Invited candidates  */}
			{activeTab === 0 && (
				<Box mb='4'>
					<HStack
						justifyContent='space-between'
						alignItems='center'
						mb='2'
						p='2'
					>
						<HStack gap='2'>
							<FaClock w='14' h='14' />
							<Heading size='md' color='gray.800'>
								Upcoming Meetings
							</Heading>
						</HStack>

						<Button
							variant='link'
							color='blue.400'
							fontWeight='normal'
							onClick={() => setActiveTab(1)}
						>
							View All
						</Button>
					</HStack>
					<Grid
						templateColumns={{
							base: '1fr',
							md: 'repeat(2, 1fr)',
							lg: 'repeat(4, 1fr)',
						}}
						justifyContent='space-between'
						alignItems='center'
						gap='2'
					>
						{invitedCandidates?.doc &&
							invitedCandidates?.doc?.length &&
							invitedCandidates?.doc?.map((candidate) => (
								<CandidateCard
									key={candidate._id}
									candidate={candidate}
									refetch={refetch}
								/>
							))}
					</Grid>
				</Box>
			)}

			{/* Tabs for navigation */}
			<Box>
				<Box display='flex' mb={2}>
					<Button
						onClick={() => setActiveTab(0)}
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
						onClick={() => setActiveTab(1)}
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
					<ShortListedData invitedRefetch={refetch} />
				) : (
					<InvitedData />
				)}
			</Box>
		</Box>
	);
};

export default ShortListedCandidates;
