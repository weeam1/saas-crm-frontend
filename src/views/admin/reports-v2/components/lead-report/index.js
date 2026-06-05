import { Box } from '@chakra-ui/react';
import LeadsCharts from './LeadCharts';
import LeadFeedbacks from './LeadFeedbacks';
import TeamList from './Teams';
import { useModalColors } from 'hooks/useModalColors';

const LeadReport = () => {
	const colors = useModalColors();

	return (
		<Box p='2' mb='4' bg={colors.bgDeep}>
			{/* Leads Charts */}
			<LeadsCharts />

			{/* Leads Feedbacks */}
			<LeadFeedbacks />

			{/* Manager (Team filter) > sort all agents data under Manager */}
			<TeamList />
		</Box>
	);
};

export default LeadReport;