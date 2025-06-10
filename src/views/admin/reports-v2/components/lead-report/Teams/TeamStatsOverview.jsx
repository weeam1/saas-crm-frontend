import {
	FiCheckCircle,
	FiFileText,
	FiTrendingUp,
	FiUsers,
} from 'react-icons/fi';
import { StatCard } from '../../StatCard';

export const TeamStatsOverview = ({ data }) => (
	<>
		<StatCard
			title='Total Leads'
			value={data?.totalLeads}
			icon={FiTrendingUp}
			colorScheme='brand'
		/>
		<StatCard
			title='Team Agents'
			value={data?.totalAgents}
			icon={FiUsers}
			colorScheme='green'
		/>

		<StatCard
			title='Closed Deals'
			value={data?.totalClosedDeals}
			icon={FiCheckCircle}
			colorScheme='red'
		/>

		<StatCard
			title='Total Notes'
			value={data?.totalNotes}
			icon={FiFileText}
			colorScheme='blue'
		/>
	</>
);
