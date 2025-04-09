import { Box, Grid, Skeleton } from '@chakra-ui/react';
import React from 'react';

const EmployeeLoading = ({ size = 6 }) => {
	return (
		<Grid
			templateColumns={{
				base: '1fr',
				md: 'repeat(2, 1fr)',
				lg: 'repeat(auto-fill, minmax(360px, 1fr))',
			}}
			height='fit-content'
			gap={4}
			p='4'
		>
			{[...Array(size)].map((_, index) => (
				<Skeleton
					key={index}
					height='170px'
					borderRadius='md'
					// minWidth='full'
					startColor='softGray.400'
					endColor='softGray.500'
				/>
			))}
		</Grid>
	);
};

export default EmployeeLoading;
