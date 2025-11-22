import {
	Box,
	Flex,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Divider,
} from '@chakra-ui/react';

export default function EvaluationModalSkeleton() {
	return (
		<Box p={4} maxW='4xl' mx='auto'>
			{/* Header */}
			<Flex align='center' gap={4} mb={6}>
				<SkeletonCircle size='14' />
				<Box flex='1'>
					<Skeleton height='20px' width='200px' mb={2} />
					<Skeleton height='14px' width='120px' />
				</Box>
			</Flex>

			{/* Stats Cards */}
			<Flex gap={4} wrap='wrap' mb={8}>
				{[1, 2, 3, 4].map((i) => (
					<Box
						key={i}
						flex='1'
						minW='200px'
						p={4}
						borderRadius='lg'
						borderWidth='1px'
						bg='white'
					>
						<Skeleton height='20px' width='60%' mb={3} />
						<Skeleton height='28px' width='40%' />
						<Skeleton height='14px' width='50%' mt={2} />
					</Box>
				))}
			</Flex>

			<Divider mb={6} />

			{/* Overall Performance Bar */}
			<Box mb={6}>
				<Skeleton height='20px' width='180px' mb={4} />
				<Skeleton height='14px' width='100%' mb={2} />
				<Skeleton height='14px' width='80px' />
			</Box>

			<Divider mb={6} />

			{/* Individual evaluations list */}
			<Box>
				<Skeleton height='20px' width='220px' mb={4} />

				{[1, 2].map((i) => (
					<Flex
						key={i}
						align='center'
						justify='space-between'
						p={4}
						borderWidth='1px'
						borderRadius='lg'
						bg='white'
						mb={3}
					>
						<Flex align='center' gap={3}>
							<SkeletonCircle size='10' />
							<Box>
								<Skeleton height='16px' width='140px' mb={2} />
								<Skeleton height='12px' width='90px' />
							</Box>
						</Flex>

						<Skeleton height='24px' width='60px' />
					</Flex>
				))}
			</Box>
		</Box>
	);
}
