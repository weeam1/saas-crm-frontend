import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Badge,
  Text,
  Tooltip,
  TableContainer,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NoData from "components/Message/NoData";
import TableSkeleton from "../../../TableSkeleton";
import StatusBadge from "../../../StatusBadge";
import DeleteConfirmationModal from "../../DeleteModal";
import { useFetchItemsQuery } from "api/apiSlice";
import { useModalColors } from "hooks/useModalColors";

const SubStatusTab = ({
  subStatuses,
  isLoading,
  onEdit,
  onDelete,
  generateBgColor,
  isDeleting,
  deletingId,
}) => {
  const colors = useModalColors();

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
  } = useFetchItemsQuery(
    {
      path: `/lead/main-status/${selectedStatus?.mainStatus?._id}`,
      params: { includeSubStatuses: true },
    },
    {
      refetchOnMountOrArgChange: false,
      skip: !selectedStatus?.mainStatus?._id && !deleteModalOpen,
    },
  );

  // Process the replacements data when it's received
  useEffect(() => {
    if (replacementsData?.doc && selectedStatus) {
      const mainStatusData = replacementsData.doc;
      const allSubStatuses =
        mainStatusData?.statuses || mainStatusData?.subStatuses || [];
      const filtered = allSubStatuses.filter(
        (s) => s._id !== selectedStatus._id,
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

  const hasData = subStatuses && subStatuses.length > 0;

  return (
    <TableContainer
            maxHeight="70vh"
      minH="70vh"
      overflowY="auto"
      overflowX="auto"
      border="1px solid"
      borderColor={colors.borderColor}
      borderRadius="lg"
    >
      <Table variant="simple" size="sm">
        <Thead position="sticky" top={0} bg={colors.bg} zIndex={1}>
          <Tr>
            {columns.map((col) => (
              <Th
                key={col.accessor}
                width={col?.width ? `${col.width}px` : "auto"}
                minWidth={col?.width ? `${col.width}px` : "100px"}
                textAlign="center"
                py={3}
                fontSize="sm"
                fontWeight="semibold"
                color={colors.headingText}
                textTransform="capitalize"
                borderBottom={`2px solid ${colors.borderColor}`}
                whiteSpace="nowrap"
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
            subStatuses.map((status) => (
              <Tr
                key={status._id}
                bg={colors.bg}
                _hover={{ bg: colors.bgInputHover }}
                borderBottom={`1px solid ${colors.borderColor}`}
                opacity={isDeleting && deletingId === status._id ? 0.5 : 1}
                transition="opacity 0.2s ease"
              >
                <Td textAlign="center" py={3}>
                  {status?.mainStatus ? (
                    <StatusBadge
                      status={status?.mainStatus}
                      generateBgColor={generateBgColor}
                    />
                  ) : (
                    <Text fontSize="xs" color={colors.mutedText}>—</Text>
                  )}
                </Td>

                <Td textAlign="center" py={3}>
                  <StatusBadge
                    status={status}
                    generateBgColor={generateBgColor}
                  />
                </Td>

                <Td textAlign="center" py={3}>
                  {status.metaStatus ? (
                    <Badge
                      bg={`rgba(212, 175, 55, 0.15)`}
                      color={colors.accentGold}
                      textTransform="none"
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="medium"
                    >
                      {typeof status.metaStatus === "object"
                        ? status.metaStatus.label || status.metaStatus.key
                        : status.metaStatus}
                    </Badge>
                  ) : (
                    <Text fontSize="xs" color={colors.mutedText}>—</Text>
                  )}
                </Td>

                <Td textAlign="center" py={3}>
                  <Flex gap={1} justify="center">
                    <Tooltip label="Edit substatus" hasArrow>
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        variant="ghost"
                        onClick={() => onEdit(status)}
                        aria-label="Edit substatus"
                        isDisabled={isDeleting}
                        color={colors.accentGold}
                        _hover={{
                          bg: `rgba(212, 175, 55, 0.1)`,
                          color: colors.goldLight,
                          transform: "scale(1.1)",
                        }}
                        transition="all 0.2s ease"
                      />
                    </Tooltip>

                    <Tooltip label="Delete substatus" hasArrow>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        variant="ghost"
                        onClick={() => handleDeleteClick(status)}
                        aria-label="Delete substatus"
                        isLoading={isDeleting && deletingId === status._id}
                        isDisabled={isDeleting}
                        color={colors.badgeErrorText}
                        _hover={{
                          bg: colors.badgeErrorBg,
                          color: colors.badgeErrorText,
                          transform: "scale(1.1)",
                        }}
                        transition="all 0.2s ease"
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} py={10} textAlign="center">
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
    </TableContainer>
  );
};

export default SubStatusTab;