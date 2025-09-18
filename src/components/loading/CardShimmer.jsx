import React from 'react';
import { Grid, Skeleton } from '@chakra-ui/react';

// Chakra default breakpoints in px
const breakpoints = {
	base: '0px',
	sm: '480px',
	md: '768px',
	lg: '992px',
	xl: '1280px',
	'2xl': '1536px',
};

const CardShimmer = ({
	count = 2,
	columns = { base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
	height = '250px',
	gap = '2',
	...customStyling
}) => {
	const gridTemplate = {};
	for (const key in columns) {
		gridTemplate[`@media screen and (min-width: ${breakpoints[key]})`] = {
			gridTemplateColumns: `repeat(${columns[key]}, 1fr)`,
		};
	}

	return (
		<Grid
			sx={{
				...gridTemplate,
			}}
			gap={gap}
			w='full'
		>
			{[...Array(count)].map((_, index) => (
				<Skeleton
					key={index}
					borderRadius='md'
					height={height}
					// minWidth={{ base: '100%', sm: '50%', md: '25%' }}
					startColor='softGray.400'
					endColor='softGray.500'
					{...customStyling}
				/>
			))}
		</Grid>
	);
};

export default CardShimmer;
