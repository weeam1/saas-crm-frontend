import {
	Box,
	VStack,
	HStack,
	Grid,
	Text,
	Heading,
	Badge,
	Divider,
	Progress,
	SimpleGrid,
	Icon,
	useColorModeValue,
	Skeleton,
	Alert,
	AlertIcon,
	Container,
	Avatar,
	IconButton,
	useDisclosure,
	Flex,
	Spacer,
} from '@chakra-ui/react';
import {
	FiDollarSign,
	FiCalendar,
	FiTrendingUp,
	FiUser,
	FiHome,
	FiCreditCard,
	FiClock,
	FiAward,
	FiPieChart,
	FiMail,
	FiChevronLeft,
} from 'react-icons/fi';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import { constant } from 'constant';
import { FaBuilding } from 'react-icons/fa';
import PayrollStatus from './PayrollStatus';
import { ImageModal } from './ImageModal';
import { formatAmount, formatCurrency } from 'utils/helpers';
import { SalarySummaryRow } from './PayrollResuable';
import DateFilter from 'views/admin/attendance/components/DateFilter';
import { DeductionRow } from './PayrollShared';

// Custom components for better organization
const StatCard = ({
	title,
	value,
	subtitle,
	icon,
	color = 'blue',
	trend,
	...props
}) => (
	<Box
		p={2}
		bg={useColorModeValue('white', 'gray.800')}
		rounded='md'
		shadow='sm'
		{...props}
	>
		<Box>
			<HStack justify='space-between' align='flex-start'>
				<Text>
					<Text fontSize='sm' color='gray.600' fontWeight='medium'>
						{title}
					</Text>
					<Text
						fontSize={{ base: 'md', md: 'lg', lg: 'xl', xl: '2xl' }}
						fontWeight='bold'
						color={`${color}.500`}
					>
						{value}
					</Text>
					{subtitle && (
						<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
							{subtitle}
						</Text>
					)}
					{trend && (
						<Badge
							colorScheme={trend.value > 0 ? 'green' : 'red'}
							variant='subtle'
						>
							{trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
						</Badge>
					)}
				</Text>
				<Icon
					as={icon}
					w={{ base: 4, md: 6, lg: 8 }}
					h={{ base: 4, md: 6, lg: 8 }}
					color={`${color}.500`}
					opacity={0.7}
				/>
			</HStack>
		</Box>
	</Box>
);

const SectionCard = ({ title, icon, children, ...props }) => (
	<Box
		p={{ base: 4, md: 6 }}
		bg={useColorModeValue('white', 'gray.800')}
		shadow='md'
		rounded='md'
		{...props}
	>
		<Box pb={3}>
			<HStack>
				<Icon as={icon} color='blue.500' />
				<Heading size='md'>{title}</Heading>
			</HStack>
			<Divider mt={3} />
		</Box>
		<Box pt={0}>{children}</Box>
	</Box>
);

const ProgressIndicator = ({ label, value, max, color = 'blue', currency }) => (
	<Box>
		<HStack justify='space-between' mb={2}>
			<Text fontSize='sm' fontWeight='medium' color='gray.600'>
				{label}
			</Text>
			<Text fontSize='sm' fontWeight='bold'>
				{currency} {value} / {currency} {max}
			</Text>
		</HStack>
		<Progress
			value={(value / max) * 100}
			colorScheme={color}
			size='lg'
			w='100%'
			borderRadius='full'
			bg={useColorModeValue('gray.100', 'gray.700')}
		/>
		<Text fontSize='xs' color='gray.500' mt={1} textAlign='right'>
			{((value / max) * 100).toFixed(1)}%
		</Text>
	</Box>
);

const EmployeePayrollDetails = ({
	userId: propUserId,
	isMyPayslip = false,
}) => {
	const { userId: paramUserId } = useParams();
	const navigate = useNavigate();

	const userId = propUserId || paramUserId;

	const now = new Date();
	const defaultMonth = String(now.getMonth() + 1).padStart(2, '0');
	const defaultYear = String(now.getFullYear());

	const [searchParams, setSearchParams] = useSearchParams();

	const month = searchParams.get('month') || defaultMonth;
	const year = searchParams.get('year') || defaultYear;

	const {
		data: payrollData,
		isLoading: payrollLoading,
		refetch: payrollRefetch,
		isFetching: payrollIsFetching,
	} = useFetchItemsQuery(
		{
			path: `/payroll/user/${userId}`,
			params: { month, year },
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnFocus: true,
			refetchOnReconnect: true,
			skip: !userId,
		},
	);

	const onDateFilterChange = (value) => {
		const newMonth = String(value.month).padStart(2, '0');
		const newYear = String(value.year);

		setSearchParams({
			month: newMonth,
			year: newYear,
		});
	};

	const {
		isOpen: profileIsOpen,
		onOpen: profileOnOpen,
		onClose: profileOnClose,
	} = useDisclosure();

	const bgColor = useColorModeValue('gray.50', 'gray.900');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	if (payrollLoading || payrollIsFetching) {
		return <PayrollSkeleton />;
	}

	if (!payrollData?.doc) {
		return (
			<Container maxW='container.xl' py={8}>
				<Alert status='error' borderRadius='lg'>
					<AlertIcon />
					Unable to load payroll data. Please try again later.
				</Alert>
			</Container>
		);
	}

	const {
		fullName,
		profileImage,
		agency,
		username,
		commission,
		incentive,
		salary,
		salaryType,
		evaluation,
		loanSummary,
		attendanceSummary,
		payrollSummary,
		closeDeals,
		sharedDeals,
		payslip,
	} = payrollData?.doc?.snapshots || payrollData?.doc;

	const name = fullName || username || '';
	const imgSrc = profileImage
		? `${constant.baseUrl}${profileImage}`
		: undefined;

	const currency = payrollSummary?.currency || 'AED';

	const userEarnings = [
		{
			key: 'basic',
			label: 'Basic',
			value: payrollSummary?.basicSalary,
		},
		{
			key: 'dealCommission',
			label: `Deal Commission (${commission}%)`,
			value:
				payrollSummary?.closeDealCommission ??
				payrollSummary?.currentCloseDealCommission,
			color: 'green.500',
		},
		{
			key: 'sharedCommission',
			label: 'Shared Commission',
			value:
				payrollSummary?.sharedDealCommission ??
				payrollSummary?.currentSharedDealCommission,
			color: 'green.500',
		},
		{
			key: 'incentive',
			label: `Incentive (${incentive})`,
			value: payrollSummary?.incentiveEarned,
			color: 'green.500',
		},

		// 🔹 Adjustments (earnings side)
		{
			key: 'overtime',
			label: 'Overtime',
			value: payrollSummary?.adjustments?.overtime,
			color: 'green.500',
		},
		{
			key: 'bonus',
			label: 'Bonus',
			value: payrollSummary?.adjustments?.bonus,
			color: 'green.500',
		},
		{
			key: 'allowance',
			label: 'Allowance',
			value: payrollSummary?.adjustments?.allowance,
			color: 'green.500',
		},
		{
			key: 'commissionAdjustment',
			label: 'Commission Adjustment',
			value: payrollSummary?.adjustments?.commission,
			color: 'green.500',
		},
	];

	const userDeductions = [
		{
			key: 'loanInstallments',
			label: loanSummary?.activeLoans
				? `${loanSummary.activeLoans} Loan Installment's`
				: null,
			value: payrollSummary?.loanDeduction,
		},
		{
			key: 'attendanceDeduction',
			label: 'Attendance Deduction',
			value:
				payrollSummary?.attendanceDeduction ??
				payrollSummary?.currentAttendanceDeduction,
		},
		{
			key: 'deduction',
			label: 'Deduction',
			value: payrollSummary?.adjustments?.deduction,
		},
		{
			key: 'warningDeduction',
			label: 'Warning Deduction',
			value: payrollSummary?.warningDeduction,
		},
	];

	return (
		<Box bg={bgColor} shadow='lg' rounded='lg' minH='100vh' py={8} px={2}>
			{!isMyPayslip && (
				<HStack mb='3' align='center' justify='space-between'>
					<IconButton
						aria-label='Go back'
						icon={<FiChevronLeft />}
						onClick={() => navigate(-1)}
						size='md'
						isRound
					/>

					<PayrollStatus
						initialStatus={payrollData?.doc?.paymentStatus || 'pending'}
						payrollData={payrollData?.doc?.snapshots || payrollData?.doc}
					/>
				</HStack>
			)}

			{isMyPayslip && (
				<HStack mb='3' align='center' justify='flex-end'>
					<DateFilter onFilterChange={onDateFilterChange} />
				</HStack>
			)}

			<Container maxW='container.4xl'>
				{/* Header Section */}
				<VStack spacing={6} align='stretch' mb={8}>
					<HStack justify='space-between' align='flex-start'>
						<VStack align='flex-start' spacing={2}>
							<Heading size='xl' color='gray.800'>
								Payroll Details
							</Heading>
							<Text color='gray.600'>
								Comprehensive payroll breakdown for employee
							</Text>
						</VStack>
						{/* <Badge
							colorScheme={
								payslip?.status === 'approved'
									? 'green'
									: payslip?.status === 'pending'
										? 'orange'
										: 'blue'
							}
							fontSize='md'
							px={3}
							py={1}
							borderRadius='full'
						>
							{payslip?.status?.toUpperCase() || 'DRAFT'}
						</Badge> */}
					</HStack>

					{/* Employee Profile Box */}
					<Box
						bg='white'
						px={{ base: 2, md: 4, lg: 6 }}
						py={4}
						rounded='md'
						shadow='md'
						border='1px'
						borderColor={borderColor}
					>
						<Flex
							flexDir={{ base: 'column', md: 'row' }}
							gap={{ base: 2, md: 4 }}
							align='center'
						>
							<Avatar
								size='xl'
								src={imgSrc}
								onClick={imgSrc ? profileOnOpen : undefined}
								name={fullName}
								border='2px solid #dba554ff'
							/>

							<VStack
								align={{ base: 'center', md: 'flex-start' }}
								spacing={1}
								flex={1}
							>
								<Text
									fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
									fontWeight='bold'
									maxWidth={{ base: '350px', md: '100%' }}
									isTruncated
								>
									{fullName}
								</Text>
								<HStack>
									<Icon as={FiMail} color='gray.500' />
									<Text
										maxWidth={{ base: '200px', md: '100%' }}
										isTruncated
										fontSize={{ base: 'xs', md: 'sm' }}
										color='gray.600'
									>
										{username}
									</Text>
								</HStack>
								<HStack>
									<Icon as={FaBuilding} color='gray.500' />
									<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.600'>
										{agency?.name}
									</Text>
								</HStack>
							</VStack>
						</Flex>
					</Box>
				</VStack>

				{/* Key Metrics Grid */}
				<SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={6} mb={8}>
					<StatCard
						title='Net Salary'
						value={formatAmount(payrollSummary?.netSalary)}
						subtitle='After all deductions'
						icon={FiDollarSign}
						color='green'
					/>
					<StatCard
						title='Gross Salary'
						value={formatAmount(payrollSummary?.grossSalary)}
						subtitle='Before deductions'
						icon={FiTrendingUp}
						color='blue'
					/>
					<StatCard
						title='Commission Earned'
						value={formatAmount(payrollSummary?.commissionEarned)}
						subtitle='From closed deals'
						icon={FiAward}
						color='purple'
					/>
					<StatCard
						title='Performance Score'
						value={`${evaluation?.finalPercentage || 0}%`}
						subtitle={`${evaluation?.totalObtainedScore || 0}/${evaluation?.totalScore || 0} points`}
						icon={FiPieChart}
						color='orange'
					/>
				</SimpleGrid>

				<Grid
					templateColumns={{ base: '1fr', md: '1fr', xl: '2fr 1fr' }}
					gap={8}
				>
					{/* Left Column - Main Details */}
					<VStack
						// flexDir={{ base: 'column', md: 'row' }}
						spacing={6}
						align='stretch'
					>
						{/* Earnings & Deductions */}
						<SectionCard title='Earnings & Deductions' icon={FiDollarSign}>
							<SimpleGrid
								templateColumns={{ base: '1fr', md: '1fr 1fr' }}
								columns={2}
								spacing={6}
							>
								<VStack w='100%' align='stretch' spacing={4}>
									<Text fontWeight='bold' color='green.600' fontSize='lg'>
										Earnings
									</Text>
									<VStack spacing={3}>
										{userEarnings
											.filter((row) => Number(row.value) > 0)
											.map(({ key, label, value, valueColor }) => (
												<SalarySummaryRow
													key={key}
													label={label}
													value={formatCurrency(value, currency)}
													valueColor={valueColor}
												/>
											))}
									</VStack>
									<Divider />
									<HStack w='100%' justify='space-between' fontWeight='bold'>
										<Text>Total Earnings</Text>
										<Text color='green.600'>
											{formatCurrency(payrollSummary?.grossSalary, currency)}
										</Text>
									</HStack>
								</VStack>

								<VStack align='stretch' spacing={4}>
									<Text fontWeight='bold' color='red.600' fontSize='lg'>
										Deductions
									</Text>
									<VStack spacing={3}>
										{userDeductions
											.filter((row) => Number(row.value) > 0)
											.map(({ key, label, value }) => (
												<SalarySummaryRow
													key={key}
													label={label}
													value={formatCurrency(value, currency)}
													valueColor='red.500'
												/>
											))}
									</VStack>
									<Divider />
									<HStack w='100%' justify='space-between' fontWeight='bold'>
										<Text>Total Deductions</Text>
										<Text color='red.600'>
											-
											{formatCurrency(
												payrollSummary?.totalDeductions,
												currency,
											)}
										</Text>
									</HStack>
								</VStack>
							</SimpleGrid>

							{/* Final Net Salary */}
							<Box p={2} mt={4} bg={'blue.50'} variant='outline'>
								<Box>
									<HStack justify='space-between'>
										<VStack align='flex-start' spacing={1}>
											<Text fontWeight='bold' fontSize='lg'>
												Net Salary Payable
											</Text>
											<Text fontSize='sm' color='gray.600'>
												Amount to be transferred
											</Text>
										</VStack>
										<Text fontSize='2xl' fontWeight='bold' color='green.600'>
											{formatCurrency(
												payrollSummary?.netSalary,
												payrollSummary?.currency,
											)}
										</Text>
									</HStack>
								</Box>
							</Box>
						</SectionCard>

						{/* Attendance Summary */}
						<SectionCard title='Attendance Summary' icon={FiClock}>
							<SimpleGrid columns={2} spacing={6} mb={6}>
								<ProgressIndicator
									label='Present Days'
									value={attendanceSummary?.totalPresent}
									max={attendanceSummary?.totalWorkingDays}
									color='green'
								/>
								<ProgressIndicator
									label='Absent Days'
									value={attendanceSummary?.totalAbsent}
									max={attendanceSummary?.totalWorkingDays}
									color='red'
								/>
							</SimpleGrid>
							<SimpleGrid columns={2} spacing={6}>
								<HStack justify='space-between'>
									<Text color='gray.600'>Working Days</Text>
									<Text fontWeight='semibold'>
										{attendanceSummary?.totalWorkingDays}
									</Text>
								</HStack>
								<HStack justify='space-between'>
									<Text color='gray.600'>Present</Text>
									<Text fontWeight='semibold' color='green.600'>
										{attendanceSummary?.totalPresent}
									</Text>
								</HStack>
								<HStack justify='space-between'>
									<Text color='gray.600'>Absent</Text>
									<Text fontWeight='semibold' color='red.600'>
										{attendanceSummary?.totalAbsent}
									</Text>
								</HStack>
								<HStack justify='space-between'>
									<Text color='gray.600'>Late Arrivals</Text>
									<Text fontWeight='semibold' color='orange.600'>
										{attendanceSummary?.totalLate}
									</Text>
								</HStack>
								<HStack justify='space-between'>
									<Text color='gray.600'>Early Checkouts</Text>
									<Text fontWeight='semibold' color='orange.600'>
										{attendanceSummary?.totalEarlyCheckoutDays}
									</Text>
								</HStack>
							</SimpleGrid>
						</SectionCard>

						<SectionCard title='Salary Deductions' icon={FiDollarSign}>
							{/* Optional context */}
							<Text fontSize='sm' color='gray.500' mb={3}>
								Based on attendance and company policy
							</Text>

							{/* Breakdown */}
							<VStack spacing={3} align='stretch'>
								<DeductionRow
									label='Late Arrival Dedcution'
									value={attendanceSummary?.lateDaysDeduction}
									currency={payrollSummary?.currency}
								/>

								<DeductionRow
									label='Absence Dedcution'
									value={attendanceSummary?.absentDeduction}
									currency={payrollSummary?.currency}
								/>

								<DeductionRow
									label='Unpaid Leave Deduction'
									value={attendanceSummary?.unpaidLeaveDeduction}
									currency={payrollSummary?.currency}
								/>

								<DeductionRow
									label='Early Checkout Dedcution'
									value={attendanceSummary?.earlyCheckoutDaysDeduction}
									currency={payrollSummary?.currency}
								/>

								<DeductionRow
									label='Important Absent Days Dedcution'
									value={attendanceSummary?.importantDayAbsentDeduction}
									currency={payrollSummary?.currency}
								/>
								<DeductionRow
									label='Important Unpaid Leave Dedcution'
									value={attendanceSummary?.importantDayUnpaidLeaveDeduction}
									currency={payrollSummary?.currency}
								/>

								<DeductionRow
									label='Unworked Days Dedcution'
									value={attendanceSummary?.remainingDaysDeduction}
									currency={payrollSummary?.currency}
								/>
							</VStack>

							<Divider />

							{/* Total */}
							<HStack justify='space-between' mt={5}>
								<Text fontSize='md' fontWeight='bold'>
									Total Deductions
								</Text>

								<Text fontSize='md' fontWeight='bold' color='red.500'>
									{formatCurrency(
										attendanceSummary?.totalAttendanceDeduction,
										payrollSummary?.currency,
									)}
								</Text>
							</HStack>
						</SectionCard>
					</VStack>

					{/* Right Column - Sidebar */}
					<VStack spacing={6} align='stretch'>
						{/* Loan Information */}
						<SectionCard title='Loan Summary' icon={FiCreditCard}>
							<VStack spacing={4} align='stretch'>
								{/* <ProgressIndicator
									label='Loan Repayment Progress'
									value={loanSummary?.totalPaidAmount}
									max={loanSummary?.totalBorrowedAmount}
									color='blue'
									currency={payrollSummary?.currency}
								/> */}
								<SimpleGrid columns={1} spacing={3}>
									<HStack justify='space-between'>
										<Text color='gray.600'>Total Borrowed</Text>
										<Text fontWeight='semibold'>
											{formatAmount(loanSummary?.totalBorrowedAmount)}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Amount Paid</Text>
										<Text fontWeight='semibold' color='green.600'>
											{payrollData?.doc?.paymentStatus === 'paid'
												? formatAmount(loanSummary?.monthlyInstallment)
												: formatAmount(loanSummary?.totalPaidAmount)}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Remaining</Text>
										<Text fontWeight='semibold' color='red.600'>
											{payrollData?.doc?.paymentStatus === 'paid'
												? formatAmount(
														loanSummary?.totalRemainingAmount -
															loanSummary?.monthlyInstallment,
													)
												: formatAmount(loanSummary?.totalRemainingAmount)}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Monthly Installment</Text>
										<Text fontWeight='semibold'>
											{formatAmount(loanSummary?.monthlyInstallment)}
										</Text>
									</HStack>
								</SimpleGrid>
							</VStack>
						</SectionCard>

						{/* Performance & Deals */}
						<SectionCard title='Performance & Deals' icon={FiTrendingUp}>
							<VStack spacing={4} align='stretch'>
								<Box>
									<HStack justify='space-between' mb={2}>
										<Text fontWeight='medium' color='gray.600'>
											Performance Score
										</Text>
										<Text fontWeight='bold' color='blue.600'>
											{evaluation?.finalPercentage || 0}%
										</Text>
									</HStack>
									<Progress
										value={evaluation?.finalPercentage || 0}
										colorScheme='blue'
										size='md'
										w='100%'
										borderRadius='full'
									/>
								</Box>
								<SimpleGrid columns={1} spacing={3}>
									<HStack justify='space-between'>
										<Text color='gray.600'>Closed Deals</Text>
										<Text fontWeight='semibold'>
											{closeDeals?.dealsCount || 0}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Shared Deals</Text>
										<Text fontWeight='semibold'>
											{sharedDeals?.dealsCount || 0}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Deal Value</Text>
										<Text fontWeight='semibold'>
											{closeDeals?.totalAmount?.toLocaleString() || 0}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Evaluators</Text>
										<Text fontWeight='semibold'>
											{evaluation?.totalEvaluators || 0}
										</Text>
									</HStack>
								</SimpleGrid>
							</VStack>
						</SectionCard>

						{/* Payroll Status */}
						{payslip && (
							<SectionCard title='Payroll Status' icon={FiCalendar}>
								<VStack spacing={3} align='stretch'>
									<HStack justify='space-between'>
										<Text color='gray.600'>Status</Text>
										<Badge
											colorScheme={
												payslip?.paymentStatus === 'paid'
													? 'green'
													: payslip?.paymentStatus === 'pending'
														? 'orange'
														: 'gray'
											}
										>
											{payslip?.paymentStatus?.toUpperCase() || 'N/A'}
										</Badge>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Payslip Version</Text>
										<Text fontWeight='semibold'>v{payslip?.version || 1}</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Generated By</Text>
										<Text fontSize='sm'>
											{payslip?.generatedBy?.fullName || 'N/A'}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Last Updated</Text>
										<Text fontSize='sm'>
											{new Date(payslip?.updatedAt).toLocaleDateString()}
										</Text>
									</HStack>
								</VStack>
							</SectionCard>
						)}
					</VStack>
				</Grid>
			</Container>

			{/* Image Modal */}
			{profileIsOpen && (
				<ImageModal
					isOpen={profileIsOpen}
					onClose={profileOnClose}
					imageSrc={imgSrc}
					alt={fullName}
				/>
			)}
		</Box>
	);
};

// Skeleton Loader Component
const PayrollSkeleton = () => (
	<Box bg='gray.50' minH='100vh' py={8} px={2}>
		<Container maxW='container.4xl'>
			<VStack spacing={6} align='stretch'>
				<Skeleton height='40px' width='300px' />
				<Skeleton height='120px' borderRadius='lg' />
				<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
					{Array(4)
						.fill(0)
						.map((_, i) => (
							<Skeleton key={i} height='100px' borderRadius='lg' />
						))}
				</SimpleGrid>
				<SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
					{Array(2)
						.fill(0)
						.map((_, i) => (
							<Skeleton key={i} height='400px' borderRadius='lg' />
						))}
				</SimpleGrid>
				<Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
					<VStack spacing={6}>
						<Skeleton height='500px' borderRadius='lg' />
						<Skeleton height='550px' borderRadius='lg' />
					</VStack>
					<VStack spacing={6}>
						<Skeleton height='200px' borderRadius='lg' />
						<Skeleton height='200px' borderRadius='lg' />
						<Skeleton height='150px' borderRadius='lg' />
					</VStack>
				</Grid>
			</VStack>
		</Container>
	</Box>
);

export default EmployeePayrollDetails;
