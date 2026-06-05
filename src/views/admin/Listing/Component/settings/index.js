import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box } from '@chakra-ui/react';
import TabNavigationDisplay from "../../../../../components/TabNavigationDisplay/TabNavigationDisplay";
import ListingUnitTypes from "./components/ListingUnitType/index";
import ListingTypes from "./components/ListingTypes";
import { useModalColors } from 'hooks/useModalColors';

const DEFAULT_TAB = "unit-types";

const ListingSettings = () => {
  const colors = useModalColors();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);
  const tabsData = [
    {
      label: "Unit Types",
      title: "Manage Unit Types",
      description: "Create and manage different types of units in your system.",
      component: <ListingUnitTypes key={tabKey} />,
    },
    {
      label: "Listing Types",
      title: "Manage Listing Types",
      description: "Configure the various types of listings available.",
      component: <ListingTypes key={tabKey} />,
    },
  ];

  const tabFromParams = searchParams.get("tab")?.toLowerCase();
  const initialTabIndex = tabsData.findIndex(
    (tab) =>
      tab.label.toLowerCase().replace(/\s/g, "-") ===
      (tabFromParams || DEFAULT_TAB)
  );
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialTabIndex >= 0 ? initialTabIndex : 0
  );

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: DEFAULT_TAB }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (index) => {
    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1);
    } else {
      setActiveTabIndex(index);
      const newTab = tabsData[index].label.toLowerCase().replace(/\s/g, "-");
      setSearchParams({ tab: newTab }, { replace: true });
    }
  };

  return (
    <Box
      bg={colors.bg}
      borderRadius="lg"
      boxShadow={colors.cardShadow}
      border="1px solid"
      borderColor={colors.borderColor}
      p={6}
    >
      <TabNavigationDisplay
        tabsData={tabsData}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </Box>
  );
};

export default ListingSettings;