import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreateAnnouncement from "./components/CreateAnnouncement";
import History from "./components/History";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";

const Announcements = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab");

  const tabsData = [
    {
      label: "Announcement",
      title: "Create New Announcement",
      description:
        "Quickly create and publish new announcements to keep everyone informed and updated.",
      component: tabFromParams === 'announcement'  && <CreateAnnouncement user={user} />,
    },
    {
      label: "History",
      title: "Announcement History",
      description:
        "View a history of all published announcements, including their details and posting dates.",
      component: tabFromParams === 'history' && <History user={user} />,
    },
  ];

  const initialIndex = tabsData.findIndex(
    (tab) => tab.label.toLowerCase() === tabFromParams?.toLowerCase()
  );
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    setSearchParams({ tab: tabsData[activeTabIndex].label.toLowerCase() });
  }, [activeTabIndex]);

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <TabNavigationDisplay
      tabsData={tabsData}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
    />
  );
};

export default Announcements;
