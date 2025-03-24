import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import ShimmerSkeleton from 'components/loading/ShimmerSkeleton';

const RecordShimmer = () => {
	return (
		<Box p={5}>
			<Box bg='white' height='50px' p='2' mb='4'>
				<ShimmerSkeleton width='10%' />
			</Box>
			{/* Main Content */}
			<Box flex='1' bg='white' p='2' minWidth={{ base: '100%', lg: '600px' }}>
				{/* Attendance Overview Table */}
				<HStack alignItems='center' justifyContent='space-between'>
					<ShimmerSkeleton height='50px' width='30%' mb={4} />
					<ShimmerSkeleton height='50px' width='30%' mb={4} />
				</HStack>
				<VStack spacing={3}>
					{[...Array(8)].map((_, i) => (
						<ShimmerSkeleton key={i} height='50px' width='100%' />
					))}
				</VStack>
			</Box>
		</Box>
	);
};

export default RecordShimmer;
