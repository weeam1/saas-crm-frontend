import {
	Box,
	Text,
	Avatar,
	Badge,
	Flex,
	Icon,
	Divider,
	Stack,
	Tooltip,
	Wrap,
	WrapItem,
	Button,
	SimpleGrid,
} from '@chakra-ui/react';
import { CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';
import {
	FaFileInvoice,
	FaUserTie,
	FaBuilding,
	FaHome,
	FaUserShield,
	FaUserCheck,
} from 'react-icons/fa';
import { StatusBadge } from './_shared/StatusBadge';
import CustomTooltip from 'components/shared/CustomTooltip';
import { FiChevronRight } from 'react-icons/fi';
import { formatPostDate, formatCurrency } from 'utils/helpers';
import { FaPen } from 'react-icons/fa6';

// export const DealCard = ({ deal }) => {
// 	const {
// 		lead,
// 		agent,
// 		manager,
// 		developer,
// 		salesPerson,
// 		projectName,
// 		unitNumber,
// 		unitType,
// 		unitPrice,
// 		downpaymentPaid,
// 		downpaymentPercent,
// 		bookingAmountPaid,
// 		bookingPercent,
// 		spaDone,
// 		invoiceSent,
// 		closedBy,
// 		commissionStatus,
// 		createdAt,
// 	} = deal;

// 	const InfoRow = ({ label, value, isLast }) => (
// 		<>
// 			<Flex justify='space-between' w='100%' py={2}>
// 				<Text fontSize='sm' color='gray.500'>
// 					{label}
// 				</Text>
// 				<Text fontSize='sm' fontWeight='medium' color='gray.800'>
// 					{value}
// 				</Text>
// 			</Flex>
// 			{!isLast && <Divider />}
// 		</>
// 	);

// 	const StatusBadge = ({ status }) => {
// 		const colorSchemes = {
// 			pending: 'yellow',
// 			paid: 'green',
// 			processing: 'brand',
// 			rejected: 'red',
// 		};

// 		return (
// 			<Badge
// 				colorScheme={colorSchemes[status.toLowerCase()] || 'gray'}
// 				px={2}
// 				py={1}
// 				borderRadius='full'
// 				fontSize='xs'
// 				fontWeight='bold'
// 				textTransform='uppercase'
// 			>
// 				{status}
// 			</Badge>
// 		);
// 	};

// 	const formatCurrency = (amount) => {
// 		return new Intl.NumberFormat('en-US', {
// 			style: 'currency',
// 			currency: 'USD',
// 			maximumFractionDigits: 0,
// 		}).format(amount);
// 	};

// 	const formatDate = (dateString) => {
// 		return new Date(dateString).toLocaleDateString('en-US', {
// 			year: 'numeric',
// 			month: 'short',
// 			day: 'numeric',
// 		});
// 	};

// 	return (
// 		<Box
// 			borderWidth='1px'
// 			borderRadius='lg'
// 			p={5}
// 			bg='white'
// 			boxShadow='sm'
// 			_hover={{ boxShadow: 'md' }}
// 			transition='all 0.2s ease'
// 			maxW='full'
// 			borderTopWidth='4px'
// 			borderTopColor={
// 				commissionStatus.toLowerCase() === 'paid'
// 					? 'green.500'
// 					: commissionStatus.toLowerCase() === 'pending'
// 						? 'yellow.500'
// 						: 'brand.500'
// 			}
// 		>
// 			<Stack spacing={4}>
// 				{/* Header Section */}
// 				<Flex justify='space-between' align='flex-start'>
// 					<Box>
// 						<Text fontSize='lg' fontWeight='bold' mb={1}>
// 							{lead?.leadName}
// 						</Text>
// 						<Text fontSize='sm' color='gray.500'>
// 							{lead?.phoneNumber}
// 						</Text>
// 					</Box>

// 					<Flex direction='column' align='flex-end'>
// 						<StatusBadge status={commissionStatus} />
// 						<Flex mt={2} gap={2}>
// 							{invoiceSent && (
// 								<Tooltip label='Invoice Sent' hasArrow placement='top'>
// 									<Icon as={FaFileInvoice} color='green.500' boxSize={4} />
// 								</Tooltip>
// 							)}
// 							{spaDone && (
// 								<Tooltip label='SPA Signed' hasArrow placement='top'>
// 									<Icon as={CheckCircleIcon} color='brand.500' boxSize={4} />
// 								</Tooltip>
// 							)}
// 						</Flex>
// 					</Flex>
// 				</Flex>

// 				<Divider />

// 				{/* Property Details */}
// 				<Box>
// 					<Text fontSize='sm' fontWeight='semibold' color='gray.700' mb={2}>
// 						Property Details
// 					</Text>
// 					<Stack spacing={1}>
// 						<InfoRow label='Developer' value={developer} />
// 						<InfoRow label='Project' value={`${projectName} (${unitType})`} />
// 						<InfoRow label='Unit' value={unitNumber} isLast={true} />
// 					</Stack>
// 				</Box>

// 				<Divider />

// 				{/* Financials */}
// 				<Box>
// 					<Text fontSize='sm' fontWeight='semibold' color='gray.700' mb={2}>
// 						Financials
// 					</Text>
// 					<Stack spacing={1}>
// 						<InfoRow label='Unit Price' value={formatCurrency(unitPrice)} />
// 						<InfoRow
// 							label='Downpayment'
// 							value={`${formatCurrency(downpaymentPaid)} (${downpaymentPercent}%)`}
// 						/>
// 						<InfoRow
// 							label='Booking Amount'
// 							value={`${formatCurrency(bookingAmountPaid)} (${bookingPercent}%)`}
// 							isLast={true}
// 						/>
// 					</Stack>
// 				</Box>

// 				<Divider />

// 				{/* Team */}
// 				<Box>
// 					<Text fontSize='sm' fontWeight='semibold' color='gray.700' mb={2}>
// 						Team
// 					</Text>
// 					<Stack spacing={3}>
// 						{salesPerson && (
// 							<Box>
// 								<Text fontSize='xs' color='gray.500'>
// 									Sales Person
// 								</Text>
// 								<Text fontSize='sm' fontWeight='medium'>
// 									{salesPerson}
// 								</Text>
// 							</Box>
// 						)}
// 						{agent && (
// 							<Box>
// 								<Text fontSize='xs' color='gray.500'>
// 									Agent
// 								</Text>
// 								<Text fontSize='sm' fontWeight='medium'>
// 									{agent?.fullName}
// 								</Text>
// 							</Box>
// 						)}
// 						{manager && (
// 							<Box>
// 								<Text fontSize='xs' color='gray.500'>
// 									Manager
// 								</Text>
// 								<Text fontSize='sm' fontWeight='medium'>
// 									{manager?.fullName}
// 								</Text>
// 							</Box>
// 						)}
// 						{closedBy && (
// 							<Box>
// 								<Text fontSize='xs' color='gray.500'>
// 									Closed By
// 								</Text>
// 								<Text fontSize='sm' fontWeight='medium'>
// 									{closedBy?.fullName}
// 								</Text>
// 							</Box>
// 						)}
// 					</Stack>
// 				</Box>

// 				<Divider />

// 				{/* Footer */}
// 				<Flex justify='space-between' align='center'>
// 					<Text fontSize='xs' color='gray.500'>
// 						Created: {formatDate(createdAt)}
// 					</Text>
// 					<Button size='sm' variant='outline' colorScheme='brand'>
// 						View Details
// 					</Button>
// 				</Flex>
// 			</Stack>
// 		</Box>
// 	);
// };

export const DealCard = ({ deal, onViewDetails, onEditDeal }) => {
	const {
		lead,
		commissionStatus,
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
		createdAt,
		manager,
		agent,
		closedBy,
		salesPerson,
		currency,
	} = deal;

	const renderPerson = (role, person) => {
		if (!person) return null;
		return (
			<Flex align='center' gap={1}>
				<Icon
					as={
						role === 'manager'
							? FaUserShield
							: role === 'agent'
								? FaUserTie
								: FaUserCheck
					}
					color='gray.500'
					boxSize={3}
				/>
				<Text fontSize='xs' color='gray.600' isTruncated maxW='100px'>
					{person.fullName || person}
				</Text>
			</Flex>
		);
	};

	return (
		<Box
			position='relative'
			borderLeft='4px solid'
			borderLeftColor={
				commissionStatus.toLowerCase() === 'fully paid'
					? 'green.500'
					: commissionStatus.toLowerCase() === 'partial paid'
						? 'orange.500'
						: 'brand.500'
			}
			borderRightColor='gray.400'
			borderBottomColor='gray.400'
			borderTopColor='gray.400'
			borderRadius='md'
			p={4}
			bg='white'
			shadow='md'
			_hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
			transition='all 0.2s ease'
		>
			{/* Status badge */}
			<Box position='absolute' top={3} right={3}>
				<StatusBadge status={commissionStatus} />
			</Box>

			<Stack spacing={3}>
				{/* Lead info with priority styling */}
				<Box>
					<Flex align='center' gap={2}>
						<Box flex='1'>
							<Text fontWeight='bold' fontSize='sm' isTruncated>
								{lead?.leadName}
							</Text>
						</Box>
						{/* <Box mr='14'>
							{spaDone && (
								<CustomTooltip label='SPA Signed'>
									<Icon as={CheckCircleIcon} color='green.500' boxSize={4} />
								</CustomTooltip>
							)}
						</Box> */}
					</Flex>
				</Box>

				{/* Property info with icon */}
				<Flex align='center' gap={2}>
					<Icon as={FaBuilding} color='brand.500' boxSize={4} />
					<Box>
						<Text fontSize='xs' fontWeight='semibold' color='gray.800'>
							{projectName}
						</Text>
						<Text fontSize='x-small' color='gray.600'>
							{unitType} · Unit #{unitNumber}
						</Text>
					</Box>
				</Flex>

				{/* Team information in compact format */}
				<SimpleGrid columns={2} spacing={2}>
					{manager && (
						<Box>
							<Text fontSize='x-small' color='gray.400' mb={-1}>
								Manager
							</Text>
							{renderPerson('manager', manager)}
						</Box>
					)}
					{agent && (
						<Box>
							<Text fontSize='x-small' color='gray.400' mb={-1}>
								Agent
							</Text>
							{renderPerson('agent', agent)}
						</Box>
					)}
					{closedBy && (
						<Box>
							<Text fontSize='x-small' color='gray.400' mb={-1}>
								Closed By
							</Text>
							{renderPerson('closedBy', closedBy)}
						</Box>
					)}
					{salesPerson && (
						<Box>
							<Text fontSize='x-small' color='gray.400' mb={-1}>
								Sales Person
							</Text>
							{renderPerson('salesPerson', salesPerson)}
						</Box>
					)}
				</SimpleGrid>

				{/* Financial highlights */}
				<SimpleGrid columns={2} spacing={3}>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Unit Price
						</Text>
						<Text fontSize='xs' fontWeight='bold' color='brand.600'>
							{formatCurrency(unitPrice, currency)}
						</Text>
					</Box>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Booking
						</Text>
						<Flex align='baseline' gap={1}>
							<Text fontSize='xs' fontWeight='bold'>
								{formatCurrency(bookingAmountPaid, currency)}
							</Text>
							{/* <Text fontSize='xs' color='gray.500'>
								({bookingPercent}%)
							</Text> */}
						</Flex>
					</Box>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Downpayment
						</Text>
						<Flex align='baseline' gap={1}>
							<Text fontSize='xs' fontWeight='bold'>
								{formatCurrency(downpaymentPaid, currency)}
							</Text>
							{/* <Text fontSize='xs' color='gray.500'>
								({downpaymentPercent}%)
							</Text> */}
						</Flex>
					</Box>
					<Box bg='gray.50' p={2} borderRadius='md'>
						<Text fontSize='x-small' color='gray.500' mb={1}>
							Deal Closed On
						</Text>
						<Text fontSize='xs' fontWeight='bold'>
							{formatPostDate(createdAt)}
						</Text>
					</Box>
				</SimpleGrid>

				{/* Bottom row with date and action */}
				<Flex justify='flex-end' gap='2' align='center'>
					<Button
						size='xs'
						variant='outline'
						colorScheme='green'
						rightIcon={<FaPen size={14} />}
						onClick={() => onEditDeal(deal)}
					>
						Edit
					</Button>
					<Button
						size='xs'
						variant='outline'
						colorScheme='brand'
						rightIcon={<FiChevronRight size={14} />}
						onClick={() => onViewDetails(deal)}
					>
						Details
					</Button>
				</Flex>
			</Stack>
		</Box>
	);
};
