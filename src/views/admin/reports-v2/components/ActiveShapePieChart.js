import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

// import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from 'recharts';

// const renderActiveShape = (props) => {
// 	const RADIAN = Math.PI / 180;
// 	const {
// 		cx,
// 		cy,
// 		midAngle,
// 		innerRadius,
// 		outerRadius,
// 		startAngle,
// 		endAngle,
// 		fill,
// 		payload,
// 		percent,
// 		value,
// 	} = props;

// 	const sin = Math.sin(-RADIAN * midAngle);
// 	const cos = Math.cos(-RADIAN * midAngle);
// 	const sx = cx + (outerRadius + 10) * cos;
// 	const sy = cy + (outerRadius + 10) * sin;
// 	const mx = cx + (outerRadius + 20) * cos;
// 	const my = cy + (outerRadius + 20) * sin;
// 	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
// 	const ey = my;
// 	const textAnchor = cos >= 0 ? 'start' : 'end';

// 	return (
// 		<>
// 			<Sector
// 				cx={cx}
// 				cy={cy}
// 				innerRadius={innerRadius}
// 				outerRadius={outerRadius + 6}
// 				startAngle={startAngle}
// 				endAngle={endAngle}
// 				fill={fill}
// 			/>
// 			<path
// 				d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
// 				stroke={fill}
// 				fill='none'
// 			/>
// 			<circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
// 			<text
// 				x={ex + (cos >= 0 ? 12 : -12)}
// 				y={ey}
// 				textAnchor={textAnchor}
// 				fill='#333'
// 				fontSize={14}
// 			>
// 				{`${payload.label}: ${value} (${percent.toFixed(1)}%)`}
// 			</text>
// 		</>
// 	);
// };

const renderActiveShape = (props) => {
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
				fill={payload.textColor}
				fontSize={14}
			>
				{payload.label}
			</text>
			<text
				x={cx}
				y={cy + 10}
				textAnchor='middle'
				fill={payload.textColor}
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
				fill='#333'
			>{`${value} leads`}</text>
			<text
				x={ex + (cos >= 0 ? 1 : -1) * 12}
				y={ey}
				dy={18}
				textAnchor={textAnchor}
				fill='#999'
			>
				{`Rate: ${(percent * 100).toFixed(2)}%`}
			</text>
		</g>
	);
};

const ActiveShapePieChart = ({ data }) => {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<Box w='100%'>
			<ResponsiveContainer width='100%' height={300}>
				<PieChart>
					<Pie
						activeIndex={activeIndex}
						activeShape={renderActiveShape}
						data={data}
						cx='50%'
						cy='50%'
						innerRadius={70}
						outerRadius={90}
						// innerRadius='80%'
						// outerRadius='100%'
						fill='#E5B668'
						dataKey='value'
						onMouseEnter={(_, index) => setActiveIndex(index)}
					/>
				</PieChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default ActiveShapePieChart;
