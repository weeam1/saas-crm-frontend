import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import ShimmerSkeleton from 'components/loading/ShimmerSkeleton';

const AttendanceShimmer = () => {
	return (
		<Box>
			<Box bg='white' height='50px' p='2' mb='4'>
				<ShimmerSkeleton width='10%' />
			</Box>
			<Flex flexDirection={{ base: 'column', lg: 'row' }} gap={6}>
				{/* Sidebar */}
				<Box minWidth={{ base: '100%', lg: '310px' }} spacing={4}>
					<Box bg='white' height='50vh' p='2' mb='4'>
						<ShimmerSkeleton width='100%' />
					</Box>
					{/* Attendance Marking Section */}
					<Box bg='white' height='20vh' p='2'>
						<ShimmerSkeleton width='100%' />
					</Box>
				</Box>

				{/* Main Content */}
				<Box flex='1' bg='white' p='2' minWidth={{ base: '100%', lg: '600px' }}>
					{/* Attendance Overview Table */}
					<HStack alignItems='center' justifyContent='space-between'>
						<ShimmerSkeleton height='50px' width='40%' mb={4} />
						<ShimmerSkeleton height='50px' width='10%' mb={4} />
					</HStack>
					<VStack spacing={3}>
						{[...Array(8)].map((_, i) => (
							<ShimmerSkeleton key={i} height='50px' width='100%' />
						))}
					</VStack>
				</Box>
			</Flex>
		</Box>
	);
};

export default AttendanceShimmer;
