import { useEffect, useState } from 'react';
import { Box, Text, Divider, Button, Flex } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import AttendanceStats from './AttendanceStats';
import AttendanceMark from './AttendanceMark';
import Header from './Header';
import AttendanceTable from './AttendanceTable';
import ErrorMessage from 'components/Message/ErrorMessage';
import { buttonStyle } from '../../constants';
import { IoArrowBack } from 'react-icons/io5';
import AppButton from 'components/shared/AppButton';
import AttendanceShimmer from './AttendanceShimmer';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';

const Attendance = () => {
	const { id: employeeId } = useParams();
	const user = JSON.parse(localStorage.getItem('user'));

	const role =
		user?.role === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;

	// const { data: officeSettings, isLoading: officeSettingsLoading } =
	// 	useFetchItemsQuery(
	// 		{ path: `/attendance/office-settings/agency/${user?.agency?._id}` },
	// 		{
	// 			refetchOnMountOrArgChange: true,
	// 		}
	// 	);

	const { data: employee, isLoading: employeeLoading } = useFetchItemsQuery(
		{
			path: `/user/v2/view/${user._id}`,
		},
		{
			skip: !user._id,
			refetchOnMountOrArgChange: true,
		}
	);

	const [month, setMonth] = useState(() => new Date().getMonth() + 1);
	const [year, setYear] = useState(() => new Date().getFullYear());
	const [timezone, setTimezone] = useState('Asia/Dubai');

	const { data, isLoading, refetch, isFetching, error } = useFetchItemsQuery(
		{
			path: '/attendance/employee-record-per-month',
			params: { employeeId: employeeId, month, year },
		},
		{
			skip: !employee,
			refetchOnMountOrArgChange: true,
		}
	);

	useEffect(() => {
		if (data?.officeSettings) {
			setTimezone(data?.officeSettings?.timezone ?? 'Asia/Dubai');
		}
	}, [data?.officeSettings]);

	const onFilterChange = (value) => {
		setMonth(Number(value.month));
		setYear(Number(value.year));
		refetch();
	};

	const navigate = useNavigate();

	return isLoading || employeeLoading ? (
		<Box h='100vh'>
			<AttendanceShimmer />
		</Box>
	) : employee ? (
		data?.officeSettings ? (
			<Box
				p={{ base: 4, md: 6 }}
				minH='100vh'
				fontFamily="'DM Sans', sans-serif"
			>
				<AppButton
					leftIcon={<IoArrowBack />}
					onClick={() =>
						navigate(
							['superAdmin', 'HR'].includes(role)
								? '/attendance/employees'
								: '/attendance'
						)
					}
				>
					Back
				</AppButton>
				<Box display='flex' alignItems='center' mt={2} mb='4' bg='white' p={4}>
					<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
						Attendance Record
					</Text>
				</Box>

				{error ? (
					<ErrorMessage message='No results found. Please check your query.' />
				) : (
					<Flex flexDirection={{ base: 'column', lg: 'row' }} gap={6}>
						<Box minWidth={{ base: '100%', lg: '310px' }}>
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
									officeSettings={data?.officeSettings}
								/>
							)}
						</Box>

						<Box
							flex='1'
							bg='white'
							p={5}
							borderRadius='md'
							shadow='sm'
							minWidth={{ base: '100%', lg: '600px' }}
						>
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
							onClick={() =>
								navigate(`/office-settings/${employee?.agency?._id}`)
							}
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
		)
	) : (
		<NoData label='employee' />
	);
};

export default Attendance;
