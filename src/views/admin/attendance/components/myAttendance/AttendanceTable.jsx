import {
	Box,
	Text,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Divider,
	useDisclosure,
	IconButton,
	Tooltip,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { format } from 'date-fns';
import moment from 'moment';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import AttendanceUpdate from '../AttendanceUpdate';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import { ATTENDANCE_STATUS_CONFIG, STATUS_CONFIG } from '../../constants';
import MessageViewModal from 'components/modals/MessageViewModal';
import { LuStickyNote } from 'react-icons/lu';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';

const AttendanceTable = ({
	attendanceRecord,
	timezone,
	isLoading,
	isFetching,
	refetch,
}) => {
	const [note, setNote] = useState({
		title: 'Message',
		message: 'N/A',
		modal: false,
	});

	const columns = [
		'S.No',
		'Day',
		'Type',
		'Location',
		'Date',
		'Status',
		'Check-in',
		'Check-out',
		'Work hours',
		'Action',
	];

	const { hasPermission } = usePermissions();
	const { user, userRoleName } = useUserSession();

	const actionPermission =
		hasPermission('attendance', 'view_note') ||
		hasPermission('attendance', 'update');

	const filterdColumns = actionPermission
		? columns
		: columns.filter((column) => column !== 'Action');

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

	return (
		<>
			<Box
				height='60vh'
				overflowY='auto'
				scrollBehavior='smooth'
				borderRadius='md'
				boxShadow='sm'
			>
				{/* <Box overflowX='auto'> */}
				<Table variant='striped' size='sm' bg='white' minWidth='100%'>
					<Thead
						position='sticky'
						top={0}
						bg='white'
						zIndex={2}
						boxShadow='0px 2px 8px rgba(0, 0, 0, 0.1)'
					>
						<Tr>
							{filterdColumns?.map((header, index) => (
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
							<TableLoading columns={filterdColumns} length={11} py='4' />
						) : attendanceRecord?.length > 0 ? (
							attendanceRecord?.map((entry, index) => {
								// let textColor = 'black';
								// let rowBgGradient = 'none';
								// let statusBgColor = 'transparent';
								// let statusText = '';

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

								return (
									<Tr
										key={entry._id}
										_hover={{ bg: 'gray.50' }}
										borderBottom={
											index === attendanceRecord.length - 1
												? 'none'
												: '1px solid'
										}
										borderColor='gray.200'
										bgGradient={rowBgGradient}
										py='4'
									>
										<Td
											borderBottom='none'
											fontSize={{ base: '12px', md: '15px' }}
											fontWeight='500'
										>
											{++index}
										</Td>
										<Td
											borderBottom='none'
											fontSize={{ base: '12px', md: '15px' }}
											fontWeight='500'
											minWidth='100px'
										>
											{moment.tz(timezone).day(entry.day).format('dddd')}
										</Td>
										<Td
											borderBottom='none'
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
										>
											{entry.type ?? 'N/A'}
										</Td>
										<Td
											borderBottom='none'
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
										>
											{entry.agencyName ?? 'N/A'}
										</Td>
										<Td borderBottom='none' py={4} minWidth='150px'>
											{format(new Date(entry.date), 'd MMM, yyyy')}
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
												mr={2}
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
											borderBottom='none'
											color={entry.checkIn === '00:00' ? 'red.500' : 'blue.500'}
											minWidth='100px'
										>
											{entry.checkin ?? 'N/A'}
										</Td>
										<Td
											borderBottom='none'
											minWidth='100px'
											color={
												entry.checkout === '00:00' ? 'red.500' : 'blue.500'
											}
										>
											{entry.checkout ?? 'N/A'}
										</Td>
										<Td
											borderBottom='none'
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='120px'
										>
											{[0, 3].includes(entry.status)
												? '0m'
												: entry.checkin && entry.checkout
													? entry.totalWorkingHours?.hours ||
														entry.totalWorkingHours?.minutes
														? `${entry.totalWorkingHours.hours ? `${entry.totalWorkingHours.hours}h ` : ''}${entry.totalWorkingHours.minutes ? `${entry.totalWorkingHours.minutes}m` : ''}`
														: '0m'
													: 'Pending'}
										</Td>
										{actionPermission && (
											<Td py={4} minWidth='100px'>
												{hasPermission('attendance', 'update') && (
													<IconButton
														rounded='full'
														aria-label='Leave note'
														icon={<FaEdit />}
														size='xs'
														colorScheme='green'
														variant='solid'
														mr='1'
														onClick={() => handleEdit(entry)}
													/>
												)}

												{hasPermission('attendance', 'view_note') && (
													<>
														{entry?.leaveNote?.length > 0 &&
															entry?.status === 3 && (
																<Tooltip
																	label='Leave Note'
																	hasArrow
																	placement='top'
																>
																	<IconButton
																		aria-label='Leave note'
																		icon={<LuStickyNote />}
																		size='xs'
																		colorScheme='teal'
																		variant='solid'
																		onClick={() => {
																			setNote({
																				message: entry.leaveNote,
																				title: 'Leave Note',
																				modal: true,
																			});
																		}}
																	/>
																</Tooltip>
															)}
														{entry?.absentNote?.length > 0 &&
															entry?.status === 0 && (
																<Tooltip
																	label='Absent Note'
																	hasArrow
																	placement='top'
																>
																	<IconButton
																		aria-label='Absent note'
																		icon={<LuStickyNote />}
																		size='xs'
																		colorScheme='teal'
																		variant='solid'
																		onClick={() => {
																			setNote({
																				message: entry.absentNote,
																				title: 'Absent Note',
																				modal: true,
																			});
																		}}
																	/>
																</Tooltip>
															)}

														{[1, 2].includes(entry?.status) &&
															entry?.checkinNote?.length > 0 && (
																<Tooltip
																	label='Check-In Note'
																	hasArrow
																	placement='top'
																>
																	<IconButton
																		aria-label='Check-In note'
																		icon={<LuStickyNote />}
																		size='xs'
																		colorScheme='teal'
																		variant='solid'
																		onClick={() => {
																			setNote({
																				message: entry?.checkinNote,
																				title: 'Check-In Note',
																				modal: true,
																			});
																		}}
																	/>
																</Tooltip>
															)}
													</>
												)}
											</Td>
										)}
									</Tr>
								);
							})
						) : (
							<Tr borderColor='gray.200' textAlign='center'>
								<Td
									borderBottom='none'
									colSpan='10'
									py='12'
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
				{/* </Box> */}

				<Divider color='#D5D9DD' mb={4} />
			</Box>

			{isEditOpen && (
				<AttendanceUpdate
					isOpen={isEditOpen}
					onClose={onEditClose}
					data={editData}
					refetch={refetch}
					updateKey='myAttendance'
				/>
			)}

			{note?.modal && (
				<MessageViewModal
					title={note.title}
					message={note.message}
					isOpen={note.modal}
					onClose={() => setNote({ modal: false })}
				/>
			)}
		</>
	);
};

export default AttendanceTable;
