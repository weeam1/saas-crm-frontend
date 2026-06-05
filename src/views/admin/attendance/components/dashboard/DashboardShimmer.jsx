import { Box, Grid, SimpleGrid, Skeleton } from '@chakra-ui/react';
import React from 'react';
import { useModalColors } from 'hooks/useModalColors';

const DashboardShimmer = () => {
	const colors = useModalColors();

	return (
		<Box minHeight='100vh' p={6} bg={colors.bgDeep}>
			<Box p={1} my='2' borderRadius='lg' bg={colors.bg} boxShadow={colors.cardShadow}>
				<Skeleton
					height='25px'
					width='10%'
					mb={2}
					startColor={colors.bgInput}
					endColor={colors.bgInputHover}
				/>
			</Box>
			<Grid p='2' templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6}>
				<Skeleton
					height='full'
					minWidth='full'
					mb={2}
					startColor={colors.bgInput}
					endColor={colors.bgInputHover}
				/>

				{/* Top Section - Summary Cards */}
				<SimpleGrid columns={{ base: '1fr', md: 2, lg: 3 }} spacing={5}>
					{[...Array(6)].map((_, index) => (
						<Skeleton
							key={index}
							height='150px'
							minWidth='full'
							mb={2}
							startColor={colors.bgInput}
							endColor={colors.bgInputHover}
						/>
					))}
				</SimpleGrid>
			</Grid>

			<Box py='6'>
				{/* Middle Section - Charts */}
				<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
					{[...Array(2)].map((_, index) => (
						<Box
							height='430px'
							key={index}
							p={6}
							borderRadius='md'
							boxShadow={colors.cardShadow}
							bg={colors.bg}
							border="1px solid"
							borderColor={colors.borderColor}
						>
							<Skeleton
								height='30px'
								width='40%'
								mb={4}
								startColor={colors.bgInput}
								endColor={colors.bgInputHover}
							/>
							<Skeleton
								height='400px'
								startColor={colors.bgInput}
								endColor={colors.bgInputHover}
							/>
						</Box>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default DashboardShimmer;