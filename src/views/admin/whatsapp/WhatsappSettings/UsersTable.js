import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Avatar,
	Flex,
	Switch,
	Badge,
	IconButton,
	Tooltip,
	Button,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { constant } from 'constant';

import NoData from 'components/Message/NoData';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UsersTable = ({
	data,
	isLoading,
	isFetching,
	handleEdit,
	handleDelete,
}) => {
	const columns = [
		'User',
		'Email',
		'Phone ID',
		'Whatsapp',
		'Agency',
		'Status',
		'Action',
	];

	const navigate = useNavigate();

	return (
		<Box
			maxH={'70vh'}
			overflowY='auto'
			borderRadius='md'
			boxShadow='sm'
			bg='white'
		>
			<Table variant='striped' size='md'>
				<Thead position='sticky' top={0} bg='white' zIndex={2}>
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

				<Tbody>
					{isLoading || isFetching ? (
						<TableLoading columns={columns} length={10} py='4' />
					) : data?.length > 0 ? (
						data.map((item) => (
							<Tr key={item._id}>
								<Td>
									<Flex align='center' gap={2}>
										<Avatar
											size='sm'
											name={item?.user?.fullName}
											src={item?.user?.profileImage}
										/>
										{item?.user?.fullName}
									</Flex>
								</Td>
								<Td textAlign='center'>{item?.user.username || 'N/A'}</Td>
								<Td textAlign='center'>{item?.phoneNumber || 'N/A'}</Td>
								<Td textAlign='center'>
									<Button
										leftIcon={<FaWhatsapp />}
										aria-label='Go to WhatsApp'
										variant='solid'
										size='sm'
										colorScheme='whatsapp'
										onClick={() =>
											navigate(`/whatsapp?phoneNumber=${item.phoneNumber}`)
										}
									>
										WhatsApp
									</Button>
								</Td>
								<Td textAlign='center'>{item?.user?.agency?.name || 'N/A'}</Td>
								<Td textAlign='center'>
									<Badge
										colorScheme={item?.isActive ? 'green' : 'red'}
										variant='subtle'
										px={3}
										py={1}
										borderRadius='full'
										fontSize='xs'
									>
										{item?.isActive ? 'Enable' : 'Disable'}
									</Badge>
								</Td>
								<Td textAlign='center'>
									<Tooltip label='Edit' hasArrow placement='top'>
										<IconButton
											icon={<FiEdit />}
											aria-label='Edit'
											variant='ghost'
											size='sm'
											colorScheme='green'
											onClick={() => handleEdit(item)}
										/>
									</Tooltip>

									<Tooltip label='Delete' hasArrow placement='top'>
										<IconButton
											icon={<FiTrash />}
											aria-label='Delete'
											variant='ghost'
											size='sm'
											colorScheme='red'
											onClick={() => handleDelete(item._id)}
										/>
									</Tooltip>
								</Td>
							</Tr>
						))
					) : (
						<Tr>
							<Td colSpan={columns.length} textAlign='center' py={4}>
								<NoData label='users' />
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</Box>
	);
};

export default UsersTable;
