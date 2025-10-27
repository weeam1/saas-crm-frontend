import { useFetchItemsQuery } from 'api/apiSlice';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = [
	{ value: 'leadStatus', label: 'Lead Status' },
	{ value: 'eLeadStatus', label: 'Main Status' },
	{ value: 'adset', label: 'Ad Set' },
	{ value: 'leadSourceMedium', label: 'Source Medium' },
	{ value: 'leadSourceCampaign', label: 'Source Campaign' },
	{ value: 'leadCampaign', label: 'Campaign' },
	{ value: 'leadSourceChannel', label: 'Source Channel' },
	{ value: 'leadSource', label: 'Lead Source' },
	{ value: 'leadSourceDetails', label: 'Source Details' },
	{ value: 'leadLang', label: 'Language' },
];

export const useLeadAnalytics = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const urlCategory = searchParams.get('category');
	const urlSearch = searchParams.get('search');

	// Load on app start
	const savedSort = localStorage.getItem('analyticsSort');
	const initialSort = savedSort
		? JSON.parse(savedSort)
		: { key: null, direction: 'asc' };

	const [selectedCategory, setSelectedCategory] = useState(
		urlCategory || CATEGORIES[0].value
	);
	const [searchTerm, setSearchTerm] = useState(urlSearch || '');
	const [sortConfig, setSortConfig] = useState(
		initialSort || { key: null, direction: 'asc' }
	);

	const {
		data: analyticsData = [],
		isLoading,
		isFetching,
		isError,
		error,
	} = useFetchItemsQuery(
		{
			path: '/lead_analytics/summary',
			params: { category: selectedCategory },
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
			refetchOnFocus: true,
		}
	);

	const handleSort = (key) => {
		setSortConfig((current) => ({
			key,
			direction:
				current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	const updateSearchParams = useCallback(
		(updates = {}) => {
			setSearchParams((prev) => {
				const params = new URLSearchParams(prev);

				// apply incoming key-value updates
				Object.entries(updates).forEach(([key, value]) => {
					if (value === null || value === undefined || value === '') {
						params.delete(key);
					} else {
						params.set(key, value);
					}
				});

				return params;
			});
		},
		[setSearchParams]
	);

	// const formattedData = useMemo(() => {
	// 	if (!analyticsData?.data || !Array.isArray(analyticsData?.data)) return [];

	// 	return analyticsData?.data?.map((item) => ({
	// 		category: item?.name || 'N/A',
	// 		leadCount: item.leadCount || 0,
	// 		deals: item.deals || 0,
	// 		releasedLeads: item.releasedLeads || 0,
	// 		interestedLeads: item.interestedLeads || 0,
	// 		notInterestedLeads: item.notInterestedLeads || 0,
	// 		newLeadsToday: item.newLeadsToday || 0,
	// 		newLeadsThisWeek: item.newLeadsThisWeek || 0,
	// 		newLeadsThisMonth: item.newLeadsThisMonth || 0,
	// 		avgResponseTime: item.avgResponseTime || 'N/A',
	// 		dealConversionRate: item.dealConversionRate || 0,
	// 	}));
	// }, [analyticsData]);

	const processedData = useMemo(() => {
		if (!analyticsData?.data || !Array.isArray(analyticsData?.data)) return [];

		let data = analyticsData.data.map((item) => ({
			category: item?.name || 'N/A',
			...item,
		}));

		// Apply search filter (real-time, case-insensitive)
		if (searchTerm.trim() !== '') {
			const lower = searchTerm.toLowerCase();
			data = data.filter((item) => item.category.toLowerCase().includes(lower));
		}

		// Apply sorting
		if (sortConfig.key) {
			// Sorting data
			// data = [...data].sort((a, b) => {
			// 	const aVal = a[sortConfig.key];
			// 	const bVal = b[sortConfig.key];

			// 	// Numeric sort if both values are numbers
			// 	if (typeof aVal === 'number' && typeof bVal === 'number') {
			// 		return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
			// 	}

			// 	// String sort fallback
			// 	return sortConfig.direction === 'asc'
			// 		? String(aVal).localeCompare(String(bVal))
			// 		: String(bVal).localeCompare(String(aVal));
			// });

			// optimize version of sorting
			data = [...data].sort((a, b) => {
				const key = sortConfig.key;
				const dir = sortConfig.direction === 'asc' ? 1 : -1;

				const aVal = a[key];
				const bVal = b[key];

				// Both numbers - fastest path
				if (typeof aVal === 'number' && typeof bVal === 'number') {
					return dir * (aVal - bVal);
				}

				// Mixed or string values - use localeCompare for accuracy
				const aStr = String(aVal);
				const bStr = String(bVal);

				return (
					dir *
					aStr.localeCompare(bStr, undefined, {
						sensitivity: 'base',
						numeric: true,
					})
				);
			});

			updateSearchParams({
				sortBy: sortConfig.key,
				sortOrder: sortConfig?.direction || 'asc',
			});

			// Save sorting preference
			localStorage.setItem('analyticsSort', JSON.stringify(sortConfig));
		}

		return data;
	}, [analyticsData.data, searchTerm, sortConfig, updateSearchParams]);

	const handleCategoryChange = (category) => {
		setSelectedCategory(category);

		updateSearchParams({
			category,
			search: '', // reset search param
		});
		setSearchTerm('');
	};

	const handleSearchChange = (value) => {
		setSearchTerm(value);

		updateSearchParams({
			search: value,
		});
	};

	return {
		categories: CATEGORIES,
		selectedCategory,
		setSelectedCategory,
		handleSearchChange,
		handleCategoryChange,
		searchTerm,
		setSearchTerm,
		sortConfig,
		handleSort,
		summary: analyticsData?.summary || {},
		totals: analyticsData?.totalResults || 0,
		data: processedData,
		isLoading,
		isFetching,
		isError,
		error: error?.data?.message || 'Failed to fetch data',
	};
};
