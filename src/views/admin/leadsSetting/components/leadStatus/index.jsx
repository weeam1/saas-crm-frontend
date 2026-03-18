import React, { memo, useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import MainStatusTabContainer from "./components/mainStatus/MainStatusTabContainer";
import SubStatusTabContainer from "./components/subStatus/SubStatusTabContainer";
import MetaIdTabContainer from "./components/metaStatus/MetaIdTabContainer";
import { useMainStatus } from "../../hooks/useMainStatus";
import { useMetaStatus } from "../../hooks/useMetaStatus";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import AppButton from "components/shared/AppButton";
const LeadStatus = memo(() => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  // Only fetch main statuses and meta statuses once for the modals
  const { mainStatuses } = useMainStatus(1, 1000); // Get all for dropdown
  const { metaStatuses } = useMetaStatus(1, 1000); // Get all for dropdown

  const tabs = [
    { title: "Main Status", component: MainStatusTabContainer },
    { title: "Sub Status", component: SubStatusTabContainer },
    { title: "Meta IDs", component: MetaIdTabContainer },
  ];

  const TabComponent = tabs[activeTab].component;

  return (
    <Box>
      {/* Tabs */}
      <AppButton mb="3" leftIcon={<IoArrowBack />} onClick={() => navigate(-1)}>
        Back
      </AppButton>
      <Flex
        width="fit-content"
        overflowX="auto"
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab, index) => (
          <Button
            key={index}
            onClick={() => setActiveTab(index)}
            bg={activeTab === index ? "#EDD199" : "gray.200"}
            color={activeTab === index ? "black" : "gray.500"}
            borderTop={
              activeTab === index
                ? "4px solid #B79045"
                : "4px solid transparent"
            }
            fontWeight="medium"
            _focus={{ outline: "none" }}
            _hover={{ bg: activeTab === index ? "#EDD199" : "gray.100" }}
            rounded="none"
            shadow="sm"
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 4, md: 5 }}
            h={{ base: 8, md: 10 }}
            whiteSpace="nowrap"
            flexShrink={0}
            minW="max-content"
          >
            {tab.title}
          </Button>
        ))}
      </Flex>

      {/* Content Box */}
      <Box bg="white" shadow="sm" mt="-1px" borderRadius="0" p={4}>
        <TabComponent mainStatuses={mainStatuses} metaStatuses={metaStatuses} />
      </Box>
    </Box>
  );
});

LeadStatus.displayName = "LeadStatus";
export default LeadStatus;
