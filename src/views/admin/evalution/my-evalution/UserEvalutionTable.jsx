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
import { FiEye } from "react-icons/fi";
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
import { useModalColors } from "hooks/useModalColors";

import { toast } from "react-toastify";

const UserEvaluationTable = ({
  data = [],
  isLoading,
  setView,
  confirmDelete,
  month,
  year,
}) => {
  const colors = useModalColors();
  const columns = [
    { key: "monthYear", label: "Month", width: "150px" },
    { key: "totalEvaluators", label: "Total Evaluators", width: "80px" },
    { key: "finalPercentage", label: "Total Percent %", width: "80px" },
    { key: "finalAvg", label: "Average", width: "80px" },
    { key: "actions", label: "Actions", width: "80px" },
  ];

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <>
      <Box
        my="2"
        overflowX="auto"
        overflowY="auto"
            maxHeight="80vh"
      minH="70vh"
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
                  fontSize="md"
                  py="4"
                  textAlign={["user"].includes(column.key) ? "left" : "center"}
                  fontWeight="semibold"
                  color={colors.headingText}
                  minW={column.width}
                  bg={colors.bgDeep}
                  borderColor={colors.borderColor}
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
                <Td colSpan={columns.length} py={10} borderColor={colors.borderColor}>
                  <Center>
                    <NoData label="user evaluation" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data?.map((row, index) => {
                return (
                  <Tr
                    key={row._id || index}
                    _hover={{ bg: colors.bgDeep }}
                    bg={index % 2 === 0 ? colors.bg : colors.bgInput}
                    borderColor={colors.borderColor}
                  >
                    {columns.map((column) => (
                      <Td
                        key={column.key}
                        textAlign="center"
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                        py={3}
                        px={3}
                      >
                        {column.key === "monthYear" ? (
                          <Text color={colors.bodyText}>
                            {format(
                              new Date(row.year, row.month - 1),
                              "MMM yyyy",
                            )}
                          </Text>
                        ) : column.key === "totalEvaluators" ? (
                          <Text color={colors.bodyText}>{row.totalEvaluators}</Text>
                        ) : column.key === "finalAvg" ? (
                          <Text color={colors.bodyText}>{row.finalAvg}</Text>
                        ) : column.key === "finalPercentage" ? (
                          <Badge
                            bg={colors.badgeSuccessBg}
                            color={colors.badgeSuccessText}
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {row.finalPercentage}%
                          </Badge>
                        ) : column.key === "actions" ? (
                          <Flex justify="center" gap={3}>
                            <CustomTooltip label="View">
                              <IconButton
                                aria-label="View"
                                icon={<FiEye />}
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setView({ modal: true, data: row })
                                }
                                color={colors.bodyText}
                                _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                              />
                            </CustomTooltip>
                          </Flex>
                        ) : (
                          "—"
                        )}
                      </Td>
                    ))}
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          closeOnOverlayClick={false}
          blockScrollOnMount={false}
        >
          <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
          <ModalContent bg={colors.bg} borderRadius="xl" boxShadow={colors.modalShadow}>
            <ModalHeader bg={colors.headerBg} color={colors.headerText} borderTopRadius="xl">
              Delete Evaluation
            </ModalHeader>
            <ModalCloseButton color={colors.headerText} _hover={{ bg: colors.closeBtnHoverBg }} />
            <ModalBody color={colors.bodyText}>
              Are you sure you want to delete this user's evaluation for this month?
            </ModalBody>

            <ModalFooter bg={colors.footerBg} borderTop="1px solid" borderColor={colors.borderColor}>
              <Button variant="ghost" mr={3} onClick={onClose} color={colors.bodyText}>
                Cancel
              </Button>
              <Button
                variant="brand"
                onClick={() =>
                  confirmDelete(
                    loggedInUser?._id,
                    selectedRow?.month,
                    selectedRow?.year,
                    onClose,
                    "MYEVAL",
                  )
                }
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default UserEvaluationTable;