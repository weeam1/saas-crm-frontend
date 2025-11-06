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
	Tooltip,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState } from 'react';
import { useDeleteItemMutation } from 'api/apiSlice';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ConfirmationModal from 'components/Message/ConfirmationModal';

export const SubCategoryTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeItem,
}) => {
	const columns = [
		{ key: 'name', label: 'Sub Category', width: '150px' },
		{ key: 'category', label: 'Category', width: '150px' },
		{ key: 'description', label: 'Description', width: '300px' },
		{ key: 'isActive', label: 'Status', width: '100px' },
		{ key: 'createdBy', label: 'Created By', width: '150px' },
		{ key: 'createdAt', label: 'Created At', width: '200px' },
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
			}, 1000);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const formatValue = (key, value) => {
		switch (key) {
			case 'isActive':
				return value ? 'Active' : 'Inactive';
			case 'colorCode':
				return (
					<Flex align='center' justify='center' gap={2}>
						<Box
							w='18px'
							h='18px'
							bg={value}
							borderRadius='full'
							border='1px solid #ccc'
						/>
						<Text>{value}</Text>
					</Flex>
				);
			case 'createdBy':
				return value?.fullName || value?.username || '-';
			case 'category':
				return value?.name || '-';
			case 'createdAt':
				return format(new Date(value), 'MMM d, yyyy h:mm a');
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
				path: `finance/expenses/categories/${selectedId}`,
			}).unwrap();
			toast.success('Category deleted successfully');
			removeItem(selectedId);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to delete category');
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
									<NoData label='category' />
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
										fontWeight={
											['name', 'category'].includes(column.key)
												? 'semibold'
												: 'medium'
										}
										// bg={
										// 	column.key === 'category'
										// 		? row[column.key]?.colorCode
										// 		: 'inherit'
										// }
										color='gray.700'
									>
										{column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={3}>
												<Tooltip label='Edit'>
													<IconButton
														aria-label='Edit'
														icon={<FiEdit2 />}
														size='sm'
														colorScheme='blue'
														variant='ghost'
														onClick={() => handleOpenEdit(row)}
													/>
												</Tooltip>
												<Tooltip label='Delete'>
													<IconButton
														aria-label='Delete'
														icon={<FiTrash2 />}
														size='sm'
														colorScheme='red'
														variant='ghost'
														onClick={() => handleDelete(row._id)}
													/>
												</Tooltip>
											</Flex>
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
					title='Delete Sub Category'
					message={`Are you sure you want to delete this sub category?`}
					confirmText='Yes, Delete'
					cancelText='Cancel'
					isLoading={isDeleting}
				/>
			)}
		</Box>
	);
};

export default SubCategoryTable;
