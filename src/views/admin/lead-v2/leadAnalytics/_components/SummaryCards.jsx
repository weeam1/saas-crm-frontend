import React from 'react';
import {
	Box,
	Flex,
	Text,
	useColorModeValue,
	Tooltip,
	Badge,
	HStack,
	SimpleGrid,
	Icon,
	keyframes,
} from '@chakra-ui/react';
import {
	FiTrendingUp,
	FiTrendingDown,
	FiUsers,
	FiDollarSign,
	FiTarget,
	FiHeart,
	FiXCircle,
	FiRefreshCw,
	FiBarChart2,
	FiActivity,
} from 'react-icons/fi';
import {
	BsGraphUpArrow,
	BsGraphDownArrow,
	BsLightningFill,
} from 'react-icons/bs';
import { MdOutlineAnalytics } from 'react-icons/md';

// Define keyframes for animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Icon mapping for different metrics
const iconConfig = {
	'Total Leads': { icon: FiUsers, color: 'blue' },
	'Deals Closed': { icon: FiDollarSign, color: 'green' },
	'Conversion Rate': { icon: FiTarget, color: 'brand' },
	'Interested Leads': { icon: FiHeart, color: 'pink' },
	'Not Interested': { icon: FiXCircle, color: 'red' },
	'Released Leads': { icon: FiRefreshCw, color: 'gray' },
	'New Leads Today': { icon: BsLightningFill, color: 'orange' },
	'Avg Response Time': { icon: FiActivity, color: 'purple' },
	default: { icon: MdOutlineAnalytics, color: 'brand' },
};

const TrendIndicator = ({ trend, isPositive }) => (
	<HStack spacing={1}>
		<Icon
			as={isPositive ? BsGraphUpArrow : BsGraphDownArrow}
			color={isPositive ? 'green.500' : 'red.500'}
			boxSize={3}
		/>
		<Text
			fontSize='xs'
			fontWeight='bold'
			color={isPositive ? 'green.500' : 'red.500'}
		>
			{trend}
		</Text>
	</HStack>
);

const PerformanceBadge = ({ value, threshold = 0 }) => {
	const numericValue =
		typeof value === 'string' ? parseFloat(value.replace('%', '')) : value;

	if (numericValue > threshold * 1.2) {
		return (
			<Badge colorScheme='green' variant='solid' fontSize='xs'>
				Excellent
			</Badge>
		);
	} else if (numericValue > threshold) {
		return (
			<Badge colorScheme='blue' variant='solid' fontSize='xs'>
				Good
			</Badge>
		);
	} else {
		return (
			<Badge colorScheme='orange' variant='solid' fontSize='xs'>
				Needs Improvement
			</Badge>
		);
	}
};

export const StatCard = ({
	label,
	value,
	helpText,
	trend,
	isPositive,
	tooltip,
	colorScheme = 'brand',
	isLoading = false,
	format = 'number',
	threshold = 0,
}) => {
	const bgColor = useColorModeValue('white', 'navy.700');
	const borderColor = useColorModeValue('softGray.200', 'navy.600');
	const hoverBorderColor = useColorModeValue(
		`${colorScheme}.300`,
		`${colorScheme}.500`
	);
	const textColor = useColorModeValue('gray.800', 'white');
	const labelColor = useColorModeValue('gray.600', 'gray.400');

	const { icon: IconComponent, color: iconColor } =
		iconConfig[label] || iconConfig.default;

	// Format value based on type
	const formattedValue = React.useMemo(() => {
		if (isLoading) return '--';

		if (format === 'percentage') {
			return `${value}%`;
		} else if (format === 'currency') {
			return `$${value?.toLocaleString()}`;
		} else if (format === 'time') {
			return `${value}s`;
		}
		return value?.toLocaleString() || '0';
	}, [value, format, isLoading]);

	const shimmerAnimation = `${shimmer} 3s infinite linear`;

	return (
		<Box
			bg={bgColor}
			p={6}
			borderRadius='2xl'
			border='1px solid'
			borderColor={borderColor}
			boxShadow='sm'
			position='relative'
			overflow='hidden'
			transition='all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
			_hover={{
				transform: 'translateY(-4px)',
				boxShadow: 'xl',
				borderColor: hoverBorderColor,
			}}
			cursor='pointer'
			role='group'
		>
			{/* Background Gradient Overlay */}
			<Box
				position='absolute'
				top={0}
				right={0}
				width='120px'
				height='120px'
				bgGradient={`linear(45deg, transparent 30%, ${colorScheme}.50 100%)`}
				opacity={0.6}
				borderRadius='0 0 0 100%'
				transition='all 0.3s ease'
				_groupHover={{ opacity: 0.8 }}
			/>

			{/* Main Content */}
			<Flex direction='column' height='full' position='relative' zIndex={1}>
				{/* Header Section */}
				<Flex justify='space-between' align='center' mb={4}>
					<Flex align='center' gap={3}>
						<Box
							p={2}
							display='flex'
							alignItems='center'
							justifyContent='center'
							rounded='full'
							bgGradient={`linear(135deg, ${colorScheme}.100, ${colorScheme}.200)`}
							color={`${colorScheme}.600`}
						>
							<Icon as={IconComponent} boxSize={5} />
						</Box>
						<Text
							fontSize='sm'
							fontWeight='semibold'
							color={labelColor}
							textTransform='uppercase'
							letterSpacing='wider'
						>
							{label}
						</Text>
					</Flex>

					<Flex direction='column' align='flex-end' gap={1}>
						{trend && <TrendIndicator trend={trend} isPositive={isPositive} />}
						{/* <PerformanceBadge value={value} threshold={threshold} /> */}
					</Flex>
				</Flex>

				{/* Value Section */}
				<Box mt={2}>
					<Text
						fontSize='3xl'
						fontWeight='extrabold'
						color={textColor}
						lineHeight='1.1'
						mb={2}
						bgGradient={
							isLoading
								? undefined
								: `linear(45deg, ${textColor}, ${colorScheme}.600)`
						}
						bgClip={isLoading ? undefined : 'text'}
						opacity={isLoading ? 0.6 : 1}
					>
						{formattedValue}
					</Text>
				</Box>

				{/* Help Text Section */}
				{/* {helpText && (
						<StatHelpText
							mt='auto'
							mb={0}
							fontSize='sm'
							color={
								trend ? (isPositive ? 'green.500' : 'red.500') : labelColor
							}
							display='flex'
							alignItems='center'
							gap={2}
							fontWeight='medium'
						>
							<Icon
								as={isPositive ? FiTrendingUp : FiTrendingDown}
								color={
									trend ? (isPositive ? 'green.500' : 'red.500') : labelColor
								}
								boxSize={3}
							/>
							{helpText}
						</StatHelpText>
					)} */}
			</Flex>

			{/* Animated Accent Bar */}
			<Box
				position='absolute'
				top={0}
				left={0}
				width='100%'
				height='4px'
				bgGradient={`linear(to-r, ${colorScheme}.400, ${colorScheme}.600, ${colorScheme}.400)`}
				backgroundSize='200% 100%'
				animation={shimmerAnimation}
				borderTopRadius='2xl'
			/>

			{/* Corner Decoration */}
			<Box
				position='absolute'
				bottom={2}
				right={2}
				width='20px'
				height='20px'
				borderRight='2px solid'
				borderBottom='2px solid'
				borderColor={`${colorScheme}.300`}
				opacity={0.5}
				borderRadius='0 0 8px 0'
			/>
		</Box>
	);
};

// Skeleton Loader Component
export const StatCardSkeleton = () => {
	const bgColor = useColorModeValue('white', 'navy.700');
	const borderColor = useColorModeValue('softGray.200', 'navy.600');
	const pulseAnimation = `${pulse} 1.5s infinite`;

	return (
		<Box
			bg={bgColor}
			p={6}
			borderRadius='2xl'
			border='1px solid'
			borderColor={borderColor}
			boxShadow='sm'
			position='relative'
			overflow='hidden'
			height='140px'
			animation={pulseAnimation}
		>
			<Flex direction='column' height='full' gap={3}>
				<Flex justify='space-between' align='center'>
					<Box width='120px' height='4px' bg='gray.200' borderRadius='full' />
					<Box width='60px' height='4px' bg='gray.200' borderRadius='full' />
				</Flex>
				<Box
					width='80%'
					height='8px'
					bg='gray.200'
					borderRadius='full'
					mt={4}
				/>
				<Box width='60%' height='6px' bg='gray.200' borderRadius='full' />
			</Flex>
		</Box>
	);
};

export const SummaryCards = ({ summary, isLoading }) => {
	const cards = [
		{
			label: 'Total Leads',
			value: summary?.leadCount,
			helpText: 'All time leads',
			tooltip: 'Total number of leads captured across all channels',
			colorScheme: 'blue',
			format: 'number',
			threshold: 1000,
		},
		{
			label: 'Deals Closed',
			value: summary?.deals,
			helpText: 'Successful conversions',
			tooltip: 'Number of leads successfully converted to paying customers',
			colorScheme: 'green',
			format: 'number',
			threshold: 50,
		},
		// {
		// 	label: 'Conversion Rate',
		// 	value: summary?.dealConversionRate,
		// 	helpText: 'Overall success rate',
		// 	tooltip: 'Percentage of leads that convert to deals',
		// 	colorScheme: 'brand',
		// 	format: 'percentage',
		// 	threshold: 2,
		// 	isPositive: parseFloat(summary?.dealConversionRate) > 1,
		// },
		{
			label: 'Interested Leads',
			value: summary?.interestedLeads,
			helpText: 'Hot leads ready to engage',
			tooltip: 'Leads actively interested and qualified for follow-up',
			colorScheme: 'pink',
			format: 'number',
			threshold: 100,
		},
		{
			label: 'Not Interested',
			value: summary?.notInterestedLeads,
			helpText: 'Requires re-engagement',
			tooltip: 'Leads that declined or need different approach',
			colorScheme: 'red',
			format: 'number',
		},
		{
			label: 'Released Leads',
			value: summary?.releasedLeads,
			helpText: 'Returned to pool',
			tooltip: 'Leads released back to the system for reassignment',
			colorScheme: 'gray',
			format: 'number',
		},
	];

	if (isLoading) {
		return (
			<Box mb={8}>
				<SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 5 }} spacing={6}>
					{[...Array(5)].map((_, index) => (
						<StatCardSkeleton key={index} />
					))}
				</SimpleGrid>
			</Box>
		);
	}

	return (
		<Box mb={8}>
			{/* <Flex justify='space-between' align='center' mb={4}>
				<Text fontSize='lg' fontWeight='bold' color='gray.700'>
					Overview
				</Text>
				<Badge colorScheme='brand' variant='subtle' fontSize='sm'>
					Perfomance Overview
				</Badge>
			</Flex> */}

			<SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 5 }} spacing={6}>
				{cards.map((card, index) => (
					<StatCard key={index} isLoading={isLoading} {...card} />
				))}
			</SimpleGrid>
		</Box>
	);
};
