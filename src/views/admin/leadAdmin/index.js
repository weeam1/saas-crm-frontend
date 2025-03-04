// import React from "react";
// import LeadCard from "./Leads/LeadCard";
// import Tabs from "./components/Tabs";
// import Pagination from "./components/Pagination";

// const index = () => {
//   return <Pagination />;
// };

// export default index;

import { useFetchItemsQuery } from "api/apiSlice";
import { useState } from "react";
import Pagination from "./components/Pagination";

const LeadScreen = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [queryParams, setQueryParams] = useState({
    page: currentPage,
    pageSize,
  });

  const {
    data: leads,
    isLoading: leadsLoading,
    error: leadsError,
    refetch: leadsRefetch,
    isFetching: leadsRefetching,
  } = useFetchItemsQuery(
    {
      path: "/adminApproval/get",
      params: queryParams,
    },
    { refetchOnMountOrArgChange: true }
  );

  return <Pagination leads={leads} />;
};

export default LeadScreen;
