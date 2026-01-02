import { Box, Flex, Text, Button } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabNavigationDisplay from 'components/TabNavigationDisplay/TabNavigationDisplay';

import RecordingsOne from './History';
import RecordingsTwo from './History2';

const DEFAULT_TAB = 'recordings-1';

const RecordingHistory = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [tabKey, setTabKey] = useState(0);

	const navigate = useNavigate();

	const allTabs = [
		{
			label: 'Recordings 1',
			param: 'recordings-1',
			title: 'Recent Recordings',
			description:
				'Browse your most recent recordings. Quickly review, replay, and track activity from the latest sessions.',
			component: <RecordingsOne />,
		},
		{
			label: 'Recordings 2',
			param: 'recordings-2',
			title: 'All Recording History',
			description:
				'Access the complete archive of recordings. Search, filter by date, and manage past sessions from one place.',
			component: <RecordingsTwo />,
		},
	];

	// const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;

	const defaultTab = allTabs[0]?.param || DEFAULT_TAB;
	const tabFromParams = searchParams.get('tab') || defaultTab;

	const activeTabIndex = Math.max(
		0,
		allTabs.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
	);

	// useEffect(() => {
	// 	if (
	// 		!searchParams.get('tab') ||
	// 		!tabsData.some((tab) => tab.param === searchParams.get('tab'))
	// 	) {
	// 		setSearchParams({ tab: DEFAULT_TAB });
	// 	}
	// }, [searchParams, setSearchParams, tabsData]);

	useEffect(() => {
		const tab = searchParams.get('tab');
		if (!tab || !allTabs.some((t) => t.param === tab)) {
			setSearchParams({ tab: defaultTab });
		}
	}, [searchParams, setSearchParams]);

	const handleTabChange = (index) => {
		const tabParam = allTabs[index].param;
		setSearchParams({ tab: tabParam });
		if (index === activeTabIndex) {
			setTabKey((prev) => prev + 1);
		}
	};

	return (
		<>
			<TabNavigationDisplay
				tabsData={allTabs.map((tab) => ({
					...tab,
					component:
						tab.param === tabFromParams.toLowerCase() ? tab.component : null,
				}))}
				activeTab={activeTabIndex}
				onTabChange={handleTabChange}
				pannels={false}
			/>
		</>
	);
};

export default RecordingHistory;
