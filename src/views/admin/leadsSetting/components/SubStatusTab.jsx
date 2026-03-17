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
  Text,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NoData from "components/Message/NoData";
import TableSkeleton from "./TableSkeleton";
import StatusBadge from "./StatusBadge";

const SubStatusTab = ({
  subStatuses,
  isLoading,
  onEdit,
  onDelete,
  generateBgColor,
}) => {
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const thBg = useColorModeValue("brand.200", "gray.700");

  const columns = useMemo(
    () => [
      { Header: "Status", accessor: "status", width: 150 },
      { Header: "Name", accessor: "label", width: 150 },
      { Header: "Color Preview", accessor: "colors", width: 150 },
      { Header: "Parent Status", accessor: "parentLabel", width: 150 },
      { Header: "Meta", accessor: "meta", width: 150 },
      { Header: "Actions", accessor: "actions", width: 100 },
    ],
    [],
  );

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
              // Get parent info from mainStatus array
              const parentMain = status.mainStatus && status.mainStatus[0];

              return (
                <Tr key={status._id} _hover={{ bg: hoverBg }}>
                  <Td textAlign="center">
                    <StatusBadge
                      status={status}
                      generateBgColor={generateBgColor}
                    />
                  </Td>
                  <Td textAlign="center" fontWeight="500">
                    {status.label}
                  </Td>

                  <Td textAlign="center">
                    <Flex align="center" justify="center" gap={2}>
                      <Box
                        w="20px"
                        h="20px"
                        borderRadius="md"
                        bg={status.color}
                      />
                      <Box
                        w="20px"
                        h="20px"
                        borderRadius="md"
                        bg={status.bgColor || generateBgColor(status.color)}
                      />
                      <Text fontSize="xs" color="gray.500">
                        {status.color}
                      </Text>
                    </Flex>
                  </Td>

                  <Td textAlign="center">
                    {parentMain ? (
                      <Badge colorScheme="teal">{parentMain.label}</Badge>
                    ) : (
                      "—"
                    )}
                  </Td>

                  <Td textAlign="center">
                    {status.metaStatus ? (
                      <Badge colorScheme="purple">
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
                      <IconButton
                        icon={<EditIcon />}
                        size="xs"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onEdit(status)}
                        aria-label="Edit substatus"
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => onDelete(status?._id)}
                        aria-label="Delete substatus"
                      />
                      {/* Add delete button if needed */}
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
    </Box>
  );
};

export default SubStatusTab;
