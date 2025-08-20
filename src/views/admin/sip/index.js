import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import SipDashboard from "./component/Dashboard";
import SipHistory from './component/History';
import TabNavigationDisplay from 'components/TabNavigationDisplay/TabNavigationDisplay';
import CallsReport from '../reports-v2/components/sip/CallsReport';
import UserSetting from './component/UserSetting';
import { usePermissions } from 'hooks/usePermissions';

const DEFAULT_TAB = 'dashboard';

const Sip = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const tabFromParams = searchParams.get('tab') || DEFAULT_TAB;
	const [tabKey, setTabKey] = useState(0);
	const [totalCallRecord, setTotalCallRecord] = useState(0);
	const [animatedCount, setAnimatedCount] = useState(0);

	const { hasPermission } = usePermissions();
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasPermission('sip')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (tabFromParams.toLowerCase() === 'history') {
			setAnimatedCount(0);
			const duration = 1000;
			const steps = 30;
			const increment = totalCallRecord / steps;
			let current = 0;
			const interval = setInterval(() => {
				current += increment;
				if (current >= totalCallRecord) {
					setAnimatedCount(totalCallRecord);
					clearInterval(interval);
				} else {
					setAnimatedCount(Math.ceil(current));
				}
			}, duration / steps);
			return () => clearInterval(interval);
		}
	}, [totalCallRecord, tabFromParams]);
	const tabsData = useMemo(
		() => [
			{
				label: 'Dashboard',
				param: 'dashboard',
				title: 'Call Analytics Overview',
				description:
					'Get a quick summary of your call activity including total time spent on calls, number of unique calls, and average call durations over the selected period.',
				// component: <SipDashboard key={tabKey} />,
				component: <CallsReport />,
			},
			{
				label: 'History',
				param: 'history',
				title: `Call History Log (${animatedCount})`,
				description:
					'Explore detailed records of each call including timestamps, duration, participants, and call modes for a comprehensive communication history.',
				component: (
					<SipHistory key={tabKey} setTotalCallRecord={setTotalCallRecord} />
				),
			},
			{
				label: 'User Setting',
				param: 'user-setting',
				title: 'User Settings',
				description:
					'Manage your SIP user settings including registration, authentication, and other preferences to optimize your call experience.',
				component: <UserSetting key={tabKey} />,
			},
		],
		[tabKey, totalCallRecord, animatedCount]
	);

	const activeTabIndex = Math.max(
		0,
		tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
	);

	useEffect(() => {
		if (
			!searchParams.get('tab') ||
			!tabsData.some(
				(tab) => tab.param === searchParams.get('tab').toLowerCase()
			)
		) {
			setSearchParams({ tab: DEFAULT_TAB });
		}
	}, [searchParams, setSearchParams, tabsData]);

	const handleTabChange = (index) => {
		const tabParam = tabsData[index].param;
		setSearchParams({ tab: tabParam });

		if (index === activeTabIndex) {
			setTabKey((prev) => prev + 1);
		}
	};

	return (
		<>
			<TabNavigationDisplay
				tabsData={tabsData.map((tab) => ({
					label: tab.label,
					title: tab.title,
					description: tab.description,
					component:
						tab.param === tabFromParams.toLowerCase() ? tab.component : null,
				}))}
				activeTab={activeTabIndex}
				onTabChange={handleTabChange}
			/>
		</>
	);
};

export default Sip;
