import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SipDashboard from './component/Dashboard';
import SipHistory from './component/History';
import TabNavigationDisplay from 'components/TabNavigationDisplay/TabNavigationDisplay';
import CallsReport from '../reports-v2/components/sip/CallsReport';

const DEFAULT_TAB = 'dashboard';

const Sip = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const tabFromParams = searchParams.get('tab') || DEFAULT_TAB;
	const [tabKey, setTabKey] = useState(0);

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
				title: 'Call History Log',
				description:
					'Explore detailed records of each call including timestamps, duration, participants, and call modes for a comprehensive communication history.',
				component: <SipHistory key={tabKey} />,
			},
		],
		[tabKey]
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
