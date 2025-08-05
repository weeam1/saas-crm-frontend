import React, { useMemo } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	LabelList,
} from 'recharts';
import {
	Box,
	Text,
	useTheme,
	Tooltip as ChakraTooltip,
	VStack,
	HStack,
} from '@chakra-ui/react';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<Box
				bg='white'
				p={3}
				borderRadius='md'
				boxShadow='lg'
				borderWidth='1px'
				borderColor='gray.100'
			>
				<Text fontWeight='semibold' color='gray.800' mb={2}>
					{label}
				</Text>
				<VStack spacing={1} align='stretch'>
					{payload.map((entry, index) => (
						<HStack key={`item-${index}`} spacing={2}>
							<Box w={3} h={3} bg={entry.color} borderRadius='sm' />
							<Text fontSize='sm' color='gray.600'>
								<Text as='span' fontWeight='medium'>
									{entry.name}:
								</Text>{' '}
								{typeof entry.value === 'number'
									? entry.value.toLocaleString()
									: entry.value}
							</Text>
						</HStack>
					))}
				</VStack>
			</Box>
		);
	}
	return null;
};

// Customized axis tick
const CustomizedAxisTick = ({ x, y, payload }) => {
	return (
		<g transform={`translate(${x},${y})`}>
			<text
				x={0}
				y={0}
				dy={16}
				textAnchor='end'
				fill='#4A5568' // Chakra gray.700
				fontSize='12px'
				fontWeight='500'
			>
				{payload.value}
			</text>
		</g>
	);
};

const SalesChart = ({ data }) => {
	const theme = useTheme();

	// Process chart data
	const chartData = useMemo(() => {
		if (!data?.monthlySales) return [];

		return data.map((item) => ({
			month: item.month,
			sales: item.amount,
			target: item.target,
			achievement: Math.min((item.amount / item.target) * 100, 100), // Cap at 100%
		}));
	}, [data]);

	// Color palette using Chakra colors
	const colors = {
		sales: theme.colors.blue[400],
		target: theme.colors.purple[300],
		achievement: theme.colors.green[400],
		achievementOver: theme.colors.green[600],
	};

	return (
		<Box w='100%' h='400px' mt={6}>
			<Text fontSize='xl' fontWeight='semibold' mb={4} color='gray.700'>
				Monthly Sales Performance
			</Text>

			<ResponsiveContainer width='100%' height='100%'>
				<BarChart
					data={chartData}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 60,
					}}
					barGap={4}
					barCategoryGap={12}
				>
					<CartesianGrid
						strokeDasharray='3 3'
						vertical={false}
						stroke={theme.colors.gray[200]}
					/>
					<XAxis
						dataKey='month'
						tick={<CustomizedAxisTick />}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fill: theme.colors.gray[600], fontSize: 12 }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
					/>
					<Legend
						wrapperStyle={{ paddingTop: '20px' }}
						formatter={(value) => (
							<span
								style={{
									color: theme.colors.gray[700],
									fontSize: '13px',
								}}
							>
								{value}
							</span>
						)}
					/>

					{/* Sales Bar */}
					<Bar
						dataKey='sales'
						name='Actual Sales'
						radius={[4, 4, 0, 0]}
						animationDuration={1800}
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colors.sales} opacity={0.9} />
						))}
						<LabelList
							dataKey='sales'
							position='top'
							formatter={(value) => value.toLocaleString()}
							style={{
								fill: theme.colors.gray[700],
								fontSize: '12px',
								fontWeight: 500,
							}}
						/>
					</Bar>

					{/* Target Bar */}
					<Bar
						dataKey='target'
						name='Sales Target'
						radius={[4, 4, 0, 0]}
						animationDuration={1800}
						animationBegin={300}
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colors.target} opacity={0.7} />
						))}
					</Bar>

					{/* Achievement Line */}
					<Bar
						dataKey='achievement'
						name='Achievement %'
						radius={[4, 4, 0, 0]}
						animationDuration={1800}
						animationBegin={600}
					>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={
									entry.achievement >= 100
										? colors.achievementOver
										: colors.achievement
								}
							/>
						))}
						<LabelList
							dataKey='achievement'
							position='top'
							formatter={(value) => `${Math.round(value)}%`}
							style={{
								fill: theme.colors.gray[700],
								fontSize: '12px',
								fontWeight: 500,
							}}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer>

			<Text fontSize='sm' mt={2} color='gray.500' textAlign='center'>
				Updated: {new Date().toLocaleDateString()}
			</Text>
		</Box>
	);
};

export default SalesChart;
