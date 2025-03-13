<<<<<<< HEAD
// import { useState, useEffect } from "react";
// import Pagination from "./components/Pagination";
// import { getApi, putApi } from "services/api";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { constant } from "constant";
// import { getUserNameById } from "utils";
// import { useSelector } from "react-redux";

// const LeadScreen = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const isSuperAdmin = user?.role === "superAdmin";
//   const isAgent = user?.roles?.some((role) => role.roleName === "agent");

//   const users = useSelector((state) => state.user?.users) || [];

//   const getInitialPage = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const pageFromUrl = urlParams.get("page");
//     return pageFromUrl
//       ? parseInt(pageFromUrl)
//       : sessionStorage.getItem("currentPage")
//         ? parseInt(sessionStorage.getItem("currentPage"))
//         : 1;
//   };

//   const getInitialPageSize = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const sizeFromUrl = urlParams.get("pageSize");
//     return sizeFromUrl
//       ? parseInt(sizeFromUrl)
//       : sessionStorage.getItem("pageSize")
//         ? parseInt(sessionStorage.getItem("pageSize"))
//         : 50;
//   };

//   const getInitialTab = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const tabFromUrl = urlParams.get("tab");
//     return tabFromUrl || sessionStorage.getItem("activeTab") || "All";
//   };

//   const getInitialSearchQuery = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     return (
//       urlParams.get("search") || sessionStorage.getItem("searchQuery") || ""
//     );
//   };

//   const [currentPage, setCurrentPage] = useState(getInitialPage());
//   const [pageSize, setPageSize] = useState(getInitialPageSize());
//   const [activeTab, setActiveTab] = useState(getInitialTab());
//   const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());
//   const [leads, setLeads] = useState(null);
//   const [searchedData, setSearchedData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchClear, setSearchClear] = useState(false);
//   const [formValues, setFormValues] = useState({});
//   const [isFormReset, setIsFormReset] = useState(false);
//   const [tagValues, setGetTagValues] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalLeads, setTotalLeads] = useState(0);
//   const [displayAdvSearchData, setDisplayAdvSearchData] = useState(false);
//   const [displaySearchData, setDisplaySearchData] = useState(false);
//   const [dateTime, setDateTime] = useState({ from: "", to: "" });
//   const [searchNotFound, setSearchNotFound] = useState(null);

//   const updateUrlAndStorage = (newPageSize) => {
//     const urlParams = new URLSearchParams();
//     urlParams.set("tab", activeTab);
//     urlParams.set("page", currentPage);
//     urlParams.set("pageSize", newPageSize || pageSize);
//     if (searchQuery) urlParams.set("search", searchQuery);

//     window.history.replaceState({}, "", `?${urlParams.toString()}`);
//     sessionStorage.setItem("activeTab", activeTab);
//     sessionStorage.setItem("currentPage", currentPage);
//     sessionStorage.setItem("pageSize", newPageSize || pageSize);
//     sessionStorage.setItem("searchQuery", searchQuery);
//   };

//   const fetchLeads = async (
//     tab = activeTab,
//     page = currentPage,
//     size = pageSize
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setSearchNotFound(null);

//       const queryParams = new URLSearchParams();
//       if (tab !== "All") {
//         const statusMap = {
//           Pending: "pending",
//           Approved: "accepted",
//           Rejected: "rejected",
//         };
//         queryParams.append("approvalStatus", statusMap[tab]);
//       }
//       queryParams.append("page", page);
//       queryParams.append("pageSize", size);

//       console.log(
//         `Fetching leads for page: ${page}, tab: ${tab}, pageSize: ${size}`
//       );
//       const result = await getApi(`api/adminApproval/get?${queryParams}`);
//       if (result.status === 200) {
//         setLeads(result.data);
//         setTotalPages(result.data.totalPages || 0);
//         setTotalLeads(result.data.totalApprovals || 0);
//         setSearchedData([]);
//         setDisplayAdvSearchData(false);
//         setDisplaySearchData(false);
//         setSearchQuery("");
//         setFormValues({});
//         setGetTagValues([]);
//       }
//     } catch (err) {
//       setError(err.message || "Failed to fetch leads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSearchedData = async (
//     term = searchQuery,
//     pageNo = currentPage,
//     size = pageSize
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setSearchNotFound(null);

//       let result = await getApi(
//         user.role === "superAdmin"
//           ? `api/lead/search?term=${term}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
//           : `api/lead/search?term=${term}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
//       );

//       console.log(
//         `Fetching searched data for page: ${pageNo}, pageSize: ${size}`
//       );
//       setDisplaySearchData(true);
//       const newData =
//         result.data?.result?.map((lead) => {
//           if (lead?.ip) {
//             const parts = lead.ip.split("-");
//             lead.ip = parts?.length > 0 ? parts[1] : parts[0];
//           }
//           return {
//             ...lead,
//             agentId: lead.agentAssigned,
//           };
//         }) || [];

//       if (newData.length === 0) {
//         setSearchNotFound(`Search data not found for: "${term}"`);
//       }

//       setSearchedData(newData);
//       setTotalPages(result.data?.totalPages || 0);
//       setTotalLeads(result.data?.totalLeads || 0);
//       setLeads({ ...leads, approvals: newData });
//     } catch (err) {
//       setError(err.message || "Failed to fetch searched leads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAdvancedSearch = async (
//     data = formValues,
//     pageNo = currentPage,
//     size = pageSize
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);
//       setSearchNotFound(null);

//       let result = await getApi(
//         user.role === "superAdmin"
//           ? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
//           : `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
//       );

//       console.log(
//         `Fetching advanced search for page: ${pageNo}, pageSize: ${size}`
//       );
//       setDisplayAdvSearchData(true);
//       const newData =
//         result.data?.result?.map((lead) => {
//           if (lead?.ip) {
//             const parts = lead.ip.split("-");
//             lead.ip = parts?.length > 0 ? parts[1] : parts[0];
//           }
//           return {
//             ...lead,
//             agentId: lead.agentAssigned,
//           };
//         }) || [];

//       if (newData.length === 0) {
//         const searchCriteria = Object.entries(data)
//           .filter(([_, value]) => value !== "" && value !== undefined)
//           .map(([key, value]) => {
//             if (key === "agentAssigned") {
//               const agentName = getUserNameById(value, users) || value;
//               return `agentAssigned: ${agentName}`;
//             }
//             return `${key}: ${value}`;
//           })
//           .join(", ");
//         setSearchNotFound(`Search data not found for: ${searchCriteria}`);
//       }

//       setSearchedData(newData);
//       setTotalPages(result.data?.totalPages || 0);
//       setTotalLeads(result.data?.totalLeads || 0);
//       setLeads({ ...leads, approvals: newData });
//     } catch (err) {
//       setError(err.message || "Failed to fetch advanced search leads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearAdvancedSearch = () => {
//     setDisplayAdvSearchData(false);
//     setSearchedData([]);
//     setFormValues({});
//     setGetTagValues([]);
//     setIsFormReset(true);
//     setSearchNotFound(null);
//     fetchLeads(activeTab, currentPage, pageSize);
//   };

//   // const approveChangeHandler = async (e, leadId, agentId, approvalId) => {
//   //   if (e === "none") return;

//   //   try {
//   //     const res = await axios.put(
//   //       constant["baseUrl"] + "api/adminApproval/update",
//   //       {
//   //         isApproved: e === "accept",
//   //         objectId: approvalId,
//   //         agentId,
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization:
//   //             localStorage.getItem("token") || sessionStorage.getItem("token"),
//   //         },
//   //       }
//   //     );

//   //     if (res?.data?.status) {
//   //       // Approval successful
//   //       try {
//   //         const data = {
//   //           agentAssigned: agentId,
//   //           leadType: "leadpool",
//   //         };
//   //         await putApi(`api/lead/edit/${leadId}`, data);

//   //         // Update leads or searchedData in real-time
//   //         if (displayAdvSearchData || displaySearchData) {
//   //           setSearchedData((prev) =>
//   //             prev.map((lead) =>
//   //               lead._id === leadId
//   //                 ? {
//   //                     ...lead,
//   //                     agentAssigned: agentId,
//   //                     approvalStatus: "accepted",
//   //                   }
//   //                 : lead
//   //             )
//   //           );
//   //         } else {
//   //           setLeads((prev) => ({
//   //             ...prev,
//   //             approvals: prev.approvals.map((approval) =>
//   //               approval._id === approvalId
//   //                 ? { ...approval, approvalStatus: "accepted", agentId }
//   //                 : approval
//   //             ),
//   //           }));
//   //         }

//   //         toast.success("Lead request approved successfully!");
//   //       } catch (error) {
//   //         console.log(error);
//   //         toast.error("Failed to update the lead");
//   //       }
//   //     } else {
//   //       // Rejection successful
//   //       try {
//   //         if (agentId) {
//   //           const lead = await getApi(`api/lead/view/${leadId}`);
//   //           const r = await getApi(`api/user/view/${agentId}`);
//   //           await putApi(`api/user/edit/${agentId}`, {
//   //             coins:
//   //               lead?.data?.lead?.leadStatus === "new"
//   //                 ? r?.data?.coins + 300
//   //                 : r?.data?.coins + 50,
//   //           });
//   //         }

//   //         // Update leads or searchedData in real-time
//   //         if (displayAdvSearchData || displaySearchData) {
//   //           setSearchedData((prev) =>
//   //             prev.map((lead) =>
//   //               lead._id === leadId
//   //                 ? { ...lead, approvalStatus: "rejected" }
//   //                 : lead
//   //             )
//   //           );
//   //         } else {
//   //           setLeads((prev) => ({
//   //             ...prev,
//   //             approvals: prev.approvals.map((approval) =>
//   //               approval._id === approvalId
//   //                 ? { ...approval, approvalStatus: "rejected" }
//   //                 : approval
//   //             ),
//   //           }));
//   //         }

//   //         toast.success("Lead request rejected successfully!");
//   //       } catch (error) {
//   //         console.log(error);
//   //         toast.error("Failed to update user coins");
//   //       }
//   //     }

//   //     // Optionally adjust totalLeads if needed (e.g., if rejected leads are removed from count)
//   //     setTotalLeads((prev) => prev - 1); // Adjust based on your logic
//   //   } catch (error) {
//   //     console.log("error", error);
//   //     toast.error(
//   //       error.response?.data?.message || "Failed to process lead request"
//   //     );
//   //   }
//   // };
//   const approveChangeHandler = async (
//     e,
//     leadId,
//     agentId,
//     approvalId,
//     currentTab
//   ) => {
//     if (e === "none") return;

//     try {
//       const res = await axios.put(
//         constant["baseUrl"] + "api/adminApproval/update",
//         {
//           isApproved: e === "accept",
//           objectId: approvalId,
//           agentId,
//         },
//         {
//           headers: {
//             Authorization:
//               localStorage.getItem("token") || sessionStorage.getItem("token"),
//           },
//         }
//       );

//       if (res?.data?.status) {
//         // Approval successful
//         try {
//           const data = {
//             agentAssigned: agentId,
//             leadType: "leadpool",
//           };
//           await putApi(`api/lead/edit/${leadId}`, data);

//           // Update state based on current tab
//           if (displayAdvSearchData || displaySearchData) {
//             setSearchedData((prev) => {
//               const updatedLeads = prev.map((lead) =>
//                 lead._id === leadId
//                   ? {
//                       ...lead,
//                       agentAssigned: agentId,
//                       approvalStatus: "accepted",
//                     }
//                   : lead
//               );
//               return currentTab === "All"
//                 ? updatedLeads
//                 : updatedLeads.filter((lead) => lead._id !== leadId);
//             });
//           } else {
//             setLeads((prev) => {
//               const updatedApprovals = prev.approvals.map((approval) =>
//                 approval._id === approvalId
//                   ? { ...approval, approvalStatus: "accepted", agentId }
//                   : approval
//               );
//               return {
//                 ...prev,
//                 approvals:
//                   currentTab === "All"
//                     ? updatedApprovals
//                     : updatedApprovals.filter(
//                         (approval) => approval._id !== approvalId
//                       ),
//                 totalApprovals:
//                   currentTab === "All"
//                     ? prev.totalApprovals
//                     : prev.totalApprovals - 1,
//               };
//             });
//           }

//           toast.success("Lead request approved successfully!");
//         } catch (error) {
//           console.log(error);
//           toast.error("Failed to update the lead");
//         }
//       } else {
//         // Rejection successful
//         try {
//           if (agentId) {
//             const lead = await getApi(`api/lead/view/${leadId}`);
//             const r = await getApi(`api/user/view/${agentId}`);
//             await putApi(`api/user/edit/${agentId}`, {
//               coins:
//                 lead?.data?.lead?.leadStatus === "new"
//                   ? r?.data?.coins + 300
//                   : r?.data?.coins + 50,
//             });
//           }

//           // Update state based on current tab
//           if (displayAdvSearchData || displaySearchData) {
//             setSearchedData((prev) => {
//               const updatedLeads = prev.map((lead) =>
//                 lead._id === leadId
//                   ? { ...lead, approvalStatus: "rejected" }
//                   : lead
//               );
//               return currentTab === "All"
//                 ? updatedLeads
//                 : updatedLeads.filter((lead) => lead._id !== leadId);
//             });
//           } else {
//             setLeads((prev) => {
//               const updatedApprovals = prev.approvals.map((approval) =>
//                 approval._id === approvalId
//                   ? { ...approval, approvalStatus: "rejected" }
//                   : approval
//               );
//               return {
//                 ...prev,
//                 approvals:
//                   currentTab === "All"
//                     ? updatedApprovals
//                     : updatedApprovals.filter(
//                         (approval) => approval._id !== approvalId
//                       ),
//                 totalApprovals:
//                   currentTab === "All"
//                     ? prev.totalApprovals
//                     : prev.totalApprovals - 1,
//               };
//             });
//           }

//           toast.success("Lead request rejected successfully!");
//         } catch (error) {
//           console.log(error);
//           toast.error("Failed to update user coins");
//         }
//       }
//     } catch (error) {
//       console.log("error", error);
//       toast.error(
//         error.response?.data?.message || "Failed to process lead request"
//       );
//     }
//   };
//   useEffect(() => {
//     fetchLeads(activeTab, currentPage, pageSize);
//   }, []);

//   useEffect(() => {
//     updateUrlAndStorage();
//   }, [activeTab, currentPage, pageSize, searchQuery]);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     if (displayAdvSearchData) {
//       fetchAdvancedSearch(formValues, newPage, pageSize);
//     } else if (displaySearchData) {
//       fetchSearchedData(searchQuery, newPage, pageSize);
//     } else {
//       fetchLeads(activeTab, newPage, pageSize);
//     }
//   };

//   const handlePageSizeChange = (newSize) => {
//     setPageSize(newSize);
//     setCurrentPage(1);
//     updateUrlAndStorage(newSize);
//     if (displayAdvSearchData) {
//       fetchAdvancedSearch(formValues, 1, newSize);
//     } else if (displaySearchData) {
//       fetchSearchedData(searchQuery, 1, newSize);
//     } else {
//       fetchLeads(activeTab, 1, newSize);
//     }
//   };

//   const handleTabChange = (newTab) => {
//     console.log("Tab clicked:", newTab);
//     setCurrentPage(1);
//     setDisplayAdvSearchData(false);
//     setDisplaySearchData(false);
//     setSearchedData([]);
//     setSearchQuery("");
//     setActiveTab(newTab);
//     setSearchNotFound(null);
//     fetchLeads(newTab, 1, pageSize);
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//     setDisplayAdvSearchData(false);
//     if (query) {
//       fetchSearchedData(query, 1, pageSize);
//     } else {
//       setDisplaySearchData(false);
//       setSearchNotFound(null);
//       fetchLeads(activeTab, 1, pageSize);
//     }
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <Pagination
//         leads={
//           displayAdvSearchData || displaySearchData
//             ? { ...leads, approvals: searchedData }
//             : leads
//         }
//         currentPage={currentPage}
//         setCurrentPage={handlePageChange}
//         totalPages={totalPages}
//         totalItems={totalLeads}
//         pageSize={pageSize}
//         onPageSizeChange={handlePageSizeChange}
//         activeTab={activeTab}
//         setActiveTab={handleTabChange}
//         loading={loading}
//         searchQuery={searchQuery}
//         setSearchQuery={handleSearch}
//         fetchAdvancedSearch={fetchAdvancedSearch}
//         setSearchClear={setSearchClear}
//         setFormValues={setFormValues}
//         isFormReset={isFormReset}
//         setIsFormReset={setIsFormReset}
//         setGetTagValues={setGetTagValues}
//         clearAdvancedSearch={clearAdvancedSearch}
//         formValues={formValues}
//         isAgent={isAgent}
//         isSuperAdmin={isSuperAdmin}
//         approveChangeHandler={approveChangeHandler}
//         searchNotFound={searchNotFound}
//       />
//     </div>
//   );
// };

// export default LeadScreen;

import { useState, useEffect } from "react";
=======
import { useState, useEffect, useCallback } from "react";
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
import { useLocation } from "react-router-dom";
import Pagination from "./components/Pagination";
import { getApi, putApi } from "services/api";
import { toast } from "react-toastify";
import axios from "axios";
import { constant } from "constant";
import { getUserNameById } from "utils";
import { useSelector } from "react-redux";

const LeadScreen = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = user?.role === "superAdmin";
  const isAgent = user?.roles?.some((role) => role.roleName === "agent");
  const users = useSelector((state) => state.user?.users) || [];
  const location = useLocation();

  const defaultPage = 1;
  const defaultPageSize = 50;
  const defaultTab = "All";
  const defaultSearchQuery = "";

  const getInitialPage = () => {
<<<<<<< HEAD
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get("page");
    return pageFromUrl ? parseInt(pageFromUrl) : defaultPage;
  };

  const getInitialPageSize = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sizeFromUrl = urlParams.get("pageSize");
    return sizeFromUrl ? parseInt(sizeFromUrl) : defaultPageSize;
  };

  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");
    return tabFromUrl || defaultTab;
  };

  const getInitialSearchQuery = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("search") || defaultSearchQuery;
=======
    const pageFromStorage = sessionStorage.getItem("currentPage");
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get("page");
    return pageFromStorage
      ? parseInt(pageFromStorage)
      : pageFromUrl
        ? parseInt(pageFromUrl)
        : defaultPage;
  };

  const getInitialPageSize = () => {
    const sizeFromStorage = sessionStorage.getItem("pageSize");
    const urlParams = new URLSearchParams(window.location.search);
    const sizeFromUrl = urlParams.get("pageSize");
    return sizeFromStorage
      ? parseInt(sizeFromStorage)
      : sizeFromUrl
        ? parseInt(sizeFromUrl)
        : defaultPageSize;
  };

  const getInitialTab = () => {
    const tabFromStorage = sessionStorage.getItem("activeTab");
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");
    return tabFromStorage || tabFromUrl || defaultTab;
  };

  const getInitialSearchQuery = () => {
    const searchFromStorage = sessionStorage.getItem("searchQuery");
    const urlParams = new URLSearchParams(window.location.search);
    return searchFromStorage || urlParams.get("search") || defaultSearchQuery;
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());
  const [leads, setLeads] = useState(null);
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchClear, setSearchClear] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [isFormReset, setIsFormReset] = useState(false);
  const [tagValues, setGetTagValues] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [displayAdvSearchData, setDisplayAdvSearchData] = useState(false);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [dateTime, setDateTime] = useState({ from: "", to: "" });
  const [searchNotFound, setSearchNotFound] = useState(null);

  const resetToDefaults = () => {
    setCurrentPage(defaultPage);
    setPageSize(defaultPageSize);
    setActiveTab(defaultTab);
    setSearchQuery(defaultSearchQuery);
    setLeads(null);
    setSearchedData([]);
    setLoading(true);
    setError(null);
    setSearchClear(false);
    setFormValues({});
    setIsFormReset(false);
    setGetTagValues([]);
    setTotalPages(0);
    setTotalLeads(0);
    setDisplayAdvSearchData(false);
    setDisplaySearchData(false);
    setDateTime({ from: "", to: "" });
    setSearchNotFound(null);

    window.history.replaceState({}, "", location.pathname);
<<<<<<< HEAD

    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("pageSize");
    sessionStorage.removeItem("activeTab");
    sessionStorage.removeItem("searchQuery");
  };

  const updateUrlAndStorage = (newPageSize) => {
    const urlParams = new URLSearchParams();
    urlParams.set("tab", activeTab);
    urlParams.set("page", currentPage);
    urlParams.set("pageSize", newPageSize || pageSize);
    if (searchQuery) urlParams.set("search", searchQuery);

    window.history.replaceState({}, "", `?${urlParams.toString()}`);
    sessionStorage.setItem("activeTab", activeTab);
    sessionStorage.setItem("currentPage", currentPage);
    sessionStorage.setItem("pageSize", newPageSize || pageSize);
    sessionStorage.setItem("searchQuery", searchQuery);
  };

  const fetchLeads = async (
    tab = activeTab,
    page = currentPage,
    size = pageSize
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSearchNotFound(null);

      const queryParams = new URLSearchParams();
      if (tab !== "All") {
        const statusMap = {
          Pending: "pending",
          Approved: "accepted",
          Rejected: "rejected",
        };
        queryParams.append("approvalStatus", statusMap[tab]);
      }
      queryParams.append("page", page);
      queryParams.append("pageSize", size);

      console.log(
        `Fetching leads for page: ${page}, tab: ${tab}, pageSize: ${size}`
      );
      const result = await getApi(`api/adminApproval/get?${queryParams}`);
      if (result.status === 200) {
        setLeads(result.data);
        setTotalPages(result.data.totalPages || 0);
        setTotalLeads(result.data.totalApprovals || 0);
        setSearchedData([]);
        setDisplayAdvSearchData(false);
        setDisplaySearchData(false);
        setSearchQuery("");
        setFormValues({});
        setGetTagValues([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchedData = async (
    term = searchQuery,
    pageNo = currentPage,
    size = pageSize
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSearchNotFound(null);

      let result = await getApi(
        user.role === "superAdmin"
          ? `api/lead/search?term=${term}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
          : `api/lead/search?term=${term}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
      );

      console.log(
        `Fetching searched data for page: ${pageNo}, pageSize: ${size}`
      );
      setDisplaySearchData(true);
      const newData =
        result.data?.result?.map((lead) => {
          if (lead?.ip) {
            const parts = lead.ip.split("-");
            lead.ip = parts?.length > 0 ? parts[1] : parts[0];
          }
          return {
            ...lead,
            agentId: lead.agentAssigned,
          };
        }) || [];

      if (newData.length === 0) {
        setSearchNotFound(`Search data not found for: "${term}"`);
      }

      setSearchedData(newData);
      setTotalPages(result.data?.totalPages || 0);
      setTotalLeads(result.data?.totalLeads || 0);
      setLeads({ ...leads, approvals: newData });
    } catch (err) {
      setError(err.message || "Failed to fetch searched leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvancedSearch = async (
    data = formValues,
    pageNo = currentPage,
    size = pageSize
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSearchNotFound(null);

      let result = await getApi(
        user.role === "superAdmin"
          ? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
          : `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
      );

      console.log(
        `Fetching advanced search for page: ${pageNo}, pageSize: ${size}`
      );
      setDisplayAdvSearchData(true);
      const newData =
        result.data?.result?.map((lead) => {
          if (lead?.ip) {
            const parts = lead.ip.split("-");
            lead.ip = parts?.length > 0 ? parts[1] : parts[0];
          }
          return {
            ...lead,
            agentId: lead.agentAssigned,
          };
        }) || [];

      if (newData.length === 0) {
        const searchCriteria = Object.entries(data)
          .filter(([_, value]) => value !== "" && value !== undefined)
          .map(([key, value]) => {
            if (key === "agentAssigned") {
              const agentName = getUserNameById(value, users) || value;
              return `agentAssigned: ${agentName}`;
            }
            return `${key}: ${value}`;
          })
          .join(", ");
        setSearchNotFound(`Search data not found for: ${searchCriteria}`);
      }

      setSearchedData(newData);
      setTotalPages(result.data?.totalPages || 0);
      setTotalLeads(result.data?.totalLeads || 0);
      setLeads({ ...leads, approvals: newData });
    } catch (err) {
      setError(err.message || "Failed to fetch advanced search leads");
    } finally {
      setLoading(false);
    }
  };

  const clearAdvancedSearch = () => {
=======
    sessionStorage.clear();
  };

  const updateUrlAndStorage = useCallback(
    (newPageSize) => {
      const urlParams = new URLSearchParams();
      urlParams.set("tab", activeTab);
      urlParams.set("page", currentPage);
      urlParams.set("pageSize", newPageSize || pageSize);
      if (searchQuery) urlParams.set("search", searchQuery);

      const newUrl = `?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);

      if (sessionStorage.getItem("activeTab") !== activeTab) {
        sessionStorage.setItem("activeTab", activeTab);
      }
      if (sessionStorage.getItem("currentPage") !== String(currentPage)) {
        sessionStorage.setItem("currentPage", currentPage);
      }
      if (
        sessionStorage.getItem("pageSize") !== String(newPageSize || pageSize)
      ) {
        sessionStorage.setItem("pageSize", newPageSize || pageSize);
      }
      if (sessionStorage.getItem("searchQuery") !== searchQuery) {
        sessionStorage.setItem("searchQuery", searchQuery);
      }
    },
    [activeTab, currentPage, pageSize, searchQuery]
  );

  const fetchLeads = useCallback(
    async (tab = activeTab, page = currentPage, size = pageSize) => {
      try {
        setLoading(true);
        setError(null);
        setSearchNotFound(null);

        const queryParams = new URLSearchParams();
        if (tab !== "All") {
          const statusMap = {
            Pending: "pending",
            Approved: "accepted",
            Rejected: "rejected",
          };
          queryParams.append("approvalStatus", statusMap[tab]);
        }
        queryParams.append("page", page);
        queryParams.append("pageSize", size);

        const result = await getApi(`api/adminApproval/get?${queryParams}`);
        if (result.status === 200) {
          setLeads(result.data);
          setTotalPages(result.data.totalPages || 0);
          setTotalLeads(result.data.totalApprovals || 0);
          setSearchedData([]);
          setDisplayAdvSearchData(false);
          setDisplaySearchData(false);
          // Do not reset searchQuery or formValues here to preserve search state
        }
      } catch (err) {
        setError(err.message || "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    },
    [activeTab, currentPage, pageSize]
  );

  const fetchSearchedData = useCallback(
    async (term = searchQuery, pageNo = currentPage, size = pageSize) => {
      try {
        setLoading(true);
        setError(null);
        setSearchNotFound(null);

        let result = await getApi(
          user.role === "superAdmin"
            ? `api/lead/search?term=${term}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
            : `api/lead/search?term=${term}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
        );
        setDisplaySearchData(true);
        const newData =
          result.data?.result?.map((lead) => {
            if (lead?.ip) {
              const parts = lead.ip.split("-");
              lead.ip = parts?.length > 0 ? parts[1] : parts[0];
            }
            return {
              ...lead,
              agentId: lead.agentAssigned,
            };
          }) || [];

        if (newData.length === 0) {
          setSearchNotFound(`Search data not found for: "${term}"`);
        }

        setSearchedData(newData);
        setTotalPages(result.data?.totalPages || 0);
        setTotalLeads(result.data?.totalLeads || 0);
        setLeads({ ...leads, approvals: newData });
      } catch (err) {
        setError(err.message || "Failed to fetch searched leads");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, currentPage, pageSize, user, dateTime, leads]
  );

  const fetchAdvancedSearch = useCallback(
    async (data = formValues, pageNo = currentPage, size = pageSize) => {
      try {
        setLoading(true);
        setError(null);
        setSearchNotFound(null);

        let result = await getApi(
          user.role === "superAdmin"
            ? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
            : `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
        );

        setDisplayAdvSearchData(true);
        const newData =
          result.data?.result?.map((lead) => {
            if (lead?.ip) {
              const parts = lead.ip.split("-");
              lead.ip = parts?.length > 0 ? parts[1] : parts[0];
            }
            return {
              ...lead,
              agentId: lead.agentAssigned,
            };
          }) || [];

        if (newData.length === 0) {
          const searchCriteria = Object.entries(data)
            .filter(([_, value]) => value !== "" && value !== undefined)
            .map(([key, value]) => {
              if (key === "agentAssigned") {
                const agentName = getUserNameById(value, users) || value;
                return `agentAssigned: ${agentName}`;
              }
              return `${key}: ${value}`;
            })
            .join(", ");
          setSearchNotFound(`Search data not found for: ${searchCriteria}`);
        }

        setSearchedData(newData);
        setTotalPages(result.data?.totalPages || 0);
        setTotalLeads(result.data?.totalLeads || 0);
        setLeads({ ...leads, approvals: newData });
      } catch (err) {
        setError(err.message || "Failed to fetch advanced search leads");
      } finally {
        setLoading(false);
      }
    },
    [formValues, currentPage, pageSize, user, dateTime, leads, users]
  );

  const clearAdvancedSearch = useCallback(() => {
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
    setDisplayAdvSearchData(false);
    setSearchedData([]);
    setFormValues({});
    setGetTagValues([]);
    setIsFormReset(true);
    setSearchNotFound(null);
    fetchLeads(activeTab, currentPage, pageSize);
<<<<<<< HEAD
  };
=======
  }, [activeTab, currentPage, pageSize, fetchLeads]);
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11

  const approveChangeHandler = async (
    e,
    leadId,
    agentId,
    approvalId,
    currentTab
  ) => {
    if (e === "none") return;

    try {
      const res = await axios.put(
        constant["baseUrl"] + "api/adminApproval/update",
        {
          isApproved: e === "accept",
          objectId: approvalId,
          agentId,
        },
        {
          headers: {
            Authorization:
              localStorage.getItem("token") || sessionStorage.getItem("token"),
          },
        }
      );

      if (res?.data?.status) {
<<<<<<< HEAD
        // Approval successful
=======
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
        try {
          const data = {
            agentAssigned: agentId,
            leadType: "leadpool",
          };
          await putApi(`api/lead/edit/${leadId}`, data);

<<<<<<< HEAD
          // Update state based on current tab
=======
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
          if (displayAdvSearchData || displaySearchData) {
            setSearchedData((prev) => {
              const updatedLeads = prev.map((lead) =>
                lead._id === leadId
                  ? {
                      ...lead,
                      agentAssigned: agentId,
                      approvalStatus: "accepted",
                    }
                  : lead
              );
              return currentTab === "All"
                ? updatedLeads
                : updatedLeads.filter((lead) => lead._id !== leadId);
            });
          } else {
            setLeads((prev) => {
              const updatedApprovals = prev.approvals.map((approval) =>
                approval._id === approvalId
                  ? { ...approval, approvalStatus: "accepted", agentId }
                  : approval
              );
              return {
                ...prev,
                approvals:
                  currentTab === "All"
                    ? updatedApprovals
                    : updatedApprovals.filter(
                        (approval) => approval._id !== approvalId
                      ),
                totalApprovals:
                  currentTab === "All"
                    ? prev.totalApprovals
                    : prev.totalApprovals - 1,
              };
            });
          }

          toast.success("Lead request approved successfully!");
        } catch (error) {
          console.log(error);
          toast.error("Failed to update the lead");
        }
      } else {
<<<<<<< HEAD
        // Rejection successful
=======
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
        try {
          if (agentId) {
            const lead = await getApi(`api/lead/view/${leadId}`);
            const r = await getApi(`api/user/view/${agentId}`);
            await putApi(`api/user/edit/${agentId}`, {
              coins:
                lead?.data?.lead?.leadStatus === "new"
                  ? r?.data?.coins + 300
                  : r?.data?.coins + 50,
            });
          }

<<<<<<< HEAD
          // Update state based on current tab
=======
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
          if (displayAdvSearchData || displaySearchData) {
            setSearchedData((prev) => {
              const updatedLeads = prev.map((lead) =>
                lead._id === leadId
                  ? { ...lead, approvalStatus: "rejected" }
                  : lead
              );
              return currentTab === "All"
                ? updatedLeads
                : updatedLeads.filter((lead) => lead._id !== leadId);
            });
          } else {
            setLeads((prev) => {
              const updatedApprovals = prev.approvals.map((approval) =>
                approval._id === approvalId
                  ? { ...approval, approvalStatus: "rejected" }
                  : approval
              );
              return {
                ...prev,
                approvals:
                  currentTab === "All"
                    ? updatedApprovals
                    : updatedApprovals.filter(
                        (approval) => approval._id !== approvalId
                      ),
                totalApprovals:
                  currentTab === "All"
                    ? prev.totalApprovals
                    : prev.totalApprovals - 1,
              };
            });
          }

          toast.success("Lead request rejected successfully!");
        } catch (error) {
          console.log(error);
          toast.error("Failed to update user coins");
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        error.response?.data?.message || "Failed to process lead request"
      );
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    // Reset to defaults and fetch leads when the component mounts or route changes back
    resetToDefaults();
    fetchLeads(defaultTab, defaultPage, defaultPageSize);
  }, [location.pathname]); // Trigger when the route changes

  useEffect(() => {
    updateUrlAndStorage();
  }, [activeTab, currentPage, pageSize, searchQuery]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (displayAdvSearchData) {
      fetchAdvancedSearch(formValues, newPage, pageSize);
    } else if (displaySearchData) {
      fetchSearchedData(searchQuery, newPage, pageSize);
    } else {
      fetchLeads(activeTab, newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    updateUrlAndStorage(newSize);
    if (displayAdvSearchData) {
      fetchAdvancedSearch(formValues, 1, newSize);
    } else if (displaySearchData) {
      fetchSearchedData(searchQuery, 1, newSize);
    } else {
      fetchLeads(activeTab, 1, newSize);
    }
  };

  const handleTabChange = (newTab) => {
    console.log("Tab clicked:", newTab);
    setCurrentPage(1);
    setDisplayAdvSearchData(false);
    setDisplaySearchData(false);
    setSearchedData([]);
    setSearchQuery("");
    setActiveTab(newTab);
    setSearchNotFound(null);
    fetchLeads(newTab, 1, pageSize);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setDisplayAdvSearchData(false);
    if (query) {
      fetchSearchedData(query, 1, pageSize);
    } else {
      setDisplaySearchData(false);
      setSearchNotFound(null);
      fetchLeads(activeTab, 1, pageSize);
    }
  };
=======
  // Initial load respects the current activeTab from session storage or URL
  useEffect(() => {
    const initialTab = getInitialTab(); // Get tab from session storage or URL
    setActiveTab(initialTab); // Set the initial tab explicitly
    resetToDefaults(); // Reset other states
    fetchLeads(initialTab, defaultPage, defaultPageSize); // Fetch with the correct tab
  }, [location.pathname]);

  useEffect(() => {
    updateUrlAndStorage(pageSize);
  }, [activeTab, currentPage, pageSize, searchQuery, updateUrlAndStorage]);

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      updateUrlAndStorage(pageSize);
      if (displayAdvSearchData) {
        fetchAdvancedSearch(formValues, newPage, pageSize);
      } else if (displaySearchData) {
        fetchSearchedData(searchQuery, newPage, pageSize);
      } else {
        fetchLeads(activeTab, newPage, pageSize);
      }
    },
    [
      activeTab,
      pageSize,
      searchQuery,
      formValues,
      displayAdvSearchData,
      displaySearchData,
      fetchLeads,
      fetchSearchedData,
      fetchAdvancedSearch,
      updateUrlAndStorage,
    ]
  );

  const handlePageSizeChange = useCallback(
    (newSize) => {
      setPageSize(newSize);
      setCurrentPage(1);
      updateUrlAndStorage(newSize);
      if (displayAdvSearchData) {
        fetchAdvancedSearch(formValues, 1, newSize);
      } else if (displaySearchData) {
        fetchSearchedData(searchQuery, 1, newSize);
      } else {
        fetchLeads(activeTab, 1, newSize); // Ensure activeTab is used
      }
    },
    [
      activeTab,
      searchQuery,
      formValues,
      displayAdvSearchData,
      displaySearchData,
      fetchLeads,
      fetchSearchedData,
      fetchAdvancedSearch,
      updateUrlAndStorage,
    ]
  );

  const handleTabChange = useCallback(
    (newTab) => {
      setCurrentPage(1);
      setDisplayAdvSearchData(false);
      setDisplaySearchData(false);
      setSearchedData([]);
      setSearchQuery("");
      setActiveTab(newTab);
      setSearchNotFound(null);
      updateUrlAndStorage(pageSize);
      fetchLeads(newTab, 1, pageSize);
    },
    [pageSize, fetchLeads, updateUrlAndStorage]
  );

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      setCurrentPage(1);
      setDisplayAdvSearchData(false);
      updateUrlAndStorage(pageSize);
      if (query) {
        fetchSearchedData(query, 1, pageSize);
      } else {
        setDisplaySearchData(false);
        setSearchNotFound(null);
        fetchLeads(activeTab, 1, pageSize);
      }
    },
    [activeTab, pageSize, fetchLeads, fetchSearchedData, updateUrlAndStorage]
  );
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Pagination
        leads={
          displayAdvSearchData || displaySearchData
            ? { ...leads, approvals: searchedData }
            : leads
        }
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        totalPages={totalPages}
        totalItems={totalLeads}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        fetchAdvancedSearch={fetchAdvancedSearch}
        setSearchClear={setSearchClear}
        setFormValues={setFormValues}
        isFormReset={isFormReset}
        setIsFormReset={setIsFormReset}
        setGetTagValues={setGetTagValues}
        clearAdvancedSearch={clearAdvancedSearch}
        formValues={formValues}
        isAgent={isAgent}
        isSuperAdmin={isSuperAdmin}
        approveChangeHandler={approveChangeHandler}
        searchNotFound={searchNotFound}
      />
    </div>
  );
};

export default LeadScreen;
