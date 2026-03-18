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

export const useSubStatus = (initialPage = 1, initialLimit = 20) => {
  const [subStatuses, setSubStatuses] = useState([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    q: "",
    parentId: "",
  });

  // Mutations
  const [createSubStatus, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateSubStatus, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteSubStatus, { isLoading: isDeleting }] = useDeleteItemMutation();

  // Query params
  const queryParams = useMemo(() => {
    const raw = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.q && { search: filters.q }),
      ...(filters.parentId && { parentId: filters.parentId }),
    };
    return cleanSearchParams(raw);
  }, [pagination.page, pagination.limit, filters.q, filters.parentId]);

  // Fetch sub statuses
  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    {
      path: "/lead/sub-status",
      params: queryParams,
    },
    {
      refetchOnMountOrArgChange: false,
    },
  );

  // Process data
  useEffect(() => {
    if (data?.doc) {
      const processedData = data.doc.map((item) => ({
        ...item,
        mainStatusId: item.mainStatus && item.mainStatus[0]?._id,
        mainStatusLabel: item.mainStatus && item.mainStatus[0]?.label,
        mainStatusValue: item.mainStatus && item.mainStatus[0]?.value,
        metaStatusId: item.metaStatus?._id,
        metaStatusLabel: item.metaStatus?.label || item.metaStatus?.key,
        metaStatusKey: item.metaStatus?.key,
      }));

      setSubStatuses(processedData);
      setTotalCount(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 0);
    }
  }, [data]);

  // Create sub status
  const createStatus = async (statusData) => {
    try {
      const response = await createSubStatus({
        path: "/lead/sub-status",
        body: statusData,
      }).unwrap();

      toast.success("Sub status created successfully");
      refetch();
      return response;
    } catch (error) {
      console.error("Error creating sub status:", error);
      toast.error(error?.data?.message || "Failed to create sub status");
      throw error;
    }
  };

  // Update sub status
  const updateStatus = async (id, statusData) => {
    try {
      const response = await updateSubStatus({
        path: `/lead/sub-status/${id}`,
        body: statusData,
      }).unwrap();

      toast.success("Sub status updated successfully");
      setSubStatuses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...statusData } : item,
        ),
      );

      return response;
    } catch (error) {
      console.error("Error updating sub status:", error);
      toast.error(error?.data?.message || "Failed to update sub status");
      throw error;
    }
  };

  // In useSubStatus.js, update the deleteStatus function:

  const deleteStatus = async (id, replacementStatusId = null) => {
    try {
      console.log(
        "Deleting sub status with ID:",
        id,
        "and replacement ID:",
        replacementStatusId,
      );

      // Prepare the request body
      const requestBody = {};
      if (replacementStatusId) {
        requestBody.replacementStatusId = replacementStatusId;
      }

      await deleteSubStatus({
        path: `/lead/sub-status/${id}`,
        body: requestBody, // Send replacement ID in body, not in URL
      }).unwrap();

      toast.success("Sub status deleted successfully");
      setSubStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);
      refetch();
    } catch (error) {
      console.error("Error deleting sub status:", error);
      toast.error(error?.data?.message || "Failed to delete sub status");
      throw error;
    }
  };
  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters((prev) => ({ ...prev, q: searchTerm }));
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

  const filterByParent = (parentId) => {
    setFilters((prev) => ({ ...prev, parentId }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (searchTerm) => {
    debouncedSearch(searchTerm);
  };

  return {
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
    filterByParent,
    handleSearch,
    createStatus,
    updateStatus,
    deleteStatus,
    refetch,
  };
};
