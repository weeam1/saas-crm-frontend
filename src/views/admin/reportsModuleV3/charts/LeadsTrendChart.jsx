/**
 * LeadsTrendChart — responsive area chart of leads over time.
 * Data: trend `series` of { date, count }.
 */

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { MODAL_TOKENS } from 'hooks/useModalColors';
import { formatNumber } from '../helpers';
import ChartTooltip from './ChartTooltip';

export const LeadsTrendChart = ({ series = [], color = MODAL_TOKENS.accentGold, height = 300 }) => {
	return (
		<ResponsiveContainer width='100%' height={height}>
			<AreaChart data={series} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
				<defs>
					<linearGradient id='leadsTrendFill' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor={color} stopOpacity={0.45} />
						<stop offset='95%' stopColor={color} stopOpacity={0.02} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray='3 3' stroke={MODAL_TOKENS.borderColor} vertical={false} />
				<XAxis
					dataKey='date'
					tick={{ fill: MODAL_TOKENS.mutedText, fontSize: 11 }}
					tickLine={false}
					axisLine={{ stroke: MODAL_TOKENS.borderColor }}
					minTickGap={24}
				/>
				<YAxis
					tick={{ fill: MODAL_TOKENS.mutedText, fontSize: 11 }}
					tickLine={false}
					axisLine={false}
					tickFormatter={formatNumber}
					allowDecimals={false}
					width={44}
				/>
				<Tooltip content={<ChartTooltip />} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
				<Area
					type='monotone'
					dataKey='count'
					name='Leads'
					stroke={color}
					strokeWidth={2}
					fill='url(#leadsTrendFill)'
					activeDot={{ r: 5, fill: color }}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

export default LeadsTrendChart;
