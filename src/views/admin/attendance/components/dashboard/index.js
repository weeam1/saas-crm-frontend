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
	IconButton,
	useDisclosure,
	Heading,
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
import { FiFilter } from 'react-icons/fi';
import AgencyFilter from './AgencyFilter';
import AppButton from 'components/shared/AppButton';

const Dashboard = () => {
	const [selectedView, setSelectedView] = useState('weekly');
	const [selectedAgency, setSelectedAgency] = useState({});
	const [agency, setAgency] = useState(null);

	const { isOpen, onOpen, onClose } = useDisclosure();

	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem('user'));
	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	const [queryParams, setQueryParams] = useState({
		timeframe: selectedView,
		agency: '',
	});

	const { data, isLoading, refetch } = useFetchItemsQuery(
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

	// const lineChartOptions = useMemo(
	// 	() => ({
	// 		chart: { type: 'line', toolbar: { show: false } },
	// 		stroke: {
	// 			curve: 'smooth',
	// 			width: 4,
	// 			colors: ['#D99A36'],
	// 		}, // Thicker line
	// 		markers: {
	// 			size: 8, // Larger markers
	// 			colors: ['#fff'],
	// 			strokeColors: '#D99A36', // Brand-colored marker outline
	// 			strokeWidth: 4,
	// 			hover: { size: 10 }, // Enlarge on hover
	// 		},
	// 		fill: {
	// 			type: 'gradient',
	// 			gradient: {
	// 				shade: 'light',
	// 				shadeIntensity: 0.5,
	// 				opacityFrom: 0.5, // Stronger gradient at the top
	// 				opacityTo: 0,
	// 				stops: [0, 90, 100],
	// 				colorStops: [
	// 					{ offset: 0, color: '#F5ECCB', opacity: 1 },
	// 					{ offset: 100, color: 'rgba(72, 187, 120, 0)', opacity: 0 },
	// 				],
	// 			},
	// 		},
	// 		xaxis: {
	// 			categories: data?.labels ?? [],
	// 			labels: { style: { colors: '#555', fontSize: '14px' } }, // Improved readability
	// 		},
	// 		yaxis: {
	// 			min: 0,
	// 			max: 100,
	// 			labels: { formatter: (val) => `${Math.round(val)}%` },
	// 		},
	// 		tooltip: {
	// 			enabled: true,
	// 			theme: 'light',
	// 			y: { formatter: (val) => `${val}%` },
	// 		},
	// 		grid: {
	// 			borderColor: '#C4C4C4',
	// 			strokeDashArray: 4,
	// 		},
	// 	}),
	// 	[data?.labels]
	// );

	// const lineChartData = useMemo(
	// 	() => [{ name: 'Attendance', data: data?.attendancePercentages ?? [] }],
	// 	[data?.attendancePercentages]
	// );

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
				colors: ['#D99A36'], // Brand color for the line
			},
			markers: {
				size: 6,
				colors: ['#fff'],
				strokeColors: '#D99A36', // Border color matches the line
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
				strokeDashArray: 4, // Soft dashed grid for aesthetics
			},
			legend: { show: false }, // Removes unnecessary legend
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

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 3000);
		return () => clearTimeout(timer);
	}, []);

	const handleApplyFilter = (newAgency) => {
		setQueryParams((prev) => ({ ...prev, agency: newAgency }));
		onClose();
		setLoading(true);
		setAgency(selectedAgency?.name ?? null);
	};

	return loading ? (
		<Box h='100vh'>
			<Loader />
		</Box>
	) : (
		<>
			<Flex
				fontFamily="'DM Sans', sans-serif"
				px='10'
				justifyContent='space-between'
				alignItems='center'
			>
				<AppButton
					leftIcon={<IoArrowBack />}
					onClick={() => navigate('/attendance')}
				>
					Back
				</AppButton>
				{role === 'superAdmin' && (
					<IconButton
						icon={<FiFilter />}
						onClick={onOpen}
						aria-label='Filter Date'
						colorScheme='brand'
						variant='solid'
						size='sm'
						borderRadius='full'
						boxShadow='md'
					/>
				)}
			</Flex>

			{loading ? (
				<Box h='100vh'>
					<Loader />
				</Box>
			) : (
				<Box p='2' fontFamily="'DM Sans', sans-serif">
					<Heading
						px='10'
						fontSize={{ base: 'md', md: 'lg' }}
						fontWeight='bold'
					>
						{agency ? `${agency} Agency` : 'All Agencies'}
					</Heading>
					<RealTimeData
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
			)}

			{isOpen && (
				<AgencyFilter
					handleApplyFilter={handleApplyFilter}
					isOpen={isOpen}
					onClose={onClose}
					selectedAgency={selectedAgency}
					setSelectedAgency={setSelectedAgency}
				/>
			)}
		</>
	);
};

export default Dashboard;
