import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import { useToast } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { cleanSearchParams } from "utils";
import debounce from "lodash/debounce";

export const useMainStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const toast = useToast();
  const isFirstRender = useRef(true);
  const isUpdatingFromEffect = useRef(false);

  const [mainStatuses, setMainStatuses] = useState([]);
  const [subStatuses, setSubStatuses] = useState([]);
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
  });

  // Mutations
  const [createMainStatus, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateMainStatus, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteMainStatus, { isLoading: isDeleting }] = useDeleteItemMutation();

  // Query params - memoize based on state
  const queryParams = useMemo(() => {
    const raw = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.q && { search: filters.q }),
      includeSubStatuses: true,
    };
    return cleanSearchParams(raw);
  }, [pagination.page, pagination.limit, filters.q]);

  // Sync URL params - but only when queryParams actually change
  useEffect(() => {
    // Skip if this update is triggered by URL change
    if (isUpdatingFromEffect.current) {
      isUpdatingFromEffect.current = false;
      return;
    }

    const nextString = new URLSearchParams(queryParams).toString();

    // Only update if the string is different and not empty
    if (nextString && nextString !== searchString) {
      isUpdatingFromEffect.current = true;
      setSearchParams(queryParams, { replace: true });
    }
  }, [queryParams, searchString, setSearchParams]);

  // Fetch main statuses - use skip option to prevent unnecessary fetches
  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    {
      path: "/lead/main-status",
      params: queryParams,
    },
    {
      refetchOnMountOrArgChange: false, // Changed to false
      skip: !queryParams.page, // Skip if no page param
    },
  );

  // Process data
  useEffect(() => {
    if (data?.doc) {
      console.log("Main Status Data:", data);

      // Process main statuses
      const mainData = data.doc.map((status) => ({
        ...status,
        id: status._id,
        statuses: status.statuses || [],
      }));

      setMainStatuses(mainData);

      // Extract sub statuses
      const allSubStatuses = data.doc.flatMap((main) =>
        (main.statuses || []).map((sub) => ({
          ...sub,
          id: sub._id,
          parentId: main._id,
          parentLabel: main.label,
          parentValue: main.value,
        })),
      );

      setSubStatuses(allSubStatuses);
      setTotalCount(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } else {
      setMainStatuses([]);
      setSubStatuses([]);
    }
  }, [data]);

  // Create main status
  const createStatus = async (statusData) => {
    try {
      const response = await createMainStatus({
        path: "/lead/main-status",
        body: statusData,
      }).unwrap();

      refetch();
      return response;
    } catch (error) {
      console.error("Error creating main status:", error);
      throw error;
    }
  };

  // Update main status
  const updateStatus = async (id, statusData) => {
    try {
      const response = await updateMainStatus({
        path: `/lead/main-status/${id}`,
        body: statusData,
      }).unwrap();

      // Optimistic update
      setMainStatuses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...statusData } : item,
        ),
      );

      return response;
    } catch (error) {
      console.error("Error updating main status:", error);
      throw error;
    }
  };

  // Delete main status
  const deleteStatus = async (id) => {
    try {
      await deleteMainStatus({
        path: `/lead/main-status/${id}`,
      }).unwrap();

      // Optimistic delete
      setMainStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);

      refetch();
    } catch (error) {
      console.error("Error deleting main status:", error);
      throw error;
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters({ q: searchTerm });
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500),
    [],
  );

  // Pagination handlers
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit) => {
    setPagination({ page: 1, limit });
  };

  // Search handler
  const handleSearch = (searchTerm) => {
    debouncedSearch(searchTerm);
  };

  return {
    // Data
    mainStatuses,
    subStatuses,
    isLoading: isLoading || isFetching,
    isCreating,
    isUpdating,
    isDeleting,

    // Pagination
    pagination,
    totalPages,
    totalCount,
    handlePageChange,
    handlePageSizeChange,

    // Filters
    filters,
    handleSearch,

    // CRUD
    createStatus,
    updateStatus,
    deleteStatus,
    refetch,
  };
};
