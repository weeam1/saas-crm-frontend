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
  const [totalCount, setTotalCount] = useState(0);
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
      ...(filters && { ...filters }),
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
    { path: "/sipSetting/feedback", params: queryParams },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const { data, isLoading, isFetching, refetch } = fetchResult;

  useEffect(() => {
    console.log("API Data:", data); // Debug log
    if (data?.doc) {
      setList(data?.doc || []);
      // FIXED: Use data?.total instead of data?.pagination?.total
      setTotalCount(data?.total || 0);
    } else if (data) {
      // If data is directly the array
      setList(data || []);
      setTotalCount(data?.length || 0);
    }
  }, [data]);

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
    data: list ?? [],
    setData: setList,
    // FIXED: Use data?.totalPages directly
    totalPages: data?.totalPages ?? 0,
    totalRecords: totalCount ?? 0,
    pagination,
    setPagination,
    isLoading,
    isFetching,
    refetch,
    handlePageChange,
    handlePageSize,
    onDateFilterChange,
    updateData,
    removeItem,
    filters,
    setFilters,
  };
};
