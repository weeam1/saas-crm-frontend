// import { useDeleteItemMutation, useFetchItemsQuery } from "api/apiSlice";
// import { usePermissions } from "hooks/usePermissions";
// import useUserSession from "hooks/useUserSession";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { cleanSearchParams } from "utils";

// export const useTeams = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const agencies = useSelector((s) => (s.util && s.util.agencies) || []);
//   const { hasPermission } = usePermissions();
//   const { user } = useUserSession();
//   const isAgenciesAllowed = hasPermission("evaluation", "all_agencies");

//   // --- Extract initial values from URL ---
//   const initialMonth =
//     Number(searchParams.get("month")) || new Date().getMonth() + 1;
//   const initialYear =
//     Number(searchParams.get("year")) || new Date().getFullYear();
//   const initialAgencyId = isAgenciesAllowed ? searchParams.get("agency") : null;
//   const initialPage = Number(searchParams.get("page")) || 1;
//   const initialLimit = Number(searchParams.get("limit")) || 20;
//   const initialSearch = searchParams.get("search") || "";

//   // --- State for main evaluations ---
//   const [month, setMonth] = useState(initialMonth);
//   const [year, setYear] = useState(initialYear);
//   const [agencyId, setAgencyId] = useState(initialAgencyId);
//   const [filters, setFilters] = useState({});

//   // --- State for my evaluations ---
//   const [myFilters, setMyFilters] = useState({});

//   // --- Pagination states ---
//   const [pagination, setPagination] = useState({
//     page: initialPage,
//     limit: initialLimit,
//   });
//   const [myPagination, setMyPagination] = useState({
//     page: Number(searchParams.get("myPage")) || 1,
//     limit: Number(searchParams.get("myLimit")) || 20,
//   });

//   const [list, setList] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);

//   // --- Query params for main evaluations ---
//   const queryParams = useMemo(() => {
//     const params = {
//       page: pagination.page,
//       limit: pagination.limit,
//       month,
//       year,
//       agency: isAgenciesAllowed
//         ? agencyId || undefined
//         : user?.agency?._id || undefined,
//     };

//     // Add filters if they exist
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value && value !== "") {
//         params[key] = value;
//       }
//     });

//     return cleanSearchParams(params);
//   }, [
//     pagination.page,
//     pagination.limit,
//     month,
//     year,
//     isAgenciesAllowed,
//     agencyId,
//     user?.agency?._id,
//     filters,
//   ]);

//   // --- Query params for my evaluations ---
//   const myEvalParams = useMemo(() => {
//     const params = {
//       userId: user?._id,
//       page: myPagination.page,
//       limit: myPagination.limit,
//     };

//     // Add my filters if they exist
//     Object.entries(myFilters).forEach(([key, value]) => {
//       if (value && value !== "") {
//         params[key] = value;
//       }
//     });

//     return cleanSearchParams(params);
//   }, [user?._id, myPagination.page, myPagination.limit, myFilters]);

//   // --- Sync main evaluation filters to URL ---
//   useEffect(() => {
//     const params = new URLSearchParams();

//     // Add main evaluation params
//     if (month) params.set("month", month);
//     if (year) params.set("year", year);
//     if (agencyId && isAgenciesAllowed) params.set("agency", agencyId);
//     if (pagination.page && pagination.page > 1)
//       params.set("page", pagination.page);
//     if (pagination.limit && pagination.limit !== 20)
//       params.set("limit", pagination.limit);

//     // Add main filters
//     Object.entries(filters).forEach(([key, value]) => {
//       if (value && value !== "") {
//         params.set(key, value);
//       }
//     });

//     // Add my evaluation params (with prefixes to avoid conflicts)
//     if (myPagination.page && myPagination.page > 1)
//       params.set("page", myPagination.page);
//     if (myPagination.limit && myPagination.limit !== 20)
//       params.set("limit", myPagination.limit);
//     if (myFilters.search) params.set("search", myFilters.search);

//     // Only update if changed
//     const newSearchString = params.toString();
//     if (newSearchString !== searchParams.toString()) {
//       setSearchParams(params);
//     }
//   }, [
//     month,
//     year,
//     agencyId,
//     isAgenciesAllowed,
//     pagination,
//     filters,
//     myPagination,
//     myFilters,
//     searchParams,
//     setSearchParams,
//   ]);

//   // --- Fetch main evaluations ---
//   const fetchResult = useFetchItemsQuery(
//     { path: "/evaluation/teams", params: queryParams },
//     {
//       refetchOnMountOrArgChange: true,
//       refetchOnFocus: true,
//       refetchOnReconnect: true,
//     },
//   );

//   // --- Fetch my evaluations ---
//   const fetchResultMyEval = useFetchItemsQuery(
//     { path: "/evaluation/users/per-user", params: myEvalParams },
//     {
//       skip: !user?._id,
//       refetchOnMountOrArgChange: true,
//       refetchOnFocus: true,
//       refetchOnReconnect: true,
//     },
//   );

//   const { data, isLoading, isFetching, refetch } = fetchResult;
//   const {
//     data: myEvaluations,
//     isLoading: myEvaluationsLoading,
//     isFetching: myEvaluationsFetching,
//     refetch: refetchMyEvaluations,
//   } = fetchResultMyEval;

//   // --- Update list and total count ---
//   useEffect(() => {
//     if (data?.doc) {
//       setList(data.doc);
//       setTotalCount(data.total || 0);
//     }
//   }, [data?.doc, data?.total]);

//   // --- Pagination handlers ---
//   const handlePageChange = (page) => {
//     setPagination((prev) => ({ ...prev, page: Number(page) }));
//   };

//   const handlePageSize = (limit) => {
//     setPagination({ page: 1, limit: Number(limit) });
//   };

//   const handleMyPageChange = (page) => {
//     setMyPagination((prev) => ({ ...prev, page: Number(page) }));
//   };

//   const handleMyPageSize = (limit) => {
//     setMyPagination({ page: 1, limit: Number(limit) });
//   };

//   // --- Date filter change ---
//   const onDateFilterChange = (value) => {
//     setMonth(Number(value.month));
//     setYear(Number(value.year));
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   // --- Search handlers ---
//   const handleSearchChange = (searchValue) => {
//     const trimmed = searchValue?.trim() || "";
//     setFilters((prev) => ({ ...prev, search: trimmed }));
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const handleMySearchChange = (searchQuery) => {
//     const trimmed = searchQuery?.trim() || "";
//     setMyFilters((prev) => ({ ...prev, search: trimmed }));
//     setMyPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   // --- Refetch helpers ---
//   const refetchEvaluations = useCallback(() => refetch(), [refetch]);

//   // --- Update data locally ---
//   const updateData = (id, updated, type = "update") => {
//     const updatedAgencyId = updated?.agency?._id;
//     const violatesFilter = agencyId && updatedAgencyId !== agencyId;

//     setList((prev) => {
//       const index = prev.findIndex((item) => item._id === id);

//       if (type === "update") {
//         if (index === -1) return prev;
//         if (violatesFilter) {
//           const next = [...prev];
//           next.splice(index, 1);
//           return next;
//         }
//         const next = [...prev];
//         next[index] = { ...next[index], ...updated };
//         return next;
//       }

//       if (type === "add") {
//         if (pagination.page !== 1 || violatesFilter) return prev;
//         if (index !== -1) {
//           const next = [...prev];
//           next[index] = { ...next[index], ...updated };
//           return next;
//         }
//         return [{ ...updated }, ...prev];
//       }

//       return prev;
//     });

//     if (type === "add" && !violatesFilter) {
//       setTotalCount((prev) => prev + 1);
//     }
//   };

//   // --- Delete evaluation ---
//   const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();
//   const confirmDelete = async (userId, month, year, onClose, evalType) => {
//     try {
//       // With this:
//       await deleteItem({
//         path: "/evaluation/users/monthly",
//         body: { userId, month, year },
//       }).unwrap();
//       if (evalType == "USEREVAL") refetch();
//       else refetchMyEvaluations();
//       toast.success("Evaluation deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       onClose();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to delete evaluation", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//       onClose();
//     }
//   };

//   const removeItem = (id) => {
//     setList((prev) => prev.filter((item) => item._id !== id));
//     setTotalCount((prev) => prev - 1);
//   };

//   return {
//     // Main evaluations
//     data: list ?? [],
//     setData: setList,
//     totalPages: data?.totalPages ?? 0,
//     totalRecords: totalCount ?? 0,
//     month,
//     year,
//     agencyId,
//     setMonth,
//     setYear,
//     setAgencyId,
//     filters,
//     setFilters,
//     pagination,
//     setPagination,
//     handlePageChange,
//     handlePageSize,
//     handleSearchChange,
//     handleSearchTermChange: handleSearchChange, // ← CORRECT: Alias for main evaluations
//     onDateFilterChange,

//     // My evaluations
//     myEvaluations,
//     myPagination,
//     setMyPagination,
//     handleMyPageChange,
//     handleMyPageSize,
//     handleMySearchChange, // Add this for MyEvaluation component
//     myFilters,
//     setMyFilters,

//     // Shared
//     isAgenciesAllowed,
//     agencies,
//     queryParams,
//     isLoading,
//     myEvaluationsLoading,
//     isFetching,
//     myEvaluationsFetching,
//     refetch,
//     refetchEvaluations,
//     refetchMyEvaluations,

//     // Actions
//     confirmDelete,
//     updateData,
//     removeItem,
//   };
// };

import {
  useDeleteItemMutation,
  useFetchItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { usePermissions } from "hooks/usePermissions";
import useUserSession from "hooks/useUserSession";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cleanSearchParams } from "utils";

export const useTeams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const agencies = useSelector((s) => (s.util && s.util.agencies) || []);
  const { hasPermission } = usePermissions();
  const { user } = useUserSession();
  const isAgenciesAllowed = hasPermission("evaluation", "all_agencies");

  // --- Extract initial values from URL ---
  const initialMonth =
    Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const initialYear =
    Number(searchParams.get("year")) || new Date().getFullYear();
  const initialAgencyId = isAgenciesAllowed ? searchParams.get("agency") : null;
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 20;
  const initialSearch = searchParams.get("search") || "";

  // --- State for main evaluations ---
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [agencyId, setAgencyId] = useState(initialAgencyId);
  const [filters, setFilters] = useState({});

  // --- State for my evaluations ---
  const [myFilters, setMyFilters] = useState({});

  // --- Pagination states ---
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
  });
  const [myPagination, setMyPagination] = useState({
    page: Number(searchParams.get("myPage")) || 1,
    limit: Number(searchParams.get("myLimit")) || 20,
  });

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // --- Team mutations ---
  const [createTeam, { isLoading: isCreatingTeam }] = useCreateItemMutation();
  const [updateTeam, { isLoading: isUpdatingTeam }] = useUpdateItemMutation();

  // --- Query params for main evaluations ---
  const queryParams = useMemo(() => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      month,
      year,
      agency: isAgenciesAllowed
        ? agencyId || undefined
        : user?.agency?._id || undefined,
    };

    // Add filters if they exist
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params[key] = value;
      }
    });

    return cleanSearchParams(params);
  }, [
    pagination.page,
    pagination.limit,
    month,
    year,
    isAgenciesAllowed,
    agencyId,
    user?.agency?._id,
    filters,
  ]);

  // --- Query params for my evaluations ---
  const myEvalParams = useMemo(() => {
    const params = {
      userId: user?._id,
      page: myPagination.page,
      limit: myPagination.limit,
    };

    // Add my filters if they exist
    Object.entries(myFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params[key] = value;
      }
    });

    return cleanSearchParams(params);
  }, [user?._id, myPagination.page, myPagination.limit, myFilters]);

  // --- Sync main evaluation filters to URL ---
  useEffect(() => {
    const params = new URLSearchParams();

    // Add main evaluation params
    if (month) params.set("month", month);
    if (year) params.set("year", year);
    if (agencyId && isAgenciesAllowed) params.set("agency", agencyId);
    if (pagination.page && pagination.page > 1)
      params.set("page", pagination.page);
    if (pagination.limit && pagination.limit !== 20)
      params.set("limit", pagination.limit);

    // Add main filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });

    // Add my evaluation params (with prefixes to avoid conflicts)
    if (myPagination.page && myPagination.page > 1)
      params.set("page", myPagination.page);
    if (myPagination.limit && myPagination.limit !== 20)
      params.set("limit", myPagination.limit);
    if (myFilters.search) params.set("search", myFilters.search);

    // Only update if changed
    const newSearchString = params.toString();
    if (newSearchString !== searchParams.toString()) {
      setSearchParams(params);
    }
  }, [
    month,
    year,
    agencyId,
    isAgenciesAllowed,
    pagination,
    filters,
    myPagination,
    myFilters,
    searchParams,
    setSearchParams,
  ]);

  // --- Fetch main evaluations ---
  const fetchResult = useFetchItemsQuery(
    { path: "/evaluation/teams", params: queryParams },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // --- Fetch my evaluations ---
  const fetchResultMyEval = useFetchItemsQuery(
    { path: "/evaluation/users/per-user", params: myEvalParams },
    {
      skip: !user?._id,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const { data, isLoading, isFetching, refetch } = fetchResult;
  const {
    data: myEvaluations,
    isLoading: myEvaluationsLoading,
    isFetching: myEvaluationsFetching,
    refetch: refetchMyEvaluations,
  } = fetchResultMyEval;

  // --- Update list and total count ---
  useEffect(() => {
    if (data?.doc) {
      setList(data.doc);
      setTotalCount(data.total || 0);
    }
  }, [data?.doc, data?.total]);

  // --- Pagination handlers ---
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page: Number(page) }));
  };

  const handlePageSize = (limit) => {
    setPagination({ page: 1, limit: Number(limit) });
  };

  const handleMyPageChange = (page) => {
    setMyPagination((prev) => ({ ...prev, page: Number(page) }));
  };

  const handleMyPageSize = (limit) => {
    setMyPagination({ page: 1, limit: Number(limit) });
  };

  // --- Date filter change ---
  const onDateFilterChange = (value) => {
    setMonth(Number(value.month));
    setYear(Number(value.year));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // --- Search handlers ---
  const handleSearchChange = (searchValue) => {
    const trimmed = searchValue?.trim() || "";
    setFilters((prev) => ({ ...prev, search: trimmed }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleMySearchChange = (searchQuery) => {
    const trimmed = searchQuery?.trim() || "";
    setMyFilters((prev) => ({ ...prev, search: trimmed }));
    setMyPagination((prev) => ({ ...prev, page: 1 }));
  };

  // --- Refetch helpers ---
  const refetchEvaluations = useCallback(() => refetch(), [refetch]);

  // --- Update data locally ---
  const updateData = (id, updated, type = "update") => {
    const updatedAgencyId = updated?.agency?._id;
    const violatesFilter = agencyId && updatedAgencyId !== agencyId;

    setList((prev) => {
      const index = prev.findIndex((item) => item._id === id);

      if (type === "update") {
        if (index === -1) return prev;
        if (violatesFilter) {
          const next = [...prev];
          next.splice(index, 1);
          return next;
        }
        const next = [...prev];
        next[index] = { ...next[index], ...updated };
        return next;
      }

      if (type === "add") {
        if (pagination.page !== 1 || violatesFilter) return prev;
        if (index !== -1) {
          const next = [...prev];
          next[index] = { ...next[index], ...updated };
          return next;
        }
        return [{ ...updated }, ...prev];
      }

      return prev;
    });

    if (type === "add" && !violatesFilter) {
      setTotalCount((prev) => prev + 1);
    }
  };

  // --- Delete evaluation ---
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();
  const confirmDelete = async (userId, month, year, onClose, evalType) => {
    try {
      // With this:
      await deleteItem({
        path: "/evaluation/users/monthly",
        body: { userId, month, year },
      }).unwrap();
      if (evalType == "USEREVAL") refetch();
      else refetchMyEvaluations();
      toast.success("Evaluation deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete evaluation", {
        position: "top-right",
        autoClose: 5000,
      });
      onClose();
    }
  };

  // --- Create Team ---
  const handleCreateTeam = async (teamData) => {
    try {
      const response = await createTeam({
        path: "/evaluation/teams",
        body: teamData,
      }).unwrap();

      toast.success("Team created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refetch teams to update the list
      refetch();

      return response;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create team", {
        position: "top-right",
        autoClose: 5000,
      });
      throw error;
    }
  };

  // --- Update Team ---
  const handleUpdateTeam = async (id, teamData) => {
    try {
      const response = await updateTeam({
        path: `/evaluation/teams/${id}`,
        body: teamData,
      }).unwrap();

      toast.success("Team updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refetch teams to update the list
      refetch();

      return response;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update team", {
        position: "top-right",
        autoClose: 5000,
      });
      throw error;
    }
  };

  // --- Delete Team ---
  const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteItemMutation();

  const handleDeleteTeam = async (id) => {
    try {
      await deleteTeam({
        path: `/evaluation/teams/${id}`,
        body: {}, // DELETE might not need body, adjust based on your API
      }).unwrap();

      toast.success("Team deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refetch teams to update the list
      refetch();

      return true;
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete team", {
        position: "top-right",
        autoClose: 5000,
      });
      throw error;
    }
  };

  const removeItem = (id) => {
    setList((prev) => prev.filter((item) => item._id !== id));
    setTotalCount((prev) => prev - 1);
  };

  return {
    // Main evaluations
    data: list ?? [],
    setData: setList,
    totalPages: data?.totalPages ?? 0,
    totalRecords: totalCount ?? 0,
    month,
    year,
    agencyId,
    setMonth,
    setYear,
    setAgencyId,
    filters,
    setFilters,
    pagination,
    setPagination,
    handlePageChange,
    handlePageSize,
    handleSearchChange,
    handleSearchTermChange: handleSearchChange, // ← CORRECT: Alias for main evaluations
    onDateFilterChange,

    // My evaluations
    myEvaluations,
    myPagination,
    setMyPagination,
    handleMyPageChange,
    handleMyPageSize,
    handleMySearchChange, // Add this for MyEvaluation component
    myFilters,
    setMyFilters,

    // Shared
    isAgenciesAllowed,
    agencies,
    queryParams,
    isLoading,
    myEvaluationsLoading,
    isFetching,
    myEvaluationsFetching,
    refetch,
    refetchEvaluations,
    refetchMyEvaluations,

    // Actions
    confirmDelete,
    updateData,
    removeItem,

    // Team CRUD operations
    createTeam: handleCreateTeam,
    updateTeam: handleUpdateTeam,
    deleteTeam: handleDeleteTeam,
    isCreatingTeam,
    isUpdatingTeam,
    isDeletingTeam,
  };
};
