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
} from '@chakra-ui/react';
import TableLoading from 'components/loading/TableLoading';
import { format } from 'date-fns';
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import AttendanceUpdate from '../AttendanceUpdate';

const RecordTable = ({ data, timezone, isLoading, isFetching, refetch }) => {
	const columns = [
		// 'S.No',
		'Employee',
		'Role',
		'Type',
		'Location',
		'Date',
		'Status',
		'Check-in',
		'Check-out',
		'Work hours',
		'Action',
	];

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
						) : data?.results > 0 ? (
							data?.doc?.map((entry, index) => {
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
									statusText = 'Late arrival';
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
										bgGradient={rowBgGradient}
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
										>
											{entry.employee?.fullName}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
										>
											{roleName}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
										>
											{entry.type}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
										>
											{entry.agencyName}
										</Td>
										<Td py={4}>
											{format(new Date(entry.date), 'd MMM, yyyy')}
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
											>
												{statusText}
											</Box>
										</Td>
										<Td
											py={4}
											color={entry.checkIn === '00:00' ? 'red.500' : 'blue.500'}
										>
											{entry.checkin ?? 'N/A'}
										</Td>
										<Td
											py={4}
											color={
												entry.checkOut === '00:00' ? 'red.500' : 'blue.500'
											}
										>
											{entry.checkout ?? 'N/A'}
										</Td>
										<Td
											py={4}
											fontSize={{ base: '12px', md: '14px' }}
											fontWeight='400'
										>
											{entry.totalWorkingHours
												? `${entry.totalWorkingHours.hours}h ${entry.totalWorkingHours.minutes}m`
												: '0h 0m'}
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

export default RecordTable;
