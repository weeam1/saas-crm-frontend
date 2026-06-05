import { Box } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useModalColors } from 'hooks/useModalColors';

const DisplayField = ({ label, value, ...props }) => {
	const colors = useModalColors();

	if (label === 'Date of Birth' && value) {
		value = format(new Date(value), 'd MMM, yyyy');
	}
	return (
		<Box fontSize='sm'>
			{/* Label - GRAY (#808080) */}
			<Box fontWeight='500' fontSize='md' mb={1} color={colors.labelColor}>
				{label}
			</Box>

			{/* Value - WHITE (#FFFFFF) with NAVY background */}
			<Box
				border='none'
				outline='none'
				bg={colors.bgInput}
				py='2'
				px='3'
				rounded='md'
				shadow='sm'
				maxH='200px'
				overflowY='auto'
				color={colors.headingText}
				{...props}
			>
				{value === undefined || value === null || value === '' ? 'N/A' : value}
			</Box>
		</Box>
	);
};

export default DisplayField;