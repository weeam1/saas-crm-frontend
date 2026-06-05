// import {
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	Flex,
// 	IconButton,
// 	Box,
// 	Text,
// 	Center,
// 	Badge,
// 	Avatar,
// } from '@chakra-ui/react';
// import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
// import NoData from 'components/Message/NoData';
// import TableLoading from 'components/loading/TableLoading';
// import { useEffect, useState } from 'react';
// import { useDeleteItemMutation } from 'api/apiSlice';
// import { format } from 'date-fns';
// import ConfirmationModal from 'components/Message/ConfirmationModal';
// import { toast } from 'react-toastify';
// import { formatCurrency } from 'utils/helpers';
// import { getAvatarColor, getInitials, paymentColors } from '../../helpers';
// import CustomTooltip from 'components/shared/CustomTooltip';
// import { constant } from 'constant';

// const LoansTable = ({
// 	data = [],
// 	isLoading,
// 	handleOpenEdit,
// 	removeItem,
// 	setView,
// }) => {
// 	const columns = [
// 		{ key: 'createdBy', label: 'Added By', width: '250px' },
// 		{ key: 'type', label: 'Type', width: '180px' },
// 		{ key: 'description', label: 'Description', width: '250px' },
// 		{ key: 'amount', label: 'Amount', width: '100px' },
// 		{ key: 'paidAmount', label: 'Paid Amount', width: '100px' },
// 		{ key: 'tenure', label: 'Tenure', width: '80px' },
// 		// { key: 'remainingAmount', label: 'Remaining', width: '120px' },
// 		{ key: 'monthlyInstallment', label: 'Installment', width: '80px' },
// 		{ key: 'isActive', label: 'Status', width: '80px' },
// 		{ key: 'startDate', label: 'Start Date', width: '200px' },
// 		{ key: 'actions', label: 'Actions', width: '100px' },
// 	];

// 	const [delayedLoading, setDelayedLoading] = useState(isLoading);
// 	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
// 	const [selectedId, setSelectedId] = useState(null);

// 	const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

// 	useEffect(() => {
// 		let timer;
// 		if (isLoading) {
// 			setDelayedLoading(true);
// 		} else {
// 			timer = setTimeout(() => {
// 				setDelayedLoading(false);
// 			}, 1000);
// 		}
// 		return () => clearTimeout(timer);
// 	}, [isLoading]);

// 	const formatValue = (key, value) => {
// 		switch (key) {
// 			case 'active': {
// 				const color = paymentColors[value] || 'gray';
// 				return (
// 					<Badge
// 						colorScheme={color}
// 						variant='subtle'
// 						fontSize='.9em'
// 						px={4}
// 						py={2}
// 						borderRadius='full'
// 						textTransform='capitalize'
// 					>
// 						{value || 'N/A'}
// 					</Badge>
// 				);
// 			}

// 			case 'agency':
// 				return value?.name || 'N/A';
// 			case 'createdBy':
// 			case 'user':
// 				return (
// 					<Box display='flex' alignItems='left'>
// 						<Avatar
// 							src={
// 								value?.profileImage
// 									? ` ${constant.baseUrl}${value?.profileImage}`
// 									: undefined
// 							}
// 							name={value?.fullName || value?.username || undefined}
// 							bg={getAvatarColor(value?.fullName || value?.username || '')}
// 							boxSize='36px'
// 							mr={3}
// 						>
// 							{/* Avatar will show initials automatically from `name` prop,
//             but in case you want to override: */}
// 							{!value?.profileImage && !value?.fullName && (
// 								<Text fontSize='sm' fontWeight='600'>
// 									{getInitials(value?.username || '')}
// 								</Text>
// 							)}
// 						</Avatar>

// 						<Box>
// 							<Text fontWeight='600' fontSize='sm'>
// 								{value?.fullName || value?.username || '-'}
// 							</Text>
// 							{value?.username && (
// 								<Text fontSize='xs' color='gray.500'>
// 									{value.username}
// 								</Text>
// 							)}
// 						</Box>
// 					</Box>
// 				);
// 			case 'createdAt':
// 			case 'startDate':
// 				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
// 			case 'tenure':
// 			case 'monthsPaid':
// 			case 'monthsRemaining':
// 			case 'monthlyInstallment':
// 				return value || 0;
// 			default:
// 				return value || '-';
// 		}
// 	};

// 	const handleDelete = (id) => {
// 		setSelectedId(id);
// 		setDeleteModalOpen(true);
// 	};

// 	const handleConfirmRemove = async () => {
// 		try {
// 			await deleteItem({
// 				path: `finance/loans/${selectedId}`,
// 			}).unwrap();
// 			toast.success('Loan deleted successfully');
// 			removeItem(selectedId);
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to delete loan');
// 		} finally {
// 			setDeleteModalOpen(false);
// 		}
// 	};

// 	return (
// 		<Box
// 			my='2'
// 			overflowX='auto'
// 			overflowY='auto'
// 			maxH='calc(100vh - 200px)'
// 			borderWidth='1px'
// 			borderColor='gray.200'
// 			rounded='xl'
// 			boxShadow='sm'
// 			bg='white'
// 		>
// 			<Table variant='striped' size='sm'>
// 				<Thead bg='brand.200' position='sticky' top={0} zIndex={1}>
// 					<Tr>
// 						{columns.map((column) => (
// 							<Th
// 								key={column.key}
// 								whiteSpace='nowrap'
// 								textTransform='capitalize'
// 								fontSize='md'
// 								py='5'
// 								textAlign={['user'].includes(column.key) ? 'left' : 'center'}
// 								fontWeight='semibold'
// 								color='gray.700'
// 								minW={column.width}
// 							>
// 								{column.label}
// 							</Th>
// 						))}
// 					</Tr>
// 				</Thead>

// 				<Tbody>
// 					{isLoading || delayedLoading ? (
// 						<TableLoading columns={columns} length={10} py='4' />
// 					) : data.length === 0 ? (
// 						<Tr>
// 							<Td colSpan={columns.length} py={10}>
// 								<Center>
// 									<NoData label='loans' />
// 								</Center>
// 							</Td>
// 						</Tr>
// 					) : (
// 						data.map((row, index) => (
// 							<Tr
// 								key={row._id || index}
// 								_hover={{ bg: 'gray.50' }}
// 								bg={index % 2 === 0 ? 'white' : 'gray.25'}
// 								transition='background-color 0.2s ease-in-out'
// 							>
// 								{columns.map((column) => (
// 									<Td
// 										key={column.key}
// 										py={4}
// 										px={3}
// 										wordBreak='break-word'
// 										isTruncated={true}
// 										fontSize='sm'
// 										minW={column.width}
// 										maxW='400px'
// 										textAlign={
// 											['user'].includes(column.key) ? 'left' : 'center'
// 										}
// 										fontWeight={column.key === 'user' ? 'semibold' : 'medium'}
// 										color='gray.700'
// 									>
// 										{column.key === 'actions' ? (
// 											<Flex align='center' justify='center' gap={3}>
// 												<CustomTooltip label='View'>
// 													<IconButton
// 														aria-label='View'
// 														icon={<FiEye />}
// 														size='sm'
// 														colorScheme='teal'
// 														variant='ghost'
// 														onClick={() => setView({ modal: true, data: row })}
// 													/>
// 												</CustomTooltip>
// 												{row['monthsPaid'] === 0 && (
// 													<>
// 														<CustomTooltip label='Edit'>
// 															<IconButton
// 																aria-label='Edit'
// 																icon={<FiEdit2 />}
// 																size='sm'
// 																colorScheme='blue'
// 																variant='ghost'
// 																onClick={() => handleOpenEdit(row)}
// 															/>
// 														</CustomTooltip>
// 														<CustomTooltip label='Delete'>
// 															<IconButton
// 																aria-label='Delete'
// 																icon={<FiTrash2 />}
// 																size='sm'
// 																colorScheme='red'
// 																variant='ghost'
// 																onClick={() => handleDelete(row._id)}
// 															/>
// 														</CustomTooltip>
// 													</>
// 												)}
// 											</Flex>
// 										) : [
// 												'amount',
// 												'paidAmount',
// 												'remainingAmount',
// 												'monthlyInstallment',
// 										  ].includes(column.key) ? (
// 											<Text>
// 												{formatCurrency(
// 													row[column.key],
// 													row?.agency?.currency || 'AED',
// 												)}
// 											</Text>
// 										) : column.key === 'isActive' ? (
// 											<Badge
// 												colorScheme={
// 													row[column.key] === false ? 'green' : 'yellow'
// 												}
// 												variant='subtle'
// 												fontSize='.9em'
// 												px={4}
// 												py={2}
// 												borderRadius='full'
// 												textTransform='uppercase'
// 											>
// 												{row[column.key] === false ? 'Paid' : 'Pending'}
// 											</Badge>
// 										) : (
// 											formatValue(column.key, row[column.key])
// 										)}
// 									</Td>
// 								))}
// 							</Tr>
// 						))
// 					)}
// 				</Tbody>
// 			</Table>

// 			{/* Delete Confirmation Modal */}
// 			{isDeleteModalOpen && (
// 				<ConfirmationModal
// 					isOpen={isDeleteModalOpen}
// 					onClose={() => setDeleteModalOpen(false)}
// 					onConfirm={handleConfirmRemove}
// 					title='Delete Loan'
// 					message={`Are you sure you want to delete this Loan?`}
// 					confirmText='Yes, Delete'
// 					cancelText='Cancel'
// 					isLoading={isDeleting}
// 				/>
// 			)}
// 		</Box>
// 	);
// };

// export default LoansTable;

import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Flex,
	IconButton,
	Box,
	Text,
	Center,
	Badge,
	Avatar,
} from '@chakra-ui/react';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState } from 'react';
import { useDeleteItemMutation } from 'api/apiSlice';
import { format } from 'date-fns';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { toast } from 'react-toastify';
import { formatCurrency } from 'utils/helpers';
import { getAvatarColor, getInitials, paymentColors } from '../../helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import { constant } from 'constant';

const LoansTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeItem,
	setView,
}) => {
	const columns = [
		{ key: 'createdBy', label: 'Added By', width: '250px' },
		{ key: 'type', label: 'Type', width: '180px' },
		{ key: 'description', label: 'Description', width: '250px' },
		{ key: 'amount', label: 'Amount', width: '200px' },
		{ key: 'paidAmount', label: 'Paid Amount', width: '200px' },
		{ key: 'tenure', label: 'Tenure', width: '80px' },
		{ key: 'monthlyInstallment', label: 'Installment', width: '200px' },
		{ key: 'isActive', label: 'Status', width: '80px' },
		{ key: 'startDate', label: 'Start Date', width: '200px' },
		{ key: 'actions', label: 'Actions', width: '100px' },
	];

	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState(null);

	const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

	useEffect(() => {
		let timer;
		if (isLoading) {
			setDelayedLoading(true);
		} else {
			timer = setTimeout(() => {
				setDelayedLoading(false);
			}, 500);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const formatValue = (key, value) => {
		switch (key) {
			case 'active': {
				const color = paymentColors[value] || 'gray';
				return (
					<Badge
						colorScheme={color}
						variant='subtle'
						fontSize='.9em'
						px={4}
						py={2}
						borderRadius='full'
						textTransform='capitalize'
					>
						{value || 'N/A'}
					</Badge>
				);
			}
			case 'agency':
				return value?.name || 'N/A';
			case 'createdBy':
			case 'user':
				return (
					<Box display='flex' alignItems='center'>
						<Avatar
							src={
								value?.profileImage
									? `${constant.baseUrl}${value?.profileImage}`
									: undefined
							}
							name={value?.fullName || value?.username || undefined}
							border='1px solid'
							borderColor='border.default'
							boxSize='36px'
							mr={3}
						>
							{!value?.profileImage && !value?.fullName && (
								<Text fontSize='sm' fontWeight='600' color='text.body'>
									{getInitials(value?.username || '')}
								</Text>
							)}
						</Avatar>
						<Box textAlign='left'>
							<Text fontWeight='600' fontSize='sm' color='text.heading'>
								{value?.fullName || value?.username || '-'}
							</Text>
							{value?.username && (
								<Text fontSize='xs' color='text.muted'>
									{value.username}
								</Text>
							)}
						</Box>
					</Box>
				);
			case 'createdAt':
			case 'startDate':
				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
			case 'tenure':
			case 'monthsPaid':
			case 'monthsRemaining':
			case 'monthlyInstallment':
				return value || 0;
			default:
				return value || '-';
		}
	};

	const handleDelete = (id) => {
		setSelectedId(id);
		setDeleteModalOpen(true);
	};

	const handleConfirmRemove = async () => {
		try {
			await deleteItem({
				path: `finance/loans/${selectedId}`,
			}).unwrap();
			toast.success('Loan deleted successfully');
			removeItem(selectedId);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to delete loan');
		} finally {
			setDeleteModalOpen(false);
		}
	};

	return (
		<Box
			my='2'
			overflowX='auto'
			overflowY='auto'
			minH='60vh'
			maxH='calc(100vh - 200px)'
			borderWidth='1px'
			borderColor='border.default'
			borderRadius='xl'
			boxShadow='card'
			bg='bg.surface'
		>
			<Table variant='simple' size='md'>
				<Thead bg='bg.elevated' position='sticky' top={0} zIndex={1}>
					<Tr>
						{columns.map((column) => (
							<Th
								key={column.key}
								whiteSpace='nowrap'
								textTransform='uppercase'
								fontSize='11px'
								fontWeight='700'
								letterSpacing='0.08em'
								py='4'
								px='4'
								textAlign={['user'].includes(column.key) ? 'left' : 'center'}
								color='gold.primary'
								minW={column.width}
							>
								{column.label}
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading || delayedLoading ? (
						<TableLoading columns={columns} length={10} py='4' />
					) : data.length === 0 ? (
						<Tr>
							<Td colSpan={columns.length} py={12}>
								<Center>
									<NoData label='loans' />
								</Center>
							</Td>
						</Tr>
					) : (
						data.map((row, index) => (
							<Tr
								key={row._id || index}
								_hover={{ bg: 'bg.elevated' }}
								transition='background 0.15s'
							>
								{columns.map((column) => (
									<Td
										key={column.key}
										py={4}
										px={4}
										wordBreak='break-word'
										fontSize='13px'
										minW={column.width}
										maxW='400px'
										textAlign={
											['user'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={column.key === 'user' ? 'semibold' : 'medium'}
										color='text.body'
										borderBottom='1px solid'
										borderBottomColor='border.subtle'
									>
										{column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={2}>
												<CustomTooltip label='View' placement='top' hasArrow>
													<IconButton
														aria-label='View'
														icon={<FiEye />}
														size='sm'
														variant='ghost'
														color='blue.400'
														onClick={() => setView({ modal: true, data: row })}
														_hover={{
															bg: 'rgba(66, 153, 225, 0.1)',
															color: 'blue.300',
															transform: 'scale(1.05)',
														}}
														transition='all 0.15s'
													/>
												</CustomTooltip>
												{row['monthsPaid'] === 0 && (
													<>
														<CustomTooltip
															label='Edit'
															placement='top'
															hasArrow
														>
															<IconButton
																aria-label='Edit'
																icon={<FiEdit2 />}
																size='sm'
																variant='ghost'
																color='gold.primary'
																onClick={() => handleOpenEdit(row)}
																_hover={{
																	bg: 'rgba(212, 175, 55, 0.1)',
																	color: 'gold.primary',
																	transform: 'scale(1.05)',
																}}
																transition='all 0.15s'
															/>
														</CustomTooltip>
														<CustomTooltip
															label='Delete'
															placement='top'
															hasArrow
														>
															<IconButton
																aria-label='Delete'
																icon={<FiTrash2 />}
																size='sm'
																variant='ghost'
																color='red.400'
																onClick={() => handleDelete(row._id)}
																_hover={{
																	bg: 'rgba(245, 101, 101, 0.1)',
																	color: 'red.300',
																	transform: 'scale(1.05)',
																}}
																transition='all 0.15s'
															/>
														</CustomTooltip>
													</>
												)}
											</Flex>
										) : [
												'amount',
												'paidAmount',
												'remainingAmount',
												'monthlyInstallment',
										  ].includes(column.key) ? (
											<Text
												fontWeight='600'
												color='gold.primary'
												fontFamily='mono'
											>
												{formatCurrency(
													row[column.key],
													row?.agency?.currency || 'AED',
												)}
											</Text>
										) : column.key === 'isActive' ? (
											<Badge
												variant={row[column.key] === false ? 'gold' : 'subtle'}
												bg={
													row[column.key] === false
														? 'rgba(212, 175, 55, 0.1)'
														: 'rgba(238, 212, 67, 0.2)'
												}
												color={
													row[column.key] === false
														? 'gold.primary'
														: 'orange.400'
												}
												fontSize='11px'
												fontWeight='500'
												px={4}
												py={1.5}
												borderRadius='full'
												textTransform='uppercase'
											>
												{row[column.key] === false ? 'Paid' : 'Pending'}
											</Badge>
										) : (
											formatValue(column.key, row[column.key])
										)}
									</Td>
								))}
							</Tr>
						))
					)}
				</Tbody>
			</Table>

			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && (
				<ConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => setDeleteModalOpen(false)}
					onConfirm={handleConfirmRemove}
					title='Delete Loan'
					message='Are you sure you want to delete this Loan?'
					confirmText='Yes, Delete'
					cancelText='Cancel'
					isLoading={isDeleting}
				/>
			)}
		</Box>
	);
};

export default LoansTable;
