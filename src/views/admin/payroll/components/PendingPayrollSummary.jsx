import { useState, useEffect } from 'react';
import {
	Box,
	VStack,
	HStack,
	Text,
	Heading,
	Checkbox,
	Button,
	Flex,
	Icon,
	Badge,
	SimpleGrid,
	Alert,
	AlertIcon,
	IconButton,
	Input,
	Grid,
	Divider,
} from '@chakra-ui/react';
import {
	FaMoneyBillWave,
	FaCalendarAlt,
	FaCheckCircle,
	FaExclamationTriangle,
	FaFileInvoiceDollar,
	FaCoins,
	FaHandHoldingUsd,
} from 'react-icons/fa';
import { formatCurrency } from 'utils/helpers';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUpdateItemMutation } from 'api/apiSlice';
import { FiChevronLeft, FiSkipForward } from 'react-icons/fi';

const buildIntentPayload = (allItems, selectedIds) => {
	if (allItems?.length === 0) return [];
	return allItems?.map((item) => ({
		id: item._id,
		status: selectedIds.includes(item._id) ? 1 : 0, // 1 = ADD/APPLY, 0 = REMOVE/UNAPPLY
	}));
};

const sanitizeMoney = (v) => {
	// digits + one dot
	v = v.replace(/[^0-9.]/g, '');
	const parts = v.split('.');
	if (parts.length > 2) {
		v = parts.shift() + '.' + parts.join('');
	}
	return v;
};

const PendingPayrollSummary = ({ payroll, showSkip, onSkip }) => {
	const [selectedDeductions, setSelectedDeductions] = useState([]);
	const [selectedCommissions, setSelectedCommissions] = useState([]);
	const [manualCommission, setManualCommission] = useState('');

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const now = new Date();
	const defaultMonth = String(now.getMonth() + 1).padStart(2, '0');
	const defaultYear = String(now.getFullYear());

	const month = Number(searchParams.get('month') || defaultMonth);
	const year = Number(searchParams.get('year') || defaultYear);

	const [updatePayroll, { isLoading }] = useUpdateItemMutation();

	// Initialize with sample data if not provided
	const data = payroll?.pendingPayrollSummary || null;
	const isLoan = payroll?.loanSummary?.activeLoans;
	const loanSummary = payroll?.loanSummary;

	useEffect(() => {
		if (!data) return;

		const normalize = (v) => (Array.isArray(v) ? v : v ? [v] : []);

		setSelectedDeductions(
			normalize(data.deductions.doc)
				.filter((d) => d.status === 'APPLIED')
				.map((d) => d._id),
		);

		setSelectedCommissions(
			normalize(data.commissions.doc)
				.filter((c) => c.status === 'APPLIED')
				.map((c) => c._id),
		);

		const commission = payroll?.payrollSummary?.adjustments?.commission;

		if (commission > 0) setManualCommission(commission);
	}, [data]);

	if (!payroll?.pendingPayrollSummary) {
		return <Box>Payroll pending summary is not found</Box>;
	}

	const handleDeductionSelect = (deductionId, isSelected) => {
		if (isSelected) {
			setSelectedDeductions((prev) => [...prev, deductionId]);
		} else {
			setSelectedDeductions((prev) => prev.filter((id) => id !== deductionId));
		}
	};

	const handleCommissionSelect = (commissionId, isSelected) => {
		if (isSelected) {
			setSelectedCommissions((prev) => [...prev, commissionId]);
		} else {
			setSelectedCommissions((prev) =>
				prev.filter((id) => id !== commissionId),
			);
		}
	};

	console.log({ selectedCommissions, selectedDeductions });

	// const handleSelectAll = (allItems, setter, isSelected) => {
	// 	if (isSelected) {
	// 		setter(allItems.map((item) => item._id));
	// 	} else {
	// 		setter([]);
	// 	}
	// };

	const handleSelectAllDeductions = (isSelected) => {
		if (isSelected) {
			setSelectedDeductions(data?.deductions.doc.map((d) => d._id));
		} else {
			setSelectedDeductions([]);
		}
	};

	const handleSelectAllCommissions = (isSelected) => {
		if (isSelected) {
			setSelectedCommissions(data?.commissions.doc.map((c) => c._id));
		} else {
			setSelectedCommissions([]);
		}
	};

	const handleApplyToPayroll = async () => {
		try {
			const commissionsPayload = buildIntentPayload(
				data.commissions.doc,
				selectedCommissions,
			);
			const deductionsPayload = buildIntentPayload(
				data.deductions.doc,
				selectedDeductions,
			);

			const payload = {
				commissions: commissionsPayload,
				deductions: deductionsPayload,
				commissionAmount: Number(manualCommission),
				month,
				year,
				status: 1, // Applied
			};

			// const payload = {
			// 	deductions: selectedDeductions,
			// 	commissions: selectedCommissions,
			// 	commissionAmount: manualCommission,
			// 	month,
			// 	year,
			// };

			await updatePayroll({
				path: `/payroll/commission-users/pending/${payroll?._id}`,
				body: payload,
			}).unwrap();

			// Show success message
			toast.success('Payroll update Successfully');
			onSkip();
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to update the payroll');
		}
	};

	const formatMonthYear = (month, year) => {
		const date = new Date(year, month - 1);
		return date.toLocaleString('default', { month: 'long', year: 'numeric' });
	};

	const totalSelectedDeductions = data.deductions.doc
		.filter((d) => selectedDeductions.includes(d._id))
		.reduce((sum, d) => sum + d.deductionAmount, 0);

	const totalSelectedCommissions = data.commissions.doc
		.filter((c) => selectedCommissions.includes(c._id))
		.reduce((sum, c) => sum + c.totalAmount, 0);

	const totalDeductions =
		totalSelectedDeductions + loanSummary?.monthlyInstallment || 0;

	const totalCommission = totalSelectedCommissions + Number(manualCommission);

	const netSalary = totalCommission - totalDeductions;

	const isBlocked = netSalary <= 0;

	return (
		<Box p={{ base: 4, md: 6, lg: 8 }} bg='white' rounded='lg' shadow='sm'>
			<HStack spacing='2' align='center' justify='space-between' mb='4'>
				<IconButton
					aria-label='Go back'
					icon={<FiChevronLeft />}
					onClick={() => navigate(-1)}
					size='md'
					isRound
				/>

				{showSkip && (
					<Button
						size='sm'
						variant='outline'
						colorScheme='gray'
						leftIcon={<FiSkipForward />}
						onClick={onSkip}
					>
						Go to payslip
					</Button>
				)}
			</HStack>

			{/* Header */}
			<VStack spacing={6} align='stretch'>
				<Flex justify='space-between' align='center'>
					<VStack align='start' spacing={2}>
						<Heading
							fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
							color='gray.800'
						>
							<Icon as={FaFileInvoiceDollar} mr={3} color='blue.500' />
							Pending Payroll Summary
						</Heading>
						<Text color='gray.600' fontSize={{ base: 'xs', md: 'sm' }}>
							Review and apply pending deductions and commissions to payroll
						</Text>
					</VStack>
					{/* <Badge
						colorScheme={data.isPending ? 'orange' : 'green'}
						fontSize={{ base: 'sm', md: 'md' }}
						p={2}
						borderRadius='full'
					>
						<Icon
							as={data.isPending ? FaExclamationTriangle : FaCheckCircle}
							mr={2}
						/>
						{data.isPending ? 'Pending Review' : 'Processed'}
					</Badge> */}
				</Flex>
				<SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
					{/* Deductions Box */}
					<Box
						p={2}
						borderLeft='4px'
						borderColor='red.400'
						shadow='md'
						_hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
						transition='all 0.3s'
					>
						<Box p={2} bg='red.50' borderBottom='1px' borderColor='gray.200'>
							<Flex justify='space-between' align='center'>
								<HStack>
									<Icon as={FaMoneyBillWave} color='red.500' boxSize={6} />
									<VStack align='start' spacing={0}>
										<Heading size='md' color='gray.800'>
											Deductions
										</Heading>
										<Text fontSize='sm' color='gray.600'>
											{data.deductions.count} items
										</Text>
									</VStack>
								</HStack>
							</Flex>
							<Checkbox
								mt={3}
								colorScheme='red'
								isChecked={
									selectedDeductions.length &&
									selectedDeductions.length === data.deductions.doc.length
								}
								isIndeterminate={
									selectedDeductions.length > 0 &&
									selectedDeductions.length < data.deductions.doc.length
								}
								onChange={(e) => handleSelectAllDeductions(e.target.checked)}
							>
								Select All Deductions ({selectedDeductions.length} selected)
							</Checkbox>
						</Box>

						<Box p={2}>
							<VStack spacing={4} align='stretch'>
								{data.deductions.doc.map((deduction) => {
									const isSelected = selectedDeductions.includes(deduction._id);

									return (
										<Box
											key={deduction._id}
											p={3}
											border='1px solid'
											borderColor={isSelected ? 'red.300' : 'gray.200'}
											bg={isSelected ? 'red.50' : 'white'}
											borderRadius='md'
											shadow='sm'
											cursor='pointer'
											transition='all 0.2s'
											_hover={{
												borderColor: 'red.300',
												transform: 'translateY(-1px)',
												shadow: 'md',
											}}
											onClick={() =>
												handleDeductionSelect(deduction._id, !isSelected)
											}
										>
											<Flex justify='space-between' align='center'>
												<HStack spacing={4}>
													{/* Checkbox = indicator only */}
													<Checkbox
														colorScheme='red'
														isChecked={isSelected}
														pointerEvents='none'
													/>

													<HStack spacing={2}>
														<Icon
															as={FaCalendarAlt}
															fontSize={{ base: 'xs', md: 'sm' }}
															color='gray.500'
														/>
														<Text
															fontWeight='semibold'
															fontSize={{ base: 'xs', md: 'sm' }}
														>
															{formatMonthYear(deduction.month, deduction.year)}
														</Text>
													</HStack>
												</HStack>

												<VStack align='end' spacing={1}>
													<Text
														fontSize={{ base: 'sm', md: 'md' }}
														fontWeight='bold'
														color='red.600'
													>
														−
														{formatCurrency(
															deduction.deductionAmount,
															deduction.currency,
														)}
													</Text>
													<Badge
														colorScheme={
															deduction.status === 'PENDING'
																? 'orange'
																: 'green'
														}
														size='xs'
													>
														{deduction.status}
													</Badge>
												</VStack>
											</Flex>
										</Box>
									);
								})}
							</VStack>
						</Box>
					</Box>

					{/* Commissions Box */}
					<Box
						p={2}
						borderLeft='4px'
						borderColor='green.400'
						shadow='lg'
						_hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
						transition='all 0.3s'
					>
						<Box p={2} bg='green.50' borderBottom='1px' borderColor='gray.200'>
							<Flex justify='space-between' align='center'>
								<HStack>
									<Icon as={FaCoins} color='green.500' boxSize={6} />
									<VStack align='start' spacing={0}>
										<Heading size='md' color='gray.800'>
											Commissions
										</Heading>
										<Text fontSize='sm' color='gray.600'>
											{data.commissions.count} items
										</Text>
									</VStack>
								</HStack>
								{/* <Badge colorScheme='green' fontSize='md' p={2}>
									Total: {formatCurrency(data.commissions.totalDealAmount)}
								</Badge> */}
							</Flex>
							<Checkbox
								mt={3}
								colorScheme='green'
								isChecked={
									selectedCommissions?.length &&
									selectedCommissions.length === data.commissions.doc.length
								}
								isIndeterminate={
									selectedCommissions.length > 0 &&
									selectedCommissions.length < data.commissions.doc.length
								}
								onChange={(e) => handleSelectAllCommissions(e.target.checked)}
							>
								Select All Commissions ({selectedCommissions.length} selected)
							</Checkbox>
						</Box>

						<Box p={2}>
							<VStack spacing={4} align='stretch'>
								{data.commissions.doc.map((commission) => {
									const isSelected = selectedCommissions.includes(
										commission._id,
									);

									return (
										<Box
											key={commission._id}
											p={4}
											borderWidth='1px'
											borderRadius='lg'
											cursor='pointer'
											transition='all 0.15s ease'
											borderColor={isSelected ? 'green.400' : 'gray.200'}
											bg={isSelected ? 'green.50' : 'white'}
											_hover={{ borderColor: 'green.300', shadow: 'md' }}
											onClick={() =>
												handleCommissionSelect(commission._id, !isSelected)
											}
										>
											<Flex align='center' justify='space-between'>
												<HStack align='center' spacing={3}>
													{/* <Checkbox
														colorScheme='green'
														isChecked={isSelected}
														onChange={(e) => {
															e.stopPropagation();
															handleCommissionSelect(
																commission._id,
																e.target.checked
															);
														}}
													/> */}

													{/* Checkbox = indicator only */}
													<Checkbox
														colorScheme='green'
														isChecked={isSelected}
														pointerEvents='none'
													/>

													<VStack align='start' spacing={1}>
														<HStack spacing={2}>
															<Icon as={FaCalendarAlt} color='gray.500' />
															<Text
																fontWeight='semibold'
																fontSize={{ base: 'xs', md: 'sm' }}
															>
																{formatMonthYear(
																	commission.month,
																	commission.year,
																)}
															</Text>
														</HStack>

														<Text
															color='gray.600'
															fontSize={{ base: 'xs', md: 'sm' }}
														>
															Deal: {formatCurrency(commission.dealAmount)}
														</Text>

														{commission.shareDealAmount > 0 && (
															<Text
																color='gray.600'
																fontSize={{ base: 'xs', md: 'sm' }}
															>
																Shared:{' '}
																{formatCurrency(commission.shareDealAmount)}
															</Text>
														)}
													</VStack>
												</HStack>

												<VStack align='end' spacing={1}>
													<Text
														fontSize={{ base: 'sm', md: 'md' }}
														fontWeight='bold'
														color='green.600'
													>
														+
														{formatCurrency(
															commission.totalAmount,
															commission.currency,
														)}
													</Text>

													<Badge
														colorScheme={
															commission.status === 'PENDING'
																? 'orange'
																: 'green'
														}
														size='xs'
													>
														{commission.status}
													</Badge>
												</VStack>
											</Flex>
										</Box>
									);
								})}
							</VStack>
						</Box>
					</Box>
				</SimpleGrid>
				{/* Loan  */}
				{isLoan && (
					<Box
						bg='white'
						borderRadius='2xl'
						p={6}
						border='1px solid'
						borderColor='gray.100'
						shadow='md'
					>
						{/* Header */}
						<Flex justify='space-between' align='center' mb={6}>
							<Text fontSize='lg' fontWeight='600'>
								Loan Summary
							</Text>

							<Badge
								px={3}
								py={1}
								borderRadius='full'
								fontSize='xs'
								colorScheme={loanSummary?.activeLoans > 0 ? 'orange' : 'green'}
							>
								{loanSummary?.activeLoans > 0 ? 'Active' : 'Cleared'}
							</Badge>
						</Flex>

						{/* Metrics */}
						<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
							<Box>
								<Text fontSize='sm' color='gray.500'>
									Active Loans
								</Text>
								<Text fontSize='2xl' fontWeight='600'>
									{loanSummary?.activeLoans || 0}
								</Text>
							</Box>

							<Box>
								<Text fontSize='sm' color='gray.500'>
									Monthly Installment
								</Text>
								<Text fontSize='xl' fontWeight='600'>
									{formatCurrency(
										loanSummary?.monthlyInstallment,
										payroll?.agency?.currency,
									)}
								</Text>
							</Box>

							{/* <Box>
								<Text fontSize='sm' color='gray.500'>
									Total Borrowed
								</Text>
								<Text fontSize='lg' fontWeight='500'>
									{formatCurrency(
										loanSummary?.totalBorrowedAmount,
										payroll?.agency?.currency,
									)}
								</Text>
							</Box>

							<Box>
								<Text fontSize='sm' color='gray.500'>
									Remaining Amount
								</Text>
								<Text fontSize='lg' fontWeight='600' color='red.500'>
									{formatCurrency(
										loanSummary?.totalRemainingAmount,
										payroll?.agency?.currency,
									)}
								</Text>
							</Box> */}
						</SimpleGrid>
					</Box>
				)}
				{/* Manual Commission Input Section */}
				<Box
					mt={6}
					p={6}
					bg={'gray.50'}
					borderRadius='xl'
					border='1px'
					borderColor='gray.200'
					shadow='md'
				>
					<Heading
						size='md'
						mb={4}
						color='gray.700'
						display='flex'
						alignItems='center'
						gap={2}
					>
						Additional Commission
					</Heading>

					<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500' mb={4}>
						Add manual commission amount if not included in the list above
					</Text>

					<HStack
						flexDir={{ base: 'column', md: 'row' }}
						gap={4}
						alignItems='end'
					>
						<Box flex='1' alignSelf='stretch'>
							<Text fontSize='sm' fontWeight='medium' color='gray.700' mb={2}>
								Commission Amount
							</Text>
							<Input
								type='text'
								inputMode='decimal'
								placeholder='Enter commission amount'
								value={manualCommission}
								onChange={(e) =>
									setManualCommission(sanitizeMoney(e.target.value))
								}
								onBlur={() => {
									const n = parseFloat(manualCommission);
									if (!Number.isFinite(n) || n < 0) setManualCommission('');
								}}
								bg='white'
								size='md'
								fontSize={{ base: 'sm', md: 'md' }}
							/>

							{/* <NumberInput
								min={0}
								// step={1}
								value={manualCommission}
								// precision={2}
								onChange={(valueString) => setManualCommission(valueString)}
							>
								<NumberInputField
									placeholder='Enter commission amount'
									size='lg'
									fontSize='md'
									inputMode='decimal'
									onKeyDown={sanitizeDecimal}
									bg='white'
									_focus={{
										borderColor: 'green.400',
										boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
									}}
								/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput> */}
						</Box>
					</HStack>
				</Box>
				{/* BLOCKING WARNING */}
				{isBlocked && (
					<Alert status='error' borderRadius='lg'>
						<AlertIcon />
						<Box>
							<Text fontWeight='bold'>Payroll Blocked</Text>
							<Text fontSize='sm'>
								No commission found. Add a commission to continue payroll
								processing.
							</Text>
						</Box>
					</Alert>
				)}

				<Box
					bg='white'
					borderRadius='2xl'
					p={{ base: 4, md: 6 }}
					border='1px solid'
					borderColor='gray.100'
					boxShadow='md'
				>
					{/* Header */}
					<Text
						fontSize={{ base: 'md', md: 'lg' }}
						fontWeight='600'
						mb={{ base: 4, md: 5 }}
					>
						Salary Summary
					</Text>

					{/* Breakdown */}
					<SimpleGrid
						columns={{ base: 1, md: 2, lg: 3 }}
						spacing={{ base: 3, md: 4 }}
					>
						<Box>
							<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
								Total Commission
							</Text>
							<Text
								fontSize={{ base: 'md', md: 'lg' }}
								fontWeight='600'
								color='green.600'
							>
								{formatCurrency(totalCommission, payroll?.agency?.currency)}
							</Text>
						</Box>

						<Box>
							<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
								Total Deductions
							</Text>
							<Text
								fontSize={{ base: 'md', md: 'lg' }}
								fontWeight='600'
								color='red.500'
							>
								{formatCurrency(totalDeductions, payroll?.agency?.currency)}
							</Text>
						</Box>

						{isLoan && (
							<Box>
								<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.500'>
									Loan Deduction
								</Text>
								<Text
									fontSize={{ base: 'md', md: 'lg' }}
									fontWeight='500'
									color='orange.500'
								>
									{formatCurrency(
										loanSummary?.monthlyInstallment || 0,
										payroll?.agency?.currency,
									)}
								</Text>
							</Box>
						)}
					</SimpleGrid>

					{/* Divider */}
					<Divider my={{ base: 3, md: 4 }} />

					{/* Net Salary */}
					<Flex justify='space-between' align='center'>
						<Text fontSize={{ base: 'sm', md: 'md' }} fontWeight='600'>
							Net Salary
						</Text>

						<Text
							fontSize={{ base: 'lg', md: 'xl' }}
							fontWeight='700'
							color={netSalary >= 0 ? 'green.600' : 'red.600'}
						>
							{formatCurrency(netSalary, payroll?.agency?.currency)}
						</Text>
					</Flex>
				</Box>

				{/* Action Section */}
				<Box
					mt={6}
					p={6}
					bg={'white'}
					borderRadius='xl'
					border='1px'
					borderColor={isBlocked ? 'gray.200' : 'blue.200'}
					shadow='lg'
					position='relative'
					overflow='hidden'
					opacity={isBlocked ? 0.7 : 1}
					transition='all 0.3s'
					_before={{
						content: '""',
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '4px',
						bgGradient: isBlocked
							? 'linear(to-r, gray.300, gray.400)'
							: 'linear(to-r, blue.400, purple.400)',
					}}
				>
					<Flex
						justify='space-between'
						align={{ base: 'left', lg: 'center' }}
						flexDir={{ base: 'column', lg: 'row' }}
						// wrap={{ base: 'wrap', md: 'nowrap' }}
						gap={4}
					>
						<VStack align='start' spacing={2} flex={1}>
							<Text
								fontWeight='bold'
								color='gray.800'
								fontSize={{ base: 'sm', md: 'lg' }}
							>
								Ready to Apply to Payroll?
							</Text>
							<Box>
								<HStack spacing={3} flexWrap='wrap'>
									<Badge colorScheme='red' fontSize='xs' px={3} py={1}>
										{selectedDeductions.length} Deduction
										{selectedDeductions.length !== 1 ? 's' : ''}
									</Badge>
									<Badge colorScheme='green' fontSize='xs' px={3} py={1}>
										{selectedCommissions.length} Commission
										{selectedCommissions.length !== 1 ? 's' : ''}
									</Badge>
									{/* <Badge
										colorScheme={netTotal >= 0 ? 'green' : 'red'}
										fontSize='xs'
										px={3}
										py={1}
									>
										Net: {formatCurrency(netTotal)}
									</Badge> */}
								</HStack>
								<Text fontSize='sm' color='gray.600' mt={2}>
									Review all selected items before proceeding
								</Text>
							</Box>
						</VStack>

						<Button
							colorScheme='blue'
							size='lg'
							leftIcon={<Icon as={FaHandHoldingUsd} />}
							isDisabled={isBlocked}
							onClick={handleApplyToPayroll}
							px={8}
							py={6}
							fontSize='md'
							fontWeight='bold'
							borderRadius='lg'
							bgGradient={
								!isBlocked ? 'linear(to-r, blue.500, purple.500)' : 'gray.300'
							}
							_hover={
								!isBlocked
									? {
											bgGradient: 'linear(to-r, blue.600, purple.600)',
											transform: 'translateY(-2px)',
											shadow: 'xl',
										}
									: {}
							}
							transition='all 0.3s'
							isLoading={isLoading}
							shadow='md'
						>
							Apply to Payroll
						</Button>
					</Flex>

					<Alert
						status={isBlocked ? 'warning' : 'info'}
						borderRadius='md'
						mt={4}
						fontSize={{ base: 'sm', md: 'md' }}
						variant='subtle'
					>
						<AlertIcon />
						<Box>
							<Text fontWeight='bold' mb={1}>
								{isBlocked ? 'Action Required' : 'Important Information'}
							</Text>
							<Text fontSize={{ base: 'xs', md: 'sm' }}>
								{isBlocked
									? 'You must select at least one commission or add a manual commission amount before applying to payroll.'
									: 'Clicking "Apply to Payroll" will create payroll entries, update status to APPLIED, and generate payroll records for processing.'}
							</Text>
						</Box>
					</Alert>
				</Box>
				{/* MANUAL COMMISSION */}
				{/* <Box p={4} borderWidth='1px' borderRadius='xl' bg='white'>
					<VStack align='start' spacing={3}>
						<Text fontWeight='bold'>Manual Commission</Text>
						<Text fontSize='sm' color='gray.500'>
							Use only if no deals were confirmed for this period.
						</Text>

						<HStack w='full'>
							<Input
								type='number'
								placeholder='Enter commission amount'
								value={manualCommission}
								onChange={(e) => setManualCommission(Number(e.target.value))}
							/>
							<Button
								colorScheme='green'
								onClick={handleManualAdd}
								isDisabled={manualCommission <= 0}
							>
								Add
							</Button>
						</HStack>

						<Alert status='info' fontSize='sm' borderRadius='md'>
							<AlertIcon />
							<Text>
								Manual commissions are logged separately for audit and approval.
							</Text>
						</Alert>
					</VStack>
				</Box> */}
			</VStack>
		</Box>
	);
};

export default PendingPayrollSummary;
