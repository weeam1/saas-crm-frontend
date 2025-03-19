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
	Button,
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { format } from 'date-fns';
import moment from 'moment';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import AttendanceUpdate from '../AttendanceUpdate';

const AttendanceTable = ({
	attendanceRecord,
	timezone,
	isLoading,
	isFetching,
	refetch,
}) => {
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

	const user = JSON.parse(localStorage.getItem('user'));

	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	const filterdColumns =
		role === 'superAdmin'
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
				overflow='auto'
				scrollBehavior='smooth'
				borderRadius='md'
				boxShadow='sm'
				bg='white'
			>
				<Box overflowX='auto'>
					<Table variant='simple' size='sm' bg='white' minWidth='100%'>
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
									let textColor = 'black';
									let rowBgGradient = 'none';
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
										rowBgGradient = 'linear(to-r, #E0F7FF, white)';
									} else if (entry.status === 2) {
										statusBgColor = '#FFF8E7';
										textColor = '#D5B500';
										statusText = 'Late';
									}

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
										>
											<Td
												borderBottom='none'
												py={4}
												fontSize={{ base: '12px', md: '15px' }}
												fontWeight='500'
											>
												{++index}
											</Td>
											<Td
												borderBottom='none'
												py={4}
												fontSize={{ base: '12px', md: '15px' }}
												fontWeight='500'
												minWidth='100px'
											>
												{moment.tz(timezone).day(entry.day).format('dddd')}
											</Td>
											<Td
												borderBottom='none'
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='100px'
											>
												{entry.type ?? 'N/A'}
											</Td>
											<Td
												borderBottom='none'
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='100px'
											>
												{entry.agencyName ?? 'N/A'}
											</Td>
											<Td borderBottom='none' py={4} minWidth='150px'>
												{format(new Date(entry.date), 'd MMM, yyyy')}
											</Td>
											<Td borderBottom='none' py={4}>
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
												borderBottom='none'
												py={4}
												color={
													entry.checkIn === '00:00' ? 'red.500' : 'blue.500'
												}
												minWidth='100px'
											>
												{entry.checkin ?? 'N/A'}
											</Td>
											<Td
												borderBottom='none'
												py={4}
												minWidth='100px'
												color={
													entry.checkout === '00:00' ? 'red.500' : 'blue.500'
												}
											>
												{entry.checkout ?? 'N/A'}
											</Td>
											<Td
												borderBottom='none'
												py={4}
												fontSize={{ base: '12px', md: '14px' }}
												fontWeight='400'
												minWidth='120px'
											>
												{entry.totalWorkingHours
													? `${entry.totalWorkingHours?.hours}h ${entry.totalWorkingHours.minutes}m`
													: '0h 0m'}
											</Td>
											{role === 'superAdmin' && (
												<Td py={4}>
													<Button
														rounded='full'
														onClick={() => handleEdit(entry)}
													>
														<FaEdit color='green' />
													</Button>
												</Td>
											)}
										</Tr>
									);
								})
							) : (
								<Tr borderColor='gray.200' textAlign='center'>
									<Td
										borderBottom='none'
										py={4}
										colSpan='9'
										fontSize={{ base: '12px', md: '15px' }}
										fontWeight='500'
										color='gray.500'
										textAlign='center'
									>
										No record found!
									</Td>
								</Tr>
							)}
						</Tbody>
					</Table>
				</Box>

				<Divider color='#D5D9DD' mb={4} />
			</Box>

			{isEditOpen && (
				<AttendanceUpdate
					isOpen={isEditOpen}
					onClose={onEditClose}
					data={editData}
					refetch={refetch}
				/>
			)}
		</>
	);
};

export default AttendanceTable;
