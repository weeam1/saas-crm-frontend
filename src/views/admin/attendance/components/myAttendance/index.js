import React, { useEffect, useState } from 'react';
import { Box, Text, Grid, Divider, useBreakpointValue } from '@chakra-ui/react';

import { IoIosArrowBack } from 'react-icons/io';
import { useFetchItemsQuery } from 'api/apiSlice';
import moment from 'moment-timezone';
import { useNavigate, useParams } from 'react-router-dom';
import AttendanceStats from './AttendanceStats';
import AttendanceMark from './AttendanceMark';
import Header from './Header';
import AttendanceTable from './AttendanceTable';
import Loader from 'components/loading/Loader';
const timezone = 'Asia/Karachi';

const Attendance = () => {
	const { id: employeeId } = useParams();

	const [month, setMonth] = useState(() =>
		Number(moment.tz(timezone).format('M'))
	);
	const [year, setYear] = useState(() =>
		Number(moment.tz(timezone).format('YYYY'))
	);

	const { data, isLoading, refetch } = useFetchItemsQuery(
		{
			path: '/attendance/employee-record-per-month',
			params: { employeeId: employeeId, month, year },
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

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

	const navigate = useNavigate();

	return isLoading ? (
		<Box h='100vh'>
			<Loader />
		</Box>
	) : (
		<Box p={{ base: 4, md: 6 }} minH='100vh' fontFamily="'DM Sans', sans-serif">
			<Box display='flex' alignItems='center' mb={4} bg='white' p={4}>
				<Text
					fontSize={{ base: 'sm', md: 'md' }}
					fontWeight='bold'
					color='blue.500'
					cursor='pointer'
					_hover={{ textDecoration: 'underline' }}
					mr={2}
					display='flex'
					alignItems='center'
					onClick={() => navigate('/attendance/employees')}
				>
					<IoIosArrowBack style={{ marginRight: '5px' }} /> Back
				</Text>

				<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
					Attendance Record
				</Text>
			</Box>

			<Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6}>
				<Box>
					<AttendanceStats
						stats={data?.stats}
						employee={data?.employee}
						refetch={refetch}
					/>
					<AttendanceMark data={data} timezone={timezone} refetch={refetch} />
				</Box>

				<Box bg='white' p={5} borderRadius='md' shadow='sm' overflowX='scroll'>
					<Header />
					<Divider color='#D5D9DD' mb={4} />
					<AttendanceTable attendanceRecord={data?.doc} timezone={timezone} />
				</Box>
			</Grid>
		</Box>
	);
};

export default Attendance;
