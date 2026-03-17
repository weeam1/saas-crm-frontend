import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify"; // Changed to react-toastify
import { useSearchParams } from "react-router-dom";
import { cleanSearchParams } from "utils";
import debounce from "lodash/debounce";

export const useSubStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const isUpdatingFromEffect = useRef(false);

  const [subStatuses, setSubStatuses] = useState([]);
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    parentId: searchParams.get("parentId") || "",
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

  // Sync URL params
  useEffect(() => {
    if (isUpdatingFromEffect.current) {
      isUpdatingFromEffect.current = false;
      return;
    }

    const nextString = new URLSearchParams(queryParams).toString();

    if (nextString && nextString !== searchString) {
      isUpdatingFromEffect.current = true;
      setSearchParams(queryParams, { replace: true });
    }
  }, [queryParams, searchString, setSearchParams]);

  // Fetch sub statuses
  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    {
      path: "/lead/sub-status",
      params: queryParams,
    },
    {
      refetchOnMountOrArgChange: false,
      // skip: !filters.parentId || !queryParams.page,
    },
  );

  // Process data
  useEffect(() => {
    if (data?.doc) {
      // Process the data to make it easier to use in the UI
      const processedData = data.doc.map((item) => ({
        ...item,
        // Extract the first mainStatus (since it's an array)
        mainStatusId: item.mainStatus && item.mainStatus[0]?._id,
        mainStatusLabel: item.mainStatus && item.mainStatus[0]?.label,
        mainStatusValue: item.mainStatus && item.mainStatus[0]?.value,
        // Format metaStatus for easier access
        metaStatusId: item.metaStatus?._id,
        metaStatusLabel: item.metaStatus?.label || item.metaStatus?.key,
        metaStatusKey: item.metaStatus?.key,
      }));

      setSubStatuses(processedData);

      // Handle pagination data
      if (data.pagination) {
        setTotalCount(data.pagination.total || 0);
        setTotalPages(data.pagination.pages || 0);
      } else {
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 0);
      }
    } else {
      setSubStatuses([]);
    }
  }, [data]);

  // Create sub status
  const createStatus = async (statusData) => {
    try {
      const response = await createSubStatus({
        path: "/lead/sub-status",
        body: statusData,
      }).unwrap();

      // React-Toastify success toast
      toast.success("Sub status created successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      refetch();
      return response;
    } catch (error) {
      console.error("Error creating sub status:", error);

      // React-Toastify error toast
      toast.error(error?.data?.message || "Failed to create sub status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

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

      // React-Toastify success toast
      toast.success("Sub status updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Optimistic update
      setSubStatuses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...statusData } : item,
        ),
      );

      return response;
    } catch (error) {
      console.error("Error updating sub status:", error);

      // React-Toastify error toast
      toast.error(error?.data?.message || "Failed to update sub status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      throw error;
    }
  };

  // Delete sub status
  const deleteStatus = async (id) => {
    try {
      await deleteSubStatus({
        path: `/lead/sub-status/${id}`,
      }).unwrap();

      // React-Toastify success toast
      toast.success("Sub status deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Optimistic delete
      setSubStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);

      // Refetch to ensure data consistency
      refetch();
    } catch (error) {
      console.error("Error deleting sub status:", error);

      // React-Toastify error toast
      toast.error(error?.data?.message || "Failed to delete sub status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

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

  // Filter by parent
  const filterByParent = (parentId) => {
    setFilters((prev) => ({ ...prev, parentId }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Search handler
  const handleSearch = (searchTerm) => {
    debouncedSearch(searchTerm);
  };

  return {
    // Data
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
    filterByParent,
    handleSearch,

    // CRUD
    createStatus,
    updateStatus,
    deleteStatus,
    refetch,
  };
};
