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
// 	Tooltip,
// 	Badge,
// } from '@chakra-ui/react';
// import { FiEdit2, FiTrash2 } from 'react-icons/fi';
// import NoData from 'components/Message/NoData';
// import TableLoading from 'components/loading/TableLoading';
// import { useEffect, useState } from 'react';
// import { useDeleteItemMutation } from 'api/apiSlice';
// import { format } from 'date-fns';
// import { toast } from 'react-toastify';
// import ConfirmationModal from 'components/Message/ConfirmationModal';

// export const SubCategoryTable = ({
// 	data = [],
// 	isLoading,
// 	handleOpenEdit,
// 	removeItem,
// }) => {
// 	const columns = [
// 		{ key: 'name', label: 'Sub Category', width: '150px' },
// 		{ key: 'category', label: 'Category', width: '150px' },
// 		{ key: 'description', label: 'Description', width: '300px' },
// 		{ key: 'isActive', label: 'Status', width: '100px' },
// 		{ key: 'createdBy', label: 'Created By', width: '150px' },
// 		{ key: 'createdAt', label: 'Created At', width: '200px' },
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
// 			case 'isActive':
// 				return (
// 					<Badge
// 						colorScheme={value ? 'green' : 'red'}
// 						variant='subtle'
// 						px={3}
// 						py={1}
// 						borderRadius='full'
// 						fontSize='sm'
// 						textTransform='capitalize'
// 					>
// 						{value ? 'Active' : 'Inactive'}
// 					</Badge>
// 				);
// 			case 'colorCode':
// 				return (
// 					<Flex align='center' justify='center' gap={2}>
// 						<Box
// 							w='18px'
// 							h='18px'
// 							bg={value}
// 							borderRadius='full'
// 							border='1px solid #ccc'
// 						/>
// 						<Text>{value}</Text>
// 					</Flex>
// 				);
// 			case 'createdBy':
// 				return value?.fullName || value?.username || '-';
// 			case 'category':
// 				return value?.name || '-';
// 			case 'createdAt':
// 				return format(new Date(value), 'MMM d, yyyy h:mm a');
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
// 				path: `finance/expenses/subcategories/${selectedId}`,
// 			}).unwrap();
// 			toast.success('Subcategory deleted successfully');
// 			removeItem(selectedId);
// 		} catch (error) {
// 			toast.error(error?.data?.message || 'Failed to delete category');
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
// 									<NoData label='subcategory' />
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
// 										fontSize='sm'
// 										minW={column.width}
// 										textAlign={
// 											['name'].includes(column.key) ? 'left' : 'center'
// 										}
// 										fontWeight={
// 											['name', 'category'].includes(column.key)
// 												? 'semibold'
// 												: 'medium'
// 										}
// 										// bg={
// 										// 	column.key === 'category'
// 										// 		? row[column.key]?.colorCode
// 										// 		: 'inherit'
// 										// }
// 										color='gray.700'
// 									>
// 										{column.key === 'actions' ? (
// 											<Flex align='center' justify='center' gap={3}>
// 												<Tooltip label='Edit'>
// 													<IconButton
// 														aria-label='Edit'
// 														icon={<FiEdit2 />}
// 														size='sm'
// 														colorScheme='blue'
// 														variant='ghost'
// 														onClick={() => handleOpenEdit(row)}
// 													/>
// 												</Tooltip>
// 												<Tooltip label='Delete'>
// 													<IconButton
// 														aria-label='Delete'
// 														icon={<FiTrash2 />}
// 														size='sm'
// 														colorScheme='red'
// 														variant='ghost'
// 														onClick={() => handleDelete(row._id)}
// 													/>
// 												</Tooltip>
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
// 					title='Delete Sub Category'
// 					message={`Are you sure you want to delete this sub category?`}
// 					confirmText='Yes, Delete'
// 					cancelText='Cancel'
// 					isLoading={isDeleting}
// 				/>
// 			)}
// 		</Box>
// 	);
// };

// export default SubCategoryTable;

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
	Badge,
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
			}, 500);
		}
		return () => clearTimeout(timer);
	}, [isLoading]);

	const formatValue = (key, value) => {
		switch (key) {
			case 'isActive':
				return (
					<Badge
						variant={'subtle'}
						colorScheme={value ? 'green' : 'red'}
						px={3}
						py={1}
						borderRadius='full'
						fontSize='11px'
						fontWeight='500'
						textTransform='capitalize'
					>
						{value ? 'Active' : 'Inactive'}
					</Badge>
				);
			case 'colorCode':
				return (
					<Flex align='center' justify='center' gap={2}>
						<Box
							w='18px'
							h='18px'
							bg={value}
							borderRadius='full'
							border='1px solid'
							borderColor='border.default'
						/>
						<Text fontSize='13px' color='text.body' fontFamily='mono'>
							{value}
						</Text>
					</Flex>
				);
			case 'createdBy':
				return value?.fullName || value?.username || '-';
			case 'category':
				return (
					<Flex align='center' gap={2}>
						{value?.colorCode && (
							<Box w='10px' h='10px' bg={value.colorCode} borderRadius='full' />
						)}
						<Text fontWeight='500' color='text.body'>
							{value?.name || '-'}
						</Text>
					</Flex>
				);
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
				path: `finance/expenses/subcategories/${selectedId}`,
			}).unwrap();
			toast.success('Subcategory deleted successfully');
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
									<NoData label='subcategory' />
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
										textAlign={
											['name'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={
											['name', 'category'].includes(column.key)
												? 'semibold'
												: 'medium'
										}
										color='text.body'
										borderBottom='1px solid'
										borderBottomColor='border.subtle'
									>
										{column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={2}>
												<Tooltip label='Edit' placement='top' hasArrow>
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
												</Tooltip>
												<Tooltip label='Delete' placement='top' hasArrow>
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
					message='Are you sure you want to delete this sub category?'
					confirmText='Yes, Delete'
					cancelText='Cancel'
					isLoading={isDeleting}
				/>
			)}
		</Box>
	);
};

export default SubCategoryTable;
