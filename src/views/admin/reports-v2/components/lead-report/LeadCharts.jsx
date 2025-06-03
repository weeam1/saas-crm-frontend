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
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import SafeResponsiveChart from './SafeResponsiveChart';

const PERIOD_OPTIONS = ['today', 'weekly', 'monthly'];
// const COLORS = ['#3182ce', '#63b3ed', '#90cdf4', '#bee3f8'];
const COLORS = ['#F5ECCB', '#EDD199', '#E5B668', '#D99A36'];

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
	const [period, setPeriod] = useState('today');

	// Add this at the start of your component
	useEffect(() => {
		const originalError = console.error;
		console.error = (...args) => {
			if (/ResizeObserver/.test(args[0])) {
				return;
			}
			originalError(...args);
		};
		return () => {
			console.error = originalError;
		};
	}, []);

	const { data, isLoading, isSuccess } = useFetchItemsQuery(
		{
			path: '/v2/reporting/leads_summary',
			params: { period },
		},
		{ refetchOnMountOrArgChange: true }
	);

	if (isLoading) return <Loader />;
	if (!isSuccess || !data?.doc) return <Text>No data available</Text>;

	const barData = normalizeBarData(data.doc);
	const percentData = normalizePercentData(data.doc);
	const assignmentsData = normalizeAssignmentsData(data.doc);

	return (
		<VStack spacing={6} w='full' bg='white' rounded='md' shadow='sm' p='4'>
			<HStack w='full' justify='space-between'>
				<Text fontSize='2xl' fontWeight='bold'>
					Lead Report
				</Text>
				<Select
					w='150px'
					size='sm'
					// py='2'
					rounded='md'
					outline='none'
					_focus={{ outline: 'none' }}
					value={period}
					onChange={(e) => setPeriod(e.target.value)}
				>
					{PERIOD_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt.toUpperCase()}
						</option>
					))}
				</Select>
			</HStack>

			<Stack direction={{ base: 'column', md: 'row' }} spacing={4} width='100%'>
				{/* Bar Chart: Current vs Previous */}
				<Box flex='1' minW='0' h='300px' key='bar-chart-1'>
					<SafeResponsiveChart>
						<BarChart data={barData}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='label' />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Legend />
							<Bar dataKey='current' fill='#D99A36' name='Current' />
							<Bar dataKey='previous' fill='#EDD199' name='Previous' />
						</BarChart>
					</SafeResponsiveChart>
				</Box>

				{/* Assignment Comparison */}
				<Box flex='1' minW='0' h='300px' key='bar-chart-2'>
					<SafeResponsiveChart>
						<BarChart data={assignmentsData}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis dataKey='role' />
							<YAxis allowDecimals={false} />
							<Tooltip />
							<Legend />
							<Bar dataKey='current' fill='#D99A36' name='Current' />
							<Bar dataKey='previous' fill='#EDD199' name='Previous' />
						</BarChart>
					</SafeResponsiveChart>
				</Box>
			</Stack>
			{/* Pie Chart: % Change */}
			{/* <Box w='full' h='300px'>
				<ResponsiveContainer width='100%' height='100%'>
					<PieChart>
						<Pie
							data={percentData}
							dataKey='percentChange'
							nameKey='name'
							cx='50%'
							cy='50%'
							outerRadius={100}
							label
						>
							{percentData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip />
					</PieChart>
				</ResponsiveContainer>
			</Box> */}
		</VStack>
	);
}
