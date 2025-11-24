import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Flex,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Button,
} from "@chakra-ui/react";
import { FiLock, FiPrinter } from "react-icons/fi";
import { useModalColors } from "hooks/useModalColors";
import { FaExclamationTriangle, FaExclamationCircle  } from "react-icons/fa";

const AttendanceWarningModal = ({
  isOpen,
  onClose,
  selectedEmployee,
  onForceGenerate,
  getPayslipActionText,
  getAttendancePercentage,
}) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

  if (!selectedEmployee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        mx={{ base: 3, md: 8 }}
        boxShadow="0 12px 45px rgba(0,0,0,0.25)"
        borderRadius="2xl"
        bg={bg}
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Flex
          align="center"
          justify="space-between"
          bg={headerBg}
          color={headerText}
          px={{ base: 6, md: 8 }}
          py={4}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Flex align="center">
            <FiLock style={{ marginRight: "8px", color: "#E53E3E" }} />
            Attendance Incomplete - Action Required
          </Flex>
          <ModalCloseButton position="static" />
        </Flex>

        <ModalBody
          overflowY="auto"
          px={{ base: 6, md: 8 }}
          py={5}
          flex="1"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.400",
              borderRadius: "12px",
            },
          }}
        >
          <VStack align="stretch" spacing={4}>
            <Text fontWeight="bold" fontSize="lg" color="red.600">
              {selectedEmployee.fullName}
            </Text>

            <Box
              p={4}
              bg="red.50"
              borderRadius="md"
              borderLeft="4px solid"
              borderLeftColor="red.500"
            >
              <Text
                color="red.700"
                fontWeight="medium"
                mb={2}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <FaExclamationTriangle />
                Attendance Not Yet Completed
              </Text>
              <Text color="red.600" fontSize="sm">
                Cannot generate payslip automatically until all attendance
                records are completed for the current pay period.
              </Text>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={3} color="gray.700">
                Attendance Summary Details:
              </Text>
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text color="gray.600">Total Working Days:</Text>
                  <Text fontWeight="bold" color="gray.800">
                    {selectedEmployee.attendanceSummary?.totalWorkingDays || 0}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Days Recorded:</Text>
                  <Text fontWeight="bold" color="gray.800">
                    {selectedEmployee.attendanceSummary?.totalRecords || 0}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Missing Days:</Text>
                  <Text fontWeight="bold" color="red.600">
                    {(selectedEmployee.attendanceSummary?.totalWorkingDays ||
                      0) -
                      (selectedEmployee.attendanceSummary?.totalRecords || 0)}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Completion Status:</Text>
                  <Badge colorScheme="red" fontSize="sm" px={2} py={1}>
                    {getAttendancePercentage(selectedEmployee)}% Complete
                  </Badge>
                </HStack>
              </VStack>
            </Box>

            <Box
              p={3}
              bg="orange.50"
              borderRadius="md"
              border="1px solid"
              borderColor="orange.200"
            >
              <Text
                fontSize="sm"
                color="orange.800"
                fontWeight="medium"
                mb={2}
                display={"flex"}
                gap={1}
                alignItems={"center"}
              >
                <FaExclamationCircle  /> Important Note:
              </Text>
              <Text fontSize="sm" color="orange.700">
                For accurate payroll processing, it's recommended to complete
                all attendance records first. However, you can force generate
                the payslip if needed. The generated payslip will use currently
                available data and may not reflect final adjustments.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter
          bg={footerBg}
          px={{ base: 6, md: 8 }}
          py={4}
          borderTop="1px solid"
          borderColor={borderColor}
        >
          <HStack spacing={3} width="full" justify="space-between">
            <Button
              variant="outline"
              colorScheme="gray"
              onClick={onClose}
              size="sm"
              borderRadius={"md"}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={onForceGenerate}
              leftIcon={<FiPrinter />}
              size="sm"
              borderRadius={"md"}
            >
              {getPayslipActionText(selectedEmployee)}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AttendanceWarningModal;
