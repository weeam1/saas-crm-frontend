import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TabNavigationDisplay from "../../../../../components/TabNavigationDisplay/TabNavigationDisplay";
import ListingUnitTypes from "./components/ListingUnitTypes";
import ListingTypes from "./components/ListingTypes";
import ListingStatus from "./components/ListingStatus";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const DEFAULT_TAB = "unit-types";

const ListingSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);
  const navigate = useNavigate();
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
    <>
      <AppButton
        ml="2"
        leftIcon={<IoArrowBack />}
        onClick={() => navigate("/listing")}
      >
        Back
      </AppButton>
      <TabNavigationDisplay
        tabsData={tabsData}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default ListingSettings;
