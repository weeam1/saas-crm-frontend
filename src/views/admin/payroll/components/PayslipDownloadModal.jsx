import { useState, useCallback, useEffect } from 'react';
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
	Button,
	Badge,
	Progress,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from '@chakra-ui/react';
import {
	FiLock,
	FiPrinter,
	FiCheckCircle,
	FiAlertTriangle,
} from 'react-icons/fi';
import { FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { usePdfDownloader } from 'hooks/usePdfDownloader';
import { useModalColors } from 'hooks/useModalColors';
import { getSalaryType } from 'schema/userSchema';
import AdjustmentsModal from './AdjustmentsModal';

const PayslipDownloadModal = ({
	isOpen,
	onClose,
	employee,
	month,
	year,
	refetchPayslips,
}) => {
	const colors = useModalColors();
	const { downloadPdf, loading, progress, error } = usePdfDownloader();

	console.log({ employee });
	// State to track generation type
	const [adjustmentsOpen, setAdjustmentsOpen] = useState(false);

	/**
	 * Check if employee has required salary information
	 */
	const hasValidSalaryInfo = useCallback((emp) => {
		return emp?.basicSalary && getSalaryType(emp?.salaryType);
	}, []);

	/**
	 * Check if attendance is fully completed
	 */
	const hasCompletedAttendance = useCallback((emp) => {
		const attendanceSummary = emp?.attendanceSummary || {};

		const attendanceStatus =
			attendanceSummary.totalRecords === attendanceSummary.totalWorkingDays;

		return attendanceStatus;
	}, []);

	const generationType = hasCompletedAttendance(employee) ? 'normal' : 'forced';
	const payslipPaid = Boolean(employee?.payslip?.status === 'paid' || false);

	/**
	 * Calculate attendance completion percentage
	 */
	const getAttendancePercentage = useCallback((emp) => {
		const attendanceSummary = emp?.attendanceSummary || {};
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

	/**
	 * Generate file name for PDF download
	 */
	const generateFileName = useCallback((emp) => {
		const now = new Date();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = now.getFullYear();
		const typeSuffix = generationType === 'forced' ? '_PROVISIONAL' : '';

		return `payslip_${emp.fullName?.replace(/\s+/g, '_')}_${month}_${year}${typeSuffix}.pdf`;
	}, []);

	/**
	 * Handle PDF generation
	 */
	const handleGeneratePayslip = async ({ adjustments = [] }) => {
		if (!hasValidSalaryInfo(employee)) {
			toast.error('Employee salary information is incomplete');
			return;
		}

		try {
			const fileName = generateFileName(employee, generationType);

			await downloadPdf(
				`api/payroll/generate/${employee?._id}?month=${month}&year=${year}`,
				fileName,
				{
					adjustments,
				}
			);

			toast.success(
				generationType === 'forced'
					? 'Provisional Payslip Generated'
					: 'Payslip Generated'
			);

			refetchPayslips();

			onClose(); // Close modal on success
		} catch (err) {
			console.error('Payslip generation failed:', err);
			// Error handling is done by the hook, but we can reset generation type
			toast.error('Payslip generation failed!');
		}
	};

	/**
	 * Render different content based on employee status
	 */
	const renderModalContent = () => {
		// CASE 1: Missing salary information
		if (!hasValidSalaryInfo(employee)) {
			return renderMissingSalaryLayout();
		}

		// CASE 2: Attendance completed - Normal generation
		if (hasCompletedAttendance(employee)) {
			return renderCompletedAttendanceLayout();
		}

		// CASE 3: Attendance incomplete - Force generation warning
		return renderIncompleteAttendanceLayout();
	};

	/**
	 * Layout for missing salary information
	 */
	const renderMissingSalaryLayout = () => (
		<VStack align='stretch' spacing={4}>
			<Alert status='error' borderRadius='md' bg={colors.badgeErrorBg}>
				<AlertIcon color={colors.badgeErrorText} />
				<Box flex='1'>
					<AlertTitle color={colors.badgeErrorText}>Missing Salary Information</AlertTitle>
					<AlertDescription color={colors.badgeErrorText}>
						Cannot generate payslip without complete salary details.
					</AlertDescription>
				</Box>
			</Alert>

			<Box p={4} bg={colors.bgInput} borderRadius='md' border='1px solid' borderColor={colors.borderColor}>
				<Text fontWeight='semibold' mb={3} color={colors.headingText}>
					Required Information:
				</Text>
				<VStack align='stretch' spacing={2}>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Basic Salary:</Text>
						<Badge
							bg={employee?.basicSalary ? colors.badgeSuccessBg : colors.badgeErrorBg}
							color={employee?.basicSalary ? colors.badgeSuccessText : colors.badgeErrorText}
							fontSize='sm'
							px={2}
							py={1}
							borderRadius='full'
						>
							{employee?.basicSalary ? '✓ Defined' : '✗ Missing'}
						</Badge>
					</HStack>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Salary Type:</Text>
						<Badge
							bg={employee?.salaryType ? colors.badgeSuccessBg : colors.badgeErrorBg}
							color={employee?.salaryType ? colors.badgeSuccessText : colors.badgeErrorText}
							fontSize='sm'
							px={2}
							py={1}
							borderRadius='full'
						>
							{employee?.salaryType ? '✓ Defined' : '✗ Missing'}
						</Badge>
					</HStack>
				</VStack>
			</Box>

			<Text fontSize='sm' color={colors.mutedText} textAlign='center'>
				Please update employee salary information before generating payslip.
			</Text>
		</VStack>
	);

	/**
	 * Layout for completed attendance
	 */
	const renderCompletedAttendanceLayout = () => (
		<VStack align='stretch' spacing={4}>
			<Alert status='success' borderRadius='md' bg={colors.badgeSuccessBg}>
				<AlertIcon color={colors.badgeSuccessText} />
				<Box flex='1'>
					<AlertTitle color={colors.badgeSuccessText}>Ready to Generate Payslip</AlertTitle>
					<AlertDescription color={colors.badgeSuccessText}>
						All attendance records are complete and accurate.
					</AlertDescription>
				</Box>
			</Alert>

			<Box>
				<Text fontWeight='semibold' mb={3} color={colors.headingText}>
					Attendance Summary:
				</Text>
				<VStack align='stretch' spacing={2}>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Total Working Days:</Text>
						<Text fontWeight='bold' color={colors.badgeSuccessText}>
							{employee.attendanceSummary?.totalWorkingDays || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Days Recorded:</Text>
						<Text fontWeight='bold' color={colors.badgeSuccessText}>
							{employee.attendanceSummary?.totalRecords || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Completion Status:</Text>
						<Badge
							bg={colors.badgeSuccessBg}
							color={colors.badgeSuccessText}
							fontSize='sm'
							px={2}
							py={1}
							borderRadius='full'
						>
							{getAttendancePercentage(employee)}% Complete
						</Badge>
					</HStack>
				</VStack>
			</Box>

			<Box
				p={3}
				bg={colors.badgeSuccessBg}
				borderRadius='md'
				border='1px solid'
				borderColor={colors.badgeSuccessBorder}
			>
				<Text
					fontSize='sm'
					color={colors.badgeSuccessText}
					fontWeight='medium'
					display='flex'
					gap={2}
					alignItems='center'
				>
					<FiCheckCircle /> Ready for Processing
				</Text>
				<Text fontSize='sm' color={colors.badgeSuccessText} mt={1}>
					All attendance data is complete. The generated payslip will reflect
					accurate calculations.
				</Text>
			</Box>
		</VStack>
	);

	/**
	 * Layout for incomplete attendance
	 */
	const renderIncompleteAttendanceLayout = () => (
		<VStack align='stretch' spacing={4}>
			<Alert status='warning' borderRadius='md' bg={colors.badgeWarningBg}>
				<AlertIcon color={colors.badgeWarningText} />
				<Box flex='1'>
					<AlertTitle color={colors.badgeWarningText}>Attendance Not Yet Completed</AlertTitle>
					<AlertDescription color={colors.badgeWarningText}>
						Cannot generate payslip automatically until all attendance records
						are completed.
					</AlertDescription>
				</Box>
			</Alert>

			<Box>
				<Text fontWeight='semibold' mb={3} color={colors.headingText}>
					Attendance Summary Details:
				</Text>
				<VStack align='stretch' spacing={2}>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Total Working Days:</Text>
						<Text fontWeight='bold' color={colors.headingText}>
							{employee.attendanceSummary?.totalWorkingDays || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Days Recorded:</Text>
						<Text fontWeight='bold' color={colors.headingText}>
							{employee.attendanceSummary?.totalRecords || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Missing Day Records:</Text>
						<Text fontWeight='bold' color={colors.badgeErrorText}>
							{(employee.attendanceSummary?.totalWorkingDays || 0) -
								(employee.attendanceSummary?.totalRecords || 0)}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color={colors.bodyText}>Completion Status:</Text>
						<Badge
							bg={colors.badgeErrorBg}
							color={colors.badgeErrorText}
							fontSize='sm'
							px={2}
							py={1}
							borderRadius='full'
						>
							{getAttendancePercentage(employee)}% Complete
						</Badge>
					</HStack>
				</VStack>
			</Box>

			<Box
				p={3}
				bg={colors.badgeWarningBg}
				borderRadius='md'
				border='1px solid'
				borderColor={colors.badgeWarningBorder}
			>
				<Text
					fontSize='sm'
					color={colors.badgeWarningText}
					fontWeight='medium'
					display='flex'
					gap={2}
					alignItems='center'
				>
					<FaExclamationCircle /> Important Note:
				</Text>
				<Text fontSize='sm' color={colors.badgeWarningText} mt={1}>
					For accurate payroll processing, it's recommended to complete all
					attendance records first. The generated payslip will use currently
					available data and may not reflect final adjustments.
				</Text>
			</Box>
		</VStack>
	);

	const handleProccedPayslip = () => {
		if (payslipPaid) {
			handleGeneratePayslip({
				adjustments: employee?.payslip?.adjustments || [],
			});
		} else setAdjustmentsOpen(true);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='xl'
				isCentered
				closeOnOverlayClick={!loading}
			>
				<ModalOverlay bg={colors.overlayBg} backdropFilter='blur(4px)' />
				<ModalContent
					mx={{ base: 3, md: 8 }}
					boxShadow={colors.modalShadow}
					borderRadius='2xl'
					bg={colors.bg}
					overflow='hidden'
					display='flex'
					flexDirection='column'
					border='1px solid'
					borderColor={colors.borderColor}
				>
					<Flex
						align='center'
						justify='space-between'
						bg={colors.headerBg}
						color={colors.headerText}
						px={{ base: 6, md: 8 }}
						py={4}
						borderBottom='1px solid'
						borderColor={colors.borderColor}
					>
						<VStack align='start' spacing={0}>
							<Text
								fontWeight='bold'
								fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
								color={colors.headerText}
							>
								Payslip Preview
							</Text>
							<Text fontWeight='bold' color={colors.headerText}>
								{employee?.fullName || 'Employee'}
							</Text>
						</VStack>

						<ModalCloseButton
							position='static'
							isDisabled={loading}
							color={colors.headerText}
							_hover={{ bg: colors.closeBtnHoverBg }}
						/>
					</Flex>

					<ModalBody
						overflowY='auto'
						px={{ base: 6, md: 8 }}
						py={5}
						flex='1'
						sx={{
							'&::-webkit-scrollbar': { width: '6px' },
							'&::-webkit-scrollbar-track': { background: colors.bgInput, borderRadius: '12px' },
							'&::-webkit-scrollbar-thumb': {
								background: colors.accentGold,
								borderRadius: '12px',
							},
						}}
					>
						{/* Dynamic Content based on employee status */}
						{renderModalContent()}

						{/* Error Display */}
						{error && (
							<Alert status='error' borderRadius='md' mt={4} bg={colors.badgeErrorBg}>
								<AlertIcon color={colors.badgeErrorText} />
								<Box flex='1'>
									<AlertTitle color={colors.badgeErrorText}>Generation Failed</AlertTitle>
									<AlertDescription fontSize='sm' color={colors.badgeErrorText}>
										{error.message ||
											'Failed to generate payslip. Please try again.'}
									</AlertDescription>
								</Box>
							</Alert>
						)}
					</ModalBody>

					<ModalFooter
						bg={colors.footerBg}
						px={{ base: 6, md: 8 }}
						py={4}
						borderTop='1px solid'
						borderColor={colors.borderColor}
					>
						<HStack spacing={3} width='full' justify='space-between'>
							<Button
								variant='outline'
								onClick={onClose}
								size='sm'
								borderRadius='md'
								isDisabled={loading}
							>
								Cancel
							</Button>

							<Button
								variant='brand'
								onClick={handleProccedPayslip}
								size='sm'
								borderRadius='md'
								isLoading={loading}
								loadingText='Generating...'
								isDisabled={!hasValidSalaryInfo(employee) || loading}
							>
								{payslipPaid ? 'Generate' : 'Proceed'}
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{adjustmentsOpen && (
				<AdjustmentsModal
					isOpen={adjustmentsOpen}
					onClose={() => setAdjustmentsOpen(false)}
					onSave={handleGeneratePayslip}
					employeeAdjustments={employee?.payslip?.adjustments}
					currency={employee?.payrollSummary?.currency}
				/>
			)}
		</>
	);
};

export default PayslipDownloadModal;