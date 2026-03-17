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

export const useMetaStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const toast = useToast();
  const isUpdatingFromEffect = useRef(false);

  const [metaStatuses, setMetaStatuses] = useState([]);
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
  });
  console.log("MetaStatus filters:", metaStatuses);
  // Mutations
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

  // Sync URL params - but only when queryParams actually change
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

  // Fetch meta statuses
  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    {
      path: "/lead/meta-status",
      params: queryParams,
    },
    {
      refetchOnMountOrArgChange: false,
      skip: !queryParams.page,
    },
  );

  // Process data
  useEffect(() => {
    if (data?.doc) {
      console.log("Meta Status Data:", data);

      setMetaStatuses(data.doc || []);
      setTotalCount(data.pagination.total || 0);
      setTotalPages(data.pagination.pages || 0);
    }
  }, [data, pagination.limit]);

  // Create meta status
  const createStatus = async (statusData) => {
    try {
      const response = await createMetaStatus({
        path: "/lead/meta-status",
        body: statusData,
      }).unwrap();

      toast({
        title: "Success",
        description: "Meta status created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refetch();
      return response;
    } catch (error) {
      console.error("Error creating meta status:", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to create meta status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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

      toast({
        title: "Success",
        description: "Meta status updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Optimistic update
      setMetaStatuses((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...statusData } : item,
        ),
      );

      return response;
    } catch (error) {
      console.error("Error updating meta status:", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to update meta status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Delete meta status
  const deleteStatus = async (id) => {
    try {
      await deleteMetaStatus({
        path: `/lead/meta-status/${id}`,
      }).unwrap();

      toast({
        title: "Success",
        description: "Meta status deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Optimistic delete
      setMetaStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting meta status:", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete meta status",
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
    metaStatuses,
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
