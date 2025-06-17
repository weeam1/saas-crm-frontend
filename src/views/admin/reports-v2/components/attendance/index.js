import { useEffect, useMemo, useState } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import {
	FaUsers,
	FaClock,
	FaUserSlash,
	FaSearch,
	FaMoon,
	FaFileAlt,
} from 'react-icons/fa';

import { useFetchItemsQuery } from 'api/apiSlice';
import DashboardShimmer from 'views/admin/attendance/components/dashboard/DashboardShimmer';
import AttendanceStats from './AttendanceStats';
import RefButton from '../RefButton';

const AttendanceReport = () => {
	const [selectedView, setSelectedView] = useState('weekly');

	const user = JSON.parse(localStorage.getItem('user'));
	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	const [queryParams, setQueryParams] = useState({
		timeframe: selectedView,
	});

	const { data, isLoading, refetch, isFetching } = useFetchItemsQuery(
		{ path: `/attendance/dashboard`, params: queryParams },
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		refetch();
	}, [queryParams]);

	const stats = [
		{
			label: 'Total Employees',
			value: data?.totalEmployees ?? 0,
			icon: FaUsers,
			changePercentage: data?.newEmployeesToday ?? 0,
			change:
				data?.newEmployeesToday > 0
					? `${data?.newEmployeesToday} new employees added`
					: '',
			changeColor: 'green.500',
			link: '/attendance/employees',
		},
		{
			label: 'On Time',
			value: data?.onTime?.count,
			icon: FaClock,
			changePercentage: data?.onTime?.changePercentage ?? 0,

			change: `${data?.onTime?.changePercentage} ${data?.onTime?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'green.500',
			link: '/attendance/record?status=1',
		},
		{
			label: 'Absent',
			value: data?.absent?.count,
			icon: FaUserSlash,
			changePercentage: data?.absent?.changePercentage ?? 0,

			change: `${data?.absent?.changePercentage} ${data?.absent?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'red.500',
			link: '/attendance/record?status=0',
		},
		{
			label: 'Late Arrival',
			value: data?.lateArrival?.count,
			icon: FaSearch,
			changePercentage: data?.lateArrival?.changePercentage ?? 0,
			change: `${data?.lateArrival?.changePercentage} ${
				data?.lateArrival?.change > 0 ? 'more' : 'less'
			} than yesterday`,
			changeColor: 'red.500',
			link: '/attendance/record?status=2',
		},
		{
			label: 'Early Departures',
			value: data?.earlyDeparture?.count,
			changePercentage: data?.earlyDeparture?.changePercentage ?? 0,
			icon: FaMoon,
			change: `${data?.earlyDeparture?.changePercentage} ${data?.earlyDeparture?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'green.500',
			link: '/attendance/record?status=1',
		},
		{
			label: 'Time-off',
			value: data?.timeOff?.count,
			changePercentage: data?.timeOff?.changePercentage ?? 0,
			icon: FaFileAlt,
			change: `${data?.timeOff?.changePercentage} ${data?.timeOff?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'blue.500',
			link: '/attendance/record', // time off skip direct link
		},
	];

	const lineChartOptions = useMemo(
		() => ({
			chart: {
				type: 'line',
				toolbar: { show: false },
				zoom: { enabled: false },
			},
			stroke: {
				curve: 'smooth',
				width: 4,
				colors: ['#D99A36'],
			},
			markers: {
				size: 6,
				colors: ['#fff'],
				strokeColors: '#D99A36',
				strokeWidth: 3,
				hover: { size: 8 },
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'light',
					shadeIntensity: 0.2,
					opacityFrom: 0.6,
					opacityTo: 0,
					stops: [0, 100],
					colorStops: [
						{ offset: 0, color: '#D99A36', opacity: 0.3 },
						{ offset: 100, color: 'rgba(255, 255, 255, 0)', opacity: 0 },
					],
				},
			},
			xaxis: {
				categories: data?.labels ?? [],
				labels: {
					style: {
						colors: '#555',
						fontSize: '14px',
						fontWeight: 500,
					},
				},
				axisBorder: { color: '#ccc' },
				axisTicks: { color: '#ccc' },
			},
			yaxis: {
				min: 0,
				max: 100,
				tickAmount: 5,
				labels: {
					formatter: (val) => `${Math.round(val)}%`,
					style: {
						colors: '#555',
						fontSize: '14px',
						fontWeight: 500,
					},
				},
			},

			tooltip: {
				enabled: true,
				theme: 'dark',
				y: { formatter: (val) => `${val}%` },
				style: { fontSize: '14px' },
			},
			grid: {
				borderColor: '#EAEAEA',
				strokeDashArray: 4,
			},
			legend: { show: false },
		}),
		[data?.labels]
	);

	const lineChartData = useMemo(
		() => [{ name: 'Attendance', data: data?.attendancePercentages ?? [] }],
		[data?.attendancePercentages]
	);

	const barChartOptions = {
		chart: { type: 'bar' },
		plotOptions: {
			bar: {
				columnWidth: '50%',
				distributed: false,
			},
		},
		colors: ['#D99A36'],
		xaxis: { categories: data?.roleNames ?? [] },
		yaxis: {
			labels: { formatter: (val) => `${Math.round(val)}%` },
		},
		tooltip: { enabled: true, theme: 'light' },
	};

	const barChartData = [
		{
			name: 'Attendance',
			data: data?.roleCounts ?? [],
		},
	];

	return isLoading ? (
		<Box h='100vh'>
			<DashboardShimmer />
		</Box>
	) : (
		<>
			<Box bg='white' rounded='md' shadow='sm' p='8' mb='4' mx='2'>
				<HStack>
					<Text
						fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
						fontWeight='bold'
					>
						Attendance Report
					</Text>

					<RefButton to='/attendance' label='Attendance Module' />
				</HStack>

				<AttendanceStats
					data={data}
					stats={stats}
					lineChartData={lineChartData}
					lineChartOptions={lineChartOptions}
					barChartData={barChartData}
					barChartOptions={barChartOptions}
					selectedView={selectedView}
					setSelectedView={setSelectedView}
					setQueryParams={setQueryParams}
				/>
			</Box>
		</>
	);
};

export default AttendanceReport;
