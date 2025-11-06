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
	useColorModeValue,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState } from 'react';
import { useDeleteItemMutation } from 'api/apiSlice';
import { format } from 'date-fns';

export const CategoryTable = ({
	data = [],
	isLoading,
	handleOpenEdit,
	removeCategory,
}) => {
	const columns = [
		{ key: 'name', label: 'Name' },
		{ key: 'description', label: 'Description' },
		// { key: 'colorCode', label: 'Color' },
		{ key: 'isActive', label: 'Status' },
		{ key: 'createdBy', label: 'Created By' },
		{ key: 'createdAt', label: 'Created At' },
		// { key: 'updatedAt', label: 'Updated At' },
		{ key: 'actions', label: 'Actions' },
	];

	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	const [deleteUser] = useDeleteItemMutation();

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
			case 'createdAt':
				return format(new Date(value), 'MMM d, yyyy h:mm a');
			default:
				return value || '-';
		}
	};

	const handleDelete = (id) => {
		removeCategory(id);
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
								minW={column.key === 'description' ? '250px' : 'auto'}
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
										minW='250px'
										textAlign={
											['name'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={column.key === 'name' ? 'semibold' : 'medium'}
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
												{/* <Tooltip label='Delete'>
													<IconButton
														aria-label='Delete'
														icon={<FiTrash2 />}
														size='sm'
														colorScheme='red'
														variant='ghost'
														onClick={() => handleDelete(row._id)}
													/>
												</Tooltip> */}
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
		</Box>
	);
};

export default CategoryTable;
