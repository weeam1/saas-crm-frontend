import { Flex, Box, Progress, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const TeamProgress = ({ score }) => {
	const progressValue = Math.min(Math.max(score, 0), 100);

	return (
		<Box textAlign={{ base: 'center', md: 'left' }}>
			<CircularProgress
				value={progressValue}
				size='80px'
				thickness='8px'
				color={
					progressValue >= 80
						? 'green.400'
						: progressValue >= 50
							? 'blue.400'
							: 'orange.400'
				}
				trackColor='gray.200'
				capIsRound
			>
				<CircularProgressLabel fontSize='lg' fontWeight='bold'>
					{progressValue}%
				</CircularProgressLabel>
			</CircularProgress>
			<Text fontSize='xs' color='gray.500'>
				Performance
			</Text>
		</Box>
	);
};

// const TeamProgress = ({ score, color = 'brand', height = '12px' }) => {
// 	return (
// 		<Box my='2' w='full'>
// 			<Flex justify='space-between' mb={1}>
// 				<Text fontSize='xs' fontWeight='medium' mb={2} color='gray.500'>
// 					Score
// 				</Text>
// 				<Text fontSize='sm' fontWeight='bold' color='brand.500'>
// 					{score}%
// 				</Text>
// 			</Flex>

// 			<Progress
// 				value={score}
// 				width='full'
// 				height={height}
// 				colorScheme={color}
// 				shadow='sm'
// 				borderRadius='full'
// 				bg={useColorModeValue('gray.100', 'gray.700')}
// 				sx={{
// 					'& > div': {
// 						transition: 'all 0.4s ease-out',
// 					},
// 				}}
// 			/>
// 		</Box>
// 	);
// };

export default TeamProgress;
