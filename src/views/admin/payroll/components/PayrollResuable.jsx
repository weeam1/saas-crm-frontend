import { HStack, Text } from '@chakra-ui/react';

export const SalarySummaryRow = ({
	label,
	value,
	color = 'gray.600',
	valueColor = 'green.500',
}) => (
	<HStack w='100%' justify='space-between'>
		<Text color={color}>{label}</Text>
		<Text fontWeight='semibold' color={valueColor}>
			{value}
		</Text>
	</HStack>
);
