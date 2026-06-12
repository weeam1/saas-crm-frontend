/**
 * BreakdownChart — responsive donut for a category breakdown.
 * Data: rows of { name, count } (e.g. by-source or by-status).
 * Includes an accessible legend with values/percentages.
 */

import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { MODAL_TOKENS } from 'hooks/useModalColors';
import { colorAt, formatFull } from '../helpers';
import ChartTooltip from './ChartTooltip';

export const BreakdownChart = ({ rows = [], height = 280, dataKey = 'count' }) => {
	const total = rows.reduce((sum, r) => sum + Number(r[dataKey] || 0), 0);

	return (
		<Flex direction={{ base: 'column', md: 'row' }} align='center' gap={4} h='100%'>
			<Box w={{ base: '100%', md: '55%' }} minW={0}>
				<ResponsiveContainer width='100%' height={height}>
					<PieChart>
						<Pie
							data={rows}
							dataKey={dataKey}
							nameKey='name'
							cx='50%'
							cy='50%'
							innerRadius='58%'
							outerRadius='85%'
							paddingAngle={2}
							stroke={MODAL_TOKENS.bg}
							strokeWidth={2}
						>
							{rows.map((entry, i) => (
								<Cell key={i} fill={entry.color || colorAt(i)} />
							))}
						</Pie>
						<Tooltip content={<ChartTooltip />} />
					</PieChart>
				</ResponsiveContainer>
			</Box>

			{/* Accessible legend / data list */}
			<Box
				as='ul'
				w={{ base: '100%', md: '45%' }}
				listStyleType='none'
				m={0}
				p={0}
				maxH={height}
				overflowY='auto'
				aria-label='Breakdown values'
			>
				<Grid templateColumns='1fr' gap={2}>
					{rows.map((entry, i) => {
						const value = Number(entry[dataKey] || 0);
						const pct = total ? ((value / total) * 100).toFixed(1) : '0.0';
						return (
							<Flex as='li' key={i} align='center' justify='space-between' gap={2}>
								<Flex align='center' gap={2} minW={0}>
									<Box w='10px' h='10px' rounded='sm' bg={entry.color || colorAt(i)} flexShrink={0} />
									<Text fontSize='sm' color={MODAL_TOKENS.bodyText} isTruncated title={entry.label || entry.name}>
										{entry.label || entry.name}
									</Text>
								</Flex>
								<Text fontSize='sm' color={MODAL_TOKENS.headingText} fontWeight='medium' flexShrink={0}>
									{formatFull(value)} <Text as='span' color={MODAL_TOKENS.mutedText}>({pct}%)</Text>
								</Text>
							</Flex>
						);
					})}
				</Grid>
			</Box>
		</Flex>
	);
};

export default BreakdownChart;
