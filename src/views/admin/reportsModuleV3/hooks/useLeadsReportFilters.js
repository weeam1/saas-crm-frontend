/**
 * useLeadsReportFilters
 * ---------------------
 * Centralizes the shared filter state for the Leads Reports detail page and
 * derives the query-param object passed to every report hook.
 *
 * Kept intentionally small and serializable so the same params object can be
 * shared by all report sections (RTK Query dedupes identical requests).
 */

import { useCallback, useMemo, useState } from 'react';

/** @type {import('../types').LeadsReportFilters} */
export const DEFAULT_FILTERS = {
	dateField: 'createdDate',
	dateFrom: '',
	dateTo: '',
	source: '',
	leadStatus: '',
};

export const useLeadsReportFilters = (initial = {}) => {
	const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initial });

	const setFilter = useCallback((key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	}, []);

	const reset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

	// Shared params consumed by the report hooks.
	const params = useMemo(
		() => ({
			dateField: filters.dateField,
			dateFrom: filters.dateFrom,
			dateTo: filters.dateTo,
			source: filters.source,
			leadStatus: filters.leadStatus,
		}),
		[filters],
	);

	return { filters, setFilter, setFilters, reset, params };
};
