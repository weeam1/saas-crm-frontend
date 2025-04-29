import CreateAnnouncement from "./components/CreateAnnouncement";
import History from "./components/History";
import TabNavigationDisplay from "../../../components/TabNavigationDisplay/TabNavigationDisplay";
const Announcements = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const tabsData = [
    {
      label: "Announcement",
      title: "Create New Announcement",
      description:
        "Quickly create and publish new announcements to keep everyone informed and updated.",
      component: <CreateAnnouncement user={user} />,
    },
    {
      label: "History",
      title: "Announcement History",
      description:
        "View a history of all published announcements, including their details and posting dates.",
      component: <History user={user} />,
    },
  ];

  return <TabNavigationDisplay tabsData={tabsData} />;
};

export default Announcements;
