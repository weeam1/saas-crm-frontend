// import React, { useMemo } from 'react';
// import { Box, Flex, Text, Icon } from '@chakra-ui/react';
// import {
// 	MdBarChart,
// 	MdAssignment,
// 	MdShoppingBag,
// 	MdPersonAdd,
// } from 'react-icons/md';
// import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

// const TodaySummary = ({ summary }) => {
// 	const data = useMemo(
// 		() => [
// 			{
// 				icon: MdBarChart,
// 				value: summary?.newLeads?.today || 0,
// 				label: 'New Leads',
// 				percentChange: summary?.newLeads?.percentChange,
// 				colorScheme: 'brand',
// 			},
// 			{
// 				icon: MdAssignment,
// 				value: summary?.leadNotes?.today || 0,
// 				label: 'Lead Notes',
// 				percentChange: summary?.leadNotes?.percentChange,
// 				colorScheme: 'teal',
// 			},
// 			{
// 				icon: MdShoppingBag,
// 				value: summary?.closedDeals?.today || 0,
// 				label: 'Close Deals',
// 				percentChange: summary?.closedDeals?.percentChange,
// 				colorScheme: 'pink',
// 			},
// 			{
// 				icon: MdPersonAdd,
// 				value: summary?.totalAssignedLeads?.today || 0,
// 				label: 'Leads Assigned',
// 				percentChange: summary?.totalAssignedLeads?.percentChange,
// 				colorScheme: 'blue',
// 			},
// 		],
// 		[summary],
// 	);

// 	return (
// 		<Box bg='white' p={6} borderRadius='2xl' mb='4'>
// 			<Text fontSize='xl' fontWeight='bold' mb={1}>
// 				Today’s Summary
// 			</Text>
// 			<Text fontSize='sm' color='gray.500' mb={5}>
// 				Leads Summary
// 			</Text>
// 			<Flex gap={4} flexWrap='wrap'>
// 				{data.map((item, index) => (
// 					<SummaryCard key={index} {...item} />
// 				))}
// 			</Flex>
// 		</Box>
// 	);
// };

// const SummaryCard = ({ icon, value, label, percentChange = 0, colorScheme }) => {
// 	const isPositive = percentChange >= 0;
// 	const arrowIcon = isPositive ? TriangleUpIcon : TriangleDownIcon;
// 	const percentColor = isPositive ? `${colorScheme}.500` : 'red.500';

// 	return (
// 		<Box
// 			bg={`${colorScheme}.50`}
// 			borderRadius='2xl'
// 			p={5}
// 			flex='1'
// 			minW='200px'
// 		>
// 			<Flex align='center' justify='space-between'>
// 				<Icon as={icon} boxSize={6} color={`${colorScheme}.300`} />
// 			</Flex>
// 			<Text fontSize='xl' color='gray.800' fontWeight='bold' mt={2}>
// 				{value}
// 			</Text>
// 			<Text color='gray.800' fontWeight='medium'>
// 				{label}
// 			</Text>

// 			<Flex align='center' mt={2}>
// 				<Icon as={arrowIcon} color={percentColor} boxSize={4} mr={1} />
// 				<Text color={percentColor} fontWeight='semibold' fontSize='sm'>
// 					{isPositive ? `+${percentChange}%` : `${percentChange}%`} from
// 					yesterday
// 				</Text>
// 			</Flex>
// 			{/* <Text
// 				color={`${percentChange >= 0 ? `${colorScheme}.500` : 'red.500'}`}
// 				fontWeight='semibold'
// 				fontSize='sm'
// 				mt={1}
// 			>
// 				{percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`} from
// 				yesterday
// 			</Text> */}
// 		</Box>
// 	);
// };

// export default TodaySummary;

import React, { useMemo } from 'react';
import { Box, Flex, Text, Icon, SimpleGrid } from '@chakra-ui/react';
import {
	MdBarChart,
	MdAssignment,
	MdShoppingBag,
	MdPersonAdd,
} from 'react-icons/md';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

const TodaySummary = ({ summary }) => {
	const data = useMemo(
		() => [
			{
				icon: MdBarChart,
				value: summary?.newLeads?.today || 0,
				label: 'New Leads',
				percentChange: summary?.newLeads?.percentChange,
			},
			{
				icon: MdAssignment,
				value: summary?.leadNotes?.today || 0,
				label: 'Lead Notes',
				percentChange: summary?.leadNotes?.percentChange,
			},
			{
				icon: MdShoppingBag,
				value: summary?.closedDeals?.today || 0,
				label: 'Closed Deals',
				percentChange: summary?.closedDeals?.percentChange,
			},
			{
				icon: MdPersonAdd,
				value: summary?.totalAssignedLeads?.today || 0,
				label: 'Leads Assigned',
				percentChange: summary?.totalAssignedLeads?.percentChange,
			},
		],
		[summary],
	);

	return (
		<Box
			bg='bg.surface'
			p={{ base: 3, sm: 4, md: 6 }}
			borderRadius='xl'
			mb={4}
			borderWidth='1px'
			borderColor='border.default'
		>
			<Text
				fontSize={{ base: 'lg', sm: 'xl' }}
				fontWeight='bold'
				color='text.heading'
				mb={1}
			>
				Today’s Summary
			</Text>
			<Text
				fontSize={{ base: 'xs', sm: 'sm' }}
				color='text.muted'
				mb={{ base: 3, sm: 4, md: 5 }}
			>
				Leads Performance Overview
			</Text>

			<SimpleGrid
				columns={{ base: 1, sm: 2, lg: 4 }}
				spacing={{ base: 3, sm: 4, md: 5 }}
			>
				{data.map((item, index) => (
					<SummaryCard key={index} {...item} />
				))}
			</SimpleGrid>
		</Box>
	);
};

const SummaryCard = ({ icon, value, label, percentChange = 0 }) => {
	const isPositive = percentChange >= 0;
	const arrowIcon = isPositive ? TriangleUpIcon : TriangleDownIcon;
	const percentColor = isPositive ? 'green.400' : 'red.400';

	return (
		<Box
			bg='bg.elevated'
			borderRadius='lg'
			p={{ base: 4, sm: 5 }}
			transition='all 0.2s'
			_hover={{
				transform: { base: 'none', md: 'translateY(-2px)' },
				boxShadow: 'goldGlow',
			}}
			borderWidth='1px'
			borderColor='border.subtle'
			position='relative'
			overflow='hidden'
		>
			{/* Subtle background pattern */}
			<Box
				position='absolute'
				top='-30%'
				right='-30%'
				width='160%'
				height='160%'
				bg='radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)'
				borderRadius='full'
				pointerEvents='none'
			/>

			<Flex align='center' justify='space-between' mb={3}>
				<Box bg='navy.600' p={{ base: 2, sm: 2.5 }} borderRadius='lg'>
					<Icon
						as={icon}
						boxSize={{ base: 4, sm: 5, md: 6 }}
						color='gold.primary'
					/>
				</Box>

				{/* Trend indicator chip */}
				<Flex
					align='center'
					bg={
						isPositive ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)'
					}
					px={{ base: 1.5, sm: 2 }}
					py={1}
					borderRadius='full'
					gap={1}
				>
					<Icon
						as={arrowIcon}
						color={percentColor}
						boxSize={{ base: 2.5, sm: 3 }}
					/>
					<Text
						color={percentColor}
						fontWeight='semibold'
						fontSize={{ base: '10px', sm: 'xs' }}
					>
						{isPositive ? `+${percentChange}%` : `${percentChange}%`}
					</Text>
				</Flex>
			</Flex>

			<Text
				fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
				color='text.heading'
				fontWeight='bold'
				lineHeight='1.2'
				mb={1}
			>
				{value?.toLocaleString() || 0}
			</Text>

			<Text
				color='text.muted'
				fontWeight='medium'
				fontSize={{ base: 'sm', sm: 'md' }}
			>
				{label}
			</Text>

			{/* Subtle progress bar at bottom */}
			<Box
				position='absolute'
				bottom='0'
				left='0'
				right='0'
				h='2px'
				bg='gold.primary'
				opacity='0.3'
				borderRadius='full'
			/>
		</Box>
	);
};

export default TodaySummary;
