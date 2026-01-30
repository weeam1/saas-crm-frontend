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
import { FiTrash2 } from "react-icons/fi";
import { usePermissions } from "hooks/usePermissions";

import {
  useToast,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

import { FiEye, FiEdit } from "react-icons/fi";
import NoData from "components/Message/NoData";
import TableLoading from "components/loading/TableLoading";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import CustomTooltip from "components/shared/CustomTooltip";
import { useNavigate } from "react-router-dom";
import { getBadgeColors } from "utils/colorUtils";
import UserProfileItem from "components/table/UserProfileItem";
import { FaPlus } from "react-icons/fa6";
import useUserSession from "hooks/useUserSession";

const UserEvaluationTable = ({
  data = [],
  isLoading,
  confirmDelete,
  setView,
  month,
  year,
}) => {
  const columns = [
    { key: "user", label: "User", width: "250px" },
    { key: "roles", label: "Role", width: "150px" }, // could display role names
    { key: "agency", label: "Agency", width: "150px" }, // could display agency.name
    { key: "totalEvaluators", label: "Total Evaluators", width: "80px" },
    { key: "finalPercentage", label: "Total Percent %", width: "80px" },
    { key: "finalAvg", label: "Average", width: "80px" },
    { key: "hasEvaluated", label: "Evaluated", width: "100px" },
    // { key: 'updatedAt', label: 'Last Update', width: '180px' },
    { key: "actions", label: "Actions", width: "80px" }, // actions button
  ];
  const { hasPermission } = usePermissions();
  console.log(month, "check month");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);

  const [delayedLoading, setDelayedLoading] = useState(isLoading);

  const navigate = useNavigate();
  const { user: loggedInUser } = useUserSession();

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

  const formatValue = (key, value) => {
    switch (key) {
      case "hasEvaluted":
        return (
          <Badge
            colorScheme={value === true ? "green" : "yellow"}
            variant="subtle"
            fontSize=".9em"
            px={4}
            py={2}
            borderRadius="full"
            textTransform="uppercase"
          >
            {value === true ? "Evaluated" : "Not Evaluated"}
          </Badge>
        );
      case "roles": {
        const roleName = value?.[0]?.roleName.replace(/^./, (c) =>
          c.toUpperCase(),
        );
        // ?.replace(/([A-Z])/g, ' $1')

        const { bg, text } = getBadgeColors(roleName);

        return (
          <Badge
            bg={bg}
            color={text}
            variant="subtle"
            fontSize=".9em"
            px={4}
            py={2}
            borderRadius="full"
            textTransform="capitalize"
          >
            {roleName}
          </Badge>
        );
      }

      case "agency": {
        const { bg, text } = getBadgeColors(value?.name);

        return (
          <Badge
            bg={bg}
            color={text}
            variant="subtle"
            fontSize=".9em"
            px={4}
            py={2}
            borderRadius="full"
            textTransform="capitalize"
          >
            {value?.name}
          </Badge>
        );
      }

      case "createdAt":
      case "updatedAt":
        return value ? format(new Date(value), "MMM d, yyyy h:mm a") : "N/A";
      case "totalEvaluators":
        return value || 0;
      default:
        return value || "N/A";
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Evaluation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this user's evaluation for this
            month?
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() =>
                confirmDelete(
                  loggedInUser?._id,
                  month,
                  year,
                  onClose,
                  "USEREVAL",
                )
              }
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        my="2"
        overflowX="auto"
        overflowY="auto"
        maxH="calc(100vh - 200px)"
        borderWidth="1px"
        borderColor="gray.200"
        rounded="xl"
        boxShadow="sm"
        bg="white"
      >
        <Table variant="striped" size="sm">
          <Thead bg="brand.200" position="sticky" top={0} zIndex={1}>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.key}
                  whiteSpace="nowrap"
                  textTransform="capitalize"
                  fontSize="md"
                  py="4"
                  textAlign={["user"].includes(column.key) ? "left" : "center"}
                  fontWeight="semibold"
                  color="gray.700"
                  minW={column.width}
                >
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isLoading || delayedLoading ? (
              <TableLoading columns={columns} length={10} py="4" />
            ) : data.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} py={10}>
                  <Center>
                    <NoData label="user evaluation" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data.map((row, index) => {
                return (
                  <Tr
                    key={row._id || index}
                    _hover={{ bg: "gray.50" }}
                    bg={index % 2 === 0 ? "white" : "gray.25"}
                  >
                    {columns.map((column) => (
                      <Td
                        key={column.key}
                        py={3}
                        px={3}
                        wordBreak="break-word"
                        isTruncated={true}
                        fontSize="sm"
                        minW={column.width}
                        maxW="400px"
                        textAlign={
                          ["user"].includes(column.key) ? "left" : "center"
                        }
                        fontWeight={
                          column.key === "user" ? "semibold" : "medium"
                        }
                        color="gray.700"
                      >
                        {column.key === "user" ? (
                          <UserProfileItem user={row} cursor={false} />
                        ) : column.key === "actions" ? (
                          <Flex align="center" justify="center" gap={3}>
                            {row?.hasEvaluated && (
                              <>
                                <CustomTooltip label="View">
                                  <IconButton
                                    aria-label="View"
                                    icon={<FiEye />}
                                    size="sm"
                                    colorScheme="teal"
                                    variant="ghost"
                                    onClick={() =>
                                      setView({ modal: true, data: row })
                                    }
                                  />
                                </CustomTooltip>
                                {hasPermission(
                                  "evaluation",
                                  "delete_monthly",
                                ) && (
                                  <CustomTooltip label="Delete Evaluation">
                                    <IconButton
                                      aria-label="Delete"
                                      icon={<FiTrash2 />}
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedRow(row);
                                        onOpen();
                                      }}
                                    />
                                  </CustomTooltip>
                                )}
                                {hasPermission("evaluation", "edit") && (
                                  <CustomTooltip label="Delete Evaluation">
                                    <IconButton
                                      aria-label="Edit"
                                      icon={<FiEdit />}
                                      size="sm"
                                      isDisabled={
                                        row?.evaluation?.[0].payrollProcessed
                                      }
                                      variant="ghost"
                                      onClick={() =>
                                        navigate(
                                          `/evaluation/edit-user-evaluation/role/${row?.roles?.[0]?._id}/user/${row?._id}?month=${month}&year=${year}`,
                                        )
                                      }
                                    />
                                  </CustomTooltip>
                                )}
                              </>
                            )}

                            {!row?.evaluation?.[0]?.evaluations?.find(
                              (item) => item?.evaluator === loggedInUser?._id,
                            ) && (
                              <>
                                <CustomTooltip label="Add Evaluation">
                                  <IconButton
                                    aria-label="Add Evaluation"
                                    icon={<FaPlus />}
                                    size="sm"
                                    colorScheme="green"
                                    variant="ghost"
                                    onClick={() =>
                                      navigate(
                                        `/evaluation/user-evaluation/role/${row?.roles?.[0]?._id}/user/${row?._id}?month=${month}&year=${year}`,
                                      )
                                    }
                                    // onClick={() => handleOpenEdit(row)}
                                  />
                                </CustomTooltip>
                              </>
                            )}
                          </Flex>
                        ) : column.key === "hasEvaluated" ? (
                          <Badge
                            colorScheme={
                              row[column.key] === true ? "green" : "yellow"
                            }
                            variant="subtle"
                            fontSize=".9em"
                            px={4}
                            py={2}
                            borderRadius="full"
                            textTransform="uppercase"
                          >
                            {row[column.key] === true
                              ? "Evaluated"
                              : "Not Evaluated"}
                          </Badge>
                        ) : column.key === "totalEvaluators" ? (
                          <Text>
                            {row?.evaluation?.[0]?.totalEvaluators ?? 0}
                          </Text>
                        ) : column.key === "finalAvg" ? (
                          <Text>{row?.evaluation?.[0]?.finalAvg ?? 0}</Text>
                        ) : column.key === "finalPercentage" ? (
                          <Badge
                            colorScheme="green"
                            fontSize=".9em"
                            px={2}
                            py={2}
                            borderRadius="full"
                          >
                            {row?.evaluation?.[0]?.finalPercentage ?? 0}%
                          </Badge>
                        ) : (
                          formatValue(column.key, row[column.key])
                        )}
                      </Td>
                    ))}
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default UserEvaluationTable;
