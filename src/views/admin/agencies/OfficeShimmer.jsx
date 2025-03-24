import { Box, Flex, Skeleton } from '@chakra-ui/react';

const OfficeShimmer = () => {
	return (
		<Box p={5}>
			<Skeleton
				height='40px'
				width='50%'
				mb={2}
				startColor='softGray.400'
				endColor='softGray.500'
			/>
			<Skeleton
				height='30px'
				width='100%'
				mb={2}
				startColor='softGray.400'
				endColor='softGray.500'
			/>
			<Flex
				direction={{ base: 'column', md: 'column', lg: 'row' }}
				alignItems={{ base: 'stretch', md: 'stretch' }}
				gap={{ base: 3, md: 5 }}
				py='2'
			>
				<Skeleton
					height='600px'
					width='60%'
					borderRadius='md'
					startColor='softGray.400'
					endColor='softGray.500'
				/>
				<Skeleton
					height='600px'
					width='300px'
					borderRadius='md'
					startColor='softGray.400'
					endColor='softGray.500'
				/>
			</Flex>

			{/* Below Box */}
			<Skeleton
				height='400px'
				w={{ base: '100%', md: '460px' }}
				borderRadius='md'
				mt={4}
				startColor='softGray.400'
				endColor='softGray.500'
			/>
		</Box>
	);
};

export default OfficeShimmer;
