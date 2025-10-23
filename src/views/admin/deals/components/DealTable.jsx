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
	HStack,
	Button,
	Icon,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import TableLoading from 'components/loading/TableLoading';
import NoData from 'components/Message/NoData';
import { StatusBadge } from './_shared/StatusBadge';
import { formatCurrency } from './../../../../utils/helpers';
import ViewDealInvoice from './_shared/ViewDealInvoice';
import useUserSession from 'hooks/useUserSession';
import MenuOptions from './_shared/MenuOptions';
import { useEffect, useState } from 'react';
import { FiEye } from 'react-icons/fi';
import CustomTooltip from 'components/shared/CustomTooltip';

const DealTable = ({
	data,
	isLoading,
	isRefetching,
	handleEdit,
	handleView,
	handleCancelled,
	handleDelete,
}) => {
	const columns = [
		// 'Lead ID',
		'Client Name',
		'Manager',
		'Agent',
		'Project',
		'Unit',
		'Type',
		'Deal Amount',
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

	const { user, isSuperAdmin } = useUserSession();

	const [tableLoading, setTableLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setTableLoading(false);
		}, 1000); // 1s delay

		return () => clearTimeout(timer);
	}, []);

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
				<Thead position='sticky' top={0} bg='white' zIndex={1}>
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
					{isLoading || isRefetching || tableLoading ? (
						<TableLoading columns={columns} length={10} py='4' />
					) : data?.length > 0 ? (
						data.map((deal, i) => (
							<Tr key={deal._id}>
								{/* <Td minW='100px' textAlign='left'>
									{deal.lead?.intID || 'N/A'}
								</Td> */}
								<Td
									minW='160px'
									textAlign='left'
									display='flex'
									alignItems='center'
									gap='2'
								>
									<CustomTooltip label='view deal details' variant='light'>
										<Icon
											as={FiEye}
											boxSize='10px'
											onClick={() => handleView(deal)}
											color='gray.600'
											_hover={{ color: 'brand.400' }}
											cursor='pointer'
										/>
									</CustomTooltip>

									<Text fontSize='sm'>{deal.lead?.leadName || 'N/A'}</Text>
								</Td>
								<Td
									maxWidth='200px'
									isTruncated
									// minW='200px'
									textAlign='center'
									color='brand.500'
								>
									{deal.manager?.fullName
										? deal.manager.fullName
										: 'No Manager'}
								</Td>
								<Td minWidth='150px' textAlign='center' color='brand.500'>
									{deal.agent?.fullName ? deal.agent.fullName : 'No Agent'}
								</Td>
								<Td textAlign='center' minWidth='150px'>
									{deal.projectName || 'N/A'}
								</Td>
								<Td textAlign='center'>{deal.unitNumber || 'N/A'}</Td>
								<Td textAlign='center' minW='120px'>
									{deal.unitType || 'N/A'}
								</Td>
								{/* <Td textAlign='center'>{deal.salesPerson || 'N/A'}</Td> */}

								<Td textAlign='center' minW='150px'>
									{formatCurrency(deal.bookingAmountPaid, deal.currency)}
								</Td>

								<Td textAlign='center' minW='200px'>
									{deal?.closedBy?.fullName || 'N/A'}
								</Td>

								<Td minW='150px' textAlign='center'>
									{format(new Date(deal?.dealDate), 'd MMM, yyyy h:mm a')}
								</Td>

								<Td textAlign='center' minW='50px'>
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

								<Td textAlign='center' minW='50px'>
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

								<Td textAlign='center' minW='50px'>
									{deal?.commissionStatus ? (
										<StatusBadge status={deal.commissionStatus} />
									) : (
										'N/A'
									)}
								</Td>

								{/* <Td textAlign='left' minWidth='200px'>
									{isSuperAdmin && (
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
											onClick={() => handleView(deal)}
										/>
									</CustomTooltip>

									{deal.dealStatus !== 'Cancelled' &&
										(isSuperAdmin || deal.closedBy._id === user._id) && (
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

									<IconButton
										icon={<MdDelete />}
										aria-label='delete'
										variant='ghost'
										size='sm'
										colorScheme='gray'
										onClick={() => handleDelete(deal._id)}
									/>
								</Td> */}
								<Td textAlign='left' minWidth='50px'>
									<MenuOptions
										user={user}
										deal={deal}
										isSuperAdmin={isSuperAdmin}
										handleView={handleView}
										handleDelete={handleDelete}
										handleCancelled={handleCancelled}
										handleEdit={handleEdit}
									/>
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
