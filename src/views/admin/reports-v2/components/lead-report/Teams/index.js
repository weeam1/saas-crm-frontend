import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import TeamCard from './TeamCard';
import { useFetchItemsQuery } from 'api/apiSlice';
import NoData from 'components/Message/NoData';
import CardShimmer from 'components/loading/CardShimmer';

const TeamList = () => {
	const { data, isLoading } = useFetchItemsQuery(
		{
			path: '/v2/reporting/team',
		},
		{ refetchOnMountOrArgChange: true }
	);

	return (
		<Box bg='white' rounded='md' shadow='sm' p='6'>
			<Text
				fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
				mb='4'
				fontWeight='bold'
			>
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
						'@media screen and (min-width: 1680px)': {
							gridTemplateColumns: 'repeat(4, 1fr)', // 2xl (custom)
						},
						// >= 1920px (e.g., Full HD+)
						'@media (min-width: 2120px)': {
							gridTemplateColumns: 'repeat(5, 1fr)',
						},
						// >= 2560px (2.5K / QHD)
						'@media (min-width: 2560px)': {
							gridTemplateColumns: 'repeat(6, 1fr)',
						},
						// >= 3840px (4K)
						'@media (min-width: 3840px)': {
							gridTemplateColumns: 'repeat(7, 1fr)',
						},
					}}
					spacing={6}
					p={2}
					// px={{ base: 4, md: 6 }}
					// py={{ base: 6, md: 8 }}
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
