import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
	LabelList,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		return (
			<div
				className='custom-tooltip'
				style={{
					background: '#fff',
					padding: '8px 12px',
					border: '1px solid #e2e8f0',
					borderRadius: '4px',
					boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
				}}
			>
				<p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
				<p style={{ color: '#4a5568' }}>
					Count:{' '}
					<span style={{ color: '#3182ce', fontWeight: 500 }}>
						{payload[0].value}
					</span>
				</p>
			</div>
		);
	}
	return null;
};

const HiringSummaryBarChart = ({ data }) => {
	// Custom colors for each bar
	const colors = ['#3182ce', '#38a169', '#dd6b20'];

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
					stroke='#e2e8f0'
				/>
				<XAxis
					dataKey='name'
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#4a5568', fontSize: 14 }}
				/>
				<YAxis
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#4a5568', fontSize: 12 }}
				/>
				<Tooltip content={<CustomTooltip />} cursor={{ fill: '#ebf8ff' }} />
				<Bar dataKey='value' radius={[4, 4, 0, 0]} animationDuration={1500}>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
					))}
					<LabelList
						dataKey='value'
						position='top'
						fill='#2d3748'
						fontSize={14}
						fontWeight={500}
					/>
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default HiringSummaryBarChart;
