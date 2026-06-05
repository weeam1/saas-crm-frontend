// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalCloseButton,
// 	ModalBody,
// 	ModalFooter,
// 	Box,
// 	Flex,
// 	Icon,
// 	Divider,
// 	useBreakpointValue,
// 	Text,
// 	Button,
// 	Progress,
// 	Badge,
// 	Grid,
// 	HStack,
// 	VStack,
// } from '@chakra-ui/react';
// import { format } from 'date-fns';
// import {
// 	FaHandHoldingUsd,
// 	FaCalendarAlt,
// 	FaMoneyCheckAlt,
// 	FaUser,
// 	FaBuilding,
// 	FaChartLine,
// 	FaReceipt,
// 	FaClock,
// 	FaCheckCircle,
// 	FaExclamationTriangle,
// } from 'react-icons/fa';
// import { useModalColors } from 'hooks/useModalColors';
// import { formatCurrency } from 'utils/helpers';
// import { DataView, DataViewGroup } from '../components/DateView';
// import { loanTypeColors } from '../helpers';

// const ViewLoanDetails = ({ isOpen, onClose, data }) => {
// 	const {
// 		_id,
// 		user,
// 		type,
// 		amount,
// 		tenure,
// 		paidAmount,
// 		monthsPaid,
// 		monthsRemaining,
// 		isActive,
// 		description,
// 		createdBy,
// 		startDate,
// 		paymentHistory,
// 		createdAt,
// 		updatedAt,
// 		remainingAmount,
// 		monthlyInstallment,
// 		progress,
// 		agency,
// 	} = data;

// 	const { headerBg, headerText } = useModalColors();

// 	// Responsive values
// 	const modalSize = useBreakpointValue({ base: 'full', md: '4xl' });
// 	const headerPadding = useBreakpointValue({ base: 3, md: 6 });
// 	const bodyPadding = useBreakpointValue({ base: 4, md: 6 });

// 	return (
// 		<Modal
// 			isOpen={isOpen}
// 			onClose={onClose}
// 			size={modalSize}
// 			isCentered
// 			motionPreset='slideInBottom'
// 			scrollBehavior='inside'
// 		>
// 			<ModalOverlay backdropFilter='blur(8px)' bg='blackAlpha.600' />
// 			<ModalContent
// 				mx='2'
// 				borderRadius={{ base: 'xl', md: '2xl' }}
// 				boxShadow={{ base: 'xl', md: '2xl' }}
// 				maxH={{ base: '95vh', md: '90vh' }}
// 				overflow='hidden'
// 			>
// 				<ModalHeader
// 					bg={headerBg}
// 					color={headerText}
// 					borderTopRadius={{ base: 'xl', md: '2xl' }}
// 					py={headerPadding}
// 					position='relative'
// 				>
// 					<Flex align='center' justify='space-between'>
// 						<Flex align='center' gap={3}>
// 							<Icon as={FaHandHoldingUsd} boxSize={6} />
// 							<Box>
// 								<Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight='bold'>
// 									Loan Details
// 								</Text>
// 								<Text fontSize='sm' opacity={0.9} fontWeight='normal'>
// 									LN-{_id?.slice(-8)}
// 								</Text>
// 							</Box>
// 						</Flex>
// 					</Flex>
// 				</ModalHeader>

// 				<ModalCloseButton
// 					size='lg'
// 					top={{ base: 4, md: 5 }}
// 					right={{ base: 4, md: 5 }}
// 					color='white'
// 				/>

// 				<ModalBody px={bodyPadding} py={4}>
// 					{/* Loan Summary Cards */}
// 					<Grid
// 						templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
// 						gap={4}
// 						mb={6}
// 					>
// 						<Box
// 							bg='blue.50'
// 							border='1px'
// 							borderColor='blue.100'
// 							borderRadius='xl'
// 							p={4}
// 							textAlign='center'
// 						>
// 							<Box>
// 								<Text fontSize='sm' color='blue.600' fontWeight='medium'>
// 									Total Loan Amount
// 								</Text>
// 								<Text fontSize='xl' color='blue.900' fontWeight='bold'>
// 									{formatCurrency(amount, agency?.currency || 'AED')}
// 								</Text>
// 							</Box>
// 						</Box>

// 						<Box
// 							bg='whatsapp.50'
// 							border='1px'
// 							borderColor='whatsapp.200'
// 							borderRadius='xl'
// 							p={4}
// 							textAlign='center'
// 						>
// 							<Box>
// 								<Text fontSize='sm' color='whatsapp.600' fontWeight='medium'>
// 									Paid Amount
// 								</Text>
// 								<Text fontSize='xl' color='whatsapp.900' fontWeight='bold'>
// 									{formatCurrency(paidAmount, agency?.currency || 'AED')}
// 								</Text>
// 							</Box>
// 						</Box>
// 						<Box
// 							bg='red.50'
// 							border='1px'
// 							borderColor='red.100'
// 							borderRadius='xl'
// 							p={4}
// 							textAlign='center'
// 						>
// 							<Box>
// 								<Text fontSize='sm' color='red.600' fontWeight='medium'>
// 									Remaining Balance
// 								</Text>
// 								<Text fontSize='xl' color='red.900' fontWeight='bold'>
// 									{formatCurrency(remainingAmount, agency?.currency || 'AED')}
// 								</Text>
// 							</Box>
// 						</Box>
// 					</Grid>

// 					{/* Progress Bar */}
// 					<Box
// 						mb={6}
// 						p={4}
// 						bg='white'
// 						border='1px'
// 						borderColor='gray.200'
// 						borderRadius='xl'
// 						boxShadow='sm'
// 					>
// 						<Flex justify='space-between' align='center' mb={3}>
// 							<Flex align='center' gap={2}>
// 								<Icon as={FaChartLine} color='blue.500' boxSize={4} />
// 								<Text fontSize='md' fontWeight='semibold' color='gray.700'>
// 									Repayment Progress
// 								</Text>
// 							</Flex>
// 							<Box
// 								bg={progress === 100 ? 'whatsapp.50' : 'blue.50'}
// 								border='1px'
// 								borderColor={progress === 100 ? 'whatsapp.200' : 'blue.200'}
// 								borderRadius='full'
// 								px={3}
// 								py={1}
// 							>
// 								<Text
// 									fontSize='sm'
// 									fontWeight='bold'
// 									color={progress === 100 ? 'whatsapp.700' : 'blue.700'}
// 								>
// 									{progress ? progress.toFixed(1) : '0'}%
// 								</Text>
// 							</Box>
// 						</Flex>

// 						{progress > 0 ? (
// 							<>
// 								<Progress
// 									value={progress}
// 									colorScheme={progress === 100 ? 'whatsapp' : 'blue'}
// 									size='md'
// 									borderRadius='full'
// 									height='12px'
// 									width='100%'
// 									mb={3}
// 									boxShadow='inset 0 1px 2px rgba(0,0,0,0.1)'
// 								/>
// 								<Flex justify='space-between' align='center'>
// 									<VStack align='start' spacing={0}>
// 										<Text
// 											fontSize='xs'
// 											fontWeight='medium'
// 											color='whatsapp.600'
// 										>
// 											Paid:{' '}
// 											{formatCurrency(
// 												paidAmount || 0,
// 												agency?.currency || 'AED',
// 											)}
// 										</Text>
// 										<Text fontSize='sm' color='gray.500'>
// 											{monthsPaid || 0} of {tenure || 0} months
// 										</Text>
// 									</VStack>
// 									<VStack align='end' spacing={0}>
// 										<Text fontSize='xs' fontWeight='medium' color='blue.600'>
// 											Remaining:{' '}
// 											{formatCurrency(
// 												remainingAmount || amount || 0,
// 												agency?.currency || 'AED',
// 											)}
// 										</Text>
// 										<Text fontSize='sm' color='gray.500'>
// 											{monthsRemaining || tenure || 0} months left
// 										</Text>
// 									</VStack>
// 								</Flex>
// 							</>
// 						) : (
// 							<Box
// 								textAlign='center'
// 								py={4}
// 								bg='gray.50'
// 								borderRadius='lg'
// 								border='1px dashed'
// 								borderColor='gray.300'
// 							>
// 								<Icon as={FaClock} color='gray.400' boxSize={8} mb={2} />
// 								<Text fontSize='sm' color='gray.500' fontWeight='medium' mb={1}>
// 									No Payments Made Yet
// 								</Text>
// 								<Text fontSize='xs' color='gray.400'>
// 									Repayment progress will appear here once payments start
// 								</Text>
// 							</Box>
// 						)}

// 						{/* Payment Status Indicator */}
// 						<Flex justify='center' mt={2} gap={4}>
// 							<Flex align='center' gap={1}>
// 								<Box w='2' h='2' bg='whatsapp.500' borderRadius='full' />
// 								<Text fontSize='x-small' color='gray.500'>
// 									Paid
// 								</Text>
// 							</Flex>
// 							<Flex align='center' gap={1}>
// 								<Box w='2' h='2' bg='blue.500' borderRadius='full' />
// 								<Text fontSize='x-small' color='gray.500'>
// 									Remaining
// 								</Text>
// 							</Flex>
// 							{progress === 100 && (
// 								<Flex align='center' gap={1}>
// 									<Icon as={FaCheckCircle} color='whatsapp.500' boxSize={3} />
// 									<Text fontSize='sm' color='gray.500'>
// 										Fully Paid
// 									</Text>
// 								</Flex>
// 							)}
// 						</Flex>
// 					</Box>

// 					{/* Loan Terms */}
// 					<DataViewGroup columns={{ base: 1, md: 2 }} spacing={4}>
// 						<DataView
// 							label='Loan Type'
// 							value={type}
// 							isBadge
// 							badgeColor={loanTypeColors[type] || 'brand'}
// 							badgeVariant='subtle'
// 							icon={FaHandHoldingUsd}
// 						/>
// 						<DataView
// 							label='Monthly Installment'
// 							value={formatCurrency(
// 								monthlyInstallment,
// 								agency?.currency || 'AED',
// 							)}
// 							icon={FaMoneyCheckAlt}
// 						/>
// 						<DataView
// 							label='Loan Tenure'
// 							value={`${tenure} months`}
// 							icon={FaCalendarAlt}
// 						/>
// 						{/* <DataView
// 							label='Months Remaining'
// 							value={monthsRemaining}
// 							icon={FaClock}
// 						/>
// 						<DataView
// 							label='Months Paid'
// 							value={monthsPaid}
// 							icon={FaCheckCircle}
// 						/> */}
// 						<DataView
// 							label='Start Date'
// 							value={format(new Date(startDate), 'MMM d, yyyy')}
// 							icon={FaCalendarAlt}
// 						/>
// 					</DataViewGroup>

// 					<Divider my={4} />

// 					{/* Description */}
// 					<DataView
// 						label='Description'
// 						value={description}
// 						customStyles={{
// 							gridColumn: '1 / -1',
// 							bg: 'gray.50',
// 							p: 3,
// 							borderRadius: 'md',
// 						}}
// 						truncate={false}
// 					/>

// 					<Divider my={4} />

// 					{/* Payment History Summary */}
// 					{/* <Box
// 						bg='white'
// 						border='1px'
// 						borderColor='gray.200'
// 						borderRadius='lg'
// 						p={4}
// 					>
// 						<Flex align='center' gap={2} mb={3}>
// 							<Icon as={FaReceipt} color='gray.600' />
// 							<Text fontSize='md' fontWeight='semibold' color='gray.700'>
// 								Payment History
// 							</Text>
// 						</Flex>

// 						{paymentHistory && paymentHistory.length > 0 ? (
// 							<VStack align='stretch' spacing={2}>
// 								{paymentHistory.slice(0, 3).map((payment, index) => (
// 									<Flex
// 										key={index}
// 										justify='space-between'
// 										align='center'
// 										py={2}
// 									>
// 										<Text fontSize='sm'>
// 											{format(new Date(payment.date), 'MMM d, yyyy')}
// 										</Text>
// 										<Text fontSize='sm' fontWeight='medium'>
// 											{formatCurrency(payment.amount, 'AED')}
// 										</Text>
// 										<Badge colorScheme='whatsapp' size='sm'>
// 											Paid
// 										</Badge>
// 									</Flex>
// 								))}
// 								{paymentHistory.length > 3 && (
// 									<Text fontSize='sm' color='blue.600' textAlign='center'>
// 										+{paymentHistory.length - 3} more payments
// 									</Text>
// 								)}
// 							</VStack>
// 						) : (
// 							<Text fontSize='sm' color='gray.500' textAlign='center' py={2}>
// 								No payments made yet
// 							</Text>
// 						)}
// 					</Box>

// 					<Divider my={4} /> */}

// 					{/* Audit Information */}
// 					<Box
// 						bg='gray.50'
// 						borderRadius='lg'
// 						p={4}
// 						border='1px solid'
// 						borderColor='gray.200'
// 					>
// 						<Text fontSize='sm' fontWeight='semibold' color='gray.700' mb={3}>
// 							Audit Information
// 						</Text>
// 						<DataViewGroup columns={{ base: 1, md: 2 }} spacing={3}>
// 							<DataView
// 								label='Created By'
// 								value={createdBy?.fullName}
// 								icon={FaUser}
// 							/>

// 							<DataView
// 								label='Last Updated'
// 								value={format(new Date(updatedAt), 'MMM d, yyyy h:mm a')}
// 								icon={FaClock}
// 							/>
// 						</DataViewGroup>
// 					</Box>
// 				</ModalBody>
// 			</ModalContent>
// 		</Modal>
// 	);
// };

// export default ViewLoanDetails;

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
		type,
		amount,
		tenure,
		paidAmount,
		monthsPaid,
		monthsRemaining,
		description,
		createdBy,
		startDate,
		remainingAmount,
		monthlyInstallment,
		progress,
		agency,
		updatedAt,
	} = data;

	const mc = useModalColors();

	// Responsive values
	const modalSize = useBreakpointValue({ base: 'full', md: '4xl' });
	const headerPadding = useBreakpointValue({ base: 3, md: 6 });
	const bodyPadding = useBreakpointValue({ base: 4, md: 6 });

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size={modalSize}
			isCentered
			motionPreset='slideInBottom'
			scrollBehavior='inside'
		>
			<ModalOverlay backdropFilter='blur(8px)' bg={mc.overlayBg} />
			<ModalContent
				mx='2'
				borderRadius={{ base: 'xl', md: '2xl' }}
				boxShadow={mc.modalShadow}
				maxH={{ base: '95vh', md: '90vh' }}
				overflow='hidden'
				bg={mc.bg}
				border='1px solid'
				borderColor={mc.borderColor}
			>
				{/* Header — Gold Gradient */}
				<ModalHeader
					bg={mc.headerBg}
					color={mc.headerText}
					borderTopRadius={{ base: 'xl', md: '2xl' }}
					py={headerPadding}
					px={6}
					boxShadow='0 2px 10px rgba(0,0,0,0.15)'
				>
					<Flex align='center' gap={3}>
						<Icon as={FaHandHoldingUsd} boxSize={6} />
						<Box>
							<Text
								color='inherit'
								fontSize={{ base: 'lg', md: 'xl' }}
								fontWeight='bold'
							>
								Loan Details
							</Text>
							<Text
								color='inherit'
								fontSize='sm'
								opacity={0.8}
								fontWeight='normal'
							>
								LN-{_id?.slice(-8)}
							</Text>
						</Box>
					</Flex>
				</ModalHeader>

				<ModalCloseButton
					top={{ base: 4, md: 5 }}
					right={{ base: 4, md: 5 }}
					bg={mc.closeBtnBg}
					color={mc.closeBtnColor}
					borderRadius='full'
					_hover={{ bg: mc.closeBtnHoverBg }}
					_focus={{ boxShadow: 'none' }}
				/>

				<ModalBody px={bodyPadding} py={4}>
					{/* Loan Summary Cards – gold / green / red accents */}
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
						gap={4}
						mb={6}
					>
						{/* Total Loan Amount */}
						<Box
							bg='rgba(212, 175, 55, 0.08)'
							border='1px solid'
							borderColor='rgba(212, 175, 55, 0.3)'
							borderRadius='xl'
							p={4}
							textAlign='center'
						>
							<Text
								fontSize='xs'
								color={mc.labelColor}
								fontWeight='semibold'
								mb={1}
								textTransform='uppercase'
								letterSpacing='wider'
							>
								Total Loan Amount
							</Text>
							<Text fontSize='xl' color='accent.gold' fontWeight='bold'>
								{formatCurrency(amount, agency?.currency || 'AED')}
							</Text>
						</Box>

						{/* Paid Amount */}
						<Box
							bg='rgba(16, 185, 129, 0.08)'
							border='1px solid'
							borderColor='rgba(16, 185, 129, 0.25)'
							borderRadius='xl'
							p={4}
							textAlign='center'
						>
							<Text
								fontSize='xs'
								color={mc.labelColor}
								fontWeight='semibold'
								mb={1}
								textTransform='uppercase'
								letterSpacing='wider'
							>
								Paid Amount
							</Text>
							<Text fontSize='xl' color='green.400' fontWeight='bold'>
								{formatCurrency(paidAmount, agency?.currency || 'AED')}
							</Text>
						</Box>

						{/* Remaining Balance */}
						<Box
							bg='rgba(238, 93, 80, 0.08)'
							border='1px solid'
							borderColor='rgba(238, 93, 80, 0.25)'
							borderRadius='xl'
							p={4}
							textAlign='center'
						>
							<Text
								fontSize='xs'
								color={mc.labelColor}
								fontWeight='semibold'
								mb={1}
								textTransform='uppercase'
								letterSpacing='wider'
							>
								Remaining Balance
							</Text>
							<Text fontSize='xl' color='red.400' fontWeight='bold'>
								{formatCurrency(remainingAmount, agency?.currency || 'AED')}
							</Text>
						</Box>
					</Grid>

					{/* Progress Section */}
					<Box
						mb={6}
						p={5}
						bg={mc.bgDeep}
						border='1px solid'
						borderColor={mc.borderColor}
						borderRadius='xl'
					>
						<Flex justify='space-between' align='center' mb={3}>
							<Flex align='center' gap={2}>
								<Icon as={FaChartLine} color='accent.gold' boxSize={4} />
								<Text fontSize='md' fontWeight='semibold' color={mc.labelColor}>
									Repayment Progress
								</Text>
							</Flex>
							<Box
								bg={
									progress === 100
										? 'rgba(16, 185, 129, 0.12)'
										: 'rgba(212, 175, 55, 0.12)'
								}
								border='1px solid'
								borderColor={
									progress === 100
										? 'rgba(16, 185, 129, 0.3)'
										: 'rgba(212, 175, 55, 0.3)'
								}
								borderRadius='full'
								px={3}
								py={1}
							>
								<Text
									fontSize='sm'
									fontWeight='bold'
									color={progress === 100 ? 'green.400' : 'accent.gold'}
								>
									{progress ? progress.toFixed(1) : '0'}%
								</Text>
							</Box>
						</Flex>

						{progress > 0 ? (
							<>
								<Progress
									value={progress}
									colorScheme={progress === 100 ? 'green' : 'yellow'}
									size='md'
									borderRadius='full'
									height='12px'
									width='100%'
									mb={3}
									bg={mc.bgInput}
								/>
								<Flex justify='space-between' align='center'>
									<VStack align='start' spacing={0}>
										<Text fontSize='xs' fontWeight='medium' color='green.400'>
											Paid:{' '}
											{formatCurrency(
												paidAmount || 0,
												agency?.currency || 'AED',
											)}
										</Text>
										<Text fontSize='sm' color={mc.mutedText}>
											{monthsPaid || 0} of {tenure || 0} months
										</Text>
									</VStack>
									<VStack align='end' spacing={0}>
										<Text fontSize='xs' fontWeight='medium' color='red.400'>
											Remaining:{' '}
											{formatCurrency(
												remainingAmount || amount || 0,
												agency?.currency || 'AED',
											)}
										</Text>
										<Text fontSize='sm' color={mc.mutedText}>
											{monthsRemaining || tenure || 0} months left
										</Text>
									</VStack>
								</Flex>
							</>
						) : (
							<Box
								textAlign='center'
								py={4}
								bg={mc.bgInput}
								borderRadius='lg'
								border='1px dashed'
								borderColor={mc.borderColor}
							>
								<Icon as={FaClock} color={mc.mutedText} boxSize={8} mb={2} />
								<Text
									fontSize='sm'
									color={mc.mutedText}
									fontWeight='medium'
									mb={1}
								>
									No Payments Made Yet
								</Text>
								<Text fontSize='xs' color={mc.labelColor}>
									Repayment progress will appear here once payments start
								</Text>
							</Box>
						)}

						{/* Legend */}
						<Flex justify='center' mt={3} gap={4}>
							<Flex align='center' gap={1}>
								<Box w='2' h='2' bg='green.400' borderRadius='full' />
								<Text fontSize='x-small' color={mc.mutedText}>
									Paid
								</Text>
							</Flex>
							<Flex align='center' gap={1}>
								<Box w='2' h='2' bg='accent.gold' borderRadius='full' />
								<Text fontSize='x-small' color={mc.mutedText}>
									Remaining
								</Text>
							</Flex>
							{progress === 100 && (
								<Flex align='center' gap={1}>
									<Icon as={FaCheckCircle} color='green.400' boxSize={3} />
									<Text fontSize='sm' color='green.400' fontWeight='medium'>
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
								agency?.currency || 'AED',
							)}
							icon={FaMoneyCheckAlt}
						/>
						<DataView
							label='Loan Tenure'
							value={`${tenure} months`}
							icon={FaCalendarAlt}
						/>
						<DataView
							label='Start Date'
							value={format(new Date(startDate), 'MMM d, yyyy')}
							icon={FaCalendarAlt}
						/>
					</DataViewGroup>

					<Divider my={4} borderColor={mc.divider} />

					{/* Description */}
					<Box
						bg={mc.bgDeep}
						border='1px solid'
						borderColor={mc.borderColor}
						borderRadius='md'
						p={4}
						mb={4}
					>
						<Text
							fontSize='sm'
							fontWeight='semibold'
							color={mc.labelColor}
							mb={2}
						>
							Description
						</Text>
						<Text fontSize='sm' color={mc.bodyText} whiteSpace='pre-wrap'>
							{description || 'No description provided'}
						</Text>
					</Box>

					<Divider my={4} borderColor={mc.divider} />

					{/* Audit Information */}
					<Box
						bg={mc.bgDeep}
						borderRadius='lg'
						p={5}
						border='1px solid'
						borderColor={mc.borderColor}
					>
						<Text
							fontSize='sm'
							fontWeight='semibold'
							color={mc.labelColor}
							mb={3}
							textTransform='uppercase'
							letterSpacing='wider'
						>
							<Icon as={FaClock} mr={1} />
							Audit Information
						</Text>
						<DataViewGroup columns={{ base: 1, md: 2 }} spacing={3}>
							<DataView
								label='Created By'
								value={createdBy?.fullName}
								icon={FaUser}
							/>
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
