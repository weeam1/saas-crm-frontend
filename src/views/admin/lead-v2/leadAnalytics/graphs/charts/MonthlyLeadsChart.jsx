import React, { useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
	ReferenceLine,
	Label,
} from 'recharts';
import {
	Box,
	Text,
	HStack,
	VStack,
	useColorModeValue,
	IconButton,
	Badge,
	Flex,
	useToken,
} from '@chakra-ui/react';
import { BiExpand, BiCollapse } from 'react-icons/bi';

const MonthlyLeadsChart = ({ summary, isFullScreen }) => {
	// Color tokens for better consistency
	const [blue500, blue300, green500, red500, purple500] = useToken('colors', [
		'blue.500',
		'blue.300',
		'green.500',
		'red.500',
		'purple.500',
	]);

	const textColor = useColorModeValue('gray.700', 'gray.200');
	const gridColor = useColorModeValue('#E2E8F0', '#4A5568');
	const bgColor = useColorModeValue('white', 'gray.800');
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const highlightBg = useColorModeValue('blue.50', 'blue.900');
	const highlightColor = useColorModeValue('blue.600', 'blue.200');

	// Enhanced data with growth indicators
	const monthlyData = [
		{
			month: 'Previous Month',
			leads: summary.prevMonthLeads,
			change: summary.leadGrowthRate || 0,
			shortName: 'Prev',
			color: blue300,
			description: 'Leads from previous month',
			trend: 'baseline',
		},
		{
			month: 'Current Month',
			leads: summary.currentMonthLeads,
			change: 0,
			shortName: 'Current',
			color: blue500,
			description: 'Leads from current month',
			trend: 'current',
		},
	];

	// Enhanced Custom Tooltip with better styling
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			const isPositive = data.change > 0;

			return (
				<Box
					bg={bgColor}
					p={4}
					borderRadius='lg'
					boxShadow='2xl'
					border='1px solid'
					borderColor={borderColor}
					minWidth='220px'
					className='selectable-tooltip' // Add class for text selection
					style={{
						userSelect: 'text',
						WebkitUserSelect: 'text',
						MozUserSelect: 'text',
						msUserSelect: 'text',
					}}
				>
					<Text fontWeight='bold' color={textColor} fontSize='md' mb={3}>
						{data.month}
					</Text>
					<VStack align='start' spacing={3}>
						<HStack justify='space-between' width='100%'>
							<Text color='gray.600' fontSize='sm'>
								Leads Count:
							</Text>
							<Text fontWeight='bold' color={data.color} fontSize='lg'>
								{data.leads.toLocaleString()}
							</Text>
						</HStack>

						{data.change !== 0 && (
							<HStack justify='space-between' width='100%'>
								<Text color='gray.600' fontSize='sm'>
									Growth:
								</Text>
								<Badge
									colorScheme={isPositive ? 'green' : 'red'}
									fontSize='sm'
									px={2}
									py={1}
									borderRadius='md'
								>
									{isPositive ? '↗' : '↘'} {isPositive ? '+' : ''}
									{data.change}%
								</Badge>
							</HStack>
						)}

						<Box width='100%' pt={2}>
							<Text fontSize='xs' color='gray.500' fontStyle='italic'>
								{data.description}
							</Text>
						</Box>
					</VStack>
				</Box>
			);
		}
		return null;
	};

	// Custom bar label with better positioning
	const CustomBarLabel = ({ x, y, width, height, value, index }) => {
		const data = monthlyData[index];
		const isPositive = data.change > 0;

		return (
			<g className='selectable-text'>
				{/* Value on top of bar */}
				<text
					x={x + width / 2}
					y={y - 10}
					fill={textColor}
					textAnchor='middle'
					dominantBaseline='middle'
					fontSize={isFullScreen ? 14 : 12}
					fontWeight='bold'
					style={{ userSelect: 'text' }}
				>
					{value.toLocaleString()}
				</text>

				{/* Change indicator */}
				{data.change !== 0 && (
					<text
						x={x + width / 2}
						y={y + height + (isFullScreen ? 35 : 25)}
						fill={isPositive ? green500 : red500}
						textAnchor='middle'
						dominantBaseline='middle'
						fontSize={isFullScreen ? 12 : 10}
						fontWeight='medium'
					>
						{isPositive ? '+' : ''}
						{data.change}%
					</text>
				)}

				{/* Month name */}
				<text
					x={x + width / 2}
					y={y + height + (isFullScreen ? 20 : 15)}
					fill={textColor}
					textAnchor='middle'
					dominantBaseline='middle'
					fontSize={isFullScreen ? 12 : 10}
					fontWeight='medium'
				>
					{data.shortName}
				</text>
			</g>
		);
	};

	// Calculate average for reference line
	const averageLeads =
		monthlyData.reduce((sum, item) => sum + item.leads, 0) / monthlyData.length;

	// Normal mode
	return (
		<>
			<ResponsiveContainer width='100%' height='100%'>
				<BarChart
					data={monthlyData}
					margin={
						isFullScreen
							? { top: 40, right: 30, bottom: 60, left: 20 }
							: { top: 20, right: 10, bottom: 20, left: 10 }
					}
					barSize={isFullScreen ? 90 : 80}
				>
					<CartesianGrid
						strokeDasharray='3 3'
						stroke={gridColor}
						vertical={false}
					/>
					<XAxis
						dataKey='shortName'
						tick={{ fontSize: 0 }} // Hide default labels (using custom ones)
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{
							fontSize: isFullScreen ? 12 : 10,
							fill: textColor,
							fontWeight: '500',
						}}
						axisLine={false}
						tickLine={false}
						width={60}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
					/>
					{/* Reference line for average */}
					<ReferenceLine
						y={averageLeads}
						stroke={purple500}
						strokeDasharray='3 3'
						strokeWidth={2}
					>
						<Label
							value='Average'
							position='insideTopRight'
							fill={purple500}
							fontSize={10}
						/>
					</ReferenceLine>
					<Bar dataKey='leads' radius={[8, 8, 0, 0]} label={CustomBarLabel}>
						{monthlyData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color}
								opacity={0.9}
								strokeWidth={1}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</>
	);
};

export default MonthlyLeadsChart;
