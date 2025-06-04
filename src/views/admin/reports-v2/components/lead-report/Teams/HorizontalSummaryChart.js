import { Box, Circle, Flex, Text } from '@chakra-ui/react';

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

// const CustomTooltip = ({ active, payload, label, type }) => {
// 	if (active && payload && payload.length) {
// 		return (
// 			<div
// 				style={{
// 					background: '#fff',
// 					padding: '8px 12px',
// 					border: '1px solid #e2e8f0',
// 					borderRadius: '4px',
// 					boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
// 					fontSize: '14px',
// 				}}
// 			>
// 				<p style={{ fontWeight: 600, marginBottom: '4px' }}>
// 					{payload[0].payload.name}
// 				</p>
// 				<p style={{ color: '#4a5568' }}>
// 					{type}:{' '}
// 					<span style={{ color: '#3182ce', fontWeight: 500 }}>
// 						{payload[0].value}
// 					</span>
// 				</p>
// 			</div>
// 		);
// 	}
// 	return null;
// };

export const CustomTooltip = ({ active, payload, label, type }) => {
	if (active && payload && payload.length) {
		const item = payload[0];
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
				<Flex align='center' gap={2} mb={1}>
					<Circle size='12px' bg={item.bgColor || '#e7e7e7'} />
					<Text fontWeight='bold' fontSize='sm' color='gray.700'>
						{item.label || item.name}
					</Text>
				</Flex>
				<Flex justify='space-between'>
					<Text fontSize='sm' color='gray.500'>
						Total:
					</Text>
					<Text fontSize='sm' fontWeight='600'>
						{item.value}
					</Text>
				</Flex>
				{item.percent && (
					<Flex justify='space-between'>
						<Text fontSize='sm' color='gray.500'>
							Percentage:
						</Text>
						<Text fontSize='sm' fontWeight='600'>
							{(item.percent * 100).toFixed(1)}%
						</Text>
					</Flex>
				)}
			</Box>
		);
	}
	return null;
};

const HorizontalSummaryChart = ({ data, type }) => {
	const BRAND_COLORS = ['#3182ce', '#38a169', '#dd6b20', '#805ad5', '#e53e3e'];

	return (
		<ResponsiveContainer width='99%' height={250}>
			<BarChart
				data={data}
				layout='vertical'
				margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
				barSize={18}
			>
				<CartesianGrid
					horizontal={true}
					vertical={false}
					strokeDasharray='3 3'
					stroke='#e2e8f0'
				/>
				<XAxis
					type='number'
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#4a5568', fontSize: 12 }}
					domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
				/>
				<YAxis
					dataKey='name'
					type='category'
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#4a5568', fontSize: 12 }}
					width={120}
				/>
				<Tooltip
					content={<CustomTooltip type={type} />}
					cursor={{ fill: '#ebf8ff' }}
				/>
				<Bar dataKey={type} radius={[0, 4, 4, 0]} animationDuration={1500}>
					{data.map((_, idx) => (
						<Cell
							key={`cell-${idx}`}
							fill={BRAND_COLORS[idx % BRAND_COLORS.length]}
						/>
					))}
					<LabelList
						dataKey={type}
						position='right'
						fill='#2d3748'
						fontSize={12}
						fontWeight={500}
						offset={10}
					/>
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default HorizontalSummaryChart;
