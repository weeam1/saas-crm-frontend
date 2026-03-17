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

export const useSubStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const toast = useToast();
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
      skip: !filters.parentId || !queryParams.page,
    },
  );

  // Process data
  useEffect(() => {
    if (data?.doc) {
      setSubStatuses(data.doc);
      setTotalCount(data.total || 0);
      setTotalPages(data.totalPages || 0);
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

      toast({
        title: "Success",
        description: "Sub status created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refetch();
      return response;
    } catch (error) {
      console.error("Error creating sub status:", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to create sub status",
        status: "error",
        duration: 3000,
        isClosable: true,
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

      toast({
        title: "Success",
        description: "Sub status updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
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
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update sub status",
        status: "error",
        duration: 3000,
        isClosable: true,
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

      toast({
        title: "Success",
        description: "Sub status deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Optimistic delete
      setSubStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting sub status:", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete sub status",
        status: "error",
        duration: 3000,
        isClosable: true,
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
