import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Flex, Text, Circle } from '@chakra-ui/react';
import './../styles/leadStatus.css';

const PiChart = ({
	data,
	containerWidth = 250,
	containerHeight = 250,
	innerRadius = 40,
	outerRadius = 120,
	paddingAngle = 1,
	dataKey = 'value',
}) => {
	return (
		<ResponsiveContainer width={containerWidth} height={containerHeight}>
			<PieChart>
				<Pie
					data={data}
					dataKey={dataKey}
					cx='50%'
					cy='50%'
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					paddingAngle={paddingAngle}
					isAnimationActive
				>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={entry.bgColor}
							stroke={entry.textColor}
						/>
					))}
				</Pie>
				<Tooltip content={<CustomTooltip key='leads' />} />
			</PieChart>
		</ResponsiveContainer>
	);
};

export const CustomTooltip = ({ active, payload, key }) => {
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
					{item.value} {key} ({(item.percent * 100).toFixed(1)}%)
				</Text>
			</Box>
		);
	}
	return null;
};

export default PiChart;
