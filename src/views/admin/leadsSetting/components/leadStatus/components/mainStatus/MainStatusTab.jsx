import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Badge,
  useColorModeValue,
  Text,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import NoData from "components/Message/NoData";
import TableSkeleton from "../../../TableSkeleton";
import StatusBadge from "../../../StatusBadge";
import DeleteConfirmationModal from "../../DeleteModal";
import { useFetchItemsQuery } from "api/apiSlice";
import MainStatusCoinEdit from "./MainStatsCoinEdit";

const MainStatusTab = ({
  mainStatuses,
  isLoading,
  onEdit,
  onDelete,
  generateBgColor,
  isDeleting,
  deletingId,
  isUpdating,
  updateData, // Add this prop
  refetchMainStatuses,
}) => {
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const thBg = useColorModeValue("brand.200", "gray.700");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [availableReplacements, setAvailableReplacements] = useState([]);

  const columns = useMemo(
    () => [
      { Header: "Order", accessor: "order", width: 80 },
      { Header: "Name", accessor: "label", width: 150 },
      { Header: "Coin Cost", accessor: "coinCost", width: 120 },
      { Header: "Meta Status", accessor: "metaStatus", width: 180 },
      { Header: "Actions", accessor: "actions", width: 100 },
    ],
    [],
  );

  // Fetch all main statuses for replacements
  const { data: replacementsData, isLoading: isLoadingReplacements } =
    useFetchItemsQuery(
      {
        path: "/lead/main-status",
        params: { includeSubStatuses: true, limit: 100 },
      },
      {
        refetchOnMountOrArgChange: false,
        skip: !deleteModalOpen && !selectedStatus,
      },
    );

  // Process the replacements data when it's received
  useEffect(() => {
    if (replacementsData?.doc && selectedStatus) {
      const filtered = replacementsData.doc.filter(
        (status) => status._id !== selectedStatus._id,
      );
      setAvailableReplacements(filtered);
    } else {
      setAvailableReplacements([]);
    }
  }, [replacementsData, selectedStatus]);

  const hasReplacements = availableReplacements.length > 0;

  const handleDeleteClick = (status) => {
    setSelectedStatus(status);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (replacementId) => {
    if (selectedStatus) {
      onDelete(selectedStatus._id, selectedStatus.label, replacementId);
    }
    setDeleteModalOpen(false);
    setSelectedStatus(null);
    setAvailableReplacements([]);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedStatus(null);
    setAvailableReplacements([]);
  };

  return (
    <Box maxHeight="60vh" overflowY="auto" scrollBehavior="smooth">
      <Table variant="striped" size="sm">
        <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
          <Tr h="12">
            {columns.map((col) => (
              <Th
                key={col.accessor}
                minW={col?.width ? `${col.width}px` : "100px"}
                textAlign="center"
                py="4"
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
                textTransform="capitalize"
              >
                {col.Header}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {isLoading ? (
            <TableSkeleton columns={columns} rowCount={5} />
          ) : mainStatuses.length > 0 ? (
            mainStatuses.map((status) => (
              <Tr
                key={status._id}
                _hover={{ bg: hoverBg }}
                opacity={isDeleting && deletingId === status._id ? 0.5 : 1}
                transition="opacity 0.2s"
              >
                <Td textAlign="center">{status.order || "-"}</Td>
                <Td textAlign="center">
                  <StatusBadge
                    status={status}
                    generateBgColor={generateBgColor}
                  />
                </Td>

                {/* Coin Cost column with edit functionality */}
                <Td textAlign="center">
                  <MainStatusCoinEdit
                    status={status}
                    updateData={updateData}
                    refetchMainStatuses={refetchMainStatuses}
                  />
                </Td>

                <Td textAlign="center">
                  {status.metaStatus ? (
                    <Badge colorScheme="purple" textTransform="none">
                      {typeof status.metaStatus === "object"
                        ? status.metaStatus.label
                        : status.metaStatus}
                    </Badge>
                  ) : (
                    <Text fontSize="xs" color="gray.400">
                      —
                    </Text>
                  )}
                </Td>

                <Td textAlign="center">
                  <HStack spacing={1} justify="center">
                    <Tooltip label="Edit main status" hasArrow>
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onEdit(status)}
                        aria-label="Edit status"
                        isLoading={isUpdating && deletingId === status._id}
                        isDisabled={
                          isDeleting ||
                          ["deal", "new", "show"].includes(status.value)
                        }
                      />
                    </Tooltip>

                    <Tooltip label="Delete main status" hasArrow>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(status)}
                        aria-label="Delete status"
                        isLoading={isDeleting && deletingId === status._id}
                        isDisabled={
                          isDeleting ||
                          ["deal", "new", "show"].includes(status.value)
                        }
                        _hover={{ bg: "red.50", color: "red.500" }}
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} py="10">
                <NoData label="main statuses" />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Main Status"
        itemName={selectedStatus?.label}
        mainStatusName="Main Status"
        itemType="main status"
        availableReplacements={availableReplacements}
        isLoading={isLoadingReplacements || isDeleting}
        warningType={!hasReplacements ? "error" : "warning"}
        confirmText="Delete Status"
      />
    </Box>
  );
};

export default MainStatusTab;
