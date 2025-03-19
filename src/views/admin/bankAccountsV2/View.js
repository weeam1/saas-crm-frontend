import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import AccountCard from "./components/AccountCard";
import { useUpdateItemMutation, useDeleteItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";

const AccountsView = ({ accounts = [], refetch }) => {
  const [updateItemMutation, { isLoading: isUpdating }] =
    useUpdateItemMutation();
  const [deleteItemMutation, { isLoading: isDeleting }] =
    useDeleteItemMutation();

  const handleUpdate = async (updatedAccount, accountId) => {
    try {
      await updateItemMutation({
        path: `/bankAccount/edit/${accountId}`,
        body: updatedAccount,
      }).unwrap();

      toast.success("The account has been updated successfully.", {
        autoClose: 3000,
      });

      refetch();
    } catch (error) {
      console.error("Failed to update account:", error);
      toast.error(
        error.data?.message ||
          "Failed to update the account. Please try again.",
        {
          autoClose: 3000,
        }
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

      refetch();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(
        error.data?.message ||
          "Failed to delete the account. Please try again.",
        {
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <Box p={6} fontFamily="DM Sans">
      {accounts.length === 0 ? (
        <Text
          textAlign="center"
          color="#666"
          fontSize="lg"
          fontFamily="DM Sans"
        >
          No accounts available.
        </Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 1, md: 2, lg: 3 }}
          spacing={{ base: 4, md: 6 }}
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
