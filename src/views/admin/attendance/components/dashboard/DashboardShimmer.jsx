import { Box, Grid, SimpleGrid, Skeleton } from '@chakra-ui/react';
import React from 'react';

const DashboardShimmer = () => {
	return (
		<Box minHeight='100vh' p={6} bg='white'>
			<Box p={1} my='2' borderRadius='lg' bg='white' boxShadow='md'>
				<Skeleton
					height='25px'
					width='10%'
					mb={2}
					startColor='softGray.400'
					endColor='softGray.500'
				/>
			</Box>
			<Grid p='2' templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6}>
				<Skeleton
					height='full'
					minWidth='full'
					mb={2}
					startColor='softGray.400'
					endColor='softGray.500'
				/>

				{/* Top Section - Summary Cards */}
				<SimpleGrid columns={{ base: '1fr', md: 2, lg: 3 }} spacing={5}>
					{[...Array(6)].map((_, index) => (
						<Skeleton
							key={index}
							height='150px'
							minWidth='full'
							mb={2}
							startColor='softGray.400'
							endColor='softGray.500'
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
							boxShadow='sm'
							bg='white'
						>
							<Skeleton
								height='30px'
								width='40%'
								mb={4}
								startColor='softGray.400'
								endColor='softGray.500'
							/>
							<Skeleton
								height='400px'
								startColor='softGray.400'
								endColor='softGray.500'
							/>
						</Box>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default DashboardShimmer;
