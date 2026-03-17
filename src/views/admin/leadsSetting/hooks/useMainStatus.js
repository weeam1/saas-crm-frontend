import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify"; // This is react-toastify
import { useSearchParams } from "react-router-dom";
import { cleanSearchParams } from "utils";
import debounce from "lodash/debounce";

export const useMainStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchString = searchParams.toString();
  const isFirstRender = useRef(true);
  const isUpdatingFromEffect = useRef(false);
  const prevParamsRef = useRef("");

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

  // API Query params - includes all parameters needed for the API
  const apiQueryParams = useMemo(() => {
    const raw = {
      page: pagination.page,
      limit: pagination.limit,
      ...(filters.q && { search: filters.q }),
      includeSubStatuses: true,
    };
    return cleanSearchParams(raw);
  }, [pagination.page, pagination.limit, filters.q]);

  // URL params - only parameters that should be in the URL (excludes includeSubStatuses)
  const urlParams = useMemo(() => {
    const raw = {
      ...(pagination.page !== 1 && { page: pagination.page }),
      ...(pagination.limit !== 20 && { limit: pagination.limit }),
      ...(filters.q && { q: filters.q }),
    };
    return cleanSearchParams(raw);
  }, [pagination.page, pagination.limit, filters.q]);

  // Sync URL params - using urlParams instead of queryParams
  useEffect(() => {
    // Skip if this update is triggered by URL change
    if (isUpdatingFromEffect.current) {
      isUpdatingFromEffect.current = false;
      return;
    }

    const nextString = new URLSearchParams(urlParams).toString();

    // Only update if the string is different
    if (nextString !== prevParamsRef.current && nextString !== searchString) {
      prevParamsRef.current = nextString;
      isUpdatingFromEffect.current = true;

      if (nextString) {
        setSearchParams(urlParams, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }
  }, [urlParams, searchString, setSearchParams]);

  // Fetch main statuses - using apiQueryParams
  const { data, isLoading, isFetching, refetch } = useFetchItemsQuery(
    {
      path: "/lead/main-status",
      params: apiQueryParams,
    },
    {
      refetchOnMountOrArgChange: false,
      skip: !apiQueryParams.page, // Skip if no page param
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

  // Initialize from URL params on mount
  useEffect(() => {
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));
    const q = searchParams.get("q");

    setPagination({
      page: page || 1,
      limit: limit || 20,
    });

    if (q !== null) {
      setFilters({ q });
    }
  }, []); // Run only on mount

  // Create main status
  const createStatus = async (statusData) => {
    try {
      const response = await createMainStatus({
        path: "/lead/main-status",
        body: statusData,
      }).unwrap();

      // CORRECT react-toastify syntax
      toast.success("Main status created successfully", {
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
      console.error("Error creating main status:", error);

      // CORRECT react-toastify syntax for error
      toast.error(error?.data?.message || "Failed to create main status", {
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

      toast.success("Main status updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      return response;
    } catch (error) {
      console.error("Error updating main status:", error);

      toast.error(error?.data?.message || "Failed to update main status", {
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

  // Delete main status
  const deleteStatus = async (id) => {
    try {
      await deleteMainStatus({
        path: `/lead/main-status/${id}`,
      }).unwrap();

      // Optimistic delete
      setMainStatuses((prev) => prev.filter((item) => item._id !== id));
      setTotalCount((prev) => prev - 1);

      toast.success("Main status deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      refetch();
    } catch (error) {
      console.error("Error deleting main status:", error);

      toast.error(error?.data?.message || "Failed to delete main status", {
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
