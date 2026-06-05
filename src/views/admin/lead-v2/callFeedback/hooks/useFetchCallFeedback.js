import { useFetchItemsQuery } from "api/apiSlice";
import dayjs from "dayjs";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { cleanSearchParams } from "utils";

export const useFetchCallFeedback = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.toString();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 20;
  const [month, setMonth] = useState(
    searchParams.get("month") || dayjs().format("YYYY-MM"),
  );

  const [list, setList] = useState([]);
  const [stats, setStats] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
  });

  const [filters, setFilters] = useState({
    q: "", // Global search
    leadName: "",
    leadIntId: "",
    callMedium: "",
    callQuality: "",
    reason: "",
    extension: "",
  });

  // stable queryParams (memoized) - REMOVED __forceFetch
  const queryParams = useMemo(() => {
    const raw = {
      page: pagination.page,
      limit: pagination.limit,
      // Only include non-empty filters
      ...(month && { month }),
      ...(filters.q && { q: filters.q }),
      ...(filters.leadName && { leadName: filters.leadName }),
      ...(filters.leadIntId && { leadIntId: filters.leadIntId }),
      ...(filters.callMedium && { callMedium: filters.callMedium }),
      ...(filters.callQuality && { callQuality: filters.callQuality }),
      ...(filters.reason && { reason: filters.reason }),
      ...(filters.extension && { extension: filters.extension }),
    };
    return cleanSearchParams(raw);
  }, [pagination.page, pagination.limit, filters, month]);

  // sync queryParams -> URL (with debounce to prevent infinite loops)
  useEffect(() => {
    const nextString = new URLSearchParams(queryParams).toString();
    if (nextString !== searchString) {
      // Use replace instead of push to avoid adding to history
      setSearchParams(queryParams, { replace: true });
    }
  }, [queryParams, searchString, setSearchParams]);

  // --- Fetching Data ---
  const fetchResult = useFetchItemsQuery(
    {
      path: "/sipSetting/feedback",
      params: queryParams,
    },
    {
      refetchOnMountOrArgChange: false, // Changed to false to prevent auto refetch
      refetchOnFocus: false, // Changed to false to prevent refetch on focus
      refetchOnReconnect: false, // Changed to false to prevent refetch on reconnect
      skip: false,
    },
  );

  const { data, isLoading, isFetching, refetch } = fetchResult;

  useEffect(() => {
    console.log("API Data:", data);
    if (data?.doc) {
      setList(data.doc || []);
      setTotalCount(data?.total || 0);
      setStats(data);
    } else if (data) {
      // If data is directly the array
      setList(data || []);
      setTotalCount(data?.length || 0);
    } else {
      setList([]);
      setTotalCount(0);
    }
  }, [data]);

  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page: Number(page) }));
  }, []);

  const handlePageSize = useCallback((limit) => {
    setPagination({ page: 1, limit: Number(limit) });
  }, []);

  const updateData = useCallback(
    (id, updated, type = "update") => {
      setList((prev) => {
        const index = prev.findIndex((item) => item._id === id);

        if (type === "update") {
          if (index === -1) return prev;
          const next = [...prev];
          next[index] = { ...next[index], ...updated };
          return next;
        }

        if (type === "add") {
          if (pagination.page !== 1) return prev;
          if (index !== -1) {
            const next = [...prev];
            next[index] = { ...next[index], ...updated };
            return next;
          }
          return [{ ...updated }, ...prev];
        }

        return prev;
      });

      if (type === "add") {
        setTotalCount((prev) => prev + 1);
      }
    },
    [pagination.page],
  );

  const removeItem = useCallback((id) => {
    setList((prev) => prev.filter((item) => item._id !== id));
    setTotalCount((prev) => prev - 1);
  }, []);

  return {
    queryParams,
    data: list,
    setData: setList,
    totalPages:
      data?.totalPages || Math.ceil(totalCount / pagination.limit) || 0,
    totalRecords: totalCount,
    pagination,
    setPagination,
    isLoading,
    isFetching,
    refetch,
    handlePageChange,
    month,
    setMonth,
    handlePageSize,
    updateData,
    removeItem,
    filters,
    stats,
    setStats,
    setFilters,
  };
};
