import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CreateAnnouncement from './components/CreateAnnouncement';
import History from './components/History';
import TabNavigationDisplay from '../../../components/TabNavigationDisplay/TabNavigationDisplay';
import useUserSession from 'hooks/useUserSession';

const DEFAULT_TAB = 'announcement';

const Announcements = () => {
	const { user } = useUserSession();

	const [searchParams, setSearchParams] = useSearchParams();
	const tabFromParams = searchParams.get('tab')?.toLowerCase() || DEFAULT_TAB;
	const [tabKey, setTabKey] = useState(0);

	const tabsData = useMemo(
		() => [
			{
				label: 'Announcement',
				param: 'announcement',
				title: 'Create New Announcement',
				description:
					'Quickly create and publish new announcements to keep everyone informed and updated.',
				component: <CreateAnnouncement key={tabKey} user={user} />,
			},
			{
				label: 'History',
				param: 'history',
				title: 'Announcement History',
				description:
					'View a history of all published announcements, including their details and posting dates.',
				component: <History key={tabKey} user={user} />,
			},
		],
		[tabKey, user]
	);

	const activeTabIndex = Math.max(
		0,
		tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
	);

	useEffect(() => {
		if (
			!searchParams.get('tab') ||
			!tabsData.some(
				(tab) => tab.param === searchParams.get('tab')?.toLowerCase()
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
		<TabNavigationDisplay
			tabsData={tabsData.map((tab) => ({
				...tab,
				component:
					tab.param === tabFromParams.toLowerCase() ? tab.component : null,
			}))}
			activeTab={activeTabIndex}
			onTabChange={handleTabChange}
		/>
	);
};

export default Announcements;
