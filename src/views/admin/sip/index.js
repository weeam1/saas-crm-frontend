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
            <Heading size="lg" mb={2}>
              Call Analytics Overview
            </Heading>
            <Text fontSize="md" color="gray.600">
              Get a quick summary of your call activity including total time
              spent on calls, number of unique calls, and average call durations
              over the selected period.
            </Text>
          </TabPanel>
          <TabPanel>
            <Heading size="lg" mb={2}>
              Call History Log
            </Heading>
            <Text fontSize="md" color="gray.600">
              Explore detailed records of each call including timestamps,
              duration, participants, and call modes for a comprehensive
              communication history.
            </Text>
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
              }}
              bg={"#e7e7e7"}
              color={"gray.500"}
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
              bg={"#e7e7e7"}
              color={"gray.500"}
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
