import React from 'react';
import {
	Box,
	VStack,
	HStack,
	Grid,
	GridItem,
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
	Flex,
	Container,
	Avatar,
	IconButton,
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
	FiDownload,
	FiMail,
	FiPhone,
	FiChevronLeft,
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import { constant } from 'constant';
import UserProfileCell from './UserProfileCell';
import { FaBuilding } from 'react-icons/fa';

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
					<Text fontSize='2xl' fontWeight='bold' color={`${color}.500`}>
						{value}
					</Text>
					{subtitle && (
						<Text fontSize='sm' color='gray.500'>
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
				<Icon as={icon} w={8} h={8} color={`${color}.500`} opacity={0.7} />
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
			size='md'
			w='100%'
			borderRadius='full'
			bg={useColorModeValue('gray.100', 'gray.700')}
		/>
		<Text fontSize='xs' color='gray.500' mt={1} textAlign='right'>
			{((value / max) * 100).toFixed(1)}%
		</Text>
	</Box>
);

const EmployeePayrollDetails = () => {
	const { userId } = useParams();
	const navigate = useNavigate();

	const { data: payrollData, isLoading: payrollLoading } = useFetchItemsQuery(
		{
			path: `/payroll/user/${userId}`,
		},
		{
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
			skip: !userId,
		}
	);

	const bgColor = useColorModeValue('gray.50', 'gray.900');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	if (payrollLoading) {
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
		salary,
		salaryType,
		evaluation,
		loanSummary,
		attendanceSummary,
		payrollSummary,
		closeDeals,
		payslip,
	} = payrollData?.doc;

	const name = fullName || username || '';
	const imgSrc = profileImage
		? `${constant.baseUrl}${profileImage}`
		: undefined;

	return (
		<Box bg={bgColor} minH='100vh' py={8} px={2}>
			<IconButton
				aria-label='Go back'
				icon={<FiChevronLeft />}
				onClick={() => navigate(-1)}
				// variant='ghost'
				size='md'
				isRound
			/>
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
						px={6}
						py={4}
						rounded='md'
						shadow='lg'
						border='1px'
						borderColor={borderColor}
					>
						<Box>
							<HStack spacing={4} align='center'>
								<Avatar size='lg' src={imgSrc} name={fullName} />
								{/* <Box
									w={20}
									h={20}
									borderRadius='full'
									display='flex'
									alignItems='center'
									justifyContent='center'
									bg={hasImage ? 'blue.100' : 'blue.200'}
									color='white'
									fontWeight='bold'
									fontSize='3xl'
									border='4px solid'
									borderColor='blue.300'
									backgroundImage={
										hasImage ? `${constant.baseUrl}${profileImage}` : 'none'
									}
									backgroundSize='cover'
									backgroundPosition='center'
								>
									{initial}
								</Box> */}
								<VStack align='flex-start' spacing={1} flex={1}>
									<Text
										fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
										fontWeight='bold'
									>
										{fullName}
									</Text>
									<HStack>
										<Icon as={FiMail} color='gray.500' />
										<Text fontSize='sm' color='gray.600'>
											{username}
										</Text>
									</HStack>

									<HStack spacing={4} mt={2}>
										{/* <HStack>
											<Icon as={FiPhone} color='gray.500' />
											<Text fontSize='sm' color='gray.600'>
												{agency?.contactNumberPrimary}
											</Text>
										</HStack> */}
									</HStack>
								</VStack>
								<VStack align='flex-end' spacing={1}>
									<HStack>
										<Icon as={FaBuilding} color='gray.500' />
										<Text fontSize='sm' color='gray.600'>
											{agency?.name}
										</Text>
									</HStack>

									{/* <Text fontSize='sm' color='gray.500'>
										Employee ID
									</Text>
									<Text fontWeight='bold' fontSize='lg'>
										{userId?.slice(-8).toUpperCase()}
									</Text> */}
								</VStack>
							</HStack>
						</Box>
					</Box>
				</VStack>

				{/* Key Metrics Grid */}
				<SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
					<StatCard
						title='Net Salary'
						value={`${payrollSummary?.currency} ${payrollSummary?.netSalary?.toLocaleString()}`}
						subtitle='After all deductions'
						icon={FiDollarSign}
						color='green'
					/>
					<StatCard
						title='Gross Salary'
						value={`${payrollSummary?.currency} ${payrollSummary?.grossSalary?.toLocaleString()}`}
						subtitle='Before deductions'
						icon={FiTrendingUp}
						color='blue'
					/>
					<StatCard
						title='Commission Earned'
						value={`${payrollSummary?.currency} ${payrollSummary?.commissionEarned?.toLocaleString()}`}
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

				<Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
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
										<HStack w='100%' justify='space-between'>
											<Box color='gray.600'>Attendance</Box>
											<Box fontWeight='semibold'>
												{payrollSummary?.currency}{' '}
												{payrollSummary?.attendanceEarnedSalary?.toLocaleString()}
											</Box>
										</HStack>
										<HStack w='100%' justify='space-between'>
											<Text color='gray.600'>Commission</Text>
											<Text fontWeight='semibold' color='green.500'>
												+ {payrollSummary?.currency}{' '}
												{payrollSummary?.commissionEarned?.toLocaleString()}
											</Text>
										</HStack>
										<HStack w='100%' justify='space-between'>
											<Text color='gray.600'>Incentive</Text>
											<Text fontWeight='semibold' color='green.500'>
												+ {payrollSummary?.currency}{' '}
												{payrollSummary?.incentiveEarned?.toLocaleString()}
											</Text>
										</HStack>
									</VStack>
									<Divider />
									<HStack w='100%' justify='space-between' fontWeight='bold'>
										<Text>Total Earnings</Text>
										<Text color='green.600'>
											{payrollSummary?.currency}{' '}
											{payrollSummary?.totalEarnings?.toLocaleString()}
										</Text>
									</HStack>
								</VStack>

								<VStack align='stretch' spacing={4}>
									<Text fontWeight='bold' color='red.600' fontSize='lg'>
										Deductions
									</Text>
									<VStack spacing={3}>
										<HStack w='100%' justify='space-between'>
											<Text color='gray.600'>Loan Installment</Text>
											<Text fontWeight='semibold' color='red.500'>
												- {payrollSummary?.currency}{' '}
												{payrollSummary?.loanDeduction?.toLocaleString()}
											</Text>
										</HStack>
										<HStack w='100%' justify='space-between'>
											<Text color='gray.600'>Attendance</Text>
											<Text fontWeight='semibold' color='red.500'>
												- {payrollSummary?.currency}{' '}
												{payrollSummary?.attendanceDeduction?.toLocaleString()}
											</Text>
										</HStack>
									</VStack>
									<Divider />
									<HStack w='100%' justify='space-between' fontWeight='bold'>
										<Text>Total Deductions</Text>
										<Text color='red.600'>
											{payrollSummary?.currency}{' '}
											{payrollSummary?.totalDeductions?.toLocaleString()}
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
											{payrollSummary?.currency}{' '}
											{payrollSummary?.netSalary?.toLocaleString()}
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
							<SimpleGrid columns={2} spacing={4}>
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
							</SimpleGrid>
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
											{payrollSummary?.currency}{' '}
											{loanSummary?.totalBorrowedAmount?.toLocaleString()}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Amount Paid</Text>
										<Text fontWeight='semibold' color='green.600'>
											{payrollSummary?.currency}{' '}
											{loanSummary?.totalPaidAmount?.toLocaleString()}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Remaining</Text>
										<Text fontWeight='semibold' color='red.600'>
											{payrollSummary?.currency}{' '}
											{loanSummary?.totalRemainingAmount?.toLocaleString()}
										</Text>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Monthly Installment</Text>
										<Text fontWeight='semibold'>
											{payrollSummary?.currency}{' '}
											{loanSummary?.monthlyInstallment?.toLocaleString()}
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
										<Text color='gray.600'>Deal Value</Text>
										<Text fontWeight='semibold'>
											{closeDeals?.currency}{' '}
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
												payslip?.status === 'paid'
													? 'green'
													: payslip?.status === 'pending'
														? 'orange'
														: 'gray'
											}
										>
											{payslip?.status?.toUpperCase() || 'N/A'}
										</Badge>
									</HStack>
									<HStack justify='space-between'>
										<Text color='gray.600'>Payslip Version</Text>
										<Text fontWeight='semibold'>v{payslip?.version || 1}</Text>
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
		</Box>
	);
};

// Skeleton Loader Component
const PayrollSkeleton = () => (
	<Box bg='gray.50' minH='100vh' py={8}>
		<Container maxW='container.xl'>
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
				<Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
					<VStack spacing={6}>
						<Skeleton height='300px' borderRadius='lg' />
						<Skeleton height='250px' borderRadius='lg' />
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
