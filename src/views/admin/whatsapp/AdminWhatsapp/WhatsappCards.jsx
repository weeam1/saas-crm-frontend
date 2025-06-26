import NoData from 'components/Message/NoData';
import WhatsappUserCard from './WhatsappUserCard';
import CardShimmer from 'components/loading/CardShimmer';
import { SimpleGrid } from '@chakra-ui/react';

const WhatsappCards = ({ data, isLoading, isFetching }) => {
	return (
		<>
			{isLoading || isFetching ? (
				<CardShimmer
					count={12}
					height='300px'
					columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 }}
				/>
			) : data?.length > 0 ? (
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
					spacing={4}
				>
					{data.map((item, idx) => (
						<WhatsappUserCard key={item._id} data={item} />
					))}
				</SimpleGrid>
			) : (
				<NoData label='users' />
			)}
		</>
	);
};

export default WhatsappCards;
