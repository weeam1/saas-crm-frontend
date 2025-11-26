// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalBody,
// 	ModalFooter,
// 	ModalCloseButton,
// 	Flex,
// 	VStack,
// 	HStack,
// 	Text,
// 	Box,
// 	Badge,
// 	Button,
// } from '@chakra-ui/react';
// import { FiLock, FiPrinter } from 'react-icons/fi';
import { useModalColors } from 'hooks/useModalColors';
// import { FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
// import { useCallback } from 'react';

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
import { usePdfDownloader } from 'hooks/usePdfDownloader';
import { toast } from 'react-toastify';

const PayslipDownloadModal = ({ isOpen, onClose, employee, month, year }) => {
	const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
	const { downloadPdf, loading, progress, error } = usePdfDownloader();

	// State to track generation type
	const [generationType, setGenerationType] = useState(null); // 'normal' | 'forced'

	// Reset state when modal opens/closes
	useEffect(() => {
		if (!isOpen) {
			setGenerationType(null);
		}
	}, [isOpen]);

	/**
	 * Check if employee has required salary information
	 */
	const hasValidSalaryInfo = useCallback((emp) => {
		return emp?.basicSalary && emp?.salaryType;
	}, []);

	/**
	 * Check if attendance is fully completed
	 */
	const hasCompletedAttendance = useCallback((emp) => {
		const attendanceSummary = emp?.attendanceSummary || {};
		return (
			attendanceSummary.totalRecords === attendanceSummary.totalWorkingDays
		);
	}, []);

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
	const generateFileName = useCallback((emp, type = 'normal') => {
		const now = new Date();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = now.getFullYear();
		const typeSuffix = type === 'forced' ? '_PROVISIONAL' : '';

		return `payslip_${emp.fullName?.replace(/\s+/g, '_')}_${month}_${year}${typeSuffix}.pdf`;
	}, []);

	/**
	 * Handle PDF generation
	 */
	const handleGeneratePayslip = async (type = 'normal') => {
		if (!hasValidSalaryInfo(employee)) {
			toast.error('Employee salary information is incomplete');
			return;
		}

		setGenerationType(type);

		try {
			const fileName = generateFileName(employee, type);

			await downloadPdf(
				`api/payroll/generate/${employee?._id}?month=${month}&year=${year}`,
				fileName
			);

			toast.success(
				type === 'forced'
					? 'Provisional Payslip Generated'
					: 'Payslip Generated'
			);

			onClose(); // Close modal on success
		} catch (err) {
			console.error('Payslip generation failed:', err);
			// Error handling is done by the hook, but we can reset generation type
			setGenerationType(null);
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
			<Alert status='error' borderRadius='md'>
				<AlertIcon />
				<Box flex='1'>
					<AlertTitle>Missing Salary Information</AlertTitle>
					<AlertDescription>
						Cannot generate payslip without complete salary details.
					</AlertDescription>
				</Box>
			</Alert>

			<Box p={4} bg='gray.50' borderRadius='md'>
				<Text fontWeight='semibold' mb={3} color='gray.700'>
					Required Information:
				</Text>
				<VStack align='stretch' spacing={2}>
					<HStack justify='space-between'>
						<Text color='gray.600'>Basic Salary:</Text>
						<Badge
							colorScheme={employee?.basicSalary ? 'green' : 'red'}
							fontSize='sm'
						>
							{employee?.basicSalary ? '✓ Defined' : '✗ Missing'}
						</Badge>
					</HStack>
					<HStack justify='space-between'>
						<Text color='gray.600'>Salary Type:</Text>
						<Badge
							colorScheme={employee?.salaryType ? 'green' : 'red'}
							fontSize='sm'
						>
							{employee?.salaryType ? '✓ Defined' : '✗ Missing'}
						</Badge>
					</HStack>
				</VStack>
			</Box>

			<Text fontSize='sm' color='gray.600' textAlign='center'>
				Please update employee salary information before generating payslip.
			</Text>
		</VStack>
	);

	/**
	 * Layout for completed attendance
	 */
	const renderCompletedAttendanceLayout = () => (
		<VStack align='stretch' spacing={4}>
			<Alert status='success' borderRadius='md'>
				<AlertIcon />
				<Box flex='1'>
					<AlertTitle>Ready to Generate Payslip</AlertTitle>
					<AlertDescription>
						All attendance records are complete and accurate.
					</AlertDescription>
				</Box>
			</Alert>

			<Box>
				<Text fontWeight='semibold' mb={3} color='gray.700'>
					Attendance Summary:
				</Text>
				<VStack align='stretch' spacing={2}>
					<HStack justify='space-between'>
						<Text color='gray.600'>Total Working Days:</Text>
						<Text fontWeight='bold' color='green.600'>
							{employee.attendanceSummary?.totalWorkingDays || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color='gray.600'>Days Recorded:</Text>
						<Text fontWeight='bold' color='green.600'>
							{employee.attendanceSummary?.totalRecords || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color='gray.600'>Completion Status:</Text>
						<Badge colorScheme='green' fontSize='sm' px={2} py={1}>
							{getAttendancePercentage(employee)}% Complete
						</Badge>
					</HStack>
				</VStack>
			</Box>

			<Box
				p={3}
				bg='green.50'
				borderRadius='md'
				border='1px solid'
				borderColor='green.200'
			>
				<Text
					fontSize='sm'
					color='green.800'
					fontWeight='medium'
					display='flex'
					gap={2}
					alignItems='center'
				>
					<FiCheckCircle /> Ready for Processing
				</Text>
				<Text fontSize='sm' color='green.700' mt={1}>
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
			<Alert status='warning' borderRadius='md'>
				<AlertIcon />
				<Box flex='1'>
					<AlertTitle>Attendance Not Yet Completed</AlertTitle>
					<AlertDescription>
						Cannot generate payslip automatically until all attendance records
						are completed.
					</AlertDescription>
				</Box>
			</Alert>

			<Box>
				<Text fontWeight='semibold' mb={3} color='gray.700'>
					Attendance Summary Details:
				</Text>
				<VStack align='stretch' spacing={2}>
					<HStack justify='space-between'>
						<Text color='gray.600'>Total Working Days:</Text>
						<Text fontWeight='bold' color='gray.800'>
							{employee.attendanceSummary?.totalWorkingDays || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color='gray.600'>Days Recorded:</Text>
						<Text fontWeight='bold' color='gray.800'>
							{employee.attendanceSummary?.totalRecords || 0}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color='gray.600'>Missing Day Records:</Text>
						<Text fontWeight='bold' color='red.600'>
							{(employee.attendanceSummary?.totalWorkingDays || 0) -
								(employee.attendanceSummary?.totalRecords || 0)}
						</Text>
					</HStack>
					<HStack justify='space-between'>
						<Text color='gray.600'>Completion Status:</Text>
						<Badge colorScheme='red' fontSize='sm' px={2} py={1}>
							{getAttendancePercentage(employee)}% Complete
						</Badge>
					</HStack>
				</VStack>
			</Box>

			<Box
				p={3}
				bg='orange.50'
				borderRadius='md'
				border='1px solid'
				borderColor='orange.200'
			>
				<Text
					fontSize='sm'
					color='orange.800'
					fontWeight='medium'
					display='flex'
					gap={2}
					alignItems='center'
				>
					<FaExclamationCircle /> Important Note:
				</Text>
				<Text fontSize='sm' color='orange.700' mt={1}>
					For accurate payroll processing, it's recommended to complete all
					attendance records first. The generated payslip will use currently
					available data and may not reflect final adjustments.
				</Text>
			</Box>
		</VStack>
	);

	/**
	 * Render progress indicator when downloading
	 */
	const renderProgressIndicator = () => {
		if (!loading) return null;

		return (
			<Box mt={4}>
				<Text fontSize='sm' color='gray.600' mb={2}>
					Generating PDF: {progress}%
				</Text>
				<Progress
					value={progress}
					colorScheme='blue'
					size='lg'
					w='100%'
					borderRadius='full'
					hasStripe
					isAnimated={progress < 100}
				/>
				<Text fontSize='xs' color='gray.500' mt={2} textAlign='center'>
					{generationType === 'forced'
						? 'Generating provisional payslip...'
						: 'Generating payslip...'}
				</Text>
			</Box>
		);
	};

	/**
	 * Render appropriate action buttons based on state
	 */
	const renderActionButtons = () => {
		// Disable buttons during loading
		const isDisabled = loading;

		return (
			<HStack spacing={3} width='full' justify='space-between'>
				<Button
					variant='outline'
					colorScheme='gray'
					onClick={onClose}
					size='sm'
					borderRadius='md'
					isDisabled={isDisabled}
				>
					Cancel
				</Button>

				{/* Different button states based on conditions */}
				{!hasValidSalaryInfo(employee) ? (
					<Button
						colorScheme='gray'
						size='sm'
						borderRadius='md'
						isDisabled
						leftIcon={<FiAlertTriangle />}
					>
						Cannot Generate
					</Button>
				) : hasCompletedAttendance(employee) ? (
					<Button
						colorScheme='green'
						onClick={() => handleGeneratePayslip('normal')}
						leftIcon={<FiPrinter />}
						size='sm'
						borderRadius='md'
						isLoading={loading && generationType === 'normal'}
						loadingText='Generating...'
						isDisabled={isDisabled}
					>
						Generate Payslip
					</Button>
				) : (
					<Button
						colorScheme='orange'
						onClick={() => handleGeneratePayslip('forced')}
						leftIcon={<FiAlertTriangle />}
						size='sm'
						borderRadius='md'
						isLoading={loading && generationType === 'forced'}
						loadingText='Generating...'
						isDisabled={isDisabled}
					>
						Generate Provisional
					</Button>
				)}
			</HStack>
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='xl'
			isCentered
			closeOnOverlayClick={!loading}
		>
			<ModalOverlay backdropFilter='blur(8px)' />
			<ModalContent
				mx={{ base: 3, md: 8 }}
				boxShadow='0 12px 45px rgba(0,0,0,0.25)'
				borderRadius='2xl'
				bg={bg}
				overflow='hidden'
				display='flex'
				flexDirection='column'
			>
				<Flex
					align='center'
					justify='space-between'
					bg={headerBg}
					color={headerText}
					px={{ base: 6, md: 8 }}
					py={4}
					borderBottom='1px solid'
					borderColor={borderColor}
				>
					<Flex align='center' gap={2}>
						<FiLock />
						<Text fontWeight='semibold'>Payslip Generation</Text>
					</Flex>
					<ModalCloseButton position='static' isDisabled={loading} />
				</Flex>

				<ModalBody
					overflowY='auto'
					px={{ base: 6, md: 8 }}
					py={5}
					flex='1'
					sx={{
						'&::-webkit-scrollbar': { width: '6px' },
						'&::-webkit-scrollbar-thumb': {
							background: 'gray.400',
							borderRadius: '12px',
						},
					}}
				>
					{/* Employee Name Header */}
					<Text fontWeight='bold' fontSize='lg' color='gray.700' mb={4}>
						{employee?.fullName || 'Employee'}
					</Text>

					{/* Dynamic Content based on employee status */}
					{renderModalContent()}

					{/* Progress Indicator */}
					{/* {renderProgressIndicator()} */}

					{/* Error Display */}
					{error && (
						<Alert status='error' borderRadius='md' mt={4}>
							<AlertIcon />
							<Box flex='1'>
								<AlertTitle>Generation Failed</AlertTitle>
								<AlertDescription fontSize='sm'>
									{error.message ||
										'Failed to generate payslip. Please try again.'}
								</AlertDescription>
							</Box>
						</Alert>
					)}
				</ModalBody>

				<ModalFooter
					bg={footerBg}
					px={{ base: 6, md: 8 }}
					py={4}
					borderTop='1px solid'
					borderColor={borderColor}
				>
					{renderActionButtons()}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default PayslipDownloadModal;
// const PayslipDownloadModal = ({ isOpen, onClose, employee }) => {
// 	const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

// 	const hasCompletedAttendance = useCallback((employee) => {
// 		const attendanceSummary = employee.attendanceSummary || {};
// 		return (
// 			attendanceSummary.totalRecords === attendanceSummary.totalWorkingDays
// 		);
// 	}, []);

// 	const getAttendancePercentage = useCallback((employee) => {
// 		const attendanceSummary = employee.attendanceSummary || {};
// 		if (
// 			!attendanceSummary.totalWorkingDays ||
// 			attendanceSummary.totalWorkingDays === 0
// 		) {
// 			return 0;
// 		}
// 		return Math.round(
// 			(attendanceSummary.totalRecords / attendanceSummary.totalWorkingDays) *
// 				100
// 		);
// 	}, []);

// 	const handleForceGenerate = () => {
// 		// onForceGenerate();
// 	};

// 	return (
// 		<Modal isOpen={isOpen} onClose={onClose} size='xl' isCentered>
// 			<ModalOverlay backdropFilter='blur(8px)' />
// 			<ModalContent
// 				mx={{ base: 3, md: 8 }}
// 				boxShadow='0 12px 45px rgba(0,0,0,0.25)'
// 				borderRadius='2xl'
// 				bg={bg}
// 				overflow='hidden'
// 				display='flex'
// 				flexDirection='column'
// 			>
// 				<Flex
// 					align='center'
// 					justify='space-between'
// 					bg={headerBg}
// 					color={headerText}
// 					px={{ base: 6, md: 8 }}
// 					py={4}
// 					borderBottom='1px solid'
// 					borderColor={borderColor}
// 				>
// 					<Flex align='center'>
// 						<FiLock style={{ marginRight: '8px', color: '#E53E3E' }} />
// 						Payslip Generation
// 					</Flex>
// 					<ModalCloseButton position='static' />
// 				</Flex>

// 				<ModalBody
// 					overflowY='auto'
// 					px={{ base: 6, md: 8 }}
// 					py={5}
// 					flex='1'
// 					sx={{
// 						'&::-webkit-scrollbar': { width: '6px' },
// 						'&::-webkit-scrollbar-thumb': {
// 							background: 'gray.400',
// 							borderRadius: '12px',
// 						},
// 					}}
// 				>
// 					<VStack align='stretch' spacing={4}>
// 						<Text fontWeight='bold' fontSize='lg' color='red.600'>
// 							{employee.fullName}
// 						</Text>

// 						<Box
// 							p={4}
// 							bg='red.50'
// 							borderRadius='md'
// 							borderLeft='4px solid'
// 							borderLeftColor='red.500'
// 						>
// 							<Text
// 								color='red.700'
// 								fontWeight='medium'
// 								mb={2}
// 								display={'flex'}
// 								gap={1}
// 								alignItems={'center'}
// 							>
// 								<FaExclamationTriangle />
// 								Attendance Not Yet Completed
// 							</Text>
// 							<Text color='red.600' fontSize='sm'>
// 								Cannot generate payslip automatically until all attendance
// 								records are completed for the current pay period.
// 							</Text>
// 						</Box>

// 						<Box>
// 							<Text fontWeight='semibold' mb={3} color='gray.700'>
// 								Attendance Summary Details:
// 							</Text>
// 							<VStack align='stretch' spacing={2}>
// 								<HStack justify='space-between'>
// 									<Text color='gray.600'>Total Working Days:</Text>
// 									<Text fontWeight='bold' color='gray.800'>
// 										{employee.attendanceSummary?.totalWorkingDays || 0}
// 									</Text>
// 								</HStack>
// 								<HStack justify='space-between'>
// 									<Text color='gray.600'>Days Recorded:</Text>
// 									<Text fontWeight='bold' color='gray.800'>
// 										{employee.attendanceSummary?.totalRecords || 0}
// 									</Text>
// 								</HStack>
// 								<HStack justify='space-between'>
// 									<Text color='gray.600'>Missing Days:</Text>
// 									<Text fontWeight='bold' color='red.600'>
// 										{(employee.attendanceSummary?.totalWorkingDays || 0) -
// 											(employee.attendanceSummary?.totalRecords || 0)}
// 									</Text>
// 								</HStack>
// 								<HStack justify='space-between'>
// 									<Text color='gray.600'>Completion Status:</Text>
// 									<Badge colorScheme='red' fontSize='sm' px={2} py={1}>
// 										{getAttendancePercentage(employee)}% Complete
// 									</Badge>
// 								</HStack>
// 							</VStack>
// 						</Box>

// 						<Box
// 							p={3}
// 							bg='orange.50'
// 							borderRadius='md'
// 							border='1px solid'
// 							borderColor='orange.200'
// 						>
// 							<Text
// 								fontSize='sm'
// 								color='orange.800'
// 								fontWeight='medium'
// 								mb={2}
// 								display={'flex'}
// 								gap={1}
// 								alignItems={'center'}
// 							>
// 								<FaExclamationCircle /> Important Note:
// 							</Text>
// 							<Text fontSize='sm' color='orange.700'>
// 								For accurate payroll processing, it's recommended to complete
// 								all attendance records first. However, you can force generate
// 								the payslip if needed. The generated payslip will use currently
// 								available data and may not reflect final adjustments.
// 							</Text>
// 						</Box>
// 					</VStack>
// 				</ModalBody>

// 				<ModalFooter
// 					bg={footerBg}
// 					px={{ base: 6, md: 8 }}
// 					py={4}
// 					borderTop='1px solid'
// 					borderColor={borderColor}
// 				>
// 					<HStack spacing={3} width='full' justify='space-between'>
// 						<Button
// 							variant='outline'
// 							colorScheme='gray'
// 							onClick={onClose}
// 							size='sm'
// 							borderRadius={'md'}
// 						>
// 							Cancel
// 						</Button>
// 						<Button
// 							colorScheme='brand'
// 							onClick={handleForceGenerate}
// 							leftIcon={<FiPrinter />}
// 							size='sm'
// 							borderRadius={'md'}
// 							// isLoading={isLoading}
// 							loadingText='Generating...'
// 							// disabled={isLoading}
// 						>
// 							Generate Payslip
// 						</Button>
// 					</HStack>
// 				</ModalFooter>
// 			</ModalContent>
// 		</Modal>
// 	);
// };
