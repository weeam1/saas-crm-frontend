import {
	Box,
	Flex,
	Grid,
	SkeletonCircle,
	VStack,
	HStack,
} from '@chakra-ui/react';
import ShimmerSkeleton from 'components/loading/ShimmerSkeleton';
import CardShimmer from 'components/loading/CardShimmer';

const TeamOverviewShimmer = () => {
	return (
		<VStack my='8' spacing={6} align='stretch' p={6} bg='white' minH='100vh'>
			{/* Page Heading */}
			<ShimmerSkeleton height='24px' width='250px' />

			{/* Profile Card */}
			<Flex
				direction={{ base: 'column', md: 'row' }}
				p={6}
				bg='white'
				boxShadow='sm'
				borderRadius='lg'
				align='center'
				gap={6}
			>
				<SkeletonCircle size='24' />
				<Box flex='1'>
					<ShimmerSkeleton height='20px' width='150px' mb={2} />
					<ShimmerSkeleton height='16px' width='200px' mb={1} />
					<ShimmerSkeleton height='16px' width='120px' mb={1} />
					<ShimmerSkeleton height='20px' width='100px' />
				</Box>
			</Flex>

			{/* Stats Cards */}
			<CardShimmer
				count={4}
				height='100px'
				columns={{ base: 1, sm: 1, md: 3, lg: 4, xl: 4, '2xl': 4 }}
			/>

			{/* Charts Section */}
			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
				gap={4}
				mt={2}
			>
				{/* Top Agents by Leads */}
				<Box bg='white' p={4} borderRadius='lg' boxShadow='sm'>
					<ShimmerSkeleton height='20px' width='200px' mb={4} />
					{[...Array(5)].map((_, idx) => (
						<HStack key={idx} spacing={4} mb={3}>
							<ShimmerSkeleton height='16px' width='120px' />
							<ShimmerSkeleton height='16px' width='70%' />
						</HStack>
					))}
				</Box>

				{/* Top Agents by Notes */}
				<Box bg='white' p={4} borderRadius='lg' boxShadow='sm'>
					<ShimmerSkeleton height='20px' width='200px' mb={4} />
					{[...Array(5)].map((_, idx) => (
						<HStack key={idx} spacing={4} mb={3}>
							<ShimmerSkeleton height='16px' width='120px' />
							<ShimmerSkeleton height='16px' width='70%' />
						</HStack>
					))}
				</Box>
			</Grid>
		</VStack>
	);
};

export default TeamOverviewShimmer;
