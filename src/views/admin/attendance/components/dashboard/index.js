import { useEffect, useMemo, useState } from 'react';
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
		{ path: `/attendance/dashboard`, params: { timeframe: selectedView } },
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

	const lineChartOptions = useMemo(
		() => ({
			chart: { type: 'line', toolbar: { show: false } },
			stroke: {
				curve: 'smooth',
				width: 4,
				colors: ['#D99A36'],
			}, // Thicker line
			markers: {
				size: 8, // Larger markers
				colors: ['#fff'],
				strokeColors: '#D99A36', // Brand-colored marker outline
				strokeWidth: 4,
				hover: { size: 10 }, // Enlarge on hover
			},
			fill: {
				type: 'gradient',
				gradient: {
					shade: 'light',
					shadeIntensity: 0.5,
					opacityFrom: 0.5, // Stronger gradient at the top
					opacityTo: 0,
					stops: [0, 90, 100],
					colorStops: [
						{ offset: 0, color: '#F5ECCB', opacity: 1 },
						{ offset: 100, color: 'rgba(72, 187, 120, 0)', opacity: 0 },
					],
				},
			},
			xaxis: {
				categories: data?.labels ?? [],
				labels: { style: { colors: '#555', fontSize: '14px' } }, // Improved readability
			},
			yaxis: {
				min: 0,
				max: 100,
				labels: { formatter: (val) => `${Math.round(val)}%` },
			},
			tooltip: {
				enabled: true,
				theme: 'light',
				y: { formatter: (val) => `${val}%` },
			},
			grid: {
				borderColor: '#C4C4C4',
				strokeDashArray: 4,
			},
		}),
		[data?.labels]
	);

	const lineChartData = useMemo(
		() => [{ name: 'Attendance', data: data?.attendancePercentages ?? [] }],
		[data?.attendancePercentages]
	);

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

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 3000);
		return () => clearTimeout(timer);
	}, []);

	console.log({ loading });

	return loading ? (
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
