import { Box, Grid, Skeleton } from '@chakra-ui/react';
import { useModalColors } from 'hooks/useModalColors';
import React from 'react';

const EmployeeLoading = ({ size = 6 }) => {
	const colors = useModalColors();
	return (
		<Grid
			templateColumns={{
				base: '1fr',
				md: 'repeat(2, 1fr)',
				lg: 'repeat(auto-fill, minmax(360px, 1fr))',
			}}
			// height='fit-content'
			gap={4}
			p='4'
		>
			{[...Array(size)].map((_, index) => (
				<Skeleton
					key={index}
					height='200px'
					borderRadius='md'
					// minWidth='full'
					startColor={colors.bgInput}
					endColor={colors.bgInputHover}
				/>
			))}
		</Grid>
	);
};

export default EmployeeLoading;
