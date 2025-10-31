import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import {
	Box,
	Text,
	VStack,
	HStack,
	Progress,
	useColorModeValue,
	Badge,
	Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const PerformanceRadarChart = ({ summary, isFullScreen }) => {
	const textColor = useColorModeValue('gray.700', 'gray.200');
	const gridColor = useColorModeValue('#E2E8F0', '#4A5568');
	const polarRadiusColor = useColorModeValue('#718096', '#A0AEC0');

	const bgColor = useColorModeValue('gray.50', 'gray.700');

	const performanceData = [
		{
			subject: 'Deals Closed',
			value: summary.deals,
			fullMark: 150,
			description: 'Total deals converted',
			icon: '🤝',
			color: '#10B981',
		},
		{
			subject: 'Interested Leads',
			value: summary.interestedLeads,
			fullMark: 500,
			description: 'Leads showing interest',
			icon: '🎯',
			color: '#3B82F6',
		},
		// {
		// 	subject: 'Notes per Lead',
		// 	value: summary.avgNotesPerLead,
		// 	fullMark: 2,
		// 	description: 'Average notes per lead',
		// 	icon: '📝',
		// 	color: '#8B5CF6',
		// },
		// {
		// 	subject: 'Lead Growth',
		// 	value: Math.abs(summary.leadGrowthRate || 0),
		// 	fullMark: 20,
		// 	description: 'Monthly growth rate (%)',
		// 	icon: '📈',
		// 	color: '#F59E0B',
		// },
		{
			subject: 'Conversion Rate',
			value: summary.dealConversionRate || 0.43, // Fallback example
			fullMark: 5,
			description: 'Lead to deal conversion %',
			icon: '🔄',
			color: '#EC4899',
		},
		{
			subject: 'New Leads',
			value: summary.newLeadsThisMonth,
			fullMark: 100,
			description: 'New leads this month',
			icon: '🆕',
			color: '#06B6D4',
		},
	];

	const CustomPolarAngleAxis = ({ payload, x, y, cx, cy, ...rest }) => {
		const dataItem = performanceData.find(
			(item) => item.subject === payload.value
		);

		return (
			<g>
				<text
					x={x}
					y={y}
					fill={textColor}
					textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
					dominantBaseline='central'
					fontSize={isFullScreen ? 12 : 10}
					fontWeight='medium'
				>
					{dataItem?.icon} {payload.value}
				</text>
			</g>
		);
	};

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			const percentage = ((data.value / data.fullMark) * 100).toFixed(1);

			return (
				<Box
					bg='white'
					p={4}
					borderRadius='lg'
					boxShadow='2xl'
					border='1px solid'
					borderColor='gray.200'
					minWidth='220px'
				>
					<HStack spacing={2} mb={2}>
						<Text fontSize='2xl'>{data.icon}</Text>
						<VStack align='start' spacing={0}>
							<Text fontWeight='bold' color='gray.800' fontSize='sm'>
								{data.subject}
							</Text>
							<Text fontSize='xs' color='gray.500'>
								{data.description}
							</Text>
						</VStack>
					</HStack>

					<VStack align='start' spacing={2} width='100%'>
						<HStack justify='space-between' width='100%'>
							<Text fontSize='sm' color='gray.600'>
								Current:
							</Text>
							<Text fontWeight='bold' color={data.color} fontSize='sm'>
								{data.value}
							</Text>
						</HStack>

						<HStack justify='space-between' width='100%'>
							<Text fontSize='sm' color='gray.600'>
								Target:
							</Text>
							<Text fontSize='sm' color='gray.600'>
								{data.subject === 'Notes per Lead'
									? data.fullMark?.toFixed(1)
									: data.fullMark}
							</Text>
						</HStack>

						<Box width='100%'>
							<HStack justify='space-between' mb={1}>
								<Text fontSize='xs' color='gray.500'>
									Progress
								</Text>
								<Text fontSize='xs' fontWeight='bold' color={data.color}>
									{percentage}%
								</Text>
							</HStack>
							<Progress
								value={(data.value / data.fullMark) * 100}
								colorScheme={getColorScheme(data.color)}
								size='sm'
								borderRadius='full'
								bg={bgColor}
							/>
						</Box>

						<Badge
							colorScheme={getColorScheme(data.color)}
							fontSize='xs'
							px={2}
							py={1}
							borderRadius='md'
						>
							{getPerformanceStatus(percentage)}
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

	return (
		<Box width='100%' height='100%' position='relative'>
			{/* Radar Chart */}
			<ResponsiveContainer width='100%' height={isFullScreen ? '90%' : '85%'}>
				<RadarChart
					data={performanceData}
					margin={
						isFullScreen
							? { top: 30, right: 30, bottom: 30, left: 30 }
							: { top: 5, right: 5, bottom: 5, left: 5 }
					}
				>
					<PolarGrid
						stroke={gridColor}
						strokeOpacity={0.6}
						polarRadius={[20, 40, 60, 80]}
					/>
					<PolarAngleAxis
						dataKey='subject'
						tick={(props) => <CustomPolarAngleAxis {...props} />}
					/>
					<PolarRadiusAxis
						angle={90}
						domain={[0, 'auto']}
						stroke={polarRadiusColor}
						strokeOpacity={0.8}
						tick={{ fontSize: isFullScreen ? 11 : 9, fill: textColor }}
					/>
					<Radar
						name='Current Performance'
						dataKey='value'
						stroke='#4F46E5'
						fill='#4F46E5'
						fillOpacity={0.4}
						strokeWidth={2}
						dot={{ fill: '#4F46E5', strokeWidth: 2, r: isFullScreen ? 5 : 3 }}
						activeDot={{
							r: isFullScreen ? 7 : 5,
							fill: '#4F46E5',
							stroke: '#FFFFFF',
							strokeWidth: 2,
						}}
					/>
					{isFullScreen && (
						<Legend
							verticalAlign='bottom'
							height={10}
							formatter={(value) => (
								<Text as='span' fontSize='md' color={textColor}>
									{value}
								</Text>
							)}
						/>
					)}
				</RadarChart>
			</ResponsiveContainer>

			{/* Performance Summary */}
			{!isFullScreen && (
				<Box mt={3} p={3} bg={bgColor} borderRadius='md'>
					<HStack justify='space-between' flexWrap='wrap' spacing={2}>
						{performanceData.slice(0, 3).map((item, index) => (
							<VStack
								key={index}
								spacing={1}
								align='center'
								flex='1'
								minWidth='80px'
							>
								<Text fontSize='xs' color='gray.500' textAlign='center'>
									{item.subject.split(' ')[0]}
								</Text>
								<Text fontSize='sm' fontWeight='bold' color={item.color}>
									{item.subject === 'Notes per Lead'
										? item.value?.toFixed(2)
										: item.value}
								</Text>
							</VStack>
						))}
					</HStack>
				</Box>
			)}
		</Box>
	);
};

export default PerformanceRadarChart;
