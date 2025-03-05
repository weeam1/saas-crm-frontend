import { useState, useEffect } from "react";
import Pagination from "./components/Pagination";
import { getApi } from "services/api";

const LeadScreen = () => {
  const user = JSON.parse(localStorage.getItem("user"));

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
    return sessionStorage.getItem("pageSize")
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

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      if (activeTab !== "All") {
        const statusMap = {
          Pending: "pending",
          Approved: "accepted",
          Rejected: "rejected",
        };
        queryParams.append("approvalStatus", statusMap[activeTab]);
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
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch searched leads");
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
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch advanced search leads");
      setLoading(false);
    }
  };

  const clearAdvancedSearch = () => {
    setDisplayAdvSearchData(false);
    setSearchedData([]);
    setFormValues({});
    setGetTagValues([]);
    setIsFormReset(true);
    fetchLeads();
  };

  useEffect(() => {
    if (!displayAdvSearchData && !displaySearchData) {
      fetchLeads();
    }
  }, [currentPage, pageSize, activeTab]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (displayAdvSearchData) {
      fetchAdvancedSearch(formValues, newPage, pageSize);
    } else if (displaySearchData) {
      fetchSearchedData(searchQuery, newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
    if (displayAdvSearchData) {
      fetchAdvancedSearch(formValues, 1, newSize);
    } else if (displaySearchData) {
      fetchSearchedData(searchQuery, 1, newSize);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    setDisplayAdvSearchData(false);
    setDisplaySearchData(false);
    setSearchedData([]);
    setSearchQuery("");
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
      {leads && (
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
        />
      )}
    </div>
  );
};

export default LeadScreen;
