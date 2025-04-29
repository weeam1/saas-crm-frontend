import React, { useMemo } from 'react';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import {
	MdBarChart,
	MdAssignment,
	MdShoppingBag,
	MdPersonAdd,
} from 'react-icons/md';

const TodaySummary = ({ summary }) => {
	const data = useMemo(
		() => [
			{
				icon: MdBarChart,
				value: summary.newLeads.today || 0,
				label: 'New Leads',
				percentChange: summary.newLeads.percentChange,
				colorScheme: 'brand',
			},
			{
				icon: MdAssignment,
				value: summary.leadNotes.today || 0,
				label: 'Lead Notes',
				percentChange: summary.leadNotes.percentChange,
				colorScheme: 'teal',
			},
			{
				icon: MdShoppingBag,
				value: summary.closedDeals.today || 0,
				label: 'Close Deals',
				percentChange: summary.closedDeals.percentChange,
				colorScheme: 'pink',
			},
			{
				icon: MdPersonAdd,
				value: summary.totalAssignedLeads.today || 0,
				label: 'Leads Assigned',
				percentChange: summary.totalAssignedLeads.percentChange,
				colorScheme: 'blue',
			},
		],
		[summary]
	);

	return (
		<Box bg='white' p={6} borderRadius='2xl' mb='4'>
			<Text fontSize='xl' fontWeight='bold' mb={1}>
				Today’s Summary
			</Text>
			<Text fontSize='sm' color='gray.500' mb={5}>
				Leads Summary
			</Text>
			<Flex gap={4} flexWrap='wrap'>
				{data.map((item, index) => (
					<SummaryCard key={index} {...item} />
				))}
			</Flex>
		</Box>
	);
};

const SummaryCard = ({ icon, value, label, percentChange, colorScheme }) => {
	return (
		<Box
			bg={`${colorScheme}.100`}
			borderRadius='2xl'
			p={5}
			flex='1'
			minW='200px'
		>
			<Flex align='center' justify='space-between'>
				<Icon as={icon} boxSize={6} color={`${colorScheme}.300`} />
			</Flex>
			<Text fontSize='xl' color='gray.800' fontWeight='bold' mt={2}>
				{value}
			</Text>
			<Text color='gray.800' fontWeight='medium'>
				{label}
			</Text>
			<Text
				color={`${percentChange >= 0 ? `${colorScheme}.500` : 'red.500'}`}
				fontWeight='semibold'
				fontSize='sm'
				mt={1}
			>
				{percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`} from
				yesterday
			</Text>
		</Box>
	);
};

export default TodaySummary;
