import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TabNavigationDisplay from "../../../../components/TabNavigationDisplay/TabNavigationDisplay";
import Templates from "./Templates";

const DEFAULT_TAB = "templates";

const ListingSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);
  const tabsData = [
    {
      label: "Template",
      title: "Evalution Template",
      description: "Create and manage evalution template.",
      component: <Templates/>,
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
      <TabNavigationDisplay
        tabsData={tabsData}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default ListingSettings;
