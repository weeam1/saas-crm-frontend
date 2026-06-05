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
	Badge,
} from '@chakra-ui/react';

const MonthlyLeadsChart = ({ summary, isFullScreen }) => {
	// Use semantic tokens for colors
	const goldPrimary = '#D4AF37';
	const goldLight = '#F5D67B';
	const goldDark = '#C9A227';
	const navy600 = '#1E3D5C';
	const navy700 = '#1A3550';

	// Enhanced data with growth indicators
	const monthlyData = [
		{
			month: 'Previous Month',
			leads: summary.prevMonthLeads,
			change: summary.leadGrowthRate || 0,
			shortName: 'Prev',
			color: navy600,
			description: 'Leads from previous month',
			trend: 'baseline',
		},
		{
			month: 'Current Month',
			leads: summary.currentMonthLeads,
			change: 0,
			shortName: 'Current',
			color: goldPrimary,
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
					bg='bg.surface'
					p={4}
					borderRadius='lg'
					boxShadow='card'
					border='1px solid'
					borderColor='border.default'
					minWidth='220px'
					className='selectable-tooltip'
					style={{
						userSelect: 'text',
						WebkitUserSelect: 'text',
						MozUserSelect: 'text',
						msUserSelect: 'text',
					}}
				>
					<Text fontWeight='bold' color='text.heading' fontSize='md' mb={3}>
						{data.month}
					</Text>
					<VStack align='start' spacing={3}>
						<HStack justify='space-between' width='100%'>
							<Text color='text.muted' fontSize='sm'>
								Leads Count:
							</Text>
							<Text fontWeight='bold' color='text.accent' fontSize='lg'>
								{data.leads.toLocaleString()}
							</Text>
						</HStack>

						{data.change !== 0 && (
							<HStack justify='space-between' width='100%'>
								<Text color='text.muted' fontSize='sm'>
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
							<Text fontSize='xs' color='text.muted' fontStyle='italic'>
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
					fill='#FFFFFF'
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
						fill={isPositive ? '#10B981' : '#EE5D50'}
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
					fill='#B0B0B0'
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

	return (
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
					stroke={navy700}
					vertical={false}
				/>
				<XAxis
					dataKey='shortName'
					tick={{ fontSize: 0 }}
					axisLine={false}
					tickLine={false}
				/>
				<YAxis
					tick={{
						fontSize: isFullScreen ? 12 : 10,
						fill: '#B0B0B0',
						fontWeight: '500',
					}}
					axisLine={false}
					tickLine={false}
					width={60}
				/>
				<Tooltip
					content={<CustomTooltip />}
					cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
				/>
				{/* Reference line for average */}
				<ReferenceLine
					y={averageLeads}
					stroke={goldLight}
					strokeDasharray='3 3'
					strokeWidth={2}
				>
					<Label
						value='Average'
						position='insideTopRight'
						fill={goldLight}
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
							stroke={entry.color === goldPrimary ? goldDark : 'transparent'}
						/>
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default MonthlyLeadsChart;