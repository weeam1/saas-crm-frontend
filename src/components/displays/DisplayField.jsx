import { Box } from '@chakra-ui/react';
import { format } from 'date-fns';

const DisplayField = ({ label, value }) => {
	if (label === 'Date of Birth') {
		value = format(new Date(value), 'd MMM, yyyy');
	}
	return (
		<Box color='gray.800'>
			<Box fontSize='xs' fontWeight='semibold' mb={1}>
				{label}
			</Box>
			<Box
				border='none'
				outline='none'
				bg='#F2F2F2'
				p='2'
				rounded='md'
				shadow='sm'
				fontSize='xs'
			>
				{value}
			</Box>
		</Box>
	);
};

export default DisplayField;
