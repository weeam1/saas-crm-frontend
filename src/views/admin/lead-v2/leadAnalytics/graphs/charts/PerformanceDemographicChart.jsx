import React from 'react';
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
	useColorModeValue,
	Progress,
	Badge,
	Flex,
	Icon,
	SimpleGrid,
} from '@chakra-ui/react';

const PerformanceDemographicChart = ({ summary, isFullScreen }) => {
	const textColor = useColorModeValue('gray.700', 'gray.200');
	const gridColor = useColorModeValue('#E2E8F0', '#4A5568');
	const bgColor = useColorModeValue('white', 'gray.800');
	const progressBgColor = useColorModeValue('gray.100', 'gray.700');

	// Convert your performance data to demographic bar chart format
	const performanceData = [
		{
			subject: 'Deals Closed',
			value: summary.deals || 77,
			fullMark: 150,
			description: 'Total deals converted',
			icon: '🤝',
			color: '#10B981',
		},
		{
			subject: 'Interested Leads',
			value: summary.interestedLeads || 248,
			fullMark: 500,
			description: 'Leads showing interest',
			icon: '🎯',
			color: '#3B82F6',
		},
		{
			subject: 'Total Leads',
			value: summary.leadCount || 18044,
			fullMark: 20000,
			description: 'Total leads in system',
			icon: '📊',
			color: '#06B6D4',
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
					borderColor='gray.200'
					minWidth='220px'
				>
					<VStack align='start' spacing={3} width='100%'>
						<HStack justify='space-between' width='100%'>
							<Text color='gray.600'>Current:</Text>
							<Text fontWeight='bold' color={data?.color} fontSize='lg'>
								{data?.value?.toLocaleString()}
							</Text>
						</HStack>

						<HStack justify='space-between' width='100%'>
							<Text color='gray.600'>Target:</Text>
							<Text fontSize='sm' color='gray.600'>
								{data?.fullMark?.toLocaleString()}
							</Text>
						</HStack>

						<HStack justify='space-between' width='100%'>
							<Text color='gray.600'>Progress:</Text>
							<Text fontSize='sm' fontWeight='bold' color={data?.color}>
								{data?.percentage.toFixed(1)}%
							</Text>
						</HStack>

						<Box width='100%'>
							<Progress
								value={data?.percentage}
								colorScheme={getColorScheme(data?.color)}
								size='lg'
								borderRadius='full'
								bg={progressBgColor}
								height='8px'
							/>
						</Box>

						<Badge
							colorScheme={getColorScheme(data?.color)}
							fontSize='xs'
							px={2}
							py={1}
							borderRadius='md'
						>
							{getPerformanceStatus(data?.percentage)}
						</Badge>
					</VStack>
				</Box>
			);
		}
		return null;
	};

	const getPerformanceStatus = (percentage) => {
		if (percentage >= 80) return 'Excellent';
		if (percentage >= 60) return 'Good';
		if (percentage >= 40) return 'Average';
		if (percentage >= 20) return 'Below Target';
		return 'Needs Improvement';
	};

	const getColorScheme = (color) => {
		const colorMap = {
			'#10B981': 'green',
			'#3B82F6': 'blue',
			'#8B5CF6': 'purple',
			'#F59E0B': 'orange',
			'#EC4899': 'pink',
			'#06B6D4': 'cyan',
		};
		return colorMap[color] || 'gray';
	};

	const CustomBarLabel = ({ x, y, width, height, value, payload }) => {
		return (
			<g>
				{/* Percentage label on top */}
				<text
					x={x + width / 2}
					y={y - 15}
					fill={textColor}
					textAnchor='middle'
					dominantBaseline='middle'
					fontSize={isFullScreen ? 12 : 10}
					fontWeight='bold'
				>
					{payload?.percentage.toFixed(1)}%
				</text>

				{/* Value label inside bar */}
				<text
					x={x + width / 2}
					y={y + height / 2}
					fill='white'
					textAnchor='middle'
					dominantBaseline='middle'
					fontSize={isFullScreen ? 11 : 9}
					fontWeight='bold'
				>
					{payload?.value?.toLocaleString()}
				</text>

				{/* Subject label at bottom */}
				<text
					x={x + width / 2}
					y={y + height + (isFullScreen ? 25 : 20)}
					fill={textColor}
					textAnchor='middle'
					dominantBaseline='middle'
					fontSize={isFullScreen ? 12 : 10}
					fontWeight='medium'
				>
					{payload?.subject}
				</text>
			</g>
		);
	};

	console.log({ performanceData });
	// Calculate max value for YAxis
	const maxPercentage = Math.max(
		...performanceData.map((item) => item?.percentage)
	);

	return (
		<Box width='100%' height='100%' position='relative'>
			{/* Header */}
			{!isFullScreen && (
				<VStack align='start' spacing={1} mb={4} px={1}>
					<Text fontSize='lg' fontWeight='semibold' color={textColor}>
						Performance Metrics
					</Text>
					<Text fontSize='sm' color='gray.500'>
						Key performance indicators progress
					</Text>
				</VStack>
			)}

			{/* Chart */}
			<ResponsiveContainer width='100%' height={isFullScreen ? '80%' : '75%'}>
				<BarChart
					data={performanceData}
					margin={
						isFullScreen
							? { top: 40, right: 30, bottom: 60, left: 20 }
							: { top: 30, right: 20, bottom: 50, left: 10 }
					}
					barSize={isFullScreen ? 60 : 45}
				>
					<CartesianGrid
						strokeDasharray='3 3'
						stroke={gridColor}
						vertical={false}
					/>
					<XAxis
						dataKey='subject'
						tick={{ fontSize: 0 }} // Hide default x-axis labels
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fontSize: isFullScreen ? 12 : 10, fill: textColor }}
						axisLine={false}
						tickLine={false}
						// domain={[0, Math.ceil(maxPercentage / 10) * 10]}
						tickFormatter={(value) => `${value}%`}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Bar
						dataKey='percentage'
						radius={[4, 4, 0, 0]}
						label={<CustomBarLabel />}
					>
						{performanceData.map((entry, index) => (
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

			{/* Performance Summary */}
			{/* {!isFullScreen && (
				<Box mt={4} p={4} bg={'gray.50'} borderRadius='md'>
					<Flex justify='space-between' align='center' wrap='wrap' gap={3}>
						<VStack align='start' spacing={0}>
							<Text fontSize='sm' color='gray.600'>
								Best Performing
							</Text>
							<Badge colorScheme='green' fontSize='xs'>
								{
									performanceData.reduce((max, item) =>
										item.percentage > max.percentage ? item : max
									).subject
								}
							</Badge>
						</VStack>
						<VStack align='start' spacing={0}>
							<Text fontSize='sm' color='gray.600'>
								Total Progress
							</Text>
							<Text fontSize='sm' fontWeight='medium'>
								{(
									performanceData.reduce(
										(sum, item) => sum + item.percentage,
										0
									) / performanceData.length || 0
								).toFixed(1)}
								%
							</Text>
						</VStack>
						<VStack align='start' spacing={0}>
							<Text fontSize='sm' color='gray.600'>
								Metrics
							</Text>
							<Text fontSize='sm' fontWeight='medium'>
								{performanceData.length}
							</Text>
						</VStack>
					</Flex>
				</Box>
			)} */}

			{/* Full Screen Additional Insights */}
			{/* {isFullScreen && (
				<Box mt={6} p={6} bg={'gray.50'} borderRadius='lg'>
					<Text fontSize='lg' fontWeight='semibold' mb={4}>
						Performance Insights
					</Text>
					<SimpleGrid columns={2} spacing={4}>
						{performanceData.map((item, index) => (
							<Box
								key={index}
								p={3}
								bg={bgColor}
								borderRadius='md'
								borderLeft='4px solid'
								borderLeftColor={item.color}
							>
								<HStack justify='space-between' mb={2}>
									<Text fontSize='sm' fontWeight='medium'>
										{item.subject}
									</Text>
									<Text fontSize='2xl'>{item.icon}</Text>
								</HStack>
								<Progress
									value={item.percentage}
									colorScheme={getColorScheme(item.color)}
									size='sm'
									borderRadius='full'
									mb={2}
								/>
								<HStack justify='space-between'>
									<Text fontSize='xs' color='gray.500'>
										Progress
									</Text>
									<Text fontSize='xs' fontWeight='bold' color={item.color}>
										{item.percentage.toFixed(1)}%
									</Text>
								</HStack>
							</Box>
						))}
					</SimpleGrid>
				</Box>
			)} */}
		</Box>
	);
};

export default PerformanceDemographicChart;
