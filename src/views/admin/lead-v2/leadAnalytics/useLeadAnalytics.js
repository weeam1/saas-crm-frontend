import { useFetchItemsQuery } from 'api/apiSlice';
import { useState, useMemo } from 'react';
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

	const [selectedCategory, setSelectedCategory] = useState(
		urlCategory || CATEGORIES[0].value
	);
	const [searchTerm, setSearchTerm] = useState(urlSearch || '');
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
			leadCount: item.leadCount || 0,
			deals: item.deals || 0,
			releasedLeads: item.releasedLeads || 0,
			interestedLeads: item.interestedLeads || 0,
			notInterestedLeads: item.notInterestedLeads || 0,
			newLeadsToday: item.newLeadsToday || 0,
			newLeadsThisWeek: item.newLeadsThisWeek || 0,
			newLeadsThisMonth: item.newLeadsThisMonth || 0,
			avgResponseTime: item.avgResponseTime || 'N/A',
			dealConversionRate: item.dealConversionRate || 0,
		}));

		// Apply search filter (real-time, case-insensitive)
		if (searchTerm.trim() !== '') {
			const lower = searchTerm.toLowerCase();
			data = data.filter((item) => item.category.toLowerCase().includes(lower));
		}

		// Apply sorting
		if (sortConfig.key) {
			data = [...data].sort((a, b) => {
				const aVal = a[sortConfig.key];
				const bVal = b[sortConfig.key];

				// Numeric sort if both values are numbers
				if (typeof aVal === 'number' && typeof bVal === 'number') {
					return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
				}

				// String sort fallback
				return sortConfig.direction === 'asc'
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		}

		return data;
	}, [analyticsData, searchTerm, sortConfig]);

	const handleCategoryChange = (category) => {
		setSelectedCategory(category);

		// Update the URL search param
		const newParams = new URLSearchParams(searchParams);

		newParams.delete('search');
		newParams.set('category', category);

		setSearchParams(newParams);
		setSearchTerm('');
	};

	const handleSearchChange = (value) => {
		setSearchTerm(value);

		// Update the URL search param
		const newParams = new URLSearchParams(searchParams);
		newParams.set('search', value);
		setSearchParams(newParams);
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
