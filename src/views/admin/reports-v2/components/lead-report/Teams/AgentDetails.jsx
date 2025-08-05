import { useMemo, useState } from 'react';
import { Box, Flex, Text, Grid, Stack } from '@chakra-ui/react';
import {
	FiTrendingUp,
	FiFileText,
	FiCheckCircle,
	FiEdit3,
} from 'react-icons/fi';
import { StatCard } from '../../StatCard'; //
import AgentFilter from './AgentFilter';
import LeadStatusChart from '../LeadStatusChart';
import LeadMainStatusChart from '../LeadMainStatusChart';
import { viewOptions } from 'views/admin/reports-v2/helpers';
import TopFilter from '../../TopFilter';
import { useFetchItemsQuery } from 'api/apiSlice';
import SalesBarChart from '../SalesBarChart';

const AgentDetails = ({ agents }) => {
	const sortedAgents = useMemo(
		() =>
			[...agents].sort(
				(a, b) =>
					(b.leadData?.closedDeals || 0) - (a.leadData?.closedDeals || 0)
			),
		[agents]
	);

	const [selectedAgent, setSelectedAgent] = useState(
		sortedAgents.length > 0 ? sortedAgents[0] : null
	);

	const [view, setView] = useState('top5');

	const { data: sales, isLoading: salesLoading } = useFetchItemsQuery(
		{
			path: '/deals/sales_report',
			params: { userId: selectedAgent._id },
		},
		{
			skip: !selectedAgent._id,
			refetchOnMountOrArgChange: true,
		}
	);

	return (
		<Box p={8} bg='white' rounded='lg' shadow='sm' mb='4'>
			<Flex
				justify='space-between'
				align='center'
				mb={4}
				gap='2'
				flexDir={{ base: 'column', md: 'row' }}
			>
				<Text fontSize={{ base: 'md', md: 'xl' }} fontWeight='bold'>
					{selectedAgent?.fullName || ''} Agent Overview
				</Text>
				<AgentFilter
					agents={agents}
					onSelect={(agent) => setSelectedAgent(agent)}
					selectedAgent={selectedAgent}
					setSelectedAgent={setSelectedAgent}
				/>
			</Flex>

			<Grid
				templateColumns='repeat(auto-fit, minmax(200px, 1fr))'
				p='2'
				gap={6}
			>
				<StatCard
					title='Total Leads'
					value={selectedAgent.leadData.totalLeads}
					icon={FiTrendingUp}
					colorScheme='brand'
				/>
				<StatCard
					title='Total Notes'
					value={selectedAgent.leadData.totalNotes}
					icon={FiFileText}
					colorScheme='blue'
				/>
				<StatCard
					title='Leads Created'
					value={selectedAgent.leadData.leadsCreated}
					icon={FiEdit3}
					colorScheme='green'
				/>
				<StatCard
					title='Closed Deals'
					value={selectedAgent.leadData.closedDeals}
					icon={FiCheckCircle}
					colorScheme='red'
				/>
			</Grid>

			{/* Feedbacks  */}
			<Box bg='white' my='2' rounded='md' shadow='sm' p='4'>
				<Flex
					justify='space-between'
					align='center'
					mb={4}
					gap={2}
					// flexDir={{ base: 'column', md: 'row' }}
				>
					<Text
						fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}
						fontWeight='bold'
						mb='2'
					>
						Lead Feedbacks
					</Text>

					<TopFilter view={view} setView={setView} options={viewOptions} />
				</Flex>

				<Stack
					sx={{
						flexDirection: 'row',
						'@media (max-width: 1050px)': {
							flexDirection: 'column',
						},
					}}
					gap='1'
					align='stretch'
					justify='space-between'
				>
					{selectedAgent.leadData.statusStats && (
						<LeadStatusChart
							data={selectedAgent.leadData.statusStats}
							view={view}
						/>
					)}

					{selectedAgent.leadData.mainStatusStats && (
						<LeadMainStatusChart
							data={selectedAgent.leadData.mainStatusStats}
							view={view}
						/>
					)}
				</Stack>
			</Box>

			{/* Sales Report */}
			{sales?.sales_report && (
				<SalesBarChart data={sales?.sales_report} title='Agent Monthly Sales' />
			)}
		</Box>
	);
};

export default AgentDetails;
