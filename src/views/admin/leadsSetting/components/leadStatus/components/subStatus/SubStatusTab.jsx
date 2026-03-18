import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Badge,
  useColorModeValue,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NoData from "components/Message/NoData";
import TableSkeleton from "../../../TableSkeleton";
import StatusBadge from "../../../StatusBadge";
import DeleteConfirmationModal from "../../DeleteModal";
import { useFetchItemsQuery } from "api/apiSlice";

const SubStatusTab = ({
  subStatuses,
  isLoading,
  onEdit,
  onDelete,
  generateBgColor,
  isDeleting,
  deletingId,
}) => {
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const thBg = useColorModeValue("brand.200", "gray.700");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [availableReplacements, setAvailableReplacements] = useState([]);

  // Define columns
  const columns = useMemo(
    () => [
      { Header: "Main Status", accessor: "mainStatus", width: 150 },
      { Header: "Name", accessor: "label", width: 150 },
      { Header: "Meta", accessor: "meta", width: 150 },
      { Header: "Actions", accessor: "actions", width: 100 },
    ],
    [],
  );

  const {
    data: replacementsData,
    isLoading: isLoadingReplacements,
    isSuccess,
    error,
  } = useFetchItemsQuery(
    selectedStatus?.mainStatus?._id && deleteModalOpen
      ? {
          path: `/lead/main-status/${selectedStatus.mainStatus._id}`,
          params: { includeSubStatuses: true }, // This should create ?includeSubStatuses=true
        }
      : { skip: true },
    {
      refetchOnMountOrArgChange: false,
    },
  );

  // Process the replacements data when it's received
  useEffect(() => {
    if (replacementsData?.doc && selectedStatus) {
      console.log("Processing replacements data:", replacementsData.doc);

      // The API returns a single main status with its subStatuses
      const mainStatusData = replacementsData.doc;

      // Check if the data has statuses array (from your useMainStatus hook pattern)
      const allSubStatuses =
        mainStatusData?.statuses || mainStatusData?.subStatuses || [];

      console.log("All sub statuses from API:", allSubStatuses);

      // Filter out the current status
      const filtered = allSubStatuses.filter(
        (s) => s._id !== selectedStatus._id,
      );

      console.log("Filtered replacements:", filtered);
      setAvailableReplacements(filtered);
    } else {
      setAvailableReplacements([]);
    }
  }, [replacementsData, selectedStatus]);

  const hasReplacements = availableReplacements.length > 0;

  const handleDeleteClick = (status) => {
    console.log("Delete clicked for status:", status);
    setSelectedStatus(status);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = (replacementId) => {
    if (selectedStatus) {
      // Pass both the ID and the replacement ID to the parent
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

  // Check if we have data to display
  const hasData = subStatuses && subStatuses.length > 0;

  return (
    <Box maxHeight="60vh" overflowY="auto">
      <Table variant="striped" size="sm">
        <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
          <Tr h="12">
            {columns.map((col) => (
              <Th
                key={col.accessor}
                minW={col?.width ? `${col.width}px` : "100px"}
                textAlign="center"
                py="2"
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
          ) : hasData ? (
            subStatuses.map((status) => {
              return (
                <Tr
                  key={status._id}
                  _hover={{ bg: hoverBg }}
                  opacity={isDeleting && deletingId === status._id ? 0.5 : 1}
                  transition="opacity 0.2s"
                >
                  <Td textAlign="center">
                    {status?.mainStatus ? (
                      <Badge colorScheme="teal" textTransform="none">
                        {status.mainStatus.label}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </Td>

                  <Td textAlign="center">
                    <StatusBadge
                      status={status}
                      generateBgColor={generateBgColor}
                    />
                  </Td>

                  <Td textAlign="center">
                    {status.metaStatus ? (
                      <Badge colorScheme="purple" textTransform="none">
                        {typeof status.metaStatus === "object"
                          ? status.metaStatus.label || status.metaStatus.key
                          : status.metaStatus}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </Td>

                  <Td textAlign="center">
                    <Flex gap={1} justify="center">
                      <Tooltip label="Edit substatus" hasArrow>
                        <IconButton
                          icon={<EditIcon />}
                          size="xs"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => onEdit(status)}
                          aria-label="Edit substatus"
                          isDisabled={isDeleting}
                        />
                      </Tooltip>

                      <Tooltip label="Delete substatus" hasArrow>
                        <IconButton
                          icon={<DeleteIcon />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteClick(status)}
                          aria-label="Delete substatus"
                          isLoading={isDeleting && deletingId === status._id}
                          isDisabled={isDeleting}
                          _hover={{ bg: "red.50", color: "red.500" }}
                        />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              );
            })
          ) : (
            <Tr>
              <Td colSpan={columns.length} py="10">
                <NoData label="sub statuses" />
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
        title="Delete Sub Status"
        itemName={selectedStatus?.label}
        mainStatusName={selectedStatus?.mainStatus?.label}
        itemType="sub-status"
        availableReplacements={availableReplacements}
        isLoading={isLoadingReplacements || isDeleting}
        warningType={!hasReplacements ? "error" : "warning"}
        confirmText="Delete Status"
      />
    </Box>
  );
};

export default SubStatusTab;
