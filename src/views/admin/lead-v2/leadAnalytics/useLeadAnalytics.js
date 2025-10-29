import { useFetchItemsQuery } from 'api/apiSlice';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatDate, CATEGORIES, normalizeSearch } from './helpers';

// export const useLeadAnalytics = () => {
// 	const [searchParams, setSearchParams] = useSearchParams();

// 	const urlCategory = searchParams.get('category');
// 	const urlSearch = searchParams.get('search');

// 	const urlFromDate = searchParams.get('from');
// 	const urlToDate = searchParams.get('to');

// 	// Load on app start
// 	const savedSort = localStorage.getItem('analyticsSort');
// 	const initialSort = savedSort
// 		? JSON.parse(savedSort)
// 		: { key: null, direction: 'asc' };

// 	const [selectedCategory, setSelectedCategory] = useState(
// 		urlCategory || CATEGORIES[0].value
// 	);

// 	const [searchTerm, setSearchTerm] = useState(urlSearch || '');
// 	const [sortConfig, setSortConfig] = useState(
// 		initialSort || { key: null, direction: 'asc' }
// 	);

// 	const [dateRange, setDateRange] = useState(() => {
// 		if (urlFromDate && urlToDate) {
// 			return { from: urlFromDate, to: urlToDate };
// 		}

// 		const to = new Date();
// 		const from = new Date();
// 		from.setDate(to.getDate() - 30);

// 		// by default all time no filter apply
// 		return { from: formatDate(from), to: formatDate(to) };
// 	});

// 	const searchRef = useRef('');
// 	const [data, setData] = useState([]);

// 	const params = useMemo(() => {
// 		return {
// 			category: selectedCategory,
// 			...(dateRange.from && { from: dateRange.from }),
// 			...(dateRange.to && { to: dateRange.to }),
// 		};
// 	}, [selectedCategory, dateRange.from, dateRange.to]);

// 	const {
// 		data: analyticsData = [],
// 		isLoading,
// 		isFetching,
// 		isError,
// 		error,
// 	} = useFetchItemsQuery(
// 		{
// 			path: '/lead_analytics/summary',
// 			params,
// 		},
// 		{
// 			refetchOnMountOrArgChange: true,
// 			refetchOnReconnect: true,
// 			refetchOnFocus: true,
// 		}
// 	);

// 	const handleSort = (key) => {
// 		setSortConfig((current) => ({
// 			key,
// 			direction:
// 				current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
// 		}));
// 	};

// 	const updateSearchParams = useCallback(
// 		(updates = {}) => {
// 			setSearchParams((prev) => {
// 				const params = new URLSearchParams(prev);

// 				// apply incoming key-value updates
// 				Object.entries(updates).forEach(([key, value]) => {
// 					if (value === null || value === undefined || value === '') {
// 						params.delete(key);
// 					} else {
// 						params.set(key, value);
// 					}
// 				});

// 				return params;
// 			});
// 		},
// 		[setSearchParams]
// 	);

// 	// const formattedData = useMemo(() => {
// 	// 	if (!analyticsData?.data || !Array.isArray(analyticsData?.data)) return [];

// 	// 	return analyticsData?.data?.map((item) => ({
// 	// 		category: item?.name || 'N/A',
// 	// 		leadCount: item.leadCount || 0,
// 	// 		deals: item.deals || 0,
// 	// 		releasedLeads: item.releasedLeads || 0,
// 	// 		interestedLeads: item.interestedLeads || 0,
// 	// 		notInterestedLeads: item.notInterestedLeads || 0,
// 	// 		newLeadsToday: item.newLeadsToday || 0,
// 	// 		newLeadsThisWeek: item.newLeadsThisWeek || 0,
// 	// 		newLeadsThisMonth: item.newLeadsThisMonth || 0,
// 	// 		avgResponseTime: item.avgResponseTime || 'N/A',
// 	// 		dealConversionRate: item.dealConversionRate || 0,
// 	// 	}));
// 	// }, [analyticsData]);

// 	const processedData = useMemo(() => {
// 		if (!analyticsData?.data || !Array.isArray(analyticsData?.data)) return [];

// 		let data = analyticsData.data.map((item) => ({
// 			category: item?.name || 'N/A',
// 			...item,
// 		}));

// 		setData(data);

// 		// Apply search filter (real-time, case-insensitive)
// 		if (searchTerm.trim() !== '') {
// 			const lower = searchTerm.toLowerCase();
// 			data = data.filter((item) => item.category.toLowerCase().includes(lower));
// 		}

// 		// Apply sorting
// 		if (sortConfig.key) {
// 			// optimize version of sorting
// 			data = [...data].sort((a, b) => {
// 				const key = sortConfig.key;
// 				const dir = sortConfig.direction === 'asc' ? 1 : -1;

// 				const aVal = a[key];
// 				const bVal = b[key];

// 				// Both numbers
// 				if (typeof aVal === 'number' && typeof bVal === 'number') {
// 					return dir * (aVal - bVal);
// 				}

// 				// Mixed or string values
// 				const aStr = String(aVal);
// 				const bStr = String(bVal);

// 				return (
// 					dir *
// 					aStr.localeCompare(bStr, undefined, {
// 						sensitivity: 'base',
// 						numeric: true,
// 					})
// 				);
// 			});

// 			updateSearchParams({
// 				sortBy: sortConfig.key,
// 				sortOrder: sortConfig?.direction || 'asc',
// 			});

// 			// Save sorting preference
// 			localStorage.setItem('analyticsSort', JSON.stringify(sortConfig));
// 		}

// 		return data;
// 	}, [analyticsData.data, searchTerm, sortConfig, updateSearchParams]);

// 	const handleSearch = useCallback(() => {
// 		// Fast filtering without waiting for React state update
// 		const lower = searchRef.current.value?.trim().toLowerCase();
// 		if (!lower) {
// 			setFilteredData(analyticsData?.data);
// 			return;
// 		}

// 		// Schedule on next frame (60fps)
// 		requestAnimationFrame(() => {
// 			setFilteredData(
// 				analyticsData?.data.filter((item) =>
// 					item.category.toLowerCase().includes(lower)
// 				)
// 			);
// 		});
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [searchRef.current.value]);

// 	const handleCategoryChange = (category) => {
// 		setSelectedCategory(category);

// 		updateSearchParams({
// 			category,
// 			search: '', // reset search param
// 		});
// 		setSearchTerm('');
// 	};

// 	const onSearchChange = useCallback(
// 		(newValue) => {
// 			setSearchTerm(newValue);

// 			searchRef.current = newValue;

// 			// Update URL *after* filtering, during idle time
// 			if ('requestIdleCallback' in window) {
// 				requestIdleCallback(() => updateSearchParams({ search: newValue }));
// 			} else {
// 				setTimeout(() => updateSearchParams({ search: newValue }), 200);
// 			}
// 		},
// 		[updateSearchParams]
// 	);

// 	const handleDateFilter = (dateFilter) => {
// 		const { from, to } = dateFilter;
// 		// refresh the params
// 		updateSearchParams({ from, to });
// 		setDateRange({ from, to });
// 	};

// 	return {
// 		categories: CATEGORIES,
// 		selectedCategory,
// 		setSelectedCategory,
// 		onSearchChange,
// 		handleCategoryChange,
// 		searchTerm,
// 		setSearchTerm,
// 		sortConfig,
// 		handleSort,
// 		summary: analyticsData?.summary || {},
// 		totals: analyticsData?.totalResults || 0,
// 		data: data || processedData,
// 		handleDateFilter,
// 		isLoading,
// 		isFetching,
// 		isError,
// 		error: error?.data?.message || 'Failed to fetch data',
// 	};
// };

export const useLeadAnalytics = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const urlCategory = searchParams.get('category');
	const urlSearch = searchParams.get('search');
	const urlFromDate = searchParams.get('from');
	const urlToDate = searchParams.get('to');

	// const savedSort = localStorage.getItem('analyticsSort');
	// const initialSort = savedSort
	// 	? JSON.parse(savedSort)
	// 	: { key: null, direction: 'asc' };

	const [selectedCategory, setSelectedCategory] = useState(
		urlCategory || CATEGORIES[0].value
	);
	const [searchTerm, setSearchTerm] = useState(urlSearch || '');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
	const [dateRange, setDateRange] = useState(() => {
		if (urlFromDate && urlToDate) return { from: urlFromDate, to: urlToDate };
		const to = new Date();
		const from = new Date();
		from.setDate(to.getDate() - 30);
		return { from: formatDate(from), to: formatDate(to) };
	});

	const [data, setData] = useState([]);
	const searchRef = useRef('');

	const params = useMemo(
		() => ({
			category: selectedCategory,
			...(dateRange.from && { from: dateRange.from }),
			...(dateRange.to && { to: dateRange.to }),
		}),
		[selectedCategory, dateRange.from, dateRange.to]
	);

	const {
		data: analyticsData = [],
		isLoading,
		isFetching,
		isError,
		error,
	} = useFetchItemsQuery(
		{ path: '/lead_analytics/summary', params },
		{
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
			refetchOnFocus: true,
		}
	);

	useEffect(() => {
		if (analyticsData?.data && Array.isArray(analyticsData.data)) {
			setData(analyticsData.data);
		}
	}, [analyticsData]);

	// search + sorting in one pass
	const processedData = useMemo(() => {
		if (!data?.length) return [];

		let filtered = data;

		if (searchTerm) {
			const lower = normalizeSearch(searchTerm.trim());

			if (lower) {
				// real-time filtering without layout thrash
				filtered = filtered.filter((item) =>
					normalizeSearch(item.name).includes(lower)
				);
			}
		}

		if (sortConfig?.key) {
			const { key, direction } = sortConfig;
			const dir = direction === 'asc' ? 1 : -1;

			filtered = [...filtered].sort((a, b) => {
				const aVal = a[key];
				const bVal = b[key];
				if (typeof aVal === 'number' && typeof bVal === 'number')
					return dir * (aVal - bVal);
				return (
					dir *
					String(aVal).localeCompare(String(bVal), undefined, {
						sensitivity: 'base',
						numeric: true,
					})
				);
			});
		}

		return filtered;
	}, [data, searchTerm, sortConfig]);

	const handleSort = useCallback((key) => {
		setSortConfig((current) => {
			const next =
				current.key === key
					? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
					: { key, direction: 'asc' };

			// localStorage.setItem('analyticsSort', JSON.stringify(next));
			return next;
		});
	}, []);

	const updateSearchParams = useCallback(
		(updates = {}) => {
			setSearchParams((prev) => {
				const params = new URLSearchParams(prev);
				Object.entries(updates).forEach(([key, value]) => {
					if (!value) params.delete(key);
					else params.set(key, value);
				});
				return params;
			});
		},
		[setSearchParams]
	);

	const onSearchChange = useCallback(
		(value) => {
			setSearchTerm(value);
			searchRef.current = value;

			// Defer URL update (non-blocking)
			if ('requestIdleCallback' in window)
				requestIdleCallback(() => updateSearchParams({ search: value }));
			else setTimeout(() => updateSearchParams({ search: value }), 50);
		},
		[updateSearchParams]
	);

	const handleCategoryChange = useCallback(
		(category) => {
			setSelectedCategory(category);
			setSearchTerm('');
			updateSearchParams({ category, search: '' });
		},
		[updateSearchParams]
	);

	const handleDateFilter = useCallback(
		({ from, to }) => {
			updateSearchParams({ from, to });
			setDateRange({ from, to });
		},
		[updateSearchParams]
	);

	return {
		categories: CATEGORIES,
		selectedCategory,
		setSelectedCategory,
		onSearchChange,
		handleCategoryChange,
		searchTerm,
		sortConfig,
		handleSort,
		summary: analyticsData?.summary || {},
		totals: analyticsData?.totalResults || 0,
		data: processedData,
		handleDateFilter,
		dateRange,
		isLoading,
		isFetching,
		isError,
		error: error?.data?.message || 'Failed to fetch data',
	};
};
