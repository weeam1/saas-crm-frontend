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
import { useModalColors } from "hooks/useModalColors";

const ViewRequests = () => {
  const colors = useModalColors();
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
      variant="enclosed"
      index={activeTabIndex}
      onChange={handleTabChange}
      isLazy
    >
      <TabList
        overflowX="auto"
        overflowY="hidden"
        mx={0}
        px={0}
        bg={colors.bgInput}
        borderRadius="md"
        borderBottom="1px solid"
        borderColor={colors.borderColor}
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
                borderTop: `4px solid ${colors.accentGold}`,
                bg: colors.bgDeep,
                fontWeight: "semibold",
                color: colors.headingText,
                outline: "none",
                borderBottom: "none",
              }}
              outline="none"
              bg={colors.bgInput}
              color={colors.mutedText}
              _hover={{ color: colors.accentGold }}
              _focus={{ outline: "none" }}
              borderTop="4px solid transparent"
              fontSize={tabFontSize}
              px={tabPadding}
              py={2}
              whiteSpace="nowrap"
              flexShrink={0}
              mx={0}
              borderBottom="1px solid"
              borderColor={colors.borderColor}
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