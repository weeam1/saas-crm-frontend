import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Box,
	Flex,
	Icon,
	Divider,
	useBreakpointValue,
	Text,
	Button,
	Progress,
	Badge,
	Grid,
	HStack,
	VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import {
	FaHandHoldingUsd,
	FaCalendarAlt,
	FaMoneyCheckAlt,
	FaUser,
	FaBuilding,
	FaChartLine,
	FaReceipt,
	FaClock,
	FaCheckCircle,
	FaExclamationTriangle,
} from 'react-icons/fa';
import { useModalColors } from 'hooks/useModalColors';
import { formatCurrency } from 'utils/helpers';
import { DataView, DataViewGroup } from '../components/DateView';
import { loanTypeColors } from '../helpers';

const ViewLoanDetails = ({ isOpen, onClose, data }) => {
	const {
		_id,
		user,
		type,
		amount,
		tenure,
		paidAmount,
		monthsPaid,
		monthsRemaining,
		isActive,
		description,
		createdBy,
		startDate,
		paymentHistory,
		createdAt,
		updatedAt,
		remainingAmount,
		monthlyInstallment,
		progress,
	} = data;

	const { headerBg, headerText } = useModalColors();

	// Responsive values
	const modalSize = useBreakpointValue({ base: 'full', md: '4xl' });
	const headerPadding = useBreakpointValue({ base: 3, md: 6 });
	const bodyPadding = useBreakpointValue({ base: 4, md: 6 });

	// Loan status and type colors
	// const loanStatusColors = {
	// 	active: 'whatsapp',
	// 	completed: 'blue',
	// 	defaulted: 'red',
	// 	pending: 'orange',
	// };

	// const getLoanStatus = () => {
	// 	if (!isActive) return { status: 'Completed', color: 'blue' };
	// 	if (remainingAmount === 0) return { status: 'Paid Off', color: 'whatsapp' };
	// 	if (monthsRemaining === 0 && remainingAmount > 0)
	// 		return { status: 'Defaulted', color: 'red' };
	// 	return { status: 'Active', color: 'whatsapp' };
	// };

	// const statusInfo = getLoanStatus();

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={modalSize}
			isCentered
			motionPreset='slideInBottom'
			scrollBehavior='inside'
		>
			<ModalOverlay backdropFilter='blur(8px)' bg='blackAlpha.600' />
			<ModalContent
				mx='2'
				borderRadius={{ base: 'xl', md: '2xl' }}
				boxShadow={{ base: 'xl', md: '2xl' }}
				maxH={{ base: '95vh', md: '90vh' }}
				overflow='hidden'
			>
				<ModalHeader
					bg={headerBg}
					color={headerText}
					borderTopRadius={{ base: 'xl', md: '2xl' }}
					py={headerPadding}
					position='relative'
				>
					<Flex align='center' justify='space-between'>
						<Flex align='center' gap={3}>
							<Icon as={FaHandHoldingUsd} boxSize={6} />
							<Box>
								<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
									Loan Details
								</Text>
								<Text fontSize='sm' opacity={0.9} fontWeight='normal'>
									LN-{_id?.slice(-8)}
								</Text>
							</Box>
						</Flex>
					</Flex>
				</ModalHeader>

				<ModalCloseButton
					size='lg'
					top={{ base: 4, md: 5 }}
					right={{ base: 4, md: 5 }}
					color='white'
				/>

				<ModalBody px={bodyPadding} py={4}>
					{/* Loan Summary Cards */}
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
						gap={4}
						mb={6}
					>
						<Box
							bg='blue.50'
							border='1px'
							borderColor='blue.100'
							borderRadius='xl'
							p={4}
							textAlign='center'
						>
							<Box>
								<Text fontSize='sm' color='blue.600' fontWeight='medium'>
									Total Loan Amount
								</Text>
								<Text fontSize='xl' color='blue.900' fontWeight='bold'>
									{formatCurrency(amount, user?.agency?.currency || 'AED')}
								</Text>
							</Box>
						</Box>

						<Box
							bg='whatsapp.50'
							border='1px'
							borderColor='whatsapp.200'
							borderRadius='xl'
							p={4}
							textAlign='center'
						>
							<Box>
								<Text fontSize='sm' color='whatsapp.600' fontWeight='medium'>
									Paid Amount
								</Text>
								<Text fontSize='xl' color='whatsapp.900' fontWeight='bold'>
									{formatCurrency(paidAmount, user?.agency?.currency || 'AED')}
								</Text>
							</Box>
						</Box>
						<Box
							bg='red.50'
							border='1px'
							borderColor='red.100'
							borderRadius='xl'
							p={4}
							textAlign='center'
						>
							<Box>
								<Text fontSize='sm' color='red.600' fontWeight='medium'>
									Remaining Balance
								</Text>
								<Text fontSize='xl' color='red.900' fontWeight='bold'>
									{formatCurrency(
										remainingAmount,
										user?.agency?.currency || 'AED'
									)}
								</Text>
							</Box>
						</Box>
					</Grid>

					{/* Progress Bar */}
					<Box
						mb={6}
						p={4}
						bg='white'
						border='1px'
						borderColor='gray.200'
						borderRadius='xl'
						boxShadow='sm'
					>
						<Flex justify='space-between' align='center' mb={3}>
							<Flex align='center' gap={2}>
								<Icon as={FaChartLine} color='blue.500' boxSize={4} />
								<Text fontSize='md' fontWeight='semibold' color='gray.700'>
									Repayment Progress
								</Text>
							</Flex>
							<Box
								bg={progress === 100 ? 'whatsapp.50' : 'blue.50'}
								border='1px'
								borderColor={progress === 100 ? 'whatsapp.200' : 'blue.200'}
								borderRadius='full'
								px={3}
								py={1}
							>
								<Text
									fontSize='sm'
									fontWeight='bold'
									color={progress === 100 ? 'whatsapp.700' : 'blue.700'}
								>
									{progress ? progress.toFixed(1) : '0'}%
								</Text>
							</Box>
						</Flex>

						{progress > 0 ? (
							<>
								<Progress
									value={progress}
									colorScheme={progress === 100 ? 'whatsapp' : 'blue'}
									size='md'
									borderRadius='full'
									height='12px'
									width='100%'
									mb={3}
									boxShadow='inset 0 1px 2px rgba(0,0,0,0.1)'
								/>
								<Flex justify='space-between' align='center'>
									<VStack align='start' spacing={0}>
										<Text
											fontSize='xs'
											fontWeight='medium'
											color='whatsapp.600'
										>
											Paid:{' '}
											{formatCurrency(
												paidAmount || 0,
												user?.agency?.currency || 'AED'
											)}
										</Text>
										<Text fontSize='sm' color='gray.500'>
											{monthsPaid || 0} of {tenure || 0} months
										</Text>
									</VStack>
									<VStack align='end' spacing={0}>
										<Text fontSize='xs' fontWeight='medium' color='blue.600'>
											Remaining:{' '}
											{formatCurrency(
												remainingAmount || amount || 0,
												user?.agency?.currency || 'AED'
											)}
										</Text>
										<Text fontSize='sm' color='gray.500'>
											{monthsRemaining || tenure || 0} months left
										</Text>
									</VStack>
								</Flex>
							</>
						) : (
							<Box
								textAlign='center'
								py={4}
								bg='gray.50'
								borderRadius='lg'
								border='1px dashed'
								borderColor='gray.300'
							>
								<Icon as={FaClock} color='gray.400' boxSize={8} mb={2} />
								<Text fontSize='sm' color='gray.500' fontWeight='medium' mb={1}>
									No Payments Made Yet
								</Text>
								<Text fontSize='xs' color='gray.400'>
									Repayment progress will appear here once payments start
								</Text>
							</Box>
						)}

						{/* Payment Status Indicator */}
						<Flex justify='center' mt={2} gap={4}>
							<Flex align='center' gap={1}>
								<Box w='2' h='2' bg='whatsapp.500' borderRadius='full' />
								<Text fontSize='x-small' color='gray.500'>
									Paid
								</Text>
							</Flex>
							<Flex align='center' gap={1}>
								<Box w='2' h='2' bg='blue.500' borderRadius='full' />
								<Text fontSize='x-small' color='gray.500'>
									Remaining
								</Text>
							</Flex>
							{progress === 100 && (
								<Flex align='center' gap={1}>
									<Icon as={FaCheckCircle} color='whatsapp.500' boxSize={3} />
									<Text fontSize='sm' color='gray.500'>
										Fully Paid
									</Text>
								</Flex>
							)}
						</Flex>
					</Box>

					{/* Loan Terms */}
					<DataViewGroup columns={{ base: 1, md: 2 }} spacing={4}>
						<DataView
							label='Loan Type'
							value={type}
							isBadge
							badgeColor={loanTypeColors[type] || 'brand'}
							badgeVariant='subtle'
							icon={FaHandHoldingUsd}
						/>
						<DataView
							label='Monthly Installment'
							value={formatCurrency(
								monthlyInstallment,
								user?.agency?.currency || 'AED'
							)}
							icon={FaMoneyCheckAlt}
						/>
						<DataView
							label='Loan Tenure'
							value={`${tenure} months`}
							icon={FaCalendarAlt}
						/>
						{/* <DataView
							label='Months Remaining'
							value={monthsRemaining}
							icon={FaClock}
						/>
						<DataView
							label='Months Paid'
							value={monthsPaid}
							icon={FaCheckCircle}
						/> */}
						<DataView
							label='Start Date'
							value={format(new Date(startDate), 'MMM d, yyyy')}
							icon={FaCalendarAlt}
						/>
					</DataViewGroup>

					<Divider my={4} />

					{/* Description */}
					<DataView
						label='Description'
						value={description}
						customStyles={{
							gridColumn: '1 / -1',
							bg: 'gray.50',
							p: 3,
							borderRadius: 'md',
						}}
						truncate={false}
					/>

					<Divider my={4} />

					{/* Payment History Summary */}
					{/* <Box
						bg='white'
						border='1px'
						borderColor='gray.200'
						borderRadius='lg'
						p={4}
					>
						<Flex align='center' gap={2} mb={3}>
							<Icon as={FaReceipt} color='gray.600' />
							<Text fontSize='md' fontWeight='semibold' color='gray.700'>
								Payment History
							</Text>
						</Flex>

						{paymentHistory && paymentHistory.length > 0 ? (
							<VStack align='stretch' spacing={2}>
								{paymentHistory.slice(0, 3).map((payment, index) => (
									<Flex
										key={index}
										justify='space-between'
										align='center'
										py={2}
									>
										<Text fontSize='sm'>
											{format(new Date(payment.date), 'MMM d, yyyy')}
										</Text>
										<Text fontSize='sm' fontWeight='medium'>
											{formatCurrency(payment.amount, 'AED')}
										</Text>
										<Badge colorScheme='whatsapp' size='sm'>
											Paid
										</Badge>
									</Flex>
								))}
								{paymentHistory.length > 3 && (
									<Text fontSize='sm' color='blue.600' textAlign='center'>
										+{paymentHistory.length - 3} more payments
									</Text>
								)}
							</VStack>
						) : (
							<Text fontSize='sm' color='gray.500' textAlign='center' py={2}>
								No payments made yet
							</Text>
						)}
					</Box>

					<Divider my={4} /> */}

					{/* Audit Information */}
					<Box
						bg='gray.50'
						borderRadius='lg'
						p={4}
						border='1px solid'
						borderColor='gray.200'
					>
						<Text fontSize='sm' fontWeight='semibold' color='gray.700' mb={3}>
							Audit Information
						</Text>
						<DataViewGroup columns={{ base: 1, md: 2 }} spacing={3}>
							<DataView
								label='Created By'
								value={createdBy?.fullName}
								icon={FaUser}
							/>
							{/* <DataView
								label='Created Date'
								value={format(new Date(createdAt), 'MMM d, yyyy h:mm a')}
							/> */}
							<DataView
								label='Last Updated'
								value={format(new Date(updatedAt), 'MMM d, yyyy h:mm a')}
								icon={FaClock}
							/>
						</DataViewGroup>
					</Box>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ViewLoanDetails;
