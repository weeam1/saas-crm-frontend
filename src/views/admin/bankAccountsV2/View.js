import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import AccountCard from "./components/AccountCard";
import { useUpdateItemMutation, useDeleteItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";

const AccountsView = ({
  accounts = [],
  setAccounts,
  refetch,
  isGetting,
  onUpdate,
  onDelete,
  skeletonCount,
}) => {
  const [updateItemMutation, { isLoading: isUpdating }] =
    useUpdateItemMutation();
  const [deleteItemMutation, { isLoading: isDeleting }] =
    useDeleteItemMutation();
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (!isGetting) {
      const timer = setTimeout(() => {
        setIsDataReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsDataReady(false);
    }
  }, [isGetting, accounts]);

  const handleUpdate = async (updatedAccount, accountId) => {
    try {
      await updateItemMutation({
        path: `/bankAccount/edit/${accountId}`,
        body: updatedAccount,
      }).unwrap();
      toast.success("The account has been updated successfully.", {
        autoClose: 3000,
      });
      onUpdate(updatedAccount);
      if (refetch) refetch();
    } catch (error) {
      console.error("Failed to update account:", error);
      toast.error(
        error.data?.message ||
          "Failed to update the account. Please try again.",
        { autoClose: 3000 }
      );
    }
  };

  const handleDelete = async (accountId) => {
    try {
      await deleteItemMutation({
        path: `/bankAccount/delete/${accountId}`,
        body: {},
      }).unwrap();
      toast.success("The account has been deleted successfully.", {
        autoClose: 3000,
      });
      onDelete(accountId);
      if (refetch) refetch();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the account. Please try again.",
        { autoClose: 3000 }
      );
    }
  };

  const renderSkeletons = () => {
    const count =
      accounts.length > 0
        ? Math.min(accounts.length, skeletonCount)
        : skeletonCount;
    return Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={`skeleton-${index}`}
        height="350px"
        borderRadius="md"
        startColor="gray.100"
        endColor="gray.200"
      />
    ));
  };

  return (
    <Box p={6} fontFamily="DM Sans">
      {isGetting || !isDataReady ? (
        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          spacing={{ base: 2 }}
          mt={8}
        >
          {renderSkeletons()}
        </SimpleGrid>
      ) : accounts.length === 0 ? (
        <Text textAlign="center" color="#666" fontSize="lg">
          No accounts available.
        </Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          spacing={{ base: 2 }}
          mt={8}
        >
          {accounts.map((account) => (
            <AccountCard
              key={account._id}
              account={account}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default AccountsView;
