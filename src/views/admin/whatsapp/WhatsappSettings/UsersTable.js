import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Flex,
	Badge,
	IconButton,
	Tooltip,
	useClipboard,
	Button,
	HStack,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'components/Message/NoData';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { CopyIcon } from '@chakra-ui/icons';
import CustomTooltip from 'components/shared/CustomTooltip';
import UserAvatar from 'components/shared/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { buttonStyle } from './../../leadPool-v2/components/constants';

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
		'Business ID',
		'Agency',
		'Status',
		'Action',
	];

	console.log({ data });

	const navigate = useNavigate();

	return (
		<Box
			maxH={'70vh'}
			overflowY='auto'
			borderRadius='md'
			boxShadow='sm'
			bg='white'
			py='2'
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
								<Td minW='300px' isTruncated>
									<Flex align='center' gap={2}>
										<UserAvatar
											size='sm'
											name={item?.user?.fullName}
											src={item?.user?.profileImage}
										/>
										{item?.user?.fullName}
									</Flex>
								</Td>
								<Td minW='300px' textAlign='center'>
									{item?.user.username || 'N/A'}
								</Td>
								<Td minW='200px' textAlign='left'>
									<CopyPhoneCell value={item?.phoneNumber} />
								</Td>
								<Td minW='200px' textAlign='left'>
									<CopyPhoneCell value={item?.businessId} />
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
								<Td textAlign='center' minWidth='200px'>
									<HStack gap='2' alig='center'>
										{item?.businessId && (
											<Button
												{...buttonStyle}
												colorScheme='brand'
												onClick={() =>
													navigate(
														`/whatsapp/settings/message_templates/${item?.businessId}`
													)
												}
											>
												Templates
											</Button>
										)}
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
									</HStack>
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

const CopyPhoneCell = ({ value }) => {
	const { hasCopied, onCopy } = useClipboard(value || '');

	if (!value) return <Text textAlign='center'>N/A</Text>;

	return (
		<Flex align='center' gap={2}>
			<Text>{value}</Text>
			<CustomTooltip
				label={hasCopied ? `${value} Copied!` : 'Copy'}
				hasArrow
				closeOnClick={false}
			>
				<IconButton
					icon={<CopyIcon />}
					size='xs'
					fontSize='xs'
					variant='ghost'
					aria-label='Copy phone number'
					onClick={onCopy}
				/>
			</CustomTooltip>
		</Flex>
	);
};

export default UsersTable;
