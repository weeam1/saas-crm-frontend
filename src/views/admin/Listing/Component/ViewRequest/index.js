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
import ApprovedRequests from "./ApprovedRequest";
import PendingRequests from "./ViewRequest";
import RejectedRequests from "./RejectRequest";
import useUserSession from "hooks/useUserSession";
import { useFetchItemsQuery } from "api/apiSlice";

const ViewRequests = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const subTab = searchParams.get("subTab") || "pending";
  const tabFontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const tabPadding = useBreakpointValue({ base: "2", sm: "3", md: "4" });
  const { user } = useUserSession();
  
  const { data: listingType } = useFetchItemsQuery(
    { path: `/listing/secondary/types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id }
  );

  const { data: listingUnitType } = useFetchItemsQuery(
    { path: `/listing/secondary/unit-types` },
    { refetchOnMountOrArgChange: true, skip: !user?._id }
  );
  const tabs = [
    {
      id: "pending",
      label: "Pending",
      component: (
        <PendingRequests
          listingType={listingType}
          listingUnitType={listingUnitType}
        />
      ),
    },
    {
      id: "approved",
      label: "Approved",
      component: (
        <ApprovedRequests
          listingType={listingType}
          listingUnitType={listingUnitType}
        />
      ),
    },
    {
      id: "rejected",
      label: "Rejected",
      component: (
        <RejectedRequests
          listingType={listingType}
          listingUnitType={listingUnitType}
        />
      ),
    },
  ];

  const activeTabIndex = tabs.findIndex((tab) => tab.id === subTab);

  const handleTabChange = (index) => {
    setSearchParams({ tab: "view requests", subTab: tabs[index].id });
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
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
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
      {/* Tab panels for content */}
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

export default ViewRequests;
