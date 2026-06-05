// import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
// import ShimmerSkeleton from 'components/loading/ShimmerSkeleton';

// const AttendanceShimmer = () => {
// 	return (
// 		<Box>
// 			<Box bg='white' height='50px' p='2' mb='4'>
// 				<ShimmerSkeleton width='10%' />
// 			</Box>
// 			<Flex flexDirection={{ base: 'column', lg: 'row' }} gap={6}>
// 				{/* Sidebar */}
// 				<Box minWidth={{ base: '100%', lg: '310px' }} spacing={4}>
// 					<Box bg='white' height='50vh' p='2' mb='4'>
// 						<ShimmerSkeleton width='100%' />
// 					</Box>
// 					{/* Attendance Marking Section */}
// 					<Box bg='white' height='20vh' p='2'>
// 						<ShimmerSkeleton width='100%' />
// 					</Box>
// 				</Box>

// 				{/* Main Content */}
// 				<Box flex='1' bg='white' p='2' minWidth={{ base: '100%', lg: '600px' }}>
// 					{/* Attendance Overview Table */}
// 					<HStack alignItems='center' justifyContent='space-between'>
// 						<ShimmerSkeleton height='50px' width='40%' mb={4} />
// 						<ShimmerSkeleton height='50px' width='10%' mb={4} />
// 					</HStack>
// 					<VStack spacing={3}>
// 						{[...Array(8)].map((_, i) => (
// 							<ShimmerSkeleton key={i} height='50px' width='100%' />
// 						))}
// 					</VStack>
// 				</Box>
// 			</Flex>
// 		</Box>
// 	);
// };

// export default AttendanceShimmer;

import { Box, Flex, HStack, VStack } from '@chakra-ui/react';
import ShimmerSkeleton from 'components/loading/ShimmerSkeleton';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceShimmer = () => {
	const colors = useModalColors();

	return (
		<Box bg={colors.bgDeep} minH='100vh' p={4}>
			<Box bg={colors.bg} height='50px' p='2' mb='4' borderRadius='md' border="1px solid" borderColor={colors.borderColor}>
				<ShimmerSkeleton width='10%' />
			</Box>
			<Flex flexDirection={{ base: 'column', lg: 'row' }} gap={6}>
				{/* Sidebar */}
				<Box minWidth={{ base: '100%', lg: '310px' }} spacing={4}>
					<Box bg={colors.bg} height='50vh' p='2' mb='4' borderRadius='md' border="1px solid" borderColor={colors.borderColor}>
						<ShimmerSkeleton width='100%' />
					</Box>
					{/* Attendance Marking Section */}
					<Box bg={colors.bg} height='20vh' p='2' borderRadius='md' border="1px solid" borderColor={colors.borderColor}>
						<ShimmerSkeleton width='100%' />
					</Box>
				</Box>

				{/* Main Content */}
				<Box flex='1' bg={colors.bg} p='2' minWidth={{ base: '100%', lg: '600px' }} borderRadius='md' border="1px solid" borderColor={colors.borderColor}>
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