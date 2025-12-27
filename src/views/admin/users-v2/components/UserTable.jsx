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
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import NoData from 'components/Message/NoData';
import TableLoading from 'components/loading/TableLoading';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { formatCurrency } from 'utils/helpers';
import CustomTooltip from 'components/shared/CustomTooltip';
import { getBadgeColors } from 'utils/colorUtils';
import { salaryTypes, userCommissionTypes } from 'utils/options';
import UserCoinsView from './UserCoinsView';
import UserAvatarWithStatus from 'components/table/UserAvatarWithStatus';

const UserTable = ({ data = [], isLoading, handleEditUser }) => {
	const columns = [
		{ key: 'user', label: 'User', width: '200px' },
		{ key: 'roles', label: 'Role', width: '150px' },
		{ key: 'phoneNumber', label: 'Phone', width: '150px' },
		{ key: 'agency', label: 'Agency', width: '200px' },
		{ key: 'coins', label: 'Coins', width: '180px' },
		{ key: 'isActive', label: 'Status', width: '100px' },
		{ key: 'createdAt', label: 'Joining Date', width: '100px' },
		// { key: 'salaryType', label: 'Salary Type', width: '180px' },
		{ key: 'actions', label: 'Actions', width: '120px' },
	];

	const [delayedLoading, setDelayedLoading] = useState(isLoading);
	const [selectedId, setSelectedId] = useState(null);

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
			// case 'paymentMethod': {
			// 	const color = paymentColors[value] || 'gray';
			// 	return (
			// 		<Badge
			// 			colorScheme={color}
			// 			variant='subtle'
			// 			fontSize='.9em'
			// 			px={4}
			// 			py={2}
			// 			borderRadius='full'
			// 			textTransform='capitalize'
			// 		>
			// 			{value || 'N/A'}
			// 		</Badge>
			// 	);
			// }

			case 'roles': {
				const roleName = value?.roleName.replace(/^./, (c) => c.toUpperCase());
				// ?.replace(/([A-Z])/g, ' $1')

				const { bg, text } = getBadgeColors(roleName);

				return (
					<Badge
						bg={bg}
						color={text}
						variant='subtle'
						fontSize='.9em'
						px={4}
						py={2}
						borderRadius='full'
						textTransform='capitalize'
					>
						{roleName}
					</Badge>
				);
			}

			case 'agency': {
				const { bg, text } = getBadgeColors(value?.name);

				return (
					<Badge
						bg={bg}
						color={text}
						variant='subtle'
						fontSize='.9em'
						px={4}
						py={2}
						borderRadius='full'
						textTransform='capitalize'
					>
						{value?.name}
					</Badge>
				);
			}
			case 'isActive': {
				return (
					<Badge
						colorScheme={value ? 'green' : 'red'}
						variant='subtle'
						fontSize='.9em'
						px={4}
						py={2}
						borderRadius='full'
						textTransform='capitalize'
					>
						{value ? 'Active' : 'Inactive'}
					</Badge>
				);
			}

			case 'salaryType':
				const type = salaryTypes?.find((item) => item.value === value)?.label;
				const { bg, text } = getBadgeColors(type);

				return (
					<Badge
						bg={bg}
						color={text}
						variant='subtle'
						fontSize='.9em'
						px={4}
						py={2}
						borderRadius='full'
						textTransform='capitalize'
					>
						{type}
					</Badge>
				);

			case 'createdAt':
				return value ? format(new Date(value), 'MMM d, yyyy') : 'N/A';
			default:
				return value || 'N/A';
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
			<Table variant='simple' size='sm'>
				<Thead
					position='sticky'
					top={0}
					zIndex={1}
					boxShadow='0 2px 2px -1px rgba(0,0,0,0.06)'
					borderTopLeftRadius='20px'
					borderTopRightRadius='20px'
					bg='gray.50'
				>
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
									<NoData label='user' />
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
											['name', 'user'].includes(column.key) ? 'left' : 'center'
										}
										fontWeight={column.key === 'name' ? 'semibold' : 'medium'}
										color='gray.700'
									>
										{column.key === 'user' ? (
											<UserAvatarWithStatus user={row} />
										) : column.key === 'coins' ? (
											<UserCoinsView user={row} />
										) : column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={3}>
												<CustomTooltip label='View'>
													<IconButton
														aria-label='View'
														icon={<FiEye />}
														size='sm'
														colorScheme='teal'
														variant='ghost'
														// onClick={() => setView({ modal: true, data: row })}
													/>
												</CustomTooltip>
												<CustomTooltip label='Edit'>
													<IconButton
														aria-label='Edit'
														icon={<FiEdit2 />}
														size='sm'
														colorScheme='blue'
														variant='ghost'
														onClick={() => handleEditUser(row)}
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
		</Box>
	);
};

export default UserTable;
