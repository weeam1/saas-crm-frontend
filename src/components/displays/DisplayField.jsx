import { Box, Input } from '@chakra-ui/react';
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
			<Input
				value={value}
				isReadOnl
				border='none'
				outline='none'
				_focus={{
					border: 'none',
					outline: 'none',
				}}
				bg='#F2F2F2'
				p='2'
				rounded='md'
				shadow='sm'
				fontSize='xs' // Slightly smaller text
			/>
		</Box>
	);
};

export default DisplayField;
