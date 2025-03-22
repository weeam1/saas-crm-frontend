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
	useDisclosure,
	Avatar,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import AttendanceUpdate from '../AttendanceUpdate';
import { constant } from 'constant';

import moment from 'moment-timezone';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';

const RecordTable = ({ records, timezone, isLoading, isFetching }) => {
	const columns = [
		'Employee',
		'Role',
		'Type',
		'Location',
		'Attendance Time',
		'Date',
		'Status',
		'Check-in',
		'Check-out',
		'Work hours',
		'Action',
	];

	const [data, setData] = useState([]);

	useEffect(() => {
		if (records?.doc) setData(records?.doc);
	}, [records?.doc]);

	const getTimeAgo = (createdAt) => {
		const now = moment().tz(timezone);
		const createdMoment = moment(createdAt).tz(timezone);
		const diffInMinutes = now.diff(createdMoment, 'minutes');

		return diffInMinutes < 60
			? diffInMinutes === 0
				? 'now'
				: `${diffInMinutes} minutes ago`
			: createdMoment.format('h:mm A');
	};

	const [editData, setEditData] = useState(null);

	const {
		isOpen: isEditOpen,
		onOpen: onEditOpen,
		onClose: onEditClose,
	} = useDisclosure();

	const handleEdit = (data) => {
		setEditData(data);
		onEditOpen();
	};

	const handleRefetchUpdate = (id, updatedFields) => {
		setData(
			(prevData) =>
				prevData?.map((item) =>
					// eslint-disable-next-line eqeqeq
					item?._id == id ? Object.assign({}, item, updatedFields) : item
				) || prevData
		);
	};

	return (
		<>
			<Box
				height='70vh'
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
									<Box display='flex' alignItems='center'>
										<Text
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='600'
											color='gray.700'
										>
											{header}
										</Text>
									</Box>
								</Th>
							))}
						</Tr>
					</Thead>

					<Tbody>
						{isFetching || isLoading ? (
							<TableLoading columns={columns} length={11} py='4' />
						) : records?.results > 0 && data ? (
							data?.map((entry, index) => {
								let textColor = 'black';
								// let rowBgGradient = 'none';
								let statusBgColor = 'transparent';
								let statusText = '';

								if (entry.status === 0) {
									statusBgColor = '#FFE5EE';
									textColor = '#AA0000';
									statusText = 'Absent';
								} else if (entry.status === 1) {
									statusBgColor = '#E6EFFC';
									textColor = '#0764E6';
									statusText = 'Office';
									// rowBgGradient = 'linear(to-r, #E0F7FF, white)';
								} else if (entry.status === 2) {
									statusBgColor = '#FFF8E7';
									textColor = '#D5B500';
									statusText = 'Late';
								}

								const roleName =
									entry.employee?.role === 'superAdmin'
										? 'Super Admin'
										: entry.employee?.roles[0]?.roleName;

								return (
									<Tr
										key={entry._id}
										_hover={{ bg: 'gray.50' }}
										border='gray.200'
										// bgGradient={rowBgGradient}
									>
										{/* <Td
											py={4}
											fontSize={{ base: '12px', md: '15px' }}
											fontWeight='500'
										>
											{++index}
										</Td> */}
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
													entry?.employee?.profileImage
														? `${constant['baseUrl']}${entry?.employee.profileImage}`
														: ''
												}
												size='sm'
												name={entry?.employee?.fullName ?? 'User'}
											/>
											{entry.employee?.fullName}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
										>
											{roleName ?? 'N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
										>
											{entry.type ?? 'N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
										>
											{entry.agencyName ?? 'N/A'}
										</Td>
										<Td py={4} minWidth='150px'>
											{getTimeAgo(entry?.updatedAt)}
										</Td>
										<Td py={4} minWidth='150px'>
											{format(new Date(entry?.date), 'd MMM, yyyy')}
										</Td>

										<Td py={4}>
											<Box
												bg={statusBgColor}
												color={textColor}
												fontWeight='bold'
												px={2}
												py={1}
												borderRadius='md'
												display='inline-block'
												minWidth='fit-content'
											>
												{statusText}
											</Box>
										</Td>
										<Td
											py={4}
											minWidth='100px'
											color={entry.checkIn === '00:00' ? 'red.500' : 'blue.500'}
										>
											{entry.checkin ?? 'N/A'}
										</Td>
										<Td
											py={4}
											minWidth='100px'
											color={
												entry.checkOut === '00:00' ? 'red.500' : 'blue.500'
											}
										>
											{entry.checkout ?? 'N/A'}
										</Td>
										<Td
											py={4}
											minWidth='100px'
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
										>
											{entry.totalWorkingHours?.minutes > 0 ||
											entry.totalWorkingHours.hours > 0
												? `${entry.totalWorkingHours.hours}h ${entry.totalWorkingHours.minutes}m`
												: 'Pending'}
										</Td>
										<Td py={4}>
											<Button rounded='full' onClick={() => handleEdit(entry)}>
												<FaEdit color='green' />
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
									<NoData label='attendance record' />
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</Box>

			{isEditOpen && (
				<AttendanceUpdate
					isOpen={isEditOpen}
					onClose={onEditClose}
					data={editData}
					refetch={handleRefetchUpdate}
					updateKey='record'
				/>
			)}
		</>
	);
};

export default RecordTable;
