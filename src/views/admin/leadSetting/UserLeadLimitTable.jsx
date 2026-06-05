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
// import { useEffect, useState } from 'react';
// import { FiEdit, FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
// import { format } from 'date-fns';
// import { toast } from 'react-toastify';

// import { useDeleteItemMutation } from 'api/apiSlice';

// import NoData from 'components/Message/NoData';
// import TableLoading from 'components/loading/TableLoading';
// import ConfirmationModal from 'components/Message/ConfirmationModal';
// import CustomTooltip from 'components/shared/CustomTooltip';
// import { FaEdit } from 'react-icons/fa';
// import UserProfileCell from '../payroll/components/UserProfileCell';
// import { BiReset } from 'react-icons/bi';

// const UserLeadLimitTable = ({
// 	data = [],
// 	isLoading,
// 	leadSettings,
// 	handleOpenEdit,
// 	handleResetLimit,
// 	removeItem,
// }) => {
// 	const columns = [
// 		{ key: 'user', label: 'User', width: '200px' },
// 		{ key: 'limit', label: `Lead's Limit`, width: '200px' },
// 		{ key: 'createdAt', label: 'Created Date', width: '200px' },
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
// 			case 'createdAt':
// 				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
// 			case 'user':
// 				return value?.fullName || value?.username || '-';
// 			case 'limit':
// 				return (
// 					<Badge bg='brand.100' px={2} py={2} borderRadius='md'>
// 						{value?.toLocaleString() || 0}
// 					</Badge>
// 				);
// 			default:
// 				return value ?? '-';
// 		}
// 	};

// 	const handleDelete = (id) => {
// 		setSelectedId(id);
// 		setDeleteModalOpen(true);
// 	};

// 	const handleConfirmRemove = async () => {
// 		try {
// 			await deleteItem({
// 				path: `lead/user-lead-limits/${selectedId}`,
// 			}).unwrap();
// 			toast.success('User lead limit deleted successfully');
// 			removeItem(selectedId);
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to delete User lead limit');
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
// 									<NoData label='user lead limit' />
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
// 											['user'].includes(column.key) ? 'left' : 'center'
// 										}
// 										fontWeight={column.key === 'user' ? 'semibold' : 'medium'}
// 										color='gray.700'
// 									>
// 										{column.key === 'user' ? (
// 											<UserProfileCell user={row.user} />
// 										) : column.key === 'actions' ? (
// 											<Flex align='center' justify='center' gap={3}>
// 												<CustomTooltip
// 													label={
// 														row.limit === leadSettings?.agentLeadLimit
// 															? 'Already Reset'
// 															: 'Reset Limit'
// 													}
// 												>
// 													<IconButton
// 														aria-label='Reset Limit'
// 														icon={<BiReset />}
// 														size='sm'
// 														colorScheme='cyan'
// 														disabled={
// 															row.limit === leadSettings?.agentLeadLimit
// 														}
// 														variant='ghost'
// 														onClick={() => handleResetLimit(row)}
// 													/>
// 												</CustomTooltip>
// 												<CustomTooltip label='Edit'>
// 													<IconButton
// 														aria-label='Edit'
// 														icon={<FaEdit />}
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
// 														onClick={() => handleDelete(row.user?._id)}
// 													/>
// 												</CustomTooltip>
// 											</Flex>
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
// 					title='Delete User Lead Limit'
// 					message={`Are you sure you want to delete this User Lead Limit?`}
// 					confirmText='Yes, Delete'
// 					cancelText='Cancel'
// 					isLoading={isDeleting}
// 				/>
// 			)}
// 		</Box>
// 	);
// };

// export default UserLeadLimitTable;

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
	HStack,
	Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { useDeleteItemMutation } from 'api/apiSlice';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import ConfirmationModal from 'components/Message/ConfirmationModal';
import { FaEdit, FaUndoAlt } from 'react-icons/fa';
import UserProfileCell from '../payroll/components/UserProfileCell';

const UserLeadLimitTable = ({
	data = [],
	isLoading,
	leadSettings,
	handleOpenEdit,
	handleResetLimit,
	removeItem,
}) => {
	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

	const columns = useMemo(
		() => [
			{ key: 'user', label: 'User', icon: null, width: '220px', align: 'left' },
			{
				key: 'limit',
				label: "Lead's Limit",
				icon: null,
				width: '180px',
				align: 'center',
			},
			{
				key: 'createdAt',
				label: 'Created Date',
				icon: null,
				width: '200px',
				align: 'center',
			},
			{
				key: 'actions',
				label: 'Actions',
				icon: null,
				width: '140px',
				align: 'center',
			},
		],
		[],
	);

	useEffect(() => {
		let timer;
		if (isLoading) {
			setDelayedLoading(true);
		} else {
			timer = setTimeout(() => setDelayedLoading(false), 500);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const formatValue = useCallback(
		(key, value, row) => {
			switch (key) {
				case 'createdAt':
					return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
				case 'limit':
					const isReset = row?.limit === leadSettings?.agentLeadLimit;
					return (
						<Badge
							variant={isReset ? 'outline' : 'brand'}
							borderRadius='full'
							px={3}
							py={1}
							fontSize='14px'
							fontWeight='semibold'
						>
							{value?.toLocaleString() || 0}
						</Badge>
					);
				default:
					return value ?? '—';
			}
		},
		[leadSettings],
	);

	const handleDelete = useCallback((row) => {
		setSelectedItem(row);
		setDeleteModalOpen(true);
	}, []);

	const handleConfirmRemove = useCallback(async () => {
		if (!selectedItem?._id) return;

		try {
			await deleteItem({
				path: `lead/user-lead-limits/${selectedItem._id}`,
			}).unwrap();
			toast.success('User lead limit deleted successfully');
			removeItem(selectedItem._id);
		} catch (error) {
			toast.error(error?.data?.message || 'Failed to delete user lead limit');
		} finally {
			setDeleteModalOpen(false);
			setSelectedItem(null);
		}
	}, [selectedItem, deleteItem, removeItem]);

	const isResetDisabled = useCallback(
		(row) => {
			return row?.limit === leadSettings?.agentLeadLimit;
		},
		[leadSettings],
	);

	return (
		<Box
			bg='bg.surface'
			border='1px solid'
			borderColor='border.default'
			borderRadius='xl'
			overflow='hidden'
			boxShadow='card'
		>
			<Box overflowX='auto'  minH='50vh'  maxH='calc(100vh - 200px)' overflowY='auto'>
				<Table variant='simple' size='md'>
					{/* Header */}
					<Thead position='sticky' top={0} zIndex={1}>
						<Tr bg='bg.elevated'>
							{columns.map((column) => (
								<Th
									key={column.key}
									py='14px'
									px='4'
									fontSize='11px'
									fontWeight='700'
									letterSpacing='0.08em'
									textTransform='uppercase'
									color='gold.primary'
									whiteSpace='nowrap'
									width={column.width}
									textAlign={column.align}
								>
									{column.label}
								</Th>
							))}
						</Tr>
					</Thead>

					{/* Body */}
					<Tbody>
						{isLoading || delayedLoading ? (
							<TableLoading columns={columns} length={8} py='4' />
						) : data.length === 0 ? (
							<Tr>
								<Td colSpan={columns.length} py={12} textAlign='center'>
									<Center>
										<NoData label='user lead limits' />
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
									{/* User */}
									<Td
										px='4'
										py='12px'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<UserProfileCell user={row.user} />
									</Td>

									{/* Lead Limit */}
									<Td
										px='4'
										py='12px'
										textAlign='center'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										{formatValue('limit', row.limit, row)}
									</Td>

									{/* Created Date */}
									<Td
										px='4'
										py='12px'
										textAlign='center'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<Text fontSize='13px' color='text.invert'>
											{formatValue('createdAt', row.createdAt)}
										</Text>
									</Td>

									{/* Actions */}
									<Td
										px='4'
										py='12px'
										textAlign='center'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<HStack spacing='2' justify='center'>
											{/* Reset Button */}
											<Tooltip
												label={
													isResetDisabled(row)
														? 'Already at default limit'
														: 'Reset to default limit'
												}
												placement='top'
												hasArrow
											>
												<IconButton
													aria-label='Reset Limit'
													icon={<FaUndoAlt />}
													size='sm'
													variant='ghost'
													color='blue.400'
													isDisabled={isResetDisabled(row)}
													onClick={() => handleResetLimit(row)}
													_hover={{
														color: 'blue.300',
														bg: 'rgba(59, 130, 246, 0.1)',
														transform: 'scale(1.05)',
													}}
													_active={{ transform: 'scale(0.95)' }}
													transition='all 0.15s'
												/>
											</Tooltip>

											{/* Edit Button */}
											<Tooltip label='Edit Limit' placement='top' hasArrow>
												<IconButton
													aria-label='Edit'
													icon={<FaEdit />}
													size='sm'
													variant='ghost'
													color='gold.primary'
													onClick={() => handleOpenEdit(row)}
													_hover={{
														color: 'gold.light',
														bg: 'rgba(212, 175, 55, 0.1)',
														transform: 'scale(1.05)',
													}}
													_active={{ transform: 'scale(0.95)' }}
													transition='all 0.15s'
												/>
											</Tooltip>

											{/* Delete Button */}
											<Tooltip label='Delete Limit' placement='top' hasArrow>
												<IconButton
													aria-label='Delete'
													icon={<FiTrash2 />}
													size='sm'
													variant='ghost'
													color='red.400'
													onClick={() => handleDelete(row)}
													_hover={{
														color: 'red.300',
														bg: 'rgba(245, 101, 101, 0.1)',
														transform: 'scale(1.05)',
													}}
													_active={{ transform: 'scale(0.95)' }}
													transition='all 0.15s'
												/>
											</Tooltip>
										</HStack>
									</Td>
								</Tr>
							))
						)}
					</Tbody>
				</Table>
			</Box>

			{/* Delete Confirmation Modal */}
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleConfirmRemove}
				title='Delete User Lead Limit'
				message={`Are you sure you want to delete the lead limit for "${selectedItem?.user?.fullName || selectedItem?.user?.username || 'this user'}"?`}
				confirmText='Yes, Delete'
				cancelText='Cancel'
				isLoading={isDeleting}
			/>
		</Box>
	);
};

export default UserLeadLimitTable;
