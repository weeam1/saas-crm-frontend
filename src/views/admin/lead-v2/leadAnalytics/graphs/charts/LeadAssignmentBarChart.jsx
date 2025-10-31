import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
	LabelList,
} from 'recharts';
import { Box, Text, VStack, HStack, Progress } from '@chakra-ui/react';

const LeadAssignmentBarChart = ({ summary, isFullScreen }) => {
	const assignmentData = [
		{
			name: 'Unassigned',
			value: summary.unassignedLeads,
			count: summary.unassignedLeads,
			percentage: (summary.unassignedLeads / summary.leadCount) * 100,
			color: '#F59E0B',
		},
		{
			name: 'Managers',
			value: summary.leadsAssignedToManagers,
			count: summary.leadsAssignedToManagers,
			percentage: (summary.leadsAssignedToManagers / summary.leadCount) * 100,
			color: '#8B5CF6',
		},
		{
			name: 'Agents',
			value: summary.leadsAssignedToAgents,
			count: summary.leadsAssignedToAgents,
			percentage: (summary.leadsAssignedToAgents / summary.leadCount) * 100,
			color: '#3B82F6',
		},
	].sort((a, b) => b.value - a.value); // Sort by value descending

	const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6'];

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;

			return (
				<Box
					bg='white'
					p={4}
					borderRadius='md'
					boxShadow='xl'
					border='1px solid'
					borderColor='gray.200'
					minWidth='200px'
				>
					<Text fontWeight='bold' color='gray.800' mb={2}>
						{data.name}
					</Text>
					<VStack align='start' spacing={1}>
						<HStack justify='space-between' width='100%'>
							<Text color='gray.600'>Leads:</Text>
							<Text fontWeight='semibold'>{data.count.toLocaleString()}</Text>
						</HStack>
						<HStack justify='space-between' width='100%'>
							<Text color='gray.600'>Percentage:</Text>
							<Text fontWeight='semibold' color={data.color}>
								{data.percentage.toFixed(1)}%
							</Text>
						</HStack>
						<Box width='100%' mt={2}>
							<Progress
								w='100%'
								value={data.percentage}
								colorScheme={
									data.name === 'Unassigned'
										? 'orange'
										: data.name === 'Managers'
											? 'purple'
											: 'blue'
								}
								size='sm'
								borderRadius='full'
							/>
						</Box>
					</VStack>
				</Box>
			);
		}
		return null;
	};

	const CustomBarLabel = ({ x, y, width, height, value }) => {
		return (
			<text
				x={x + width + 10}
				y={y + height / 2}
				fill='currentColor'
				textAnchor='start'
				dominantBaseline='middle'
				fontSize={isFullScreen ? 14 : 12}
				fontWeight='medium'
			>
				{value.toLocaleString()}
			</text>
		);
	};

	return (
		<ResponsiveContainer width='100%' height='100%'>
			<BarChart
				data={assignmentData}
				layout='vertical'
				margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
			>
				<CartesianGrid
					strokeDasharray='3 3'
					horizontal={false}
					// stroke='#e2e8f0'
				/>
				<XAxis
					type='number'
					// hide
					axisLine={true}
					tickLine={false}
					tick={{ fill: '#4a5568', fontSize: 12 }}
					domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
				/>
				<YAxis
					type='category'
					dataKey='name'
					axisLine={false}
					tickLine={false}
					tick={{ fontSize: isFullScreen ? 14 : 12, fontWeight: 'medium' }}
					width={80}
				/>
				<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
				<Bar
					dataKey='value'
					radius={[0, 4, 4, 0]}
					barSize={isFullScreen ? 40 : 30}
					// label={<CustomBarLabel />}
					animationDuration={1500}
				>
					{assignmentData.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={entry.color}
							opacity={0.8}
							_hover={{ opacity: 1 }}
						/>
					))}
					<LabelList
						dataKey={'value'}
						position='top'
						fill='#2d3748'
						// fontSize={12}
						textAnchor='start'
						dominantBaseline='middle'
						offset={10}
						fontWeight={500}
						fontSize={isFullScreen ? 14 : 12}
					/>
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default LeadAssignmentBarChart;
