import { useFetchItemsQuery } from 'api/apiSlice';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

// -------------------------------
// Utility
// -------------------------------
const cleanParams = (obj) => {
	return Object.fromEntries(
		Object.entries(obj).filter(
			([_, v]) => v !== undefined && v !== null && v !== ''
		)
	);
};

export const useCashListing = ({ endpoint }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchString = searchParams.toString();

	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

	const { hasPermission } = usePermissions();
	const { user } = useUserSession();

	// check  all agencies permission
	const isAgenciesAllowed = hasPermission('expense', 'all_agencies');

	// derive initial values from URL (stable on first render)
	const initialMonth =
		Number(searchParams.get('month')) || new Date().getMonth() + 1;
	const initialYear =
		Number(searchParams.get('year')) || new Date().getFullYear();
	const initialAgencyId = isAgenciesAllowed ? searchParams.get('agency') : null;
	const initialPage = Number(searchParams.get('page')) || 1;
	const initialLimit = Number(searchParams.get('limit')) || 10;

	const [month, setMonth] = useState(initialMonth);
	const [list, setList] = useState([]);
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
			agency: isAgenciesAllowed
				? agencyId || undefined
				: user?.agency?._id || undefined,
		};
		return cleanParams(raw);
	}, [
		pagination.page,
		pagination.limit,
		month,
		year,
		isAgenciesAllowed,
		agencyId,
		user?.agency?._id,
	]);

	// sync queryParams -> URL (loop proof)
	useEffect(() => {
		const nextString = new URLSearchParams(queryParams).toString();
		if (nextString !== searchString) {
			setSearchParams(queryParams, { replace: true });
		}
	}, [queryParams, searchString, setSearchParams]);

	// --- Fetching Data from dynamic endPoints---
	const fetchResult = useFetchItemsQuery(
		{ path: endpoint, params: queryParams },
		{ refetchOnMountOrArgChange: true }
	);

	const { data, isLoading, isFetching, refetch } = fetchResult;

	const {
		data: summary,
		isLoading: summaryLoading,
		isFetching: summaryFetching,
		refetch: refetchSummary,
	} = useFetchItemsQuery(
		{
			path: `finance/reports/monthly-summary`,
			params: {
				month,
				year,
				...(queryParams?.agency && { agency: queryParams.agency }),
			},
		},
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		if (data?.doc) {
			setList(data?.doc || []);
		}
	}, [data?.doc]);

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

	const updateData = (id, updated) => {
		setList((prev) => {
			const exists = prev.some((item) => item._id === id);
			if (exists) {
				// Update existing expense
				return prev.map((item) =>
					item._id === id ? { ...item, ...updated } : item
				);
			}
			// Add new expense if not found
			return [{ ...updated }, ...prev];
		});

		// refetch the real time data of summary
		refetchSummary();
	};

	const removeItem = (id) => {
		setList((prev) => prev.filter((item) => item._id !== id));
		refetchSummary();
	};

	return {
		// raw
		isAgenciesAllowed,
		agencies,
		queryParams,

		// data + meta
		data: list ?? [],
		summary: summary?.data ?? {},
		setData: setList,
		totalPages: data?.totalPages ?? 0,
		totalRecords: data?.totalRecords ?? 0,

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
		summaryLoading,
		summaryFetching,

		// helper functions
		handlePageChange,
		handlePageSize,
		onDateFilterChange,
		updateData,
		removeItem,
	};
};
