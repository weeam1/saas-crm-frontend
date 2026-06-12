/**
 * ConversionBySourceChart — grouped bar comparison of leads vs converted
 * per dimension (e.g. source). Data: conversion `breakdown` rows of
 * { name, leads, converted }.
 */

import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { MODAL_TOKENS } from 'hooks/useModalColors';
import { formatNumber, truncate } from '../helpers';
import ChartTooltip from './ChartTooltip';

export const ConversionBySourceChart = ({ rows = [], height = 300 }) => {
	return (
		<ResponsiveContainer width='100%' height={height}>
			<BarChart data={rows} margin={{ top: 10, right: 12, left: -10, bottom: 0 }} barGap={4}>
				<CartesianGrid strokeDasharray='3 3' stroke={MODAL_TOKENS.borderColor} vertical={false} />
				<XAxis
					dataKey='name'
					tick={{ fill: MODAL_TOKENS.mutedText, fontSize: 11 }}
					tickLine={false}
					axisLine={{ stroke: MODAL_TOKENS.borderColor }}
					tickFormatter={(v) => truncate(v, 12)}
					interval={0}
				/>
				<YAxis
					tick={{ fill: MODAL_TOKENS.mutedText, fontSize: 11 }}
					tickLine={false}
					axisLine={false}
					tickFormatter={formatNumber}
					allowDecimals={false}
					width={44}
				/>
				<Tooltip content={<ChartTooltip />} cursor={{ fill: MODAL_TOKENS.bgInput, fillOpacity: 0.4 }} />
				<Legend
					wrapperStyle={{ fontSize: 12, color: MODAL_TOKENS.bodyText }}
					iconType='circle'
				/>
				<Bar dataKey='leads' name='Leads' fill={MODAL_TOKENS.badgeInfoText} radius={[4, 4, 0, 0]} maxBarSize={28} />
				<Bar dataKey='converted' name='Converted' fill={MODAL_TOKENS.accentGold} radius={[4, 4, 0, 0]} maxBarSize={28} />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ConversionBySourceChart;
