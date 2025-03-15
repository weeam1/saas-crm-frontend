import {
  Box,
  Button,
  Flex,
  Input,
  IconButton,
  Text,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { CiEdit } from "react-icons/ci";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import OfficeTiming from "./components/OfficeTiming";
import AdminTiming from "./components/AdminTiming";
import RulesSection from "./components/Rules";
import TabsComponent from "./components/Tab";
import Search from "./components/Search";
import Buttons from "./components/Buttons";
import UserList from "./components/UserList";

const OfficeSettings = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [enabledUsers, setEnabledUsers] = useState({});
  const [adminCheckinTime, setAdminCheckinTime] = useState("09:00 AM");
  const [adminCheckoutTime, setAdminCheckoutTime] = useState("06:00 PM");
  const [adminTimezone, setAdminTimezone] = useState("Asia/Dubai");
  const [adminOffDays, setAdminOffDays] = useState([0]);
  const [officeCheckinTime, setOfficeCheckinTime] = useState("09:00 AM");
  const [officeCheckoutTime, setOfficeCheckoutTime] = useState("06:00 PM");
  const [officeTimezone, setOfficeTimezone] = useState("Asia/Karachi");
  const [officeOffDays, setOfficeOffDays] = useState([6, 0]);
  const [officeGracePeriod, setOfficeGracePeriod] = useState(15);
  const [rules, setRules] = useState([
    { label: "Early Check In", action: "Plus", coins: 10, perMin: null },
    { label: "Late Check In", action: "Minus", coins: 2, perMin: 10 },
    { label: "Early Check In", action: "Minus", coins: 50, perMin: null },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const agencyName = location.state?.agencyName || "Unknown Agency";

  const handleTabChange = (index) => setSelectedTab(index);

  const handleCancel = () => {
    navigate(`/agencies`);
  };

  const tabData = {
    Admin: [
      { name: "Admin 1", email: "admin@gmail.com" },
      { name: "Admin 2", email: "admin2@gmail.com" },
      { name: "Admin 3", email: "admin3@gmail.com" },
      { name: "Admin 4", email: "admin4@gmail.com" },
    ],
    Manager: [
      { name: "Manager 1", email: "manager1@gmail.com" },
      { name: "Manager 2", email: "manager2@gmail.com" },
      { name: "Manager 3", email: "manager3@gmail.com" },
    ],
    HR: [
      { name: "HR 1", email: "hr1@gmail.com" },
      { name: "HR 2", email: "hr2@gmail.com" },
    ],
  };

  const currentTab = ["Admin", "Manager", "HR"][selectedTab];
  const currentData = tabData[currentTab];

  const handleEditClick = (email) => {
    setEnabledUsers((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const handleSave = () => {
    const transformedRules = rules.map((rule, index) => {
      if (rule.label === "Early Check In" && rule.action === "Plus") {
        return {
          ruleId: 1,
          name: "earlyCheckIn",
          description: "Bonus coins for early check-in",
          coinChange: rule.coins,
        };
      } else if (rule.label === "Late Check In" && rule.action === "Minus") {
        return {
          ruleId: 2,
          name: "lateCheckInPenalty",
          description: "Deduct coins for late check-in based on time intervals",
          isTimeBased: true,
          perMinutePenalty: -rule.coins,
          intervalMinutes: rule.perMin || 10,
        };
      } else if (rule.label === "Early Check In" && rule.action === "Minus") {
        return {
          ruleId: 0,
          name: "absentPenalty",
          description: "Deduct coins for being absent",
          coinChange: -rule.coins,
        };
      }
      return rule;
    });

    const allData = {
      checkinTime: officeCheckinTime,
      checkoutTime: officeCheckoutTime,
      timezone: officeTimezone,
      offDays: officeOffDays,
      gracePeriod: officeGracePeriod,
      agency: id || "67b33ca776be2ae78bc7eaa4",
      rules: transformedRules,
      specialTiming: {
        checkinTime: adminCheckinTime,
        checkoutTime: adminCheckoutTime,
      },
      specialUsers: ["678e50f7ede76edffe120b18"],
    };
    console.log("Saved Data:", JSON.stringify(allData, null, 2));
  };

  return (
    <Box p={{ base: 3, md: 5 }} borderRadius="lg">
      <Text
        size="md"
        mb={{ base: 3, md: 5 }}
        fontFamily="DM Sans"
        fontWeight="400"
        fontSize="32px"
        textAlign={{ base: "center", md: "left" }}
      >
        {agencyName} Agency – Office Settings
      </Text>

      <TabsComponent selectedTab={selectedTab} onTabChange={handleTabChange} />

      <Flex
        direction={{ base: "column", md: "column", lg: "row" }}
        alignItems={{ base: "stretch", md: "stretch" }}
        gap={{ base: 3, md: 5 }}
      >
        <Flex
          bg="white"
          p={{ base: 3, md: 5 }}
          borderRadius="5px"
          flex="1"
          border="1px solid #cacaca"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 5 }}
        >
          <Box flex={{ base: "none", md: 1 }} w={{ base: "100%", md: "auto" }}>
            <Search />
            <UserList users={currentData} onEditClick={handleEditClick} />
          </Box>

          <Box flex={{ base: "none", md: 1 }} w={{ base: "100%", md: "auto" }}>
            <AdminTiming
              isDisabled={!Object.values(enabledUsers).some(Boolean)}
              checkinTime={adminCheckinTime}
              setCheckinTime={setAdminCheckinTime}
              checkoutTime={adminCheckoutTime}
              setCheckoutTime={setAdminCheckoutTime}
              timezone={adminTimezone} 
              setTimezone={setAdminTimezone}
              offDays={adminOffDays}
              setOffDays={setAdminOffDays}
            />
          </Box>
        </Flex>

        <Box
          flex={{ base: "none", md: 1 }}
          w={{ base: "100%", md: "auto" }}
          display="flex"
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <OfficeTiming
            checkinTime={officeCheckinTime}
            setCheckinTime={setOfficeCheckinTime}
            checkoutTime={officeCheckoutTime}
            setCheckoutTime={setOfficeCheckoutTime}
            timezone={officeTimezone}
            setTimezone={setOfficeTimezone}
            offDays={officeOffDays}
            setOffDays={setOfficeOffDays}
            gracePeriod={officeGracePeriod}
            setGracePeriod={setOfficeGracePeriod}
          />
        </Box>
      </Flex>

      <RulesSection rules={rules} setRules={setRules} />
      <Buttons onCancel={handleCancel} onSave={handleSave} />
    </Box>
  );
};

export default OfficeSettings;
