import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaUsers,
  FaCog,
} from "react-icons/fa";

import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";

import IncomingCash from "./incoming-balance";
import OutgoingCash from "./outgoing-expense";
import EmployeeLoans from "./employee-laon";
import FinanceSettings from "./settings";

const FinanceLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);

  const tabFromParams = searchParams.get("tab")?.toLowerCase();

  const tabsData = useMemo(
    () => [
      {
        id: "incoming_cash",
        label: "Incoming Cash",
        icon: FaMoneyBillWave,
        param: "incoming",
        component: <IncomingCash key="incoming" />,
      },
      {
        id: "outgoing_cash",
        label: "Outgoing Cash",
        icon: FaMoneyCheckAlt,
        param: "outgoing",
        component: <OutgoingCash key="outgoing" />,
      },
      {
        id: "employee_loans",
        label: "Employee Loans",
        icon: FaUsers,
        param: "loans",
        component: <EmployeeLoans key="loans" />,
      },
      {
        id: "settings",
        label: "Settings",
        icon: FaCog,
        param: "settings",
        component: <FinanceSettings key="settings" />,
      },
    ],
    [],
  );

  const activeTabIndex = useMemo(() => {
    const idx = tabsData.findIndex((tab) => tab.param === tabFromParams);
    return idx >= 0 ? idx : 0;
  }, [tabsData, tabFromParams]);

  useEffect(() => {
    if (!tabFromParams) {
      setSearchParams({ tab: tabsData[0].param }, { replace: true });
    }
  }, [tabFromParams, tabsData, setSearchParams]);

  const handleTabChange = useCallback(
    (index) => {
      const tabParam = tabsData[index]?.param;

      if (tabParam !== tabFromParams) {
        setSearchParams({ tab: tabParam });
      } else {
        setTabKey((prev) => prev + 1);
      }
    },
    [tabsData, tabFromParams, setSearchParams],
  );

  return (
    <TabNavigationDisplay
      tabsData={tabsData.map((tab) => ({
        ...tab,
        component: tab.param === tabFromParams ? tab.component : null,
      }))}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
      key={tabKey}
    />
  );
};

export default FinanceLayout;
