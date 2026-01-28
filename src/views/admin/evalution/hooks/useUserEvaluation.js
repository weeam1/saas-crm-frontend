// import {
//   useDeleteUserEvaluationMonthlyMutation,
//   useFetchItemsQuery,
// } from "api/apiSlice";
// import { usePermissions } from "hooks/usePermissions";
// import useUserSession from "hooks/useUserSession";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { cleanSearchParams } from "utils";

// export const useUserEvalution = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const searchString = searchParams.toString();
//   const [myFilters, setMyFilters] = useState({});

//   const agencies = useSelector((s) => (s.util && s.util.agencies) || []);

//   const { hasPermission } = usePermissions();
//   const { user } = useUserSession();

//   // check  all agencies permission
//   const isAgenciesAllowed = hasPermission("evaluation", "all_agencies");

//   // derive initial values from URL (stable on first render)
//   const initialMonth =
//     Number(searchParams.get("month")) || new Date().getMonth() + 1;
//   const initialYear =
//     Number(searchParams.get("year")) || new Date().getFullYear();

//   const initialAgencyId = isAgenciesAllowed ? searchParams.get("agency") : null;
//   const initialPage = Number(searchParams.get("page")) || 1;
//   const initialLimit = Number(searchParams.get("limit")) || 10;

//   const [month, setMonth] = useState(initialMonth);
//   const [list, setList] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [year, setYear] = useState(initialYear);
//   const [agencyId, setAgencyId] = useState(initialAgencyId);
//   const [pagination, setPagination] = useState({
//     page: initialPage,
//     limit: initialLimit,
//   });
//   const [myPagination, setMyPagination] = useState({
//     page: Number(searchParams.get("page")) || 1,
//     limit: Number(searchParams.get("limit")) || 10,
//   });

//   const [filters, setFilters] = useState({});

//   // stable queryParams (memoized)
//   const queryParams = useMemo(() => {
//     return cleanSearchParams({
//       page: pagination.page,
//       limit: pagination.limit,
//       month,
//       year,
//       agency: isAgenciesAllowed
//         ? agencyId || undefined
//         : user?.agency?._id || undefined,
//       ...(filters?.userId && { userId: filters.userId }),
//       ...(filters?.role && { role: filters.role }),
//       ...(filters?.search && { search: filters.search }),
//     });
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

//   // sync queryParams -> URL (loop proof)
//   useEffect(() => {
//     const nextString = new URLSearchParams(queryParams).toString();
//     if (nextString !== searchString) {
//       setSearchParams(queryParams);
//     }
//   }, [queryParams, searchString, setSearchParams]);

//   // --- Fetching Data ---
//   const fetchResult = useFetchItemsQuery(
//     { path: "/evaluation/users", params: queryParams },
//     {
//       refetchOnMountOrArgChange: true,
//       refetchOnFocus: true,
//       refetchOnReconnect: true,
//     },
//   );
//   const fetchResultMyEval = useFetchItemsQuery(
//     {
//       path: "/evaluation/users/per-user",
//       params: {
//         userId: user?._id,
//         page: myPagination.page,
//         limit: myPagination.limit,
//         ...(myFilters?.search && { search: myFilters.search }),
//       },
//     },
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

//   useEffect(() => {
//     if (data?.doc) {
//       setList(data?.doc || []);
//       setTotalCount(data?.total || 0);
//     }
//   }, [data?.doc, data?.total]);

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
//   const onDateFilterChange = (value) => {
//     const newMonth = Number(value.month);
//     const newYear = Number(value.year);

//     setMonth(newMonth);
//     setYear(newYear);
//     setPagination((prev) => ({ ...prev, page: 1 }));
//   };

//   const refetchEvaluations = useCallback(() => {
//     refetch();
//   }, [refetch]);

//   const updateData = (id, updated, type = "update") => {
//     const updatedAgencyId = updated?.agency?._id;
//     const filterActive = Boolean(agencyId);
//     const violatesFilter = filterActive && updatedAgencyId !== agencyId;

//     setList((prev) => {
//       // Find index once instead of mapping multiple times
//       const index = prev.findIndex((item) => item._id === id);

//       // --- UPDATE logic ---
//       if (type === "update") {
//         // If item doesn't exist, do nothing
//         if (index === -1) return prev;

//         // If agency filter is applied and new agency doesn't match -> remove it
//         if (violatesFilter) {
//           const next = [...prev];
//           next.splice(index, 1);
//           return next;
//         }

//         // Otherwise, update it in place
//         const next = [...prev];
//         next[index] = { ...next[index], ...updated };
//         return next;
//       }

//       // --- ADD logic ---
//       if (type === "add") {
//         // Only add on the first page
//         if (pagination.page !== 1) return prev;

//         // Respect filter — only add if matches or no filter
//         if (violatesFilter) return prev;

//         // If exists, update in place
//         if (index !== -1) {
//           const next = [...prev];
//           next[index] = { ...next[index], ...updated };
//           return next;
//         }

//         // Add new item at the top
//         return [{ ...updated }, ...prev];
//       }

//       // If unknown type, return as-is
//       return prev;
//     });

//     if (type === "add" && !violatesFilter) {
//       setTotalCount((prev) => prev + 1);
//     }
//   };
//   const [deleteEvaluation, { isLoading: isDeleting }] =
//     useDeleteUserEvaluationMonthlyMutation();
//   const confirmDelete = async (userId, month, year, onClose) => {
//     try {
//       await deleteEvaluation({
//         userId: userId,
//         month: month,
//         year: year,
//       }).unwrap();

//       toast.success("Evaluation deleted successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//       onClose();
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to delete evaluation", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };
//   const removeItem = (id) => {
//     setList((prev) => prev.filter((item) => item._id !== id));

//     setTotalCount((prev) => prev - 1);
//   };
//   console.log("myEvals", myEvaluations);
// useEffect(() => {
//   const params = new URLSearchParams(searchParams);

//   if (myFilters.search) {
//     params.set("search", myFilters.search);
//   } else {
//     params.delete("search");
//   }

//   setSearchParams(params);
// }, [myFilters.search]);

//   const handleSearchTermChange = (searchQuery) => {
//     const trimmed = searchQuery?.trim() || "";
//     if (trimmed !== "") {
//       setMyFilters((prev) => ({ ...prev, search: trimmed }));
//       setMyPagination((prev) => ({ ...prev, page: 1 }));
//     } else {
//       setMyFilters({});
//       setMyPagination({ page: 1, limit: 10 });
//     }
//   };

//   return {
//     // raw
//     myPagination,
//     setMyPagination,
//     handleMyPageChange,
//     handleMyPageSize,
//     handleSearchTermChange,
//     isAgenciesAllowed,
//     agencies,
//     queryParams,

//     refetchEvaluations,

//     // data + meta
//     data: list ?? [],
//     setData: setList,
//     totalPages: data?.totalPages ?? 0,
//     totalRecords: totalCount ?? 0,

//     // filters
//     month,
//     year,
//     agencyId,
//     setMonth,
//     setYear,
//     setAgencyId,
//     filters,
//     setFilters,

//     // pagination
//     pagination,
//     setPagination,
//     myEvaluations,
//     // fetch
//     isLoading,
//     myEvaluationsLoading,
//     isFetching,
//     myEvaluationsFetching,
//     refetch,
//     myFilters,
//     setMyFilters,
//     // helper functions
//     handlePageChange,
//     handlePageSize,
//     onDateFilterChange,
//     confirmDelete,
//     updateData,
//     removeItem,
//     refetchMyEvaluations,
//   };
// };

import { useDeleteItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { usePermissions } from "hooks/usePermissions";
import useUserSession from "hooks/useUserSession";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { cleanSearchParams } from "utils";

export const useUserEvalution = () => {
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
  const initialLimit = Number(searchParams.get("limit")) || 10;
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
    limit: Number(searchParams.get("myLimit")) || 10,
  });

  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

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
    if (pagination.limit && pagination.limit !== 10)
      params.set("limit", pagination.limit);

    // Add main filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value);
      }
    });

    // Add my evaluation params (with prefixes to avoid conflicts)
    if (myPagination.page && myPagination.page > 1)
      params.set("myPage", myPagination.page);
    if (myPagination.limit && myPagination.limit !== 10)
      params.set("myLimit", myPagination.limit);
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
    { path: "/evaluation/users", params: queryParams },
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
  };
};
