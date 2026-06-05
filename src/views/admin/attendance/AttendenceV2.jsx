import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	FaTachometerAlt,
	FaUsers,
	FaClipboardList,
	FaUserCheck,
} from 'react-icons/fa';
import TabNavigationDisplay from '../../../components/TabNavigationDisplay/TabNavigationDisplay';
import Dashboard from './components/dashboard/index';
import Employees from './components/employees/index';
import Records from './components/records/index';
import MyAttendance from './components/myAttendance/index';
import NotPermission from 'components/notPermission/NotPermission';
import { Box } from '@chakra-ui/react';

import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
import { useModalColors } from 'hooks/useModalColors';

const AttendanceV2 = () => {
	const colors = useModalColors();
	const [searchParams, setSearchParams] = useSearchParams();
	const [tabKey, setTabKey] = useState(0);

	const { user, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	// always read param string (not object reference)
	const tabFromParams = searchParams.get('tab')?.toLowerCase();

	// useMemo so tabsData is stable
	const allTabsData = useMemo(
		() => [
			{
				id: 'dashboard',
				label: 'Dashboard',
				icon: FaTachometerAlt,
				param: 'dashboard',
				title: 'Attendance Dashboard',
				description:
					'View overall attendance statistics and key metrics at a glance.',
				component: <Dashboard key='dashboard' />,
			},
			{
				id: 'employees',
				label: 'Employees',
				icon: FaUsers,
				param: 'employees',
				title: 'Employee Management',
				description: 'Manage employee attendance records and profiles.',
				component: <Employees key='employees' />,
			},
			{
				id: 'record',
				label: 'Records',
				icon: FaClipboardList,
				param: 'records',
				title: 'Attendance Records',
				description: 'View and manage all attendance records in detail.',
				component: <Records key='records' />,
			},
			{
				id: 'my_attendance',
				label: 'My Attendance',
				icon: FaUserCheck,
				param: 'my-attendance',
				title: 'My Attendance',
				description: 'View and track your personal attendance history.',
				component: <MyAttendance key='my-attendance' userId={user?._id} />,
			},
		],
		[user?._id]
	);

	const filteredTabs = useMemo(
		() =>
			allTabsData.filter(
				(tab) => !tab.id || hasPermission('attendance', tab.id)
			),
		[allTabsData, hasPermission]
	);

	const tabsData = useMemo(() => {
		if (userRoleName === 'superAdmin') {
			return filteredTabs.filter((tab) => tab.param !== 'my-attendance');
		}
		return filteredTabs;
	}, [userRoleName, filteredTabs]);

	const activeTabIndex = useMemo(() => {
		const idx = tabsData.findIndex((tab) => tab.param === tabFromParams);
		return idx >= 0 ? idx : 0;
	}, [tabsData, tabFromParams]);

	useEffect(() => {
		if (tabsData.length === 0) return;

		const currentTab = tabFromParams;

		const isValidTab = tabsData.some((tab) => tab.param === currentTab);

		if (!currentTab || !isValidTab) {
			const fallback = tabsData[0].param;
			setSearchParams({ tab: fallback }, { replace: true });
		}
	}, [tabsData, searchParams, setSearchParams, tabFromParams]);

	const handleTabChange = useCallback(
		(index) => {
			const tabParam = tabsData[index]?.param;
			if (!tabParam) return;

			if (tabParam !== tabFromParams) {
				setSearchParams({ tab: tabParam });
			} else {
				setTabKey((prev) => prev + 1);
			}
		},
		[tabsData, tabFromParams, setSearchParams]
	);

	if (tabsData.length === 0) {
		return <NotPermission moduleName="attendence" />;
	}

	return (
		<Box bg={colors.bgDeep} minH='100vh'>
			<TabNavigationDisplay
				tabsData={tabsData.map((tab) => ({
					...tab,
					component:
						tab.param === tabFromParams?.toLowerCase() ? tab.component : null,
				}))}
				activeTab={activeTabIndex}
				onTabChange={handleTabChange}
			/>
		</Box>
	);
};

export default AttendanceV2;