import React from 'react';
import {
	Box,
	Flex,
	Skeleton,
	SkeletonText,
	SkeletonCircle,
} from '@chakra-ui/react';

const SkeletonCard = () => {
	return (
		<Box
			bg='gray.100'
			p={6}
			shadow='md'
			borderRadius='xl'
			w={{ base: '100%', sm: '48%', lg: '30%' }}
			h='auto'
		>
			<Flex align='center' mb={4}>
				<SkeletonCircle size='6' mr={2} />
				<Skeleton height='20px' width='50%' />
			</Flex>
			<Skeleton height='35px' width='80%' borderRadius='md' mb={4} />
			<Skeleton height='35px' width='60%' borderRadius='md' mb={4} />
			<Flex justify='space-between' mb={4}>
				<Skeleton height='20px' width='30%' />
				<Skeleton height='20px' width='30%' />
			</Flex>
			<Skeleton height='20px' width='40%' mb={4} />
			<Skeleton height='20px' width='60%' mb={4} />
			<Skeleton height='20px' width='50%' mb={4} />
		</Box>
	);
};

const CardLoader = ({ count = 3 }) => {
	return (
		<Flex
			wrap='wrap'
			gap={4}
			justify='center'
			align='center'
			minH='100vh'
			p={4}
		>
			{[...Array(count)].map((_, index) => (
				<SkeletonCard key={index} />
			))}
		</Flex>
	);
};

export default CardLoader;
