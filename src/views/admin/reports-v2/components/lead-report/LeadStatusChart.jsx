import { Box, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { getFilteredStats } from './../../helpers';
import NoData from 'components/Message/NoData';
import StatusBarChart from '../StatusBarChart';

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
			<Text
				fontSize='sm'
				textAlign='center'
				color='gray.600'
				fontWeight='bold'
				mb='2'
			>
				Leads Status
			</Text>

			<Box w='100%'>
				{processedData?.length > 0 ? (
					<StatusBarChart
						data={processedData}
						containerHeight={350}
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
