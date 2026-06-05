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
  Icon,
} from "@chakra-ui/react";
import { FiTrash2 ,FiAlertTriangle,FiX} from "react-icons/fi";
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
import { useModalColors } from "hooks/useModalColors";

const UserEvaluationTable = ({
  data = [],
  isLoading,
  confirmDelete,
  setView,
  month,
  year,
}) => {
  const colors = useModalColors();
  const columns = [
    { key: "user", label: "User", width: "250px" },
    { key: "roles", label: "Role", width: "150px" },
    { key: "agency", label: "Agency", width: "150px" },
    { key: "totalEvaluators", label: "Total Evaluators", width: "80px" },
    { key: "finalPercentage", label: "Total Percent %", width: "80px" },
    { key: "finalAvg", label: "Average", width: "80px" },
    { key: "hasEvaluated", label: "Evaluated", width: "100px" },
    { key: "actions", label: "Actions", width: "80px" },
  ];
  const { hasPermission } = usePermissions();
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
        if (!value || !value?.name) {
          return "N/A";
        }

        const { bg, text } = getBadgeColors(value.name);

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
            {value.name}
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
        <ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
        <ModalContent bg={colors.bg} borderRadius='xl' boxShadow={colors.modalShadow}>
          <ModalHeader bg={colors.headerBg} color={colors.headerText} borderTopRadius='xl'>
            Delete Evaluation
          </ModalHeader>
          <ModalCloseButton color={colors.headerText} />
          <ModalBody color={colors.bodyText}>
            <Flex direction='column' align='center' textAlign='center'>
              {/* Warning Icon */}
              <Flex
                align='center'
                justify='center'
                bg='rgba(238, 93, 80, 0.12)'
                border='2px solid'
                borderColor='rgba(238, 93, 80, 0.3)'
                borderRadius='full'
                w='64px'
                h='64px'
                mb={4}
              >
                <Icon as={FiTrash2} color='red.400' boxSize={7} />
              </Flex>

              {/* Message */}
              <Text fontSize='md' color={colors.bodyText} lineHeight='1.6'>
                Are you sure you want to delete this user's evaluation for this month?
              </Text>


              </Flex>
          </ModalBody>
         <ModalFooter
            bg={colors.footerBg}
            borderTop='2px solid'
            borderColor={colors.headerBg}
            py={4}
            px={6}
            gap={3}
          >
            <Button
            variant='ghost'
            rounded='md'
            onClick={onClose}
            isDisabled={isLoading}
            color={colors.secondaryBtnText}
            _hover={{
              bg: colors.secondaryBtnHoverBg,
              color: colors.secondaryBtnHoverText,
            }}
            leftIcon={<FiX />}
            >
            Cancel
            </Button>
            <Button
            rounded='md'
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={() =>
              confirmDelete(selectedRow?._id, month, year, onClose, "USEREVAL")
            }
            bg='red.500'
            color='white'
            fontWeight='bold'
            px={6}
            _hover={{
              bg: 'red.600',
              boxShadow: '0 4px 15px rgba(238, 93, 80, 0.4)',
              transform: 'translateY(-1px)',
            }}
            _active={{
              bg: 'red.700',
              transform: 'translateY(0)',
            }}
            _disabled={{
              opacity: 0.6,
              cursor: 'not-allowed',
              transform: 'none',
              boxShadow: 'none',
            }}
            leftIcon={<FiTrash2 />}
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
              data.map((row, index) => {
                const isPayrollPaid =
                  row?.payslip?.paymentStatus === "paid" ?? false;
                const isEvaluated = row?.hasEvaluated ?? false;

                const canAddEvaluation =
                  !row?.evaluation?.[0]?.evaluations?.find(
                    (e) => e?.evaluator === loggedInUser?._id,
                  ) && !isPayrollPaid;

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
                        color={colors.bodyText}
                        borderColor={colors.borderColor}
                      >
                        {column.key === "user" ? (
                          <UserProfileItem user={row} cursor={false} />
                        ) : column.key === "actions" ? (
                          <Flex align="center" justify="center" gap={3}>
                            {isPayrollPaid && (
                              <Badge
                                colorScheme="green"
                                variant="subtle"
                                fontSize=".9em"
                                px={4}
                                py={2}
                                borderRadius="full"
                              >
                                Payroll Paid
                              </Badge>
                            )}

                            {isEvaluated && (
                              <>
                                <CustomTooltip label="View">
                                  <IconButton
                                    aria-label="View"
                                    icon={<FiEye />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      setView({ modal: true, data: row })
                                    }
                                  />
                                </CustomTooltip>

                                {!isPayrollPaid && (
                                  <>
                                    {hasPermission(
                                      "evaluation",
                                      "delete_monthly",
                                    ) && (
                                      <CustomTooltip label="Delete Evaluation">
                                        <IconButton
                                          aria-label="Delete"
                                          icon={<FiTrash2 />}
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            setSelectedRow(row);
                                            onOpen();
                                          }}
                                        />
                                      </CustomTooltip>
                                    )}

                                    {hasPermission("evaluation", "edit") && (
                                      <CustomTooltip label="Edit Evaluation">
                                        <IconButton
                                          aria-label="Edit"
                                          icon={<FiEdit />}
                                          size="sm"
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
                              </>
                            )}

                            {canAddEvaluation && (
                              <>
                                <CustomTooltip label="Add Evaluation">
                                  <IconButton
                                    aria-label="Add Evaluation"
                                    icon={<FaPlus />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      navigate(
                                        `/evaluation/user-evaluation/role/${row?.roles?.[0]?._id}/user/${row?._id}?month=${month}&year=${year}`,
                                      )
                                    }
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
                          <Text color={colors.bodyText}>
                            {row?.evaluation?.[0]?.totalEvaluators ?? 0}
                          </Text>
                        ) : column.key === "finalAvg" ? (
                          <Text color={colors.bodyText}>
                            {row?.evaluation?.[0]?.finalAvg ?? 0}
                          </Text>
                        ) : column.key === "finalPercentage" ? (
                          <Badge
                            bg={colors.badgeSuccessBg}
                            color={colors.badgeSuccessText}
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