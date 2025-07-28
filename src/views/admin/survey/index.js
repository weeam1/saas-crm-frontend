import { useState,useEffect  } from "react";
import { useSearchParams } from "react-router-dom";
import SurveyDashboard from "./Component/SurveyDashboard";
import ManageSurveys from "./Component/ManageSurveys";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";

const DEFAULT_TAB = "dashboard";

const Survey = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab")?.toLowerCase() || DEFAULT_TAB;
  const [tabKey, setTabKey] = useState(0);

  const tabsData = [
    {
      label: "Dashboard",
      param: "dashboard",
      title: "Survey Dashboard",
      description: "View survey statistics and analytics at a glance.",
    },
    {
      label: "Manage Surveys",
      param: "manage",
      title: "Manage Surveys",
      description: "Create, view and manage all your surveys in one place.",
    },
  ];

  const activeTabIndex = Math.max(
    0,
    tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
  );

  useEffect(() => {
    if (
      !searchParams.get("tab") ||
      !tabsData.some((tab) => tab.param === searchParams.get("tab")?.toLowerCase())
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
        component: tab.param === tabFromParams.toLowerCase() ? (
          tab.param === "dashboard" ? (
            <SurveyDashboard key={tabKey} />
          ) : (
            <ManageSurveys key={tabKey} />
          )
        ) : null,
      }))}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
    />
  );
};

export default Survey;