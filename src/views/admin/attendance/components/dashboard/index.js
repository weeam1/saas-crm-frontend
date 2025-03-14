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
	xaxis: { categories: ['Sales', 'IT', 'Marketing', 'Legal', 'HR'] },
	yaxis: { labels: { formatter: (val) => `${val}%` } },
	tooltip: { enabled: true, theme: 'light' },
	colors: ['#CBD5E0', '#CBD5E0', '#28A745', '#CBD5E0', '#CBD5E0'],
};

const barChartData = [
	{
		name: 'Attendance %',
		data: [40, 60, 86, 65, 35],
		colors: ['#CBD5E0', '#CBD5E0', '#8D6729', '#CBD5E0', '#CBD5E0'],
	},
];
const Dashboard = () => {
	const [selectedView, setSelectedView] = useState('weekly');
	const stats = [
		{
			label: 'Total Employees',
			value: 452,
			icon: FaUsers,
			change: '2 new employees added',
			changeColor: 'green.500',
		},
		{
			label: 'On Time',
			value: 360,
			icon: FaClock,
			change: '-100 Less than yesterday',
			changeColor: 'green.500',
		},
		{
			label: 'Absent',
			value: 30,
			icon: FaUserSlash,
			change: '+5% increase than yesterday',
			changeColor: 'red.500',
		},
		{
			label: 'Late Arrival',
			value: 62,
			icon: FaSearch,
			change: '+3% increase than yesterday',
			changeColor: 'red.500',
		},
		{
			label: 'Early Departures',
			value: 6,
			icon: FaMoon,
			change: '-10% Less than yesterday',
			changeColor: 'green.500',
		},
		{
			label: 'Time-off',
			value: 42,
			icon: FaFileAlt,
			change: '2% increase than yesterday',
			changeColor: 'blue.500',
		},
	];

	const navigate = useNavigate();

	return (
		<Box p={6} minH='100vh'>
			<Button
				colorScheme='gray'
				borderRadius='5px'
				size={{ base: 'sm', md: 'md' }}
				px={{ base: 4, md: 6 }}
				py={{ base: 2, md: 3 }}
				fontSize={{ base: 'sm', md: 'md' }}
				leftIcon={<Icon as={IoArrowBack} boxSize={4} />}
				onClick={() => navigate('/attendance')}
				mb={4}
			>
				Back
			</Button>
			<Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6}>
				<Box
					p={6}
					borderWidth={1}
					borderRadius='lg'
					bg='white'
					boxShadow='sm'
					minH='150px'
				>
					<Flex align='center'>
						<Icon as={PiSunLight} boxSize={12} color='#9295ab' mr={3} />

						<Text fontSize='2xl' fontWeight='bold' color='#9295ab'>
							8:02:09 AM
						</Text>
					</Flex>
					<Text fontSize='sm' color='#9295ab' mt={2}>
						Realtime insight
					</Text>
					<Box
						display='flex'
						flexDirection='column'
						justifyContent='center'
						mt={{ base: 4, lg: 8 }}
					>
						<Text fontSize='sm' fontWeight='bold' mt={4}>
							Today:
						</Text>
						<Text fontSize='18px' fontWeight='bold'>
							2nd August 2023
						</Text>
					</Box>
				</Box>
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
					{stats.map((stat, index) => (
						<Box
							key={index}
							p={6}
							borderWidth={1}
							borderRadius='lg'
							bg='white'
							boxShadow='sm'
							minH='150px'
						>
							<Flex justify='space-between' align='center'>
								<Text fontSize='2xl' fontWeight='bold'>
									{stat.value}
								</Text>
								<Box
									p={2}
									borderWidth={2}
									borderRadius='full'
									borderColor='goldenrod'
									display='flex'
									alignItems='center'
									justifyContent='center'
								>
									<Icon as={stat.icon} boxSize={6} color='goldenrod' />
								</Box>
							</Flex>
							<Text fontSize='md' color='gray.600' mt={2}>
								{stat.label}
							</Text>
							<Text
								fontSize='sm'
								color={stat.changeColor}
								mt={1}
								display='flex'
								alignItems='center'
							>
								{stat.label === 'Total Employees' && (
									<Box
										p={1}
										borderWidth={2}
										borderRadius='full'
										borderColor='#97CE71'
										display='flex'
										alignItems='center'
										justifyContent='center'
										mr={1}
									>
										<Icon
											as={IoIosAddCircleOutline}
											boxSize={4}
											color='#97CE71'
										/>
									</Box>
								)}
								{stat.change.includes('increase') && (
									<Box
										p={1}
										borderWidth={2}
										borderRadius='full'
										borderColor='green.500'
										display='flex'
										alignItems='center'
										justifyContent='center'
										mr={1}
									>
										<Icon as={FaArrowTrendUp} boxSize={4} color='green.500' />
									</Box>
								)}
								{stat.change.includes('Less') && (
									<Box
										p={1}
										borderWidth={2}
										borderRadius='full'
										borderColor='red.500'
										display='flex'
										alignItems='center'
										justifyContent='center'
										mr={1}
									>
										<Icon as={IoMdTrendingDown} boxSize={4} color='red.500' />
									</Box>
								)}
								{stat.change}
							</Text>
						</Box>
					))}
				</SimpleGrid>
			</Grid>
			<Box py={6}>
				<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
					<Box bg='white' p={6} borderRadius='lg' boxShadow='sm'>
						<Flex justify='space-between' align='center' mb={4}>
							<Text fontSize='lg' fontWeight='bold'>
								Attendance Comparison Chart
							</Text>
							<ButtonGroup size='sm' isAttached>
								{['Daily', 'Weekly', 'Monthly'].map((view) => (
									<Button
										key={view}
										colorScheme={
											selectedView === view.toLowerCase() ? 'blue' : 'gray'
										}
										onClick={() => setSelectedView(view.toLowerCase())}
									>
										{view}
									</Button>
								))}
							</ButtonGroup>
						</Flex>
						<Chart
							options={lineChartOptions}
							series={lineChartData}
							type='line'
							height={300}
						/>
					</Box>
					<Box bg='white' p={6} borderRadius='lg' boxShadow='sm'>
						<Text fontSize='lg' fontWeight='bold' mb={4}>
							Weekly Attendance
						</Text>
						<Chart
							options={barChartOptions}
							series={barChartData}
							type='bar'
							height={300}
						/>
					</Box>
				</Grid>
			</Box>
		</Box>
	);
};

export default Dashboard;
