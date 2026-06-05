import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdAssignment, MdSettings } from "react-icons/md";

import NotPermission from "components/notPermission/NotPermission";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";

import { usePermissions } from "hooks/usePermissions";

import UserEvaluationScreen from "./user-evalution";
import MyEvaluationScreen from "./my-evalution";
import EvaluationSettingsScreen from "./settings";

const EvaluationLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);

  const { hasPermission } = usePermissions();

  const tabFromParams = searchParams.get("tab")?.toLowerCase();

  const allTabsData = useMemo(
    () => [
      {
        id: "evaluation_users",
        label: "Evaluate User",
        icon: FaUsers,
        param: "user-evaluation",
        title: "Evaluate Users",
        description: "Evaluate and review team members.",
        component: <UserEvaluationScreen />,
      },
      {
        id: "my_evaluations",
        label: "My Evaluation",
        icon: MdAssignment,
        param: "my-evaluation",
        title: "My Evaluations",
        description: "View evaluations submitted for you.",
        component: <MyEvaluationScreen />,
      },
      {
        id: "settings",
        label: "Settings",
        icon: MdSettings,
        param: "settings",
        title: "Evaluation Settings",
        description: "Configure evaluation settings.",
        component: <EvaluationSettingsScreen />,
      },
    ],
    [],
  );

  const tabsData = useMemo(
    () =>
      allTabsData.filter(
        (tab) => !tab.id || hasPermission("evaluation", tab.id),
      ),
    [allTabsData, hasPermission],
  );

  const activeTabIndex = useMemo(() => {
    const idx = tabsData.findIndex((tab) => tab.param === tabFromParams);
    return idx >= 0 ? idx : 0;
  }, [tabsData, tabFromParams]);

  useEffect(() => {
    if (tabsData.length === 0) return;

    const currentTab = tabFromParams;
    const isValidTab = tabsData.some((tab) => tab.param === currentTab);

    if (!currentTab || !isValidTab) {
      const fallback = tabsData[0].param;

      if (fallback !== currentTab) {
        setSearchParams({ tab: fallback }, { replace: true });
      }
    }
  }, [tabsData, tabFromParams, setSearchParams]);

  const handleTabChange = useCallback(
    (index) => {
      const tabParam = tabsData[index]?.param;

      if (!tabParam) return;

      if (tabParam !== tabFromParams) {
        setSearchParams({ tab: tabParam });
      } else {
        setTabKey((prev) => prev + 1);
      }
    },
    [tabsData, tabFromParams, setSearchParams],
  );

  if (tabsData.length === 0) {
    return <NotPermission moduleName="evaluation" />;
  }

  return (
    <TabNavigationDisplay
      key={tabKey}
      tabsData={tabsData.map((tab) => ({
        ...tab,
        component: tab.param === tabFromParams ? tab.component : null,
      }))}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
    />
  );
};

export default EvaluationLayout;
