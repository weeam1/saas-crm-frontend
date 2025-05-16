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
	IconButton,
	Tooltip,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import AttendanceUpdate from '../AttendanceUpdate';
import { constant } from 'constant';

import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import { ATTENDANCE_STATUS_CONFIG } from '../../constants';
import { Link } from 'react-router-dom';
import { LuStickyNote } from 'react-icons/lu';
import MessageViewModal from 'components/modals/MessageViewModal';

const RecordTable = ({ records, isLoading, isFetching }) => {
	const [leaveNote, setLeaveNote] = useState({
		title: 'Message',
		message: 'N/A',
		modal: false,
	});

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
		if (!createdAt) return 'Invalid date';

		const createdDate = new Date(createdAt);
		if (isNaN(createdDate.getTime())) return 'Invalid date';

		const now = new Date();
		const diffInMinutes = Math.floor((now - createdDate) / (1000 * 60));

		if (diffInMinutes < 1) return 'now';
		if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

		// Always return time format
		return createdDate.toLocaleTimeString(undefined, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
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
				height='80vh'
				overflowY='auto'
				scrollBehavior='smooth'
				borderRadius='md'
				boxShadow='sm'
				bg='white'
				mt='2'
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
											textTransform='capitalize'
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
								const config = ATTENDANCE_STATUS_CONFIG[entry.status] ?? {
									bg: '#F0F0F0',
									text: '#000',
									label: 'Unknown',
								};

								const {
									bg: statusBgColor,
									text: textColor,
									label: statusText,
									gradient: rowBgGradient,
								} = config;

								const roleName =
									entry.employee?.role === 'superAdmin'
										? 'Super Admin'
										: entry.employee?.roles[0]?.roleName;

								return (
									<Tr
										key={entry._id}
										_hover={{ bg: 'gray.50' }}
										border='gray.200'
									>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '15px' }}
											fontWeight='500'
											minWidth='200px'
										>
											<Box
												as={Link}
												to={`/attendance/employees/${entry?.employee?._id}`}
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
											</Box>
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

										<Td borderBottom='none' py={4} minWidth='160px'>
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
												{entry?.status === 3 && entry?.leaveType
													? entry.leaveType.charAt(0).toUpperCase() +
														entry.leaveType.slice(1) +
														' ' +
														statusText
													: statusText}
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
												entry.checkout === '00:00' ? 'red.500' : 'blue.500'
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
											{entry.status === 0
												? '0m'
												: entry.checkin && entry.checkout
													? entry.totalWorkingHours?.hours ||
														entry.totalWorkingHours?.minutes
														? `${entry.totalWorkingHours.hours ? `${entry.totalWorkingHours.hours}h ` : ''}${entry.totalWorkingHours.minutes ? `${entry.totalWorkingHours.minutes}m` : ''}`
														: '0m'
													: 'Pending'}
										</Td>
										<Td py={4} minWidth='100px'>
											<IconButton
												rounded='full'
												aria-label='edit'
												icon={<FaEdit />}
												size='xs'
												colorScheme='green'
												variant='solid'
												mr='1'
												onClick={() => handleEdit(entry)}
											/>

											{entry?.leaveNote && entry?.status === 3 && (
												<Tooltip label='Leave Note' hasArrow>
													<IconButton
														aria-label='Leave note'
														// icon={<FaNoteSticky />}
														icon={<LuStickyNote />}
														size='xs'
														colorScheme='teal'
														variant='solid'
														onClick={() => {
															setLeaveNote({
																message: entry.leaveNote,
																title: 'Leave Note',
																modal: true,
															});
														}}
													/>
												</Tooltip>
											)}
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

			{leaveNote?.modal && (
				<MessageViewModal
					title={leaveNote.title}
					message={leaveNote.message}
					isOpen={leaveNote.modal}
					onClose={() => setLeaveNote({ modal: false })}
				/>
			)}
		</>
	);
};

export default RecordTable;
