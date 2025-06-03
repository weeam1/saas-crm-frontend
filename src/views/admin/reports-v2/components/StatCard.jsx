import {
	Box,
	Flex,
	Text,
	Icon,
	useColorModeValue,
	Badge,
	Tooltip,
	Skeleton,
} from '@chakra-ui/react';

import { FiArrowUp, FiArrowDown, FiHelpCircle, FiMinus } from 'react-icons/fi';

export const StatCard = ({
	title,
	value,
	icon: IconComponent,
	colorScheme = 'blue',
	trend,
	isLoading = false,
	tooltip,
	precision = 0,
	prefix = '',
	suffix = '',
}) => {
	const bgColor = useColorModeValue(`${colorScheme}.50`, 'gray.700');
	const borderColor = useColorModeValue(`${colorScheme}.100`, 'gray.600');
	const textColor = useColorModeValue('gray.700', 'whiteAlpha.900');
	const mutedColor = useColorModeValue('gray.500', 'gray.400');

	const trendColor =
		trend > 0 ? 'green.500' : trend < 0 ? 'red.500' : 'gray.500';
	const trendIcon = trend > 0 ? FiArrowUp : trend < 0 ? FiArrowDown : FiMinus;

	const formattedValue = Number(value).toLocaleString(undefined, {
		minimumFractionDigits: precision,
		maximumFractionDigits: precision,
	});

	return (
		<Box
			bg={bgColor}
			p={5}
			// boxShadow='base'
			// border='1px solid'
			// borderColor={borderColor}
			rounded='lg'
			whileHover={{ y: -2 }}
			transition='all 0.2s ease'
		>
			<Flex justify='space-between' align='center' mb={3}>
				<Flex align='center'>
					<Text fontSize='sm' fontWeight='medium' color={mutedColor} mr={1}>
						{title}
					</Text>
					{tooltip && (
						<Tooltip label={tooltip}>
							<Icon as={FiHelpCircle} boxSize={4} color={mutedColor} />
						</Tooltip>
					)}
				</Flex>
				{IconComponent && (
					<Box
						bg={`${colorScheme}.100`}
						rounded='full'
						p='3'
						display='flex'
						alignItems='center'
						justifyContent='center'
						cursor='pointer'
						color={`${colorScheme}.600`}
					>
						<Icon as={IconComponent} boxSize={5} />
					</Box>
				)}
			</Flex>

			<Skeleton
				isLoaded={!isLoading}
				minH='36px'
				display='flex'
				alignItems='center'
			>
				<Text
					fontSize='2xl'
					fontWeight='semibold'
					color={textColor}
					lineHeight='1.2'
				>
					{prefix}
					{formattedValue}
					{suffix}
				</Text>
			</Skeleton>

			{trend !== undefined && (
				<Flex align='center' mt={3}>
					<Badge
						colorScheme={trend > 0 ? 'green' : trend < 0 ? 'red' : 'gray'}
						display='flex'
						alignItems='center'
						px={2}
						py={0.5}
						borderRadius='full'
						fontSize='xs'
					>
						<Icon as={trendIcon} boxSize={3} mr={1} />
						{Math.abs(trend)}%
					</Badge>
					<Text ml={2} fontSize='xs' color={mutedColor}>
						vs last period
					</Text>
				</Flex>
			)}
		</Box>
	);
};

// // Variant with Chart Sparkline
// export const StatCardWithChart = ({ sparklineData, ...props }) => (
// 	<StatCard {...props}>
// 		<Box mt={3} h='40px'>
// 			<ResponsiveContainer width='100%' height='100%'>
// 				<AreaChart data={sparklineData}>
// 					<Area
// 						type='monotone'
// 						dataKey='value'
// 						stroke={`var(--chakra-colors-${props.colorScheme}-400)`}
// 						fill={`var(--chakra-colors-${props.colorScheme}-100)`}
// 						strokeWidth={2}
// 					/>
// 				</AreaChart>
// 			</ResponsiveContainer>
// 		</Box>
// 	</StatCard>
// );
