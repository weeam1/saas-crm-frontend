// import {
// 	Box,
// 	Table,
// 	Thead,
// 	Tbody,
// 	Tr,
// 	Th,
// 	Td,
// 	Text,
// 	Flex,
// 	Badge,
// 	IconButton,
// 	Tooltip,
// 	useClipboard,
// 	Button,
// 	HStack,
// } from '@chakra-ui/react';
// import TableLoading from 'components/loading/TableLoading';
// import NoData from 'components/Message/NoData';
// import { FiEdit, FiTrash } from 'react-icons/fi';
// import { CopyIcon } from '@chakra-ui/icons';
// import CustomTooltip from 'components/shared/CustomTooltip';
// import UserAvatar from 'components/shared/UserAvatar';
// import { useNavigate } from 'react-router-dom';
// import { buttonStyle } from './../../leadPool-v2/components/constants';

// const UsersTable = ({
// 	data,
// 	isLoading,
// 	isFetching,
// 	handleEdit,
// 	handleDelete,
// }) => {
// 	const columns = [
// 		'User',
// 		'Email',
// 		'Phone ID',
// 		'Business ID',
// 		'Agency',
// 		'Status',
// 		'Action',
// 	];

// 	const navigate = useNavigate();

// 	return (
// 		<Box
// 			maxH={'70vh'}
// 			overflowY='auto'
// 			borderRadius='md'
// 			boxShadow='sm'
// 			bg='white'
// 			py='2'
// 		>
// 			<Table variant='striped' size='md'>
// 				<Thead position='sticky' top={0} bg='white' zIndex={2}>
// 					<Tr>
// 						{columns.map((header, index) => (
// 							<Th key={index} bg='brand.200' py={4}>
// 								<Text
// 									fontSize='sm'
// 									fontWeight='600'
// 									color='gray.700'
// 									textAlign='center'
// 									textTransform='capitalize'
// 								>
// 									{header}
// 								</Text>
// 							</Th>
// 						))}
// 					</Tr>
// 				</Thead>

// 				<Tbody>
// 					{isLoading || isFetching ? (
// 						<TableLoading columns={columns} length={10} py='4' />
// 					) : data?.length > 0 ? (
// 						data.map((item) => (
// 							<Tr key={item._id}>
// 								<Td minW='300px' isTruncated>
// 									<Flex align='center' gap={2}>
// 										<UserAvatar
// 											size='sm'
// 											name={item?.user?.fullName}
// 											src={item?.user?.profileImage}
// 										/>
// 										{item?.user?.fullName}
// 									</Flex>
// 								</Td>
// 								<Td minW='300px' textAlign='center'>
// 									{item?.user.username || 'N/A'}
// 								</Td>
// 								<Td minW='200px' textAlign='left'>
// 									<CopyPhoneCell value={item?.phoneNumber} />
// 								</Td>
// 								<Td minW='200px' textAlign='left'>
// 									<CopyPhoneCell value={item?.businessId} />
// 								</Td>

// 								<Td textAlign='center'>{item?.user?.agency?.name || 'N/A'}</Td>
// 								<Td textAlign='center'>
// 									<Badge
// 										colorScheme={item?.isActive ? 'green' : 'red'}
// 										variant='subtle'
// 										px={3}
// 										py={1}
// 										borderRadius='full'
// 										fontSize='xs'
// 									>
// 										{item?.isActive ? 'Enable' : 'Disable'}
// 									</Badge>
// 								</Td>
// 								<Td textAlign='center' minWidth='200px'>
// 									<HStack gap='2' alig='center'>
// 										{item?.businessId && (
// 											<Button
// 												{...buttonStyle}
// 												colorScheme='brand'
// 												onClick={() =>
// 													navigate(
// 														`/whatsapp/settings/message_templates/${item?.businessId}`
// 													)
// 												}
// 											>
// 												Templates
// 											</Button>
// 										)}
// 										<Tooltip label='Edit' hasArrow placement='top'>
// 											<IconButton
// 												icon={<FiEdit />}
// 												aria-label='Edit'
// 												variant='ghost'
// 												size='sm'
// 												colorScheme='green'
// 												onClick={() => handleEdit(item)}
// 											/>
// 										</Tooltip>

// 										<Tooltip label='Delete' hasArrow placement='top'>
// 											<IconButton
// 												icon={<FiTrash />}
// 												aria-label='Delete'
// 												variant='ghost'
// 												size='sm'
// 												colorScheme='red'
// 												onClick={() => handleDelete(item._id)}
// 											/>
// 										</Tooltip>
// 									</HStack>
// 								</Td>
// 							</Tr>
// 						))
// 					) : (
// 						<Tr>
// 							<Td colSpan={columns.length} textAlign='center' py={4}>
// 								<NoData label='users' />
// 							</Td>
// 						</Tr>
// 					)}
// 				</Tbody>
// 			</Table>
// 		</Box>
// 	);
// };

// const CopyPhoneCell = ({ value }) => {
// 	const { hasCopied, onCopy } = useClipboard(value || '');

// 	if (!value) return <Text textAlign='center'>N/A</Text>;

// 	return (
// 		<Flex align='center' gap={2}>
// 			<Text>{value}</Text>
// 			<CustomTooltip
// 				label={hasCopied ? `${value} Copied!` : 'Copy'}
// 				hasArrow
// 				closeOnClick={false}
// 			>
// 				<IconButton
// 					icon={<CopyIcon />}
// 					size='xs'
// 					fontSize='xs'
// 					variant='ghost'
// 					aria-label='Copy phone number'
// 					onClick={onCopy}
// 				/>
// 			</CustomTooltip>
// 		</Flex>
// 	);
// };

// export default UsersTable;

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
	Icon,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'components/Message/NoData';
import { FiEdit, FiTrash, FiMessageSquare } from 'react-icons/fi';
import { CopyIcon } from '@chakra-ui/icons';
import CustomTooltip from 'components/shared/CustomTooltip';
import UserAvatar from 'components/shared/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const WhatsAppUsersTable = ({
	data,
	isLoading,
	isFetching,
	handleEdit,
	handleDelete,
}) => {
	const navigate = useNavigate();

	const columns = useMemo(
		() => [
			{ key: 'user', label: 'User', align: 'left', width: '280px' },
			{ key: 'email', label: 'Email', align: 'center', width: '250px' },
			{ key: 'phone', label: 'Phone ID', align: 'left', width: '200px' },
			{
				key: 'businessId',
				label: 'Business ID',
				align: 'left',
				width: '200px',
			},
			{ key: 'agency', label: 'Agency', align: 'center', width: '180px' },
			{ key: 'status', label: 'Status', align: 'center', width: '100px' },
			{ key: 'action', label: 'Action', align: 'center', width: '280px' },
		],
		[],
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
			<Box overflowX='auto'       maxHeight="70vh"
      minH="70vh" overflowY='auto'>
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
						{isLoading || isFetching ? (
							<TableLoading columns={columns} length={8} py='4' />
						) : data?.length > 0 ? (
							data.map((item, index) => (
								<Tr
									key={item._id || index}
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
										<Flex align='center' gap={3}>
											<UserAvatar
												size='sm'
												name={item?.user?.fullName}
												src={item?.user?.profileImage}
												bg='navy.600'
											/>
											<Text
												fontSize='14px'
												fontWeight='600'
												color='text.heading'
											>
												{item?.user?.fullName || 'N/A'}
											</Text>
										</Flex>
									</Td>

									{/* Email */}
									<Td
										px='4'
										py='12px'
										textAlign='center'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<Text fontSize='13px' color='text.body'>
											{item?.user?.username || 'N/A'}
										</Text>
									</Td>

									{/* Phone ID */}
									<Td
										px='4'
										py='12px'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<CopyCell value={item?.phoneNumber} />
									</Td>

									{/* Business ID */}
									<Td
										px='4'
										py='12px'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<CopyCell value={item?.businessId} />
									</Td>

									{/* Agency */}
									<Td
										px='4'
										py='12px'
										textAlign='center'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<Text fontSize='13px' color='text.body'>
											{item?.user?.agency?.name || 'N/A'}
										</Text>
									</Td>

									{/* Status */}
									<Td
										px='4'
										py='12px'
										textAlign='center'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<Badge
											variant={item?.isActive ? 'solid' : 'outline'}
											colorScheme={item?.isActive ? 'green' : 'red'}
											borderRadius='full'
											px={3}
											py={1}
											fontSize='11px'
											fontWeight='semibold'
										>
											{item?.isActive ? 'Active' : 'Inactive'}
										</Badge>
									</Td>

									{/* Actions */}
									<Td
										px='4'
										py='12px'
										borderBottom='1px solid'
										borderColor='border.subtle'
									>
										<HStack spacing='2' justify='center'>
											{item?.businessId && (
												<Tooltip
													label='Message Templates'
													placement='top'
													hasArrow
												>
													<Button
														size='sm'
														variant='outline'
														leftIcon={<FiMessageSquare />}
														fontSize='11px'
														borderRadius='lg'
														onClick={() =>
															navigate(
																`/whatsapp/settings/message_templates/${item?.businessId}`,
															)
														}
														_hover={{
															bg: 'rgba(212, 175, 55, 0.1)',
															borderColor: 'gold.primary',
															color: 'gold.primary',
														}}
													>
														Templates
													</Button>
												</Tooltip>
											)}

											<Tooltip label='Edit User' placement='top' hasArrow>
												<IconButton
													icon={<FiEdit />}
													aria-label='Edit'
													variant='ghost'
													size='sm'
													color='blue.400'
													onClick={() => handleEdit(item)}
													_hover={{
														color: 'blue.300',
														bg: 'rgba(59, 130, 246, 0.1)',
														transform: 'scale(1.05)',
													}}
													_active={{ transform: 'scale(0.95)' }}
													transition='all 0.15s'
												/>
											</Tooltip>

											<Tooltip label='Delete User' placement='top' hasArrow>
												<IconButton
													icon={<FiTrash />}
													aria-label='Delete'
													variant='ghost'
													size='sm'
													color='red.400'
													onClick={() => handleDelete(item._id)}
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
						) : (
							<Tr>
								<Td colSpan={columns.length} py={12} textAlign='center'>
									<NoData label='whatsapp users' />
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>
		</Box>
	);
};

// Copy Cell Component
const CopyCell = ({ value }) => {
	const { hasCopied, onCopy } = useClipboard(value || '');

	if (!value)
		return (
			<Text color='text.muted' fontSize='13px'>
				—
			</Text>
		);

	return (
		<Flex align='center' gap={2}>
			<Text fontSize='13px' color='text.body' fontFamily='mono'>
				{value}
			</Text>
			<Tooltip label={hasCopied ? 'Copied!' : 'Copy'} placement='top' hasArrow>
				<IconButton
					icon={<CopyIcon />}
					size='xs'
					variant='ghost'
					aria-label='Copy'
					onClick={onCopy}
					color='text.muted'
					_hover={{ color: 'gold.primary' }}
				/>
			</Tooltip>
		</Flex>
	);
};

export default WhatsAppUsersTable;
