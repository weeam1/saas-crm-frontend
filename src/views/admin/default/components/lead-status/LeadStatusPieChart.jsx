import {
	Box,
	Flex,
	Select,
	VStack,
	Text,
	Circle,
	HStack,
	Grid,
	Tabs,
	TabList,
	Tab,
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const getFilteredStats = (stats, type) => {
	const filtered = stats.filter((stat) => stat.value > 0); // Exclude zero values
	const sorted = [...filtered].sort((a, b) => b.value - a.value);
	// const sorted = [...stats].sort((a, b) => b.value - a.value);

	switch (type) {
		case 'top5':
			return sorted.slice(0, 5);
		case 'top10':
			return sorted.slice(0, 10);
		default:
			return sorted;
	}
};

// const CustomTooltip = ({ active, payload }) => {
// 	if (active && payload && payload.length) {
// 		const { label, value, percent } = payload[0].payload;
// 		return (
// 			<Box bg='white' p={3} borderRadius='md' boxShadow='md'>
// 				<Text fontWeight='bold'>{label}</Text>
// 				<Text>Leads: {value}</Text>
// 				<Text>Percent: {(percent * 100).toFixed(1)}%</Text>
// 			</Box>
// 		);
// 	}
// 	return null;
// };

// const LeadStatusPieChart = ({ data }) => {
// 	const [view, setView] = useState('top5');

// 	const filteredData = getFilteredStats(data.leadStatusStats, view);

// 	const total = filteredData.reduce((sum, d) => sum + d.value, 0);
// 	const processedData = filteredData.map((item) => ({
// 		...item,
// 		percent: item.value / total,
// 	}));

// 	return (
// 		<Box>
// 			<Select
// 				w='200px'
// 				mb={4}
// 				onChange={(e) => setView(e.target.value)}
// 				value={view}
// 			>
// 				<option value='top5'>Top 5</option>
// 				<option value='top10'>Top 10</option>
// 				<option value='all'>All</option>
// 			</Select>

// 			<Flex gap={8} align='center'>
// 				{/* Label List */}
// 				<Grid templateColumns='1fr 1fr'>
// 					{processedData.map((item, idx) => (
// 						<HStack key={idx}>
// 							<Circle size='12px' bg={item.bgColor} />
// 							<Text fontSize='sm' color='gray.700'>
// 								{item.label} {item.value}
// 							</Text>
// 						</HStack>
// 					))}
// 				</Grid>

// 				{/* Pie Chart */}
// 				<ResponsiveContainer width={300} height={300}>
// 					<PieChart>
// 						<Pie
// 							data={processedData}
// 							dataKey='value'
// 							cx='50%'
// 							cy='50%'
// 							innerRadius={80}
// 							outerRadius={120}
// 							paddingAngle={2}
// 							isAnimationActive
// 						>
// 							{processedData.map((entry, index) => (
// 								<Cell
// 									key={`cell-${index}`}
// 									fill={entry.bgColor}
// 									stroke={entry.textColor}
// 								/>
// 							))}
// 						</Pie>
// 						<Tooltip content={<CustomTooltip />} />
// 					</PieChart>
// 				</ResponsiveContainer>
// 			</Flex>
// 		</Box>
// 	);
// };

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		const item = payload[0].payload;
		return (
			<Box bg='white' p={3} rounded='md' shadow='md' border='1px solid #e2e8f0'>
				<Flex align='center' gap={2}>
					<Circle size='12px' bg={item.bgColor} />
					<Text fontWeight='bold' fontSize='sm' color={item.textColor}>
						{item.label}
					</Text>
				</Flex>
				<Text fontSize='sm' color='gray.600'>
					{item.value} leads ({(item.percent * 100).toFixed(1)}%)
				</Text>
			</Box>
		);
	}
	return null;
};

const LeadStatusPieChart = ({ data }) => {
	const [view, setView] = useState('top5');

	const filteredData = getFilteredStats(data.leadStatusStats, view);
	const total = filteredData.reduce((sum, d) => sum + d.value, 0);
	const processedData = filteredData.map((item) => ({
		...item,
		percent: item.value / total,
	}));

	const viewOptions = ['top5', 'top10', 'all'];

	return (
		<Box bg='white' p={6} rounded='2xl' my='4'>
			<Flex
				justify='space-between'
				align='center'
				mb={4}
				gap={3}
				flexDir={{ base: 'column', md: 'row' }}
			>
				<Text fontSize='lg' fontWeight='semibold'>
					Lead Status Breakdown
				</Text>
				<Tabs
					variant='soft-rounded'
					colorScheme='brand'
					index={viewOptions.indexOf(view)}
					onChange={(index) => setView(viewOptions[index])}
				>
					<TabList>
						{viewOptions.map((label, i) => (
							<Tab
								key={i}
								sx={{
									_hover: {
										boxShadow: 'none',
										outline: 'none',
										border: 'none',
									},
									_focus: {
										boxShadow: 'none',
										outline: 'none',
										border: 'none',
									},
									_focusVisible: {
										boxShadow: 'none',
										outline: 'none',
										border: 'none',
									},
								}}
							>
								{label === 'top5'
									? 'Top 5'
									: label === 'top10'
										? 'Top 10'
										: 'All'}
							</Tab>
						))}
					</TabList>
				</Tabs>
			</Flex>

			<Flex
				flexDir={{ base: 'column-reverse', md: 'row' }}
				gap={10}
				align='center'
			>
				<Box w={{ base: 'full', md: '50%' }}>
					<Grid templateColumns='1fr 1fr' gap={2}>
						{processedData.map((item, idx) => (
							<HStack key={idx} align='center'>
								<Circle size='12px' bg={item.bgColor} />
								<Text fontSize='sm' color='gray.800' fontWeight='medium'>
									{item.label} ({item.value})
								</Text>
							</HStack>
						))}
					</Grid>
				</Box>

				<ResponsiveContainer width={300} height={300}>
					<PieChart>
						<Pie
							data={processedData}
							dataKey='value'
							cx='50%'
							cy='50%'
							innerRadius={40}
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
				</ResponsiveContainer>
			</Flex>
		</Box>
	);
};

export default LeadStatusPieChart;
