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
// import { paymentColors } from '../helpers';
// import CustomTooltip from 'components/shared/CustomTooltip';

// export const IncomingTable = ({
// 	data = [],
// 	isLoading,
// 	handleOpenEdit,
// 	removeItem,
// 	setView,
// }) => {
// 	const columns = [
// 		{ key: 'createdAt', label: 'Created Date', width: '200px' },
// 		{ key: 'description', label: 'Description', width: '300px' },
// 		{ key: 'paymentMethod', label: 'Payment Method', width: '300px' },
// 		{ key: 'amount', label: 'Amount', width: '180px' },
// 		{ key: 'agency', label: 'Agency', width: '180px' },
// 		{ key: 'addedBy', label: 'Added By', width: '150px' },
// 		{ key: 'actions', label: 'Actions', width: '120px' },
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
// 			case 'paymentMethod': {
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
// 			case 'addedBy':
// 				return value?.fullName || value?.username || '-';
// 			case 'createdAt':
// 				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
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
// 				path: `finance/cash/incoming/${selectedId}`,
// 			}).unwrap();
// 			toast.success('Incoming balance deleted successfully');
// 			removeItem(selectedId);
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to delete Incoming balance');
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
// 								py='4'
// 								textAlign={['name'].includes(column.key) ? 'left' : 'center'}
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
// 									<NoData label='incoming balance' />
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
// 										py={3}
// 										px={3}
// 										wordBreak='break-word'
// 										isTruncated={true}
// 										fontSize='sm'
// 										minW={column.width}
// 										maxW='400px'
// 										textAlign={
// 											['name'].includes(column.key) ? 'left' : 'center'
// 										}
// 										fontWeight={column.key === 'name' ? 'semibold' : 'medium'}
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
// 												<CustomTooltip label='Edit'>
// 													<IconButton
// 														aria-label='Edit'
// 														icon={<FiEdit2 />}
// 														size='sm'
// 														colorScheme='blue'
// 														variant='ghost'
// 														onClick={() => handleOpenEdit(row)}
// 													/>
// 												</CustomTooltip>
// 												<CustomTooltip label='Delete'>
// 													<IconButton
// 														aria-label='Delete'
// 														icon={<FiTrash2 />}
// 														size='sm'
// 														colorScheme='red'
// 														variant='ghost'
// 														onClick={() => handleDelete(row._id)}
// 													/>
// 												</CustomTooltip>
// 											</Flex>
// 										) : ['amount', 'totalAmount'].includes(column.key) ? (
// 											<Text>
// 												{formatCurrency(
// 													row[column.key],
// 													row['agency']?.currency || 'AED'
// 												)}
// 											</Text>
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
// 					title='Delete Cash'
// 					message={`Are you sure you want to delete this Incoming balance?`}
// 					confirmText='Yes, Delete'
// 					cancelText='Cancel'
// 					isLoading={isDeleting}
// 				/>
// 			)}
// 		</Box>
// 	);
// };

// export default IncomingTable;

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
import { paymentColors } from '../helpers';
import CustomTooltip from 'components/shared/CustomTooltip';

export const IncomingTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeItem,
	setView,
}) => {
	const columns = [
		{ key: 'createdAt', label: 'Created Date', width: '200px' },
		{ key: 'description', label: 'Description', width: '300px' },
		{ key: 'paymentMethod', label: 'Payment Method', width: '300px' },
		{ key: 'amount', label: 'Amount', width: '180px' },
		{ key: 'agency', label: 'Agency', width: '180px' },
		{ key: 'addedBy', label: 'Added By', width: '150px' },
		{ key: 'actions', label: 'Actions', width: '120px' },
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
			case 'paymentMethod': {
				const color = paymentColors[value] || 'gray';

				return (
					<Badge
						// variant='outline'
						// bg={color === 'gray' ? 'rgba(160, 174, 192, 0.15)' : undefined}
						colorScheme={color}
						variant='subtle'
						borderRadius='full'
						px={4}
						py={1.5}
						fontWeight='semibold'
						fontSize='11px'
						textTransform='capitalize'
					>
						{value || 'N/A'}
					</Badge>
				);
			}
			case 'agency':
				return value?.name || 'N/A';
			case 'addedBy':
				return value?.fullName || value?.username || '-';
			case 'createdAt':
				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
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
				path: `finance/cash/incoming/${selectedId}`,
			}).unwrap();
			toast.success('Incoming balance deleted successfully');
			removeItem(selectedId);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to delete Incoming balance');
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
								textAlign={['name'].includes(column.key) ? 'left' : 'center'}
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
									<NoData label='incoming balance' />
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
										py={3}
										px={4}
										wordBreak='break-word'
										fontSize='13px'
										minW={column.width}
										maxW='400px'
										textAlign={
											['name'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={column.key === 'name' ? 'semibold' : 'medium'}
										color='text.body'
										borderBottom='1px solid'
										borderBottomColor='border.subtle'
									>
										{column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={2}>
												<CustomTooltip label='View'>
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
												<CustomTooltip label='Edit'>
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
												<CustomTooltip label='Delete'>
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
											</Flex>
										) : ['amount', 'totalAmount'].includes(column.key) ? (
											<Text
												fontWeight='600'
												color='gold.primary'
												fontFamily='mono'
											>
												{formatCurrency(
													row[column.key],
													row['agency']?.currency || 'AED',
												)}
											</Text>
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
					title='Delete Cash'
					message={`Are you sure you want to delete this Incoming balance?`}
					confirmText='Yes, Delete'
					cancelText='Cancel'
					isLoading={isDeleting}
				/>
			)}
		</Box>
	);
};

export default IncomingTable;
