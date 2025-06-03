import { useSelector } from 'react-redux';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import TeamCard from './TeamCard';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import NoData from 'components/Message/NoData';
import CardShimmer from '../../CardShimmer';

const TeamList = () => {
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
				<CardShimmer
					count={8}
					columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 }}
				/>
			) : data?.doc ? (
				<SimpleGrid
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(1, 1fr)', // default

						'@media screen and (min-width: 640px)': {
							gridTemplateColumns: 'repeat(1, 1fr)', // sm
						},
						'@media screen and (min-width: 768px)': {
							gridTemplateColumns: 'repeat(2, 1fr)', // md
						},
						'@media screen and (min-width: 1024px)': {
							gridTemplateColumns: 'repeat(2, 1fr)', // lg
						},
						'@media screen and (min-width: 1280px)': {
							gridTemplateColumns: 'repeat(3, 1fr)', // xl
						},
						'@media screen and (min-width: 1536px)': {
							gridTemplateColumns: 'repeat(4, 1fr)', // 2xl (custom)
						},
					}}
					spacing={6}
					px={{ base: 4, md: 6 }}
					py={{ base: 6, md: 8 }}
				>
					{data?.doc?.map((manager, idx) => (
						<TeamCard key={manager._id} index={idx} manager={manager} />
					))}
				</SimpleGrid>
			) : (
				<NoData label='team' />
			)}
		</Box>
	);
};

export default TeamList;
