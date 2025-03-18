import React from 'react';
import { Box } from '@chakra-ui/react';

const ExperienceDetails = ({ experience }) => {
	return (
		<Box width='full' fontSize='sm' py='2'>
			<Box fontWeight='500' fontSize='md' mb={1}>
				Experience Details
			</Box>
			<Box
				bg='#F2F2F2'
				p='3'
				rounded='md'
				shadown='xs'
				textAlign='justify'
				height='100px' /* Set a fixed height */
				overflowY='auto' /* Enable vertical scrolling */
				sx={{
					'::-webkit-scrollbar': {
						width: '8px' /* Custom scrollbar width */,
					},
					'::-webkit-scrollbar-thumb': {
						background: '#4A5568' /* Custom scrollbar color */,
						borderRadius: '4px',
					},
					'::-webkit-scrollbar-thumb:hover': {
						background: '#2D3748' /* Change color on hover */,
					},
				}}
			>
				{experience}
			</Box>
		</Box>
	);
};

export default ExperienceDetails;
