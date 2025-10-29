import { useState, useEffect, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { formattedDate } from './../../../utils/helpers';
import { leadLabels } from 'utils/searchLabels';
import { mainLeadStatusLabels, leadStatusLabels } from 'utils/searchLabels';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 200;

// const usePaginationParams = (DEFAULT_PAGE = 1, DEFAULT_PAGE_SIZE = 32) => {
// 	const [searchParams, setSearchParams] = useSearchParams();

// 	const initialPage = Number(searchParams.get('page')) || DEFAULT_PAGE;
// 	const initialPageSize =
// 		Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE;
// 	const [currentPage, setCurrentPage] = useState(initialPage);
// 	const [pageSize, setPageSize] = useState(initialPageSize);

// 	useEffect(() => {
// 		const pageParam = Number(searchParams.get('page')) || DEFAULT_PAGE;
// 		const pageSizeParam =
// 			Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE;
// 		if (pageParam !== currentPage) {
// 			setCurrentPage(pageParam);
// 		}
// 		if (pageSizeParam !== pageSize) {
// 			setPageSize(pageSizeParam);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [searchParams]);

// 	useEffect(() => {
// 		if (
// 			searchParams.get('page') !== String(currentPage) ||
// 			searchParams.get('pageSize') !== String(pageSize)
// 		) {
// 			setSearchParams({ page: currentPage, pageSize });
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [currentPage, pageSize]);

// 	return { currentPage, setCurrentPage, pageSize, setPageSize };
// };
// *******************

const safeJSONParse = (value) => {
	try {
		return JSON.parse(value);
	} catch (error) {
		// fallback: check for pipe-delimited dates
		if (typeof value === 'string' && value.includes('|')) {
			return value.split('|').map((v) => v.trim());
		}
		console.error('Invalid JSON format:', value, error);
		return null; // Return null if parsing fails
	}
};

export const useFilteredQueryParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const isEffectTriggered = useRef(false);

	const getPageParams = () => {
		try {
			const page = parseInt(searchParams.get('page'), 10);
			const pageSize = parseInt(searchParams.get('pageSize'), 10);

			return {
				page: Number.isNaN(page) || page < 1 ? DEFAULT_PAGE : page,
				pageSize:
					Number.isNaN(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE
						? DEFAULT_PAGE_SIZE
						: pageSize,
			};
		} catch (error) {
			console.error('Error parsing pagination params:', error);
			return { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE };
		}
	};

	const initialParams = getPageParams();
	const [currentPage, setCurrentPage] = useState(initialParams.page);
	const [pageSize, setPageSize] = useState(initialParams.pageSize);
	const [queryParams, setQueryParams] = useState(null);
	const [searchTags, setSearchTags] = useState([]);
	const [searchClear, setSearchClear] = useState(false);
	const [refetchLoading, setRefetchLoading] = useState(false);

	const leads = useSelector((state) => state.leads, shallowEqual);

	const tree = useSelector((state) => state.user.tree);

	const updateSearchParams = (params) => {
		setSearchParams(() => {
			const updatedParams = new URLSearchParams();

			// Only add keys that exist in new params
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					updatedParams.set(
						key,
						typeof value === 'object' ? JSON.stringify(value) : value
					);
				}
			});

			return updatedParams;
		});

		setQueryParams(params);
	};

	useEffect(() => {
		const { page, pageSize } = getPageParams();
		let updatedParams = { page, pageSize };

		const lead = searchParams.get('lead');

		if (lead) {
			updatedParams.lead = lead;
			setSearchClear(true);
		}

		const invite = searchParams.get('invite');

		if (invite) {
			updatedParams.invite = invite;
			setSearchClear(true);
		}

		// Handle 'data' parameter
		const dataParam = searchParams.get('data');
		if (dataParam) {
			const parsedData = safeJSONParse(dataParam);
			if (parsedData) {
				updatedParams.data = dataParam;
				setSearchTags(generateSearchTags(parsedData, searchTags, tree));
				setSearchClear(true);
			} else {
				searchParams.delete('data');
			}
		}

		const statusFilters = searchParams.get('statusFilters');
		if (statusFilters) {
			const parsedStatusFilters = safeJSONParse(statusFilters);
			if (parsedStatusFilters.statuses || parsedStatusFilters.mainStatuses) {
				updatedParams.statusFilters = statusFilters;
				setSearchTags([]);
				setSearchClear(false);
			} else {
				searchParams.delete('statusFilters');
			}
		}

		// Handle 'search' parameter
		const searchParam = searchParams.get('search');
		if (searchParam) {
			const parsedSearch = searchParam;
			if (parsedSearch) {
				updatedParams.search = searchParam;
				setSearchTags(generateSearchTags(updatedParams, searchTags));
				setSearchClear(true);
			} else {
				searchParams.delete('search');
			}
		}

		// Handle 'dateTime' parameter
		const datetimeParam = searchParams.get('dateTime');
		if (datetimeParam) {
			const parsedDatetime =
				safeJSONParse(datetimeParam) || datetimeParam.split('|');
			if (Array.isArray(parsedDatetime) && parsedDatetime.length === 2) {
				updatedParams.dateTime = datetimeParam;
				setSearchTags(
					generateSearchTags(
						{ from: parsedDatetime[0], to: parsedDatetime[1] },
						searchTags
					)
				);
				setSearchClear(true);
			} else {
				searchParams.delete('dateTime');
			}
		}

		// If parameters have changed, update state & URL
		if (JSON.stringify(queryParams) !== JSON.stringify(updatedParams)) {
			updateSearchParams(updatedParams);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	useEffect(() => {
		const pageFromParams = Number(searchParams.get('page'));
		const pageSizeFromParams = Number(searchParams.get('pageSize'));

		if (isEffectTriggered.current) {
			isEffectTriggered.current = false;
			return;
		}

		// Only update searchParams if they are different
		if (pageFromParams !== currentPage || pageSizeFromParams !== pageSize) {
			// updateSearchParams({ page: currentPage, pageSize });

			updateSearchParams({
				...Object.fromEntries(searchParams.entries()),
				page: currentPage,
				pageSize,
			});
		}

		// if (pageSizeFromParams !== pageSize) {
		// 	setCurrentPage(1);
		// 	setPageSize(pageSizeFromParams || DEFAULT_PAGE_SIZE);
		// }

		// If pageSize changes, reset to page 1
		// if (pageSizeFromParams !== pageSize) {
		// 	// Use a callback to ensure state updates first
		// 	setTimeout(() => {
		// 		updateSearchParams({
		// 			...Object.fromEntries(searchParams.entries()),
		// 			page: 1,
		// 			pageSize,
		// 		});
		// 	}, 0);
		// } else if (pageFromParams !== currentPage) {
		// 	updateSearchParams({
		// 		...Object.fromEntries(searchParams.entries()),
		// 		page: currentPage,
		// 		pageSize,
		// 	});
		// }

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, pageSize]);

	const setSearchQueryParams = (params) => {
		// const updatedParams = { ...queryParams, ...params, page: 1, pageSize };
		const updatedParams = {
			...params,
			page: 1,
			pageSize: params.pageSize || leads?.pageSize || pageSize,
		};
		isEffectTriggered.current = true;

		setCurrentPage(1);
		updateSearchParams(updatedParams);
	};

	const clearSearchParams = () => {
		setSearchParams({
			page: 1 || leads?.currentPage || DEFAULT_PAGE,
			pageSize: leads?.pageSize || pageSize || DEFAULT_PAGE_SIZE,
		});
		setQueryParams({
			page: 1 || leads?.currentPage || DEFAULT_PAGE,
			pageSize: leads?.pageSize || pageSize || DEFAULT_PAGE_SIZE,
		});
	};

	return {
		leads,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		queryParams,
		setQueryParams: updateSearchParams,
		setSearchQueryParams,
		searchTags,
		setSearchTags,
		searchClear,
		setSearchClear,
		clearSearchParams,
		refetchLoading,
		setRefetchLoading,
	};
};

export const generateSearchTags = (filters, prevTags = [], tree) => {
	const tags = [];

	if (filters.search) tags.push(`Search: ${filters.search}`);
	if (filters.from) tags.push(`Start: ${formattedDate(filters.from)}`);
	if (filters.to) tags.push(`End: ${formattedDate(filters.to)}`);

	if (tree) {
		Object.entries(filters).forEach(([key, value]) => {
			let displayValue = value;

			if (key === 'fromLeadScore' || key === 'toLeadScore') {
				displayValue = `${filters.fromLeadScore || 0}-${filters.toLeadScore || 'max'}`;
			}
			if (key === 'leadStatus') {
				displayValue =
					value === 'active'
						? 'Interested'
						: value === 'pending'
							? 'Not Interested'
							: leadStatusLabels[value];
			}
			if (key === 'eLeadStatus') {
				displayValue =
					value === '-1' ? 'No E.Status' : mainLeadStatusLabels[value];
			}
			if (key === 'agentAssigned') {
				const agentsArray = Object.values(tree.agents).flatMap(
					(managerArray) => managerArray
				);
				const assignedAgent = agentsArray.find(
					(agent) => agent?._id?.toString() === value
				);
				displayValue = assignedAgent
					? `${assignedAgent.firstName} ${assignedAgent.lastName}`
					: value === '-1'
						? 'No Agent'
						: value;
			}
			if (key === 'managerAssigned') {
				const assignedManager = tree.managers.find(
					(user) => user?._id?.toString() === value
				);
				displayValue = assignedManager
					? `${assignedManager.firstName} ${assignedManager.lastName}`
					: value === '-1'
						? 'No Manager'
						: value;
			}

			// if (key === 'intID') key = 'Lead ID';

			tags.push(`${leadLabels[key]}: ${displayValue}`);
		});
	}

	return tags;
};

export default useFilteredQueryParams;
