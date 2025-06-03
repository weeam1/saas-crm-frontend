// components/HiringStatusCards.jsx (Chakra UI version with real cards)
import React from 'react';
import {
	Box,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	Icon,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import {
	FiClock,
	FiCheckCircle,
	FiSend,
	FiThumbsUp,
	FiUsers,
} from 'react-icons/fi';
import { StatCard } from '../StatCard';

const statusData = [
	{
		label: 'Pending',
		valueKey: 'totalPending',
		icon: FiClock,
		color: 'orange',
	},
	{
		label: 'Shortlisted',
		valueKey: 'totalShortListed',
		icon: FiCheckCircle,
		color: 'blue',
	},
	{
		label: 'Invited',
		valueKey: 'totalInvited',
		icon: FiSend,
		color: 'purple',
	},
	{
		label: 'Invite Accepted',
		valueKey: 'totalInviteAccepted',
		icon: FiThumbsUp,
		color: 'green',
	},
	{
		label: 'Interviewed',
		valueKey: 'totalInterviewed',
		icon: FiUsers,
		color: 'teal',
	},
];

const HiringStatusCards = ({ stats }) => {
	const bgColor = useColorModeValue('white', 'gray.800');

	return (
		<SimpleGrid
			columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 5 }}
			spacing={6}
			width='100%'
		>
			{statusData.map((item, index) => (
				<StatCard
					title={item.label}
					value={stats?.[item.valueKey] ?? 0}
					icon={item.icon}
					colorScheme={item.color}
				/>
			))}
		</SimpleGrid>
	);
};

export default HiringStatusCards;
