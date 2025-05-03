import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";
import HiringDashboard from "./hiringDashboard";
import Candidates from "./candidates/index";
import ShortListedCandidates from "./shortListedCandidates/index";
import InterviewedCandidates from "./interviewedCandidates/index";

const DEFAULT_TAB = "dashboard";

const Hiring = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;
  const user = JSON.parse(localStorage.getItem('user'));
  const isManager = user?.roles[0]?.roleName === 'Manager';

  const [tabKey, setTabKey] = useState(0); 

  const tabsData = [
    {
      label: "Dashboard",
      title: "Hiring Dashboard Overview",
      description:
        "Monitor key recruitment statistics, candidate pipelines, and ongoing interviews.",
      component: <HiringDashboard key={tabKey} />, 
    },
    {
      label: "Candidates",
      title: "All Registered Candidates",
      description:
        "View a list of all candidates who have applied. Filter, search, and manage candidate profiles here.",
      component: <Candidates key={tabKey} />,
    },
    {
      label: "Short Listed",
      title: "Short Listed Candidates",
      description:
        "Candidates who have been selected for the next round. Review and manage their progress.",
      component: <ShortListedCandidates key={tabKey} />,
    },
    {
      label: "Interviewed Candidates",
      title: "Interviewed Candidates Overview",
      description:
        "See candidates who have completed their interviews. Track interview outcomes and feedback.",
      component: <InterviewedCandidates key={tabKey} />,
    },
  ];

  const filteredTabs = isManager
    ? tabsData.filter((tab) => tab.label === 'Short Listed') 
    : tabsData;

  const initialIndex = filteredTabs.findIndex(
    (tab) => tab.label.toLowerCase() === tabFromParams?.toLowerCase()
  );
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    if (filteredTabs[activeTabIndex].label.toLowerCase() !== tabFromParams) {
      setSearchParams({
        tab: filteredTabs[activeTabIndex].label.toLowerCase(),
      });
    }
  }, [activeTabIndex, filteredTabs, setSearchParams, tabFromParams]);

  const handleTabChange = (index) => {
    const selectedTab = filteredTabs[index].label.toLowerCase();

    if (selectedTab !== tabFromParams) {
      setSearchParams({ tab: selectedTab });

      if (index === activeTabIndex) {
        setTabKey((prev) => prev + 1); 
      } else {
        setActiveTabIndex(index);
      }
    }
  };

  return (
    <>
      <TabNavigationDisplay
        tabsData={filteredTabs}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default Hiring;
