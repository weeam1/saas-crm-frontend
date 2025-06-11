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
	const [period, setPeriod] = useState('weekly');

	const [chartData, setChartData] = useState({
		analytics: [],
		assignments: [],
	});

	// Add this at the start of your component
	// useEffect(() => {
	// 	const originalError = console.error;
	// 	console.error = (...args) => {
	// 		if (/ResizeObserver/.test(args[0])) {
	// 			return;
	// 		}
	// 		originalError(...args);
	// 	};
	// 	return () => {
	// 		console.error = originalError;
	// 	};
	// }, []);

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
			// const percentData = normalizePercentData(data?.doc);
			const assignmentsData = normalizeAssignmentsData(data?.doc);

			setChartData({ analytics: analyticData, assignments: assignmentsData });
		}
	}, [data?.doc]);

	// if (!isSuccess || !data?.doc) return <NoData label='data' />;

	return (
		<VStack spacing={6} w='full' bg='white' rounded='md' shadow='sm' p='6'>
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
							>
								Lead Report
							</Text>
							<RefButton to='/lead' label='Lead Module' />
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
								color='gray.600'
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
										stroke='#e2e8f0'
									/>
									<XAxis dataKey='label' fontSize='12px' />
									<YAxis
										allowDecimals={false}
										fontSize='12px'
										domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
									/>
									<Tooltip cursor={{ fill: '#ebf8ff' }} />
									<Legend />
									<Bar
										dataKey='current'
										fill='#D99A36'
										name='Current'
										radius={[4, 4, 0, 0]}
										animationDuration={500}
									></Bar>
									<Bar
										dataKey='previous'
										fill='#EDD199'
										name='Previous'
										radius={[4, 4, 0, 0]}
										animationDuration={500}
									></Bar>
								</BarChart>
							</SafeResponsiveChart>
						</Box>

						{/* Assignment Comparison */}
						<Box flex='1' minW='0' h='320px' key='bar-chart-2'>
							<Text
								fontSize='sm'
								textAlign='center'
								color='gray.600'
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
										stroke='#e2e8f0'
									/>
									<XAxis dataKey='role' fontSize='12px' />
									<YAxis allowDecimals={false} fontSize='12px' />
									<Tooltip cursor={{ fill: '#ebf8ff' }} />
									<Legend />
									<Bar
										dataKey='current'
										fill='#D99A36'
										name='Current'
										radius={[4, 4, 0, 0]}
										animationDuration={500}
									/>
									<Bar
										dataKey='previous'
										fill='#EDD199'
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
