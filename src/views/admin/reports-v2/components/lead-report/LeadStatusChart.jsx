import { Box, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getFilteredStats } from './../../helpers';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import BarChartComponent from '../BarChart';
import NoData from 'components/Message/NoData';

const LeadStatusChart = ({ data, queryParams, view }) => {
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

	console.log(processedData);

	return (
		<Box
			p='2'
			width='full'
			textAlign='center'
			display='flex'
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
		>
			<Text fontWeight='bold' mb={8}>
				Leads Status
			</Text>

			<Box w='100%'>
				{processedData?.length > 0 ? (
					<BarChartComponent
						data={processedData}
						containerHeight={250}
						barSize={25}
						layout='vertical'
						showGrid
					/>
				) : (
					<NoData label='leads status' />
				)}
			</Box>
		</Box>
	);
};

export default LeadStatusChart;
