import { useFetchItemsQuery } from 'api/apiSlice';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setOnlineUsers } from '../../../../redux/onlineUsersSlice';
import { cleanSearchParams } from 'utils';

export const useFetchUsers = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchString = searchParams.toString();

	const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

	const { hasPermission } = usePermissions();

	const dispatch = useDispatch();

	// check  all agencies permission
	const isAgenciesAllowed = hasPermission('users', 'all_agencies') || true;

	const initialAgencyId = isAgenciesAllowed ? searchParams.get('agency') : null;

	const initialPage = Number(searchParams.get('page')) || 1;
	const initialLimit = Number(searchParams.get('limit')) || 20;

	const [list, setList] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [agencyId, setAgencyId] = useState(initialAgencyId);
	const [pagination, setPagination] = useState({
		page: initialPage,
		limit: initialLimit,
	});

	const [filters, setFilters] = useState({});

	// stable queryParams (memoized)
	const queryParams = useMemo(() => {
		const raw = {
			page: pagination.page,
			limit: pagination.limit,
			agency: agencyId || agencies[agencies]?._id,
			...(filters?.userId && { userId: filters.userId }),
			...(filters?.role && { role: filters.role }),
			...(filters?.search && { search: filters.search }),
		};
		return cleanSearchParams(raw);
	}, [pagination.page, pagination.limit, agencies, agencyId, filters]);

	// sync queryParams -> URL (loop proof)
	useEffect(() => {
		const nextString = new URLSearchParams(queryParams).toString();
		if (nextString !== searchString) {
			setSearchParams(queryParams);
		}
	}, [queryParams, searchString, setSearchParams]);

	// --- Fetching Data ---
	const fetchResult = useFetchItemsQuery(
		{ path: '/v3/users', params: queryParams },
		{
			refetchOnMountOrArgChange: false,
			refetchOnFocus: true,
			refetchOnReconnect: true,
		}
	);

	const { data, isLoading, isFetching, refetch } = fetchResult;

	const { data: onlineUsers } = useFetchItemsQuery(
		{ path: '/v2/user/online-users' },
		{
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
			refetchOnFocus: true,
		}
	);

	useEffect(() => {
		if (onlineUsers) {
			dispatch(setOnlineUsers(onlineUsers));
		}
	}, [onlineUsers, dispatch]);

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

	// const refetchSummary = useCallback(() => {
	// 	refetch();
	// }, [refetch]);

	const updateData = (id, updated, type = 'update') => {
		const updatedAgencyId = updated?.agency?._id;
		const filterActive = Boolean(agencyId);
		const violatesFilter = filterActive && updatedAgencyId !== agencyId;

		setList((prev) => {
			// Find index once instead of mapping multiple times
			const index = prev.findIndex((item) => item._id === id);

			// console.log({ index, id, updated });

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

		// data + meta
		data: list ?? [],
		setData: setList,
		totalPages: data?.pagination?.totalPages ?? 0,
		totalRecords: totalCount ?? 0,

		// filters
		agencyId,
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

		//Filters
		filters,
		setFilters,
	};
};
