import { Skeleton, Box, Grid } from '@chakra-ui/react';
import React from 'react';

const CardsLoading = ({ count = 6 }) => {
	return (
		<Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap='1'>
			{Array.from({ length: count }).map((_, index) => (
				<Box
					key={index}
					width='33.33%'
					height='250px'
					borderRadius='8px'
					overflow='hidden'
				>
					<Skeleton height='100%' width='100%' borderRadius='8px' />
				</Box>
			))}
		</Grid>
	);
};

export default CardsLoading;
