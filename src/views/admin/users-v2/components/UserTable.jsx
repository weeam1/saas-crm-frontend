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
import { salaryTypes } from 'utils/options';
import UserCoinsView from './UserCoinsView';
import UserAvatarWithStatus from 'components/table/UserAvatarWithStatus';
import { useNavigate } from 'react-router-dom';
import UserStatusToggle from './UserStatusToogle';
import { usePermissions } from 'hooks/usePermissions';
import UserRankingSelect from './UserRankingSelect';
import { FaUserShield } from 'react-icons/fa';
import { useModalColors } from 'hooks/useModalColors';

const UserTable = ({
	data = [],
	isLoading,
	handleEditUser,
	updateData,
	refetchUsers,
}) => {
	const colors = useModalColors();
	const columns = [
		{ key: 'user', label: 'User', width: '200px' },
		{ key: 'roles', label: 'Role', width: '150px' },
		{ key: 'phoneNumber', label: 'Phone', width: '150px' },
		{ key: 'agency', label: 'Agency', width: '200px' },
		{ key: 'coins', label: 'Coins', width: '180px' },
		{ key: 'ranking', label: 'Ranking', width: '180px' },
		{ key: 'salaryType', label: 'Salary Type', width: '180px' },
		{ key: 'createdAt', label: 'Joining Date', width: '100px' },
		{ key: 'isActive', label: 'Status', width: '100px' },
		{ key: 'actions', label: 'Actions', width: '120px' },
	];

	const [delayedLoading, setDelayedLoading] = useState(isLoading);

	const { hasPermission } = usePermissions();

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
			case 'roles': {
				const roleName = value?.roleName?.replace(/^./, (c) => c.toUpperCase());

				const { bg, text } = getBadgeColors(roleName);

				return (
					<Badge
						bg={bg}
						color={text}
						variant='subtle'
						fontSize='.8em'
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
				return value?.name ?? 'No Agency';
			}
			case 'salaryType':
				const type = salaryTypes?.find((item) => item.value === value)?.label;
				return type ?? 'N/A';

			case 'createdAt':
				return value ? format(new Date(value), 'MMM d, yyyy') : 'N/A';
			default:
				return value || 'N/A';
		}
	};

	return (
		<Box
			overflowX='auto'
			overflowY='auto'
			  maxHeight="80vh"
			  minH="70vh"
			borderWidth='1px'
			borderColor={colors.borderColor}
			rounded='xl'
			boxShadow={colors.cardShadow}
			bg={colors.bg}
		>
			<Table variant='simple' size='sm'>
				<Thead
					position='sticky'
					top={0}
					zIndex={1}
					boxShadow='0 2px 2px -1px rgba(0,0,0,0.06)'
					borderTopLeftRadius='20px'
					borderTopRightRadius='20px'
					bg={colors.bgDeep}
				>
					<Tr>
						{columns.map((column) => (
							<Th
								key={column.key}
								whiteSpace='nowrap'
								textTransform='capitalize'
								fontSize='sm'
								py='4'
								textAlign={
									['user', 'coins'].includes(column.key) ? 'left' : 'center'
								}
								fontWeight='semibold'
								color={colors.headingText}
								minW={column.width}
								borderBottom={`2px solid ${colors.borderColor}`}
							>
								{column.label}
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{isLoading || delayedLoading ? (
						<TableLoading columns={columns} length={20} py='4' />
					) : data.length === 0 ? (
						<Tr>
							<Td colSpan={columns.length} py={10} textAlign='center'>
								<NoData label='user' />
							</Td>
						</Tr>
					) : (
						data?.map((row, index) => (
							<Tr
								key={row._id || index}
								_hover={{ bg: colors.bgInputHover }}
								bg={colors.bg}
								transition='background-color 0.2s ease-in-out'
								borderBottom={`1px solid ${colors.borderColor}`}
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
											['name', 'user', 'coins'].includes(column.key)
												? 'left'
												: 'center'
										}
										fontWeight={column.key === 'name' ? 'semibold' : 'medium'}
										color={colors.bodyText}
									>
										{column.key === 'user' ? (
											<UserAvatarWithStatus
												user={row}
												linkTo={`/users-v2/${row?._id}`}
											/>
										) : column.key === 'coins' ? (
											<UserCoinsView user={row} updateData={updateData} />
										) : column.key === 'ranking' ? (
											<UserRankingSelect user={row} />
										) : column.key === 'isActive' ? (
											<UserStatusToggle
												user={row}
												refetchUsers={refetchUsers}
											/>
										) : column.key === 'actions' ? (
											<Flex align='center' justify='center' gap={3}>
												<CustomTooltip label='View'>
													<IconButton
														aria-label='View'
														icon={<FiEye />}
														size='sm'
														variant='ghost'
														onClick={() => navigate(`/users-v2/${row?._id}`)}
														color={colors.bodyText}
														_hover={{
															color: colors.accentGold,
															bg: colors.secondaryBtnHoverBg,
														}}
													/>
												</CustomTooltip>
												{hasPermission('users', 'custom_permissions') && (
													<CustomTooltip label='User Permissions'>
														<IconButton
															aria-label='User Permissions'
															icon={<FaUserShield />}
															size='sm'
															variant='ghost'
															onClick={() =>
																navigate(`/users-v2/permissions/${row?._id}`)
															}
															color={colors.bodyText}
															_hover={{
																color: colors.accentGold,
																bg: colors.secondaryBtnHoverBg,
															}}
														/>
													</CustomTooltip>
												)}

												{hasPermission('users', 'edit') && (
													<CustomTooltip label='Edit'>
														<IconButton
															aria-label='Edit'
															icon={<FiEdit2 />}
															size='sm'
															variant='ghost'
															onClick={() => handleEditUser(row)}
															color={colors.bodyText}
															_hover={{
																color: colors.accentGold,
																bg: colors.secondaryBtnHoverBg,
															}}
														/>
													</CustomTooltip>
												)}
											</Flex>
										) : ['amount', 'totalAmount'].includes(column.key) ? (
											<Text color={colors.bodyText}>
												{formatCurrency(
													row[column.key],
													row['agency']?.currency || 'AED',
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