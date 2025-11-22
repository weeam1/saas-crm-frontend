import { useFetchItemsQuery } from 'api/apiSlice';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { cleanSearchParams } from 'utils';

export const useEmployeePayroll = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchString = searchParams.toString();

	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

	const { hasPermission } = usePermissions();
	const { user } = useUserSession();

	// check  all agencies permission
	const isAgenciesAllowed = hasPermission('payroll', 'all_agencies');

	// derive initial values from URL (stable on first render)
	const initialMonth =
		Number(searchParams.get('month')) || new Date().getMonth() + 1;
	const initialYear =
		Number(searchParams.get('year')) || new Date().getFullYear();

	const initialAgencyId = isAgenciesAllowed
		? searchParams.get('agency') || agencies[0]?._id
		: user?.agency?._id;

	const initialPage = Number(searchParams.get('page')) || 1;
	const initialLimit = Number(searchParams.get('limit')) || 10;

	const [month, setMonth] = useState(initialMonth);
	const [list, setList] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [year, setYear] = useState(initialYear);
	const [agencyId, setAgencyId] = useState(initialAgencyId);
	const [pagination, setPagination] = useState({
		page: initialPage,
		limit: initialLimit,
	});

	// stable queryParams (memoized)
	const queryParams = useMemo(() => {
		const raw = {
			page: pagination.page,
			limit: pagination.limit,
			month,
			year,
			agency: agencyId || agencies[agencies]?._id,
		};
		return cleanSearchParams(raw);
	}, [pagination.page, pagination.limit, month, year, agencies, agencyId]);

	// sync queryParams -> URL (loop proof)
	useEffect(() => {
		const nextString = new URLSearchParams(queryParams).toString();
		if (nextString !== searchString) {
			setSearchParams(queryParams, { replace: true });
		}
	}, [queryParams, searchString, setSearchParams]);

	// --- Fetching Data ---
	const fetchResult = useFetchItemsQuery(
		{ path: '/payroll', params: queryParams },
		{
			skip: !agencyId || !month || !year,
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
		}
	);

	const { data, isLoading, isFetching, refetch } = fetchResult;

	useEffect(() => {
		if (data?.doc) {
			setList(data?.doc || []);
			setTotalCount(data?.total || 0);
		}
	}, [data?.doc, data?.total]);

	const handlePageChange = (page) => {
		setPagination((prev) => ({ ...prev, page: Number(page) }));
	};

	const handlePageSize = (limit) => {
		setPagination({ page: 1, limit: Number(limit) });
	};

	const onDateFilterChange = (value) => {
		const newMonth = Number(value.month);
		const newYear = Number(value.year);

		setMonth(newMonth);
		setYear(newYear);
	};

	const refetchSummary = useCallback(() => {
		refetch();
	}, [refetch]);

	const updateData = (id, updated, type = 'update') => {
		const updatedAgencyId = updated?.agency?._id;
		const filterActive = Boolean(agencyId);
		const violatesFilter = filterActive && updatedAgencyId !== agencyId;

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
		isAgenciesAllowed,
		agencies,
		queryParams,

		refetchSummary,

		// data + meta
		data: list ?? [],
		setData: setList,
		totalPages: data?.pages ?? 0,
		totalRecords: totalCount ?? 0,

		// filters
		month,
		year,
		agencyId,
		setMonth,
		setYear,
		setAgencyId,

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
