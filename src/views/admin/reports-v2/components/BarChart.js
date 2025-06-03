import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Cell,
} from 'recharts';
import { Box, Circle, Flex, Text } from '@chakra-ui/react';

// const CustomTooltip = ({ active, payload }) => {
// 	if (active && payload && payload.length) {
// 		const { name, value, percent } = payload[0].payload;
// 		return (
// 			<Box bg='white' p={2} boxShadow='md' borderRadius='md'>
// 				<b>{name}</b>
// 				<br />
// 				Value: {value}
// 				{percent !== undefined && (
// 					<>
// 						<br />
// 						Percent: {(percent * 100).toFixed(1)}%
// 					</>
// 				)}
// 			</Box>
// 		);
// 	}
// 	return null;
// };

export const CustomTooltip = ({ active, payload }) => {
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

const BarChartComponent = ({
	data,
	containerWidth = '100%',
	containerHeight = 300,
	barSize = 40,
	layout = 'vertical',
	dataKey = 'value',
	labelKey = 'name',
	showGrid = true,
	XAxisFontSize = '12px',
	YAxisFontSize = '12px',
	showPercent = false,
}) => {
	return (
		<ResponsiveContainer width={containerWidth} height={containerHeight}>
			<BarChart
				data={data}
				layout={layout}
				margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
				barSize={barSize}
				radius={[4, 4, 0, 0]}
				animationDuration={1500}
			>
				{showGrid && (
					<CartesianGrid
						strokeDasharray='3 3'
						vertical={false}
						stroke='#e2e8f0'
					/>
				)}
				<XAxis
					type={layout === 'vertical' ? 'number' : 'category'}
					fontSize={XAxisFontSize}
				/>
				<YAxis
					type={layout === 'vertical' ? 'category' : 'number'}
					dataKey={labelKey}
					fontSize={YAxisFontSize}
				/>
				<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
				<Bar dataKey={dataKey}>
					{data.map((entry, index) => (
						<Cell
							key={`bar-${index}`}
							fill={entry.bgColor || '#3182CE'}
							stroke={entry.textColor || '#1A202C'}
						/>
					))}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default BarChartComponent;
