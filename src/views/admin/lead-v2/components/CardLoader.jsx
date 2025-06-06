import React from 'react';
import { Grid, Skeleton } from '@chakra-ui/react';

const CardLoader = ({ count = 3 }) => {
	return (
		<Grid
			// Use the `sx` prop to apply custom media queries
			sx={{
				// >= 0px
				'@media (min-width: 0px)': {
					gridTemplateColumns: '1fr',
				},
				'@media (min-width: 812px)': {
					gridTemplateColumns: 'repeat(2, 1fr)',
				},
				// >= 1280px
				'@media (min-width: 1280px)': {
					gridTemplateColumns: 'repeat(3, 1fr)',
				},
				// >= 1664px
				'@media (min-width: 1664px)': {
					gridTemplateColumns: 'repeat(4, 1fr)',
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
				// >= 7680px (8K)
				'@media (min-width: 7680px)': {
					gridTemplateColumns: 'repeat(8, 1fr)',
				},
			}}
			gap='2'
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
