import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";
import { cleanSearchParams } from "utils";

export const useMainStatus = (initialPage = 1, initialLimit = 20) => {
  const [mainStatuses, setMainStatuses] = useState([]);
  const [subStatuses, setSubStatuses] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({ q: "" });
  const [searchTerm, setSearchTerm] = useState(""); // For input value

  // Mutations
  const [createMainStatus, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateMainStatus, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteMainStatus, { isLoading: isDeleting }] = useDeleteItemMutation();

  // API Query params
  const apiQueryParams = useMemo(() => {
    const raw = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.q && { search: filters.q }),
      includeSubStatuses: true,
    };
    return cleanSearchParams(raw);
  }, [pagination.page, pagination.limit, filters.q]);

  // Fetch main statuses
  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    {
      path: "/lead/main-status",
      params: apiQueryParams,
    },
    {
      refetchOnMountOrArgChange: false,
    },
  );

  // Process data
  useEffect(() => {
    if (data?.doc) {
      const mainData = data.doc.map((status) => ({
        ...status,
        id: status._id,
        statuses: status.statuses || [],
      }));

      setMainStatuses(mainData);

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
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 0);
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

      toast.success("Main status created successfully");
      refetch();
      return response;
    } catch (error) {
      console.error("Error creating main status:", error);
      toast.error(error?.data?.message || "Failed to create main status");
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

      setMainStatuses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...statusData } : item,
        ),
      );

      toast.success("Main status updated successfully");
      return response;
    } catch (error) {
      console.error("Error updating main status:", error);
      toast.error(error?.data?.message || "Failed to update main status");
      throw error;
    }
  };

  const deleteStatus = async (id, replacementStatusId = null) => {
    try {
      console.log(
        "Deleting main status with ID:",
        id,
        "and replacement ID:",
        replacementStatusId,
      );

      const requestBody = {};
      if (replacementStatusId) {
        requestBody.replacementStatusId = replacementStatusId;
      }

      await deleteMainStatus({
        path: `/lead/main-status/${id}`,
        body: requestBody,
      }).unwrap();

      setMainStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);

      toast.success("Main status deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting main status:", error);
      toast.error(error?.data?.message || "Failed to delete main status");
      throw error;
    }
  };

  // Handle search when button is clicked or Enter is pressed
  const handleSearch = (searchQuery) => {
    const trimmed = searchQuery?.trim() || "";

    // Update filters with the search term
    setFilters({ q: trimmed });
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Update searchTerm state (for input value only, doesn't trigger search)
  const handleSearchTermChange = (value) => {
    setSearchTerm(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setFilters({ q: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (limit) => {
    setPagination({ page: 1, limit });
  };

  return {
    mainStatuses,
    subStatuses,
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
    createStatus,
    updateStatus,
    deleteStatus,
    refetch,
    setMainStatuses,
    searchTerm,
    handleSearchTermChange,
    handleSearch, // Add this for triggering search
    clearSearch, // Add this for clearing search
  };
};
