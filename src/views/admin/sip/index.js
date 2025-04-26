import {
  Box,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Heading,
  Text,
} from "@chakra-ui/react";
import SipDashboard from "./component/Dashboard";
import SipHistory from "./component/History";
const Sip = () => {
  return (
    <>
      <Tabs variant="goldenrod">
        <TabPanels>
          <TabPanel>
            <Box py={3} px={5}  bg={"white"} borderRadius={"10px"} Shadow={"sm"}>
            <Heading size="lg" mb={4}>
              Call Analytics Overview
            </Heading>
            <Text fontSize="md" color="gray.600" mb={6}>
              Get a quick summary of your call activity including total time
              spent on calls, number of unique calls, and average call durations
              over the selected period.
            </Text>
            </Box>
          </TabPanel>
          <TabPanel>
          <Box py={3} px={5}  bg={"white"} borderRadius={"10px"} Shadow={"sm"}>
            <Heading size="lg" mb={4}>
              Call History Log
            </Heading>
            <Text fontSize="md" color="gray.600"  mb={6}>
              Explore detailed records of each call including timestamps,
              duration, participants, and call modes for a comprehensive
              communication history.
            </Text>
            </Box>
          </TabPanel>
        </TabPanels>
        <TabList mx={3}>
          <Box display={"flex"}>
            <Tab
              _selected={{
                borderTop: "4px solid #B79045",
                bg: "white",
                fontWeight: "bold",
                color: "black",
                outline: "none"
              }}
              outline={"none"}
              bg={"softGray.50"}
              color={"gray.500"}
              _focus={{outline:"none"}}
            >
              Dashboard
            </Tab>
            <Tab
              _selected={{
                borderTop: "4px solid #B79045",
                bg: "white",
                fontWeight: "bold",
                color: "black",
              }}
              outline={"none"}
              bg={"softGray.50"}
              color={"gray.500"}
              _focus={{outline:"none"}}
            >
              History
            </Tab>
          </Box>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SipDashboard />
          </TabPanel>
          <TabPanel>
            <SipHistory />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
export default Sip;
