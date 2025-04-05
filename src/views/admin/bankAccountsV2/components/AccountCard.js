import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  IconButton,
  Text,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import DeleteIconSvg from "../../../../assets/img/bankaccount/Vector.png";
import EditIconSvg from "../../../../assets/img/bankaccount/ic_baseline-edit.png";
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
      minH={{ base: "auto", md: "320px" }}
      p={{ base: 4, md: 6 }}
      borderWidth="1px"
      borderColor="#E2E8F0"
      borderRadius="16px"
      boxShadow="md"
      position="relative"
      bg="white"
      transition="transform 0.2s"
      _hover={{ boxShadow: "lg" }}
      overflow="hidden"
    >
      <Flex position="absolute" top={4} right={4} alignItems="center" gap={2}>
        <EditAccountModal
          account={account}
          onUpdate={onUpdate}
          isUpdating={isUpdating}
        >
          <Tooltip label="Edit" hasArrow>
            <IconButton
              icon={
                <img
                  src={EditIconSvg}
                  alt="Edit"
                  style={{ width: 22, height: 22 }}
                />
              }
              size="md"
              variant="ghost"
              aria-label="Edit account"
              isDisabled={isUpdating || isDeleting}
            />
          </Tooltip>
        </EditAccountModal>

        <Tooltip label="Delete" hasArrow>
          <IconButton
            icon={
              <img
                src={DeleteIconSvg}
                color="#B79045"
                alt="Delete"
                style={{ width: 22, height: 22 }}
              />
            }
            size="md"
            variant="ghost"
            onClick={handleOpenDeleteModal}
            aria-label="Delete account"
            isDisabled={isUpdating || isDeleting}
          />
        </Tooltip>
      </Flex>

      <VStack align="start" w="100%" spacing={{ base: 3, md: 4 }}>
        <Box>
          <Text
            fontWeight="medium"
            color="#605F5F"
            fontSize={{ base: "12px", md: "14px" }}
            fontFamily="DM Sans"
          >
            Account Name
          </Text>
          <Text
            color="#B79045"
            fontSize={{ base: "16px", md: "20px" }}
            fontWeight="bold"
            fontFamily="DM Sans"
          >
            {account.account_holder_name || "N/A"}
          </Text>
        </Box>

        <Divider borderColor="#D8D8D8" borderWidth="1px" />

        <Flex
          w="100%"
          gap={{ base: 4, md: 6 }}
          direction={{ base: "column", md: "row", lg: "row" }}
        >
          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize={{ base: "12px", md: "14px" }}
              fontFamily="DM Sans"
            >
              Account Number
            </Text>
            <Text
              color="#000"
              fontSize={{ base: "14px", md: "16px" }}
              fontWeight="bold"
              fontFamily="DM Sans"
              wordBreak="break-all"
            >
              {account.account_number || "N/A"}
            </Text>
          </Flex>

          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize={{ base: "12px", md: "14px" }}
              fontFamily="DM Sans"
            >
              IBAN
            </Text>
            <Text
              color="#000"
              fontSize={{ base: "14px", md: "16px" }}
              fontWeight="bold"
              fontFamily="DM Sans"
              wordBreak="break-all"
            >
              {account.iban || "N/A"}
            </Text>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          gap={{ base: 4, md: 6 }}
          direction={{ base: "column", md: "row", lg: "row" }}
        >
          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize={{ base: "12px", md: "14px" }}
              fontFamily="DM Sans"
            >
              Swift Code
            </Text>
            <Text
              color="#000"
              fontSize={{ base: "14px", md: "16px" }}
              fontWeight="bold"
              fontFamily="DM Sans"
              wordBreak="break-all"
            >
              {account.swift_code || "N/A"}
            </Text>
          </Flex>

          <Flex flex="1" direction="column">
            <Text
              fontWeight="medium"
              color="#464646"
              fontSize={{ base: "12px", md: "14px" }}
              fontFamily="DM Sans"
            >
              Bank
            </Text>
            <Text
              color="#000"
              fontSize={{ base: "14px", md: "16px" }}
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
            fontSize={{ base: "12px", md: "14px" }}
            fontFamily="DM Sans"
          >
            Bank Address
          </Text>
          <Text
            color="#000"
            fontSize={{ base: "14px", md: "16px" }}
            fontWeight="bold"
            fontFamily="DM Sans"
            wordBreak="break-word"
          >
            {account.branch_address || "N/A"}
          </Text>
        </Flex>
        <Flex flex="1" direction="column">
          <Text
            fontWeight="medium"
            color="#464646"
            fontSize={{ base: "12px", md: "14px" }}
            fontFamily="DM Sans"
          >
            Developer email
          </Text>
          <Text
            color="#000"
            fontSize={{ base: "14px", md: "16px" }}
            fontWeight="bold"
            fontFamily="DM Sans"
          >
            {account.developer_id?.email || "N/A"}
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
