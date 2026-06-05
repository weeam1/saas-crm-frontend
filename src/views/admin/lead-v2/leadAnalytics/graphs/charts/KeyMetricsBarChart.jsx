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
} from 'recharts';
import {
	Box,
	Text,
	VStack,
	HStack,
	Badge,
} from '@chakra-ui/react';

const KeyMetricsBarChart = ({ summary, isFullScreen }) => {
	// Theme-aligned colors
	const navy600 = '#1E3D5C';
	const navy700 = '#1A3550';

	// Prepare data for the chart
	const chartData = [
		{
			name: 'Total Leads',
			value: summary.leadCount || 18044,
			shortName: 'Leads',
			color: '#3B82F6', // blue.400
			description: 'Total number of leads in system',
			icon: '👥',
		},
		{
			name: 'Notes Count',
			value: summary.notesCount || 10385,
			shortName: 'Notes',
			color: '#10B981', // green.500
			description: 'Total notes recorded',
			icon: '📝',
		},
		{
			name: 'Deals Closed',
			value: summary.deals || 77,
			shortName: 'Deals',
			color: '#D4AF37', // gold.primary - Changed from purple to gold
			description: 'Successful deals converted',
			icon: '🤝',
		},
	];

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<Box
					bg='bg.surface'
					p={4}
					borderRadius='lg'
					boxShadow='card'
					border='1px solid'
					borderColor='border.default'
					minWidth='200px'
				>
					<HStack spacing={3} mb={3}>
						<Text fontSize='2xl'>{data.icon}</Text>
						<VStack align='start' spacing={0}>
							<Text fontWeight='bold' color='text.heading' fontSize='md'>
								{data.name}
							</Text>
							<Text fontSize='sm' color='text.muted'>
								{data.description}
							</Text>
						</VStack>
					</HStack>
					<VStack align='start' spacing={2}>
						<HStack justify='space-between' width='100%'>
							<Text color='text.muted'>Count:</Text>
							<Text fontWeight='bold' color='text.heading' fontSize='xl'>
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
			'#D4AF37': 'yellow', // Gold maps to yellow scheme
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
						fill='#FFFFFF'
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
					fill='#B0B0B0' // text.muted
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
					stroke={navy700}
					vertical={false}
				/>
				<XAxis
					dataKey='shortName'
					tick={{ fontSize: 0 }} // Hide default x-axis labels
					axisLine={false}
					tickLine={false}
				/>
				<YAxis
					tick={{ fontSize: isFullScreen ? 12 : 10, fill: '#B0B0B0' }}
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
							stroke={entry.color === '#D4AF37' ? '#C9A227' : 'transparent'}
						/>
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default KeyMetricsBarChart;