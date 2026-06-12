/**
 * FunnelChart — horizontal bar representation of the lead funnel stages.
 * Data: funnel `stages` of { label, count, conversionFromTop }.
 * (Implemented with a horizontal BarChart for clarity + responsiveness.)
 */

import {
	Bar,
	BarChart,
	Cell,
	LabelList,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { MODAL_TOKENS } from 'hooks/useModalColors';
import { colorAt, formatNumber, truncate } from '../helpers';
import ChartTooltip from './ChartTooltip';

export const FunnelChart = ({ stages = [], height }) => {
	const data = stages.map((s) => ({
		name: s.label || s.stage,
		count: s.count,
		conversionFromTop: s.conversionFromTop,
	}));
	const computedHeight = height || Math.max(220, data.length * 46);

	return (
		<ResponsiveContainer width='100%' height={computedHeight}>
			<BarChart
				data={data}
				layout='vertical'
				margin={{ top: 6, right: 48, left: 8, bottom: 6 }}
				barCategoryGap={10}
			>
				<XAxis type='number' hide tickFormatter={formatNumber} />
				<YAxis
					type='category'
					dataKey='name'
					tick={{ fill: MODAL_TOKENS.bodyText, fontSize: 12 }}
					tickLine={false}
					axisLine={false}
					width={110}
					tickFormatter={(v) => truncate(v, 16)}
				/>
				<Tooltip content={<ChartTooltip />} cursor={{ fill: MODAL_TOKENS.bgInput, fillOpacity: 0.4 }} />
				<Bar dataKey='count' name='Leads' radius={[0, 6, 6, 0]} maxBarSize={28}>
					{data.map((_, i) => (
						<Cell key={i} fill={colorAt(i)} />
					))}
					<LabelList
						dataKey='count'
						position='right'
						formatter={formatNumber}
						style={{ fill: MODAL_TOKENS.headingText, fontSize: 12, fontWeight: 600 }}
					/>
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default FunnelChart;
