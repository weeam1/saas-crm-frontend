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
import { useModalColors } from 'hooks/useModalColors';

const statusData = [
	{
		label: 'Pending',
		valueKey: 'totalPending',
		icon: FiClock,
		color: 'gold',
	},
	{
		label: 'Shortlisted',
		valueKey: 'totalShortListed',
		icon: FiCheckCircle,
		color: 'gold',
	},
	{
		label: 'Invited',
		valueKey: 'totalInvited',
		icon: FiSend,
		color: 'gold',
	},
	{
		label: 'Invite Accepted',
		valueKey: 'totalInviteAccepted',
		icon: FiThumbsUp,
		color: 'gold',
	},
	{
		label: 'Interviewed',
		valueKey: 'totalInterviewed',
		icon: FiUsers,
		color: 'gold',
	},
];

const HiringStatusCards = ({ stats }) => {
	const colors = useModalColors();

	return (
		<SimpleGrid
			columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 5 }}
			spacing={6}
			width='100%'
			px='6'
			py='4'
		>
			{statusData.map((item, index) => (
				<StatCard
					key={index}
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