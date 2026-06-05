// Import required libraries
import { useEffect, useMemo, useState } from 'react';
import {
	Box,
	Button,
	HStack,
	Select,
	Spinner,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';
import { useFetchItemsQuery } from 'api/apiSlice';
import SafeResponsiveChart from './SafeResponsiveChart';
import TopFilter from '../TopFilter';
import { PERIOD_OPTIONS } from '../../helpers';
import CardShimmer from 'components/loading/CardShimmer';

import NoData from 'components/Message/NoData';
import RefButton from '../RefButton';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const normalizeBarData = (doc) => [
	{
		label: 'New',
		current: doc.newLeads.current,
		previous: doc.newLeads.previous,
	},
	{
		label: 'Deals',
		current: doc.closedDeals.current,
		previous: doc.closedDeals.previous,
	},
	{
		label: 'Notes',
		current: doc.leadNotes.current,
		previous: doc.leadNotes.previous,
	},
	{
		label: 'Assigned',
		current: doc.totalAssignedLeads.current,
		previous: doc.totalAssignedLeads.previous,
	},
];

const normalizePercentData = (doc) => [
	{ name: 'New Leads', percentChange: doc.newLeads.percentChange },
	{ name: 'Closed Deals', percentChange: doc.closedDeals.percentChange },
	{ name: 'Lead Notes', percentChange: doc.leadNotes.percentChange },
	{
		name: 'Assigned Leads',
		percentChange: doc.totalAssignedLeads.percentChange,
	},
];

const normalizeAssignmentsData = (doc) => [
	{
		role: 'Manager',
		current: doc.assignments.manager.current,
		previous: doc.assignments.manager.previous,
	},
	{
		role: 'Agent',
		current: doc.assignments.agent.current,
		previous: doc.assignments.agent.previous,
	},
];

export default function LeadsCharts() {
	const colors = useModalColors();
	const [period, setPeriod] = useState('weekly');

	const { hasPermission } = usePermissions();

	const [chartData, setChartData] = useState({
		analytics: [],
		assignments: [],
	});

	const { data, isLoading, isSuccess } = useFetchItemsQuery(
		{
			path: '/v2/reporting/leads_summary',
			params: { period },
		},
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		if (data?.doc) {
			const analyticData = normalizeBarData(data?.doc);
			const assignmentsData = normalizeAssignmentsData(data?.doc);

			setChartData({ analytics: analyticData, assignments: assignmentsData });
		}
	}, [data?.doc]);

	return (
		<VStack spacing={6} w='full' bg={colors.bg} rounded='md' shadow={colors.cardShadow} p='6' border="1px solid" borderColor={colors.borderColor}>
			{isLoading ? (
				<CardShimmer
					count={2}
					height='400px'
					columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 2, '2xl': 2 }}
				/>
			) : data?.doc ? (
				<>
					<HStack w='full' justify='space-between'>
						<HStack>
							<Text
								fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
								fontWeight='bold'
								color={colors.headingText}
							>
								Lead Report
							</Text>
							{hasPermission('reports', 'link') && hasPermission('leads') && (
								<RefButton to='/lead' label='Lead Module' />
							)}
						</HStack>

						<TopFilter
							view={period}
							setView={setPeriod}
							options={PERIOD_OPTIONS}
						/>
					</HStack>

					<Stack
						direction={{ base: 'column', md: 'row' }}
						spacing={4}
						gap='12'
						width='100%'
					>
						{/* Bar Chart: Current vs Previous */}
						<Box flex='1' minW='0' h='320px' key='bar-chart-1'>
							<Text
								fontSize='sm'
								textAlign='center'
								color={colors.bodyText}
								fontWeight='bold'
								mb='2'
							>
								Lead Analytics Comparison
							</Text>
							<SafeResponsiveChart>
								<BarChart data={chartData.analytics} barSize={30}>
									<CartesianGrid
										strokeDasharray='3 3'
										vertical={false}
										stroke={colors.borderColor}
									/>
									<XAxis
										dataKey='label'
										fontSize='12px'
										tick={{ fill: colors.bodyText }}
										axisLine={{ stroke: colors.borderColor }}
									/>
									<YAxis
										allowDecimals={false}
										fontSize='12px'
										domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
										tick={{ fill: colors.bodyText }}
										axisLine={{ stroke: colors.borderColor }}
									/>
									<Tooltip cursor={{ fill: `${colors.accentGold}15` }} />
									<Legend />
									<Bar
										dataKey='current'
										fill={colors.accentGold}
										name='Current'
										radius={[4, 4, 0, 0]}
										animationDuration={500}
									/>
									<Bar
										dataKey='previous'
										fill={`${colors.accentGold}60`}
										name='Previous'
										radius={[4, 4, 0, 0]}
										animationDuration={500}
									/>
								</BarChart>
							</SafeResponsiveChart>
						</Box>

						{/* Assignment Comparison */}
						<Box flex='1' minW='0' h='320px' key='bar-chart-2'>
							<Text
								fontSize='sm'
								textAlign='center'
								color={colors.bodyText}
								fontWeight='bold'
								mb='2'
							>
								Lead Assignments Comparison
							</Text>
							<SafeResponsiveChart>
								<BarChart
									data={chartData.assignments}
									barSize={50}
									radius={[4, 4, 0, 0]}
									animationDuration={1500}
								>
									<CartesianGrid
										strokeDasharray='3 3'
										vertical={false}
										stroke={colors.borderColor}
									/>
									<XAxis
										dataKey='role'
										fontSize='12px'
										tick={{ fill: colors.bodyText }}
										axisLine={{ stroke: colors.borderColor }}
									/>
									<YAxis
										allowDecimals={false}
										fontSize='12px'
										tick={{ fill: colors.bodyText }}
										axisLine={{ stroke: colors.borderColor }}
									/>
									<Tooltip cursor={{ fill: `${colors.accentGold}15` }} />
									<Legend />
									<Bar
										dataKey='current'
										fill={colors.accentGold}
										name='Current'
										radius={[4, 4, 0, 0]}
										animationDuration={500}
									/>
									<Bar
										dataKey='previous'
										fill={`${colors.accentGold}60`}
										name='Previous'
										radius={[4, 4, 0, 0]}
										animationDuration={500}
									/>
								</BarChart>
							</SafeResponsiveChart>
						</Box>
					</Stack>
				</>
			) : (
				<NoData label='data' />
			)}
		</VStack>
	);
}