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
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { IoMdTrendingDown } from 'react-icons/io';
import Chart from 'react-apexcharts';
import { Link as RouterLink } from 'react-router-dom';

const AttendanceStats = ({
	stats,
	barChartOptions,
	barChartData,
	lineChartData,
	lineChartOptions,
	selectedView,
	setSelectedView,
	setQueryParams,
}) => {
	const handleCharView = (view) => {
		const timeframe = view.toLowerCase();
		setSelectedView(timeframe);
		setQueryParams({ timeframe });
	};

	const adjustedLineChartOptions = {
		...lineChartOptions,
		colors: ['#B68F46'],
		stroke: {
			...lineChartOptions.stroke,
			width: 2,
			curve: 'smooth',
			lineCap: 'butt',
		},
		fill: {
			...lineChartOptions.fill,
			type: 'solid',
			opacity: 1,
		},
		markers: {
			size: 5,
			shape: 'circle',
			strokeWidth: 2,
			strokeColor: '#B68F46',
			hover: {
				size: 7,
			},
		},
		chart: {
			...lineChartOptions.chart,
			connectNullData: true, // Ensure null values don't break the line
		},
		yaxis: {
			...lineChartOptions.yaxis,
			max: 100, // Static max value set to 100
			min: 0,
			tickAmount: 5,
			labels: {
				formatter: (val) => val.toFixed(1),
			},
		},
	};

	return (
		<>
			<Box bg='white' p='6' rounded='md'>
				<SimpleGrid columns={{ base: '1fr', md: 2, lg: 3 }} spacing={5}>
					{stats.map((stat, index) => (
						<Box
							key={index}
							as={RouterLink}
							to={stat.link}
							cursor='pointer'
							p={6}
							borderRadius='lg'
							bg='white'
							shadow='md'
							minH='150px'
							transition='all 0.3s ease-in-out'
							_hover={{
								transform: 'scale(1.02)',
							}}
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
									bg='rgba(218, 165, 32, 0.1)'
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
										transition='all 0.2s ease-in-out'
										_hover={{ bg: '#97CE71', color: 'white' }}
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
										transition='all 0.2s ease-in-out'
										_hover={{ bg: 'green.500', color: 'white' }}
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
										transition='all 0.2s ease-in-out'
										_hover={{ bg: 'red.500', color: 'white' }}
									>
										<Icon as={IoMdTrendingDown} boxSize={4} color='red.500' />
									</Box>
								)}
								{stat?.changePercentage !== 0 && stat.change}
							</Text>
						</Box>
					))}
				</SimpleGrid>
				<Box py={6}>
					<Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
						<Box bg='white' p={6} borderRadius='lg' shadow='md'>
							<Flex justify='space-between' align='center' mb={4}>
								<Text fontSize='lg' fontWeight='bold'>
									Attendance Comparison Chart
								</Text>
								<ButtonGroup size='sm' isAttached>
									{['Weekly', 'Monthly', 'Yearly'].map((view) => (
										<Button
											key={view}
											bg={
												selectedView === view.toLowerCase()
													? '#DAA520'
													: '#FDD68F'
											}
											color={
												selectedView === view.toLowerCase()
													? 'white'
													: 'gray.800'
											}
											_hover={{
												bg:
													selectedView === view.toLowerCase()
														? '#C6951B'
														: '#EEC577',
											}}
											onClick={() => handleCharView(view)}
										>
											{view}
										</Button>
									))}
								</ButtonGroup>
							</Flex>
							<Chart
								options={adjustedLineChartOptions}
								series={lineChartData}
								type='line'
								height={300}
							/>
						</Box>
						<Box bg='white' p={6} borderRadius='lg' shadow='md'>
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

export default AttendanceStats;
