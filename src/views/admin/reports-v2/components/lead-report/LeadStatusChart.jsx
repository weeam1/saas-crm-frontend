import { Box, Flex, Text, Circle } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getFilteredStats } from './../../helpers';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import PiChart from '../PiChart';
import BarChartComponent from '../BarChart';

const LeadStatusChart = ({ queryParams, view }) => {
	const { data, isLoading, isSuccess } = useFetchItemsQuery(
		{
			path: '/v2/reporting/feedbacks',
			params: { ...queryParams, type: 'leadStatus' },
		},
		{ refetchOnMountOrArgChange: true }
	);

	// const filteredData = data?.doc?.stats
	// 	? getFilteredStats(data?.doc?.stats, view)
	// 	: {};

	// const total = filteredData.reduce((sum, d) => sum + d.value, 0);
	// const processedData = filteredData.map((item) => ({
	// 	...item,
	// 	percent: item.value / total,
	// }));

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

	return isLoading ? (
		<Loader />
	) : (
		processedData && (
			<Box
				// boxShadow='md'
				p='2'
				// bg='white'
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

				{/* <Box>
					<PiChart data={processedData} />
				</Box> */}

				<Box w='100%'>
					<BarChartComponent
						data={processedData}
						containerHeight={250}
						barSize={25}
						layout='vertical'
						showGrid
					/>
				</Box>
				{/* <ResponsiveContainer width={300} height={300}>
				<PieChart>
					<Pie
						data={processedData}
						dataKey='value'
						cx='50%'
						cy='50%'
						innerRadius={50}
						outerRadius={140}
						paddingAngle={1}
						isAnimationActive
					>
						{processedData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.bgColor}
								stroke={entry.textColor}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
				</PieChart>
			</ResponsiveContainer> */}
			</Box>
		)
	);
};

export default LeadStatusChart;
