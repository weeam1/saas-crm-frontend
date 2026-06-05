// import {
// 	Box,
// 	Text,
// 	Progress,
// 	Flex,
// 	SimpleGrid,
// 	Skeleton,
// 	Badge,
// 	Icon,
// 	HStack,
// } from '@chakra-ui/react';
// import { FaFileInvoiceDollar, FaReceipt } from 'react-icons/fa';
// import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
// import { formatAmount, formatCurrency } from 'utils/helpers';

// const SummaryCards = ({ data, isLoading }) => {
// 	const cardData = [
// 		{
// 			title: 'Total Income',
// 			value: data?.totalIncome,
// 			color: 'green',
// 			icon: FiTrendingUp,
// 			trend: 'positive',
// 			description: 'Gross revenue this month',
// 		},
// 		{
// 			title: 'Total Expense',
// 			value: data?.totalExpense,
// 			color: 'red',
// 			icon: FiTrendingDown,
// 			trend: 'negative',
// 			showProgress: true,
// 			progressValue: data?.totalIncome
// 				? (data.totalExpense / data.totalIncome) * 100
// 				: 0,
// 			description: 'Total expenditures',
// 		},
// 		{
// 			title: `VAT Amount`,
// 			value: data?.totalVatAmount,
// 			color: 'purple',
// 			icon: FaFileInvoiceDollar,
// 			// FiPercent,
// 			percent: `${data?.totalVatPercent || 0}% rate`,
// 			description: 'Tax obligations',
// 		},
// 		{
// 			title: 'Net Amount',
// 			value: data?.remainingAmount,
// 			color: data?.remainingAmount >= 0 ? 'blue' : 'orange',
// 			icon: FiDollarSign,
// 			trend: data?.remainingAmount >= 0 ? 'positive' : 'negative',
// 			description: 'After tax & expenses',
// 		},
// 	];

// 	return (
// 		<Box
// 			// bg='white'
// 			p={2}
// 			// shadow='sm'
// 			// borderRadius='xl'
// 			mb={1}
// 			// border='1px solid'
// 			// borderColor='gray.100'
// 		>
// 			{isLoading ? (
// 				<SummaryCardsSkeleton />
// 			) : (
// 				<SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 4 }} gap={5}>
// 					{cardData.map((card, index) => (
// 						<SummaryCard key={index} {...card} isLoading={isLoading} />
// 					))}
// 				</SimpleGrid>
// 			)}
// 		</Box>
// 	);
// };

// const SummaryCard = ({
// 	title,
// 	value,
// 	percent,
// 	color = 'blue',
// 	icon,
// 	trend,
// 	description,
// 	showProgress = false,
// 	progressValue = 0,
// 	isLoading = false,
// }) => {
// 	const getTrendColor = (trend) => {
// 		return trend === 'positive' ? 'green.500' : 'red.500';
// 	};

// 	return (
// 		<Box
// 			position='relative'
// 			bg='white'
// 			borderRadius='2xl'
// 			shadow='md'
// 			border='1px solid'
// 			borderColor='gray.100'
// 			p={4}
// 			transition='all 0.3s ease'
// 			_hover={{
// 				shadow: 'xl',
// 				transform: 'translateY(-2px)',
// 				borderColor: `${color}.100`,
// 			}}
// 			overflow='hidden'
// 		>
// 			{/* Gradient accent bar */}
// 			<Box
// 				position='absolute'
// 				top='0'
// 				left='0'
// 				w='100%'
// 				h='4px'
// 				bgGradient={`linear(to-r, ${color}.400, ${color}.600)`}
// 			/>

// 			<Skeleton isLoaded={!isLoading} borderRadius='md'>
// 				{/* Header */}
// 				<Flex justify='space-between' align='start' mb={4}>
// 					<Box flex='1'>
// 						<Text fontSize='sm' fontWeight='semibold' color='gray.600' mb={1}>
// 							{title}
// 						</Text>
// 					</Box>
// 					<Icon as={icon} color={`${color}.500`} boxSize={5} mt={1} />
// 				</Flex>

// 				{/* Value */}
// 				<HStack justify='space-between' align='center'>
// 					<Text
// 						fontSize={{ base: 'sm', md: 'lg' }}
// 						fontWeight='bold'
// 						color={value >= 0 ? 'gray.800' : 'red.600'}
// 					>
// 						{formatAmount(value)}
// 					</Text>
// 					{percent && (
// 						<Text fontSize='xs' color='gray.500'>
// 							{percent}
// 						</Text>
// 					)}
// 				</HStack>

// 				{/* Description */}
// 				{description && (
// 					<Text fontSize='xs' color='gray.500'>
// 						{description}
// 					</Text>
// 				)}
// 			</Skeleton>
// 		</Box>
// 	);
// };

// // Skeleton loader component for initial loading
// const SummaryCardsSkeleton = () => {
// 	return (
// 		<SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 4 }} gap={5}>
// 			{[...Array(4)].map((_, index) => (
// 				<Box
// 					key={index}
// 					bg='white'
// 					borderRadius='2xl'
// 					shadow='md'
// 					border='1px solid'
// 					borderColor='gray.100'
// 					p={2}
// 				>
// 					<Skeleton height='90px' mb={2} borderRadius='md' />
// 				</Box>
// 			))}
// 		</SimpleGrid>
// 	);
// };

// export default SummaryCards;

import {
	Box,
	Text,
	Flex,
	SimpleGrid,
	Skeleton,
	Icon,
	HStack,
} from '@chakra-ui/react';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { formatAmount } from 'utils/helpers';

const SummaryCards = ({ data, isLoading }) => {
	const cardData = [
		{
			title: 'Total Income',
			value: data?.totalIncome,
			icon: FiTrendingUp,
			color: 'green',

			// trend: 'positive',
			description: 'Gross revenue this month',
		},
		{
			title: 'Total Expense',
			value: data?.totalExpense,
			color: 'red',
			icon: FiTrendingDown,
			// trend: 'negative',
			description: 'Total expenditures',
		},
		{
			title: 'VAT Amount',
			value: data?.totalVatAmount,
			color: 'purple',
			icon: FaFileInvoiceDollar,
			description: `${data?.totalVatPercent || 0}% tax rate`,
		},
		{
			title: 'Net Amount',
			value: data?.remainingAmount,
			icon: FiDollarSign,
			color: data?.remainingAmount >= 0 ? 'blue' : 'orange',
			// trend: data?.remainingAmount >= 0 ? 'positive' : 'negative',
			description: 'After tax & expenses',
		},
	];

	return (
		<Box p={2} mb={1}>
			{isLoading ? (
				<SummaryCardsSkeleton />
			) : (
				<SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 4 }} gap={5}>
					{cardData.map((card, index) => (
						<SummaryCard key={index} {...card} isLoading={isLoading} />
					))}
				</SimpleGrid>
			)}
		</Box>
	);
};

const SummaryCard = ({
	title,
	value,
	icon,
	trend,
	color,
	description,
	isLoading = false,
}) => {
	const getValueColor = () => {
		if (value < 0) return 'red.400';
		if (title === 'Total Expense') return 'text.body';
		return 'text.heading';
	};

	const getIconBg = () => {
		if (title === 'Total Income') return 'rgba(72, 187, 120, 0.1)';
		if (title === 'Total Expense') return 'rgba(245, 101, 101, 0.1)';
		if (title === 'VAT Amount') return 'rgba(212, 175, 55, 0.1)';
		if (title === 'Net Amount')
			return value >= 0 ? 'rgba(66, 153, 225, 0.1)' : 'rgba(237, 137, 54, 0.1)';
		return 'rgba(212, 175, 55, 0.1)';
	};

	const getIconColor = () => {
		if (title === 'Total Income') return '#48BB78';
		if (title === 'Total Expense') return '#F56565';
		if (title === 'VAT Amount') return '#D4AF37';
		if (title === 'Net Amount') return value >= 0 ? '#4299E1' : '#ED8936';
		return '#D4AF37';
	};

	const getTrendIcon = () => {
		if (trend === 'positive') return <FiTrendingUp size={14} />;
		if (trend === 'negative') return <FiTrendingDown size={14} />;
		return null;
	};

	const getTrendColor = () => {
		return trend === 'positive' ? '#48BB78' : '#F56565';
	};

	return (
		<Box
			position='relative'
			bg='bg.surface'
			borderRadius='xl'
			boxShadow='card'
			border='1px solid'
			borderColor='border.default'
			p={5}
			transition='all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
			_hover={{
				boxShadow: 'goldGlow',
				transform: 'translateY(-2px)',
				borderColor: 'gold.primary',
			}}
			overflow='hidden'
		>
			{/* Gold gradient accent bar */}
			{/* <Box
				position='absolute'
				top='0'
				left='0'
				w='100%'
				h='3px'
				bgGradient='linear-gradient(90deg, #D4AF37, #F5D67B, #D4AF37)'
			/> */}

			{/* Gradient accent bar */}
			<Box
				position='absolute'
				top='0'
				left='0'
				w='100%'
				h='4px'
				bgGradient={`linear(to-r, ${color}.400, ${color}.600)`}
			/>

			<Skeleton
				isLoaded={!isLoading}
				startColor='rgba(212, 175, 55, 0.1)'
				endColor='rgba(26, 53, 80, 0.2)'
				borderRadius='lg'
			>
				{/* Header */}
				<Flex justify='space-between' align='flex-start' mb={4}>
					<Text
						fontSize='11px'
						fontWeight='700'
						letterSpacing='0.08em'
						textTransform='uppercase'
						color='text.muted'
					>
						{title}
					</Text>
					<Box
						p={2}
						bg={getIconBg()}
						borderRadius='lg'
						display='flex'
						alignItems='center'
						justifyContent='center'
					>
						<Icon as={icon} color={getIconColor()} boxSize={4} />
					</Box>
				</Flex>

				{/* Value */}
				<HStack justify='space-between' align='center' mb={2}>
					<Text
						fontSize={{ base: 'xl', md: '2xl' }}
						fontWeight='bold'
						color={getValueColor()}
						fontFamily={title === 'VAT Amount' ? 'mono' : 'inherit'}
					>
						{formatAmount(value)}
					</Text>
					{getTrendIcon() && (
						<Flex align='center' gap={1}>
							{getTrendIcon()}
							{/* <Text fontSize='xs' color={getTrendColor()} fontWeight='500'>
								{trend === 'positive' ? '+0%' : '-0%'}
							</Text> */}
						</Flex>
					)}
				</HStack>

				{/* Description */}
				{description && (
					<Text fontSize='xs' color='text.muted' mt={1}>
						{description}
					</Text>
				)}
			</Skeleton>
		</Box>
	);
};

// Skeleton loader component for initial loading
const SummaryCardsSkeleton = () => {
	return (
		<SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 4 }} gap={5}>
			{[...Array(4)].map((_, index) => (
				<Box
					key={index}
					bg='bg.surface'
					borderRadius='xl'
					boxShadow='card'
					border='1px solid'
					borderColor='border.default'
					p={5}
				>
					<Skeleton
						height='100px'
						borderRadius='lg'
						startColor='rgba(212, 175, 55, 0.08)'
						endColor='rgba(26, 53, 80, 0.15)'
					/>
				</Box>
			))}
		</SimpleGrid>
	);
};

export default SummaryCards;
