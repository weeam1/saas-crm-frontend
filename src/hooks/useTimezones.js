import { useEffect } from 'react';
import { useFetchItemsQuery } from 'api/apiSlice'; // Your API hook
import moment from 'moment-timezone';

const TIMEZONE_CACHE_KEY = 'timezoneData';
const CACHE_EXPIRY_HOURS = 24; // Cache for 24 hours

export const useTimezoneData = () => {
	// 1. Try to get cached data from localStorage
	const getCachedTimezones = () => {
		try {
			const cached = localStorage.getItem(TIMEZONE_CACHE_KEY);
			if (!cached) return null;

			const parsed = JSON.parse(cached);

			// Check if cache is expired
			const lastUpdated = moment(parsed.lastUpdated);
			const isExpired =
				moment().diff(lastUpdated, 'hours') > CACHE_EXPIRY_HOURS;

			return isExpired ? null : parsed;
		} catch (error) {
			console.error('Failed to parse cached timezones', error);
			return null;
		}
	};

	// 2. Initialize with cached data or empty array
	const cachedData = getCachedTimezones();
	const initialData = cachedData
		? { timezones: cachedData.timezones }
		: undefined;

	// 3. Fetch from API if no cached data
	const { data, isLoading, error, refetch } = useFetchItemsQuery(
		{
			path: '/timezones',
		},
		{
			skip: !!cachedData, // Skip if we have cached data
			initialData, // Use cached data as initialData
		}
	);

	// 4. Update cache when new data arrives
	useEffect(() => {
		if (data?.doc && !cachedData) {
			const cache = {
				timezones: data?.doc,
				lastUpdated: moment().toISOString(),
			};
			localStorage.setItem(TIMEZONE_CACHE_KEY, JSON.stringify(cache));
		}
	}, [data, cachedData]);

	// 5. Manual refresh with cache busting
	const refreshTimezones = async () => {
		localStorage.removeItem(TIMEZONE_CACHE_KEY);
		await refetch();
	};

	return {
		timezones: data?.timezones || cachedData?.timezones || [],
		isLoading,
		error,
		refreshTimezones,
		isCached: !!cachedData,
	};
};
