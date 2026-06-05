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
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const RecordTable = ({ records, isLoading, isFetching, role }) => {
	const colors = useModalColors();
	const [note, setNote] = useState({
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

	const { hasPermission } = usePermissions();

	const actionPermission =
		hasPermission('attendance', 'view_note') ||
		hasPermission('attendance', 'update');

	const filterdColumns = actionPermission
		? columns
		: columns.filter((column) => column !== 'Action');

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
					item?._id === id ? { ...item, ...updatedFields } : item
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
				boxShadow={colors.cardShadow}
				bg={colors.bg}
				mt='2'
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
							{filterdColumns.map((header, index) => (
								<Th key={index} bg={colors.bgDeep} whiteSpace='nowrap' py={4}>
									<Box display='flex' alignItems='center'>
										<Text
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='600'
											color={colors.headingText}
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
						) : records?.results > 0 && data ? (
							data?.map((entry, index) => {
								const config = ATTENDANCE_STATUS_CONFIG[entry.status] ?? {
									bg: colors.bgInput,
									text: colors.bodyText,
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
										_hover={{ bg: colors.bgInputHover }}
										borderColor={colors.borderColor}
										borderBottom="1px solid"
									>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '15px' }}
											fontWeight='500'
											minWidth='200px'
											color={colors.headingText}
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
											color={colors.bodyText}
										>
											{roleName ?? 'N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											color={colors.bodyText}
										>
											{entry.type ?? 'N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											minWidth='100px'
											color={colors.bodyText}
										>
											{entry.agencyName ?? 'N/A'}
										</Td>
										<Td py={4} minWidth='150px' color={colors.bodyText}>
											{getTimeAgo(entry?.updatedAt)}
										</Td>
										<Td py={4} minWidth='150px' color={colors.bodyText}>
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
											color={entry.checkin === '00:00' ? colors.badgeErrorText : colors.accentGold}
										>
											{entry.checkin ?? 'N/A'}
										</Td>
										<Td
											py={4}
											minWidth='100px'
											color={entry.checkout === '00:00' ? colors.badgeErrorText : colors.accentGold}
										>
											{entry.checkout ?? 'N/A'}
										</Td>
										<Td
											py={4}
											minWidth='100px'
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
											color={colors.bodyText}
										>
											{[0, 3].includes(entry.status)
												? '0'
												: entry.checkin && entry.checkout
													? entry.totalWorkingHours?.hours ||
														entry.totalWorkingHours?.minutes
														? `${entry.totalWorkingHours.hours ? `${entry.totalWorkingHours.hours}h ` : ''}${entry.totalWorkingHours.minutes ? `${entry.totalWorkingHours.minutes}m` : ''}`
														: '0'
													: 'Pending'}
										</Td>
										{actionPermission && (
											<Td py={4} minWidth='100px'>
												{hasPermission('attendance', 'update') && (
													<IconButton
														rounded='full'
														aria-label='edit'
														icon={<FaEdit />}
														size='xs'
														variant='ghost'
														mr='1'
														onClick={() => handleEdit(entry)}
														color={colors.bodyText}
														_hover={{
															color: colors.accentGold,
															bg: colors.secondaryBtnHoverBg,
														}}
													/>
												)}

												{hasPermission('attendance', 'view_note') && (
													<>
														{entry?.leaveNote?.length > 0 &&
															entry?.status === 3 && (
																<Tooltip label='Leave Note' hasArrow>
																	<IconButton
																		aria-label='Leave note'
																		icon={<LuStickyNote />}
																		size='xs'
																		variant='ghost'
																		onClick={() => {
																			setNote({
																				message: entry.leaveNote,
																				title: 'Leave Note',
																				modal: true,
																			});
																		}}
																		color={colors.bodyText}
																		_hover={{
																			color: colors.accentGold,
																			bg: colors.secondaryBtnHoverBg,
																		}}
																	/>
																</Tooltip>
															)}

														{entry?.absentNote?.length > 0 &&
															entry?.status === 0 && (
																<Tooltip label='Absent Note' hasArrow>
																	<IconButton
																		aria-label='Absent note'
																		icon={<LuStickyNote />}
																		size='xs'
																		variant='ghost'
																		onClick={() => {
																			setNote({
																				message: entry.absentNote,
																				title: 'Absent Note',
																				modal: true,
																			});
																		}}
																		color={colors.bodyText}
																		_hover={{
																			color: colors.accentGold,
																			bg: colors.secondaryBtnHoverBg,
																		}}
																	/>
																</Tooltip>
															)}

														{[1, 2].includes(entry?.status) &&
															entry?.checkinNote?.length > 0 && (
																<Tooltip label='Check-In Note' hasArrow>
																	<IconButton
																		aria-label='Check-In note'
																		icon={<LuStickyNote />}
																		size='xs'
																		variant='ghost'
																		onClick={() => {
																			setNote({
																				message: entry?.checkinNote,
																				title: 'Check-In Note',
																				modal: true,
																			});
																		}}
																		color={colors.bodyText}
																		_hover={{
																			color: colors.accentGold,
																			bg: colors.secondaryBtnHoverBg,
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
							<Tr borderColor={colors.borderColor} textAlign='center'>
								<Td
									py={4}
									colSpan='11'
									fontSize={{ base: '12px', md: '15px' }}
									fontWeight='500'
									color={colors.mutedText}
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

export default RecordTable;