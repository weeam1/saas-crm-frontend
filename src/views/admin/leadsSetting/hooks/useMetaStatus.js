import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";
import { cleanSearchParams } from "utils";
import debounce from "lodash/debounce";

export const useMetaStatus = (initialPage = 1, initialLimit = 20) => {
  const [metaStatuses, setMetaStatuses] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ q: "" });

  // Mutations with loading states
  const [createMetaStatus, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateMetaStatus, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteMetaStatus, { isLoading: isDeleting }] = useDeleteItemMutation();

  // Query params
  const queryParams = useMemo(() => {
    const raw = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.q && { search: filters.q }),
    };
    return cleanSearchParams(raw);
  }, [pagination.page, pagination.limit, filters.q]);

  // Fetch meta statuses
  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    {
      path: "/lead/meta-status",
      params: queryParams,
    },
    {
      refetchOnMountOrArgChange: false,
    },
  );

  // Process data
  useEffect(() => {
    if (data?.doc) {
      setMetaStatuses(data.doc || []);
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 0);
    }
  }, [data]);

  // Create meta status
  const createStatus = async (statusData) => {
    try {
      const response = await createMetaStatus({
        path: "/lead/meta-status",
        body: statusData,
      }).unwrap();

      toast.success("Meta status created successfully");
      refetch();
      return response;
    } catch (error) {
      console.error("Error creating meta status:", error);
      toast.error(error?.data?.message || "Failed to create meta status");
      throw error;
    }
  };

  // Update meta status
  const updateStatus = async (id, statusData) => {
    try {
      const response = await updateMetaStatus({
        path: `/lead/meta-status/${id}`,
        body: statusData,
      }).unwrap();

      toast.success("Meta status updated successfully");
      setMetaStatuses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...statusData } : item,
        ),
      );

      return response;
    } catch (error) {
      console.error("Error updating meta status:", error);
      toast.error(error?.data?.message || "Failed to update meta status");
      throw error;
    }
  };

  // Delete meta status
  const deleteStatus = async (id) => {
    try {
      await deleteMetaStatus({
        path: `/lead/meta-status/${id}`,
      }).unwrap();

      toast.success("Meta status deleted successfully");
      setMetaStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);
      refetch();
    } catch (error) {
      console.error("Error deleting meta status:", error);
      toast.error(error?.data?.message || "Failed to delete meta status");
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

  const handleSearch = (searchTerm) => {
    debouncedSearch(searchTerm);
  };

  return {
    metaStatuses,
    isLoading: isLoading || isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    pagination,
    totalPages,
    totalCount,
    handlePageChange,
    handlePageSizeChange,
    filters,
    handleSearch,
    createStatus,
    updateStatus,
    deleteStatus,
    refetch,
  };
};
