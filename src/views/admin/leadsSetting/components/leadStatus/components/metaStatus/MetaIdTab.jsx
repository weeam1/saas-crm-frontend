import React, { useMemo } from "react";
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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import NoData from "components/Message/NoData";
import TableSkeleton from "../../../TableSkeleton";

const MetaIdTab = ({
  metaIds,
  isLoading,
  onEdit,
  onDelete,
  isDeleting, // Add this prop
  deletingId, // Add this prop to track which item is being deleted
}) => {
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const thBg = useColorModeValue("brand.200", "gray.700");

  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "label", width: 200 },
      { Header: "Key", accessor: "key", width: 200 },
      { Header: "Description", accessor: "description", width: 400 },
      { Header: "Actions", accessor: "actions", width: 100 },
    ],
    [],
  );

  return (
    <Box>
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
              <TableSkeleton columns={columns} rowCount={3} />
            ) : metaIds && metaIds.length > 0 ? (
              metaIds.map((metaId) => (
                <Tr key={metaId._id || metaId.id} _hover={{ bg: hoverBg }}>
                  <Td
                    textAlign="center"
                    maxW="400px"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    {metaId.label}
                  </Td>
                  <Td textAlign="center" fontWeight="500">
                    <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
                      {metaId.key}
                    </Badge>
                  </Td>
                  <Td
                    textAlign="center"
                    maxW="400px"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    {metaId.description || "-"}
                  </Td>
                  <Td textAlign="center">
                    <Flex gap={1} justify="center">
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onEdit(metaId)}
                        aria-label="Edit meta ID"
                        isLoading={isDeleting && deletingId === metaId._id} // Add loading if needed
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(metaId._id, metaId.key)}
                        aria-label="Delete meta ID"
                        isLoading={isDeleting && deletingId === metaId._id}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length} py="10">
                  <NoData label="meta IDs" />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default MetaIdTab;
