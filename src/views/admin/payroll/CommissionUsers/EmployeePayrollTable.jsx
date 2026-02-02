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
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiEye,
  FiPrinter,
  FiAlertCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import NoData from "components/Message/NoData";
import { FaClockRotateLeft } from "react-icons/fa6";
import TableLoading from "components/loading/TableLoading";
import { useEffect, useState, useCallback } from "react";
import { formatCurrency } from "utils/helpers";
import UserProfileCell from "../components/UserProfileCell";
import PayslipDownloadModal from "../components/PayslipDownloadModal";
import { formatValue, COMMISSION_PAYROLL_COLUMNS } from "../formatUtils";
import { useNavigate } from "react-router-dom";

const EmployeePayrollTable = ({
  setPayRollData,
  onViewHistoryModalOpen,
  onAddHistoryModalOpen,
  data = [],
  isLoading,
  month,
  year,
  refetchPayslips,
}) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] =
    useState(null);

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

  const getNestedValue = useCallback((obj, path) => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }, []);

  // const isPayslipGenerated = useCallback((employee) => {
  // 	return employee?.payslip?.status === 'generated';
  // }, []);

  // const getTooltipText = useCallback(
  // 	(employee) => {
  // 		const attendancePercentage = getAttendancePercentage(employee);

  // 		if (!hasCompletedAttendance(employee)) {
  // 			return `Attendance incomplete (${attendancePercentage}%). Complete attendance or force generate payslip.`;
  // 		}

  // 		if (isPayslipGenerated(employee)) {
  // 			return 'Regenerate payslip for this employee';
  // 		}

  // 		return 'Generate payslip for this employee';
  // 	},
  // 	[getAttendancePercentage, hasCompletedAttendance, isPayslipGenerated]
  // );

  const handlePayslipGenerate = useCallback(
    (employee) => {
      setSelectedEmployeeForModal(employee);
      onOpen();
    },
    [onOpen],
  );

  const renderCellContent = useCallback(
    (column, row) => {
      if (column.key === "user") {
        return <UserProfileCell user={row} />;
      }

      if (column.key === "actions") {
        // const canDownload = hasCompletedAttendance(row);
        // const isGenerated = isPayslipGenerated(row);

        return (
          <Flex align="center" justify="center" gap="2">
            {/* View Payslip / Details */}
            <Tooltip label="View commission details" placement="top" hasArrow>
              <IconButton
                aria-label="View commission payslip"
                icon={<FiEye />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={() =>
                  navigate(
                    `/payroll/commission-users/payslip/${row._id}?month=${month}&year=${year}`,
                  )
                }
              />
            </Tooltip>

            {/* Generate Payslip */}
            <Tooltip
              label={
                row?.payslip?._id
                  ? "Generate payslip PDF"
                  : "Payslip not created yet"
              }
              placement="top"
              hasArrow
            >
              <IconButton
                aria-label="Generate payslip"
                icon={<FiPrinter />}
                size="sm"
                variant="solid"
                colorScheme="green"
                isDisabled={!row?.payslip?._id}
                opacity={row?.payslip?._id ? 1 : 0.4}
                onClick={() => handlePayslipGenerate(row)}
              />
            </Tooltip>

            {row?.payslip?.status !== "paid" &&
              <Tooltip label="Add Warning" placement="top" hasArrow>
                <IconButton
                  isDisabled={row?.payslip?.status === "paid"}
                  aria-label="Warning"
                  icon={<FiAlertTriangle />}
                  size="sm"
                  colorScheme="yellow"
                  variant="ghost"
                  onClick={() => {
                    onAddHistoryModalOpen();
                    setPayRollData(row);
                  }}
                />
              </Tooltip>
            }

            {/* Warning History Button */}
            <Tooltip label="Warning History" placement="top" hasArrow>
              <IconButton
                aria-label="Warning History"
                icon={<FaClockRotateLeft />}
                size="sm"
                colorScheme="yellow"
                variant="ghost"
                onClick={() => {
                  onViewHistoryModalOpen();
                  setPayRollData(row);
                }}
              />
            </Tooltip>
          </Flex>
        );
      }

      // Handle nested keys for financial data
      if (column.key.includes(".")) {
        const value = getNestedValue(row, column.key);
        const currency = row.agency?.currency || "AED";

        if (typeof value === "number") {
          return (
            <Text fontWeight="medium" textAlign="center">
              {formatCurrency(value, currency)}
            </Text>
          );
        }
        return formatValue(column.key, value, row);
      }

      // Handle direct keys
      const value = row[column.key];
      if (typeof value === "number" && column.key !== "evaluationScore") {
        return (
          <Text fontWeight="medium" textAlign="center">
            {formatCurrency(value, row.agency?.currency || "AED")}
          </Text>
        );
      }

      return formatValue(column.key, value, row);
    },
    [navigate, month, year, handlePayslipGenerate, getNestedValue],
  );

  return (
    <>
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
              {COMMISSION_PAYROLL_COLUMNS.map((column) => (
                <Th
                  key={column.key}
                  whiteSpace="nowrap"
                  textTransform="capitalize"
                  fontSize="md"
                  py="4"
                  textAlign={
                    ["name", "user"].includes(column.key) ? "left" : "center"
                  }
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
              <TableLoading
                columns={COMMISSION_PAYROLL_COLUMNS}
                length={10}
                py="4"
              />
            ) : data.length === 0 ? (
              <Tr>
                <Td colSpan={COMMISSION_PAYROLL_COLUMNS.length} py={10}>
                  <Center>
                    <NoData label="incoming balance" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data.map((row, index) => (
                <Tr
                  key={row._id || index}
                  _hover={{ bg: "gray.50" }}
                  bg={index % 2 === 0 ? "white" : "gray.25"}
                  transition="background-color 0.2s"
                >
                  {COMMISSION_PAYROLL_COLUMNS.map((column) => (
                    <Td
                      key={column.key}
                      px={3}
                      py={3}
                      fontSize="sm"
                      color="gray.700"
                      minW={column.width}
                      textAlign={column.key === "user" ? "left" : "center"}
                    >
                      {renderCellContent(column, row)}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Attendance Warning Modal */}
      {isOpen && selectedEmployeeForModal && (
        <PayslipDownloadModal
          isOpen={isOpen}
          onClose={onClose}
          employee={selectedEmployeeForModal}
          month={month}
          year={year}
          refetchPayslips={refetchPayslips}
        />
      )}
    </>
  );
};

export default EmployeePayrollTable;
