/**
 * ChartTooltip — themed recharts tooltip used across all module charts.
 */

import { Box, Flex, Text } from '@chakra-ui/react';
import { MODAL_TOKENS } from 'hooks/useModalColors';
import { formatFull } from '../helpers';

export const ChartTooltip = ({ active, payload, label, valueFormatter }) => {
	if (!active || !payload || !payload.length) return null;
	const fmt = valueFormatter || formatFull;

	return (
		<Box
			bg={MODAL_TOKENS.bgDeep}
			borderWidth='1px'
			borderColor={MODAL_TOKENS.borderColor}
			rounded='md'
			px={3}
			py={2}
			boxShadow={MODAL_TOKENS.cardShadow}
		>
			{label !== undefined && (
				<Text fontSize='xs' color={MODAL_TOKENS.mutedText} mb={1}>
					{label}
				</Text>
			)}
			{payload.map((entry, i) => (
				<Flex key={i} align='center' gap={2} fontSize='sm'>
					<Box
						w='10px'
						h='10px'
						rounded='sm'
						bg={entry.color || entry.payload?.fill || MODAL_TOKENS.accentGold}
					/>
					<Text color={MODAL_TOKENS.bodyText}>
						{entry.name}:{' '}
						<Text as='span' color={MODAL_TOKENS.headingText} fontWeight='semibold'>
							{fmt(entry.value)}
						</Text>
					</Text>
				</Flex>
			))}
		</Box>
	);
};

export default ChartTooltip;
