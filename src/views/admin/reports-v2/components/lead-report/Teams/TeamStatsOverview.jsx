import {
	FiCheckCircle,
	FiFileText,
	FiTrendingUp,
	FiUsers,
} from 'react-icons/fi';
import { StatCard } from '../../StatCard';
import { formatCurrency } from 'utils/helpers';
import { FaBullseye } from 'react-icons/fa6';
import { FaMoneyBillWave } from 'react-icons/fa';

export const TeamStatsOverview = ({ data }) => (
	<>
		<StatCard
			title='Total Leads'
			value={data?.totalLeads}
			icon={FiTrendingUp}
			colorScheme='blue'
		/>
		<StatCard
			title='Team Agents'
			value={data?.totalAgents}
			icon={FiUsers}
			colorScheme='teal'
		/>
		<StatCard
			title='Total Notes'
			value={data?.totalNotes}
			icon={FiFileText}
			colorScheme='purple'
		/>
		{/* Manager Sales report - More vibrant colors for key metrics */}
		<StatCard
			title='Closed Deals'
			value={data?.salesReport?.totalDeals}
			icon={FiTrendingUp}
			colorScheme='green'
		/>
		<StatCard
			title='Sales Targets'
			value={formatCurrency(data?.salesReport?.totalTarget)}
			icon={FaBullseye}
			colorScheme='orange' // Warning orange for targets
		/>
		<StatCard
			title='Total Sales'
			value={formatCurrency(data?.salesReport?.totalSales)}
			icon={FaMoneyBillWave}
			colorScheme='cyan'
		/>
	</>
);
