import React, { useState, useEffect } from "react";
import AccountsView from "./View";
import Header from "./components/Header";
import Pagination from "./components/Pagination";
import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [accountsArray, setAccountsArray] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search query

  const [createItemMutation, { isLoading: isAdding }] = useCreateItemMutation();

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

  const {
    data,
    error,
    isLoading: isGetting,
    refetch,
  } = useFetchItemsQuery(
    {
      path: "/bankAccount/get",
      params: {
        searchTerm: "",
        page: currentPage,
        pageSize: pageSize,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (data) {
      setAccountsArray(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalLeads(data.total || 0);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [currentPage, pageSize]);

  const handleAdd = async (newAccount) => {
    try {
      await createItemMutation({
        path: "/bankAccount/add",
        body: newAccount,
      }).unwrap();
      setCurrentPage(1);
      refetch();
      return null;
    } catch (error) {
      console.error("Failed to add account - Full Error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to add the account. Please try again.";
      if (errorMessage.includes("account number, IBAN, or SWIFT code")) {
        return {
          account_number: "Bank account number is already added",
          iban: "IBAN is already added",
          swift_code: "SWIFT code is already added",
        };
      }
      return { general: errorMessage };
    }
  };

  const handleSearchResults = (results) => {
    console.log("search set");
    setAccountsArray(results || []);
  };

  const handleFetchData = (searchTerm, page, size) => {
    console.log("fetch data");
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleQueryChange = (query) => {
    setSearchQuery(query);
  };

  const skeletonCount = isGetting
    ? accountsArray.length > 0
      ? accountsArray.length
      : 9
    : 0;

  if (error) {
    console.error("Error fetching accounts:", error);
  }

  return (
    <Box bg="white" borderRadius="8px" minHeight="100vh">
      <Header
        accountCount={totalLeads}
        onAdd={handleAdd}
        isAdding={isAdding}
        onSearchResults={handleSearchResults}
        onQueryChange={handleQueryChange}
      />
      <Pagination
        data={accountsArray}
        totalPages={totalPages}
        totalLeads={totalLeads}
        isLoading={isGetting}
        fetchData={handleFetchData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setData={setAccountsArray}
        setTotalPages={setTotalPages}
        setTotalLeads={setTotalLeads}
      />
      {isGetting && accountsArray.length === 0 ? (
        <Grid {...gridProps}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton
              key={index}
              height="350px"
              borderRadius="md"
              startColor="gray.100"
              endColor="gray.200"
            />
          ))}
        </Grid>
      ) : (
        <AccountsView
          accounts={accountsArray}
          setAccounts={setAccountsArray}
          searchQuery={searchQuery}
          refetch={refetch}
        />
      )}
    </Box>
  );
}
