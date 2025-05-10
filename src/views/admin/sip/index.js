import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SipDashboard from "./component/Dashboard";
import SipHistory from "./component/History";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";

const DEFAULT_TAB = "dashboard";

const Sip = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;

  const initialIndex = ["dashboard", "history"].indexOf(tabFromParams.toLowerCase());
  const [activeTabIndex, setActiveTabIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  const [tabKey, setTabKey] = useState(0);

  const tabsData = [
    {
      label: "Dashboard",
      title: "Call Analytics Overview",
      description:
        "Get a quick summary of your call activity including total time spent on calls, number of unique calls, and average call durations over the selected period.",
      component: <SipDashboard key={tabKey} />,
    },
    {
      label: "History",
      title: "Call History Log",
      description:
        "Explore detailed records of each call including timestamps, duration, participants, and call modes for a comprehensive communication history.",
      component: <SipHistory key={tabKey} />,
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

export default Sip;
