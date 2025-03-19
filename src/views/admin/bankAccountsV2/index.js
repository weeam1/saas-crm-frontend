import React, { useState } from "react";
import AccountsView from "./View";
import Header from "./components/Header";
import { useCreateItemMutation } from "api/apiSlice";
import { Box, Grid, Skeleton, useBreakpointValue } from "@chakra-ui/react";
import { toast } from "react-toastify";

export default function Index() {
  const [createItemMutation, { isLoading: isAdding }] = useCreateItemMutation();
  const [accountsArray, setAccountsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const skeletonCount = isLoading
    ? accountsArray.length > 0
      ? accountsArray.length
      : 9
    : 0;

  const handleAdd = async (newAccount) => {
    try {
      await createItemMutation({
        path: "/bankAccount/add",
        body: newAccount,
      }).unwrap();
      toast.success("The new account has been added successfully.", {
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Failed to add account:", error);
      toast.error(
        error.data?.message || "Failed to add the account. Please try again.",
        {
          autoClose: 3000,
        }
      );
    }
  };

  const handleSearchResults = (results) => {
    setAccountsArray(results || []);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Box bg="white" minHeight="100vh">
        <Header
          accountCount={accountsArray.length}
          onAdd={handleAdd}
          isAdding={isAdding}
          onSearchResults={handleSearchResults} 
        />
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
      </Box>
    );
  }

  return (
    <Box bg="white"  borderRadius='8px' minHeight="100vh">
      <Header
        accountCount={accountsArray.length}
        onAdd={handleAdd}
        isAdding={isAdding}
        onSearchResults={handleSearchResults} // Passing the function
      />
      <AccountsView accounts={accountsArray} />
    </Box>
  );
}