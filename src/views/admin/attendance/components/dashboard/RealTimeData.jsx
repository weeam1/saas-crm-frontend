
// import { useCallback, useEffect, useMemo, useState } from 'react';
// import {
// 	Box,
// 	SimpleGrid,
// 	Text,
// 	Icon,
// 	Flex,
// 	Grid,
// 	Button,
// 	ButtonGroup,
// 	HStack,
// 	Heading,
// 	Badge,
// 	Divider
// } from '@chakra-ui/react';
// import { IoIosAddCircleOutline } from 'react-icons/io';
// import { PiSunLight } from 'react-icons/pi';
// import { FaArrowTrendUp } from 'react-icons/fa6';
// import { IoMdTrendingDown } from 'react-icons/io';
// import Chart from 'react-apexcharts';
// import { Link as RouterLink } from 'react-router-dom';
// import moment from 'moment-timezone';
// import AttendanceQRCode from './AttendanceQRCode';
// import { currentTZ } from 'utils/helpers';
// import AttendanceRoleChart from 'views/admin/reports-v2/components/attendance/AttendanceRoleChart';
// import AttendanceAreaChart from 'views/admin/reports-v2/components/attendance/AttendanceAreaChart';
// import { usePermissions } from 'hooks/usePermissions';
// import { BsBuildingCheck } from 'react-icons/bs';

// const RealTimeData = ({
// 	agency,
// 	data,
// 	stats,
// 	barChartOptions,
// 	barChartData,
// 	lineChartData,
// 	lineChartOptions,
// 	selectedView,
// 	setSelectedView,
// 	setQueryParams,
// }) => {
// 	const tz = localStorage.getItem('timezone_cache') || currentTZ;
// 	const [time, setTime] = useState(() => moment().tz(tz));

// 	const tick = useCallback(() => {
// 		setTime(moment().tz(tz));
// 	}, [tz]);

// 	const { hasPermission } = usePermissions();

// 	useEffect(() => {
// 		const interval = setInterval(tick, 1000);
// 		return () => clearInterval(interval);
// 	}, [tick]);

// 	const timeString = useMemo(() => time.format('hh:mm:ss A'), [time]);
// 	const currentDate = useMemo(() => time.format('dddd\nDD MMMM YYYY'), [time]);
// 	const day = useMemo(() => time.format('dddd'), [time]);
// const date = useMemo(() => time.format('DD MMMM YYYY'), [time]);
// 	useEffect(() => {
// 		const timerID = setInterval(tick, 1000);
// 		return () => clearInterval(timerID);
// 	}, [tick]);

// 	const handleCharView = (view) => {
// 		const timeframe = view.toLowerCase();
// 		setSelectedView(timeframe);
// 		setQueryParams((prev) => ({ ...prev, timeframe }));
// 	};

// 	const adjustedLineChartOptions = {
// 		...lineChartOptions,
// 		colors: ['#B68F46'],
// 		stroke: {
// 			...lineChartOptions.stroke,
// 			width: 2,
// 			curve: 'smooth',
// 			lineCap: 'butt',
// 		},
// 		fill: {
// 			...lineChartOptions.fill,
// 			type: 'solid',
// 			opacity: 1,
// 		},
// 		markers: {
// 			size: 5,
// 			shape: 'circle',
// 			strokeWidth: 2,
// 			strokeColor: '#B68F46',
// 			hover: {
// 				size: 7,
// 			},
// 		},
// 		chart: {
// 			...lineChartOptions.chart,
// 			connectNullData: true,
// 		},
// 		yaxis: {
// 			...lineChartOptions.yaxis,
// 			max: 100,
// 			min: 0,
// 			tickAmount: 5,
// 			labels: {
// 				formatter: (val) => val.toFixed(1),
// 			},
// 		},
// 	};
// 	const cardThemes = [
//   { bg: 'linear(to-br, #fff8e7, #fff3cc)', border: '#f5c842', iconBg: 'rgba(245,200,66,0.2)', iconColor: '#b45309', valColor: '#b45309', lblColor: '#92400e', barColor: '#f5c842', barBg: 'rgba(245,200,66,0.2)' },
//   { bg: 'linear(to-br, #edfaf3, #d4f5e2)', border: '#4ade80', iconBg: 'rgba(74,222,128,0.2)', iconColor: '#15803d', valColor: '#15803d', lblColor: '#166534', barColor: '#4ade80', barBg: 'rgba(74,222,128,0.2)' },
//   { bg: 'linear(to-br, #fff0f0, #ffdada)', border: '#f87171', iconBg: 'rgba(248,113,113,0.2)', iconColor: '#b91c1c', valColor: '#b91c1c', lblColor: '#991b1b', barColor: '#f87171', barBg: 'rgba(248,113,113,0.2)' },
//   { bg: 'linear(to-br, #f0f4ff, #dce8ff)', border: '#818cf8', iconBg: 'rgba(129,140,248,0.2)', iconColor: '#4338ca', valColor: '#4338ca', lblColor: '#3730a3', barColor: '#818cf8', barBg: 'rgba(129,140,248,0.2)' },
//   { bg: 'linear(to-br, #fff4ed, #ffe0c8)', border: '#fb923c', iconBg: 'rgba(251,146,60,0.2)', iconColor: '#c2410c', valColor: '#c2410c', lblColor: '#9a3412', barColor: '#fb923c', barBg: 'rgba(251,146,60,0.2)' },
//   { bg: 'linear(to-br, #f0faff, #d6f0ff)', border: '#38bdf8', iconBg: 'rgba(56,189,248,0.2)', iconColor: '#0369a1', valColor: '#0369a1', lblColor: '#075985', barColor: '#38bdf8', barBg: 'rgba(56,189,248,0.2)' },
// ];

// console.log(stats,"stats showed")
// 	return (
// 		<>
// 			<Box bg='white' p='4' rounded='md'>
// 				<Grid templateColumns={{ base: '1fr', md: '0.6fr 3fr' }} gap={4}>
// 					{/* <Box p={4} display="flex" border="1px solid #f0ede2" flexDirection="column" gap="2" borderRadius='lg' bg='white' boxShadow='md' minH='120px'>
// 						 <Heading fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
//           {agency ? `${agency} Agency` : "All Agencies"}
//         </Heading>
// 						<Flex
// 							align='center'
// 							justifyContent={{ base: 'center', md: 'start' }}
// 						>

// 							<Icon as={PiSunLight} boxSize={8} color='#DAA520' mr={2} />
// 							<Text fontSize='xl' fontWeight='bold' color='#9295ab'>
// 								{timeString}
// 							</Text>
// 						</Flex>
// 						<Text fontSize='xs' color='#9295ab' mt={1}>
// 							Realtime insight
// 						</Text>
// 						<Box
// 						display="flex"
// 							// alignItems='flex-start'
// 							justifyContent='space-between'
// 							flexDir={{ base: 'column', lg: 'row' }}
// 							// spacing={2}
// 						>
// 			<Box display={"flex"} flexDirection="column" >
// 				<Text fontSize="13px" fontWeight="bold">
//   {day}
// </Text>
// <Text fontSize="13px">
//   {date}
// </Text>
// 			</Box>
// 							{hasPermission('attendance', 'qr') && (
// 								<Box w='fit-content'>
// 									<AttendanceQRCode />
// 								</Box>
// 							)}
// 						</Box>
// 					</Box> */}
// 					<Box
//   p={4}
//   display="flex"
//   flexDirection="column"
//   gap={3}
//   borderRadius="14px"
//   bg="white"
//   border="1.5px solid"
//   borderColor="#fde68a"
//   boxShadow="0 0 0 3px rgba(250,204,21,0.05), 0 4px 16px rgba(250,204,21,0.1)"
//   transition="transform 0.15s, box-shadow 0.07s"
//   _hover={{
//     transform: 'translateY(-2px)',
//     // boxShadow: '0 0 0 4px rgba(250,204,21,0.2), 0 8px 24px rgba(250,204,21,0.18)',
//   }}
// >
//   {/* Agency row */}
//   <Flex align="center" gap={2}>
//     <Box w="28px" h="28px" borderRadius="8px" bg="#fef9c3" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
//       <Icon as={BsBuildingCheck} boxSize={4} color="#b45309" />
//     </Box>
//     <Text fontSize="13px" fontWeight="700" color="gray.800">
//       {agency ? `${agency} Agency` : 'All Agencies'}
//     </Text>
//   </Flex>

//   <Divider borderColor="#f5f0e0" />

//   {/* Clock row */}
//   <Flex align="center" gap={2}>
//     <Box w="32px" h="32px" borderRadius="10px" bg="#fef9c3" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
//       <Icon as={PiSunLight} boxSize={5} color="#DAA520" />
//     </Box>
//     <Text fontSize="xl" fontWeight="700" color="gray.800" fontVariantNumeric="tabular-nums" letterSpacing="-0.02em">
//       {timeString}
//     </Text>
//   </Flex>

//   {/* Realtime pulse */}
//   <Flex align="center" gap={1.5}>
//     <Box w="6px" h="6px" borderRadius="full" bg="green.400" />
//     <Text fontSize="10px" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="0.06em">
//       Realtime insight
//     </Text>
//   </Flex>

//   <Divider borderColor="#f5f0e0" />

//   {/* Date + QR */}
//   <Flex justify="space-between"  align="center">
//     <Box marginTop={6}>
//       <Text fontSize="13px" fontWeight="700" color="gray.800">{day}</Text>
//       <Text fontSize="12px" color="gray.400">{date}</Text>
//     </Box>
//     {hasPermission('attendance', 'qr') && (
//       <Box w="fit-content">
//         <AttendanceQRCode />
//       </Box>
//     )}
//   </Flex>
// </Box>
// 					<SimpleGrid columns={{ base: '1fr', md: 2, lg: 3 }} spacing={3}>

// {stats.map((stat, index) => {
//   const t = cardThemes[index % cardThemes.length];
//   const total = stats.find(s => s.label === 'Total Employees')?.value || 1;
//   const barW = stat.label === 'Total Employees' ? 100 : Math.min(100, Math.round((stat.value / total) * 100));
//   const isUp = stat.change.includes('more');
//   const isDown = stat.change.includes('less') && !stat.change.startsWith('+0%');

//   return (
//     <Box
//       key={index}
//       as={hasPermission('attendance', 'record') ? RouterLink : 'div'}
//       to={hasPermission('attendance', 'record') ? stat.link : undefined}
//       p={4}
//       borderRadius="14px"
//       bg="white"
//       border="1.5px solid"
//       borderColor={t.border}
//       boxShadow={`0 0 0 3px ${t.glow}, 0 4px 16px ${t.glow}`}
//       display="flex"
//       flexDirection="column"
//       gap={2.5}
//       cursor="pointer"
//       transition="transform 0.15s, box-shadow 0.15s"
//       _hover={{
//         transform: 'translateY(-2px)',
//         boxShadow: `0 0 0 4px ${t.glowHover}, 0 8px 24px ${t.glowHover}`,
//       }}
//     >
//       <Flex justify="space-between" align="flex-start">
//         <Text fontSize="3xl" fontWeight="700" color="gray.800" lineHeight="1" letterSpacing="-0.03em">
//           {stat.value}
//         </Text>
//         <Box p={1.5} borderRadius="10px" bg={t.iconBg} display="flex" alignItems="center" justifyContent="center">
//           <Icon as={stat.icon} boxSize={4} color={t.iconColor} />
//         </Box>
//       </Flex>

//       <Text fontSize="12px" fontWeight="500" color="gray.500">{stat.label}</Text>

//       <Flex align="center" gap={1.5} minH="20px">
//         {stat.change ? (
//           <>
//             <Badge colorScheme={isUp ? 'green' : isDown ? 'red' : 'gray'} fontSize="10px" px={2} py={0.5} borderRadius="full">
//               {isUp && <Icon as={FaArrowTrendUp} boxSize={2.5} mr={1} />}
//               {isDown && <Icon as={IoMdTrendingDown} boxSize={2.5} mr={1} />}
//               {stat.changePercentage}
//             </Badge>
//             <Text fontSize="11px" color="gray.400">
//               {isUp ? 'more than yesterday' : 'less than yesterday'}
//             </Text>
//           </>
//         ) : null}
//       </Flex>

//       <Box h="4px" bg="gray.100" borderRadius="full">
//         <Box h="100%" w={`${barW}%`} bg={t.barColor} borderRadius="full" transition="width 0.4s ease" />
//       </Box>
//     </Box>
//   );
// })}
// 					</SimpleGrid>
// 				</Grid>
// 				<Box py={6} my="2" gap="2" display="grid"     gridTemplateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}>
// 					<AttendanceRoleChart data={data} />
// 					<AttendanceAreaChart />
// 				</Box>
// 			</Box>
// 		</>
// 	);
// };

// export default RealTimeData;
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
	HStack,
	Heading,
	Badge,
	Divider
} from '@chakra-ui/react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { PiSunLight } from 'react-icons/pi';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { IoMdTrendingDown } from 'react-icons/io';
import Chart from 'react-apexcharts';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment-timezone';
import AttendanceQRCode from './AttendanceQRCode';
import { currentTZ } from 'utils/helpers';
import AttendanceRoleChart from 'views/admin/reports-v2/components/attendance/AttendanceRoleChart';
import AttendanceAreaChart from 'views/admin/reports-v2/components/attendance/AttendanceAreaChart';
import { usePermissions } from 'hooks/usePermissions';
import { BsBuildingCheck } from 'react-icons/bs';
import { useModalColors } from 'hooks/useModalColors';

const RealTimeData = ({
	agency,
	data,
	stats,
	barChartOptions,
	barChartData,
	lineChartData,
	lineChartOptions,
	selectedView,
	setSelectedView,
	setQueryParams,
}) => {
	const colors = useModalColors();
	const tz = localStorage.getItem('timezone_cache') || currentTZ;
	const [time, setTime] = useState(() => moment().tz(tz));

	const tick = useCallback(() => {
		setTime(moment().tz(tz));
	}, [tz]);

	const { hasPermission } = usePermissions();

	useEffect(() => {
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [tick]);

	const timeString = useMemo(() => time.format('hh:mm:ss A'), [time]);
	const currentDate = useMemo(() => time.format('dddd\nDD MMMM YYYY'), [time]);
	const day = useMemo(() => time.format('dddd'), [time]);
	const date = useMemo(() => time.format('DD MMMM YYYY'), [time]);

	useEffect(() => {
		const timerID = setInterval(tick, 1000);
		return () => clearInterval(timerID);
	}, [tick]);

	const handleCharView = (view) => {
		const timeframe = view.toLowerCase();
		setSelectedView(timeframe);
		setQueryParams((prev) => ({ ...prev, timeframe }));
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

	const cardThemes = [
		{ bg: colors.bg, border: colors.accentGold, iconBg: `rgba(212, 175, 55, 0.15)`, iconColor: colors.accentGold, valColor: colors.headingText, lblColor: colors.bodyText, barColor: colors.accentGold, barBg: `rgba(212, 175, 55, 0.1)` },
		{ bg: colors.bg, border: colors.accentGold, iconBg: `rgba(212, 175, 55, 0.15)`, iconColor: colors.accentGold, valColor: colors.headingText, lblColor: colors.bodyText, barColor: colors.accentGold, barBg: `rgba(212, 175, 55, 0.1)` },
		{ bg: colors.bg, border: colors.badgeErrorText, iconBg: colors.badgeErrorBg, iconColor: colors.badgeErrorText, valColor: colors.headingText, lblColor: colors.bodyText, barColor: colors.badgeErrorText, barBg: colors.badgeErrorBg },
		{ bg: colors.bg, border: colors.accentGold, iconBg: `rgba(212, 175, 55, 0.15)`, iconColor: colors.accentGold, valColor: colors.headingText, lblColor: colors.bodyText, barColor: colors.accentGold, barBg: `rgba(212, 175, 55, 0.1)` },
		{ bg: colors.bg, border: colors.accentGold, iconBg: `rgba(212, 175, 55, 0.15)`, iconColor: colors.accentGold, valColor: colors.headingText, lblColor: colors.bodyText, barColor: colors.accentGold, barBg: `rgba(212, 175, 55, 0.1)` },
		{ bg: colors.bg, border: colors.accentGold, iconBg: `rgba(212, 175, 55, 0.15)`, iconColor: colors.accentGold, valColor: colors.headingText, lblColor: colors.bodyText, barColor: colors.accentGold, barBg: `rgba(212, 175, 55, 0.1)` },
	];

	return (
		<>
			<Box bg={colors.bg} p='4' rounded='md' border="1px solid" borderColor={colors.borderColor}>
				<Grid templateColumns={{ base: '1fr', md: '0.6fr 3fr' }} gap={4}>
					<Box
						p={4}
						display="flex"
						flexDirection="column"
						gap={3}
						borderRadius="14px"
						bg={colors.bg}
						border="1.5px solid"
						borderColor={colors.accentGold}
						boxShadow={colors.cardShadow}
						transition="transform 0.15s, box-shadow 0.07s"
						_hover={{
							transform: 'translateY(-2px)',
						}}
					>
						<Flex align="center" gap={2}>
							<Box w="28px" h="28px" borderRadius="8px" bg={`rgba(212, 175, 55, 0.15)`} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
								<Icon as={BsBuildingCheck} boxSize={4} color={colors.accentGold} />
							</Box>
							<Text fontSize="13px" fontWeight="700" color={colors.headingText}>
								{agency ? `${agency} Agency` : 'All Agencies'}
							</Text>
						</Flex>

						<Divider borderColor={colors.borderColor} />

						<Flex align="center" gap={2}>
							<Box w="32px" h="32px" borderRadius="10px" bg={`rgba(212, 175, 55, 0.15)`} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
								<Icon as={PiSunLight} boxSize={5} color={colors.accentGold} />
							</Box>
							<Text fontSize="xl" fontWeight="700" color={colors.headingText} fontVariantNumeric="tabular-nums" letterSpacing="-0.02em">
								{timeString}
							</Text>
						</Flex>

						<Flex align="center" gap={1.5}>
							<Box w="6px" h="6px" borderRadius="full" bg={colors.accentGold} />
							<Text fontSize="10px" fontWeight="600" color={colors.mutedText} textTransform="uppercase" letterSpacing="0.06em">
								Realtime insight
							</Text>
						</Flex>

						<Divider borderColor={colors.borderColor} />

						<Flex justify="space-between" align="center">
							<Box marginTop={6}>
								<Text fontSize="13px" fontWeight="700" color={colors.headingText}>{day}</Text>
								<Text fontSize="12px" color={colors.mutedText}>{date}</Text>
							</Box>
							{hasPermission('attendance', 'qr') && (
								<Box w="fit-content">
									<AttendanceQRCode />
								</Box>
							)}
						</Flex>
					</Box>

					<SimpleGrid columns={{ base: '1fr', md: 2, lg: 3 }} spacing={3}>
						{stats.map((stat, index) => {
							const t = cardThemes[index % cardThemes.length];
							const total = stats.find(s => s.label === 'Total Employees')?.value || 1;
							const barW = stat.label === 'Total Employees' ? 100 : Math.min(100, Math.round((stat.value / total) * 100));
							const isUp = stat.change?.includes('more');
							const isDown = stat.change?.includes('less') && !stat.change?.startsWith('+0%');

							return (
								<Box
									key={index}
									as={hasPermission('attendance', 'record') ? RouterLink : 'div'}
									to={hasPermission('attendance', 'record') ? stat.link : undefined}
									p={4}
									borderRadius="14px"
									bg={colors.bg}
									border="1.5px solid"
									borderColor={colors.borderColor}
									boxShadow={colors.cardShadow}
									display="flex"
									flexDirection="column"
									gap={2.5}
									cursor="pointer"
									transition="transform 0.15s, box-shadow 0.15s"
									_hover={{
										transform: 'translateY(-2px)',
										borderColor: colors.accentGold,
										boxShadow: colors.modalShadow,
									}}
								>
									<Flex justify="space-between" align="flex-start">
										<Text fontSize="3xl" fontWeight="700" color={colors.headingText} lineHeight="1" letterSpacing="-0.03em">
											{stat.value}
										</Text>
										<Box p={1.5} borderRadius="10px" bg={t.iconBg} display="flex" alignItems="center" justifyContent="center">
											<Icon as={stat.icon} boxSize={4} color={t.iconColor} />
										</Box>
									</Flex>

									<Text fontSize="12px" fontWeight="500" color={colors.bodyText}>{stat.label}</Text>

									<Flex align="center" gap={1.5} minH="20px">
										{stat.change ? (
											<>
												<Badge
													bg={isUp ? `rgba(212, 175, 55, 0.15)` : isDown ? colors.badgeErrorBg : colors.bgInput}
													color={isUp ? colors.accentGold : isDown ? colors.badgeErrorText : colors.mutedText}
													fontSize="10px"
													px={2}
													py={0.5}
													borderRadius="full"
												>
													{isUp && <Icon as={FaArrowTrendUp} boxSize={2.5} mr={1} />}
													{isDown && <Icon as={IoMdTrendingDown} boxSize={2.5} mr={1} />}
													{stat.changePercentage}
												</Badge>
												<Text fontSize="11px" color={colors.mutedText}>
													{isUp ? 'more than yesterday' : 'less than yesterday'}
												</Text>
											</>
										) : null}
									</Flex>

									<Box h="4px" bg={t.barBg || colors.bgInput} borderRadius="full">
										<Box h="100%" w={`${barW}%`} bg={t.barColor} borderRadius="full" transition="width 0.4s ease" />
									</Box>
								</Box>
							);
						})}
					</SimpleGrid>
				</Grid>

				<Box py={6} my="2" gap="2" display="grid" gridTemplateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}>
					<AttendanceRoleChart data={data} />
					<AttendanceAreaChart />
				</Box>
			</Box>
		</>
	);
};

export default RealTimeData;