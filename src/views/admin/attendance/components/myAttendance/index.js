
import { useEffect, useState } from 'react';
import { Box, Text, Divider, Button, Flex, Stack, IconButton } from '@chakra-ui/react';
import { useFetchItemsQuery } from 'api/apiSlice';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import DateFilter from '../DateFilter';
import CustomTooltip from 'components/shared/CustomTooltip';
import { useModalColors } from 'hooks/useModalColors';
import RefreshButton from 'components/refresh/RefreshButton';

const Attendance = ({ userId }) => {
	let { id: paramId } = useParams();
	const colors = useModalColors();

	const { user, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	const navigate = useNavigate();

	const employeeId = paramId || userId || user?._id;

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
	const [shouldRenderMark, setShouldRenderMark] = useState(false);

	const { data, isLoading, refetch, isFetching, error } = useFetchItemsQuery(
		{
			path: '/attendance/v2/employee-record-per-month',
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
		<Box h='100vh' bg={colors.bgDeep}>
			<AttendanceShimmer />
		</Box>
	) : employee ? (
		data?.officeSettings ? (
			<Box minH='100vh' bg={colors.bgDeep} p={4}>
				<Flex
					justifyContent='space-between'
					alignItems='center'
					flexDir={{ base: 'column', md: 'row' }}
					mt={2}
					mb='4'
					bg={colors.bg}
					p={4}
					gap='4'
					borderRadius='md'
					border="1px solid"
					borderColor={colors.borderColor}
				>
					<Flex alignItems={"center"} gap={2}>
						{paramId && (
							<IconButton
								icon={<IoArrowBack />}
								onClick={() => navigate(-1)}
								variant="ghost"
								color={colors.bodyText}
								_hover={{
									color: colors.accentGold,
									bg: colors.secondaryBtnHoverBg,
								}}
							/>
						)}
						<Text fontWeight='bold' fontSize={{ base: '18px', md: '20px' }} color={colors.headingText}>
							Attendance Overview
						</Text>
					</Flex>

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
								variant='brand'
								py='2'
								px='5'
								leftIcon={<FaPlus />}
								aria-label='Add attendance'
								onClick={() => setAddAttendance(true)}
								transition='all 0.2s ease'
							>
								Add
							</Button>
						)}
						<DateFilter onFilterChange={onFilterChange} />
							<RefreshButton
								label="Refresh"
								onClick={() => refetch()}
								isLoading={isLoading}
								isFetching={isFetching}
								size="sm"
							/>

					</Stack>
				</Flex>

				{error ? (
					<ErrorMessage message='No results found. Please check your query.' />
				) : (
					<Flex flexDirection={{ base: 'column' }} gap={3}>
						<Box minWidth={{ base: '100%', lg: '310px' }} display={"grid"} gridTemplateColumns={{
							base: '1fr',
							md: shouldRenderMark ? '3fr 1fr' : '1fr'
						}} gap={2}>
							<AttendanceStats
								stats={data?.stats}
								employee={data?.employee}
								refetch={refetch}
							/>
							{hasPermission('attendance', 'operations') && (
								<AttendanceMark
									setShouldRenderMark={setShouldRenderMark}
									data={data}
									timezone={timezone}
									refetch={refetch}
									employeeId={employeeId}
									officeSettings={data?.officeSettings}
									employeeName={data?.employee?.fullName || ''}
								/>
							)}
						</Box>

						<Box
							flex='1'
							bg={colors.bg}
							p={2}
							borderRadius='md'
							shadow={colors.cardShadow}
							minWidth={{ base: '100%', lg: '600px' }}
							border="1px solid"
							borderColor={colors.borderColor}
						>
							<Box overflowX='scroll'>
								<AttendanceTable
									attendanceRecord={data?.doc}
									timezone={timezone}
									isLoading={isLoading}
									isFetching={isFetching}
									refetch={refetch}
								/>
							</Box>
						</Box>

						{addAttendance && (
							<CreateAttendance
								isOpen={addAttendance}
								onClose={() => setAddAttendance(false)}
								employeeId={employeeId}
								refetch={refetch}
								employeeName={data?.employee?.fullName || ''}
								selectedMonth={month}
								selectedYear={year}
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
				bg={colors.badgeWarningBg}
				p={4}
				borderRadius='md'
				boxShadow={colors.cardShadow}
				m={4}
			>
				{userRoleName === 'superAdmin' ? (
					<>
						<Text fontSize='lg' fontWeight='bold' color={colors.headingText}>
							No office settings found!
						</Text>
						<Text fontSize='md' color={colors.bodyText}>
							To ensure smooth attendance tracking, please configure your office
							settings.
						</Text>
						<Button
							{...buttonStyle}
							mt={3}
							bg={colors.accentGold}
							color={colors.headerText}
							_hover={{
								bg: colors.goldLight,
								transform: 'translateY(-1px)',
								boxShadow: colors.goldGlow,
							}}
							_active={{ bg: colors.goldDark }}
							onClick={() =>
								navigate(`/office-settings/${employee?.agency?._id}`)
							}
						>
							Add Office Settings
						</Button>
					</>
				) : (
					<>
						<Text fontSize='lg' fontWeight='bold' color={colors.headingText}>
							Office settings not configured!
						</Text>
						<Text fontSize='md' color={colors.bodyText}>
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