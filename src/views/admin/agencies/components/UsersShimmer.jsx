import { Box, Grid, Skeleton } from '@chakra-ui/react';
import React from 'react';

const UsersShimmer = ({ size = 6 }) => {
	return (
		<Grid
			templateColumns={{
				base: '1fr',
			}}
			height='fit-content'
			gap={2}
			p='2'
		>
			{[...Array(size)].map((_, index) => (
				<Skeleton
					key={index}
					height='40px'
					borderRadius='md'
					// minWidth='full'
					startColor='softGray.400'
					endColor='softGray.500'
				/>
			))}
		</Grid>
	);
};

export default UsersShimmer;
