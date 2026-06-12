/**
 * Reports Home (Reports V3)
 * -------------------------
 * Landing page listing the available report modules as responsive cards.
 * Only "Leads" is active for now; the rest are placeholders ("coming soon").
 *
 * Route: /reports-v3
 */

import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	FiBriefcase,
	FiDollarSign,
	FiPhone,
	FiTrendingUp,
	FiUserCheck,
	FiUsers,
} from 'react-icons/fi';

import { useModalColors } from 'hooks/useModalColors';
import { usePermissions } from 'hooks/usePermissions';
import ModuleCard from './components/ModuleCard';

const MODULES = [
	{
		key: 'leads',
		title: 'Leads',
		description:
			'Pipeline, conversion, sources, funnel, velocity and activity analytics for your leads.',
		icon: FiUsers,
		status: 'active',
		path: '/reports-v3/leads',
	},
	{
		key: 'deals',
		title: 'Deals',
		description: 'Closed deals, revenue, commissions and sales performance over time.',
		icon: FiDollarSign,
		status: 'soon',
	},
	{
		key: 'agents',
		title: 'Agents',
		description: 'Per-agent productivity, targets and team performance leaderboards.',
		icon: FiUserCheck,
		status: 'soon',
	},
	{
		key: 'calls',
		title: 'Calls',
		description: 'Call volume, durations, outcomes and recording analytics.',
		icon: FiPhone,
		status: 'soon',
	},
	{
		key: 'hiring',
		title: 'Hiring',
		description: 'Recruitment funnel, interview stages and offer conversion metrics.',
		icon: FiBriefcase,
		status: 'soon',
	},
	{
		key: 'finance',
		title: 'Finance',
		description: 'Income, expenses, payroll and balance trends across the business.',
		icon: FiTrendingUp,
		status: 'soon',
	},
];

const ReportsHomeV3 = () => {
	const colors = useModalColors();
	const navigate = useNavigate();
	const { hasPermission } = usePermissions();

	// Gate behind the existing "reports" permission (no backend change).
	useEffect(() => {
		if (!hasPermission('reports')) navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box bg={colors.bgDeep} minH='100vh' p={{ base: 3, md: 5 }}>
			{/* Page header */}
			<Box
				bg={colors.bg}
				rounded='lg'
				shadow={colors.cardShadow}
				borderWidth='1px'
				borderColor={colors.borderColor}
				p={{ base: 5, md: 6 }}
				mb={6}
			>
				<Text
					fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
					fontWeight='bold'
					color={colors.headingText}
					mb={2}
				>
					Reports
				</Text>
				<Text color={colors.bodyText} fontSize={{ base: 'sm', md: 'md' }} maxW='720px'>
					Explore analytics across your CRM. Select a module to dive into detailed
					reports, charts and exportable data.
				</Text>
			</Box>

			{/* Module grid */}
			<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, md: 5 }}>
				{MODULES.map((mod) => (
					<ModuleCard
						key={mod.key}
						title={mod.title}
						description={mod.description}
						icon={mod.icon}
						status={mod.status}
						onClick={mod.path ? () => navigate(mod.path) : undefined}
					/>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default ReportsHomeV3;
