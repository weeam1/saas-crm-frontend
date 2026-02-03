import { useFetchItemsQuery } from 'api/apiSlice';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// -------------------------------
// Utility
// -------------------------------
const cleanParams = (obj) => {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, v]) => v !== undefined && v !== null && v !== '',
		),
	);
};

export const useLeadSettings = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchString = searchParams.toString();

	const initialPage = Number(searchParams.get('page')) || 1;
	const initialLimit = Number(searchParams.get('limit')) || 10;

	const [data, setData] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [pagination, setPagination] = useState({
		page: initialPage,
		limit: initialLimit,
	});

	// stable queryParams (memoized)
	const queryParams = useMemo(() => {
		const raw = {
			page: pagination.page,
			limit: pagination.limit,
		};
		return cleanParams(raw);
	}, [pagination.page, pagination.limit]);

	// sync queryParams -> URL (loop proof)
	useEffect(() => {
		const nextString = new URLSearchParams(queryParams).toString();
		if (nextString !== searchString) {
			setSearchParams(queryParams, { replace: true });
		}
	}, [queryParams, searchString, setSearchParams]);

	// --- Fetching Data from dynamic endPoints---
	const fetchResult = useFetchItemsQuery(
		{ path: `lead/user-lead-limits`, params: queryParams },
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
		},
	);

	const { data: leadSettings, refetch: refreshLeadSettings } =
		useFetchItemsQuery(
			{ path: `lead-settings` },
			{
				refetchOnMountOrArgChange: true,
				refetchOnFocus: true,
			},
		);

	const { data: response, isLoading, isFetching, refetch } = fetchResult;

	useEffect(() => {
		if (response?.doc) {
			setData(response?.doc || []);
			setTotalCount(response?.meta?.totalRecords || 0);
		}
	}, [response?.doc, response?.meta?.totalRecords]);

	const handlePageChange = (page) => {
		setPagination((prev) => ({ ...prev, page: Number(page) }));
	};

	const handlePageSize = (limit) => {
		setPagination({ page: 1, limit: Number(limit) });
	};

	const updateData = (id, updated, type = 'update') => {
		setData((prev) => {
			// Find index once instead of mapping multiple times
			const index = prev.findIndex((item) => item._id === id);

			// --- UPDATE logic ---
			if (type === 'update') {
				// If item doesn't exist, do nothing
				if (index === -1) return prev;

				// Otherwise, update it in place
				const next = [...prev];
				next[index] = { ...next[index], ...updated };

				return next;
			}

			// --- ADD logic ---
			if (type === 'add') {
				// Only add on the first page
				if (pagination.page !== 1) return prev;

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

		if (type === 'add') {
			setTotalCount((prev) => prev + 1);
		}
	};

	const removeItem = (id) => {
		setData((prev) => prev.filter((item) => item.user?._id !== id));
		setTotalCount((prev) => prev - 1);
	};

	return {
		// raw
		queryParams,

		// data + meta
		data: data ?? [],
		leadSettings: leadSettings?.doc ?? {},
		refreshLeadSettings,
		setData: setData,
		totalPages: response?.meta?.totalPages ?? 0,
		totalRecords: totalCount ?? 0,

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
		updateData,
		removeItem,
	};
};
