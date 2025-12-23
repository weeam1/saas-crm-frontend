import { useFetchItemsQuery } from 'api/apiSlice';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cleanSearchParams } from 'utils';

export const useClientListing = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchString = searchParams.toString();

	const initialPage = Number(searchParams.get('page')) || 1;
	const initialLimit = Number(searchParams.get('limit')) || 10;

	const [list, setList] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [pagination, setPagination] = useState({
		page: initialPage,
		limit: initialLimit,
	});

	const [filters, setFilters] = useState({});

	// stable queryParams (memoized)
	const queryParams = useMemo(() => {
		return cleanSearchParams({
			page: pagination.page,
			limit: pagination.limit,
			...(filters?.userId && { userId: filters.userId }),
			...(filters?.search && { search: filters.search }),
		});
	}, [pagination.page, pagination.limit, filters]);

	// sync queryParams -> URL (loop proof)
	useEffect(() => {
		const nextString = new URLSearchParams(queryParams).toString();
		if (nextString !== searchString) {
			setSearchParams(queryParams);
		}
	}, [queryParams, searchString, setSearchParams]);

	// --- Fetching Data ---
	const fetchResult = useFetchItemsQuery(
		{ path: '/listing/clients', params: queryParams },
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);

	const { data, isLoading, isFetching, refetch, error, isError } = fetchResult;

	useEffect(() => {
		if (data?.doc) {
			setList(data?.doc || []);
			setTotalCount(data?.pagination?.total || 0);
		}
	}, [data?.doc, data?.pagination?.total]);

	const handlePageChange = (page) => {
		setPagination((prev) => ({ ...prev, page: Number(page) }));
	};

	const handlePageSize = (limit) => {
		setPagination({ page: 1, limit: Number(limit) });
	};

	const onDateFilterChange = (value) => {
		const newMonth = Number(value.month);
		const newYear = Number(value.year);

		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const refetchEvaluations = useCallback(() => {
		refetch();
	}, [refetch]);

	const updateData = (id, updated, type = 'update') => {
		const violatesFilter = false;

		setList((prev) => {
			// Find index once instead of mapping multiple times
			const index = prev.findIndex((item) => item._id === id);

			// --- UPDATE logic ---
			if (type === 'update') {
				// If item doesn't exist, do nothing
				if (index === -1) return prev;

				// If agency filter is applied and new agency doesn't match -> remove it
				if (violatesFilter) {
					const next = [...prev];
					next.splice(index, 1);
					return next;
				}

				// Otherwise, update it in place
				const next = [...prev];
				next[index] = { ...next[index], ...updated };
				return next;
			}

			// --- ADD logic ---
			if (type === 'add') {
				// Only add on the first page
				if (pagination.page !== 1) return prev;

				// Respect filter — only add if matches or no filter
				if (violatesFilter) return prev;

				// If exists, update in place
				if (index !== -1) {
					const next = [...prev];
					next[index] = { ...next[index], ...updated };
					return next;
				}

				// Add new item at the top
				return [{ ...updated }, ...prev];
			}

			// If unknown type, return as-is
			return prev;
		});

		if (type === 'add' && !violatesFilter) {
			setTotalCount((prev) => prev + 1);
		}
	};

	const removeItem = (id) => {
		setList((prev) => prev.filter((item) => item._id !== id));

		setTotalCount((prev) => prev - 1);
	};

	return {
		// raw
		queryParams,

		refetchEvaluations,

		// data + meta
		data: list ?? [],
		setData: setList,
		totalPages: data?.pagination?.totalPages ?? 0,
		totalRecords: totalCount ?? 0,
		error,
		isError,

		// filters
		filters,
		setFilters,

		// pagination
		pagination,
		setPagination,

		// fetch
		isLoading,
		isFetching,
		refetch,

		// helper functions
		handlePageChange,
		handlePageSize,
		onDateFilterChange,
		updateData,
		removeItem,
	};
};
