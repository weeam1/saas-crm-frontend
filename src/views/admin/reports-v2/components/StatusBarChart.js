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
import { useModalColors } from 'hooks/useModalColors';

export const CustomTooltip = ({ active, payload }) => {
	const colors = useModalColors();

	if (active && payload && payload.length) {
		const item = payload[0].payload;
		return (
			<Box
				bg={colors.bg}
				p={3}
				rounded='md'
				shadow={colors.modalShadow}
				border='1px solid'
				borderColor={colors.borderColor}
				minWidth='160px'
			>
				<Flex align='center' gap={2} mb={1}>
					<Circle size='12px' bg={item.bgColor || colors.accentGold} />
					<Text fontWeight='bold' fontSize='sm' color={colors.headingText}>
						{item.label || item.name}
					</Text>
				</Flex>
				<Flex justify='space-between'>
					<Text fontSize='sm' color={colors.mutedText}>
						Total:
					</Text>
					<Text fontSize='sm' fontWeight='600' color={colors.headingText}>
						{item.value}
					</Text>
				</Flex>
				{item.percent && (
					<Flex justify='space-between'>
						<Text fontSize='sm' color={colors.mutedText}>
							Percentage:
						</Text>
						<Text fontSize='sm' fontWeight='600' color={colors.headingText}>
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
	borderRadius = [4, 4, 0, 0],
	barGap = 4,
}) => {
	const colors = useModalColors();

	// Default color palette with gold theme
	const defaultColors = [colors.accentGold, colors.goldLight, colors.goldDark, '#4A7BA3', '#2E5C87'];
	const barColors = customColors.length > 0 ? customColors : defaultColors;

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
						stroke={colors.borderColor}
					/>
				)}

				<XAxis
					type={layout === 'vertical' ? 'number' : 'category'}
					dataKey={layout === 'vertical' ? null : labelKey}
					tickLine={false}
					axisLine={{ stroke: colors.borderColor }}
					tick={{ fill: colors.bodyText, fontSize: axisFontSize }}
					domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
				/>

				<YAxis
					type={layout === 'vertical' ? 'category' : 'number'}
					dataKey={layout === 'vertical' ? labelKey : null}
					tickLine={false}
					axisLine={{ stroke: colors.borderColor }}
					tick={{ fill: colors.bodyText, fontSize: axisFontSize }}
				/>

				<Tooltip content={<CustomTooltip />} cursor={{ fill: `${colors.accentGold}15` }} />

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
							fill={entry.bgColor || barColors[index % barColors.length]}
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
							fill={colors.headingText}
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