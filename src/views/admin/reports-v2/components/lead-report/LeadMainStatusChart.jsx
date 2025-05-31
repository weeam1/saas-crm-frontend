import { Box, Flex, Text, Circle } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import './../../styles/leadStatus.css';
import PiChart from '../PiChart';
import { getFilteredStats } from './../../helpers';
import ActiveShapePieChart from '../ActiveShapePieChart';

const LeadMainStatusChart = ({ queryParams, view }) => {
	const { data, isLoading, isSuccess } = useFetchItemsQuery(
		{
			path: '/v2/reporting/feedbacks',
			params: { ...queryParams, type: 'mainStatus' },
		},
		{ refetchOnMountOrArgChange: true }
	);

	const [processedData, setProcessedData] = useState([]);

	useEffect(() => {
		if (isSuccess && data?.doc?.stats) {
			const filteredData = getFilteredStats(data.doc.stats, view);
			const total = filteredData.reduce((sum, d) => sum + d.value, 0);
			const calculatedData = filteredData.map((item) => ({
				...item,
				percent: total > 0 ? item.value / total : 0,
			}));
			setProcessedData(calculatedData);
		}
	}, [data, isSuccess, view]);

	console.log(processedData);

	return isLoading ? (
		<Loader />
	) : (
		processedData && (
			<Box
				width='full'
				p='2'
				textAlign='center'
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
			>
				<Text fontWeight='bold'>Leads Main Status</Text>

				<ActiveShapePieChart data={processedData} />
			</Box>
		)
	);
};

export default LeadMainStatusChart;
