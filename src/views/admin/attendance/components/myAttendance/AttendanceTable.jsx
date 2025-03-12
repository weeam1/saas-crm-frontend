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
} from '@chakra-ui/react';
import { format } from 'date-fns';
import moment from 'moment';
import { IoMdArrowDropdown } from 'react-icons/io';

const AttendanceTable = ({ attendanceRecord, timezone }) => {
	return (
		<Box overflowX='auto'>
			<Table variant='simple' size='sm' bg='white' borderRadius='md'>
				<Thead>
					<Tr>
						{[
							'AID',
							'Day',
							'Type',
							'Location',
							'Date',
							'Status',
							'Check-in',
							'Check-out',
							'Work hours',
						].map((header, index) => (
							<Th key={index} whiteSpace='nowrap'>
								<Box display='flex' alignItems='center'>
									<Text
										fontSize={{ base: '12px', md: '14px' }}
										fontWeight='400'
									>
										{header}
									</Text>
									{[
										'Type',
										'Location',
										'Status',
										'Check-in',
										'Check-out',
										'Work hours',
									].includes(header) && <IoMdArrowDropdown />}
								</Box>
							</Th>
						))}
					</Tr>
				</Thead>

				<Tbody>
					{attendanceRecord?.map((entry, index) => {
						let textColor = 'black';
						let rowBgGradient = 'none';
						let statusBgColor = 'transparent';
						let statusText = '';

						if (entry.status === 0) {
							statusBgColor = '#FFE5EE';
							textColor = '#AA0000';
							statusText = 'Absent';
						} else if (entry.status === 2) {
							statusBgColor = '#E6EFFC';
							textColor = '#0764E6';
							statusText = 'Office';
							rowBgGradient = 'linear(to-r, #E0F7FF, white)';
						} else if (entry.status === 1) {
							statusBgColor = '#FFF8E7';
							textColor = '#D5B500';
							statusText = 'Late arrival';
						}

						return (
							<Tr
								key={entry.id}
								_hover={{ bg: 'gray.50' }}
								borderBottom={
									index === attendanceRecord.length - 1 ? 'none' : '1px solid'
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
									{entry.aid}
								</Td>
								<Td
									borderBottom='none'
									py={4}
									fontSize={{ base: '12px', md: '15px' }}
									fontWeight='500'
								>
									{moment.tz(timezone).day(entry.day).format('dddd')}
								</Td>
								<Td
									borderBottom='none'
									py={4}
									fontSize={{ base: '12px', md: '14px' }}
									fontWeight='400'
								>
									{entry.type}
								</Td>
								<Td
									borderBottom='none'
									py={4}
									fontSize={{ base: '12px', md: '14px' }}
									fontWeight='400'
								>
									{entry.agencyName}
								</Td>
								<Td borderBottom='none' py={4}>
									{format(new Date(entry.date), 'd MMM, yyyy')}
									{/* {entry.date} */}
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
									>
										{statusText}
									</Box>
								</Td>
								<Td
									borderBottom='none'
									py={4}
									color={entry.checkIn === '00:00' ? 'red.500' : 'blue.500'}
								>
									{entry.checkin}
								</Td>
								<Td
									borderBottom='none'
									py={4}
									color={entry.checkout === '00:00' ? 'red.500' : 'blue.500'}
								>
									{entry.checkout ?? 'N/A'}
								</Td>
								<Td
									borderBottom='none'
									py={4}
									fontSize={{ base: '12px', md: '14px' }}
									fontWeight='400'
								>
									{entry.totalWorkingHours
										? `${entry.totalWorkingHours?.hours}h ${entry.totalWorkingHours.minutes}m`
										: '0h 0m'}
								</Td>
							</Tr>
						);
					})}
				</Tbody>
			</Table>
			<Divider color='#D5D9DD' mb={4} />
		</Box>
	);
};

export default AttendanceTable;
