import SipDashboard from "./component/Dashboard";
import SipHistory from "./component/History";
import TabNavigationDisplay from "components/TabNavigationDisplay/TabNavigationDisplay";
const Sip = () => {
  const tabsData = [
    {
      label: "Dashboard",
      title: "Call Analytics Overview",
      description:
        "Get a quick summary of your call activity including total time spent on calls, number of unique calls, and average call durations over the selected period.",
      component: <SipDashboard />,
    },
    {
      label: "History",
      title: "Call History Log",
      description:
        "Explore detailed records of each call including timestamps, duration, participants, and call modes for a comprehensive communication history.",
      component: <SipHistory />,
    },
  ];
  return (
    <>
      <TabNavigationDisplay tabsData={tabsData} />
    </>
  );
};
export default Sip;
