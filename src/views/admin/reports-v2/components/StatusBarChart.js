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
	Legend,
} from 'recharts';
import { Box, Circle, Flex, Text } from '@chakra-ui/react';

// export const CustomTooltip = ({ active, payload }) => {
// 	if (active && payload && payload.length) {
// 		const item = payload[0].payload;
// 		return (
// 			<Box bg='white' p={3} rounded='md' shadow='md' border='1px solid #e2e8f0'>
// 				<Flex align='center' gap={2}>
// 					<Circle size='12px' bg={item.bgColor} />
// 					<Text fontWeight='bold' fontSize='sm' color={item.textColor}>
// 						{item.label}
// 					</Text>
// 				</Flex>
// 				<Text fontSize='sm' color='gray.600'>
// 					{item.value} leads ({(item.percent * 100).toFixed(1)}%)
// 				</Text>
// 			</Box>
// 		);
// 	}
// 	return null;
// };

// const BarChartComponent = ({
// 	data,
// 	containerWidth = '100%',
// 	containerHeight = 300,
// 	barSize = 40,
// 	layout = 'vertical',
// 	dataKey = 'value',
// 	labelKey = 'name',
// 	showGrid = true,
// 	XAxisFontSize = '12px',
// 	YAxisFontSize = '12px',
// 	showPercent = false,
// }) => {
// 	return (
// 		<ResponsiveContainer width={containerWidth} height={containerHeight}>
// 			<BarChart
// 				data={data}
// 				layout={layout}
// 				margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
// 				barSize={barSize}
// 			>
// 				{showGrid && (
// 					<CartesianGrid
// 						strokeDasharray='3 3'
// 						vertical={false}
// 						stroke='#e2e8f0'
// 					/>
// 				)}

// 				<XAxis
// 					type={layout === 'vertical' ? 'number' : 'category'}
// 					// fontSize={XAxisFontSize}
// 					tickLine={false}
// 					axisLine={false}
// 					tick={{ fill: '#4a5568', fontSize: XAxisFontSize }}
// 				/>
// 				<YAxis
// 					type={layout === 'vertical' ? 'category' : 'number'}
// 					dataKey={labelKey}
// 					tickLine={false}
// 					axisLine={false}
// 					tick={{ fill: '#4a5568', fontSize: YAxisFontSize }}
// 				/>
// 				<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
// 				<Bar
// 					dataKey={dataKey}
// 					vertical={false}
// 					stroke='#e2e8f0'
// 					animationDuration={1500}
// 				>
// 					{data.map((entry, index) => (
// 						<Cell
// 							key={`bar-${index}`}
// 							fill={entry.bgColor || '#3182CE'}
// 							stroke={entry.textColor || '#1A202C'}
// 						/>
// 					))}

// 					<LabelList
// 						dataKey='value'
// 						position={layout === 'vertical' ? 'right' : 'top'}
// 						fill='#2d3748'
// 						fontSize={10}
// 						fontWeight={400}
// 					/>
// 				</Bar>
// 			</BarChart>
// 		</ResponsiveContainer>
// 	);
// };

export const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		const item = payload[0].payload;
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
					<Circle size='12px' bg={item.bgColor} />
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

const StatusBarChart = ({
	data,
	containerWidth = '100%',
	containerHeight = 350,
	barSize = 24,
	layout = 'vertical',
	dataKey = 'value',
	labelKey = 'name',
	showGrid = true,
	showLegend = true,
	showPercent = false,
	showValues = true,
	axisFontSize = '12px',
	customColors = [],
	margin = { top: 20, right: 30, left: 5, bottom: 20 },
	borderRadius = [4, 4, 0, 0], // For horizontal layout
	barGap = 4,
}) => {
	// Default color palette if not provided
	const defaultColors = ['#3182CE', '#38A169', '#DD6B20', '#805AD5', '#D53F8C'];
	const colors = customColors.length > 0 ? customColors : defaultColors;

	return (
		<ResponsiveContainer width={containerWidth} height={containerHeight}>
			<BarChart
				data={data}
				layout={layout}
				margin={margin}
				barSize={barSize}
				barGap={barGap}
			>
				{showGrid && (
					<CartesianGrid
						strokeDasharray='3 3'
						vertical={layout === 'vertical' ? false : true}
						horizontal={layout === 'vertical' ? true : false}
						stroke='#e2e8f0'
					/>
				)}

				<XAxis
					type={layout === 'vertical' ? 'number' : 'category'}
					dataKey={layout === 'vertical' ? null : labelKey}
					tickLine={false}
					axisLine={false}
					tick={{ fill: '#4a5568', fontSize: axisFontSize }}
					// height={layout === 'vertical' ? 0 : 40}
					domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
				/>

				<YAxis
					type={layout === 'vertical' ? 'category' : 'number'}
					dataKey={layout === 'vertical' ? labelKey : null}
					tickLine={false}
					axisLine={false}
					tick={{ fill: '#4a5568', fontSize: axisFontSize }}
					// width={layout === 'vertical' ? 120 : 60}
				/>

				<Tooltip
					content={<CustomTooltip />}
					cursor={{ fill: '#ebf8ff' }}
					// cursor={{
					// 	fill: 'rgba(49, 130, 206, 0.1)',
					// 	stroke: '#3182CE',
					// 	strokeWidth: 1,
					// }}
				/>

				{/* {showLegend && (
					<Legend
						verticalAlign='top'
						height={36}
						formatter={(value, entry, index) => (
							<span style={{ color: '#4A5568', fontSize: '12px' }}>
								{value}
							</span>
						)}
					/>
				)} */}

				<Bar
					dataKey={dataKey}
					animationDuration={1500}
					radius={
						layout === 'vertical'
							? [0, borderRadius[0], borderRadius[1], 0]
							: borderRadius
					}
				>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={entry.bgColor || colors[index % colors.length]}
							// stroke={entry.borderColor || '#4A5568'}
							// strokeWidth={1}
						/>
					))}

					{showValues && (
						<LabelList
							dataKey={dataKey}
							position={layout === 'vertical' ? 'right' : 'top'}
							formatter={(value) => {
								if (showPercent && data.find((d) => d.percent)) {
									const percent = (
										data.find((d) => d.value === value)?.percent * 100
									).toFixed(1);
									return `${value} (${percent}%)`;
								}
								return value;
							}}
							fill='#2D3748'
							fontSize={axisFontSize}
							fontWeight={500}
							offset={layout === 'vertical' ? 10 : 5}
						/>
					)}
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default StatusBarChart;
