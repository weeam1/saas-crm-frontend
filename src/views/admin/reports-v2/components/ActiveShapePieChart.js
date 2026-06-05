import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';
import { useModalColors } from 'hooks/useModalColors';

const renderActiveShape = (props, colors) => {
	const RADIAN = Math.PI / 180;
	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
		value,
	} = props;

	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? 'start' : 'end';

	return (
		<g>
			<text
				x={cx}
				y={cy - 10}
				textAnchor='middle'
				fill={colors.headingText}
				fontSize={14}
			>
				{payload.label}
			</text>
			<text
				x={cx}
				y={cy + 10}
				textAnchor='middle'
				fill={colors.headingText}
				fontWeight='bold'
				fontSize={16}
			>
				{value}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path
				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
				stroke={fill}
				fill='none'
			/>
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				textAnchor={textAnchor}
				fill={colors.bodyText}
			>{`${value} leads`}</text>
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill={colors.mutedText}
			>
				{`Rate: ${(percent * 100).toFixed(1)}%`}
			</text>
		</g>
	);
};

const ActiveShapePieChart = ({ data }) => {
	const colors = useModalColors();
	const [activeIndex, setActiveIndex] = useState(0);

	// Assign gold theme colors to data items
	const goldColors = [colors.accentGold, colors.goldLight, colors.goldDark, '#4A7BA3', '#2E5C87'];

	const enrichedData = data.map((item, index) => ({
		...item,
		fill: goldColors[index % goldColors.length],
		textColor: colors.headingText,
	}));

	return (
		<Box w='100%'>
			<ResponsiveContainer width='100%' height={300}>
				<PieChart>
					<Pie
						activeIndex={activeIndex}
						activeShape={(props) => renderActiveShape(props, colors)}
						data={enrichedData}
						cx='50%'
						cy='50%'
						innerRadius={70}
						outerRadius={90}
						dataKey='value'
						onMouseEnter={(_, index) => setActiveIndex(index)}
					/>
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default ActiveShapePieChart;