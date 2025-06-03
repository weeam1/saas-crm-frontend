import { useSearchParams } from "react-router-dom";
import {
  Box,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import UnitType from "./SubComponent/UnitType"
import SubUnitType from "./SubComponent/SubUnitType";

const UnitTypeTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const unitTab = searchParams.get("unitTab") || "main";
  const tabFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const tabPadding = useBreakpointValue({ base: "2", sm: "3", md: "4" });

  const tabs = [
    {
      id: "main",
      label: "Main Unit Type",
      component: <UnitType />,
    },
    {
      id: "sub",
      label: "Sub Unit Type",
      component: <SubUnitType />,
    },
  ];

  const activeTabIndex = tabs.findIndex((tab) => tab.id === unitTab);

  const handleTabChange = (index) => {
    const params = Object.fromEntries([...searchParams]);
    params.unitTab = tabs[index].id;
    setSearchParams(params);
  };

  return (
    <Tabs
      variant="goldenrod"
      index={activeTabIndex}
      onChange={handleTabChange}
      isLazy
    >
      <TabList
        overflowX="auto"
        overflowY="hidden"
        mx={0}
        px={0}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <Box display="flex" minWidth="max-content">
          {tabs.map((tab, index) => (
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
      <TabPanels>
        {tabs.map((tab, index) => (
          <TabPanel key={`content-${index}`} px={0}>
            {tab.component}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default UnitTypeTabs;