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

const TabNavigationDisplay = ({ tabsData, activeTab, onTabChange }) => {
  return (
    <Tabs variant="goldenrod" index={activeTab} onChange={onTabChange}>
      {/* Tab panels */}
      <TabPanels>
        {tabsData.map((tab, index) => (
          <TabPanel key={index}>
            {tab.title || tab.description ? (
              <Box py={3} px={5} bg="white" borderRadius="10px" shadow="sm">
                <Heading size="lg" mb={4}>
                  {tab.title}
                </Heading>
                <Text fontSize="md" color="gray.600" mb={6}>
                  {tab.description}
                </Text>
              </Box>
            ) : (
              ""
            )}
          </TabPanel>
        ))}
      </TabPanels>

      {/* Tab list */}
      <TabList mx={3}>
        <Box display="flex">
          {tabsData.map((tab, index) => (
            <Tab
              key={index}
              _selected={{
                borderTop: "4px solid #B79045",
                bg: "#EDD199",
                fontWeight: "semi-bold",
                color: "black",
                outline: "none",
              }}
              outline="none"
              bg="softGray.50"
              color="gray.500"
              _focus={{ outline: "none" }}
              borderTop={"4px solid transparent"}
            >
              {tab.label}
            </Tab>
          ))}
        </Box>
      </TabList>
      <TabPanels>
        {tabsData.map((tab, index) => (
          <TabPanel key={index}>
            {/* Render the custom component */}
            {tab.component}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default TabNavigationDisplay;
