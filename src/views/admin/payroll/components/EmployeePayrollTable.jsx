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
  useDisclosure,
} from '@chakra-ui/react';
import { FiEye, FiPrinter } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { formatCurrency } from 'utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import UserProfileCell from './UserProfileCell';
import { formatValue } from '../formatUtils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { usePayslipGenerator } from './PayslipGenerator';
import AttendanceWarningModal from './AttendanceWarningModal';

const EmployeePayrollTable = ({ data = [], isLoading }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    initiatePayslipDownload,
    isEmployeeLoading,
  } = usePayslipGenerator();

  const [delayedLoading, setDelayedLoading] = useState(isLoading);
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const COLUMNS = useMemo(() => [
    { key: 'user', label: 'Employee', width: '220px' },
    {
      key: 'payrollSummary.attendanceEarnedSalary',
      label: 'Attendance Salary',
      width: '150px',
    },
    {
      key: 'payrollSummary.commissionEarned',
      label: 'Commission',
      width: '130px',
    },
    {
      key: 'payrollSummary.incentiveEarned',
      label: 'Incentive',
      width: '120px',
    },
    {
      key: 'loanSummary.monthlyInstallment',
      label: 'Loan Deduction',
      width: '140px',
    },
    { key: 'payrollSummary.netSalary', label: 'Net Salary', width: '140px' },
    {
      key: 'evaluationScore',
      label: 'Performance',
      width: '120px',
    },
    { key: 'createdAt', label: 'Joining Date', width: '100px' },
    { key: 'actions', label: 'Actions', width: '100px' },
  ], []);

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
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }, []);

  const hasCompletedAttendance = useCallback((employee) => {
    const attendanceSummary = employee.attendanceSummary || {};
    return (
      attendanceSummary.totalRecords === attendanceSummary.totalWorkingDays
    );
  }, []);

  const getAttendancePercentage = useCallback((employee) => {
    const attendanceSummary = employee.attendanceSummary || {};
    if (
      !attendanceSummary.totalWorkingDays ||
      attendanceSummary.totalWorkingDays === 0
    ) {
      return 0;
    }
    return Math.round(
      (attendanceSummary.totalRecords / attendanceSummary.totalWorkingDays) *
        100
    );
  }, []);

  const isPayslipGenerated = useCallback((employee) => {
    return employee?.payslip?.status === 'generated';
  }, []);

  const getPayslipActionText = useCallback((employee) => {
    if (isPayslipGenerated(employee)) {
      return 'Regenerate Payslip';
    }
    return 'Generate Payslip';
  }, [isPayslipGenerated]);

  const getTooltipText = useCallback((employee) => {
    const attendancePercentage = getAttendancePercentage(employee);

    if (!hasCompletedAttendance(employee)) {
      return `Attendance incomplete (${attendancePercentage}%). Complete attendance or force generate payslip.`;
    }

    if (isPayslipGenerated(employee)) {
      return 'Regenerate payslip for this employee';
    }

    return 'Generate payslip for this employee';
  }, [getAttendancePercentage, hasCompletedAttendance, isPayslipGenerated]);

  const showAttendanceDetails = useCallback((employee) => {
    setSelectedEmployeeForModal(employee);
    onOpen();
  }, [onOpen]);

  const handleForceGenerate = useCallback(async () => {
    if (!selectedEmployeeForModal?._id) {
      toast.error('Employee data not available');
      return;
    }

    try {
      setModalLoading(true);
      await initiatePayslipDownload(selectedEmployeeForModal, true);
      onClose();
    } catch (error) {
      console.error('Error force generating payslip:', error);
      toast.error('Failed to generate payslip');
    } finally {
      setModalLoading(false);
    }
  }, [selectedEmployeeForModal, initiatePayslipDownload, onClose]);

  const handleDownloadPayslip = useCallback(async (employee) => {
    if (!employee?._id) {
      toast.error('Employee data not available');
      return;
    }

    if (!hasCompletedAttendance(employee)) {
      showAttendanceDetails(employee);
      return;
    }

    try {
      await initiatePayslipDownload(employee, false);
    } catch (error) {
      console.error('Error initiating payslip download:', error);
      toast.error('Failed to download payslip');
    }
  }, [hasCompletedAttendance, showAttendanceDetails, initiatePayslipDownload]);

  const renderCellContent = useCallback((column, row) => {
    if (column.key === 'user') {
      return <UserProfileCell user={row} />;
    }

    if (column.key === 'actions') {
      const isDownloading = isEmployeeLoading(row._id);
      const canDownload = hasCompletedAttendance(row);
      const isGenerated = isPayslipGenerated(row);

      return (
        <Flex align='center' justify='center'>
          <CustomTooltip label='View Details'>
            <IconButton
              aria-label='View employee details'
              icon={<FiEye />}
              size='sm'
              colorScheme='teal'
              variant='ghost'
              onClick={() => navigate(`/payroll/payslip/${row._id}`)}
            />
          </CustomTooltip>

          <CustomTooltip label={getTooltipText(row)}>
            <IconButton
              aria-label={getPayslipActionText(row)}
              icon={<FiPrinter />}
              size='sm'
              colorScheme={canDownload ? 'teal' : 'red'}
              variant='ghost'
              onClick={() => handleDownloadPayslip(row)}
              isLoading={isDownloading}
              disabled={isDownloading}
            />
          </CustomTooltip>
        </Flex>
      );
    }

    // Handle nested keys for financial data
    if (column.key.includes('.')) {
      const value = getNestedValue(row, column.key);
      const currency = row.agency?.currency || 'AED';

      if (typeof value === 'number') {
        return (
          <Text fontWeight='medium' textAlign='center'>
            {formatCurrency(value, currency)}
          </Text>
        );
      }
      return formatValue(column.key, value, row);
    }

    // Handle direct keys
    const value = row[column.key];
    if (typeof value === 'number' && column.key !== 'evaluationScore') {
      return (
        <Text fontWeight='medium' textAlign='center'>
          {formatCurrency(value, row.agency?.currency || 'AED')}
        </Text>
      );
    }

    return formatValue(column.key, value, row);
  }, [getNestedValue, isEmployeeLoading, hasCompletedAttendance, isPayslipGenerated, getTooltipText, getPayslipActionText, handleDownloadPayslip, navigate]);

  return (
    <>
      <Box
        my='2'
        overflowX='auto'
        overflowY='auto'
        maxH='calc(100vh - 200px)'
        borderWidth='1px'
        borderColor='gray.200'
        rounded='xl'
        boxShadow='sm'
        bg='white'
      >
        <Table variant='striped' size='sm'>
          <Thead bg='brand.200' position='sticky' top={0} zIndex={1}>
            <Tr>
              {COLUMNS.map((column) => (
                <Th
                  key={column.key}
                  whiteSpace='nowrap'
                  textTransform='capitalize'
                  fontSize='md'
                  py='4'
                  textAlign={['name'].includes(column.key) ? 'left' : 'center'}
                  fontWeight='semibold'
                  color='gray.700'
                  minW={column.width}
                >
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isLoading || delayedLoading ? (
              <TableLoading columns={COLUMNS} length={10} py='4' />
            ) : data.length === 0 ? (
              <Tr>
                <Td colSpan={COLUMNS.length} py={10}>
                  <Center>
                    <NoData label='incoming balance' />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data.map((row, index) => (
                <Tr
                  key={row._id || index}
                  _hover={{ bg: 'gray.50' }}
                  bg={index % 2 === 0 ? 'white' : 'gray.25'}
                  transition='background-color 0.2s'
                >
                  {COLUMNS.map((column) => (
                    <Td
                      key={column.key}
                      px={3}
                      py={3}
                      fontSize='sm'
                      color='gray.700'
                      minW={column.width}
                      textAlign={column.key === 'user' ? 'left' : 'center'}
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
      <AttendanceWarningModal
        isOpen={isOpen}
        onClose={onClose}
        selectedEmployee={selectedEmployeeForModal}
        onForceGenerate={handleForceGenerate}
        getPayslipActionText={getPayslipActionText}
        getAttendancePercentage={getAttendancePercentage}
        isLoading={modalLoading}
      />
    </>
  );
};

export default EmployeePayrollTable;