import React, { useMemo } from 'react';
import {
	Box,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	useColorModeValue,
	Icon,
	Flex,
	Text,
} from '@chakra-ui/react';

import {
	FaChartLine, // TrendingUp alternative
	FaBullseye, // Target alternative
	FaMoneyBillWave, // AED-style money icon (no direct AED symbol)
	FaMedal, // Award alternative
	FaCheckCircle, // CheckCircle alternative
} from 'react-icons/fa';
import { formatCurrency } from 'utils/helpers';
import SalesChart from './SalesChart';
import useUserSession from 'hooks/useUserSession';

const SalesDashboard = ({ data }) => {
	const { userRoleName } = useUserSession();

	const isAdmin = ['Admin', 'superAdmin'].includes(userRoleName);

	const statsData = useMemo(
		() => ({
			totalDeals: isAdmin ? data?.totalDeals : data?.dealsCount,
			totalSales: isAdmin ? data?.totalSales : data?.totalAmount,
			totalTargets: isAdmin ? data?.totalTargets : data?.monthlyTarget,
			remainingTargets: isAdmin
				? data?.remainingTargets
				: data?.remainingTarget,
			averageAchievementRate: isAdmin
				? data?.averageAchievementRate
				: data?.targetAchievementRate,
		}),
		[isAdmin, data]
	);

	// const statsCards = [
	// 	{
	// 		title: 'Total Deals',
	// 		value: formatNumber(statsData.totalDeals),
	// 		icon: FaChartLine,
	// 		bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
	// 		iconColor: '#ffffff',
	// 		helpText: 'Active deals in pipeline',
	// 	},
	// 	{
	// 		title: 'Total Sales',
	// 		value: formatCurrency(statsData.totalSales),
	// 		icon: FaMoneyBillWave,
	// 		bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
	// 		iconColor: '#ffffff',
	// 		helpText: 'Revenue generated',
	// 		showArrow: true,
	// 		arrowType: 'increase',
	// 	},
	// 	{
	// 		title: 'Sales Targets',
	// 		value: formatCurrency(statsData.totalTargets),
	// 		icon: FaBullseye,
	// 		bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
	// 		iconColor: '#ffffff',
	// 		helpText: 'Set target amount',
	// 	},
	// 	{
	// 		title: 'Target Achievement',
	// 		value: formatPercentage(statsData.averageAchievementRate),
	// 		icon: FaMedal,
	// 		bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
	// 		iconColor: '#ffffff',
	// 		helpText: 'Above target performance',
	// 		showArrow: true,
	// 		arrowType: 'increase',
	// 	},
	// 	{
	// 		title: 'Targets Completed',
	// 		value: formatCurrency(
	// 			statsData.totalTargets - statsData.remainingTargets
	// 		),
	// 		icon: FaCheckCircle,
	// 		bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
	// 		iconColor: '#ffffff',
	// 		helpText: '100% completion rate',
	// 		showArrow: true,
	// 		arrowType: 'increase',
	// 	},
	// ];

	if (!['superAdmin', 'Manager', 'Agent', 'Admin'].includes(userRoleName))
		return null;

	const statsCards = [
		{
			title: 'Total Deals',
			value: formatNumber(statsData.totalDeals),
			icon: FaChartLine,
			bgColor: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)', // Darker purple/indigo
			iconColor: '#ffffff',
			helpText: 'Active deals',
		},
		{
			title: 'Total Sales',
			value: formatCurrency(statsData.totalSales),
			icon: FaMoneyBillWave,
			bgColor: 'linear-gradient(135deg, #d53f8c 0%, #e53e3e 100%)', // Darker pink/red
			iconColor: '#ffffff',
			helpText: 'Revenue generated',
			showArrow: true,
			arrowType:
				statsData.totalSales > statsData.totalTargets ? 'increase' : 'decrease',
		},
		{
			title: 'Sales Targets',
			value: formatCurrency(statsData.totalTargets),
			icon: FaBullseye,
			bgColor: 'linear-gradient(135deg, #3182ce 0%, #00b5d8 100%)', // Darker blue/cyan
			iconColor: '#ffffff',
			helpText: 'Set target amount',
		},
		{
			title: 'Target Achievement',
			value: formatPercentage(statsData.averageAchievementRate),
			icon: FaMedal,
			bgColor: 'linear-gradient(135deg, #38a169 0%, #319795 100%)', // Darker green/teal
			iconColor: '#ffffff',
			helpText:
				statsData.averageAchievementRate >= 100
					? 'Above target performance'
					: 'Below target performance',
			showArrow: true,
			arrowType:
				statsData.averageAchievementRate >= 100 ? 'increase' : 'decrease',
		},
		// {
		// 	title: 'Targets Completed',
		// 	value: formatCurrency(
		// 		statsData.totalTargets - statsData.remainingTargets
		// 	),
		// 	icon: FaCheckCircle,
		// 	bgColor: 'linear-gradient(135deg, #dd6b20 0%, #d69e2e 100%)', // Darker orange/yellow
		// 	iconColor: '#ffffff',
		// 	helpText: 'Completion amount',
		// 	// showArrow: true,
		// 	// arrowType: 'increase',
		// },
	];
	return (
		<Box bg='white' p={6} borderRadius='2xl' mb='4' rounded='md'>
			<Text fontSize='xl' fontWeight='bold' mb={8} color='gray.800'>
				Overall Sales Performance
			</Text>

			<SimpleGrid
				columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
				spacing={6}
				// maxW='1400px'
				mx='auto'
			>
				{statsCards.map((card, index) => (
					<StatsCard
						key={index}
						title={card.title}
						value={card.value}
						icon={card.icon}
						bgColor={card.bgColor}
						iconColor={card.iconColor}
						textColor={card.textColor}
						helpText={card.helpText}
						showArrow={card.showArrow}
						arrowType={card.arrowType}
					/>
				))}
			</SimpleGrid>

			{/* Sales Chart */}
			{/* <SalesChart data={data} /> */}
		</Box>
	);
};

export default SalesDashboard;

// Reusable StatsCard Component
const StatsCard = ({
	title,
	value,
	icon,
	bgColor,
	iconColor,
	textColor = 'white',
	helpText,
	showArrow = false,
	arrowType = 'increase',
}) => {
	const cardBg = useColorModeValue(bgColor, bgColor);

	return (
		<Box
			bg={cardBg}
			p={6}
			borderRadius='xl'
			shadow='lg'
			position='relative'
			overflow='hidden'
			// _hover={{
			// 	transform: 'translateY(-4px)',
			// 	shadow: 'xl',
			// 	transition: 'all 0.3s ease',
			// }}
			// transition='all 0.3s ease'
		>
			{/* Background Pattern */}
			<Box
				position='absolute'
				top='-50%'
				right='-50%'
				width='200%'
				height='200%'
				bg={`linear-gradient(45deg, ${iconColor}15, transparent)`}
				borderRadius='full'
				opacity={0.1}
			/>

			<Flex justify='space-between' align='flex-start'>
				<Stat>
					<StatLabel
						color={textColor}
						opacity={0.8}
						fontSize='sm'
						fontWeight='medium'
						mb={2}
					>
						{title}
					</StatLabel>
					<StatNumber color={textColor} fontSize='xl' fontWeight='bold' mb={1}>
						{value}
					</StatNumber>
					{helpText && (
						<StatHelpText color={textColor} opacity={0.7} fontSize='xs' mb={0}>
							{showArrow && <StatArrow type={arrowType} />}
							{helpText}
						</StatHelpText>
					)}
				</Stat>

				<Box
					bg={`${iconColor}20`}
					p={3}
					borderRadius='lg'
					position='relative'
					zIndex={1}
				>
					<Icon as={icon} w={6} h={6} color={iconColor} />
				</Box>
			</Flex>
		</Box>
	);
};

// Format number with commas
const formatNumber = (num) => {
	return new Intl.NumberFormat().format(num);
};

// Format percentage
const formatPercentage = (num) => {
	return `${num?.toFixed(1)}%`;
};
