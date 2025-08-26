import { useEffect, useState } from 'react';
import { Box, Text, Divider, Button, Flex, Stack } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AttendanceStats from './AttendanceStats';
import AttendanceMark from './AttendanceMark';
import Header from './Header';
import AttendanceTable from './AttendanceTable';
import ErrorMessage from 'components/Message/ErrorMessage';
import { buttonStyle } from '../../constants';
import AttendanceShimmer from './AttendanceShimmer';
import NoData from 'views/admin/lead-v2/components/subComponents/NoData';
import CreateAttendance from './CreateAttendance';
import { FaPlus } from 'react-icons/fa';
import ExportEmployeeAttendanceReport from './ExportEmployeeAttendanceReport';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import AppButton from 'components/shared/AppButton';
import { IoArrowBack } from 'react-icons/io5';

const Attendance = ({ userId }) => {
	let { id: paramId } = useParams();
	// const user = JSON.parse(localStorage.getItem('user'));

	const { user, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	// const userRoleName =
	// 	user?.userRoleName === 'superAdmin' ? 'superAdmin' : user?.roles[0]?.roleName;
	const employeeId =
		userRoleName === 'Developer' ? user?._id : userId || paramId;

	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('attendance')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { data: employee, isLoading: employeeLoading } = useFetchItemsQuery(
		{
			path: `/user/v2/view/${employeeId}`,
		},
		{
			skip: !employeeId,
			refetchOnMountOrArgChange: true,
		}
	);

	const [month, setMonth] = useState(() => new Date().getMonth() + 1);
	const [year, setYear] = useState(() => new Date().getFullYear());
	const [timezone, setTimezone] = useState('Asia/Dubai');
	const [addAttendance, setAddAttendance] = useState(false);

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

	return isLoading || employeeLoading ? (
		<Box h='100vh'>
			<AttendanceShimmer />
		</Box>
	) : employee ? (
		data?.officeSettings ? (
			<Box p={{ base: 4, md: 6 }} minH='100vh'>
				{hasPermission('attendance', 'employees') && (
					<AppButton leftIcon={<IoArrowBack />} onClick={() => navigate(-1)}>
						Back
					</AppButton>
				)}
				<Flex
					justifyContent='space-between'
					alignItems='center'
					flexDir={{ base: 'column', md: 'row' }}
					mt={2}
					mb='4'
					bg='white'
					p={4}
					gap='4'
				>
					<Text fontSize={{ base: 'md', md: 'lg' }} fontWeight='bold'>
						Attendance Record
					</Text>

					<Stack direction={{ base: 'row' }} spacing={2}>
						{hasPermission('attendance', 'export') && (
							<ExportEmployeeAttendanceReport
								month={month}
								year={year}
								employee={employee}
							/>
						)}

						{hasPermission('attendance', 'create') && (
							<Button
								{...buttonStyle}
								variant='solid'
								bg='brand.400'
								py='2'
								px='5'
								leftIcon={<FaPlus />}
								aria-label='Add attendance'
								onClick={() => setAddAttendance(true)}
							>
								Add
							</Button>
						)}
					</Stack>
				</Flex>

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
							{hasPermission('attendance', 'operations') && (
								<AttendanceMark
									data={data}
									timezone={timezone}
									refetch={refetch}
									employeeId={employeeId}
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

						{/* Create attendance modal */}
						{addAttendance && (
							<CreateAttendance
								isOpen={addAttendance}
								onClose={() => setAddAttendance(false)}
								employeeId={employeeId}
								refetch={refetch}
							/>
						)}
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
				{userRoleName === 'superAdmin' ? (
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
