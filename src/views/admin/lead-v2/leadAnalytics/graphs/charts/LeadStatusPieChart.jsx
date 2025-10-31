// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// import { Box, Text, VStack, HStack } from '@chakra-ui/react';

// const LeadStatusPieChart = ({ summary, isFullScreen }) => {
// 	const leadStatusData = [
// 		{
// 			name: 'Interested',
// 			value: summary.interestedLeads,
// 			count: summary.interestedLeads,
// 		},
// 		{
// 			name: 'Not Interested',
// 			value: summary.notInterestedLeads,
// 			count: summary.notInterestedLeads,
// 		},
// 		{
// 			name: 'Released',
// 			value: summary.releasedLeads,
// 			count: summary.releasedLeads,
// 		},
// 		{
// 			name: 'Other Leads',
// 			value:
// 				summary.leadCount -
// 				summary.interestedLeads -
// 				summary.notInterestedLeads -
// 				summary.releasedLeads,
// 			count:
// 				summary.leadCount -
// 				summary.interestedLeads -
// 				summary.notInterestedLeads -
// 				summary.releasedLeads,
// 		},
// 	];

// 	const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6B7280'];
// 	const TOTAL_LEADS = summary.leadCount;

// 	const CustomTooltip = ({ active, payload }) => {
// 		if (active && payload && payload.length) {
// 			const data = payload[0].payload;
// 			const percentage = ((data.count / TOTAL_LEADS) * 100).toFixed(1);

// 			return (
// 				<Box
// 					bg='white'
// 					p={3}
// 					borderRadius='md'
// 					boxShadow='lg'
// 					border='1px solid'
// 					borderColor='gray.200'
// 				>
// 					<Text fontWeight='bold' color='gray.700'>
// 						{data.name}
// 					</Text>
// 					<HStack spacing={2}>
// 						<Text color='gray.600'>Count:</Text>
// 						<Text fontWeight='semibold'>{data.count.toLocaleString()}</Text>
// 					</HStack>
// 					<HStack spacing={2}>
// 						<Text color='gray.600'>Percentage:</Text>
// 						<Text
// 							fontWeight='semibold'
// 							color={
// 								COLORS[leadStatusData.findIndex((d) => d.name === data.name)]
// 							}
// 						>
// 							{percentage}%
// 						</Text>
// 					</HStack>
// 				</Box>
// 			);
// 		}
// 		return null;
// 	};

// 	return (
// 		<ResponsiveContainer width='100%' height='100%'>
// 			<PieChart>
// 				<Pie
// 					data={leadStatusData}
// 					cx='50%'
// 					cy='50%'
// 					innerRadius={0}
// 					outerRadius={isFullScreen ? 100 : 80}
// 					paddingAngle={2}
// 					dataKey='value'
// 					label={({ name, percent }) =>
// 						`${name} (${(percent * 100).toFixed(1)}%)`
// 					}
// 					fontSize='12px'
// 					labelLine={false}
// 					offset={2}
// 				>
// 					{leadStatusData.map((entry, index) => (
// 						<Cell
// 							key={`cell-${index}`}
// 							fill={COLORS[index % COLORS.length]}
// 							stroke='white'
// 							strokeWidth={2}
// 						/>
// 					))}
// 				</Pie>
// 				<Tooltip content={<CustomTooltip />} />
// 			</PieChart>
// 		</ResponsiveContainer>
// 	);
// };

// export default LeadStatusPieChart;

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

	const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6B7280'];
	const TOTAL_LEADS = summary.leadCount;

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			const percentage = ((data.value / TOTAL_LEADS) * 100).toFixed(1);

			return (
				<Box
					bg='white'
					p={3}
					borderRadius='md'
					boxShadow='lg'
					border='1px solid'
					borderColor='gray.200'
				>
					<Text fontWeight='bold' color='gray.700'>
						{data.name}
					</Text>
					<HStack spacing={2}>
						<Text color='gray.600'>Count:</Text>
						<Text fontWeight='semibold'>{data.value.toLocaleString()}</Text>
					</HStack>
					<HStack spacing={2}>
						<Text color='gray.600'>Percentage:</Text>
						<Text
							fontWeight='semibold'
							color={
								COLORS[leadStatusData.findIndex((d) => d.name === data.name)]
							}
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
					return (
						<HStack key={item.name} spacing={1}>
							<Circle size='8px' bg={COLORS[i]} />
							<Text fontSize='10px' color='gray.700' fontWeight='normal'>
								{item.name}:
							</Text>
							<Text fontSize='10px' fontWeight='semibold' color={COLORS[i]}>
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
						// label={({ name, percent }) =>
						// 	`${name} (${(percent * 100).toFixed(1)}%)`
						// }
						fontSize='12px'
						labelLine={false}
						offset={2}
					>
						{leadStatusData.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
								stroke='white'
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
