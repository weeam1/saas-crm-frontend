import { Box, Text } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import HiringStatusCards from './HiringStatusCards';
import CardShimmer from '../CardShimmer';
import HiringSummaryBarChart from './HiringSummaryBarChart';

const HiringReport = () => {
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
		<Box p={6} bg='white' rounded='lg' shadow='sm' mb='4' mx='2'>
			<Text fontSize='2xl' fontWeight='bold' mb='4'>
				Hiring Report
			</Text>

			<HiringStatusCards stats={data?.doc} />

			<HiringSummaryBarChart data={summaryData} />
		</Box>
	);
};

export default HiringReport;
