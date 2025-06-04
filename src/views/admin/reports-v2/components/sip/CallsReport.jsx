import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { FaClock, FaPhoneAlt, FaHourglassHalf } from 'react-icons/fa';
import {
	Box,
	Flex,
	Text,
	useColorModeValue,
	SimpleGrid,
} from '@chakra-ui/react';
import {
	Bar,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
	CartesianGrid,
	ComposedChart,
} from 'recharts';
import { fetchTotalTimeCallsRecordStats } from 'services/sip/index';

import TopFilter from '../TopFilter';
import { dayOptions } from '../../helpers';
import { StatCard } from '../StatCard';

const formatSeconds = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	return `${hrs > 0 ? `${hrs} hrs ` : ''}${mins} min${secs > 0 ? ` ${secs}s` : ''}`;
};

const CustomTooltip = ({ active, payload, label }) => {
	if (!active || !payload || payload.length === 0) return null;
	return (
		<Box bg='white' p={4} rounded='md' shadow='md' border='1px solid #e2e8f0'>
			<Text fontWeight='bold'>{label}</Text>
			{payload.map((entry, index) => (
				<Text key={index} color={entry.color} fontSize='sm'>
					{entry.name}: {Math.round(entry.value)}
				</Text>
			))}
		</Box>
	);
};

const CallsReport = () => {
	const [days, setDays] = useState(30);
	const [uniqueCalls, setUniqueCalls] = useState(0);
	const [avgMinutes, setAvgMinutes] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);
	const [chartData, setChartData] = useState([]);

	const bgColor = useColorModeValue('white', 'gray.800');

	useEffect(() => {
		const getData = async () => {
			try {
				const data = await fetchTotalTimeCallsRecordStats(days);
				setUniqueCalls(data.unique_calls);
				setAvgMinutes(data.average_minutes);
				const durationInSeconds = parseFloat(
					data.allTime.duration.replace('s', '')
				);
				setTotalSeconds(durationInSeconds);

				const transformedData = data.daily.map((d) => ({
					date: moment(d.date).format('MMM D'),
					totalTime: parseFloat(d.duration.replace('s', '')) / 60,
					uniqueCalls: d.joinedCount,
				}));

				setChartData(transformedData);
			} catch (error) {
				console.error('Error loading chart data:', error);
			}
		};

		getData();
	}, [days]);

	const statusData = useMemo(
		() => [
			{
				label: 'Total Time',
				valueKey: 'totalTime',
				icon: FaClock,
				color: 'blue',
				value: formatSeconds(totalSeconds),
			},
			{
				label: 'Unique Calls',
				valueKey: 'uniqueCalls',
				icon: FaPhoneAlt,
				color: 'green',
				value: uniqueCalls,
			},
			{
				label: 'Avg Call Duration',
				valueKey: 'avgCallDuration',
				icon: FaHourglassHalf,
				color: 'purple',
				value: formatSeconds(avgMinutes * 60),
			},
		],
		[totalSeconds, uniqueCalls, avgMinutes]
	);

	return (
		<Box p={8} bg={bgColor} rounded='md' shadow='sm'>
			<Flex justify='space-between' align='center' mb={8}>
				<Text fontSize='2xl' fontWeight='bold'>
					Calls Report
				</Text>

				<TopFilter view={days} setView={setDays} options={dayOptions} />
			</Flex>

			<SimpleGrid
				px='6'
				py='2'
				columns={{ base: 1, sm: 1, md: 3 }}
				spacing={6}
				width='100%'
			>
				{statusData.map((item, index) => (
					<StatCard
						key={index}
						title={item.label}
						value={item.value}
						icon={item.icon}
						colorScheme={item.color}
					/>
				))}
			</SimpleGrid>

			<Box h='450px' w='100%'>
				<ResponsiveContainer width='100%' height='100%'>
					<ComposedChart
						data={chartData}
						margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray='3 3' stroke='#e2e8f0' />
						<XAxis
							dataKey='date'
							angle={-30}
							fontSize='12px'
							textAnchor='end'
							height={60}
							tick={{ fill: '#4a5568' }}
						/>
						<YAxis yAxisId='left' fontSize='12px' tick={{ fill: '#4a5568' }} />
						<YAxis
							yAxisId='right'
							fontSize='12px'
							orientation='right'
							tick={{ fill: '#4a5568' }}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Bar
							yAxisId='left'
							dataKey='totalTime'
							fill='#4299E1'
							name='Total Time (min)'
							barSize={25}
							radius={[4, 4, 0, 0]}
							animationDuration={1500}
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='uniqueCalls'
							stroke='#38A169'
							name='Unique Calls'
							strokeWidth={2}
							dot={true}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

export default CallsReport;
