import React, { useState } from "react";
import { Box, Flex, VStack, IconButton, Text, Divider } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { CiEdit } from "react-icons/ci";
import EditAccountModal from "./EditModal";
import DeleteConfirmationModal from "./DeletePopup";

const AccountCard = ({
  account,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleConfirmDelete = async () => {
    await onDelete(account._id);
    handleCloseDeleteModal();
  };

  return (
    <Box
      w="100%"
      minH="300px"
      p={6}
      borderWidth="1px"
      borderColor="#E2E8F0"
      borderRadius="12px"
      border="1px solid #D8D8D8"
      boxShadow="sm"
      position="relative"
    >
      <Flex position="absolute" top={4} right={4}  alignItems="center">
        <EditAccountModal
          account={account}
          onUpdate={onUpdate}
          isUpdating={isUpdating}
        >
          <IconButton
            icon={<CiEdit size={20} color="#B79045" />}
            size="md"
            variant="ghost"
            aria-label="Edit account"
            isDisabled={isUpdating || isDeleting}
          />
        </EditAccountModal>
        <IconButton
          icon={<DeleteIcon boxSize={4} color="#B79045" />}
          size="sm"
          variant="ghost"
          onClick={handleOpenDeleteModal}
          aria-label="Delete account"
          isDisabled={isUpdating || isDeleting}
        />
      </Flex>

      <VStack align="start" w="100%">
        <Text
          fontWeight="medium"
          color="#605F5F"
          fontSize="14px"
          fontFamily="DM Sans"
        >
          Account Name
        </Text>
        <Text
          color="#B79045"
          fontSize="16px"
          fontWeight="bold"
          fontFamily="DM Sans"
        >
          {account.account_holder_name || "N/A"}
        </Text>
        <Divider borderColor="#D8D8D8" borderWidth="1px" />

        <Flex w="100%" gap={6} direction={{ base: "column", md: "row" }}>
          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize="14px"
              fontFamily="DM Sans"
            >
              Account Number
            </Text>
            <Text
              color="#000"
              fontSize="16px"
              fontWeight="bold"
              fontFamily="DM Sans"
            >
              {account.account_number || "N/A"}
            </Text>
          </Flex>

          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize="14px"
              fontFamily="DM Sans"
            >
              IBAN
            </Text>
            <Text
              color="#000"
              fontSize="16px"
              fontWeight="bold"
              fontFamily="DM Sans"
            >
              {account.iban || "N/A"}
            </Text>
          </Flex>
        </Flex>

        <Flex w="100%" gap={6} direction={{ base: "column", md: "row" }}>
          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize="14px"
              fontFamily="DM Sans"
            >
              Swift Code
            </Text>
            <Text
              color="#000"
              fontSize="16px"
              fontWeight="bold"
              fontFamily="DM Sans"
            >
              {account.swift_code || "N/A"}
            </Text>
          </Flex>

          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize="14px"
              fontFamily="DM Sans"
            >
              Bank
            </Text>
            <Text
              color="#000"
              fontSize="16px"
              fontWeight="bold"
              fontFamily="DM Sans"
            >
              {account.bank_name || "N/A"}
            </Text>
          </Flex>
        </Flex>

        <Flex direction="column" w="100%">
          <Text
            fontWeight="medium"
            color="#464646"
            fontSize="14px"
            fontFamily="DM Sans"
          >
            Bank Address
          </Text>
          <Text
            color="#000"
            fontSize="16px"
            fontWeight="bold"
            fontFamily="DM Sans"
          >
            {account.branch_address || "N/A"}
          </Text>
        </Flex>
      </VStack>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={account.account_holder_name}
        isDeleting={isDeleting}
      />
    </Box>
  );
};

export default AccountCard;
