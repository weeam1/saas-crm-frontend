// import React, { useMemo } from 'react';

// import { Icon, SimpleGrid, Spinner, useColorModeValue } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import IconBox from 'components/icons/IconBox';
// import MiniStatistics from 'components/card/MiniStatistics';
// import { MdLeaderboard, MdPeople, MdCheckCircle } from 'react-icons/md';
// import { PiBuildingsBold } from 'react-icons/pi';
// import { FaUsers } from 'react-icons/fa';

// const DashboardStatCards = ({ colorMode, stats }) => {
// 	// const user = JSON.parse(localStorage.getItem('user'));

// 	const navigate = useNavigate();
// 	const boxBg = useColorModeValue(
// 		'linear-gradient(90deg, #D99A36 0%, rgb(221, 184, 92) 100%)', // light mode
// 		'linear-gradient(90deg, #A36B12 0%, rgb(170, 126, 38) 100%)' // dark mode
// 	);
// 	const iconColor = useColorModeValue('white', '#f0e68c');
// 	const brandColor = useColorModeValue('brand.500', 'white');

// 	const cards = useMemo(
// 		() => [
// 			{
// 				label: 'Leads',
// 				value: stats.totalLeads || 0,
// 				icon: MdLeaderboard,
// 				route: '/lead',
// 			},
// 			{
// 				label: 'Users',
// 				value: stats.totalUsers || 0,
// 				icon: MdPeople,
// 				route: '/user',
// 			},
// 			// {
// 			// 	label: 'Interviewed',
// 			// 	value: stats.interviewedCandidates || 0,
// 			// 	icon: MdCheckCircle,
// 			// 	route: '/hiring/candidates',
// 			// },
// 			{
// 				label: 'Candidates',
// 				value: stats.totalCandidates || 0,
// 				icon: FaUsers,
// 				route: '/hiring/candidates',
// 			},
// 			{
// 				label: 'Developers',
// 				value: stats.totalDevelopers || 0,
// 				icon: PiBuildingsBold,
// 				route: '/invoice/developer',
// 			},
// 		],
// 		[stats]
// 	);

// 	return (
// 		<SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap='20px' mb='20px'>
// 			{cards.map(({ label, value, icon: SIcon, route }) => (
// 				<MiniStatistics
// 					key={label}
// 					onClick={() => navigate(route)}
// 					startContent={
// 						<IconBox
// 							w='56px'
// 							h='56px'
// 							bg={boxBg}
// 							icon={<Icon w='28px' h='28px' as={SIcon} color={iconColor} />}
// 						/>
// 					}
// 					// active={colorMode === 'dark' ? true : false}
// 					name={label}
// 					value={value}
// 				/>
// 			))}

// 			{/* <MiniStatistics
// 				onClick={() => navigate('/lead')}
// 				startContent={
// 					<IconBox
// 						w='40px'
// 						h='40px'
// 						bg={boxBg}
// 						icon={
// 							<Icon w='20px' h='20px' as={MdLeaderboard} color={brandColor} />
// 						}
// 					/>
// 				}
// 				name='Leads'
// 				value={130}
// 			/> */}
// 		</SimpleGrid>
// 	);
// };

// export default DashboardStatCards;
import React, { useMemo } from 'react';
import { Box, Flex, Text, Icon, SimpleGrid, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
	MdLeaderboard,
	MdPeople,
	MdTrendingUp,
	MdArrowForward,
} from 'react-icons/md';
import { PiBuildingsBold } from 'react-icons/pi';
import { FaUsers } from 'react-icons/fa';

const DashboardStatCards = ({ stats }) => {
	const navigate = useNavigate();

	// Using your theme's gold gradient
	const iconBgGradient =
		'linear-gradient(135deg, #F5D67B 0%, #D4AF37 50%, #C9A227 100%)';
	const iconColor = '#000000';

	// Calculate trends (example - you can replace with actual trend data from props)
	const cards = useMemo(
		() => [
			{
				label: 'Total Leads',
				value: stats.totalLeads || 0,
				icon: MdLeaderboard,
				route: '/lead',
				trend: '+12%',
				trendDirection: 'up',
				description: 'Active leads in pipeline',
				color: 'gold.primary',
			},
			{
				label: 'Total Users',
				value: stats.totalUsers || 0,
				icon: MdPeople,
				route: '/user',
				trend: '+5%',
				trendDirection: 'up',
				description: 'Registered users',
				color: 'gold.primary',
			},
			{
				label: 'Total Candidates',
				value: stats.totalCandidates || 0,
				icon: FaUsers,
				route: '/hiring/candidates',
				trend: '+18%',
				trendDirection: 'up',
				description: 'Active candidates',
				color: 'gold.primary',
			},
			{
				label: 'Total Developers',
				value: stats.totalDevelopers || 0,
				icon: PiBuildingsBold,
				route: '/invoice/developer',
				trend: '+8%',
				trendDirection: 'up',
				description: 'Available developers',
				color: 'gold.primary',
			},
		],
		[stats],
	);

	return (
		<SimpleGrid
			columns={{ base: 1, sm: 2, lg: 4 }}
			spacing={{ base: 4, sm: 5, md: 6 }}
			mb={{ base: 5, md: 6 }}
		>
			{cards.map(
				({
					label,
					value,
					icon: SIcon,
					route,
					trend,
					trendDirection,
					description,
					color,
				}) => (
					<StatCard
						key={label}
						label={label}
						value={value}
						icon={SIcon}
						route={route}
						trend={trend}
						trendDirection={trendDirection}
						description={description}
						color={color}
						onClick={() => navigate(route)}
						iconBgGradient={iconBgGradient}
						iconColor={iconColor}
					/>
				),
			)}
		</SimpleGrid>
	);
};

// Custom Stat Card Component
const StatCard = ({
	label,
	value,
	icon: IconComponent,
	route,
	trend,
	trendDirection,
	description,
	onClick,
	iconBgGradient,
	iconColor,
}) => {
	const isPositive = trendDirection === 'up';

	return (
		<Box
			onClick={onClick}
			cursor='pointer'
			bg='bg.surface'
			borderRadius='xl'
			borderWidth='1px'
			borderColor='border.default'
			position='relative'
			overflow='hidden'
			transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
			_hover={{
				transform: { base: 'none', md: 'translateY(-4px)' },
				boxShadow: 'goldGlow',
				borderColor: 'gold.primary',
			}}
		>
			{/* Gold accent bar at top */}
			<Box
				position='absolute'
				top='0'
				left='0'
				right='0'
				h='3px'
				bgGradient={iconBgGradient}
			/>

			{/* Background decorative pattern */}
			<Box
				position='absolute'
				top='-20px'
				right='-20px'
				w='100px'
				h='100px'
				bg='radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)'
				borderRadius='full'
				pointerEvents='none'
			/>

			{/* Content */}
			<Box p={{ base: 4, sm: 5 }}>
				{/* Header with Icon and Trend */}
				<Flex align='flex-start' justify='space-between' mb={4}>
					{/* Icon Container */}
					<Flex
						w={{ base: '50px', sm: '56px' }}
						h={{ base: '50px', sm: '56px' }}
						bgGradient={iconBgGradient}
						borderRadius='lg'
						align='center'
						justify='center'
						boxShadow='sm'
						transition='all 0.3s'
						_hover={{ transform: 'scale(1.05)' }}
					>
						<Icon
							as={IconComponent}
							w={{ base: '22px', sm: '24px' }}
							h={{ base: '22px', sm: '24px' }}
							color={iconColor}
						/>
					</Flex>

					{/* Trend Badge */}
					{/* {trend && (
						<Badge
							variant='gold'
							borderRadius='full'
							px={2}
							py={1}
							fontSize='xs'
							display='flex'
							alignItems='center'
							gap={1}
						>
							<Icon
								as={MdTrendingUp}
								boxSize='10px'
								color={isPositive ? 'green.400' : 'red.400'}
							/>
							{trend}
						</Badge>
					)} */}
				</Flex>

				{/* Value and Label */}
				<Box mb={3}>
					<Text
						fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
						fontWeight='bold'
						color='text.heading'
						lineHeight='1.2'
						mb={1}
					>
						{value?.toLocaleString() || 0}
					</Text>

					<Text
						fontSize={{ base: 'sm', sm: 'md' }}
						fontWeight='semibold'
						color='text.accent'
						mb={1}
					>
						{label}
					</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default DashboardStatCards;
