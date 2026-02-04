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
import { useEffect, useState } from 'react';
import { FiEdit, FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { useDeleteItemMutation } from 'api/apiSlice';

import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import CustomTooltip from 'components/shared/CustomTooltip';
import { FaEdit } from 'react-icons/fa';
import UserProfileCell from '../payroll/components/UserProfileCell';

const UserLeadLimitTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeItem,
}) => {
	const columns = [
		{ key: 'user', label: 'User', width: '200px' },
		{ key: 'limit', label: `Lead's Limit`, width: '200px' },
		{ key: 'createdAt', label: 'Created Date', width: '200px' },
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
			case 'createdAt':
				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
			case 'user':
				return value?.fullName || value?.username || '-';
			case 'limit':
				return (
					<Badge bg='brand.100' px={2} py={2} borderRadius='md'>
						{value?.toLocaleString() || 0}
					</Badge>
				);
			default:
				return value ?? '-';
		}
	};

	const handleDelete = (id) => {
		setSelectedId(id);
		setDeleteModalOpen(true);
	};

	const handleConfirmRemove = async () => {
		try {
			await deleteItem({
				path: `lead/user-lead-limits/${selectedId}`,
			}).unwrap();
			toast.success('User lead limit deleted successfully');
			removeItem(selectedId);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to delete User lead limit');
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
								textAlign={['user'].includes(column.key) ? 'left' : 'center'}
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
									<NoData label='user lead limit' />
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
										isTruncated={true}
										fontSize='sm'
										minW={column.width}
										maxW='400px'
										textAlign={
											['user'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={column.key === 'user' ? 'semibold' : 'medium'}
										color='gray.700'
									>
										{column.key === 'user' ? (
											<UserProfileCell user={row.user} />
										) : column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={3}>
												<CustomTooltip label='Edit'>
													<IconButton
														aria-label='Edit'
														icon={<FaEdit />}
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
														onClick={() => handleDelete(row.user?._id)}
													/>
												</CustomTooltip>
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
					title='Delete User Lead Limit'
					message={`Are you sure you want to delete this User Lead Limit?`}
					confirmText='Yes, Delete'
					cancelText='Cancel'
					isLoading={isDeleting}
				/>
			)}
		</Box>
	);
};

export default UserLeadLimitTable;
