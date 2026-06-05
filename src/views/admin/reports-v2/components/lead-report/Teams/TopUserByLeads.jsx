import { Box, Text } from '@chakra-ui/react';

import { getTopAgentsByLeads } from 'views/admin/reports-v2/helpers';
import HorizontalSummaryChart from './HorizontalSummaryChart';

const TopUserByLeads = ({ title = 'Top Users', users }) => {
	const topUsers = getTopAgentsByLeads(users, 5);

	// Format data for Recharts
	const data = topUsers
		.filter((item) => item.leadData?.totalLeads !== 0)
		.map((user, idx) => ({
			name: user.fullName,
			Leads: user.leadData?.totalLeads || 0,
		}));

	return (
		<Box bg='gray.100' borderRadius='xl' boxShadow='sm' p={4}>
			<Text fontSize='lg' fontWeight='bold' mb={4}>
				{title}
			</Text>
			<HorizontalSummaryChart data={data} type='Leads' />
			{/* <ResponsiveContainer width='99%' height={250}>
				<BarChart
					data={data}
					layout='vertical'
					margin={{ left: 2 }}
					barSize={18}
				>
					<XAxis type='number' fontSize='12px' />
					<YAxis dataKey='name' type='category' width={150} fontSize='12px' />
					<Tooltip />
					<Bar dataKey='Leads' fill='#E5B668'>
						{data.map((_, idx) => (
							<Cell key={idx} fill={BRAND_COLORS[idx % BRAND_COLORS.length]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer> */}
		</Box>
	);
};

export default TopUserByLeads;
