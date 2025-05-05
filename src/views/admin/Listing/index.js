import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";

import ListingView from "./Component/ListingView"
const DEFAULT_TAB = "listing";

const Listing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;

  const initialIndex = ["listing",].indexOf(tabFromParams.toLowerCase());
  const [activeTabIndex, setActiveTabIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  const [tabKey, setTabKey] = useState(0);

  const tabsData = [
    {
      label: "Listings",
      title: "Property Listings Management",
      description: "Manage all property listings for sale and rent. Add, edit, view, and track secondary units including studios, apartments, warehouses, and plots. Maintain comprehensive records with owner and agent information.",
      component: <ListingView key={tabKey} />,
    },
  ];
  
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, []);

  const handleTabChange = (index) => {
    const tabLabel = tabsData[index].label.toLowerCase();
    setSearchParams({ tab: tabLabel });

    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1); 
    } else {
      setActiveTabIndex(index);
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

export default Listing;  