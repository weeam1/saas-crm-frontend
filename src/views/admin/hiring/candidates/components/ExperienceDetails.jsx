import React from 'react';
import { Box, Textarea } from '@chakra-ui/react';

const ExperienceDetails = ({ experience }) => {
	return (
		<Box width='full' py='2'>
			<Box fontWeight='bold' fontSize='xs' mb={1}>
				Experience Details
			</Box>
			<Box
				bg='#F2F2F2'
				p='1'
				rounded='md'
				shadown='xs'
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
				<Textarea
					value={experience}
					isReadOnly
					fontSize='xs'
					height='full' /* Ensure it occupies the full height */
					resize='none' /* Disable resizing by the user */
					border='none' /* Remove the border for cleaner look */
				/>
			</Box>
		</Box>
	);
};

export default ExperienceDetails;
