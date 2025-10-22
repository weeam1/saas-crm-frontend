import { useColorModeValue, Box, useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import { HasAccess } from '../../../redux/accessUtils';

import DashboardStatCards from './components/DashboardStatCards';
import { useFetchItemsQuery } from 'api/apiSlice';
import ReportChart from './components/ReportChart';
import TodaySummary from './components/TodaySummary';
import LeadStatusPieChart from './components/lead-status/LeadStatusPieChart';
import SalesDashboard from './components/sales/SalesDashboard';
import useUserSession from 'hooks/useUserSession';
import CardShimmer from 'components/loading/CardShimmer';
import OnlineUsersCard from './components/OnlineUsersCard';
import { usePermissions } from 'hooks/usePermissions';

export default function AppDashboard() {
	const { colorMode } = useColorMode();
	const { hasPermission } = usePermissions();
	// Chakra Color Mode
	const viewsState = HasAccess([
		'Contacts',
		'Task',
		'Lead',
		'Property',
		'Email',
		'Call',
		'Meeting',
	]);

	const brandColor = useColorModeValue('brand.500', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const { user, userRoleName } = useUserSession();

	const [fetched, setFetched] = useState(false);

	const { data: stats = {}, isLoading } = useFetchItemsQuery(
		{ path: '/dashboard/stats' },
		{
			refetchOnMountOrArgChange: true,
			skip: !userRoleName === 'superAdmin',
		}
	);

	const { data: todaySummary = {}, isLoading: todaySummaryLoading } =
		useFetchItemsQuery(
			{ path: '/dashboard/today_summary' },
			{
				refetchOnMountOrArgChange: true,
				skip: !userRoleName === 'superAdmin',
			}
		);

	const { data: leadStatusData = {}, isLoading: leadStatusLoading } =
		useFetchItemsQuery(
			{ path: '/dashboard/leads/leadStatus_stats' },
			{
				refetchOnMountOrArgChange: true,
				skip: !userRoleName === 'superAdmin',
			}
		);

	// const salesQueryParmas =
	// 	['Agent', 'Manager'].includes(userRoleName) && user?._id
	// 		? { userId: user._id }
	// 		: {};

	// const [month, setMonth] = useState(() => new Date().getMonth() + 1);
	// const [year, setYear] = useState(() => new Date().getFullYear());

	// const [salesQueryParmas, setSalesQueryParams] = useState({
	// 	month,
	// 	year,
	// });

	const { data: sales, isLoading: salesLoading } = useFetchItemsQuery(
		{
			path: '/deals/monthly',
			// params: salesQueryParmas,
		},
		{
			refetchOnMountOrArgChange: true,
		}
	);

	return isLoading ||
		todaySummaryLoading ||
		leadStatusLoading ||
		salesLoading ? (
		<Box py='2'>
			<CardShimmer
				count={12}
				height='200px'
				columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4, '2xl': 4 }}
				gap='4'
			/>
		</Box>
	) : (
		<Box>
			{/* <Header /> */}
			{hasPermission('dashboard', 'online_users_count') && <OnlineUsersCard />}

			{hasPermission('deal') && <SalesDashboard data={sales} />}

			{['superAdmin', 'Admin'].includes(userRoleName) && (
				<>
					<TodaySummary summary={todaySummary?.summary} />

					<DashboardStatCards colorMode={colorMode} stats={stats} />
				</>
			)}

			{hasPermission('report') && <ReportChart stats={stats} />}

			{['Agent', 'Manager', 'Admin', 'superAdmin'].includes(userRoleName) && (
				<LeadStatusPieChart data={leadStatusData?.doc} />
			)}
		</Box>
	);
}
