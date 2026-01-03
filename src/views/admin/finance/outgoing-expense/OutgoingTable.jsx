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
import CustomTooltip from 'components/shared/CustomTooltip';

export const OutgoingTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeItem,
	setView,
}) => {
	const columns = [
		{ key: 'expenseNumber', label: 'EXP NO', width: '150px' },
		{ key: 'date', label: 'Expense Date', width: '200px' },
		{ key: 'category', label: 'Category', width: '150px' },
		{ key: 'subCategory', label: 'Subcategory', width: '150px' },
		{ key: 'amount', label: 'Amount', width: '180px' },
		{ key: 'vatPercent', label: 'Vat %', width: '100px' },
		{ key: 'totalAmount', label: 'Net Amount', width: '200px' },
		{ key: 'addedBy', label: 'Added By', width: '150px' },
		{ key: 'createdAt', label: 'Created At', width: '200px' },
		{ key: 'actions', label: 'Actions', width: '120px' },
		// { key: 'description', label: 'Description', width: '300px' },
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
			}, 1000);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const formatValue = (key, value) => {
		switch (key) {
			case 'subCategory':
			case 'category':
				return value?.name || 'Others';
			case 'addedBy':
				return value?.fullName || value?.username || '-';
			case 'createdAt':
				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
			case 'date':
				return value ? format(new Date(value), 'MMM d, yyyy') : 'N/A';
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
				path: `finance/cash/outgoing/${selectedId}`,
			}).unwrap();
			toast.success('Expense deleted successfully');
			removeItem(selectedId);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to delete expense');
		} finally {
			setDeleteModalOpen(false);
		}
	};

	return (
		<Box
			my='2'
			overflowX='auto'
			overflowY='auto'
			maxH='calc(100vh - 200px)'
			borderWidth='1px'
			borderColor='gray.200'
			rounded='xl'
			boxShadow='sm'
			bg='white'
		>
			<Table variant='striped' size='sm'>
				<Thead bg='brand.200' position='sticky' top={0} zIndex={1}>
					<Tr>
						{columns.map((column) => (
							<Th
								key={column.key}
								whiteSpace='nowrap'
								textTransform='capitalize'
								fontSize='md'
								py='4'
								textAlign={['name'].includes(column.key) ? 'left' : 'center'}
								fontWeight='semibold'
								color='gray.700'
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
							<Td colSpan={columns.length} py={10}>
								<Center>
									<NoData label='outgoing expense' />
								</Center>
							</Td>
						</Tr>
					) : (
						data.map((row, index) => (
							<Tr
								key={row._id || index}
								_hover={{ bg: 'gray.50' }}
								bg={index % 2 === 0 ? 'white' : 'gray.25'}
								transition='background-color 0.2s ease-in-out'
							>
								{columns.map((column) => (
									<Td
										key={column.key}
										py={3}
										px={3}
										wordBreak='break-word'
										fontSize='sm'
										minW={column.width}
										textAlign={
											['name'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={column.key === 'name' ? 'semibold' : 'medium'}
										color='gray.700'
									>
										{column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={3}>
												<CustomTooltip label='View'>
													<IconButton
														aria-label='View'
														icon={<FiEye />}
														size='sm'
														colorScheme='teal'
														variant='ghost'
														onClick={() => setView({ modal: true, data: row })}
													/>
												</CustomTooltip>
												<CustomTooltip label='Edit'>
													<IconButton
														aria-label='Edit'
														icon={<FiEdit2 />}
														size='sm'
														colorScheme='blue'
														variant='ghost'
														onClick={() => handleOpenEdit(row)}
													/>
												</CustomTooltip>
												<CustomTooltip label='Delete'>
													<IconButton
														aria-label='Delete'
														icon={<FiTrash2 />}
														size='sm'
														colorScheme='red'
														variant='ghost'
														onClick={() => handleDelete(row._id)}
													/>
												</CustomTooltip>
											</Flex>
										) : ['amount', 'totalAmount'].includes(column.key) ? (
											<Text>
												{formatCurrency(
													row[column.key],
													row['agency']?.currency || 'AED'
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
					message={`Are you sure you want to delete this outgoing cash?`}
					confirmText='Yes, Delete'
					cancelText='Cancel'
					isLoading={isDeleting}
				/>
			)}
		</Box>
	);
};

export default OutgoingTable;
