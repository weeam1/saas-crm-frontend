import React, { useState, useMemo } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
	defs,
	Legend,
	LabelList,
	ReferenceLine,
	ComposedChart,
	Scatter,
	Area,
	// CustomAchievementDot,
} from 'recharts';
import {
	Box,
	Text,
	useColorModeValue,
	VStack,
	HStack,
	Badge,
	Select,
	Flex,
	ButtonGroup,
	Button,
} from '@chakra-ui/react';
import TopFilter from '../TopFilter';
import { yearsOptions } from '../../helpers';
import { formatCurrency } from 'utils/helpers';

const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const SalesBarChart = ({ data }) => {
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	// Sales (bar) – Deep blue for trust/progress
	const barColor = useColorModeValue('#2563EB', '#3B82F6');

	// Target – Orange-red to signal goal or urgency
	const targetColor = useColorModeValue('#F97316', '#FDBA74');

	// Achieved – Green indicating success
	const achievedColor = useColorModeValue('#16A34A', '#4ADE80');

	const textColor = useColorModeValue('gray.700', 'gray.200');
	const gridColor = useColorModeValue('gray.100', 'gray.700');
	const tooltipBg = useColorModeValue('white', 'gray.800');
	const tooltipBorder = useColorModeValue('gray.200', 'gray.600');

	const completeChartData = useMemo(() => {
		const currentYear = selectedYear;
		const result = [];

		// Find the earliest month in the data
		let startMonth = 0;
		if (Array.isArray(data) && data.length > 0) {
			startMonth = Math.min(
				...data.filter((d) => d.year === currentYear).map((d) => d.month - 1)
			);
		} else if (data?.year === currentYear) {
			startMonth = data.month - 1;
		}

		// Create data from start month to December
		for (let month = startMonth; month < 12; month++) {
			const monthName = MONTHS[month];
			const monthData = Array.isArray(data)
				? data.find((d) => d.month === month + 1 && d.year === currentYear)
				: data?.month === month + 1 && data?.year === currentYear
					? data
					: null;

			result.push({
				month: month + 1,
				monthName: monthData?.monthName || `${monthName} ${currentYear}`,
				shortMonth: monthName.substring(0, 3),
				sales: monthData?.sales || 0,
				target: monthData?.target || 0,
				deals: monthData?.deals || 0,
				achievementRate: monthData?.achievementRate || 0,
				year: currentYear,
			});
		}

		return result;
	}, [data, selectedYear]);

	// Custom Tooltip
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<Box
					bg={tooltipBg}
					p={3}
					borderRadius='md'
					boxShadow='md'
					borderWidth='1px'
					borderColor={tooltipBorder}
				>
					<Text fontWeight='bold' mb={1}>
						{data.monthName}
					</Text>
					<VStack spacing={1} align='stretch'>
						<HStack justify='space-between'>
							<Text fontSize='sm'>Sales:</Text>
							<Text fontSize='sm' fontWeight='medium'>
								{formatCurrency(data.sales)}
							</Text>
						</HStack>
						<HStack justify='space-between'>
							<Text fontSize='sm'>Target:</Text>
							<Text fontSize='sm' fontWeight='medium'>
								{formatCurrency(data.target)}
							</Text>
						</HStack>
						<HStack justify='space-between'>
							<Text fontSize='sm'>Achievement:</Text>
							<Badge
								colorScheme={data.achievementRate >= 100 ? 'green' : 'orange'}
								fontSize='sm'
							>
								{data.achievementRate.toFixed(2)}%
							</Badge>
						</HStack>
						<HStack justify='space-between'>
							<Text fontSize='sm'>Deals Closed:</Text>
							<Text fontSize='sm' fontWeight='medium'>
								{data.deals}
							</Text>
						</HStack>
					</VStack>
				</Box>
			);
		}
		return null;
	};

	// Custom bar label
	const renderCustomBarLabel = ({ x, y, width, value }) => {
		return (
			<text
				x={x + width / 2}
				y={y - 5}
				fill={textColor}
				textAnchor='middle'
				fontSize='12px'
				fontWeight='500'
			>
				{value > 0 ? value.toLocaleString() : ''}
			</text>
		);
	};

	const CustomAchievementDot = (props) => {
		const { cx, cy, payload } = props;
		return (
			<g>
				<circle
					cx={cx}
					cy={cy}
					r={6}
					fill={payload.achievementRate >= 100 ? achievedColor : barColor}
				/>
				<text
					x={cx}
					y={cy}
					dy={-10}
					fontSize={10}
					textAnchor='middle'
					fill={textColor}
				>
					{`${Math.round(payload.achievementRate)}%`}
				</text>
			</g>
		);
	};

	return (
		<Box width='100%' height='500px'>
			<Flex justify='space-between' align='center' p='2' mb={4}>
				<Text fontSize='lg' fontWeight='semibold' color={textColor}>
					Monthly Sales Performance
				</Text>

				{/* <TopFilter
					view={selectedYear}
					setView={setSelectedYear}
					options={yearsOptions}
				/> */}
			</Flex>

			<ResponsiveContainer width='100%' height='90%'>
				<ComposedChart
					data={completeChartData}
					margin={{
						top: 20,
						right: 20,
						left: 20,
						bottom: 60,
					}}
					barGap={0}
				>
					<CartesianGrid
						strokeDasharray='3 3'
						vertical={false}
						stroke={gridColor}
					/>
					<XAxis
						dataKey='shortMonth'
						tick={{ fill: textColor, fontSize: 12 }}
						axisLine={true}
						tickLine={false}
					/>
					<YAxis
						tick={{ fill: textColor, fontSize: 12 }}
						axisLine={true}
						tickLine={false}
						width={80}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
					/>
					<Legend />

					{/* Target Bars (transparent) */}
					<Bar
						dataKey='target'
						name='Target'
						fill={targetColor}
						opacity={0.3}
						radius={[4, 4, 0, 0]}
						barSize={35}
					/>

					{/* Sales Area (with gradient) */}
					<defs>
						<linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor={barColor} stopOpacity={0.8} />
							<stop offset='95%' stopColor={barColor} stopOpacity={0.1} />
						</linearGradient>
					</defs>
					<Area
						type='monotone'
						dataKey='sales'
						name='Actual Sales'
						fill='url(#salesGradient)'
						stroke={barColor}
						strokeWidth={2}
						activeDot={{ r: 6 }}
					/>

					{/* Achievement Dots */}
					{/* <Scatter
						dataKey='achievementRate'
						name='Achievement %'
						fill={achievedColor}
						shape={<CustomAchievementDot />}
					/> */}
				</ComposedChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default SalesBarChart;
