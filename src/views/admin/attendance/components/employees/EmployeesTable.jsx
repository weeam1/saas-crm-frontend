import {
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Text,
	Button,
	Avatar,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { constant } from 'constant';

import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import { buttonStyle } from 'utils/btn';
import { useNavigate } from 'react-router-dom';
import { useFetchItemsQuery } from 'api/apiSlice';
import EmployeeAttendanceMark from './EmployeeAttendanceMark';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const EmployeesTable = ({
	data,
	tab,
	isLoading,
	isFetching,
	viewLoading,
	loginRole,
}) => {
	const colors = useModalColors();
	const columns = [
		'Employee',
		'Email',
		'Role',
		'Salary',
		'Agency',
		'Attendance Mark',
		'Action',
	];

	const { hasPermission } = usePermissions();
	const hasAttendnaceOperationsAccess = hasPermission(
		'attendance',
		'operations'
	);

	if (!hasAttendnaceOperationsAccess) {
		columns.splice(5, 1);
	}

	const { data: officeSettings, isLoading: officeSettingsLoading } =
		useFetchItemsQuery(
			{ path: `/attendance/office-settings` },
			{ refetchOnMountOrArgChange: true }
		);

	const navigate = useNavigate();

	return (
		<>
			<Box
				minHeight={data?.doc?.length > 8 ? '70vh' : '60vh'}
				overflowY='auto'
				scrollBehavior='smooth'
				borderRadius='md'
				boxShadow={colors.cardShadow}
				bg={colors.bg}
				border="1px solid"
				borderColor={colors.borderColor}
			>
				<Table variant='simple' size='sm' bg={colors.bg}>
					<Thead
						position='sticky'
						top={0}
						bg={colors.bgDeep}
						zIndex={2}
						boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
					>
						<Tr>
							{columns.map((header, index) => (
								<Th key={index} bg={colors.bgDeep} whiteSpace='nowrap' py={4}>
									<Box
										display='flex'
										alignItems='center'
										justifyContent='center'
									>
										<Text
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='600'
											color={colors.headingText}
											textTransform='capitalize'
											textAlign='center'
											borderBottom={`2px solid ${colors.borderColor}`}
										>
											{header}
										</Text>
									</Box>
								</Th>
							))}
						</Tr>
					</Thead>

					<Tbody>
						{isFetching || isLoading || viewLoading || officeSettingsLoading ? (
							<TableLoading columns={columns} length={11} py='4' />
						) : data && data?.doc?.length > 0 ? (
							data?.doc?.map((emp) => {
								const agencyId = emp?.agency?._id;

								const agencyNotFound =
									`Agency or settings is missing`;

								const officeSetting = officeSettings?.doc?.find(
									(office) => office?.agency?._id === agencyId
								);

								return (
									<Tr
										key={emp._id}
										_hover={{ bg: colors.bgInputHover }}
										borderColor={colors.borderColor}
										transition='background-color 0.2s ease'
									>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '15px' }}
											fontWeight='500'
											minWidth='200px'
											display='flex'
											alignItems='center'
											gap={2}
											color={colors.headingText}
										>
											<Avatar
												src={
													emp?.profileImage
														? `${constant['baseUrl']}${emp?.profileImage}`
														: ''
												}
												size='sm'
												name={emp?.fullName ?? 'User'}
											/>
											{emp.fullName}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											textAlign='center'
											color={colors.bodyText}
										>
											{emp.username}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											textAlign='center'
											color={colors.bodyText}
										>
											{tab === 'admins' ? 'Admin' : emp.roleName || 'N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											textAlign='center'
											color={colors.bodyText}
										>
											{emp.salary ? `${emp.salary}/month` : 'Salary N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											textAlign='center'
											color={colors.bodyText}
										>
											{emp.agencyName ?? 'N/A'}
										</Td>

										{hasAttendnaceOperationsAccess && (
											<Td py='4' textAlign='center'>
												{agencyId && officeSetting ? (
													<EmployeeAttendanceMark
														employeeId={emp._id}
														todayRecord={emp.todayAttendanceRecord}
														officeSetting={officeSetting}
														employeeName={emp?.fullName || ''}
													/>
												) : (
													<Text color={colors.badgeErrorText} fontSize='sm'>
														{agencyNotFound}
													</Text>
												)}
											</Td>
										)}

										<Td py={4} textAlign='center'>
											<Button
												{...buttonStyle}
												bg={colors.accentGold}
												color={colors.headerText}
												fontSize='sm'
												aria-label='attendance'
												onClick={() =>
													navigate(`/attendance/employees/${emp._id}`)
												}
												_hover={{
													bg: colors.goldLight,
													transform: 'translateY(-1px)',
													boxShadow: colors.goldGlow,
												}}
												_active={{ bg: colors.goldDark }}
												transition='all 0.2s ease'
											>
												View Attendance
											</Button>
										</Td>
									</Tr>
								);
							})
						) : (
							<Tr borderColor={colors.borderColor} textAlign='center'>
								<Td
									py={4}
									colSpan='11'
									fontSize={{ base: '12px', md: '15px' }}
									fontWeight='500'
									color={colors.mutedText}
									textAlign='center'
								>
									<NoData label='employees' />
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>
		</>
	);
};

export default EmployeesTable;