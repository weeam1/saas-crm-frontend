import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";
import AllListing from "./Component/AllListing";
import { Button, Flex, Icon } from '@chakra-ui/react';
import { IoSettings } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import MyListing from "./Component/MyListing";
import ApprovedRequest from "./Component/ViewRequest/ApprovedRequest";
import ViewRequest from "./Component/ViewRequest/ViewRequest";
import RejectRequest from "./Component/ViewRequest/RejectRequest";
import PendingListings from "./Component/PendingListings";

const DEFAULT_TAB = "all listings";

const Listing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "superAdmin";

  // Define all possible tabs first
  const allTabs = [
    {
      label: "All Listings",
      param: "all listings",
      title: "Property Listings Management",
      description: "Manage all property listings for sale and rent. Add, edit, view, and track secondary units including studios, apartments, warehouses, and plots. Maintain comprehensive records with owner and agent information.",
      component: <AllListing key={tabKey} />,
      show: true
    },
    {
      label: "My Listings",
      param: "my listings",
      title: "My Property Listings",
      description: "View and manage your personal property listings. Track status, view requests, and update your listings.",
      component: <MyListing key={tabKey} />,
      show: true
    },
    {
      label: "Approved View Requests",
      param: "approved view requests",
      title: "Approved Viewing Requests",
      description: "Manage all approved property viewing requests. Coordinate schedules and track visitor information.",
      component: <ApprovedRequest key={tabKey} />,
      show: true
    },
    {
      label: "Pending View Requests",
      param: "pending view requests",
      title: "Pending Viewing Requests",
      description: "Review and respond to new property viewing requests. Approve or reject requests as needed.",
      component: <ViewRequest key={tabKey} />,
      show: true
    },
    {
      label: "Rejected View Requests",
      param: "rejected view requests",
      title: "Rejected Viewing Requests",
      description: "View previously rejected property viewing requests. You can revisit these requests if needed.",
      component: <RejectRequest key={tabKey} />,
      show: true
    },
    {
      label: "Pending Listings",
      param: "pending listings",
      title: "Pending Property Listings",
      description: "Review and approve new property listings submitted by agents and owners.",
      component: <PendingListings key={tabKey} />,
      show: isAdmin
    }
  ];

  // Filter tabs based on visibility rules
  const tabsData = allTabs.filter(tab => tab.show);

  // Find active tab index based on params
  const activeTabIndex = Math.max(
    0,
    tabsData.findIndex(tab => tab.param === tabFromParams.toLowerCase())
  );

  useEffect(() => {
    // Ensure URL always has a valid tab param
    if (!searchParams.get("tab") || !tabsData.some(tab => tab.param === searchParams.get("tab").toLowerCase())) {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, [searchParams, setSearchParams, tabsData]);

  const handleTabChange = (index) => {
    const tabParam = tabsData[index].param;
    setSearchParams({ tab: tabParam });
    
    if (index === activeTabIndex) {
      setTabKey(prev => prev + 1); // Force remount if same tab clicked
    }
  };

  return (
    <>
      <Flex justifyContent="flex-end" alignItems="center">
        {isAdmin && (
          <Button
            colorScheme="gray"
            borderRadius="5px"
            size={{ base: "sm", md: "md" }}
            px={{ base: 4, md: 6 }}
            py={{ base: 2, md: 3 }}
            fontSize={{ base: "sm", md: "md" }}
            leftIcon={<Icon as={IoSettings} boxSize={4} />}
            onClick={() => navigate("/listing/settings")}
            mb={4}
          >
            Settings
          </Button>
        )}
      </Flex>
      
      <TabNavigationDisplay
        tabsData={tabsData.map(tab => ({
          label: tab.label,
          title: tab.title,
          description: tab.description,
          component: tab.param === tabFromParams.toLowerCase() ? tab.component : null
        }))}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default Listing;