import { useCallback, useEffect, useMemo, useState } from 'react';
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
import moment from 'moment-timezone';
import DateFilter from '../DateFilter';
import { FiFilter } from 'react-icons/fi';
import FilterModal from '../employees/FilterModal';

const timezone = 'Asia/Karachi';

const RealTimeData = ({
	stats,
	barChartOptions,
	barChartData,
	lineChartData,
	lineChartOptions,
	selectedView,
	setSelectedView,
	setQueryParams,
}) => {
	const currentDate = moment().tz(timezone).format('dddd, DD MMMM YYYY');

	const [time, setTime] = useState(moment().tz(timezone));

	const tick = useCallback(() => {
		setTime(moment().tz(timezone));
	}, [timezone]);

	useEffect(() => {
		const timerID = setInterval(tick, 1000);
		return () => clearInterval(timerID);
	}, [tick]);

	const timeString = useMemo(() => time.format('hh:mm:ss  A'), [time]);

	const handleCharView = (view) => {
		const timeframe = view.toLowerCase();
		setSelectedView(timeframe);
		setQueryParams((prev) => ({ ...prev, timeframe }));
	};
	const navigate = useNavigate();
	return (
		<>
			<Box p={6} minH='100vh'>
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
								{timeString}
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
								{currentDate}
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
									{stat?.changePercentage !== 0 && stat.change}
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
								<ButtonGroup colorScheme='brand' size='sm' isAttached>
									{['Weekly', 'Monthly', 'Yearly'].map((view) => (
										<Button
											key={view}
											colorScheme={
												selectedView === view.toLowerCase() ? 'blue' : 'gray'
											}
											onClick={() => handleCharView(view)}
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
		</>
	);
};

export default RealTimeData;
