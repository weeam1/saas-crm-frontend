import { Box } from '@chakra-ui/react';
import { format } from 'date-fns';

const DisplayField = ({ label, value }) => {
	if (label === 'Date of Birth') {
		value = format(new Date(value), 'd MMM, yyyy');
	}
	return (
		<Box color='gray.800' fontSize='sm'>
			<Box fontWeight='500' fontSize='md' mb={1}>
				{label}
			</Box>

			<Box
				border='none'
				outline='none'
				bg='#F2F2F2'
				py='2'
				px='3'
				rounded='md'
				shadow='sm'
				maxH='200px' // Set a maximum height for the box
				overflowY='auto' // Enable vertical scrolling
			>
				{value}
			</Box>
		</Box>
	);
};

export default DisplayField;
