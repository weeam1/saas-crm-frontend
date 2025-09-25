import {
  Box,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  Heading,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

const TabNavigationDisplay = ({ tabsData, activeTab, onTabChange }) => {
  const tabFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const tabPadding = useBreakpointValue({ base: "2", sm: "3", md: "4" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Tabs variant="goldenrod" index={activeTab} onChange={onTabChange}>
      {/* Tab panels for title/description */}
      <TabPanels>
        {tabsData.map((tab, index) => (
          <TabPanel key={`title-${index}`} px={0}>
            {tab.title || tab.description ? (
              <Box py={3} px={5} bg="white" borderRadius="10px" shadow="sm">
                <Heading size={headingSize} mb={4}>
                  {tab.title}
                </Heading>
                <Text fontSize={textSize} color="gray.600" mb={6}>
                  {tab.description}
                </Text>
              </Box>
            ) : null}
          </TabPanel>
        ))}
      </TabPanels>

      {/* Tab list - scrollable but with hidden scrollbar */}
      <TabList 
        overflowX="auto"
        overflowY="hidden"
        mx={0}
        px={0}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none', 
          },
          '-ms-overflow-style': 'none',  
          scrollbarWidth: 'none',  
        }}
      >
        <Box display="flex" minWidth="max-content">
          {tabsData.map((tab, index) => (
            <Tab
              key={`tab-${index}`}
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
              borderTop="4px solid transparent"
              fontSize={tabFontSize}
              px={tabPadding}
              py={2}
              whiteSpace="nowrap"
              flexShrink={0} 
              mx={0} 
            >
              {tab.label}
            </Tab>
          ))}
        </Box>
      </TabList>

      {/* Tab panels for content */}
      <TabPanels>
        {tabsData.map((tab, index) => (
          <TabPanel key={`content-${index}`} px={0}>
            {tab.component}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default TabNavigationDisplay;