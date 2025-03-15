import { Tabs, TabList, Tab } from "@chakra-ui/react";

const TabsComponent = ({ selectedTab, onTabChange }) => {
  return (
    <Tabs
      index={selectedTab}
      onChange={onTabChange}
      mb={5}
      variant="unstyled"
    >
      <TabList gap={4} borderBottom="none">
        <Tab
          bg="#EEEEEE"
          _selected={{ bg: "#EDC270" }}
          w="156px"
          borderRadius="5px"
          fontFamily="Poppins"
          fontWeight="300" 
          fontSize="20px"  
        >
          Admin
        </Tab>
        <Tab
          bg="#EEEEEE"
          _selected={{ bg: "#EDC270" }}
          borderRadius="5px"
          fontFamily="Poppins"
          fontWeight="300"
          fontSize="20px"
        >
          Manager
        </Tab>
        <Tab
          bg="#EEEEEE"
          _selected={{ bg: "#EDC270" }}
          borderRadius="5px"
          fontFamily="Poppins"
          fontWeight="300"
          fontSize="20px"
        >
          HR
        </Tab>
      </TabList>
    </Tabs>
  );
};

export default TabsComponent;