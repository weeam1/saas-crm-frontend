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
import { useModalColors } from 'hooks/useModalColors';

const CustomTooltip = ({ active, payload, label }) => {
	const colors = useModalColors();

	if (active && payload && payload.length) {
		return (
			<div
				className='custom-tooltip'
				style={{
					background: colors.bg,
					padding: '8px 12px',
					border: `1px solid ${colors.borderColor}`,
					borderRadius: '4px',
					boxShadow: colors.cardShadow,
				}}
			>
				<p style={{ fontWeight: 600, marginBottom: '4px', color: colors.headingText }}>{label}</p>
				<p style={{ color: colors.bodyText }}>
					Count:{' '}
					<span style={{ color: colors.accentGold, fontWeight: 500 }}>
						{payload[0].value}
					</span>
				</p>
			</div>
		);
	}
	return null;
};

const HiringSummaryBarChart = ({ data }) => {
	const colors = useModalColors();

	// Gold theme colors for bars
	const barColors = [colors.accentGold, colors.goldLight, colors.goldDark];

	return (
		<ResponsiveContainer width='100%' height={300}>
			<BarChart
				data={data}
				margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
				barSize={40}
			>
				<CartesianGrid
					strokeDasharray='3 3'
					vertical={false}
					stroke={colors.borderColor}
				/>
				<XAxis
					dataKey='name'
					axisLine={{ stroke: colors.borderColor }}
					tickLine={false}
					tick={{ fill: colors.bodyText, fontSize: 14 }}
				/>
				<YAxis
					axisLine={{ stroke: colors.borderColor }}
					tickLine={false}
					tick={{ fill: colors.bodyText, fontSize: 12 }}
				/>
				<Tooltip content={<CustomTooltip />} cursor={{ fill: `${colors.accentGold}15` }} />
				<Bar dataKey='value' radius={[4, 4, 0, 0]} animationDuration={1500}>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
					))}
					<LabelList
						dataKey='value'
						position='top'
						fill={colors.headingText}
						fontSize={14}
						fontWeight={500}
					/>
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default HiringSummaryBarChart;