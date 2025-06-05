import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

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
			flexDirection='column'
			alignItems='center'
			justifyContent='center'
		>
			<Text
				fontSize='sm'
				textAlign='center'
				color='gray.600'
				fontWeight='bold'
				mb='8'
			>
				Leads Main Status
			</Text>
			{processedData?.length > 0 ? (
				<ActiveShapePieChart data={processedData} />
			) : (
				<NoData label='lead M status' />
			)}
		</Box>
	);
};

export default LeadMainStatusChart;
