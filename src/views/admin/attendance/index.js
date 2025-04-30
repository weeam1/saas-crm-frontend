import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";
import AttendanceDashboard from "views/admin/attendance/components/dashboard";
import Employees from "views/admin/attendance/components/employees";
import Records from "views/admin/attendance/components/records";
import MyAttendance from "views/admin/attendance/components/myAttendance";
import OfficeSettings from "views/admin/agencies/OfficeSetting";
const NavigationBoxes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles[0]?.roleName;

  const allMenuItems = [
    {
      label: "Dashboard",
      title: "Dashboard Overview",
      description:
        "View key attendance metrics and a summary of employee check-ins, working hours, and activity trends.",
      component: <AttendanceDashboard />,
    },
    {
      label: "Employees",
      title: "Manage Employees",
      description:
        "Add, edit, or remove employee records, assign roles, and oversee user access across the platform.",
      component: <Employees />,
    },
    {
      label: "Records",
      title: "Attendance Records",
      description:
        "Review detailed attendance logs, check-in/check-out times, and generate attendance reports for employees.",
      component: <Records />,
    },
    {
      label: "My Attendance",
      title: "Your Attendance History",
      description:
        "Track your own attendance including daily check-ins, working hours, late entries, and overall performance.",
      component: <MyAttendance userId={user?._id} />,
    },
    {
      label: "Office Settings",
      title: "Office Configuration",
      description:
        "Customize settings such as office hours, holidays, policies, and manage agency-specific preferences.",
      component: <OfficeSettings userId={user?._id} />,
    },
  ];

  // Show all items for superAdmin and HR; otherwise, only show "My Attendance"
  const menuItems =
    role === "superAdmin"
      ? allMenuItems.filter(
          (item) =>
            item.label !== "My Attendance" && item.label !== "Office Settings"
        )
      : role === "HR"
        ? allMenuItems
        : allMenuItems.filter((item) => item.label === "My Attendance");

  return <TabNavigationDisplay tabsData={menuItems} />;
};

export default NavigationBoxes;
