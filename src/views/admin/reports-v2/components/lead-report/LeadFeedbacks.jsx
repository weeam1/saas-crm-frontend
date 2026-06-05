import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import LeadStatusChart from './LeadStatusChart';
import { useLeadReportFilters } from 'hooks/reports/useLeadReportFilters';
import { useMemo, useState } from 'react';
import LeadMainStatusChart from './LeadMainStatusChart';
import { useFetchItemsQuery } from 'api/apiSlice';
import TopFilter from '../TopFilter';
import { viewOptions } from '../../helpers';
import CardShimmer from 'components/loading/CardShimmer';
import { useModalColors } from 'hooks/useModalColors';

import NoData from 'components/Message/NoData';

const LeadFeedbacks = () => {
	const colors = useModalColors();
	const { filters } = useLeadReportFilters();

	const [view, setView] = useState('top5');

	// Inside your component
	const queryParams = useMemo(() => {
		const params = {};

		// Only add userId if either agentId or managerId exists
		const userId = filters.agentId || filters.managerId;
		if (userId) {
			params.userId = userId;
		}

		return params;
	}, [filters.agentId, filters.managerId]);

	const { data: statusData, isLoading: statusLoading } = useFetchItemsQuery(
		{
			path: '/v2/reporting/feedbacks',
			params: { ...queryParams, type: 'status' },
		},
		{ refetchOnMountOrArgChange: true }
	);

	const { data: mainStatusData, isLoading: mainStatusLoading } =
		useFetchItemsQuery(
			{
				path: '/v2/reporting/feedbacks',
				params: { ...queryParams, type: 'mainStatus' },
			},
			{ refetchOnMountOrArgChange: true }
		);

	return statusLoading || mainStatusLoading ? (
		<Box w='full' p='6' bg={colors.bg} my='2' rounded='md' shadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
			<CardShimmer
				count={2}
				height='400px'
				columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 2, '2xl': 2 }}
			/>
		</Box>
	) : (
		<Box bg={colors.bg} my='2' rounded='md' shadow={colors.cardShadow} p='6' border="1px solid" borderColor={colors.borderColor}>
			<Flex
				justify='space-between'
				align='center'
				mb={4}
				gap={3}
				flexDir={{ base: 'column', md: 'row' }}
			>
				<Text
					fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
					fontWeight='bold'
					mb='2'
					color={colors.headingText}
				>
					Lead Feedbacks
				</Text>

				<TopFilter view={view} setView={setView} options={viewOptions} />
			</Flex>

			<Stack
				sx={{
					flexDirection: 'row',
					'@media (max-width: 1050px)': {
						flexDirection: 'column',
					},
				}}
				gap='6'
				align='stretch'
				justify='space-between'
			>
				{statusData?.doc?.stats && (
					<LeadStatusChart data={statusData?.doc?.stats} view={view} />
				)}

				{mainStatusData?.doc?.stats && (
					<LeadMainStatusChart data={mainStatusData?.doc?.stats} view={view} />
				)}

				{!statusData?.doc?.stats && !mainStatusData?.doc?.stats && (
					<Box
						w='full'
						display='flex'
						alignItems='center'
						justifyContent='center'
					>
						<NoData label='feedbacks' />
					</Box>
				)}
			</Stack>
		</Box>
	);
};

export default LeadFeedbacks;