import { SimpleGrid } from '@chakra-ui/react';
import useUserSession from 'hooks/useUserSession';

import NoData from 'components/Message/NoData';
import CardShimmer from 'components/loading/CardShimmer';
import { DealCard } from './components/DealCard';

const DealCards = ({
	data,
	isLoading,
	isRefetching,
	handleEdit,
	handleView,
	handleCancelled,
	handleDelete,
}) => {
	const { user, isSuperAdmin } = useUserSession();

	return (
		<>
			{isLoading || isRefetching ? (
				<CardShimmer
					count={12}
					height='300px'
					columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 }}
				/>
			) : data?.length > 0 ? (
				<SimpleGrid
					sx={{
						display: 'grid',
						gridTemplateColumns: 'repeat(1, 1fr)',
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
							gridTemplateColumns: 'repeat(4, 1fr)',
						},
						// >= 2560px (2.5K / QHD)
						'@media (min-width: 2560px)': {
							gridTemplateColumns: 'repeat(5, 1fr)',
						},
						// >= 3840px (4K)
						'@media (min-width: 3840px)': {
							gridTemplateColumns: 'repeat(6, 1fr)',
						},
					}}
					spacing={4}
				>
					{data.map((item, idx) => (
						<DealCard
							key={item._id + idx}
							deal={item}
							user={user}
							isSuperAdmin={isSuperAdmin}
							handleEdit={handleEdit}
							handleView={handleView}
							handleCancelled={handleCancelled}
							handleDelete={handleDelete}
						/>
					))}
				</SimpleGrid>
			) : (
				<NoData label='users' />
			)}
		</>
	);
};

export default DealCards;
