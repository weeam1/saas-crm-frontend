import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { FaClock, FaPhoneAlt, FaHourglassHalf } from 'react-icons/fa';
import {
	Box,
	Flex,
	Text,
	SimpleGrid,
	HStack,
	VStack,
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
import RefButton from '../RefButton';
import { useLocation } from 'react-router-dom';
import CardShimmer from 'components/loading/CardShimmer';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const formatSeconds = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);
	return `${hrs > 0 ? `${hrs} hrs ` : ''}${mins} min${secs > 0 ? ` ${secs}s` : ''}`;
};

const CustomTooltip = ({ active, payload, label }) => {
	const colors = useModalColors();
	if (!active || !payload || payload.length === 0) return null;
	return (
		<Box bg={colors.bg} p={4} rounded='md' shadow={colors.modalShadow} border={`1px solid ${colors.borderColor}`}>
			<Text fontWeight='bold' color={colors.headingText}>{label}</Text>
			{payload.map((entry, index) => (
				<Text key={index} color={entry.color} fontSize='sm'>
					{entry.name}: {Math.round(entry.value)}
				</Text>
			))}
		</Box>
	);
};

const CallsReport = () => {
	const colors = useModalColors();
	const [days, setDays] = useState(30);
	const [uniqueCalls, setUniqueCalls] = useState(0);
	const [avgMinutes, setAvgMinutes] = useState(0);
	const [totalSeconds, setTotalSeconds] = useState(0);
	const [chartData, setChartData] = useState([]);
	const [loading, setLoading] = useState(false);

	const { hasPermission } = usePermissions();
	const location = useLocation();

	useEffect(() => {
		const getData = async () => {
			try {
				setLoading(true);
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
			} finally {
				setLoading(false);
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
				color: colors.accentGold,
				value: formatSeconds(totalSeconds),
			},
			{
				label: 'Unique Calls',
				valueKey: 'uniqueCalls',
				icon: FaPhoneAlt,
				color: colors.accentGold,
				value: uniqueCalls,
			},
			{
				label: 'Avg Call Duration',
				valueKey: 'avgCallDuration',
				icon: FaHourglassHalf,
				color: colors.accentGold,
				value: formatSeconds(avgMinutes * 60),
			},
		],
		[totalSeconds, uniqueCalls, avgMinutes, colors]
	);

	return (
		<Box p={6} bg={colors.bg} rounded='md' shadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
			<Flex justify='space-between' align='center' mb={8}>
				<HStack>
					<Text
						fontSize={{ base: 'md', md: 'xl', lg: '2xl' }}
						fontWeight='bold'
						color={colors.headingText}
					>
						Call Stats
					</Text>
					{hasPermission('reports', 'link') &&
						hasPermission('sip') &&
						location?.pathname !== '/sip' && (
							<RefButton to='/sip' label='Call Logs Module' />
						)}
				</HStack>

				<TopFilter view={days} setView={setDays} options={dayOptions} />
			</Flex>

			{loading ? (
				<VStack gap='2'>
					<CardShimmer
						count={3}
						height='150px'
						columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 3, '2xl': 3 }}
					/>
					<CardShimmer
						count={1}
						height='400px'
						columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, '2xl': 1 }}
					/>
				</VStack>
			) : (
				<>
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
								<CartesianGrid strokeDasharray='3 3' stroke={colors.borderColor} />
								<XAxis
									dataKey='date'
									angle={-30}
									textAnchor='end'
									height={60}
									axisLine={{ stroke: colors.borderColor }}
									tickLine={false}
									tick={{ fill: colors.bodyText, fontSize: 12 }}
								/>
								<YAxis
									yAxisId='left'
									axisLine={{ stroke: colors.borderColor }}
									tickLine={false}
									tick={{ fill: colors.bodyText, fontSize: 12 }}
								/>
								<YAxis
									yAxisId='right'
									axisLine={{ stroke: colors.borderColor }}
									tickLine={false}
									orientation='right'
									tick={{ fill: colors.bodyText, fontSize: 12 }}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Legend
									wrapperStyle={{ color: colors.bodyText }}
									formatter={(value) => <span style={{ color: colors.bodyText }}>{value}</span>}
								/>
								<Bar
									yAxisId='left'
									dataKey='totalTime'
									fill={colors.accentGold}
									name='Total Time (min)'
									barSize={25}
									radius={[4, 4, 0, 0]}
									animationDuration={1500}
								/>
								<Line
									yAxisId='right'
									type='monotone'
									dataKey='uniqueCalls'
									stroke={colors.accentGold}
									name='Unique Calls'
									strokeWidth={2}
									dot={{ fill: colors.accentGold, stroke: colors.accentGold }}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</Box>
				</>
			)}
		</Box>
	);
};

export default CallsReport;