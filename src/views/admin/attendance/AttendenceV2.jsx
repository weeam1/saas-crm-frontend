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

import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';

const AttendanceV2 = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [tabKey, setTabKey] = useState(0);

	const { user, userRoleName } = useUserSession();
	const { hasPermission } = usePermissions();

	// const DEFAULT_TAB =
	// 	userRoleName === 'superAdmin' ? 'dashboard' : 'my-attendance';

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
				label: 'My Attendance',
				icon: FaUserCheck,
				param: 'my-attendance',
				title: 'My Attendance',
				description: 'View and track your personal attendance history.',
				component: <MyAttendance key='my-attendance' userId={user?._id} />,
			},
		],
		[user?._id] // only re-create when user changes
	);

	const filteredTabs = useMemo(
		() =>
			allTabsData.filter(
				(tab) => !tab.id || hasPermission('attendance', tab.id)
			),
		[allTabsData, hasPermission]
	);

	const tabsData = useMemo(() => {
		if (userRoleName === 'superAdmin' || userRoleName === 'Attendance') {
			return filteredTabs.filter((tab) => tab.param !== 'my-attendance');
		}
		if (userRoleName === 'HR') {
			return filteredTabs;
		}
		return filteredTabs.filter((tab) => tab.param === 'my-attendance');
	}, [userRoleName, filteredTabs]);

	const activeTabIndex = useMemo(() => {
		const idx = tabsData.findIndex((tab) => tab.param === tabFromParams);
		return idx >= 0 ? idx : 0;
	}, [tabsData, tabFromParams]);

	useEffect(() => {
		if (
			!tabFromParams ||
			!tabsData.some((tab) => tab.param === tabFromParams)
		) {
			const firstTab = tabsData[0]?.param; // safe check
			if (firstTab) {
				setSearchParams({ tab: firstTab }, { replace: true });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleTabChange = useCallback(
		(index) => {
			const tabParam = tabsData[index]?.param;
			if (!tabParam) return;

			// Only update search params if it's actually different
			if (tabParam !== tabFromParams) {
				setSearchParams({ tab: tabParam });
			} else {
				// same tab clicked → force re-render of tab content
				setTabKey((prev) => prev + 1);
			}
		},
		[tabsData, tabFromParams, setSearchParams]
	);

	return (
		<>
			<TabNavigationDisplay
				tabsData={tabsData.map((tab) => ({
					...tab,
					component:
						tab.param === tabFromParams?.toLowerCase() ? tab.component : null,
				}))}
				activeTab={activeTabIndex}
				onTabChange={handleTabChange}
			/>
		</>
	);
};

export default AttendanceV2;
