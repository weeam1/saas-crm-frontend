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
			<Text fontSize='lg' color='gray.800' fontWeight='bold' mb='8'>
				Weekly Attendance
			</Text>
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
		</Box>
	);
};

export default AttendanceRoleChart;
