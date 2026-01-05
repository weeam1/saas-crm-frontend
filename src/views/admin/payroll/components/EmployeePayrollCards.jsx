import {
	Box,
	Flex,
	Icon,
	Button,
	Text,
	Center,
	SimpleGrid,
	Stack,
	Badge,
	useDisclosure,
	Skeleton,
	SkeletonText,
	Divider,
	Avatar,
	Tooltip,
	HStack,
	Progress,
} from '@chakra-ui/react';
import { constant } from 'constant';
import { FiEye, FiPrinter } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import { useEffect, useState, useCallback } from 'react';
import { formatCurrency } from 'utils/helpers';
import PayslipDownloadModal from './PayslipDownloadModal';
import { useNavigate } from 'react-router-dom';

const EmployeePayrollCards = ({
	data = [],
	isLoading,
	month,
	year,
	refetchPayslips,
}) => {
	const monthName = new Date(year, month - 1).toLocaleString('en-US', {
		month: 'long',
	});
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	const [selectedEmployeeForModal, setSelectedEmployeeForModal] =
		useState(null);

	useEffect(() => {
		let timer;
		if (isLoading) setDelayedLoading(true);
		else timer = setTimeout(() => setDelayedLoading(false), 600);
		return () => clearTimeout(timer);
	}, [isLoading]);

	const handlePayslipGenerate = useCallback(
		(employee) => {
			setSelectedEmployeeForModal(employee);
			onOpen();
		},
		[onOpen]
	);

	return (
		<>
			<Box my={4}>
				{delayedLoading ? (
					<SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={2}>
						{Array.from({ length: 10 }).map((_, i) => (
							<Box
								minH='240px'
								key={i}
								bg='white'
								p={6}
								rounded='2xl'
								boxShadow='md'
							>
								<Skeleton height='60px' mb={4} />
								<SkeletonText noOfLines={5} spacing={3} />
							</Box>
						))}
					</SimpleGrid>
				) : data.length === 0 ? (
					<Center py={10}>
						<NoData label='payroll records' />
					</Center>
				) : (
					<SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={2}>
						{data.map((row, index) => {
							const imgSrc = row?.profileImage
								? `${constant.baseUrl}${row.profileImage}`
								: undefined;
							return (
								<Box
									key={row._id || index}
									rounded='2xl'
									border='1px solid'
									borderColor='gray.200'
									position='relative'
									transition='all .2s'
									_hover={{
										transform: 'translateY(-4px)',
										boxShadow: 'lg',
									}}
								>
									{/* Header */}
									<Box p={2}>
										<Flex justify='space-between' align='center' mb={4}>
											<Flex align='center' gap={3}>
												<Avatar
													size='md'
													src={imgSrc}
													name={row?.fullName}
													borderWidth='3px'
												/>

												<Box>
													<Tooltip
														label={row?.fullName}
														placement='top'
														hasArrow
													>
														<Flex align='center' justify='space-between'>
															<Text
																fontWeight='bold'
																isTruncated
																fontSize={{
																	base: '10px',
																	sm: '11px',
																	md: '12px',
																	lg: '13px',
																	xl: '14px',
																}}
																maxW={{
																	base: '110px',
																	sm: '150px',
																	lg: '80px',
																	xl: '100px',

																	'2xl': '200px',
																	//   "2lg": "80px",
																}}
															>
																{row?.fullName}
															</Text>

															<Badge
																position='absolute'
																top='10px'
																right='10px'
																px={2}
																py={0.5}
																rounded='full'
																fontSize='xs'
																colorScheme={
																	row?.payslip?.status === 'paid'
																		? 'green'
																		: 'orange'
																}
																textTransform='uppercase'
																flexShrink={0}
															>
																{row?.payslip?.status === 'paid'
																	? 'Paid'
																	: 'Unpaid'}
															</Badge>
														</Flex>
													</Tooltip>

													<Text fontSize='10px' color='gray.500'>
														{row.roles?.[0]?.roleName}
													</Text>
													<Text
														fontSize='10px'
														color='gray.500'
														fontWeight={'bold'}
													>
														{row.agency.name || 'No Agency'}
													</Text>
												</Box>
											</Flex>
										</Flex>

										{/* Payroll Period */}
										<Box>
											<HStack justify='space-between' mb={2}>
												<Text
													fontWeight='medium'
													fontSize={'12px'}
													color='gray.600'
												>
													Performance Score
												</Text>
												<Text
													fontWeight='bold'
													fontSize={'12px'}
													color={
														row?.evaluation?.finalPercentage > 70
															? 'green.500'
															: row?.evaluation?.finalPercentage >= 50
																? 'yellow.500'
																: 'red.500'
													}
												>
													{row?.evaluation?.finalPercentage || 0}%
												</Text>
											</HStack>
											<Progress
												value={row?.evaluation?.finalPercentage || 0}
												colorScheme={
													row?.evaluation?.finalPercentage > 70
														? 'green'
														: row?.evaluation?.finalPercentage >= 50
															? 'yellow'
															: 'red'
												}
												size='xs'
												w='100%'
												borderRadius='full'
											/>
										</Box>

										<Divider mb={3} />

										{/* Salary Info */}
										<Stack spacing={2} fontSize='sm'>
											<Flex justify='space-between'>
												<Text color='gray.600' fontSize={'12px'}>
													Basic
												</Text>
												<Text
													fontWeight='semibold'
													color='green.500'
													fontSize={'12px'}
												>
													{row.payrollSummary?.basicSalary || 0}
												</Text>
											</Flex>

											<Flex justify='space-between'>
												<Text color='gray.600' fontSize={'12px'}>
													Deductions
												</Text>
												<Text
													fontWeight='semibold'
													color='red.500'
													fontSize={'12px'}
												>
													-{row.payrollSummary?.totalDeductions || 0}
												</Text>
											</Flex>
										</Stack>

										<Divider my={2} />

										{/* Net Salary */}
										<Flex justify='space-between'>
											<Text fontWeight='bold' fontSize={'12px'}>
												Net Salary
											</Text>
											<Text
												fontSize={'12px'}
												fontWeight='bold'
												color='black.500'
											>
												{formatCurrency(row.payrollSummary?.netSalary || 0)}
											</Text>
										</Flex>
										<Divider mt={2} color={'blackAlpha.900'} />
									</Box>
									<Flex
										roundedBottom='2xl'
										p={2}
										justify='space-between'
										align='center'
										bg='gray.100'
									>
										<Button
											variant='ghost'
											bgColor='purple.200'
											bgOpacity={0.6}
											leftIcon={<FiEye />}
											size='xs'
											_hover={{ bg: 'purple.300' }}
											onClick={() =>
												navigate(
													`/payroll/payslip/${row._id}?month=${month}&year=${year}`
												)
											}
										>
											Details
										</Button>

										<Button
											size='xs'
											bgOpacity={0.6}
											leftIcon={<FiPrinter />}
											bg='green.200'
											_hover={{ bg: 'green.300' }}
											onClick={() => handlePayslipGenerate(row)}
										>
											Generate
										</Button>
									</Flex>
								</Box>
							);
						})}
					</SimpleGrid>
				)}
			</Box>

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

export default EmployeePayrollCards;
