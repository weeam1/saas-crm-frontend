import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PaginationPage from "./components/Pagination";
import { getApi, postApi, putApi } from "services/api";
import { constant } from "constant";
import axios from "axios";
import { toast } from "react-toastify";

const Index = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = useState("all_leads");
  const [dateTime, setDateTime] = useState({ from: "", to: "" });
  const [pageSize, setPageSize] = useState(50);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [searchedData, setSearchedData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [userData, setUserData] = useState(null);
  const [buyLoading, setBuyLoading] = useState({});

  // Debounce utility function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchData = async (pageNo = 1, size = pageSize, source) => {
    if (isLoading) return; // Prevent multiple fetches
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (
        user.role !== "superAdmin" &&
        (currentState === "all_leads" || currentState === "Accepted")
      ) {
        result = await getApi(
          currentState === "all_leads"
            ? `api/lead/?dateTime=${dateTime?.from}|${dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
            : `api/lead/?user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from}|${dateTime?.to}&page=${pageNo}&pageSize=${size}`,
          null,
          "baseUrl",
          source
        );
      } else {
        // Fixed: Removed invalid character ''
        result = await axios.get(`${constant.baseUrl}api/adminApproval/get`, {
          headers: {
            Authorization:
              localStorage.getItem("token") || sessionStorage.getItem("token"),
          },
          params: {
            approvalStatus: currentState === "all_leads" ? "" : currentState,
            page: pageNo,
            pageSize: size,
            managerId: user?.roles[0]?.roleName === "Manager" ? user?._id : "",
            agentId: user?.roles[0]?.roleName === "Agent" ? user?._id : "",
          },
          cancelToken: source?.token,
        });
      }

      let newData = [];
      if (Array.isArray(result.data?.result)) {
        newData = result.data.result;
      } else if (Array.isArray(result.data?.approvals)) {
        newData = result.data.approvals;
      } else {
        console.error("Unexpected response format:", result.data);
        throw new Error("API returned invalid data format");
      }

      newData = newData.map((lead) => {
        if (lead?.ip) {
          const parts = lead.ip.split("-");
          lead.ip = parts?.length > 1 ? parts[1] : parts[0];
        }
        return { ...lead };
      });

      if (isMounted) {
        setData(newData);
        setTotalPages(result.data?.totalPages || 0);
        setTotalLeads(
          result.data?.totalLeads || result.data?.totalApprovals || 0
        );
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Fetch Error:", error);
        if (isMounted) {
          setError(error.message || "Failed to fetch data");
          setData([]);
          setTotalPages(0);
          setTotalLeads(0);
        }
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  };

  const fetchUserData = async () => {
    let isMounted = true;
    setIsLoading(true);
    try {
      const response = await getApi(`api/user/view/${user._id}`);
      if (isMounted) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Fetch User Data Error:", error);
      if (isMounted) {
        setUserData(null);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  };

  const fetchLeads = async (
    tab = activeTab,
    page = currentPage,
    size = pageSize
  ) => {
    if (isLoading) return; // Prevent multiple fetches
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    try {
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
      if (result.status === 200 && isMounted) {
        const newData = (result.data.approvals || result.data).map((lead) => {
          if (lead?.ip) {
            const parts = lead.ip.split("-");
            lead.ip = parts?.length > 1 ? parts[1] : parts[0];
          }
          return { ...lead };
        });

        setData(newData);
        setTotalPages(result.data.totalPages || 0);
        setTotalLeads(result.data.totalApprovals || 0);
      }
    } catch (err) {
      console.error("Fetch Leads Error:", err);
      if (isMounted) {
        setError(err.message || "Failed to fetch leads");
        setData([]);
        setTotalPages(0);
        setTotalLeads(0);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  };

  const fetchSearchedData = async (term = "", pageNo = 1, size = pageSize) => {
    if (isLoading) return; // Prevent multiple fetches
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    try {
      let result = await getApi(
        user.role === "superAdmin"
          ? `api/lead/search?term=${term}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
          : `api/lead/search?term=${term}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
      );

      const newData =
        result.data?.result?.map((lead) => {
          if (lead?.ip) {
            const parts = lead.ip.split("-");
            lead.ip = parts?.length > 0 ? parts[1] : parts[0];
          }
          return { ...lead, agentId: lead.agentAssigned };
        }) || [];

      if (isMounted) {
        setDisplaySearchData(true);
        setSearchedData(newData);
        setData(newData);
        setTotalPages(result.data?.totalPages || 0);
        setTotalLeads(result.data?.totalLeads || 0);
      }
    } catch (err) {
      console.error("Fetch Searched Data Error:", err);
      if (isMounted) {
        setError(err.message || "Failed to fetch searched leads");
        setData([]);
        setTotalPages(0);
        setTotalLeads(0);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  };

  const fetchAdvancedSearch = async (
    data = {},
    pageNo = 1,
    size = pageSize
  ) => {
    if (isLoading) return; // Prevent multiple fetches
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    try {
      let result = await getApi(
        user.role === "superAdmin"
          ? `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}`
          : `api/lead/v2/advanced-search?data=${JSON.stringify(data)}&user=${user._id}&role=${user.roles[0]?.roleName}&dateTime=${dateTime?.from + "|" + dateTime?.to}&page=${pageNo}&pageSize=${size}&isInLeadPool=true`
      );

      const newData =
        result.data?.result?.map((lead) => {
          if (lead?.ip) {
            const parts = lead.ip.split("-");
            lead.ip = parts?.length > 0 ? parts[1] : parts[0];
          }
          return { ...lead, agentId: lead.agentAssigned };
        }) || [];

      if (isMounted) {
        setDisplaySearchData(true);
        setSearchedData(newData);
        setData(newData);
        setTotalPages(result.data?.totalPages || 0);
        setTotalLeads(result.data?.totalLeads || 0);
      }
    } catch (err) {
      console.error("Fetch Advanced Search Error:", err);
      if (isMounted) {
        setError(err.message || "Failed to fetch advanced search leads");
        setData([]);
        setTotalPages(0);
        setTotalLeads(0);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  };

  const fetchAgentLeadsSats = async (userId) => {
    if (!userId) {
      console.error("User ID is missing");
      return { canAddLeads: false };
    }
    try {
      const { data } = await getApi(`api/lead/leads-stats/${userId}`);
      return data?.doc || { canAddLeads: false };
    } catch (error) {
      console.error("Error fetching agent lead stats:", error);
      return { canAddLeads: false };
    }
  };

  // const sendRequest = async (leadId) => {
  //   let isMounted = true;
  //   setBuyLoading((prev) => ({ ...prev, [leadId]: true }));

  //   try {
  //     const stats = await fetchAgentLeadsSats(user._id);
  //     if (!stats.canAddLeads) {
  //       toast.error("You cannot add more leads at this time.", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 3000,
  //       });
  //       return;
  //     }

  //     let payload = {
  //       leadId,
  //       agentId: user._id,
  //       approvalStatus: "pending",
  //     };

  //     const approvalResponse = await postApi("api/adminApproval/add", payload);
  //     if (approvalResponse.status !== 200) {
  //       throw new Error("Failed to send lead for approval");
  //     }

  //     const userResponse = await getApi(`api/user/view/${user._id}`);
  //     const lead = data.find((l) => l._id === leadId);
  //     const coinCost = lead?.leadStatus === "new" ? 300 : 50;
  //     const currentCoins = userResponse?.data?.coins || 0;
  //     const updatedCoins = currentCoins - coinCost;

  //     if (updatedCoins < 0) {
  //       throw new Error("Insufficient coins to purchase this lead");
  //     }

  //     const updateResponse = await putApi(`api/user/edit/${user._id}`, {
  //       coins: updatedCoins,
  //     });

  //     if (updateResponse.status === 200 && isMounted) {
  //       // Update user data
  //       setUserData((prev) => ({ ...prev, coins: updatedCoins }));

  //       // Remove the purchased lead from the current data
  //       const updatedData = data.filter((lead) => lead._id !== leadId);
  //       setData(updatedData);

  //       // Show success toast
  //       toast.success("Lead purchased and sent for approval", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 3000,
  //       });

  //       // Optionally, update the "Pending" leads section
  //       // If you have a separate state for pending leads, add the purchased lead to it
  //       // Example:
  //       // setPendingLeads((prev) => [...prev, lead]);
  //     }
  //   } catch (error) {
  //     console.error("Send Request Error:", error);
  //     if (isMounted) {
  //       toast.error(error.message || "Failed to purchase lead", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 3000,
  //       });
  //     }
  //   } finally {
  //     if (isMounted) {
  //       setBuyLoading((prev) => ({ ...prev, [leadId]: false }));
  //     }
  //   }

  //   return () => {
  //     isMounted = false;
  //   };
  // };
  const sendRequest = async (leadId) => {
    let isMounted = true;
    setBuyLoading((prev) => ({ ...prev, [leadId]: true }));

    try {
      const stats = await fetchAgentLeadsSats(user._id);
      if (!stats.canAddLeads) {
        toast.error("You cannot add more leads at this time.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        return;
      }

      let payload = {
        leadId,
        agentId: user._id,
        approvalStatus: "pending",
      };

      const approvalResponse = await postApi("api/adminApproval/add", payload);
      if (approvalResponse.status !== 200) {
        throw new Error("Failed to send lead for approval");
      }

      const userResponse = await getApi(`api/user/view/${user._id}`);
      const lead = data.find((l) => l._id === leadId);
      const coinCost = lead?.leadStatus === "new" ? 300 : 50;
      const currentCoins = userResponse?.data?.coins || 0;
      const updatedCoins = currentCoins - coinCost;

      if (updatedCoins < 0) {
        throw new Error("Insufficient coins to purchase this lead");
      }

      const updateResponse = await putApi(`api/user/edit/${user._id}`, {
        coins: updatedCoins,
      });

      if (updateResponse.status === 200 && isMounted) {
        // Update user data
        setUserData((prev) => ({ ...prev, coins: updatedCoins }));

        // Remove the purchased lead from the current data
        const updatedData = data.filter((lead) => lead._id !== leadId);
        setData(updatedData);

        // Decrement the total leads count by 1
        setTotalLeads((prev) => prev - 1);

        // Show success toast
        toast.success("Lead purchased and sent for approval", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });

        // Optionally, update the "Pending" leads section
        // If you have a separate state for pending leads, add the purchased lead to it
        // Example:
        // setPendingLeads((prev) => [...prev, lead]);
      }
    } catch (error) {
      console.error("Send Request Error:", error);
      if (isMounted) {
        toast.error(error.message || "Failed to purchase lead", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    } finally {
      if (isMounted) {
        setBuyLoading((prev) => ({ ...prev, [leadId]: false }));
      }
    }

    return () => {
      isMounted = false;
    };
  };
  // Memoized debounced fetch functions
  const debouncedFetchData = useCallback(debounce(fetchData, 300), [
    dateTime,
    user,
    currentState,
  ]);
  const debouncedFetchLeads = useCallback(debounce(fetchLeads, 300), [user]);
  const debouncedFetchSearchedData = useCallback(
    debounce(fetchSearchedData, 300),
    [dateTime, user]
  );
  const debouncedFetchAdvancedSearch = useCallback(
    debounce(fetchAdvancedSearch, 300),
    [dateTime, user]
  );

  useEffect(() => {
    const source = axios.CancelToken.source();
    setCurrentPage(1);
    setPageSize(50);
    setActiveTab("All");
    setDisplaySearchData(false);
    setData([]);
    setTotalPages(0);
    setTotalLeads(0);
    setError(null);

    fetchUserData();
    debouncedFetchData(1, 50, source); // Initial fetch only on route change

    return () => {
      source.cancel("Component unmounted");
    };
  }, [location.pathname]); // Only trigger on route change

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PaginationPage
      data={data}
      totalPages={totalPages}
      totalLeads={totalLeads}
      isLoading={isLoading}
      fetchData={(tab, page, size) => {
        setData([]);
        if (tab === "All" && !displaySearchData) {
          debouncedFetchData(page, size);
        } else if (!displaySearchData) {
          debouncedFetchLeads(tab, page, size);
        }
      }}
      fetchSearchedData={debouncedFetchSearchedData}
      fetchAdvancedSearch={debouncedFetchAdvancedSearch}
      setCurrentState={setCurrentState}
      currentState={currentState}
      pageSize={pageSize}
      setPageSize={setPageSize}
      user={user}
      dateTime={dateTime}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      setData={setData}
      setTotalPages={setTotalPages}
      setTotalLeads={setTotalLeads}
      setIsLoading={setIsLoading}
      displaySearchData={displaySearchData}
      setDisplaySearchData={setDisplaySearchData}
      userData={userData}
      sendRequest={sendRequest}
      buyLoading={buyLoading}
    />
  );
};

export default Index;
