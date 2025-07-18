import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';
import { Box, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useMemo, useState } from 'react';
import NoData from 'components/Message/NoData';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import CardShimmer from 'components/loading/CardShimmer';

const AttendanceAreaChart = () => {
	const [month, setMonth] = useState(() => new Date().getMonth() + 1);
	const [year, setYear] = useState(() => new Date().getFullYear());

	const [queryParams, setQueryParams] = useState({
		month,
		year,
	});

	const {
		data: stats,
		isLoading: statsLoading,
		refetch: refetchStats,
		// isFetching: isFetchingStats,
	} = useFetchItemsQuery(
		{ path: `/deals/monthly_report`, params: queryParams },
		{ refetchOnMountOrArgChange: true }
	);

	const chartData = useMemo(
		() =>
			stats?.data?.map((d) => ({
				date: moment(d.date).format('D MMM'),
				count: d.count,
				percent: d.percent,
			})),
		[stats?.data]
	);

	const CustomTooltip = ({ active, payload, label }) => {
		if (!active || !payload?.length) return null;
		const [entry] = payload;
		return (
			<Box bg='white' p={3} rounded='md' shadow='md' border='1px solid #e2e8f0'>
				<Text fontWeight='bold'>{label}</Text>
				<Text fontSize='sm'>Attendance: {entry.payload.count}</Text>
				<Text fontSize='sm'>Percent: {entry.payload.percent}%</Text>
			</Box>
		);
	};

	const { minY, maxY } = useMemo(() => {
		const counts = chartData?.map((d) => d.count) || [];
		const min = Math.max(0, Math.min(...counts) - 5);
		const max = Math.max(...counts) + 5;
		return { minY: min, maxY: max };
	}, [chartData]);

	const onFilterChange = (value) => {
		const newMonth = Number(value.month);
		const newYear = Number(value.year);

		setMonth(newMonth);
		setYear(newYear);

		// refetch stats with new month and year
		setQueryParams({ month: newMonth, year: newYear });
		refetchStats();
	};

	return (
		<Box w='100%' py='2'>
			<Stack
				justifyContent='space-between'
				// flexDir={{ base: 'column', md: 'row' }}
				flexDir={{ base: 'row' }}
				alignItems='center'
				mb='4'
			>
				<Text
					fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
					color='gray.700'
					fontWeight='bold'
				>
					Attendance Stats
				</Text>

				{/* Attendance date filter */}
				<DateFilter onFilterChange={onFilterChange} />
			</Stack>

			{statsLoading ? (
				<CardShimmer
					count={1}
					height='350px'
					columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
				/>
			) : stats?.data && chartData?.length ? (
				<Box h='350px'>
					<ResponsiveContainer width='100%' height='100%'>
						<AreaChart
							data={chartData}
							margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
							<XAxis
								dataKey='date'
								tick={{ fill: '#4A5568', fontSize: 12 }}
								axisLine={true}
								tickLine={false}
							/>
							<YAxis
								domain={[minY, maxY]}
								allowDecimals={false}
								tick={{ fill: '#4A5568', fontSize: 12 }}
								axisLine={true}
								tickLine={false}
								tickCount={6}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Area
								type='monotone'
								dataKey='count'
								// stroke='#D99A36'
								// fill='#E5B668'
								stroke='#3182ce'
								fill='#90cdf4'
								name='Attendance Count'
								strokeWidth={2}
								dot={{ r: 3 }}
								activeDot={{ r: 5 }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</Box>
			) : (
				<NoData label='attendance stats' />
			)}
		</Box>
	);
};

export default AttendanceAreaChart;
