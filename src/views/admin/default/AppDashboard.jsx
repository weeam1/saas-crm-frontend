import { useColorModeValue, Box, useColorMode } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getApi } from 'services/api';
import { HasAccess } from '../../../redux/accessUtils';

import Header from './components/Header';
import DashboardStatCards from './components/DashboardStatCards';
import { useFetchItemsQuery } from 'api/apiSlice';
import Loader from 'components/loading/Loader';
import ReportChart from './components/ReportChart';
import TodaySummary from './components/TodaySummary';
import LeadStatusPieChart from './components/lead-status/LeadStatusPieChart';
import SalesDashboard from './components/sales/SalesDashboard';
import useUserSession from 'hooks/useUserSession';
import { hasPermission } from 'utils';

export default function AppDashboard() {
	const { colorMode } = useColorMode();
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
		<Loader />
	) : (
		<Box>
			{/* <Header /> */}

			<SalesDashboard data={sales} />

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
