import { useState, useEffect } from "react";
import Pagination from "./components/Pagination";
import { getApi, putApi } from "services/api";
import { toast } from "react-toastify";
import axios from "axios";
import { constant } from "constant";
const LeadScreen = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = user?.role === "superAdmin";
  const isAgent = user?.roles?.some((role) => role.roleName === "agent");

  const getInitialPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageFromUrl = urlParams.get("page");
    return pageFromUrl
      ? parseInt(pageFromUrl)
      : sessionStorage.getItem("currentPage")
        ? parseInt(sessionStorage.getItem("currentPage"))
        : 1;
  };

  const getInitialPageSize = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sizeFromUrl = urlParams.get("pageSize");
    return sizeFromUrl
      ? parseInt(sizeFromUrl)
      : sessionStorage.getItem("pageSize")
        ? parseInt(sessionStorage.getItem("pageSize"))
        : 50;
  };

  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");
    return tabFromUrl || sessionStorage.getItem("activeTab") || "All";
  };

  const getInitialSearchQuery = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return (
      urlParams.get("search") || sessionStorage.getItem("searchQuery") || ""
    );
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [pageSize, setPageSize] = useState(getInitialPageSize());
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());
  const [leads, setLeads] = useState(null);
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const updateUrlAndStorage = () => {
    const urlParams = new URLSearchParams();
    urlParams.set("tab", activeTab);
    urlParams.set("page", currentPage);
    urlParams.set("pageSize", pageSize);
    if (searchQuery) urlParams.set("search", searchQuery);

    console.log("Updating URL with activeTab:", activeTab);
    window.history.replaceState({}, "", `?${urlParams.toString()}`);
    sessionStorage.setItem("activeTab", activeTab);
    sessionStorage.setItem("currentPage", currentPage);
    sessionStorage.setItem("pageSize", pageSize);
    sessionStorage.setItem("searchQuery", searchQuery);
  };

  const fetchLeads = async (tab = activeTab) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (tab !== "All") {
        const statusMap = {
          Pending: "pending",
          Approved: "accepted",
          Rejected: "rejected",
        };
        queryParams.append("approvalStatus", statusMap[tab]);
      }
      queryParams.append("page", currentPage);
      queryParams.append("pageSize", pageSize);

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

  const fetchSearchedData = async (term = "", pageNo = 1, size = pageSize) => {
    try {
      setLoading(true);
      setError(null);

      let result = await getApi(
        user.role === "superAdmin"
          ? `api/lead/search?term=${term}&dateTime=${
              dateTime?.from + "|" + dateTime?.to
            }&page=${pageNo}&pageSize=${size}`
          : `api/lead/search?term=${term}&user=${user._id}&role=${
              user.roles[0]?.roleName
            }&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
      );

      setDisplaySearchData(true);
      const newData = result.data?.result?.map((lead) => {
        if (lead?.ip) {
          const parts = lead.ip.split("-");
          lead.ip = parts?.length > 0 ? parts[1] : parts[0];
        }
        return { ...lead };
      });

      setSearchedData(newData || []);
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
    data = {},
    pageNo = 1,
    size = pageSize
  ) => {
    try {
      setLoading(true);
      setError(null);

      let result = await getApi(
        user.role === "superAdmin"
          ? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&dateTime=${
              dateTime?.from + "|" + dateTime?.to
            }&page=${pageNo}&pageSize=${size}`
          : `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${
              user._id
            }&role=${user.roles[0]?.roleName}&dateTime=${
              dateTime?.from + "|" + dateTime?.to
            }&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
      );

      setDisplayAdvSearchData(true);
      const newData = result.data?.result?.map((lead) => {
        if (lead?.ip) {
          const parts = lead.ip.split("-");
          lead.ip = parts?.length > 0 ? parts[1] : parts[0];
        }
        return { ...lead };
      });

      setSearchedData(newData || []);
      setTotalPages(result.data?.totalPages || 0);
      setTotalLeads(result.data?.totalLeads || 0);
      setLeads({ ...leads, approvals: newData });
      setFormValues(data);
    } catch (err) {
      setError(err.message || "Failed to fetch advanced search leads");
    } finally {
      setLoading(false);
    }
  };
  // const fetchSearchedData = async (term = "", pageNo = 1, size = pageSize) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     let result = await getApi(
  //       user.role === "superAdmin"
  //         ? `api/lead/search?term=${term}&dateTime=${
  //             dateTime?.from + "|" + dateTime?.to
  //           }&page=${pageNo}&pageSize=${size}`
  //         : `api/lead/search?term=${term}&user=${user._id}&role=${
  //             user.roles[0]?.roleName
  //           }&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
  //     );

  //     setDisplaySearchData(true);
  //     const newData =
  //       result.data?.result?.map((lead) => {
  //         // Normalize IP if present
  //         let ip = lead.ip;
  //         if (ip) {
  //           const parts = ip.split("-");
  //           ip = parts?.length > 0 ? parts[1] : parts[0];
  //         }
  //         return {
  //           leadId: lead._id || lead.leadId || "N/A",
  //           leadName: lead.leadName || "N/A",
  //           nationality: lead.nationality || "N/A",
  //           city: lead.city || lead.leadAddress || ip || "N/A",
  //           sourceContent: lead.leadSourceDetails || "N/A",
  //           timeToCall: lead.timetocall || "N/A",
  //           mStatus: lead.mStatus || "N/A",
  //           leadStatus: lead.leadStatus || "",
  //           agentId: lead.agentAssigned || "N/A",
  //           approved: lead.approved || "N/A",
  //           createdDate: lead.createdDate || lead.createdAt || "N/A",
  //           _id: lead._id || "N/A",
  //         };
  //       }) || [];

  //     setSearchedData(newData);
  //     setTotalPages(result.data?.totalPages || 0);
  //     setTotalLeads(result.data?.totalLeads || 0);
  //     setLeads({ ...leads, approvals: newData });
  //   } catch (err) {
  //     setError(err.message || "Failed to fetch searched leads");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchAdvancedSearch = async (
  //   data = {},
  //   pageNo = 1,
  //   size = pageSize
  // ) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     let result = await getApi(
  //       user.role === "superAdmin"
  //         ? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&dateTime=${
  //             dateTime?.from + "|" + dateTime?.to
  //           }&page=${pageNo}&pageSize=${size}`
  //         : `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${
  //             user._id
  //           }&role=${user.roles[0]?.roleName}&dateTime=${
  //             dateTime?.from + "|" + dateTime?.to
  //           }&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
  //     );

  //     setDisplayAdvSearchData(true);
  //     const newData =
  //       result.data?.result?.map((lead) => {
  //         // Normalize IP if present
  //         let ip = lead.ip;
  //         if (ip) {
  //           const parts = ip.split("-");
  //           ip = parts?.length > 0 ? parts[1] : parts[0];
  //         }

  //         return {
  //           leadId: lead._id || lead.leadId || "N/A",
  //           leadName: lead.leadName || "N/A",
  //           nationality: lead.nationality || "N/A",
  //           city: lead.city || lead.leadAddress || ip || "N/A",
  //           sourceContent: lead.leadSourceDetails || "N/A",
  //           timeToCall: lead.timetocall || "N/A",
  //           mStatus: lead.mStatus || "N/A",
  //           leadStatus: lead.leadStatus || "",
  //           agentId: lead.agentAssigned || "N/A",
  //           approved: lead.approved || "N/A",
  //           createdDate: lead.createdDate || lead.createdAt || "N/A",
  //           _id: lead._id || "N/A",
  //         };
  //       }) || [];

  //     setSearchedData(newData);
  //     setTotalPages(result.data?.totalPages || 0);
  //     setTotalLeads(result.data?.totalLeads || 0);
  //     setLeads({ ...leads, approvals: newData });
  //     setFormValues(data);
  //   } catch (err) {
  //     setError(err.message || "Failed to fetch advanced search leads");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const clearAdvancedSearch = () => {
    setDisplayAdvSearchData(false);
    setSearchedData([]);
    setFormValues({});
    setGetTagValues([]);
    setIsFormReset(true);
    fetchLeads();
  };
  const approveChangeHandler = async (e, leadId, agentId, approvalId) => {
    const user = JSON.parse(localStorage.getItem("user"));
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
        // Request Accepted
        try {
          const data = {
            agentAssigned: agentId,
            leadType: "leadpool",
          };

          await putApi(`api/lead/edit/${leadId}`, data);
          toast.success("Lead request approved successfully!");
          // fetchData();
        } catch (error) {
          console.log(error);
          toast.error("Failed to update the lead");
        }
      } else {
        // Request Rejected
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
          toast.success("Lead request rejected successfully!");
          // fetchData();
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log("error", error);
      toast.error(
        error.response?.data?.message || "Failed to process lead request"
      );
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");
    const sizeFromUrl = urlParams.get("pageSize");

    if (!tabFromUrl && !sizeFromUrl) {
      setActiveTab("All");
      setPageSize(50);
    }

    if (!displayAdvSearchData && !displaySearchData) {
      fetchLeads();
    }
  }, [currentPage, pageSize]);

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
      fetchLeads();
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    if (displayAdvSearchData) {
      fetchAdvancedSearch(formValues, 1, newSize);
    } else if (displaySearchData) {
      fetchSearchedData(searchQuery, 1, newSize);
    } else {
      fetchLeads();
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
    fetchLeads(newTab);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setDisplayAdvSearchData(false);
    if (query) {
      fetchSearchedData(query);
    } else {
      setDisplaySearchData(false);
      fetchLeads();
    }
  };

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
      />
    </div>
  );
};

export default LeadScreen;
