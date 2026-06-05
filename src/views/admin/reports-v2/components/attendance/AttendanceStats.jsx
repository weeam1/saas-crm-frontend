import {
	Box,
	SimpleGrid,
	Text,
	Icon,
	Flex,
	Divider,
} from '@chakra-ui/react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { IoMdTrendingDown } from 'react-icons/io';
import { Link as RouterLink } from 'react-router-dom';
import AttendanceRoleChart from './AttendanceRoleChart';
import AttendanceAreaChart from './AttendanceAreaChart';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceStats = ({
	data,
	stats,
	lineChartOptions,
	setSelectedView,
	setQueryParams,
}) => {
	const colors = useModalColors();

	const handleCharView = (view) => {
		const timeframe = view.toLowerCase();
		setSelectedView(timeframe);
		setQueryParams({ timeframe });
	};

	const adjustedLineChartOptions = {
		...lineChartOptions,
		colors: [colors.accentGold],
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
			strokeColor: colors.accentGold,
			hover: {
				size: 7,
			},
		},
		chart: {
			...lineChartOptions.chart,
			connectNullData: true,
			background: 'transparent',
		},
		yaxis: {
			...lineChartOptions.yaxis,
			max: 100,
			min: 0,
			tickAmount: 5,
			labels: {
				formatter: (val) => val.toFixed(1),
				style: {
					colors: colors.bodyText,
				},
			},
		},
		xaxis: {
			...lineChartOptions.xaxis,
			labels: {
				style: {
					colors: colors.bodyText,
				},
			},
			axisBorder: { color: colors.borderColor },
			axisTicks: { color: colors.borderColor },
		},
		grid: {
			borderColor: colors.borderColor,
			strokeDashArray: 4,
		},
		tooltip: {
			theme: 'dark',
		},
	};

	return (
		<Box bg={colors.bg} p='6' rounded='md' border="1px solid" borderColor={colors.borderColor}>
			<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
				{stats.map((stat, index) => (
					<Box
						key={index}
						as={RouterLink}
						to={stat.link}
						cursor='pointer'
						p={5}
						borderRadius='lg'
						bg={colors.bgInput}
						transition='all 0.3s ease-in-out'
						border="1px solid"
						borderColor={colors.borderColor}
						_hover={{
							transform: 'translateY(-4px)',
							borderColor: colors.accentGold,
							boxShadow: colors.cardShadow,
						}}
					>
						<Flex justify='space-between' align='center'>
							<Text fontSize='2xl' fontWeight='bold' color={colors.headingText}>
								{stat.value}
							</Text>
							<Box
								p={2}
								borderWidth={2}
								borderRadius='full'
								borderColor={colors.accentGold}
								display='flex'
								alignItems='center'
								justifyContent='center'
								bg={`rgba(212, 175, 55, 0.1)`}
							>
								<Icon as={stat.icon} boxSize={6} color={colors.accentGold} />
							</Box>
						</Flex>
						<Text fontSize='md' color={colors.bodyText} mt={2}>
							{stat.label}
						</Text>
						<Text
							fontSize='sm'
							color={stat.changeColor}
							mt={1}
							display='flex'
							alignItems='center'
						>
							{stat.label === 'Total Employees' && stat.changePercentage > 0 && (
								<Box
									p={1}
									borderWidth={2}
									borderRadius='full'
									borderColor={colors.accentGold}
									display='flex'
									alignItems='center'
									justifyContent='center'
									mr={1}
									transition='all 0.2s ease-in-out'
									_hover={{ bg: colors.accentGold, color: colors.headerText }}
								>
									<Icon
										as={IoIosAddCircleOutline}
										boxSize={4}
										color={colors.accentGold}
									/>
								</Box>
							)}
							{stat.change?.includes('more') && (
								<Box
									p={1}
									borderWidth={2}
									borderRadius='full'
									borderColor={colors.accentGold}
									display='flex'
									alignItems='center'
									justifyContent='center'
									mr={1}
									transition='all 0.2s ease-in-out'
									_hover={{ bg: colors.accentGold, color: colors.headerText }}
								>
									<Icon as={FaArrowTrendUp} boxSize={4} color={colors.accentGold} />
								</Box>
							)}
							{stat.change?.includes('less') && (
								<Box
									p={1}
									borderWidth={2}
									borderRadius='full'
									borderColor={colors.badgeErrorText}
									display='flex'
									alignItems='center'
									justifyContent='center'
									mr={1}
									transition='all 0.2s ease-in-out'
									_hover={{ bg: colors.badgeErrorText, color: colors.headerText }}
								>
									<Icon as={IoMdTrendingDown} boxSize={4} color={colors.badgeErrorText} />
								</Box>
							)}
							{stat?.changePercentage !== 0 && stat.change}
						</Text>
					</Box>
				))}
			</SimpleGrid>
			<Box py={6}>
				<AttendanceRoleChart data={data} />
				<Divider borderColor={colors.borderColor} my='6' />
				<AttendanceAreaChart />
			</Box>
		</Box>
	);
};

export default AttendanceStats;