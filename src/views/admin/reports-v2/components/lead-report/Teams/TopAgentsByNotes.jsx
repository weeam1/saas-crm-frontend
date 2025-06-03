import { Box, Text } from '@chakra-ui/react';

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import { BRAND_COLORS } from 'utils/helpers';
import { getTopAgentsByNotes } from 'views/admin/reports-v2/helpers';
import SafeResponsiveChart from './../SafeResponsiveChart';

const TopAgentsByNotes = ({ agents }) => {
	const topAgents = getTopAgentsByNotes(agents, 5);

	// Format data for Recharts
	const data = topAgents.map((agent, idx) => ({
		name: agent.fullName,
		Notes: agent.leadData?.totalNotes || 0,
	}));

	return (
		<Box bg='softGray.100' borderRadius='xl' boxShadow='sm' p={4}>
			<Text fontSize='lg' fontWeight='bold' mb={4}>
				📝 Top Agents by Notes
			</Text>
			<SafeResponsiveChart height={180}>
				<BarChart
					data={data}
					layout='vertical'
					margin={{ left: 2 }}
					barSize='15'
				>
					<XAxis type='number' fontSize='12px' />
					<YAxis dataKey='name' type='category' width={180} fontSize='12px' />
					<Tooltip />
					<Bar dataKey='Notes' fill='#E5B668'>
						{data.map((_, idx) => (
							<Cell key={idx} fill={BRAND_COLORS[idx % BRAND_COLORS.length]} />
						))}
					</Bar>
				</BarChart>
			</SafeResponsiveChart>
		</Box>
	);
};

export default TopAgentsByNotes;
