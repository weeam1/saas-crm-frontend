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

const EmployeesTable = ({ data, tab, isLoading, isFetching, viewLoading }) => {
	const columns = [
		'Employee',
		'Email',
		'Role',
		'Salary',
		'Agency',
		'Attendance Mark',
		'Action',
	];

	const { data: officeSettings, isLoading: officeSettingsLoading } =
		useFetchItemsQuery(
			{ path: `/attendance/office-settings` },
			{ refetchOnMountOrArgChange: true }
		);

	const navigate = useNavigate();

	return (
		<>
			<Box
				height={data?.doc?.length > 8 ? '70vh' : 'fit-content'}
				overflowY='auto'
				scrollBehavior='smooth'
				borderRadius='md'
				boxShadow='sm'
				bg='white'
			>
				<Table variant='striped' size='sm' bg='white'>
					<Thead
						position='sticky'
						top={0}
						bg='white'
						zIndex={2}
						boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
					>
						<Tr>
							{columns.map((header, index) => (
								<Th key={index} bg='brand.200' whiteSpace='nowrap' py={4}>
									<Box
										display='flex'
										alignItems='center'
										justifyContent='center'
									>
										<Text
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='600'
											color='gray.700'
											textTransform='capitalize'
											textAlign='center'
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

								const agencyNotFound = !agencyId && `Agency not found`;

								const officeSetting = officeSettings?.doc?.find(
									(office) => office?.agency?._id === agencyId
								);

								return (
									<Tr
										key={emp._id}
										_hover={{ bg: 'gray.50' }}
										border='gray.200'
									>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '15px' }}
											fontWeight='500'
											minWidth='200px'
											display='flex'
											alignItems='center'
											gap={2}
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
										>
											{emp.username}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											textAlign='center'
										>
											{tab === 'admins' ? 'Admin' : emp.roleName || 'N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											textAlign='center'
										>
											{emp.salary ? `${emp.salary}/month` : 'Salary N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											textAlign='center'
										>
											{emp.agencyName ?? 'N/A'}
										</Td>

										<Td py='4' textAlign='center'>
											{agencyId ? (
												<EmployeeAttendanceMark
													employeeId={emp._id}
													todayRecord={emp.todayAttendanceRecord}
													officeSetting={officeSetting}
												/>
											) : (
												agencyNotFound
											)}
										</Td>

										<Td py={4} textAlign='center'>
											<Button
												{...buttonStyle}
												variant='solid'
												bg='brand.400'
												fontSize='sm'
												aria-label='attendance'
												onClick={() =>
													navigate(`/attendance/employees/${emp._id}`)
												}
											>
												View Attendance
											</Button>
										</Td>
									</Tr>
								);
							})
						) : (
							<Tr borderColor='gray.200' textAlign='center'>
								<Td
									py={4}
									colSpan='11'
									fontSize={{ base: '12px', md: '15px' }}
									fontWeight='500'
									color='gray.500'
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
