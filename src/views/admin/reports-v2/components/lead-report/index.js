import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import LeadsCharts from './LeadCharts';
import LeadFeedbacks from './LeadFeedbacks';
import Loader from 'components/loading/Loader';
import TeamList from './Teams';

const LeadReport = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000); // 2 seconds

		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return (
			<Flex justify='center' align='center' height='300px'>
				<Loader />
			</Flex>
		);
	}

	return (
		<Box p={4}>
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
