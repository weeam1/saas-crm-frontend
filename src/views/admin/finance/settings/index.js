import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TabNavigationDisplay from 'components/TabNavigationDisplay/TabNavigationDisplay';
import Category from './category';
import SubCategory from './subCategory';

const DEFAULT_TAB = 'category';

const Settings = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [tabKey, setTabKey] = useState(0);
	const tabsData = [
		{
			label: 'Category',
			title: 'Manage Categories',
			description: 'Create and organize main categories for your expenses.',
			component: <Category key={tabKey} />,
		},
		{
			label: 'Sub Category',
			title: 'Manage Subcategories',
			description:
				'Define and manage subcategories linked to each main category.',
			component: <SubCategory key={tabKey} />,
		},
	];

	const tabFromParams = searchParams.get('tab')?.toLowerCase();
	const initialTabIndex = tabsData.findIndex(
		(tab) =>
			tab.label.toLowerCase().replace(/\s/g, '-') ===
			(tabFromParams || DEFAULT_TAB)
	);
	const [activeTabIndex, setActiveTabIndex] = useState(
		initialTabIndex >= 0 ? initialTabIndex : 0
	);

	useEffect(() => {
		if (!searchParams.get('tab')) {
			setSearchParams({ tab: DEFAULT_TAB }, { replace: true });
		}
	}, [searchParams, setSearchParams]);

	const handleTabChange = (index) => {
		if (index === activeTabIndex) {
			setTabKey((prev) => prev + 1);
		} else {
			setActiveTabIndex(index);
			const newTab = tabsData[index].label.toLowerCase().replace(/\s/g, '-');
			setSearchParams({ tab: newTab }, { replace: true });
		}
	};

	return (
		<>
			<TabNavigationDisplay
				tabsData={tabsData}
				activeTab={activeTabIndex}
				onTabChange={handleTabChange}
			/>
		</>
	);
};

export default Settings;
