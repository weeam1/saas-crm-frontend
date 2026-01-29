import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  Text,
  Box,
  Divider,
  Flex,
  Button,
  useColorModeValue,
  Avatar,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import { useUpdateItemMutation } from "api/apiSlice";
import { useLazyFetchItemsV2Query } from "api/apiSlice";

import {
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiMessageSquare,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { formatPostDate } from "utils/helpers";

const statusConfig = {
  active: {
    color: "orange",
    icon: FiAlertTriangle,
    label: "Active",
    description: "Warning is currently active",
  },
  resolved: {
    color: "green",
    icon: FiCheckCircle,
    label: "Resolved",
    description: "Warning has been resolved",
  },
  cancelled: {
    color: "gray",
    icon: FiXCircle,
    label: "Cancelled",
    description: "Warning has been cancelled",
  },
};

export const ViewWarningsModal = ({
  isOpen,
  onClose,
  employeeId,
  month,
  year,
}) => {
  console.log("ViewWarningsModal params:", {
    employeeId,
    month,
    year,
  });
  const [fetchWarnings, { data: warningsData, isLoading, error }] =
    useLazyFetchItemsV2Query();
  const [revokingId, setRevokingId] = useState(null);
  useEffect(() => {
    if (isOpen && employeeId && month && year) {
      fetchWarnings({
        path: `/payroll/employee-warnings/${employeeId}`,
        params: { month, year },
      });
    }
  }, [isOpen, employeeId, month, year, fetchWarnings]);
  const [updateWarning, { isLoading: isRevoking }] = useUpdateItemMutation();

  const warningsList = warningsData?.data?.[0]?.warnings || [];
  const totalDeduction = warningsData?.data?.[0]?.totalWarningDeduction || 0;
  const monthYear = warningsData?.data?.[0]
    ? `${warningsData.data[0].month}/${warningsData.data[0].year}`
    : `${month}/${year}`;

  const cardBg = useColorModeValue("white", "gray.800");
  const subtleBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Sort warnings by issued date, most recent first
  const sortedWarnings = [...warningsList].sort(
    (a, b) => new Date(b.issuedAt) - new Date(a.issuedAt),
  );

  // Get current status info for the latest warning
  const currentStatus =
    sortedWarnings.length > 0
      ? sortedWarnings[0].status.toLowerCase()
      : "status";
  const statusInfo = statusConfig[currentStatus] || statusConfig.active;
  console.log("checkdata", warningsData);
  const handleRevokeWarning = async (warningId) => {
    try {
      setRevokingId(warningId); // start loader for this button
      await updateWarning({
        path: `/payroll/employee-warnings/${warningsData?.data[0]?._id}/revoke-warning`,
        body: { warningId },
        method: "PUT",
      }).unwrap();

      // refetch warnings after revoke
      fetchWarnings({
        path: `/payroll/employee-warnings/${employeeId}`,
        params: { month, year },
      });

      toast.success("Warning revoked successfully");
    } catch (error) {
      console.error("Failed to revoke warning:", error);
      toast.error(error?.data?.message || "Failed to revoke warning");
    } finally {
      setRevokingId(null); // stop loader
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent rounded="xl" overflow="hidden" shadow="2xl">
        <ModalHeader py={4} bg={subtleBg}>
          <VStack align="flex-start" spacing={1}>
            <HStack>
              <Text fontSize="lg" fontWeight="bold">
                Employee Warnings
              </Text>
              <Badge colorScheme="blue" fontSize="sm">
                {monthYear}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.500" fontWeight="normal">
              Warning History and Deductions
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        <ModalBody py={4}>
          {/* Current Status Overview - Similar to commented code */}
          <Box
            p={4}
            mb={6}
            bg={cardBg}
            rounded="lg"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Box>
              <HStack justify="space-between" mt={2}>
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Total Warning Deductions
                  </Text>
                </HStack>
                <Text fontSize="lg" fontWeight="bold" color="orange.300">
                  {totalDeduction.toLocaleString()}
                </Text>
              </HStack>
            </Box>
          </Box>

          {/* History Timeline - Same structure as commented code */}
          <VStack align="stretch" spacing={0} position="relative">
            <Box
              position="absolute"
              left="16px"
              top="0"
              bottom="0"
              width="2px"
              bg={borderColor}
              zIndex={1}
            />

            {sortedWarnings.length === 0 ? (
              <Box
                p={6}
                textAlign="center"
                bg={cardBg}
                rounded="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Icon as={FiClock} boxSize={6} color="gray.400" mb={2} />
                <Text color="gray.500">No warnings for this period</Text>
              </Box>
            ) : (
              sortedWarnings.map((warning, idx) => {
                const statusKey = warning.status.toLowerCase();
                const config = statusConfig[statusKey] || statusConfig.active;
                const isLatest = true;
                // idx === 0;

                return (
                  <HStack
                    key={warning._id}
                    align="flex-start"
                    spacing={4}
                    py={2}
                    position="relative"
                    zIndex={2}
                  >
                    <Box flexShrink={0} position="relative">
                      <Box
                        w="32px"
                        h="32px"
                        rounded="full"
                        bg={isLatest ? `${config.color}.500` : "transparent"}
                        borderWidth={isLatest ? "0" : "2px"}
                        borderColor={`${config.color}.500`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon
                          as={config.icon}
                          color={isLatest ? "white" : `${config.color}.500`}
                          boxSize={4}
                        />
                      </Box>
                    </Box>

                    <Box
                      flex="1"
                      bg={isLatest ? `${config.color}.50` : cardBg}
                      p={4}
                      rounded="lg"
                      borderWidth="1px"
                      borderColor={
                        isLatest ? `${config.color}.200` : borderColor
                      }
                      shadow={isLatest ? "sm" : "none"}
                    >
                      <HStack justify="space-between" mb={2}>
                        {warning.issuedBy && (
                          <HStack spacing={2}>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="xs" color="gray.600">
                                Issued By
                              </Text>
                              <Text
                                fontSize="xs"
                                fontWeight="medium"
                                color="gray.600"
                              >
                                {warning.issuedBy.fullName}
                              </Text>
                            </VStack>
                          </HStack>
                        )}
                        <Text fontSize="xs" color="gray.500">
                          {formatPostDate(warning.issuedAt)}
                        </Text>
                      </HStack>

                      {/* Warning Amount */}
                      <HStack justify="space-between" mb={3}>
                        <HStack spacing={1}>
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color="gray.600"
                          >
                            Warning Deduction Amount:
                          </Text>
                        </HStack>
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color="orange.300"
                        >
                          {warning.amount.toLocaleString()}
                        </Text>
                      </HStack>

                      {/* Warning Note */}
                      {warning.note && (
                        <>
                          <HStack spacing={1} mb={1}>
                            <Icon
                              as={FiMessageSquare}
                              boxSize={3}
                              color="gray.500"
                            />
                            <Text
                              fontSize="xs"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Note
                            </Text>
                          </HStack>

                          <Box
                            bg={"gray.100"}
                            border="1px solid"
                            borderColor="gray.200"
                            rounded="md"
                            p={3}
                            fontSize="sm"
                            color="gray.700"
                            mb={3}
                          >
                            {warning.note}
                          </Box>
                        </>
                      )}

                      {/* Revoke Button */}
                      <Flex justify="right">
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => handleRevokeWarning(warning._id)}
                          isLoading={revokingId === warning._id} // only show loader for this button
                        >
                          Revoke
                        </Button>
                      </Flex>
                    </Box>
                  </HStack>
                );
              })
            )}
          </VStack>
        </ModalBody>

        <Divider />

        <ModalFooter py={3}>
          <Button
            onClick={onClose}
            rounded="lg"
            px={6}
            variant="outline"
            colorScheme="blue"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
