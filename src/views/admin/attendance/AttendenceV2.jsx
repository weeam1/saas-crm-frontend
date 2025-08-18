import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Text, Icon } from "@chakra-ui/react";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaUserCheck,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";
import Dashboard from "./components/dashboard/index";
import Employees from "./components/employees/index";
import Records from "./components/records/index";
import MyAttendance from "./components/myAttendance/index";

import OfficeSettings from "../agencies/OfficeSetting";

const AttendanceV2 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles[0]?.roleName;
  const DEFAULT_TAB = role === "superAdmin" ? "dashboard" : "my-attendance";

  const tabFromParams = searchParams.get("tab")?.toLowerCase() || DEFAULT_TAB;
  const allTabsData = [
    {
      label: "Dashboard",
      icon: FaTachometerAlt,
      param: "dashboard",
      title: "Attendance Dashboard",
      description:
        "View overall attendance statistics and key metrics at a glance.",
      component: <Dashboard key="dashboard" />,
    },
    {
      label: "Employees",
      icon: FaUsers,
      param: "employees",
      title: "Employee Management",
      description: "Manage employee attendance records and profiles.",
      component: <Employees key="employees" />,
    },
    {
      label: "Records",
      icon: FaClipboardList,
      param: "records",
      title: "Attendance Records",
      description: "View and manage all attendance records in detail.",
      component: <Records key="records" />,
    },
    {
      label: "My Attendance",
      icon: FaUserCheck,
      param: "my-attendance",
      title: "My Attendance",
      description: "View and track your personal attendance history.",
      component: <MyAttendance key="my-attendance" userId={user?._id} />,
    },
    {
      label: 'Office Settings',
      icon: FiSettings,
      param: 'office-settings',
      title: 'Office Settings',
      description: 'Configure office attendance rules and settings.',
      component: <OfficeSettings key="office-settings" agencyId={user?.agency?._id} />,
    },
  ];

  // Filter tabs based on user role
  const tabsData =
    role === "superAdmin" || role === "Attendance"
      ? allTabsData.filter(
          (tab) =>
            tab.param !== "my-attendance" && tab.param !== "office-settings"
        )
      : role === "HR"
        ? allTabsData
        : allTabsData.filter((tab) => tab.param === "my-attendance");

  const activeTabIndex = Math.max(
    0,
    tabsData.findIndex((tab) => tab.param === tabFromParams.toLowerCase())
  );

  useEffect(() => {
    if (
      !searchParams.get("tab") ||
      !tabsData.some(
        (tab) => tab.param === searchParams.get("tab")?.toLowerCase()
      )
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
        component:
          tab.param === tabFromParams.toLowerCase() ? tab.component : null,
      }))}
      activeTab={activeTabIndex}
      onTabChange={handleTabChange}
    />
  );
};

export default AttendanceV2;
