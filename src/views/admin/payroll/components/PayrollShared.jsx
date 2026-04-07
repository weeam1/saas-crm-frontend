import { HStack, Text } from '@chakra-ui/react';
import { formatCurrency } from 'utils/helpers';

export const DeductionRow = ({ label, value, isHighlight, currency }) => (
	<HStack justify='space-between'>
		<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.600'>
			{label}
		</Text>
		<Text
			fontSize={{ base: 'xs', md: 'sm' }}
			fontWeight='semibold'
			color={isHighlight ? 'brand.500' : 'red.500'}
		>
			{formatCurrency(value, currency)}
		</Text>
	</HStack>
);
