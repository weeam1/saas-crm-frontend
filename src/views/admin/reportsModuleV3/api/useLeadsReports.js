/**
 * useLeadsReports
 * ---------------
 * Thin hooks over the project's existing RTK Query `useFetchItemsQuery`
 * (no new fetch pattern introduced). Each hook targets one v3 leads report
 * endpoint and normalizes the standard envelope so components read clean data:
 *
 *   { doc, pagination, count, isLoading, isFetching, isError, error, refetch }
 *
 * Backend base path: /api/v3/reports/leads/<endpoint>
 * (the apiSlice baseUrl already includes `/api`, so we prefix with `/v3/...`).
 */

import { useFetchItemsQuery } from 'api/apiSlice';

const BASE = '/v3/reports/leads';

/**
 * Remove empty params so we never send `?source=&leadStatus=` — the backend
 * Joi validation rejects empty strings (Joi.string() disallows '').
 * @param {Record<string, any>} params
 * @returns {Record<string, any>}
 */
export const cleanParams = (params = {}) =>
	Object.fromEntries(
		Object.entries(params).filter(
			([, v]) => v !== undefined && v !== null && v !== '',
		),
	);

/**
 * Internal: run a report query and normalize the response envelope.
 * @param {string} endpoint
 * @param {Record<string, any>} params
 * @param {object} [options] - extra RTK Query options (e.g. { skip })
 */
const useReport = (endpoint, params = {}, options = {}) => {
	const result = useFetchItemsQuery(
		{ path: `${BASE}/${endpoint}`, params: cleanParams(params) },
		{ refetchOnMountOrArgChange: true, ...options },
	);

	return {
		...result,
		doc: result.data?.doc ?? null,
		pagination: result.data?.pagination ?? null,
		count: result.data?.count ?? null,
	};
};

// One hook per report (mirrors the 13 backend endpoints).
export const useLeadsSummary = (params, options) =>
	useReport('summary', params, options);

export const useLeadsByStatus = (params, options) =>
	useReport('by-status', params, options);

export const useLeadsBySource = (params, options) =>
	useReport('by-source', params, options);

export const useLeadsByOwner = (params, options) =>
	useReport('by-owner', params, options);

export const useLeadsFunnel = (params, options) =>
	useReport('funnel', params, options);

export const useLeadsConversion = (params, options) =>
	useReport('conversion', params, options);

export const useLeadsLostReasons = (params, options) =>
	useReport('lost-reasons', params, options);

export const useLeadsTimeToConversion = (params, options) =>
	useReport('time-to-conversion', params, options);

export const useLeadsTimeToAssignment = (params, options) =>
	useReport('time-to-assignment', params, options);

export const useLeadsAging = (params, options) =>
	useReport('aging', params, options);

export const useLeadsActivity = (params, options) =>
	useReport('activity', params, options);

export const useLeadsTrend = (params, options) =>
	useReport('trend', params, options);

export const useLeadsQualification = (params, options) =>
	useReport('qualification', params, options);
