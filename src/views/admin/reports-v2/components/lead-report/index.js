import { Box } from '@chakra-ui/react';
import LeadsCharts from './LeadCharts';
import LeadFeedbacks from './LeadFeedbacks';
import TeamList from './Teams';
// import LeadsHistoryByYear from './LeadsHistoryByYear';

const LeadReport = () => {
	return (
		<Box p='2' mb='4'>
			{/* <LeadsHistoryByYear /> */}

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
