import { Box, HStack, Text } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import HiringStatusCards from './HiringStatusCards';
import CardShimmer from 'components/loading/CardShimmer';

import HiringSummaryBarChart from './HiringSummaryBarChart';
import RefButton from '../RefButton';
import { usePermissions } from 'hooks/usePermissions';

const HiringReport = () => {
	const { hasPermission } = usePermissions();

	const { data, isLoading } = useFetchItemsQuery(
		{ path: '/hiring/stats' },
		{ refetchOnMountOrArgChange: true }
	);

	if (isLoading)
		return (
			<CardShimmer
				count={2}
				height='200px'
				columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 }}
			/>
		);

	const stats = data?.doc || {};

	const summaryData = [
		{ name: 'Candidates', value: stats.totalCandidates },
		{ name: 'Interviews', value: stats.totalInterviewed },
		{ name: 'Completed', value: stats.totalCompletedInterviews },
	];

	return (
		<Box p={8} bg='white' rounded='lg' shadow='sm' mb='4' mx='2'>
			<HStack>
				<Text fontSize={{ base: 'md', md: 'xl', lg: '2xl' }} fontWeight='bold'>
					Hiring Report
				</Text>
				{hasPermission('reports', 'link') && hasPermission('hiring') && (
					<RefButton to='/hiring/dashboard' label='Hiring Module' />
				)}
			</HStack>

			<HiringStatusCards stats={data?.doc} />

			<HiringSummaryBarChart data={summaryData} />
		</Box>
	);
};

export default HiringReport;
