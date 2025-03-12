import React, { useEffect, useState } from 'react';
import {
	Box,
	Text,
	Avatar,
	Grid,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Divider,
	useBreakpointValue,
} from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { IoMdExit, IoMdArrowDropdown } from 'react-icons/io';
import { RiEqualizerLine } from 'react-icons/ri';
import { IoIosArrowBack } from 'react-icons/io';
import { useFetchItemsQuery } from 'api/apiSlice';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';
const timezone = 'Asia/Karachi';

const Attendance = () => {
	const { id: employeeId } = useParams();

	const validEmployeeId = employeeId?.trim() || null;

	const [month, setMonth] = useState(() =>
		Number(moment.tz(timezone).format('M'))
	);
	const [year, setYear] = useState(() =>
		Number(moment.tz(timezone).format('YYYY'))
	);

	// Construct request body safely
	const attendanceBody = validEmployeeId
		? { employeeId: validEmployeeId, month, year }
		: null;

	console.log({ attendanceBody });

	// Fetch data only if employeeId is valid
	const { data, isLoading } = useFetchItemsQuery(
		{
			path: '/attendance/employee-record-per-month',
			body: attendanceBody,
		},
		{
			skip: !attendanceBody,
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (!validEmployeeId) {
			console.error('Invalid employee ID');
		}
	}, [validEmployeeId]);

	const attendanceData = [
		{
			id: '2341421',
			day: 'Monday',
			type: 'Web',
			location: 'Dubai',
			date: '1 Jun 2025',
			status: 'Office',
			checkIn: '00:00',
			checkOut: '18:00',
			workHours: '10h 2m',
		},
		{
			id: '3411421',
			day: 'Tuesday',
			type: 'Fingerprint',
			location: 'Dubai',
			date: '2 Jun 2025',
			status: 'Absent',
			checkIn: '00:00',
			checkOut: '00:00',
			workHours: '0m',
		},
		{
			id: '2341121',
			day: 'Wednesday',
			type: 'Web',
			location: 'Dubai',
			date: '3 Jun 2025',
			status: 'Late arrival',
			checkIn: '10:30',
			checkOut: '18:00',
			workHours: '8h 30m',
		},
		{
			id: '2341421',
			day: 'Thursday',
			type: 'Web',
			location: 'Dubai',
			date: '4 Jun 2025',
			status: 'Office',
			checkIn: '00:00',
			checkOut: '18:00',
			workHours: '10h 2m',
		},
		{
			id: '2341421',
			day: 'Friday',
			type: 'Web',
			location: 'Dubai',
			date: '5 Jun 2025',
			status: 'Office',
			checkIn: '00:00',
			checkOut: '18:00',
			workHours: '10h 2m',
		},
		{
			id: '2341421',
			day: 'Saturday',
			type: 'Fingerprint',
			location: 'Dubai',
			date: '6 Jul 2023',
			status: 'Office',
			checkIn: '9:00',
			checkOut: '18:00',
			workHours: '10h 12m',
		},
	];

	const isSmallDevice = useBreakpointValue({ base: true, md: false });

	// return (
	// 	<Box p={{ base: 4, md: 6 }} minH='100vh'>
	// 		<Box display='flex' alignItems='center' mb={4} bg='white' p={4}>
	// 			<Text
	// 				fontSize={{ base: 'sm', md: 'md' }}
	// 				fontWeight='bold'
	// 				color='blue.500'
	// 				cursor='pointer'
	// 				_hover={{ textDecoration: 'underline' }}
	// 				mr={2}
	// 				display='flex'
	// 				alignItems='center'
	// 			>
	// 				<IoIosArrowBack style={{ marginRight: '5px' }} /> Back
	// 			</Text>

	// 			<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
	// 				Employee 1 Attendance Record
	// 			</Text>
	// 		</Box>

	// 		<Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6}>
	// 			<Box>
	// 				<Box bg='white' p={5} borderRadius='md' shadow='sm'>
	// 					<Box display='flex' mb={4}>
	// 						<Avatar src={employee.image} size='md' mr={4} />
	// 						<Box>
	// 							<Text
	// 								fontWeight='medium'
	// 								fontSize={{ base: '20px', md: '24px' }}
	// 								fontFamily='Poppins'
	// 							>
	// 								{employee.name}
	// 							</Text>
	// 							<Text
	// 								color='#C4C4C4'
	// 								fontWeight='medium'
	// 								fontSize={{ base: '16px', md: '18px' }}
	// 								fontFamily='Poppins'
	// 							>
	// 								{employee.role}
	// 							</Text>
	// 							<Text
	// 								fontWeight='medium'
	// 								fontSize={{ base: '14px', md: '16px' }}
	// 								fontFamily='Poppins'
	// 								mt={1}
	// 							>
	// 								{employee.salary}
	// 							</Text>
	// 						</Box>
	// 					</Box>

	// 					<Divider borderColor='#A07723' my={4} />
	// 					<Box>
	// 						<Text
	// 							fontSize={{ base: '14px', md: '16px' }}
	// 							fontFamily='Poppins'
	// 							fontWeight='400'
	// 						>
	// 							Total Days:{' '}
	// 							<Text as='span' fontWeight='bold'>
	// 								{employee.totalDays}
	// 							</Text>
	// 						</Text>
	// 						<Text
	// 							fontSize={{ base: '14px', md: '16px' }}
	// 							fontFamily='Poppins'
	// 							fontWeight='400'
	// 						>
	// 							Working Days:{' '}
	// 							<Text as='span' fontWeight='bold'>
	// 								{employee.workingDays}
	// 							</Text>
	// 						</Text>
	// 						<Text
	// 							fontSize={{ base: '14px', md: '16px' }}
	// 							fontFamily='Poppins'
	// 							fontWeight='400'
	// 						>
	// 							Total Present:{' '}
	// 							<Text as='span' fontWeight='bold'>
	// 								{employee.present}
	// 							</Text>
	// 						</Text>
	// 						<Text
	// 							fontSize={{ base: '14px', md: '16px' }}
	// 							fontFamily='Poppins'
	// 							fontWeight='400'
	// 						>
	// 							Absent:{' '}
	// 							<Text as='span' fontWeight='bold'>
	// 								{employee.absent}
	// 							</Text>
	// 						</Text>
	// 						<Text
	// 							fontSize={{ base: '14px', md: '16px' }}
	// 							fontFamily='Poppins'
	// 							fontWeight='400'
	// 						>
	// 							Remaining Days:{' '}
	// 							<Text as='span' fontWeight='bold'>
	// 								{employee.remainingDays}
	// 							</Text>
	// 						</Text>
	// 						<Text
	// 							fontSize={{ base: '14px', md: '16px' }}
	// 							fontFamily='Poppins'
	// 							fontWeight='400'
	// 						>
	// 							Late:{' '}
	// 							<Text as='span' fontWeight='bold'>
	// 								{employee.late}
	// 							</Text>
	// 						</Text>
	// 					</Box>
	// 				</Box>

	// 				<Box
	// 					display='flex'
	// 					flexDirection='column'
	// 					justifyContent='center'
	// 					alignItems='center'
	// 					h='263px'
	// 					mt={4}
	// 					p={4}
	// 					bg='white'
	// 					borderRadius='md'
	// 					shadow='sm'
	// 					textAlign='center'
	// 				>
	// 					<Text
	// 						fontFamily='Poppins'
	// 						fontWeight='medium'
	// 						fontSize={{ base: '20px', md: '24px' }}
	// 					>
	// 						Mark Attendance
	// 					</Text>
	// 					<Text
	// 						fontWeight='medium'
	// 						textColor='#A07723'
	// 						fontFamily='Poppins'
	// 						fontSize={{ base: '20px', md: '24px' }}
	// 					>
	// 						12:00:00 AM
	// 					</Text>
	// 					<Button
	// 						size='sm'
	// 						mt={2}
	// 						bg='#D8A541'
	// 						w={{ base: '100%', md: '208px' }}
	// 						h='43px'
	// 						color='white'
	// 						leftIcon={<IoMdExit size={20} />}
	// 					>
	// 						Check In
	// 					</Button>
	// 				</Box>
	// 			</Box>

	// 			<Box bg='white' p={5} borderRadius='md' shadow='sm' overflowX='scroll'>
	// 				<Box
	// 					display='flex'
	// 					justifyContent='space-between'
	// 					alignItems='center'
	// 					mb={4}
	// 					flexDirection={{ base: 'column', md: 'row' }}
	// 					gap={{ base: 4, md: 0 }}
	// 				>
	// 					<Text
	// 						fontWeight='bold'
	// 						fontSize={{ base: '18px', md: '20px' }}
	// 						fontFamily='Antic'
	// 					>
	// 						Attendance Overview
	// 					</Text>
	// 					<Box
	// 						gap={4}
	// 						display='flex'
	// 						flexDirection={{ base: 'column', md: 'row' }}
	// 						w={{ base: '100%', md: 'auto' }}
	// 					>
	// 						<Button
	// 							h='48px'
	// 							leftIcon={<CalendarIcon />}
	// 							bg='#D5D9DD'
	// 							borderRadius='md'
	// 							w={{ base: '100%', md: 'auto' }}
	// 						>
	// 							Jan 2025
	// 						</Button>

	// 						<Button
	// 							h='48px'
	// 							w={{ base: '100%', md: '214px' }}
	// 							leftIcon={<RiEqualizerLine />}
	// 							bgGradient='linear(to-r, #4B74FF, #0043FF)'
	// 							color='white'
	// 							_hover={{ bgGradient: 'linear(to-r, #3A5FCC, #0033CC)' }}
	// 							borderRadius='md'
	// 						>
	// 							Advanced Filters
	// 						</Button>
	// 					</Box>
	// 				</Box>

	// 				<Divider color='#D5D9DD' mb={4} />
	// 				<Box overflowX='auto'>
	// 					<Table variant='simple' size='sm' bg='white' borderRadius='md'>
	// 						<Thead>
	// 							<Tr>
	// 								{[
	// 									'AID',
	// 									'Day',
	// 									'Type',
	// 									'Location',
	// 									'Date',
	// 									'Status',
	// 									'Check-in',
	// 									'Check-out',
	// 									'Work hours',
	// 								].map((header, index) => (
	// 									<Th key={index} whiteSpace='nowrap'>
	// 										<Box display='flex' alignItems='center'>
	// 											<Text
	// 												fontFamily='Antic'
	// 												fontSize={{ base: '12px', md: '14px' }}
	// 												fontWeight='400'
	// 											>
	// 												{header}
	// 											</Text>
	// 											{[
	// 												'Type',
	// 												'Location',
	// 												'Status',
	// 												'Check-in',
	// 												'Check-out',
	// 												'Work hours',
	// 											].includes(header) && <IoMdArrowDropdown />}
	// 										</Box>
	// 									</Th>
	// 								))}
	// 							</Tr>
	// 						</Thead>

	// 						<Tbody>
	// 							{attendanceData.map((entry, index) => {
	// 								let textColor = 'black';
	// 								let rowBgGradient = 'none';
	// 								let statusBgColor = 'transparent';

	// 								if (entry.status === 'Absent') {
	// 									statusBgColor = '#FFE5EE';
	// 									textColor = '#AA0000';
	// 								} else if (entry.status === 'Late arrival') {
	// 									statusBgColor = '#FFF8E7';
	// 									textColor = '#D5B500';
	// 									rowBgGradient = 'linear(to-r, #E0F7FF, white)';
	// 								} else if (entry.status === 'Office') {
	// 									statusBgColor = '#E6EFFC';
	// 									textColor = '#0764E6';
	// 								}

	// 								return (
	// 									<Tr
	// 										key={entry.id}
	// 										_hover={{ bg: 'gray.50' }}
	// 										borderBottom={
	// 											index === attendanceData.length - 1
	// 												? 'none'
	// 												: '1px solid'
	// 										}
	// 										borderColor='gray.200'
	// 										bgGradient={rowBgGradient}
	// 									>
	// 										<Td
	// 											borderBottom='none'
	// 											py={4}
	// 											fontFamily='Anybody'
	// 											fontSize={{ base: '12px', md: '15px' }}
	// 											fontWeight='500'
	// 										>
	// 											{entry.id}
	// 										</Td>
	// 										<Td
	// 											borderBottom='none'
	// 											py={4}
	// 											fontFamily='Anybody'
	// 											fontSize={{ base: '12px', md: '15px' }}
	// 											fontWeight='500'
	// 										>
	// 											{entry.day}
	// 										</Td>
	// 										<Td
	// 											borderBottom='none'
	// 											py={4}
	// 											fontFamily='Anybody'
	// 											fontSize={{ base: '12px', md: '14px' }}
	// 											fontWeight='400'
	// 										>
	// 											{entry.type}
	// 										</Td>
	// 										<Td
	// 											borderBottom='none'
	// 											py={4}
	// 											fontFamily='Anybody'
	// 											fontSize={{ base: '12px', md: '14px' }}
	// 											fontWeight='400'
	// 										>
	// 											{entry.location}
	// 										</Td>
	// 										<Td borderBottom='none' py={4}>
	// 											{entry.date}
	// 										</Td>
	// 										<Td borderBottom='none' py={4}>
	// 											<Box
	// 												bg={statusBgColor}
	// 												color={textColor}
	// 												fontWeight='bold'
	// 												px={2}
	// 												py={1}
	// 												borderRadius='md'
	// 												display='inline-block'
	// 											>
	// 												{entry.status}
	// 											</Box>
	// 										</Td>
	// 										<Td
	// 											borderBottom='none'
	// 											py={4}
	// 											color={
	// 												entry.checkIn === '00:00' ? 'red.500' : 'blue.500'
	// 											}
	// 										>
	// 											{entry.checkIn}
	// 										</Td>
	// 										<Td
	// 											borderBottom='none'
	// 											py={4}
	// 											color={
	// 												entry.checkOut === '00:00' ? 'red.500' : 'blue.500'
	// 											}
	// 										>
	// 											{entry.checkOut}
	// 										</Td>
	// 										<Td
	// 											borderBottom='none'
	// 											py={4}
	// 											fontFamily='Anybody'
	// 											fontSize={{ base: '12px', md: '14px' }}
	// 											fontWeight='400'
	// 										>
	// 											{entry.workHours}
	// 										</Td>
	// 									</Tr>
	// 								);
	// 							})}
	// 						</Tbody>
	// 					</Table>
	// 					<Divider color='#D5D9DD' mb={4} />
	// 				</Box>
	// 			</Box>
	// 		</Grid>
	// 	</Box>
	// );
};

export default Attendance;
