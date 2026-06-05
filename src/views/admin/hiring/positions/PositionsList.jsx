import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Box,
  Text,
  Center,
  Badge,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import NoData from "components/Message/NoData";
import TableLoading from "components/loading/TableLoading";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import CustomTooltip from "components/shared/CustomTooltip";
import { useModalColors } from "hooks/useModalColors";

const PositionsList = ({ positions, onEdit, isLoading = false }) => {
  const colors = useModalColors();
  const [delayedLoading, setDelayedLoading] = useState(isLoading);

  const columns = [
    { key: "name", label: "Position Name", width: "300px" },
    { key: "status", label: "Status", width: "120px" },
    { key: "createdAt", label: "Created At", width: "150px" },
    { key: "actions", label: "Actions", width: "100px" },
  ];

  useEffect(() => {
    let timer;
    if (isLoading) {
      setDelayedLoading(true);
    } else {
      timer = setTimeout(() => {
        setDelayedLoading(false);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatValue = (key, row) => {
    switch (key) {
      case "createdAt":
        return formatDate(row.createdAt);

      case "status":
        return (
          <Badge
            bg={row.status ? `rgba(212, 175, 55, 0.15)` : `rgba(238, 93, 80, 0.15)`}
            color={row.status ? colors.accentGold : colors.badgeErrorText}
            px={2}
            py={1}
            borderRadius="full"
            fontSize="xs"
            display="inline-flex"
            alignItems="center"
            width="fit-content"
          >
            {row.status ? "Active" : "Inactive"}
          </Badge>
        );

      case "name":
        return (
          <Box>
            <Text fontWeight="600" fontSize="sm" color={colors.headingText}>
              {row.name}
            </Text>
          </Box>
        );

      default:
        return row[key] || "N/A";
    }
  };

  const data = positions?.doc || [];

  return (
    <Box
      my="2"
      overflowX="auto"
      overflowY="auto"
          maxHeight="70vh"
      minH="70vh"T
      borderWidth="1px"
      borderColor={colors.borderColor}
      rounded="xl"
      boxShadow={colors.cardShadow}
      bg={colors.bg}
    >
      <Table variant="simple" size="sm">
        <Thead bg={colors.bgDeep} position="sticky" top={0} zIndex={1}>
          <Tr>
            {columns.map((column) => (
              <Th
                key={column.key}
                whiteSpace="nowrap"
                textTransform="capitalize"
                fontSize="sm"
                py={4}
                textAlign="left"
                fontWeight="semibold"
                color={colors.headingText}
                minW={column.width}
                borderBottom={`2px solid ${colors.borderColor}`}
              >
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody>
          {isLoading || delayedLoading ? (
            <TableLoading columns={columns} length={10} py="4" />
          ) : !data || data.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length} py={10} textAlign="center">
                <Center>
                  <NoData label="positions" />
                </Center>
              </Td>
            </Tr>
          ) : (
            data.map((row, index) => (
              <Tr
                key={row._id || index}
                _hover={{ bg: colors.bgInputHover }}
                bg={colors.bg}
                transition="background-color 0.2s ease-in-out"
              >
                {columns.map((column) => (
                  <Td
                    key={column.key}
                    py={3}
                    px={3}
                    wordBreak="break-word"
                    fontSize="sm"
                    minW={column.width}
                    maxW="400px"
                    textAlign="left"
                    color={colors.bodyText}
                    borderBottom={`1px solid ${colors.borderColor}`}
                  >
                    {column.key === "actions" ? (
                      <Flex
                        align="center"
                        justifyContent="flex-start"
                        gap={2}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CustomTooltip label="Edit Position">
                          <IconButton
                            aria-label="Edit"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(row)}
                            color={colors.bodyText}
                            _hover={{
                              color: colors.accentGold,
                              bg: colors.secondaryBtnHoverBg,
                            }}
                            transition="all 0.2s ease"
                          />
                        </CustomTooltip>
                      </Flex>
                    ) : (
                      formatValue(column.key, row)
                    )}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PositionsList;