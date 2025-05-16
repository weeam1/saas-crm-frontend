import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";
import HiringDashboard from "./hiringDashboard";
import Candidates from "./candidates/index";
import ShortListedCandidates from "./shortListedCandidates/index";
import InterviewedCandidates from "./interviewedCandidates/index";
import InterviewedRound from "./interviewedCandidates/Rounds";

const DEFAULT_TAB = "dashboard";

const Hiring = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const isManager = user?.roles[0]?.roleName === "Manager";
  const [tabKey, setTabKey] = useState(0);

  const allTabs = [
    {
      label: "Dashboard",
      param: "dashboard",
      title: "Hiring Dashboard Overview",
      description:
        "Monitor key recruitment statistics, candidate pipelines, and ongoing interviews.",
      component: <HiringDashboard key={tabKey} />,
    },
    {
      label: "Candidates",
      param: "candidates",
      title: "All Registered Candidates",
      description:
        "View a list of all candidates who have applied. Filter, search, and manage candidate profiles here.",
      component: <Candidates key={tabKey} />,
    },
    {
      label: "Short Listed",
      param: "short-listed",
      title: "Short Listed Candidates",
      description:
        "Candidates who have been selected for the next round. Review and manage their progress.",
      component: <ShortListedCandidates key={tabKey} />,
    },
    {
      label: "Final Interviewed",
      param: "final-interviewed",
      title: "Final Interviewed Candidates Overview",
      description:
        "See candidates who have final round interviews. Track interview outcomes and feedback.",
      component: <InterviewedRound key={tabKey} />,
    },
    {
      label: "Interviewed Candidates",
      param: "interviewed-candidates",
      title: "Interviewed Candidates Overview",
      description:
        "See candidates who have completed their interviews. Track interview outcomes and feedback.",
      component: <InterviewedCandidates key={tabKey} />,
    },
  ];

  const tabsData = isManager
    ? allTabs.filter((tab) => tab.param === "short-listed")
    : allTabs;

  const tabFromParams = searchParams.get("tab") || DEFAULT_TAB;

  const activeTabIndex = Math.max(
    0,
    tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
  );

  useEffect(() => {
    if (
      !searchParams.get("tab") ||
      !tabsData.some((tab) => tab.param === searchParams.get("tab"))
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
    <>
      <TabNavigationDisplay
        tabsData={tabsData.map((tab) => ({
          ...tab,
          component:
            tab.param === tabFromParams.toLowerCase() ? tab.component : null,
        }))}
        activeTab={activeTabIndex}
        onTabChange={handleTabChange}
      />
    </>
  );
};

export default Hiring;
