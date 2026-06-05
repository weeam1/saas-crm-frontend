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
} from '@chakra-ui/react';
import {
	FiEye,
	FiPrinter,
	FiAlertCircle,
	FiAlertTriangle,
} from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import { FaClockRotateLeft } from 'react-icons/fa6';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState, useCallback } from 'react';
import { formatCurrency } from 'utils/helpers';
import UserProfileCell from '../components/UserProfileCell';
import PayslipDownloadModal from '../components/PayslipDownloadModal';
import { formatValue, COMMISSION_PAYROLL_COLUMNS } from '../formatUtils';
import { useNavigate } from 'react-router-dom';
import { useModalColors } from 'hooks/useModalColors';

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
	const colors = useModalColors();
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
		return path.split('.').reduce((current, key) => current?.[key], obj);
	}, []);

	const handlePayslipGenerate = useCallback(
		(employee) => {
			setSelectedEmployeeForModal(employee);
			onOpen();
		},
		[onOpen],
	);

	const renderCellContent = useCallback(
		(column, row) => {
			if (column.key === 'user') {
				return <UserProfileCell user={row} />;
			}

			if (column.key === 'actions') {
				return (
					<Flex align='center' justify='center' gap='2'>
						{/* View Payslip / Details */}
						<Tooltip label='View commission details' placement='top' hasArrow>
							<IconButton
								aria-label='View commission payslip'
								icon={<FiEye />}
								size='sm'
								variant='ghost'
								onClick={() =>
									navigate(
										`/payroll/commission-users/payslip/${row._id}?month=${month}&year=${year}`,
									)
								}
								color={colors.bodyText}
								_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
							/>
						</Tooltip>

						{/* Generate Payslip */}
						<Tooltip
							label={
								row?.payslip?._id
									? 'Generate payslip PDF'
									: 'Payslip not created yet'
							}
							placement='top'
							hasArrow
						>
							<IconButton
								aria-label='Generate payslip'
								icon={<FiPrinter />}
								size='sm'
								variant='ghost'
								isDisabled={!row?.payslip?._id}
								opacity={row?.payslip?._id ? 1 : 0.4}
								onClick={() => handlePayslipGenerate(row)}
								color={colors.bodyText}
								_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
							/>
						</Tooltip>

						{row?.payslip?.paymentStatus !== 'paid' && (
							<Tooltip label='Add Warning' placement='top' hasArrow>
								<IconButton
									aria-label='Warning'
									icon={<FiAlertTriangle />}
									size='sm'
									variant='ghost'
									onClick={() => {
										onAddHistoryModalOpen();
										setPayRollData(row);
									}}
									color={colors.bodyText}
									_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
								/>
							</Tooltip>
						)}

						{/* Warning History Button */}
						<Tooltip label='Warning History' placement='top' hasArrow>
							<IconButton
								aria-label='Warning History'
								icon={<FaClockRotateLeft />}
								size='sm'
								variant='ghost'
								onClick={() => {
									onViewHistoryModalOpen();
									setPayRollData(row);
								}}
								color={colors.bodyText}
								_hover={{ color: colors.accentGold, bg: colors.bgDeep }}
							/>
						</Tooltip>
					</Flex>
				);
			}

			// Handle nested keys for financial data
			if (column.key.includes('.')) {
				const value = getNestedValue(row, column.key);
				const currency = row.agency?.currency || 'AED';

				if (typeof value === 'number') {
					return (
						<Text fontWeight='medium' textAlign='center' color={colors.bodyText}>
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
					<Text fontWeight='medium' textAlign='center' color={colors.bodyText}>
						{formatCurrency(value, row.agency?.currency || 'AED')}
					</Text>
				);
			}

			return formatValue(column.key, value, row);
		},
		[navigate, month, year, handlePayslipGenerate, getNestedValue, colors],
	);

	return (
		<>
			<Box
				my='2'
				overflowX='auto'
				overflowY='auto'
				      maxHeight="80vh"
      minH="70vh"
				borderWidth='1px'
				borderColor={colors.borderColor}
				rounded='xl'
				boxShadow={colors.cardShadow}
				bg={colors.bg}
			>
				<Table variant='simple' size='sm'>
					<Thead bg={colors.bgDeep} position='sticky' top={0} zIndex={1}>
						<Tr>
							{COMMISSION_PAYROLL_COLUMNS.map((column) => (
								<Th
									key={column.key}
									whiteSpace='nowrap'
									textTransform='capitalize'
									fontSize='md'
									py='4'
									textAlign={
										['name', 'user'].includes(column.key) ? 'left' : 'center'
									}
									fontWeight='semibold'
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
							<TableLoading
								columns={COMMISSION_PAYROLL_COLUMNS}
								length={10}
								py='4'
							/>
						) : data.length === 0 ? (
							<Tr>
								<Td colSpan={COMMISSION_PAYROLL_COLUMNS.length} py={10} borderColor={colors.borderColor}>
									<Center>
										<NoData label='incoming balance' />
									</Center>
								</Td>
							</Tr>
						) : (
							data.map((row, index) => (
								<Tr
									key={row._id || index}
									_hover={{ bg: colors.bgDeep }}
									bg={colors.bg }
									transition='background-color 0.2s'
									borderColor={colors.borderColor}
								>
									{COMMISSION_PAYROLL_COLUMNS.map((column) => (
										<Td
											key={column.key}
											px={3}
											py={3}
											fontSize='sm'
											color={colors.bodyText}
											minW={column.width}
											textAlign={column.key === 'user' ? 'left' : 'center'}
											borderColor={colors.borderColor}
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