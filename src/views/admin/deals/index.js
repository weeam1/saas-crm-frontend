import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaTachometerAlt, FaUsers } from 'react-icons/fa';

import NotPermission from 'components/notPermission/NotPermission';
import TabNavigationDisplay from 'components/TabNavigationDisplay/TabNavigationDisplay';

import useUserSession from 'hooks/useUserSession';
import { usePermissions } from 'hooks/usePermissions';
import DealsScreen from './DealsScreen';
import SharedDealsScreen from './SharedDealsScreen';

const DealsLayout = () => {
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
				id: 'closed_deals',
				label: 'Deals',
				icon: FaTachometerAlt,
				param: 'closed-deals',
				title: 'Closed Deals',
				description:
					'View and analyze completed deals, transaction details, and performance metrics.',
				component: <DealsScreen key='closed_deals' />,
			},
			{
				id: 'shared_deals',
				label: 'Shared Deals',
				icon: FaUsers,
				param: 'shared-deals',
				title: 'Shared Deals',
				description:
					'Explore deals with distributed ownership, shared credit, or collaborative participation.',
				component: <SharedDealsScreen key='shared_deals' />,
			},
		],
		[user?._id] // only re-create when user changes
	);

	const tabsData = useMemo(
		() => allTabsData.filter((tab) => !tab.id || hasPermission('deal', tab.id)),
		[allTabsData, hasPermission]
	);

	const activeTabIndex = useMemo(() => {
		const idx = tabsData.findIndex((tab) => tab.param === tabFromParams);
		return idx >= 0 ? idx : 0;
	}, [tabsData, tabFromParams]);

	useEffect(() => {
		if (tabsData.length === 0) return;

		const currentTab = tabFromParams;

		const isValidTab = tabsData.some((tab) => tab.param === currentTab);

		if (!currentTab || !isValidTab) {
			// always default to first available tab (index 0)
			const fallback = tabsData[0].param;
			setSearchParams({ tab: fallback }, { replace: true });
		}
	}, [tabsData, searchParams, setSearchParams, tabFromParams]);

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

	if (tabsData.length === 0) {
		return <NotPermission moduleName='deals' />;
	}
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

export default DealsLayout;
