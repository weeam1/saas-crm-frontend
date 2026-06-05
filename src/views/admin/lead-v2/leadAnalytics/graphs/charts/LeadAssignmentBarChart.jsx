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
			color: '#F59E0B', // Orange for unassigned (warning)
		},
		{
			name: 'Managers',
			value: summary.leadsAssignedToManagers,
			count: summary.leadsAssignedToManagers,
			percentage: (summary.leadsAssignedToManagers / summary.leadCount) * 100,
			color: '#D4AF37', // Gold for managers (premium)
		},
		{
			name: 'Agents',
			value: summary.leadsAssignedToAgents,
			count: summary.leadsAssignedToAgents,
			percentage: (summary.leadsAssignedToAgents / summary.leadCount) * 100,
			color: '#3B82F6', // Blue for agents
		},
	].sort((a, b) => b.value - a.value); // Sort by value descending

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;

			return (
				<Box
					bg='bg.surface'
					p={4}
					borderRadius='lg'
					boxShadow='card'
					border='1px solid'
					borderColor='border.default'
					minWidth='200px'
				>
					<Text fontWeight='bold' color='text.heading' mb={2}>
						{data.name}
					</Text>
					<VStack align='start' spacing={1}>
						<HStack justify='space-between' width='100%'>
							<Text color='text.muted'>Leads:</Text>
							<Text fontWeight='semibold' color='text.heading'>
								{data.count.toLocaleString()}
							</Text>
						</HStack>
						<HStack justify='space-between' width='100%'>
							<Text color='text.muted'>Percentage:</Text>
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
											? 'yellow'
											: 'blue'
								}
								size='sm'
								borderRadius='full'
								bg='bg.input'
							/>
						</Box>
					</VStack>
				</Box>
			);
		}
		return null;
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
					stroke='#1A3550' // navy.700
				/>
				<XAxis
					type='number'
					axisLine={true}
					tickLine={false}
					tick={{ fill: '#B0B0B0', fontSize: 12 }} // text.muted
					domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
				/>
				<YAxis
					type='category'
					dataKey='name'
					axisLine={false}
					tickLine={false}
					tick={{
						fill: '#FFFFFF', // text.heading
						fontSize: isFullScreen ? 14 : 12,
						fontWeight: 'medium'
					}}
					width={80}
				/>
				<Tooltip
					content={<CustomTooltip />}
					cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }} // Gold tint
				/>
				<Bar
					dataKey='value'
					radius={[0, 4, 4, 0]}
					barSize={isFullScreen ? 40 : 30}
					animationDuration={1500}
				>
					{assignmentData.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={entry.color}
							opacity={0.8}
							stroke={entry.name === 'Managers' ? '#C9A227' : 'transparent'}
							strokeWidth={entry.name === 'Managers' ? 1 : 0}
						/>
					))}
					<LabelList
						dataKey='value'
						position='right'
						fill='#FFFFFF' // text.heading
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