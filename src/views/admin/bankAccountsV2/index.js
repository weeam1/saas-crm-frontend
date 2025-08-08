import React, { useState, useEffect, useCallback } from "react";
import AccountsView from "./View";
import Header from "./components/Header";
import Pagination from "./components/Pagination";
import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import CustomSearchInput from "./components/Search";
import { useUserActivityLog } from "hooks/useUserActivityLog";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [accountsArray, setAccountsArray] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [createItemMutation, { isLoading: isAdding }] = useCreateItemMutation();

    const user = JSON.parse(localStorage.getItem("user")) || {};  
    const { createUserLog } = useUserActivityLog();

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearching,
    refetch: refetchSearch,
  } = useFetchItemsQuery(
    {
      path: "/bankAccount/search",
      params: {
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
      },
    },
    {
      skip: !searchTerm, // Skip if no search term
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: allData,
    error: fetchError,
    isLoading: isGetting,
    refetch: refetchAll,
  } = useFetchItemsQuery(
    {
      path: "/bankAccount/get",
      params: { page: currentPage, pageSize: pageSize },
    },
    {
      skip: !!searchTerm, // Skip if there’s a search term
      refetchOnMountOrArgChange: true,
    }
  );

  const skeletonCount = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 9,
  });

  const templateColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    sm: "repeat(1, 1fr)",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  });

  const gridProps = {
    templateColumns,
    gap: { base: 4, md: 6 },
    p: { base: 4, md: 6 },
  };

  useEffect(() => {
    const activeData = searchTerm ? searchData : allData;
    if (activeData?.data) {
      setAccountsArray(activeData.data);
      setTotalLeads(activeData.total || 0);
      setTotalPages(activeData.totalPages || 1);
    }
  }, [searchData, allData, searchTerm]);

  // Add this useEffect to handle refetching when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      refetchAll(); // Safe to call here because this runs after state updates
    }
  }, [searchTerm, refetchAll]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 on new search
  }, []);

  const handleAdd = async (newAccount) => {
    try {
    const response =  await createItemMutation({
        path: "/bankAccount/add",
        body: newAccount,
      }).unwrap();
       createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Bank_Account",
        entityId: response.data.account._id,
        status: "success",
        message: `"${user?.fullName}" created bank account "${response?.data?.account.account_holder_name || "Untitled"}".`,
      });
      setCurrentPage(1);
      searchTerm ? refetchSearch() : refetchAll();
      return null;
    } catch (error) {
      console.error("Failed to add account:", error);
      const errorMessage =
        error?.data?.message || "Failed to add the account. Please try again.";
      return { general: errorMessage };
    }
  };

  const handleFetchData = useCallback((searchTerm, page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const handleQueryChange = (query) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchTerm("");
    setCurrentPage(1);
    // Remove refetchAll() here; handled by useEffect
  };

  const handleUpdate = (updatedAccount) => {
    setAccountsArray((prev) =>
      prev.map((acc) => (acc._id === updatedAccount._id ? updatedAccount : acc))
    );
  };

  const handleDelete = (accountId) => {
    setAccountsArray((prev) => prev.filter((acc) => acc._id !== accountId));
    setTotalLeads((prev) => prev - 1);
  };

  if (searchError || fetchError) {
    console.error("Error:", searchError || fetchError);
  }
  return (
    <Box>
      <Box
        bg="white"
        borderRadius="0px"
        minHeight="100vh"
        marginTop={"-16px"}
        marginLeft={"-4px"}
      >
        <Header
          accountCount={totalLeads}
          onAdd={handleAdd}
          isAdding={isAdding}
          searchComponent={
            <CustomSearchInput
              searchbox={searchQuery}
              setSearchbox={handleQueryChange}
              onSearch={handleSearch}
              isLoading={isSearching || isGetting}
            />
          }
          onClear={handleClear}
          searchQuery={searchQuery}
        />
        <Pagination
          data={accountsArray}
          totalPages={totalPages}
          totalLeads={totalLeads}
          isLoading={isGetting || isSearching}
          fetchData={handleFetchData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setData={setAccountsArray}
          setTotalPages={setTotalPages}
          setTotalLeads={setTotalLeads}
        />
        <AccountsView
          accounts={accountsArray}
          setAccounts={setAccountsArray}
          searchQuery={searchQuery}
          refetch={searchTerm ? refetchSearch : refetchAll}
          isGetting={isGetting || isSearching}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          skeletonCount={skeletonCount}
        />
      </Box>
    </Box>
  );
}
