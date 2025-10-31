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
	LabelList,
} from 'recharts';
import {
	Box,
	Text,
	VStack,
	HStack,
	useColorModeValue,
	IconButton,
	Badge,
	Flex,
} from '@chakra-ui/react';

const KeyMetricsBarChart = ({ summary, isFullScreen }) => {
	const textColor = useColorModeValue('gray.700', 'gray.200');
	const gridColor = useColorModeValue('#E2E8F0', '#4A5568');
	const bgColor = useColorModeValue('white', 'gray.800');
	const cardBg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.600');

	// Prepare data for the chart
	const chartData = [
		{
			name: 'Total Leads',
			value: summary.leadCount || 18044,
			shortName: 'Leads',
			color: '#3B82F6',
			description: 'Total number of leads in system',
			icon: '👥',
		},
		{
			name: 'Notes Count',
			value: summary.notesCount || 10385,
			shortName: 'Notes',
			color: '#10B981',
			description: 'Total notes recorded',
			icon: '📝',
		},
		{
			name: 'Deals Closed',
			value: summary.deals || 77,
			shortName: 'Deals',
			color: '#8B5CF6',
			description: 'Successful deals converted',
			icon: '🤝',
		},
	];

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<Box
					bg={bgColor}
					p={4}
					borderRadius='lg'
					boxShadow='2xl'
					border='1px solid'
					borderColor={borderColor}
					minWidth='200px'
				>
					<HStack spacing={3} mb={3}>
						<Text fontSize='2xl'>{data.icon}</Text>
						<VStack align='start' spacing={0}>
							<Text fontWeight='bold' color='gray.800' fontSize='md'>
								{data.name}
							</Text>
							<Text fontSize='sm' color='gray.500'>
								{data.description}
							</Text>
						</VStack>
					</HStack>
					<VStack align='start' spacing={2}>
						<HStack justify='space-between' width='100%'>
							<Text color='gray.600'>Count:</Text>
							<Text fontWeight='bold' color={data.color} fontSize='xl'>
								{data.value.toLocaleString()}
							</Text>
						</HStack>
						<Box width='100%' mt={2}>
							<Badge
								colorScheme={getColorScheme(data.color)}
								fontSize='xs'
								px={2}
								py={1}
								borderRadius='md'
							>
								{getMetricType(data.name)}
							</Badge>
						</Box>
					</VStack>
				</Box>
			);
		}
		return null;
	};

	const getColorScheme = (color) => {
		const colorMap = {
			'#3B82F6': 'blue',
			'#10B981': 'green',
			'#8B5CF6': 'purple',
		};
		return colorMap[color] || 'gray';
	};

	const getMetricType = (name) => {
		const types = {
			'Total Leads': 'Primary Metric',
			'Notes Count': 'Engagement',
			'Deals Closed': 'Conversion',
		};
		return types[name] || 'Metric';
	};

	const CustomBarLabel = ({ x, y, width, height, value, index }) => {
		const data = chartData[index];
		return (
			<g>
				{/* Value label inside bar for large numbers, outside for small */}
				{value > 1000 ? (
					<text
						x={x + width / 2}
						y={y + height / 2}
						fill='white'
						textAnchor='middle'
						dominantBaseline='middle'
						fontSize={isFullScreen ? 12 : 10}
						fontWeight='bold'
					>
						{formatValue(value)}
					</text>
				) : (
					<text
						x={x + width / 2}
						y={y - 10}
						fill={data.color}
						textAnchor='middle'
						dominantBaseline='middle'
						fontSize={isFullScreen ? 12 : 10}
						fontWeight='bold'
					>
						{value.toLocaleString()}
					</text>
				)}

				{/* Metric name at bottom */}
				<text
					x={x + width / 2}
					y={y + height + (isFullScreen ? 25 : 20)}
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

	const formatValue = (value) => {
		if (value >= 1000000) {
			return `${(value / 1000000).toFixed(1)}M`;
		} else if (value >= 1000) {
			return `${(value / 1000).toFixed(1)}K`;
		}
		return value.toLocaleString();
	};

	// Calculate max value for YAxis with some padding
	const maxValue = Math.max(...chartData.map((item) => item.value)) * 1.1;

	return (
		<>
			<ResponsiveContainer width='99%' height='100%'>
				<BarChart
					data={chartData}
					margin={
						isFullScreen
							? { top: 40, right: 30, bottom: 60, left: 20 }
							: { top: 20, right: 10, bottom: 20, left: 10 }
					}
					barSize={isFullScreen ? 80 : 60}
				>
					<CartesianGrid
						strokeDasharray='3 3'
						stroke={gridColor}
						vertical={false}
					/>
					<XAxis
						dataKey='shortName'
						tick={{ fontSize: 0 }} // Hide default x-axis labels
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fontSize: isFullScreen ? 12 : 10, fill: textColor }}
						axisLine={false}
						tickLine={false}
						domain={[0, maxValue]}
						tickFormatter={formatValue}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Bar dataKey='value' radius={[4, 4, 0, 0]} label={CustomBarLabel}>
						{chartData.map((entry, index) => (
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

export default KeyMetricsBarChart;
