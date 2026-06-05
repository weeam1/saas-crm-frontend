import { Box, HStack, VStack, Text, Circle } from '@chakra-ui/react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';

const LeadStatusPieChart = ({ summary, isFullScreen }) => {
	const leadStatusData = [
		{ name: 'Interested', value: summary.interestedLeads },
		{ name: 'Not Interested', value: summary.notInterestedLeads },
		{ name: 'Released', value: summary.releasedLeads },
		{
			name: 'Other Leads',
			value:
				summary.leadCount -
				summary.interestedLeads -
				summary.notInterestedLeads -
				summary.releasedLeads,
		},
	];

	// Theme-aligned colors
	const COLORS = {
		Interested: '#10B981', // green.500
		'Not Interested': '#EE5D50', // red.500
		Released: '#D4AF37', // gold.primary
		'Other Leads': '#4A7BA3', // navy.300
	};

	const TOTAL_LEADS = summary.leadCount;

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			const percentage = ((data.value / TOTAL_LEADS) * 100).toFixed(1);
			const color = COLORS[data.name];

			return (
				<Box
					bg='bg.surface'
					p={3}
					borderRadius='lg'
					boxShadow='card'
					border='1px solid'
					borderColor='border.default'
				>
					<Text fontWeight='bold' color='text.heading' mb={2}>
						{data.name}
					</Text>
					<HStack spacing={2} mb={1}>
						<Text color='text.muted' fontSize='sm'>Count:</Text>
						<Text fontWeight='semibold' color='text.heading' fontSize='sm'>
							{data.value.toLocaleString()}
						</Text>
					</HStack>
					<HStack spacing={2}>
						<Text color='text.muted' fontSize='sm'>Percentage:</Text>
						<Text
							fontWeight='semibold'
							color={color}
							fontSize='sm'
						>
							{percentage}%
						</Text>
					</HStack>
				</Box>
			);
		}
		return null;
	};

	return (
		<HStack
			w='100%'
			h='100%'
			flexDir={{ base: 'column', md: 'row' }}
			align='center'
			justify='center'
			spacing={2}
		>
			{/* Left Summary */}
			<VStack align='start' spacing={1} p='2' minW='170px'>
				{leadStatusData.map((item, i) => {
					const percentage = ((item.value / TOTAL_LEADS) * 100).toFixed(1);
					const color = COLORS[item.name];
					return (
						<HStack key={item.name} spacing={1}>
							<Circle size='8px' bg={color} />
							<Text fontSize='10px' color='text.muted' fontWeight='normal'>
								{item.name}:
							</Text>
							<Text fontSize='10px' fontWeight='semibold' color={color}>
								{percentage}%
							</Text>
						</HStack>
					);
				})}
			</VStack>

			{/* Pie Chart */}
			<ResponsiveContainer width='80%' height={isFullScreen ? '80%' : '70%'}>
				<PieChart>
					<Pie
						data={leadStatusData}
						cx='50%'
						cy='50%'
						innerRadius={0}
						outerRadius={isFullScreen ? 150 : 85}
						paddingAngle={2}
						dataKey='value'
						fontSize='12px'
						labelLine={false}
						offset={2}
					>
						{leadStatusData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[entry.name]}
								stroke='bg.surface'
								strokeWidth={2}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
				</PieChart>
			</ResponsiveContainer>
		</HStack>
	);
};

export default LeadStatusPieChart;