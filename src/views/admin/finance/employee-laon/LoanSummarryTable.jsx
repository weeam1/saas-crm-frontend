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
import { getAvatarColor, getInitials, paymentColors } from '../helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import { constant } from 'constant';
import { Link, useNavigate } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const LoanSummaryTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeItem,
	setView,
}) => {
	const columns = [
		{ key: 'user', label: 'Employee', width: '300px' },
		// { key: 'description', label: 'Description', width: '300px' },
		{ key: 'totalLoans', label: 'Loans', width: '80px' },
		{ key: 'activeLoans', label: 'Active', width: '80px' },
		{ key: 'closedLoans', label: 'Closed', width: '80px' },
		{ key: 'totalTenureMonths', label: 'Total Months', width: '80px' },
		{ key: 'totalBorrowedAmount', label: 'Borrowed', width: '150px' },
		{ key: 'totalRemainingAmount', label: 'Remaining', width: '150px' },
		{ key: 'monthlyInstallment', label: 'Installment', width: '150px' },
		{ key: 'status', label: 'Status', width: '80px' },
		{ key: 'updatedAt', label: 'Last Update', width: '200px' },
		{ key: 'details', label: 'Details', width: '50px' },
	];

	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	// const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	// const [selectedId, setSelectedId] = useState(null);

	// const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

	const navigate = useNavigate();

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
					<Box
						as={Link}
						to={`/finance/employee-loans/${value?._id}`}
						display='flex'
						alignItems='center'
						_hover={{ bg: 'gray.100', transition: 'background 0.2s ease' }}
						cursor='pointer'
					>
						<Avatar
							src={
								value?.profileImage
									? ` ${constant.baseUrl}${value?.profileImage}`
									: undefined
							}
							name={value?.fullName || value?.username || undefined}
							bg={getAvatarColor(value?.fullName || value?.username || '')}
							boxSize='40px'
							mr={3}
						>
							{/* Avatar will show initials automatically from `name` prop,
            but in case you want to override: */}
							{!value?.profileImage && !value?.fullName && (
								<Text fontSize='sm' fontWeight='600'>
									{getInitials(value?.username || '')}
								</Text>
							)}
						</Avatar>

						<Box>
							<Text fontWeight='600' fontSize='sm'>
								{value?.fullName || value?.username || '-'}
							</Text>
							{value?.username && (
								<Text fontSize='xs' color='gray.500'>
									@{value.username}
								</Text>
							)}
						</Box>
					</Box>
				);
			case 'createdAt':
			case 'updatedAt':
				return value ? format(new Date(value), 'MMM d, yyyy h:mm a') : 'N/A';
			case 'activeLoans':
			case 'totalLoans':
			case 'closedLoans':
				return value || 0;
			default:
				return value || '-';
		}
	};

	// const handleDelete = (id) => {
	// 	setSelectedId(id);
	// 	setDeleteModalOpen(true);
	// };

	// const handleConfirmRemove = async () => {
	// 	try {
	// 		await deleteItem({
	// 			path: `finance/cash/incoming/${selectedId}`,
	// 		}).unwrap();
	// 		toast.success('Incoming balance deleted successfully');
	// 		removeItem(selectedId);
	// 	} catch (error) {
	// 		toast.error(error?.data?.message || 'Failed to delete Incoming balance');
	// 	} finally {
	// 		setDeleteModalOpen(false);
	// 	}
	// };

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
								py='6'
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
									<NoData label='employee loans' />
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
										py={4}
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
										{column.key === 'details' ? (
											<CustomTooltip label='Loan details'>
												<IconButton
													aria-label='Loan details'
													icon={<FaExternalLinkAlt />}
													size='sm'
													colorScheme='teal'
													variant='ghost'
													onClick={() =>
														navigate(
															`/finance/employee-loans/${row['user']?._id}`
														)
													}
												/>
											</CustomTooltip>
										) : [
												'totalBorrowedAmount',
												'totalRemainingAmount',
												'monthlyInstallment',
										  ].includes(column.key) ? (
											<Text>
												{formatCurrency(
													row[column.key],
													row['user']?.agency?.currency || 'AED'
												)}
											</Text>
										) : column.key === 'status' ? (
											<Badge
												colorScheme={
													row['activeLoans'] === 0 ? 'green' : 'yellow'
												}
												variant='subtle'
												fontSize='.9em'
												px={4}
												py={2}
												borderRadius='full'
												textTransform='uppercase'
											>
												{row['activeLoans'] === 0 ? 'Completed' : 'Pending'}
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
			{/* {isDeleteModalOpen && (
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
			)} */}
		</Box>
	);
};

export default LoanSummaryTable;
