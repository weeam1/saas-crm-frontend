import {
	Box,
	Text,
	Flex,
	Icon,
	Divider,
	Stack,
	Modal,
	ModalContent,
	ModalOverlay,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	SimpleGrid,
	GridItem,
	Grid,
} from '@chakra-ui/react';
import {
	FaUserCheck,
	FaUserShield,
	FaUserTag,
	FaUserTie,
} from 'react-icons/fa';
import { CheckCircleIcon, TimeIcon } from '@chakra-ui/icons';
import { formatPostDate, formatCurrency } from 'utils/helpers';
import { FiX, FiXCircle } from 'react-icons/fi';
import ViewDealInvoice from './_shared/ViewDealInvoice';

// Modal component for detailed view
const DealDetailsModal = ({ isOpen, onClose, deal }) => {
	if (!deal) return <Text>No Deal found!</Text>;

	const {
		lead,
		agent,
		manager,
		developer,
		salesPerson,
		projectName,
		unitNumber,
		unitType,
		unitPrice,
		downpaymentPaid,
		downpaymentPercent,
		bookingAmountPaid,
		bookingPercent,
		spaDone,
		invoiceSent,
		closedBy,
		commissionStatus,
		createdAt,
		dealDate,
		dealStatus,
		currency = 'AED',
	} = deal;

	const PersonCard = ({ title, person, icon }) => {
		if (!person) return null;
		return (
			<Box
				p={3}
				borderRadius='md'
				borderWidth='1px'
				borderColor='gray.100'
				bg='gray.50'
			>
				<Flex align='center' gap={3}>
					<Icon as={icon} color='brand.500' boxSize={5} />
					<Box>
						<Text fontSize='xs' color='gray.500' mb={1}>
							{title}
						</Text>
						<Text fontWeight='medium'>{person.fullName || person}</Text>
					</Box>
				</Flex>
			</Box>
		);
	};

	const StatusIndicator = ({ label, value, positive }) => (
		<Flex
			p={2}
			borderRadius='md'
			bg={positive ? 'green.50' : 'red.50'}
			borderWidth='1px'
			borderColor={positive ? 'green.100' : 'red.100'}
			align='center'
			gap={2}
		>
			<Icon
				as={positive ? CheckCircleIcon : FiXCircle}
				color={positive ? 'green.500' : 'red.500'}
				boxSize={4}
			/>
			<Box>
				<Text fontSize='xs' color='gray.500'>
					{label}
				</Text>
				<Text fontSize='sm' fontWeight='medium'>
					{value}
				</Text>
			</Box>
		</Flex>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='6xl'
			scrollBehavior='inside'
			isCentered
		>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent borderRadius='xl' mx='4' boxShadow='xl'>
				<ModalHeader
					bg='brand.50'
					borderTopRadius='xl'
					py={3}
					fontSize='lg'
					fontWeight='bold'
					color='brand.700'
					borderBottomWidth='1px'
				>
					Deal Details
				</ModalHeader>
				<ModalCloseButton size='lg' />

				<ModalBody p={{ base: 4, md: 6 }}>
					<Grid
						templateColumns={{ base: '1fr', md: '1fr 1fr' }}
						gap={{ base: 5, md: 6 }}
					>
						{/* Left Column */}
						<GridItem>
							<Stack spacing={5}>
								{/* Lead Information */}
								<Box>
									<Text fontSize='md' fontWeight='bold' mb={3} color='gray.700'>
										Lead Information
									</Text>
									<Box
										p={4}
										borderRadius='md'
										borderWidth='1px'
										borderColor='gray.100'
										bg='gray.50'
									>
										<Stack spacing={3}>
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Client Name
												</Text>
												<Text fontWeight='medium' fontSize='lg'>
													{lead?.leadName || 'N/A'}
												</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Client Contact
												</Text>
												{/* <Stack spacing={1}> */}
												<Text fontWeight='medium' fontSize='lg'>
													{lead?.leadPhoneNumber || 'N/A'}
												</Text>
												{/* <Text fontSize='sm'>
														{lead?.email || 'No email provided'}
													</Text> */}
												{/* </Stack> */}
											</Box>
										</Stack>
									</Box>
								</Box>

								{/* Property Details */}
								<Box>
									<Text fontSize='md' fontWeight='bold' mb={3} color='gray.700'>
										Property Details
									</Text>
									<Box
										p={4}
										borderRadius='md'
										borderWidth='1px'
										borderColor='gray.100'
										bg='gray.50'
									>
										<Stack spacing={3}>
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Unit Number
												</Text>
												<Text fontWeight='medium'>#{unitNumber}</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Developer
												</Text>
												<Text fontWeight='medium'>{developer}</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Unit Type
												</Text>
												<Text fontWeight='medium'>{unitType}</Text>
											</Box>
											<Divider />
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Project
												</Text>
												<Text fontWeight='medium'>{projectName}</Text>
											</Box>
											<Divider />

											<Box>
												<Text fontSize='xs' color='gray.500'>
													Deal Close On
												</Text>
												<Text fontWeight='medium'>
													{formatPostDate(dealDate)}
												</Text>
											</Box>
										</Stack>
									</Box>
								</Box>

								{/* View invoice sent document */}
								<ViewDealInvoice deal={deal} type='button' />
							</Stack>
						</GridItem>

						{/* Right Column */}
						<GridItem>
							<Stack spacing={5}>
								{/* 	Payment Details*/}
								<Box>
									<Text fontSize='md' fontWeight='bold' mb={3} color='gray.700'>
										Payment Details
									</Text>
									<Box
										p={4}
										borderRadius='md'
										borderWidth='1px'
										borderColor='gray.100'
										bg='gray.50'
									>
										<Stack spacing={3}>
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Unit Price
												</Text>
												<Text fontSize='lg' fontWeight='bold' color='brand.600'>
													{formatCurrency(unitPrice, currency)}
												</Text>
											</Box>
											<Divider />
											<SimpleGrid columns={2} spacing={3}>
												<Box>
													<Text fontSize='xs' color='gray.500'>
														Downpayment
													</Text>
													<Text fontWeight='medium'>
														{formatCurrency(downpaymentPaid, currency)}
													</Text>
													<Text fontSize='xs' color='gray.500'>
														({downpaymentPercent}%)
													</Text>
												</Box>
												<Box>
													<Text fontSize='xs' color='gray.500'>
														Booking Amount
													</Text>
													<Text fontWeight='medium'>
														{formatCurrency(bookingAmountPaid, currency)}
													</Text>
													<Text fontSize='xs' color='gray.500'>
														({bookingPercent}%)
													</Text>
												</Box>
											</SimpleGrid>
										</Stack>
									</Box>
								</Box>

								{/* Team Information */}
								<Box>
									<Text fontSize='md' fontWeight='bold' mb={3} color='gray.700'>
										Team
									</Text>
									<SimpleGrid columns={1} spacing={3}>
										{salesPerson && (
											<PersonCard
												title='Sales Person'
												person={salesPerson}
												icon={FaUserTie}
											/>
										)}
										{agent && (
											<PersonCard
												title='Agent'
												person={agent}
												icon={FaUserTag}
											/>
										)}
										{manager && (
											<PersonCard
												title='Manager'
												person={manager}
												icon={FaUserShield}
											/>
										)}
										{closedBy && (
											<PersonCard
												title='Closed By'
												person={closedBy}
												icon={FaUserCheck}
											/>
										)}
									</SimpleGrid>
								</Box>

								{/* Status Indicators */}
								<Box>
									<Text fontSize='md' fontWeight='bold' mb={3} color='gray.700'>
										Status
									</Text>
									<SimpleGrid columns={2} spacing={3}>
										<StatusIndicator
											label='SPA Status'
											value={spaDone ? 'Signed' : 'Pending'}
											positive={spaDone}
										/>
										<StatusIndicator
											label='Invoice Sent'
											value={invoiceSent ? 'Yes' : 'No'}
											positive={invoiceSent}
										/>

										<Flex
											// gridColumn='1 / -1'
											p={2}
											borderRadius='md'
											bg={
												commissionStatus.includes('Fully')
													? 'green.50'
													: 'gray.50'
											}
											borderWidth='1px'
											borderColor={
												commissionStatus.includes('Fully')
													? 'green.100'
													: 'gray.100'
											}
											align='center'
											gap={2}
										>
											<Icon
												as={
													commissionStatus.includes('Fully')
														? CheckCircleIcon
														: TimeIcon
												}
												color={
													commissionStatus.includes('Fully')
														? 'green.500'
														: 'gray.500'
												}
												boxSize={4}
											/>
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Commission Status
												</Text>
												<Text fontSize='sm' fontWeight='medium'>
													{commissionStatus}
												</Text>
											</Box>
										</Flex>
										<Flex
											// gridColumn='1 '
											p={2}
											borderRadius='md'
											bg={dealStatus === 'Confirmed' ? 'green.50' : 'red.50'}
											borderWidth='1px'
											borderColor={
												dealStatus === 'Confirmed' ? 'green.100' : 'red.100'
											}
											align='center'
											gap={2}
										>
											<Icon
												as={dealStatus === 'Confirmed' ? CheckCircleIcon : FiX}
												color={
													dealStatus === 'Confirmed' ? 'green.500' : 'red.500'
												}
												boxSize={4}
											/>
											<Box>
												<Text fontSize='xs' color='gray.500'>
													Deal Status
												</Text>
												<Text fontSize='sm' fontWeight='medium'>
													{dealStatus}
												</Text>
											</Box>
										</Flex>
									</SimpleGrid>
								</Box>
							</Stack>
						</GridItem>
					</Grid>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default DealDetailsModal;
