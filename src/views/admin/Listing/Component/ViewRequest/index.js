import { useSearchParams } from "react-router-dom";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ApprovedRequests from "./ApprovedRequest";
import PendingRequests from "./ViewRequest";
import RejectedRequests from "./RejectRequest";

const ViewRequests = ({ listingType, listingUnitType }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const subTab = searchParams.get("subTab") || "pending";

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
    <Tabs index={activeTabIndex} onChange={handleTabChange} isLazy>
      <TabList borderBottom="none">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            _selected={{
              borderTop: "4px solid #B79045",
              bg: "#EDD199",
              fontWeight: "semi-bold",
              color: "black",
              outline: "none",
            }}
            bg="softGray.50"
            color="gray.500"
            _focus={{ outline: "none" }}
            borderTop="4px solid transparent"
            borderBottom="none"
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab) => (
          <TabPanel key={tab.id}>
            {tab.component}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default ViewRequests;