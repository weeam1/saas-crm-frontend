import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Td,
	Th,
	Text,
	Badge,
	IconButton,
	HStack,
	Flex,
	Icon,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FiEdit, FiEye, FiXCircle } from 'react-icons/fi';

import TableLoading from 'components/loading/TableLoading';
import NoData from 'components/Message/NoData';
import { StatusBadge } from './_shared/StatusBadge';
import { formatCurrency } from './../../../../utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import ViewDealInvoice from './_shared/ViewDealInvoice';

const DealTable = ({
	data,
	isLoading,
	isRefetching,
	handleEdit,
	hanldeView,
	handleCancelled,
}) => {
	const columns = [
		// 'Lead ID',
		'Client Name',
		'Manager',
		'Agent',
		'Project',
		'Unit',
		'Type',
		'Unit Price',
		'Closed By',
		'Deal Date',

		// 'Booking %',
		// 'Downpayment %',
		'Deal Status',
		'SPA',
		'Invoice',
		'Commission',
		'Action',
	];

	const loginedUser = JSON.parse(localStorage.getItem('user'));
	const isAdmin = loginedUser?.role === 'superAdmin';

	return (
		<Box
			maxHeight='80vh'
			overflowY='auto'
			scrollBehavior='smooth'
			borderRadius='md'
			boxShadow='sm'
			bg='white'
		>
			<Table variant='striped' size='md'>
				<Thead position='sticky' top={0} bg='white' zIndex={2}>
					<Tr>
						{columns.map((header, index) => (
							<Th key={index} bg='brand.200' py={4}>
								<Text
									fontSize='sm'
									fontWeight='600'
									color='gray.700'
									textAlign='center'
									textTransform='capitalize'
								>
									{header}
								</Text>
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody fontSize='sm'>
					{isLoading || isRefetching ? (
						<TableLoading columns={columns} length={10} py='4' />
					) : data?.length > 0 ? (
						data.map((deal, i) => (
							<Tr key={deal._id}>
								{/* <Td minW='100px' textAlign='left'>
									{deal.lead?.intID || 'N/A'}
								</Td> */}
								<Td minW='200px' textAlign='left'>
									{deal.lead?.leadName || 'N/A'}
								</Td>
								<Td minW='200px' textAlign='center' color='brand.500'>
									{deal.manager?.fullName
										? deal.manager.fullName
										: 'No Manager'}
								</Td>
								<Td minW='200px' textAlign='center' color='brand.500'>
									{deal.agent?.fullName ? deal.agent.fullName : 'No Agent'}
								</Td>
								<Td textAlign='center' minW='250px'>
									{deal.projectName || 'N/A'}
								</Td>
								<Td textAlign='center'>{deal.unitNumber || 'N/A'}</Td>
								<Td textAlign='center' minW='150px'>
									{deal.unitType || 'N/A'}
								</Td>
								{/* <Td textAlign='center'>{deal.salesPerson || 'N/A'}</Td> */}

								<Td textAlign='center' minW='200px'>
									{formatCurrency(deal.unitPrice, deal.currency)}
								</Td>

								<Td textAlign='center' minW='250px'>
									{deal?.closedBy?.fullName || 'N/A'}
								</Td>

								<Td minW='250px' textAlign='center'>
									{format(new Date(deal?.createdAt), 'd MMM, yyyy h:mm a')}
								</Td>

								<Td textAlign='center' minW='60px'>
									<Badge
										colorScheme={
											deal.dealStatus === 'Confirmed' ? 'green' : 'red'
										}
									>
										{deal.dealStatus}
									</Badge>
								</Td>
								{/* 
								<Td textAlign='center' minW='50px'>
									{deal.bookingPercent || 0}%
								</Td>
								<Td textAlign='center'>{deal.downpaymentPercent || 0}%</Td> */}

								<Td textAlign='center' minW='100px'>
									<Badge colorScheme={deal.spaDone ? 'green' : 'red'}>
										{deal.spaDone ? 'Signed' : 'Pending'}
									</Badge>
								</Td>

								<Td textAlign='center' minW='80px'>
									<HStack>
										<Badge colorScheme={deal.invoiceSent ? 'blue' : 'red'}>
											{deal.invoiceSent ? 'Yes' : 'No'}
										</Badge>

										<ViewDealInvoice deal={deal} />
									</HStack>
								</Td>

								<Td textAlign='center' minW='100px'>
									<StatusBadge status={deal.commissionStatus} />
								</Td>

								<Td textAlign='left' minWidth='150px'>
									{isAdmin && (
										<CustomTooltip label='Edit'>
											<IconButton
												icon={<FiEdit />}
												aria-label='Edit'
												variant='ghost'
												size='sm'
												colorScheme='green'
												onClick={() => handleEdit(deal)}
											/>
										</CustomTooltip>
									)}

									<CustomTooltip label='View'>
										<IconButton
											icon={<FiEye />}
											aria-label='View'
											variant='ghost'
											size='sm'
											colorScheme='brand'
											onClick={() => hanldeView(deal)}
										/>
									</CustomTooltip>

									{deal.dealStatus !== 'Cancelled' && (
										<>
											<CustomTooltip label='Deal Cancelled' variant='error'>
												<IconButton
													icon={<FiXCircle />}
													aria-label='cancelled'
													variant='ghost'
													size='sm'
													colorScheme='red'
													onClick={() => handleCancelled(deal._id)}
												/>
											</CustomTooltip>
										</>
									)}
								</Td>
							</Tr>
						))
					) : (
						(!isRefetching || !isLoading) && (
							<Tr>
								<Td colSpan={columns.length} textAlign='center' py={4}>
									<NoData label='deals' />
								</Td>
							</Tr>
						)
					)}
				</Tbody>
			</Table>
		</Box>
	);
};

export default DealTable;
