/**
 * Shared presentation helpers for the Leads Reports V3 module:
 * chart color palette and number/percent/currency formatters.
 */

/** Brand-aligned categorical palette (gold + navy accents). */
export const CHART_COLORS = [
	'#D4AF37', // gold (brand)
	'#7AAAC4', // info blue
	'#10B981', // success green
	'#FFB347', // warning amber
	'#EE5D50', // danger red
	'#9F7AEA', // purple
	'#4A7BA3', // navy blue
	'#F5D67B', // gold light
	'#4FD1C5', // teal
	'#ED8936', // orange
];

/** Pick a stable color for an index (wraps around the palette). */
export const colorAt = (index) => CHART_COLORS[index % CHART_COLORS.length];

/** Compact number formatter (e.g. 1.2K, 3.4M). */
export const formatNumber = (value) => {
	const n = Number(value || 0);
	if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return `${n.toLocaleString()}`;
};

/** Full number with thousands separators. */
export const formatFull = (value) => Number(value || 0).toLocaleString();

/** Percentage with one decimal. */
export const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

/** Currency (AED by default), compacted. */
export const formatCurrency = (value, currency = 'AED') =>
	`${currency} ${formatNumber(value)}`;

/** Truncate a label for axis ticks / legends. */
export const truncate = (text, max = 14) => {
	const str = String(text ?? '');
	return str.length > max ? `${str.slice(0, max - 1)}…` : str;
};
