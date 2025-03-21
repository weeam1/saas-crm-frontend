import React, { useState, useEffect } from "react";
import AccountsView from "./View";
import Header from "./components/Header";
import Pagination from "./components/Pagination";
import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import CustomSearchInput from "./components/Search";

export default function Index() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [accountsArray, setAccountsArray] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [displaySearchData, setDisplaySearchData] = useState(false);

  const [createItemMutation, { isLoading: isAdding }] = useCreateItemMutation();
  const {
    data,
    error,
    isLoading: isGetting,
    refetch,
  } = useFetchItemsQuery(
    {
      path: "/bankAccount/get",
      params: { page: currentPage, pageSize: pageSize },
    },
    { refetchOnMountOrArgChange: true }
  );

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
    if (data) {
      const fetchedAccounts = data.data || [];
      setAllAccounts((prev) => {
        const existingIds = new Set(prev.map((acc) => acc._id));
        const newAccounts = fetchedAccounts.filter(
          (acc) => !existingIds.has(acc._id)
        );
        return [...prev, ...newAccounts];
      });
      if (!searchQuery || searchQuery === "") {
        setAccountsArray(fetchedAccounts);
        setTotalLeads(data.total || 0);
      } else {
        const filtered = allAccounts.filter((item) =>
          dataColumns.some((column) => {
            const value = item[column.accessor];
            return (
              value &&
              String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        );
        setAccountsArray(filtered);
        setTotalLeads(filtered.length);
      }
      setTotalPages(data.totalPages || 1);
    }
  }, [data, searchQuery]);

  useEffect(() => {
    refetch();
  }, [currentPage, pageSize, refetch]);

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
    setAccountsArray(results || []);
    setTotalLeads(results ? results.length : 0);
  };

  const handleFetchData = (searchTerm, page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleQueryChange = (query) => {
    setSearchQuery(query);
  };

  const handleClear = () => {
    setSearchQuery("");
    setDisplaySearchData(false);
    setAccountsArray(
      allAccounts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    );
    setTotalLeads(data ? data.total || 0 : 0);
  };

  const handleUpdate = (updatedAccount) => {
    setAccountsArray((prev) =>
      prev.map((acc) => (acc._id === updatedAccount._id ? updatedAccount : acc))
    );
    setAllAccounts((prev) =>
      prev.map((acc) => (acc._id === updatedAccount._id ? updatedAccount : acc))
    );
    if (searchQuery) {
      const filtered = allAccounts
        .map((acc) => (acc._id === updatedAccount._id ? updatedAccount : acc))
        .filter((item) =>
          dataColumns.some((column) => {
            const value = item[column.accessor];
            return (
              value &&
              String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        );
      setAccountsArray(filtered);
      setTotalLeads(filtered.length);
    }
  };

  const handleDelete = (accountId) => {
    setAccountsArray((prev) => prev.filter((acc) => acc._id !== accountId));
    setAllAccounts((prev) => prev.filter((acc) => acc._id !== accountId));
    if (searchQuery) {
      const filtered = allAccounts
        .filter((acc) => acc._id !== accountId)
        .filter((item) =>
          dataColumns.some((column) => {
            const value = item[column.accessor];
            return (
              value &&
              String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
          })
        );
      setAccountsArray(filtered);
      setTotalLeads(filtered.length);
    } else {
      setTotalLeads((prev) => prev - 1);
    }
  };

  const dataColumns = [
    { accessor: "account_holder_name" },
    { accessor: "bank_name" },
    { accessor: "account_number" },
    { accessor: "iban" },
    { accessor: "branch_address" },
    { accessor: "swift_code" },
  ];

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
        searchComponent={
          <CustomSearchInput
            allData={allAccounts}
            setSearchbox={handleQueryChange}
            isPaginated={false}
            setDisplaySearchData={setDisplaySearchData}
            searchbox={searchQuery}
            dataColumn={dataColumns}
            onSearch={handleSearchResults}
          />
        }
        onClear={handleClear}
        searchQuery={searchQuery}
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
          isGetting={isGetting}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </Box>
  );
}
