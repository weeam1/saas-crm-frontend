import { useFetchItemsQuery } from "api/apiSlice";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cleanSearchParams } from "utils";

export const useFetchCallFeedback = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.toString();

  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 10;

  const [list, setList] = useState([]);
  const [stats, setStats] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
  });

  const [filters, setFilters] = useState({
    q: "", // Global search
    month: "", // Month filter in YYYY-MM format
    leadName: "",
    leadIntId: "",
    callMedium: "",
    callQuality: "",
    reason: "",
    // userId: "",
    extension: "",
  });

  // stable queryParams (memoized)
  const queryParams = useMemo(() => {
    const raw = {
      page: pagination.page,
      limit: pagination.limit,
      __forceFetch: Date.now(),
      // Only include non-empty filters
      ...(filters.q && { q: filters.q }),
      ...(filters.month && { month: filters.month }),
      ...(filters.leadName && { leadName: filters.leadName }),
      ...(filters.leadIntId && { leadIntId: filters.leadIntId }),
      ...(filters.callMedium && { callMedium: filters.callMedium }),
      ...(filters.callQuality && { callQuality: filters.callQuality }),
      ...(filters.reason && { reason: filters.reason }),
      // ...(filters.userId && { userId: filters.userId }),
      ...(filters.extension && { extension: filters.extension }),
    };

    return cleanSearchParams(raw);
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
    {
      path: "/sipSetting/feedback",
      params: queryParams,
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
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

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page: Number(page) }));
  };

  const handlePageSize = (limit) => {
    setPagination({ page: 1, limit: Number(limit) });
  };

  const updateData = (id, updated, type = "update") => {
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
  };

  const removeItem = (id) => {
    setList((prev) => prev.filter((item) => item._id !== id));
    setTotalCount((prev) => prev - 1);
  };

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
    handlePageSize,
    updateData,
    removeItem,
    filters,
    stats,
    setStats,
    setFilters,
  };
};
