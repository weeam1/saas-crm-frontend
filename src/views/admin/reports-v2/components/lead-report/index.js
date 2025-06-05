import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import LeadsCharts from './LeadCharts';
import LeadFeedbacks from './LeadFeedbacks';
// import Loader from 'components/loading/Loader';
import TeamList from './Teams';

const LeadReport = () => {
	return (
		<Box p='2' mb='4'>
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
