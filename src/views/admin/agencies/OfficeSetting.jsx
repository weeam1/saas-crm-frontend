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
import OfficeTiming from "./components/OfficeSetting";
import AdminTiming from "./components/AdminSetting";
import RulesSection from "./components/Rules";
import TabsComponent from "./components/Tab";

const OfficeSettings = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [enabledUsers, setEnabledUsers] = useState({});
  // State for AdminTiming
  const [adminInTime, setAdminInTime] = useState("9:00 am");
  const [adminOutTime, setAdminOutTime] = useState("6:00 pm");
  const [adminTimeZone, setAdminTimeZone] = useState(
    "United Arab Emirates (GMT+4)"
  );
  const [adminOffDays, setAdminOffDays] = useState(["sunday"]);
  // State for OfficeTiming
  const [officeInTime, setOfficeInTime] = useState("9:00 am");
  const [officeOutTime, setOfficeOutTime] = useState("6:00 pm");
  const [officeTimeZone, setOfficeTimeZone] = useState(
    "United Arab Emirates (GMT+4)"
  );
  const [officeOffDays, setOfficeOffDays] = useState(["sunday"]);
  // State for RulesSection
  const [rules, setRules] = useState([
    { label: "Early Check In", action: "Plus", coins: 2, perMin: null },
    { label: "Late Check In", action: "Minus", coins: 2, perMin: 1 },
    { label: "Early Check In", action: "Plus", coins: 2, perMin: null },
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
      { name: "Admin 5", email: "admin5@gmail.com" },
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
    const allData = {
      tab: currentTab,
      users: currentData,
      enabledUsers,
      adminTiming: {
        inTime: adminInTime,
        outTime: adminOutTime,
        timeZone: adminTimeZone,
        offDays: adminOffDays,
      },
      officeTiming: {
        inTime: officeInTime,
        outTime: officeOutTime,
        timeZone: officeTimeZone,
        offDays: officeOffDays,
      },
      rules: rules,
    };
    console.log("Saved Data:", JSON.stringify(allData, null, 2));
  };

  return (
    <Box p={{ base: 3, md: 5 }} borderRadius="lg">
      <Text
        size="md"
        mb={{ base: 3, md: 5 }}
        fontWeight="bold"
        fontSize={{ base: "lg", md: "xl" }}
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
          direction={{ base: "column", md: "row" }}
          gap={{ base: 3, md: 5 }}
        >
          <Box flex={{ base: "none", md: 1 }} w={{ base: "100%", md: "auto" }}>
            <Box mb={{ base: 3, md: 5 }}>
              <InputGroup
                width={{ base: "100%", md: "215px" }}
                borderRadius="10px"
              >
                <InputLeftElement pointerEvents="none">
                  <IoSearchOutline color="gray.300" />
                </InputLeftElement>
                <Input placeholder="Search" />
              </InputGroup>
            </Box>

            <Box>
              {currentData.map((item, index) => (
                <Flex
                  key={index}
                  align="center"
                  justify="space-between"
                  p={2}
                  borderRadius="md"
                >
                  <Box>
                    <Text
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "12px" }}
                      fontFamily="Poppins"
                    >
                      {item.name}
                    </Text>
                    <Text
                      fontSize={{ base: "xs", md: "12px" }}
                      fontFamily="Poppins"
                      color="#666666"
                    >
                      {item.email}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label="Edit"
                    icon={<CiEdit />}
                    size="sm"
                    color="white"
                    variant="ghost"
                    borderRadius="100%"
                    bg="#EDC270"
                    onClick={() => handleEditClick(item.email)}
                  />
                </Flex>
              ))}
            </Box>
          </Box>

          <Box flex={{ base: "none", md: 1 }} w={{ base: "100%", md: "auto" }}>
            <AdminTiming
              isDisabled={!Object.values(enabledUsers).some(Boolean)}
              inTime={adminInTime}
              setInTime={setAdminInTime}
              outTime={adminOutTime}
              setOutTime={setAdminOutTime}
              timeZone={adminTimeZone}
              setTimeZone={setAdminTimeZone}
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
            inTime={officeInTime}
            setInTime={setOfficeInTime}
            outTime={officeOutTime}
            setOutTime={setOfficeOutTime}
            timeZone={officeTimeZone}
            setTimeZone={setOfficeTimeZone}
            offDays={officeOffDays}
            setOffDays={setOfficeOffDays}
          />
        </Box>
      </Flex>

      <RulesSection rules={rules} setRules={setRules} />

      <Flex
        justify={{ base: "center", md: "flex-end" }}
        mt={{ base: 3, md: 5 }}
        direction="row"
        gap={{ base: 2, md: 3 }}
      >
        <Button
          variant="outline"
          onClick={handleCancel}
          w={{ base: "100%", md: "159px" }}
          maxW={{ base: "250px", md: "159px" }}
          bg="#D9D9D9"
          _hover={{ bg: "#D9D9D9" }}
          borderRadius="5px"
        >
          Cancel
        </Button>
        <Button
          w={{ base: "100%", md: "159px" }}
          maxW={{ base: "250px", md: "159px" }}
          bg="#EDC270"
          _hover={{ bg: "#EDC270" }}
          onClick={handleSave}
          borderRadius="5px"
        >
          Save
        </Button>
      </Flex>
    </Box>
  );
};

export default OfficeSettings;
