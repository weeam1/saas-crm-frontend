import React, { useRef } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Divider,
	Image,
	Button,
	Grid,
	GridItem,
	useColorModeValue,
} from '@chakra-ui/react';
// import { useReactToPrint } from 'react-to-print';
import BrandLogo from 'assets/logo/logo.png';
import { useParams } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import useUserSession from 'hooks/useUserSession';

const Payslip = () => {
	const componentRef = useRef();
	const { userId } = useParams();
const {agencyName,agencyLogo}=useUserSession()
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

	// Color scheme
	const primaryColor = '#E5B668';
	const secondaryColor = '#ED8936';
	const lightBg = '#F7FAFC';
	const borderColor = '#E2E8F0';

	// Sample data - replace with actual props
	const data = payrollData?.doc || {};

	return (
		<Box bg='white' minH='100vh' rounded='md' shadow='sm'>
			{payrollLoading ? (
				<Loader />
			) : (
				<Box p={{ base: 4, md: 8 }}>
					{/* Payslip Container */}
					<Box
						ref={componentRef}
						px='4'
						borderRadius='12px'
						boxShadow='xl'
						overflow='hidden'
						fontFamily='Arial, sans-serif'
					>
						{/* Header Section */}
						<Box bg={primaryColor} color='white' p={8}>
							<Grid
								templateColumns={{ base: '1fr', md: '200px 1fr' }}
								gap={6}
								alignItems='center'
							>
								{/* Logo */}
								<Box
									bg='white'
									borderRadius='8px'
									p={4}
									display='flex'
									alignItems='center'
									justifyContent='center'
									h='120px'
								>
									<Image
										src={agencyLogo}
										alt='Company Logo'
										objectFit='contain'
										maxH='80px'
									/>
								</Box>

								{/* Company & Title */}
								<VStack spacing={3} align='center' textAlign='center'>
									<Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight='bold'>
										{agencyName} - {data?.agency?.name}
									</Text>
									<Text fontSize='lg' opacity={0.9}>
										Official Salary Statement
									</Text>
									{/* <Box bg={secondaryColor} px={4} py={2} borderRadius='md'>
										<Text fontSize='md' fontWeight='bold'>
											Employee: <strong>{data.fullName}</strong>
										</Text>
									</Box> */}
								</VStack>
							</Grid>
						</Box>

						{/* Main Content */}
						<Box p={8}>
							<Grid templateColumns={{ base: '1fr', lg: '1fr' }} gap={8}>
								{/* Left Column - Details & Tables */}
								<VStack spacing={6} align='stretch'>
									{/* Employee Information */}
									<Box
										bg={lightBg}
										p={6}
										borderRadius='lg'
										border='1px solid'
										borderColor={borderColor}
									>
										<Text
											fontSize='xl'
											fontWeight='bold'
											mb={4}
											color={primaryColor}
										>
											Employee Information
										</Text>
										<Grid
											templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
											gap={4}
										>
											<VStack align='stretch' spacing={3}>
												<HStack justify='space-between'>
													<Text fontWeight='bold'>Email:</Text>
													<Text>{data?.username || 'N/A'}</Text>
												</HStack>
												<HStack justify='space-between'>
													<Text fontWeight='bold'>Position:</Text>
													<Text>{data.roles?.[0]?.roleName || 'Employee'}</Text>
												</HStack>
											</VStack>
											<VStack align='stretch' spacing={3}>
												<HStack justify='space-between'>
													<Text fontWeight='bold'>Pay Date:</Text>
													<Text>{new Date().toLocaleDateString()}</Text>
												</HStack>
												<HStack justify='space-between'>
													<Text fontWeight='bold'>Pay Period:</Text>
													<Text>Nov 1, 2025 - Nov 30, 2025</Text>
												</HStack>
											</VStack>
										</Grid>
									</Box>

									{/* Earnings Section */}
									<Box>
										<Text
											fontSize='xl'
											fontWeight='bold'
											mb={4}
											color={primaryColor}
										>
											Earnings
										</Text>
										<Table variant='simple' size='md'>
											<Thead bg={lightBg}>
												<Tr>
													<Th fontWeight='bold' color={primaryColor}>
														DESCRIPTION
													</Th>
													<Th
														textAlign='right'
														fontWeight='bold'
														color={primaryColor}
													>
														AMOUNT ({data.agency?.currency || 'PKR'})
													</Th>
												</Tr>
											</Thead>
											<Tbody>
												<Tr _hover={{ bg: 'gray.50' }}>
													<Td fontWeight='medium'>Basic Salary</Td>
													<Td textAlign='right'>
														{data.payrollSummary?.basicSalary?.toLocaleString() ||
															'0'}
													</Td>
												</Tr>
												<Tr _hover={{ bg: 'gray.50' }}>
													<Td fontWeight='medium'>Commission Earned</Td>
													<Td textAlign='right'>
														{data.payrollSummary?.commissionEarned?.toLocaleString() ||
															'0'}
													</Td>
												</Tr>
												<Tr _hover={{ bg: 'gray.50' }}>
													<Td fontWeight='medium'>Incentive Earned</Td>
													<Td textAlign='right'>
														{data.payrollSummary?.incentiveEarned?.toLocaleString() ||
															'0'}
													</Td>
												</Tr>
												<Tr bg={lightBg} fontWeight='bold'>
													<Td>TOTAL EARNINGS</Td>
													<Td textAlign='right' color={primaryColor}>
														{data.payrollSummary?.totalEarnings?.toLocaleString() ||
															'0'}
													</Td>
												</Tr>
											</Tbody>
										</Table>
									</Box>

									{/* Deductions Section */}
									<Box>
										<Text
											fontSize='xl'
											fontWeight='bold'
											mb={4}
											color={primaryColor}
										>
											Deductions
										</Text>
										<Table variant='simple' size='md'>
											<Thead bg={lightBg}>
												<Tr>
													<Th fontWeight='bold' color={primaryColor}>
														DESCRIPTION
													</Th>
													<Th
														textAlign='right'
														fontWeight='bold'
														color={primaryColor}
													>
														AMOUNT ({data.agency?.currency || 'PKR'})
													</Th>
												</Tr>
											</Thead>
											<Tbody>
												<Tr _hover={{ bg: 'gray.50' }}>
													<Td fontWeight='medium'>Loan Deduction</Td>
													<Td textAlign='right' color='red.500'>
														-
														{data.payrollSummary?.loanDeduction?.toLocaleString() ||
															'0'}
													</Td>
												</Tr>
												<Tr _hover={{ bg: 'gray.50' }}>
													<Td fontWeight='medium'>Attendance Deduction</Td>
													<Td textAlign='right' color='red.500'>
														-
														{data.payrollSummary?.attendanceDeduction?.toLocaleString() ||
															'0'}
													</Td>
												</Tr>
												<Tr bg={lightBg} fontWeight='bold'>
													<Td>TOTAL DEDUCTIONS</Td>
													<Td textAlign='right' color='red.500'>
														-
														{data.payrollSummary?.totalDeductions?.toLocaleString() ||
															'0'}
													</Td>
												</Tr>
											</Tbody>
										</Table>
									</Box>
								</VStack>
							</Grid>
						</Box>

						{/*  Summary */}
						<Box>
							<Box
								// bg={lightBg}
								// color='black'
								p={6}
								// borderRadius='lg'
								// boxShadow='lg'
							>
								<Text fontSize='xl' fontWeight='bold' mb={4} textAlign='center'>
									Salary Summary
								</Text>

								<VStack spacing={4} align='stretch'>
									<HStack justify='space-between'>
										<Text>Total Earnings:</Text>
										<Text fontWeight='bold'>
											{data.payrollSummary?.totalEarnings?.toLocaleString() ||
												'0'}
										</Text>
									</HStack>

									<HStack justify='space-between'>
										<Text>Total Deductions:</Text>
										<Text fontWeight='bold'>
											-
											{data.payrollSummary?.totalDeductions?.toLocaleString() ||
												'0'}
										</Text>
									</HStack>

									<Divider borderColor='whiteAlpha.400' />

									<HStack justify='space-between' fontSize='lg'>
										<Text fontWeight='bold'>Net Salary:</Text>
										<Text
											fontWeight='bold'
											fontSize='xl'
											color={
												data.payrollSummary?.isNegativeSalary
													? 'red.200'
													: 'gray.700'
											}
										>
											{data.payrollSummary?.netSalary?.toLocaleString() || '0'}{' '}
											{data.agency?.currency || 'AED'}
										</Text>
									</HStack>

									{/* Attendance Summary */}
									<Box
										mt={4}
										pt={4}
										borderTop='1px solid'
										borderColor='whiteAlpha.300'
									>
										<Text fontWeight='bold' mb={2}>
											Attendance Summary
										</Text>
										<VStack spacing={2} align='stretch' fontSize='sm'>
											<HStack justify='space-between'>
												<Text>Present Days:</Text>
												<Text>{data.attendanceSummary?.totalPresent || 0}</Text>
											</HStack>
											<HStack justify='space-between'>
												<Text>Absent Days:</Text>
												<Text>{data.attendanceSummary?.totalAbsent || 0}</Text>
											</HStack>
											<HStack justify='space-between'>
												<Text>Leave Days:</Text>
												<Text>{data.attendanceSummary?.totalLeave || 0}</Text>
											</HStack>
										</VStack>
									</Box>
								</VStack>
							</Box>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default Payslip;
