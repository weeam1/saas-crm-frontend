import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TabNavigationDisplay from 'components/TabNavigationDisplay/TabNavigationDisplay';
import AllListing from './Component/AllListing';
import { Button, Flex, Icon } from '@chakra-ui/react';
import { IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import MyListing from './Component/MyListing';
import ViewRequests from './Component/ViewRequest/index';
import PendingListings from './Component/PendingListings';
import { useFetchItemsQuery } from 'api/apiSlice';
import { usePermissions } from 'hooks/usePermissions';
import useUserSession from 'hooks/useUserSession';
import NotPermission from 'components/notPermission/NotPermission';

const DEFAULT_TAB = 'all listings';

const Listing = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const tabFromParams = searchParams.get('tab') || DEFAULT_TAB;
	const navigate = useNavigate();
	const [tabKey, setTabKey] = useState(0);

	const { user } = useUserSession();
	const { hasPermission } = usePermissions();

	useEffect(() => {
		if (!hasPermission('listing')) return navigate('/default');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { data: listingType } = useFetchItemsQuery(
		{ path: `/listing/secondary/types` },
		{ refetchOnMountOrArgChange: true, skip: !user?._id }
	);

	const { data: listingUnitType } = useFetchItemsQuery(
		{ path: `/listing/secondary/unit-types` },
		{ refetchOnMountOrArgChange: true, skip: !user?._id }
	);

	const allTabs = [
		{
			id: 'all_listing',
			label: 'All Listings',
			param: 'all listings',
			title: 'Property Listings Management',
			description:
				'Manage all property listings for sale and rent. Add, edit, view, and track secondary units including studios, apartments, warehouses, and plots. Maintain comprehensive records with owner and agent information.',
			component: (
				<AllListing
					key={tabKey}
					listingType={listingType}
					listingUnitType={listingUnitType}
				/>
			),
		},
		{
			id: 'my_listing',
			label: 'My Listings',
			param: 'my listings',
			title: 'My Property Listings',
			description:
				'View and manage your personal property listings. Track status, view requests, and update your listings.',
			component: (
				<MyListing
					key={tabKey}
					listingType={listingType}
					listingUnitType={listingUnitType}
				/>
			),
		},
		{
			id: 'view_requests',
			label: 'View Requests',
			param: 'view requests',
			title: 'Property Viewing Requests',
			description:
				'Manage all property viewing requests. Review pending requests, track approved viewings, and monitor rejected requests.',
			component: (
				<ViewRequests
					key={tabKey}
					listingType={listingType}
					listingUnitType={listingUnitType}
				/>
			),
		},
		{
			id: 'pending_listing',
			label: 'Pending Listings',
			param: 'pending listings',
			title: 'Pending Property Listings',
			description:
				'Review and approve new property listings submitted by agents and owners.',
			component: (
				<PendingListings
					key={tabKey}
					listingType={listingType}
					listingUnitType={listingUnitType}
				/>
			),
		},
	];

	const tabsData = allTabs.filter(
		(tab) => !tab.id || hasPermission('listing', tab.id)
	);

	console.log({ tabsData });

	const activeTabIndex = Math.max(
		0,
		tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
	);

	useEffect(() => {
		if (tabsData.length === 0) return;

		const currentTab = searchParams.get('tab')?.toLowerCase();

		const isValidTab = tabsData.some((tab) => tab.param === currentTab);

		if (!currentTab || !isValidTab) {
			// always default to first available tab (index 0)
			const fallback = tabsData[0].param;
			setSearchParams({ tab: fallback }, { replace: true });
		}
	}, [tabsData, searchParams, setSearchParams]);

	const handleTabChange = (index) => {
		const tabParam = tabsData[index].param;
		setSearchParams({ tab: tabParam });
		setTabKey((prev) => prev + 1);
	};

	if (tabsData.length === 0) {
		return <NotPermission moduleName="secondary listing"/> ;
	}

	return (
		<>
			<Flex justifyContent='flex-end' alignItems='center'>
				{hasPermission('listing', 'settings') && (
					<Button
						colorScheme='gray'
						borderRadius='5px'
						size={{ base: 'sm', md: 'md' }}
						px={{ base: 4, md: 6 }}
						py={{ base: 2, md: 3 }}
						fontSize={{ base: 'sm', md: 'md' }}
						leftIcon={<Icon as={IoSettings} boxSize={4} />}
						onClick={() => navigate('/listing/settings')}
						mb={4}
					>
						Settings
					</Button>
				)}
			</Flex>
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

export default Listing;
