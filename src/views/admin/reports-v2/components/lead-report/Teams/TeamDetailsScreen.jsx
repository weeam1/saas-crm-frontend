import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, Heading, useColorModeValue } from '@chakra-ui/react';

import { useFetchItemsQuery } from 'api/apiSlice';
import { TeamStatsOverview } from './TeamStatsOverview';
import { FaChevronLeft } from 'react-icons/fa';
import AppButton from 'components/shared/AppButton';
import TopAgentsByLeads from './TopAgentsByLeads';
import TopAgentsByNotes from './TopAgentsByNotes';
import AgentDetails from './AgentDetails';
import NoData from 'components/Message/NoData';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { calculatePerformance } from 'views/admin/reports-v2/helpers';
import TeamOverviewShimmer from './TeamOverviewShimmer';
import TeamProfileCard from './TeamProfileCard';
import SalesBarChart from '../SalesBarChart';

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

	const { data: sales, isLoading: salesLoading } = useFetchItemsQuery(
		{
			path: '/deals/sales_report',
			params: { userId: id },
		},
		{
			skip: !id,
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
						<TeamProfileCard data={data} teamPefomance={teamPefomance} />

						{/* Overview Cards */}
						<Grid
							templateColumns={{
								base: 'repeat(1, 1fr)',
								md: 'repeat(2, 1fr)',
								lg: 'repeat(3, 1fr)',
							}}
							// templateColumns='repeat(auto-fit, minmax(250px, 1fr))'
							gap={6}
							mb={8}
						>
							<TeamStatsOverview data={data?.doc} />
						</Grid>

						{/* Manager Sales perfomance graph */}
						<SalesBarChart
							data={sales?.sales_report}
							title='Manager Sales Perfomance'
						/>

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
