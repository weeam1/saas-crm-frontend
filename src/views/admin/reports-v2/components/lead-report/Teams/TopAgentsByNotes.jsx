import { Box, Text } from '@chakra-ui/react';

import { getTopAgentsByNotes } from 'views/admin/reports-v2/helpers';
import HorizontalSummaryChart from './HorizontalSummaryChart';

const TopAgentsByNotes = ({ agents }) => {
	const topAgents = getTopAgentsByNotes(agents, 5);

	// Format data for Recharts
	const data = topAgents
		.filter((item) => item.leadData?.totalNotes !== 0)
		.map((agent, idx) => ({
			name: agent.fullName,
			Notes: agent.leadData?.totalNotes || 0,
		}));

	return (
		<Box bg='gray.100' borderRadius='xl' boxShadow='sm' p={4}>
			<Text fontSize='lg' fontWeight='bold' mb={4}>
				📝 Top Agents by Notes
			</Text>
			<HorizontalSummaryChart data={data} type='Notes' />
			{/* <ResponsiveContainer width='99%' height={250}>
				<BarChart
					data={data}
					layout='vertical'
					margin={{ left: 2 }}
					barSize='18'
				>
					<XAxis type='number' fontSize='12px' />
					<YAxis dataKey='name' type='category' width={150} fontSize='12px' />
					<Tooltip />
					<Bar dataKey='Notes' fill='#E5B668'>
						{data.map((_, idx) => (
							<Cell key={idx} fill={BRAND_COLORS[idx % BRAND_COLORS.length]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer> */}
		</Box>
	);
};

export default TopAgentsByNotes;
