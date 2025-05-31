import { useSelector } from 'react-redux';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import TeamCard from './TeamCard';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

const TeamList = () => {
	const managers = useSelector(
		(state) => state.user.activeTree?.managers || []
	);

	const { data, isLoading } = useFetchItemsQuery(
		{
			path: '/v2/reporting/team',
		},
		{ refetchOnMountOrArgChange: true }
	);

	return (
		<Box bg='white' rounded='md' shadow='sm' p='4'>
			<Text fontSize='2xl' fontWeight='bold'>
				Team Report
			</Text>
			{isLoading ? (
				<Loader />
			) : data?.doc ? (
				<SimpleGrid
					columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
					spacing={6}
					px={{ base: 4, md: 6 }}
					py={{ base: 6, md: 8 }}
				>
					{data?.doc?.map((manager, idx) => (
						<TeamCard key={manager._id} index={idx} manager={manager} />
					))}
				</SimpleGrid>
			) : (
				<Text>No Team data avaliable</Text>
			)}
		</Box>
	);
};

export default TeamList;
