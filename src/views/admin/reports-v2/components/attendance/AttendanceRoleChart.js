import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	LabelList,
	Cell,
} from 'recharts';
import { Box, HStack, Text } from '@chakra-ui/react';
import NoData from 'components/Message/NoData';

const AttendanceRoleChart = ({ data }) => {
	const chartData = (data?.roleNames || []).map((name, i) => ({
		name,
		value: data?.roleCounts?.[i] ?? 0,
	}));

	const colors = ['#D99A36'];

	const CustomTooltip = ({ active, payload, label }) => {
		if (!active || !payload?.length) return null;
		return (
			<Box
				bg='white'
				p={3}
				rounded='md'
				shadow='lg'
				border='1px solid'
				borderColor='gray.200'
				minWidth='160px'
			>
				<Text fontWeight='semibold'>{label}</Text>
				<HStack>
					<Text fontSize='sm' color='gray.600'>
						Count:
					</Text>
					<Text fontSize='md' color='blue.400'>
						{payload[0].value}
					</Text>
				</HStack>
			</Box>
		);
	};

	return (
		<Box>
			<Text
				fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
				color='gray.700'
				fontWeight='bold'
			>
				Weekly Attendance
			</Text>

			{chartData?.length > 0 ? (
				<ResponsiveContainer width='100%' height={300}>
					<BarChart
						data={chartData}
						margin={{ top: 20, right: 20, bottom: 40, left: 0 }}
						barSize={40}
					>
						<CartesianGrid
							strokeDasharray='3 3'
							vertical={false}
							stroke='#e2e8f0'
						/>
						<XAxis
							dataKey='name'
							axisLine={true}
							tickLine={false}
							tick={{ fill: '#4a5568', fontSize: 14 }}
						/>
						<YAxis
							// tickFormatter={(val) => `${Math.round(val)}`}
							axisLine={true}
							tickLine={false}
							tick={{ fill: '#4a5568', fontSize: 12 }}
						/>
						<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
						<Bar dataKey='value' radius={[4, 4, 0, 0]}>
							{chartData.map((_, i) => (
								<Cell key={i} fill={colors[i % colors.length]} />
							))}
							<LabelList
								dataKey='value'
								position='top'
								// formatter={(val) => `${val}`}
								fill='#2d3748'
								fontSize={14}
								fontWeight={500}
							/>
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			) : (
				<Box p='4'>
					<NoData label='weekly attendance record' />
					{/* <Text fontSize='md' color='gray.500' textAlign='center'>
						no attendance record found in this week
					</Text> */}
				</Box>
			)}
		</Box>
	);
};

export default AttendanceRoleChart;
