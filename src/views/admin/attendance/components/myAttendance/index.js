import { useState } from 'react';
import { Box, Text, Grid, Divider } from '@chakra-ui/react';

import { IoIosArrowBack } from 'react-icons/io';
import { useFetchItemsQuery } from 'api/apiSlice';
import moment from 'moment-timezone';
import { useNavigate, useParams } from 'react-router-dom';
import AttendanceStats from './AttendanceStats';
import AttendanceMark from './AttendanceMark';
import Header from './Header';
import AttendanceTable from './AttendanceTable';
import Loader from 'components/loading/Loader';
import ErrorMessage from 'components/Message/ErrorMessage';

const timezone = 'Asia/Karachi';

const Attendance = () => {
	const { id: employeeId } = useParams();

	const [month, setMonth] = useState(() =>
		Number(moment.tz(timezone).format('M'))
	);
	const [year, setYear] = useState(() =>
		Number(moment.tz(timezone).format('YYYY'))
	);

	const { data, isLoading, refetch, isFetching, error } = useFetchItemsQuery(
		{
			path: '/attendance/employee-record-per-month',
			params: { employeeId: employeeId, month, year },
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	const onFilterChange = (value) => {
		setMonth(Number(value.month));
		setYear(Number(value.year));
		refetch();
	};

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

			{error ? (
				<ErrorMessage message='No results found. Please check your query.' />
			) : (
				<Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6}>
					<Box>
						<AttendanceStats
							stats={data?.stats}
							employee={data?.employee}
							refetch={refetch}
						/>
						<AttendanceMark data={data} timezone={timezone} refetch={refetch} />
					</Box>

					<Box bg='white' p={5} borderRadius='md' shadow='sm'>
						<Header onFilterChange={onFilterChange} />
						<Box overflowX='scroll'>
							<Divider color='#D5D9DD' mb={4} />
							<AttendanceTable
								attendanceRecord={data?.doc}
								timezone={timezone}
								isLoading={isLoading}
								isFetching={isFetching}
								refetch={refetch}
							/>
						</Box>
					</Box>
				</Grid>
			)}
		</Box>
	);
};

export default Attendance;
