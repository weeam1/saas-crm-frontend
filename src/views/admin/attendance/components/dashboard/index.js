import { useState } from 'react';
import {
	Box,
	SimpleGrid,
	Text,
	Icon,
	Flex,
	Grid,
	Button,
	ButtonGroup,
} from '@chakra-ui/react';
import {
	FaUsers,
	FaClock,
	FaUserSlash,
	FaSearch,
	FaMoon,
	FaFileAlt,
} from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { PiSunLight } from 'react-icons/pi';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { IoMdTrendingDown } from 'react-icons/io';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import RealTimeData from './RealTimeData';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';

const Dashboard = () => {
	const [selectedView, setSelectedView] = useState('weekly');

	const { data, isLoading, isFetching } = useFetchItemsQuery(
		{ path: '/attendance/dashboard', params: { selectedView } },
		{ refetchOnMountOrArgChange: true }
	);

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
		},
		{
			label: 'On Time',
			value: data?.onTime?.count,
			icon: FaClock,
			changePercentage: data?.onTime?.changePercentage ?? 0,

			change: `${data?.onTime?.changePercentage} ${data?.onTime?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'green.500',
		},
		{
			label: 'Absent',
			value: data?.absent?.count,
			icon: FaUserSlash,
			changePercentage: data?.absent?.changePercentage ?? 0,

			change: `${data?.absent?.changePercentage} ${data?.absent?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'red.500',
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
		},
		{
			label: 'Early Departures',
			value: data?.earlyDeparture?.count,
			changePercentage: data?.earlyDeparture?.changePercentage ?? 0,
			icon: FaMoon,
			change: `${data?.earlyDeparture?.changePercentage} ${data?.earlyDeparture?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'green.500',
		},
		{
			label: 'Time-off',
			value: data?.timeOff?.count,
			changePercentage: data?.timeOff?.changePercentage ?? 0,
			icon: FaFileAlt,
			change: `${data?.timeOff?.changePercentage} ${data?.timeOff?.change > 0 ? 'more' : 'less'} than yesterday`,
			changeColor: 'blue.500',
		},
	];

	const lineChartOptions = {
		chart: { type: 'line', toolbar: { show: false } },
		stroke: { curve: 'smooth', width: 3, colors: ['#28A745'] }, // Green line
		markers: {
			size: 6,
			colors: ['#fff'],
			strokeColors: '#28A745', // Green marker outline
			strokeWidth: 3,
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 0.4,
				opacityFrom: 0.3,
				opacityTo: 0,
				stops: [0, 90, 100],
				colorStops: [
					{ offset: 0, color: 'rgba(40, 167, 69, 0.4)', opacity: 1 },
					{ offset: 100, color: 'rgba(40, 167, 69, 0)', opacity: 0 },
				],
			},
		},
		xaxis: {
			categories: [
				'01 Aug',
				'02 Aug',
				'03 Aug',
				'04 Aug',
				'07 Aug',
				'08 Aug',
				'10 Aug',
				'11 Aug',
				'14 Aug',
				'15 Aug',
				'16 Aug',
			],
		},
		yaxis: { labels: { formatter: (val) => `${val}%` } },
		tooltip: { enabled: true, theme: 'light' },
	};

	const lineChartData = [
		{ name: 'Attendance', data: [65, 55, 70, 80, 91, 60, 50, 72, 85, 60, 75] },
	];

	const barChartOptions = {
		chart: { type: 'bar' },
		plotOptions: { bar: { columnWidth: '50%', distributed: true } },
		xaxis: { categories: data?.roleNames ?? [] },
		yaxis: { labels: { formatter: (val) => `${val}%` } },
		tooltip: { enabled: true, theme: 'light' },
		colors: ['#CBD5E0', '#CBD5E0', '#28A745', '#CBD5E0', '#CBD5E0'],
	};

	const barChartData = [
		{
			name: 'Attendance %',
			data: data?.roleCounts ?? [],
			colors: ['#CBD5E0', '#CBD5E0', '#8D6729', '#CBD5E0', '#CBD5E0'],
		},
	];

	console.log({ data });

	return isLoading ? (
		<Box h='100vh'>
			<Loader />
		</Box>
	) : (
		<RealTimeData
			stats={stats}
			lineChartData={lineChartData}
			lineChartOptions={lineChartOptions}
			barChartData={barChartData}
			barChartOptions={barChartOptions}
			selectedView={selectedView}
			setSelectedView={setSelectedView}
		/>
	);
};

export default Dashboard;
