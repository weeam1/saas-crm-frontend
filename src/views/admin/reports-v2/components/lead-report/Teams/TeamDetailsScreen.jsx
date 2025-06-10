import { useNavigate, useParams } from 'react-router-dom';
import {
	Avatar,
	Box,
	Divider,
	Flex,
	Grid,
	Heading,
	HStack,
	Icon,
	Progress,
	SimpleGrid,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';

import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import { TeamStatsOverview } from './TeamStatsOverview';
import { FaChevronLeft } from 'react-icons/fa';
import AppButton from 'components/shared/AppButton';
import { constant } from 'constant';
import TopAgentsByLeads from './TopAgentsByLeads';
import TopAgentsByNotes from './TopAgentsByNotes';
import { FaLocationDot } from 'react-icons/fa6';
import AgentDetails from './AgentDetails';
import NoData from 'components/Message/NoData';
import { toast } from 'react-toastify';
import { FiMail } from 'react-icons/fi';
import Rating from 'components/shared/Rating';
import { useEffect, useState } from 'react';
import { calculatePerformance } from 'views/admin/reports-v2/helpers';
import TeamShimmer from './TeamOverviewShimmer';
import TeamOverviewShimmer from './TeamOverviewShimmer';
import TeamProgress from './TeamProgress';
import TeamProfileCard from './TeamProfileCard';

const TeamDetailsScreen = () => {
	const { id } = useParams();

	const [teamPefomance, setTeamPerfomance] = useState({ score: 0, rating: 0 });

	const { data, isLoading, error } = useFetchItemsQuery(
		{
			path: `/v2/reporting/team_details/${id}`,
			skip: !id,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data?.doc) {
			const manager = data?.doc;

			const { score, rating } = calculatePerformance(
				manager?.totalLeads,
				manager?.totalAgents,
				manager?.assignedLeads,
				manager?.totalNotes
			);

			setTeamPerfomance({ score, rating });
		}
	}, [data?.doc]);

	if (error) {
		toast.error('Error loading team data');
	}

	const textColor = useColorModeValue('gray.700', 'gray.100');

	const navigate = useNavigate();

	return isLoading ? (
		<TeamOverviewShimmer />
	) : (
		<>
			<AppButton
				leftIcon={<FaChevronLeft />}
				onClick={() => navigate('/reporting-analytics')}
				mb='4'
			>
				Back
			</AppButton>

			<Box p={6} bg='white' rounded='lg' shadow='sm' mb='4'>
				<Heading mb={8} fontSize='2xl'>
					{data?.doc?.fullName || ''} Overview
				</Heading>

				{data?.doc?.agents ? (
					<>
						{/* Manager Details */}
						{/* <Box bg='gray.100' p='4' mb='4' rounded='lg' boxShadow='sm'>
							<Flex align='center' gap={4}>
								<Avatar
									src={
										data?.doc?.profileImage
											? `${constant.baseUrl}${data?.doc.profileImage}`
											: ''
									}
									name={data?.doc?.fullName}
									size='xl'
									borderWidth='2px'
									borderColor='brand.400'
									boxShadow='md'
								/>

								<HStack
									flexDir={{ base: 'column', md: 'row' }}
									align='start'
									w='full'
								>
									<VStack alignItems='start' color='gray.500' w='full'>
										<Heading
											size='sm'
											color={textColor}
											isTruncated
											maxW='100%'
										>
											{data?.doc?.fullName || 'No name provided'}
										</Heading>
										<Flex align='center' gap={2}>
											<Icon as={FiMail} boxSize={4} />
											<Text
												fontSize={{ base: 'xs', md: 'sm' }}
												isTruncated
												maxW={{ base: '150px', md: '200px' }}
											>
												{data?.doc?.username || 'username'}
											</Text>
										</Flex>

										<Flex align='center' gap={2}>
											<Icon as={FaLocationDot} boxSize={4} />
											<Text
												fontSize={{ base: 'xs', md: 'sm' }}
												isTruncated
												maxW={{ base: '150px', md: '200px' }}
											>
												{data?.doc?.agency?.name || 'No agency'}
											</Text>
										</Flex>
									</VStack>

									<VStack w={{ base: 'full', md: '40%' }} flexGrow={1}>
										<Rating value={teamPefomance?.rating || 0} />
										<TeamProgress score={teamPefomance?.score || 0} />
									</VStack>
								</HStack>
							</Flex>
						</Box> */}

						<TeamProfileCard data={data} teamPefomance={teamPefomance} />

						{/* Overview Cards */}
						<Grid
							templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
							gap={6}
							mb={8}
						>
							<TeamStatsOverview data={data?.doc} />
						</Grid>

						{/* Main Content Area */}
						{data?.doc?.agents && data?.doc?.agents?.length ? (
							<Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
								<TopAgentsByLeads agents={data?.doc?.agents} />
								<TopAgentsByNotes agents={data?.doc?.agents} />
							</Grid>
						) : (
							<NoData label='agents data' />
						)}
					</>
				) : (
					<NoData label='team' />
				)}
			</Box>

			{/* Agent Details */}
			{data?.doc?.agents && data?.doc?.agents?.length ? (
				<AgentDetails agents={data?.doc?.agents} />
			) : null}
		</>
	);
};

export default TeamDetailsScreen;
