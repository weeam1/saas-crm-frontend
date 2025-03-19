import { useEffect, useState } from 'react';
import { Box, Text, Grid, Divider, Button, Flex } from '@chakra-ui/react';

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
import { buttonStyle } from '../../constants';

const Attendance = () => {
	const { id: employeeId } = useParams();
	const user = JSON.parse(localStorage.getItem('user'));

	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	const { data: officeSettings, isLoading: officeSettingsLoading } =
		useFetchItemsQuery(
			{ path: `/attendance/office-settings/agency/${user?.agency?._id}` },
			{
				refetchOnMountOrArgChange: true,
			}
		);

	const timezone = officeSettings?.doc?.timezone ?? 'Asia/Dubai';

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

	return isLoading || officeSettingsLoading ? (
		<Box h='100vh'>
			<Loader />
		</Box>
	) : officeSettings?.doc ? (
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
					onClick={() =>
						navigate(
							['superAdmin', 'HR'].includes(role)
								? '/attendance/employees'
								: '/attendance'
						)
					}
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
				<Flex flexDirection={{ base: 'column', lg: 'row' }} gap={6}>
					<Box minWidth={{ base: '100%', lg: '400px' }}>
						<AttendanceStats
							stats={data?.stats}
							employee={data?.employee}
							refetch={refetch}
						/>
						{(role === 'superAdmin' || role === 'HR') && (
							<AttendanceMark
								data={data}
								timezone={timezone}
								refetch={refetch}
							/>
						)}
					</Box>

					<Box flex='1' bg='white' p={5} borderRadius='md' shadow='sm'>
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
				</Flex>
			)}
		</Box>
	) : (
		<Flex
			direction='column'
			align='center'
			textAlign='center'
			justify='center'
			bg='yellow.100'
			p={4}
			borderRadius='md'
			fontFamily="'DM Sans', sans-serif"
			boxShadow='sm'
		>
			{role === 'superAdmin' ? (
				<>
					<Text fontSize='lg' fontWeight='bold' color='gray.700'>
						No office settings found!
					</Text>
					<Text fontSize='md' color='gray.600'>
						To ensure smooth attendance tracking, please configure your office
						settings.
					</Text>
					<Button
						{...buttonStyle}
						mt={3}
						bg='green.500'
						_active={{ bg: 'green.400' }}
						onClick={() => navigate(`/office-settings/${user?.agency?._id}`)}
					>
						Add Office Settings
					</Button>
				</>
			) : (
				<>
					<Text fontSize='lg' fontWeight='bold' color='gray.700'>
						Office settings not configured!
					</Text>
					<Text fontSize='md' color='gray.600'>
						Please contact your administrator to set up office settings for
						attendance tracking.
					</Text>
				</>
			)}
		</Flex>
	);
};

export default Attendance;
