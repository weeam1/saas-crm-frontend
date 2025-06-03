import { Box, Flex, Text, Circle } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import './../../styles/leadStatus.css';
import PiChart from '../PiChart';
import { getFilteredStats } from './../../helpers';
import ActiveShapePieChart from '../ActiveShapePieChart';
import NoData from 'components/Message/NoData';

const LeadMainStatusChart = ({ data, view }) => {
	const [processedData, setProcessedData] = useState([]);

	useEffect(() => {
		if (data) {
			const filteredData = getFilteredStats(data, view);
			const total = filteredData.reduce((sum, d) => sum + d.value, 0);
			const calculatedData = filteredData.map((item) => ({
				...item,
				percent: total > 0 ? item.value / total : 0,
			}));
			setProcessedData(calculatedData);
		}
	}, [data, view]);

	return (
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
			{processedData?.length > 0 ? (
				<ActiveShapePieChart data={processedData} />
			) : (
				<NoData label='lead M status' />
			)}
		</Box>
	);
};

export default LeadMainStatusChart;
