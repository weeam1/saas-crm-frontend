import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SipDashboard from "./component/Dashboard";
import SipHistory from "./component/History";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";

const Sip = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab");
  const tabsData = [
    {
      label: "Dashboard",
      title: "Call Analytics Overview",
      description:
        "Get a quick summary of your call activity including total time spent on calls, number of unique calls, and average call durations over the selected period.",
      component: tabFromParams === 'dashboard' && <SipDashboard />,
    },
    {
      label: "History",
      title: "Call History Log",
      description:
        "Explore detailed records of each call including timestamps, duration, participants, and call modes for a comprehensive communication history.",
      component: tabFromParams === 'history' && <SipHistory />,
    },
  ];

  const initialIndex = tabsData.findIndex(tab => tab.label.toLowerCase() === tabFromParams?.toLowerCase());
  const [activeTabIndex, setActiveTabIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  useEffect(() => {
    setSearchParams({ tab: tabsData[activeTabIndex].label.toLowerCase() });
  }, [activeTabIndex]);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
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
