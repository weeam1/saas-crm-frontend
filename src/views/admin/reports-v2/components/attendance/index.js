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
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceReport = () => {
	const colors = useModalColors();
	const [selectedView, setSelectedView] = useState('weekly');
	const { hasPermission } = usePermissions();

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
			changeColor: colors.accentGold,
			link: '/attendance/employees',
		},
		{
			label: 'On Time',
			value: data?.onTime?.count,
			icon: FaClock,
			changePercentage: data?.onTime?.changePercentage ?? 0,
			change: `${data?.onTime?.changePercentage} ${data?.onTime?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: colors.accentGold,
			link: '/attendance/record?status=1',
		},
		{
			label: 'Absent',
			value: data?.absent?.count,
			icon: FaUserSlash,
			changePercentage: data?.absent?.changePercentage ?? 0,
			change: `${data?.absent?.changePercentage} ${data?.absent?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: colors.badgeErrorText,
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
			changeColor: colors.badgeErrorText,
			link: '/attendance/record?status=2',
		},
		{
			label: 'Early Departures',
			value: data?.earlyDeparture?.count,
			changePercentage: data?.earlyDeparture?.changePercentage ?? 0,
			icon: FaMoon,
			change: `${data?.earlyDeparture?.changePercentage} ${data?.earlyDeparture?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: colors.accentGold,
			link: '/attendance/record?status=1',
		},
		{
			label: 'Time-off',
			value: data?.timeOff?.count,
			changePercentage: data?.timeOff?.changePercentage ?? 0,
			icon: FaFileAlt,
			change: `${data?.timeOff?.changePercentage} ${data?.timeOff?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: colors.accentGold,
			link: '/attendance/record',
		},
	];

	const lineChartOptions = useMemo(
		() => ({
			chart: {
				type: 'line',
				toolbar: { show: false },
				zoom: { enabled: false },
				background: 'transparent',
			},
			stroke: {
				curve: 'smooth',
				width: 4,
				colors: [colors.accentGold],
			},
			markers: {
				size: 6,
				colors: [colors.bg],
				strokeColors: colors.accentGold,
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
						{ offset: 0, color: colors.accentGold, opacity: 0.3 },
						{ offset: 100, color: 'rgba(255, 255, 255, 0)', opacity: 0 },
					],
				},
			},
			xaxis: {
				categories: data?.labels ?? [],
				labels: {
					style: {
						colors: colors.bodyText,
						fontSize: '14px',
						fontWeight: 500,
					},
				},
				axisBorder: { color: colors.borderColor },
				axisTicks: { color: colors.borderColor },
			},
			yaxis: {
				min: 0,
				max: 100,
				tickAmount: 5,
				labels: {
					formatter: (val) => `${Math.round(val)}%`,
					style: {
						colors: colors.bodyText,
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
				borderColor: colors.borderColor,
				strokeDashArray: 4,
			},
			legend: { show: false },
		}),
		[data?.labels, colors]
	);

	const lineChartData = useMemo(
		() => [{ name: 'Attendance', data: data?.attendancePercentages ?? [] }],
		[data?.attendancePercentages]
	);

	const barChartOptions = useMemo(
		() => ({
			chart: { type: 'bar', background: 'transparent' },
			plotOptions: {
				bar: {
					columnWidth: '50%',
					distributed: false,
				},
			},
			colors: [colors.accentGold],
			xaxis: {
				categories: data?.roleNames ?? [],
				labels: {
					style: {
						colors: colors.bodyText,
					},
				},
				axisBorder: { color: colors.borderColor },
			},
			yaxis: {
				labels: {
					formatter: (val) => `${Math.round(val)}%`,
					style: {
						colors: colors.bodyText,
					},
				},
			},
			tooltip: { enabled: true, theme: 'dark' },
			grid: {
				borderColor: colors.borderColor,
			},
		}),
		[data?.roleNames, colors]
	);

	const barChartData = useMemo(
		() => [
			{
				name: 'Attendance',
				data: data?.roleCounts ?? [],
			},
		],
		[data?.roleCounts]
	);

	return isLoading ? (
		<Box h='100vh' bg={colors.bgDeep}>
			<DashboardShimmer />
		</Box>
	) : (
		<Box bg={colors.bgDeep} minH='100vh' p={4}>
			<Box bg={colors.bg} rounded='md' shadow={colors.cardShadow} p='6' mb='4' mx='2' border="1px solid" borderColor={colors.borderColor}>
				<HStack>
					<Text
						fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
						fontWeight='bold'
						color={colors.headingText}
					>
						Attendance Report
					</Text>

					{hasPermission('reports', 'link') && hasPermission('attendance') && (
						<RefButton to='/attendance' label='Attendance Module' />
					)}
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
		</Box>
	);
};

export default AttendanceReport;