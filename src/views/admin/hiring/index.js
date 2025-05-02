// Hiring.js
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";
import HiringDashboard from "./hiringDashboard";
import Candidates from "./candidates/index";
import ShortListedCandidates from "./shortListedCandidates/index";
import InterviewedCandidates from "./interviewedCandidates/index";

const Hiring = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromParams = searchParams.get("tab");

  const tabsData = [
    {
      label: "Dashboard",
      title: "Hiring Dashboard Overview",
      description:
        "Monitor key recruitment statistics, candidate pipelines, and ongoing interviews.",
      component: tabFromParams === "dashboard" && <HiringDashboard />,
    },
    {
      label: "Candidates",
      title: "All Registered Candidates",
      description:
        "View a list of all candidates who have applied. Filter, search, and manage candidate profiles here.",
      component: tabFromParams === "candidates" && <Candidates />,
    },
    {
      label: "Short Listed",
      title: "Short Listed Candidates",
      description:
        "Candidates who have been selected for the next round. Review and manage their progress.",
      component: tabFromParams === "short listed" && <ShortListedCandidates />,
    },
    {
      label: "Interviewed Candidates",
      title: "Interviewed Candidates Overview",
      description:
        "See candidates who have completed their interviews. Track interview outcomes and feedback.",
      component: tabFromParams === "interviewed candidates" && (
        <InterviewedCandidates />
      ),
    },
  ];

  const initialIndex = tabsData.findIndex(
    (tab) => tab.label.toLowerCase() === tabFromParams?.toLowerCase()
  );
  const [activeTabIndex, setActiveTabIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    setSearchParams({
      tab: tabsData[activeTabIndex].label.toLowerCase(),
    });

    document.title = tabsData[activeTabIndex].title;
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

export default Hiring;
