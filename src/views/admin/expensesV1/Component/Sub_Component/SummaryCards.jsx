import {
	Box,
	Text,
	Progress,
	Flex,
	SimpleGrid,
	Skeleton,
	Badge,
	Icon,
} from '@chakra-ui/react';
import { FaFileInvoiceDollar, FaReceipt } from 'react-icons/fa';
import {
	FiTrendingUp,
	FiTrendingDown,
	FiDollarSign,
	FiPercent,
} from 'react-icons/fi';
import { MdAttachMoney } from 'react-icons/md';
import { formatCurrency } from 'utils/helpers';

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const SummaryCards = ({ data, isLoading = false }) => {
	const cardData = [
		{
			title: 'Total Income',
			value: data?.totalIncome,
			color: 'green',
			icon: FiTrendingUp,
			trend: 'positive',
			description: 'Gross revenue this month',
		},
		{
			title: 'Total Expense',
			value: data?.totalExpense,
			color: 'red',
			icon: FiTrendingDown,
			trend: 'negative',
			showProgress: true,
			progressValue: data?.totalIncome
				? (data.totalExpense / data.totalIncome) * 100
				: 0,
			description: 'Total expenditures',
		},
		{
			title: `VAT Amount`,
			value: data?.totalVatAmount,
			color: 'purple',
			icon: FaFileInvoiceDollar,
			// FiPercent,
			subtitle: `${data?.totalVatPercent || 0}% rate`,
			description: 'Tax obligations',
		},
		{
			title: 'Net Amount',
			value: data?.remainingAmount,
			color: data?.remainingAmount >= 0 ? 'blue' : 'orange',
			icon: FiDollarSign,
			trend: data?.remainingAmount >= 0 ? 'positive' : 'negative',
			description: 'After tax & expenses',
		},
	];

	return (
		<Box
			bg='white'
			p={6}
			shadow='sm'
			borderRadius='xl'
			mb={4}
			border='1px solid'
			borderColor='gray.100'
		>
			{/* Header */}
			<Skeleton isLoaded={!isLoading} borderRadius='lg'>
				<Flex justify='space-between' align='center' mb={6}>
					<Box>
						<Text fontSize='xl' fontWeight='bold' color='gray.800'>
							{monthNames[parseInt(data?.month || 1) - 1]} {data?.year}
						</Text>
						<Text fontSize='sm' color='gray.500' mt={1}>
							Financial Summary
						</Text>
					</Box>
					<Badge
						colorScheme={data?.remainingAmount >= 0 ? 'green' : 'red'}
						fontSize='sm'
						px={3}
						py={1}
						borderRadius='full'
					>
						{data?.remainingAmount >= 0 ? 'Profitable' : 'Deficit'}
					</Badge>
				</Flex>
			</Skeleton>

			<SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 4 }} gap={5}>
				{cardData.map((card, index) => (
					<SummaryCard key={index} {...card} isLoading={isLoading} />
				))}
			</SimpleGrid>
		</Box>
	);
};

const SummaryCard = ({
	title,
	value,
	subtitle,
	color = 'blue',
	icon,
	trend,
	description,
	showProgress = false,
	progressValue = 0,
	isLoading = false,
}) => {
	const getTrendColor = (trend) => {
		return trend === 'positive' ? 'green.500' : 'red.500';
	};

	return (
		<Box
			position='relative'
			bg='white'
			borderRadius='2xl'
			shadow='md'
			border='1px solid'
			borderColor='gray.100'
			p={4}
			transition='all 0.3s ease'
			_hover={{
				shadow: 'xl',
				transform: 'translateY(-2px)',
				borderColor: `${color}.100`,
			}}
			overflow='hidden'
		>
			{/* Gradient accent bar */}
			<Box
				position='absolute'
				top='0'
				left='0'
				w='100%'
				h='4px'
				bgGradient={`linear(to-r, ${color}.400, ${color}.600)`}
			/>

			<Skeleton isLoaded={!isLoading} borderRadius='md'>
				{/* Header */}
				<Flex justify='space-between' align='start' mb={4}>
					<Box flex='1'>
						<Text fontSize='sm' fontWeight='semibold' color='gray.600' mb={1}>
							{title}
						</Text>
						{subtitle && (
							<Text fontSize='xs' color='gray.500'>
								{subtitle}
							</Text>
						)}
					</Box>
					<Icon as={icon} color={`${color}.500`} boxSize={5} mt={1} />
				</Flex>

				{/* Value */}
				<Text
					fontSize={{ base: 'sm', md: 'lg' }}
					fontWeight='bold'
					color={value >= 0 ? 'gray.800' : 'red.600'}
					mb={2}
				>
					{formatCurrency(value)}
				</Text>

				{/* Description */}
				{description && (
					<Text fontSize='xs' color='gray.500' mb={3}>
						{description}
					</Text>
				)}

				{/* Progress Bar */}
				{/* {showProgress && (
					<Box mt={3}>
						<Flex justify='space-between' mb={1}>
							<Text fontSize='xs' color='gray.600'>
								Utilization
							</Text>
							<Text fontSize='xs' fontWeight='semibold' color={`${color}.600`}>
								{progressValue.toFixed(1)}%
							</Text>
						</Flex>
						<Progress
							value={progressValue}
							size='sm'
							width='100%'
							colorScheme={color}
							borderRadius='full'
							bg='gray.100'
						/>
					</Box>
				)} */}

				{/* Trend Indicator */}
				{/* {trend && (
					<Flex align='center' mt={3}>
						<Box
							w='2'
							h='2'
							borderRadius='full'
							bg={getTrendColor(trend)}
							mr={2}
						/>
						<Text fontSize='xs' color='gray.600' fontWeight='medium'>
							{trend === 'positive' ? 'On target' : 'Needs attention'}
						</Text>
					</Flex>
				)} */}
			</Skeleton>
		</Box>
	);
};

// Skeleton loader component for initial loading
export const SummaryCardsSkeleton = () => {
	return (
		<Box
			bg='white'
			p={6}
			shadow='sm'
			borderRadius='xl'
			mb={4}
			border='1px solid'
			borderColor='gray.100'
		>
			<Skeleton height='30px' width='200px' mb={6} borderRadius='lg' />
			<SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 4 }} gap={5}>
				{[...Array(4)].map((_, index) => (
					<Box
						key={index}
						bg='white'
						borderRadius='2xl'
						shadow='md'
						border='1px solid'
						borderColor='gray.100'
						p={6}
					>
						<Skeleton height='16px' width='120px' mb={4} borderRadius='md' />
						<Skeleton height='28px' width='140px' mb={3} borderRadius='md' />
						<Skeleton height='12px' width='100px' mb={4} borderRadius='md' />
						<Skeleton height='8px' width='100%' borderRadius='full' />
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default SummaryCards;
