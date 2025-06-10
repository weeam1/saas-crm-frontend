import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreateAnnouncement from "./components/CreateAnnouncement";
import History from "./components/History";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";

const DEFAULT_TAB = "announcement";

const Announcements = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab")?.toLowerCase() || DEFAULT_TAB;
  const [tabKey, setTabKey] = useState(0); 
  const tabsData = [
    {
      label: "Announcement",
      title: "Create New Announcement",
      description:
        "Quickly create and publish new announcements to keep everyone informed and updated.",
      component: <CreateAnnouncement key={tabKey} user={user} />,
    },
    {
      label: "History",
      title: "Announcement History",
      description:
        "View a history of all published announcements, including their details and posting dates.",
      component: <History key={tabKey} user={user} />,
    },
  ];

  const initialIndex = tabsData.findIndex(
    (tab) => tab.label.toLowerCase() === tabFromParams
  );

  const [activeTabIndex, setActiveTabIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    // If no tab in URL, set default
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, []);

  useEffect(() => {
    setSearchParams({
      tab: tabsData[activeTabIndex].label.toLowerCase().replace(/\s/g, "-"),
    });
  }, [activeTabIndex]);

  const handleTabChange = (index) => {
    const newTab = tabsData[index].label.toLowerCase();

    if (index === activeTabIndex) {
      setTabKey((prev) => prev + 1); 
    } else {
      setActiveTabIndex(index);
    }

    setSearchParams({ tab: newTab });
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
