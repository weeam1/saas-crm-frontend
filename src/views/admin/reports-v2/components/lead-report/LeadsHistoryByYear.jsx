import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LabelList,
	Cell,
} from 'recharts';
import { Box, Text, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useFetchItemsQuery } from 'api/apiSlice';
import CardShimmer from 'components/loading/CardShimmer';

import NoData from 'components/Message/NoData';

const CustomTooltip = ({ active, payload }) => {
	if (!active || !payload || !payload.length) return null;
	const { year, totalLeads } = payload[0].payload;
	return (
		<Box bg='white' p={3} borderRadius='md' boxShadow='md'>
			<Text fontWeight='semibold' fontSize='sm'>
				Year: {year}
			</Text>
			<Text fontSize='sm'>Leads: {totalLeads.toLocaleString()}</Text>
		</Box>
	);
};

const LeadsHistoryByYear = () => {
	const { data: leadHistory, isLoading } = useFetchItemsQuery(
		{
			path: '/v2/reporting/leads_history',
		},
		{ refetchOnMountOrArgChange: true }
	);

	const chartData = useMemo(() => {
		if (!leadHistory?.data || leadHistory?.data.length === 0) return [];
		return leadHistory?.data.map((item) => ({
			...item,
			name: item.year.toString(),
			value: item.totalLeads,
		}));
	}, [leadHistory?.data]);

	const counts = useMemo(() => chartData.map((d) => d.value), [chartData]);
	const minY = useMemo(() => Math.max(0, Math.min(...counts) - 500), [counts]);
	const maxY = useMemo(() => Math.max(...counts) + 500, [counts]);

	const colors = ['#3182ce', '#38a169', '#dd6b20', '#d53f8c', '#805ad5'];

	return isLoading ? (
		<CardShimmer
			count={1}
			height='300px'
			columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
		/>
	) : chartData && chartData?.length > 0 ? (
		<Box>
			<Text fontSize='lg' color='gray.800' fontWeight='bold' mb='8'>
				Lead History
			</Text>
			{/* <ResponsiveContainer width='100%' height={300}>
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 30, bottom: 30, left: 10 }}
					barSize={40}
				>
					<CartesianGrid
						strokeDasharray='3 3'
						vertical={false}
						stroke='#e2e8f0'
					/>
					<XAxis
						dataKey='name'
						axisLine
						tickLine={false}
						tick={{ fill: '#4a5568', fontSize: 14, fontWeight: 500 }}
					/>
					<YAxis
						domain={[minY, maxY]}
						axisLine
						tickLine={false}
						tick={{ fill: '#4a5568', fontSize: 12 }}
						allowDecimals={false}
					/>
					<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
					<Bar dataKey='value' radius={[6, 6, 0, 0]} animationDuration={1500}>
						{chartData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={colors[index % colors.length]}
							/>
						))}
						<LabelList
							dataKey='value'
							position='top'
							fill='#2d3748'
							fontSize={13}
							fontWeight={600}
						/>
					</Bar>
				</BarChart>
			</ResponsiveContainer> */}

			<Flex
				direction={{ base: 'column', md: 'row' }}
				gap={10}
				justify='space-between'
				align='center'
			>
				{/* Bar Chart */}
				<ResponsiveContainer width='100%' minWidth={300} height={300}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 30, bottom: 30, left: 10 }}
						barSize={40}
					>
						<CartesianGrid
							strokeDasharray='3 3'
							vertical={false}
							stroke='#e2e8f0'
						/>
						<XAxis
							dataKey='name'
							axisLine
							tickLine={false}
							tick={{ fill: '#4a5568', fontSize: 14, fontWeight: 500 }}
						/>
						<YAxis
							domain={[minY, maxY]}
							axisLine
							tickLine={false}
							tick={{ fill: '#4a5568', fontSize: 12 }}
							allowDecimals={false}
						/>
						<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
						<Bar dataKey='value' radius={[6, 6, 0, 0]} animationDuration={1500}>
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={colors[index % colors.length]}
								/>
							))}
							<LabelList
								dataKey='value'
								position='top'
								fill='#2d3748'
								fontSize={13}
								fontWeight={600}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>

				{/* Pie Chart */}
				{/* <ResponsiveContainer width='100%' minWidth={300} height={300}>
					<PieChart>
						<Pie
							data={chartData}
							dataKey='value'
							nameKey='name'
							cx='50%'
							cy='50%'
							outerRadius={100}
							activeIndex={chartData.map((_, index) => index)}
							activeShape={{ outerRadius: 110 }}
							fill='#8884d8'
							label={({ name, percent }) =>
								`${name}: ${(percent * 100).toFixed(0)}%`
							}
							labelLine={true}
						>
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={colors[index % colors.length]}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</PieChart>
				</ResponsiveContainer> */}
			</Flex>
		</Box>
	) : (
		<Box py={2} textAlign='center'>
			<NoData label='leads history' />
		</Box>
	);
};

export default LeadsHistoryByYear;
