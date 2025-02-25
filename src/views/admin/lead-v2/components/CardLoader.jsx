import React from 'react';
import { Flex, Grid, Skeleton } from '@chakra-ui/react';

const CardLoader = ({ count = 3 }) => {
	return (
		<Grid
			templateColumns={{
				base: '1fr',
				md: 'repeat(2, 1fr)',
				lg: 'repeat(3, 1fr)',
				xl: 'repeat(4, 1fr)',
				'2xl': 'repeat(5, 1fr',
			}}
			gap='2'
			minH='100vh'
		>
			{[...Array(count)].map((_, index) => (
				<Skeleton
					key={index}
					borderRadius='md'
					height='270px'
					minWidth={{ base: '100%', sm: '48%', md: '25%' }}
					startColor='softGray.400'
					endColor='softGray.500'
				/>
			))}
		</Grid>
	);
};

export default CardLoader;
