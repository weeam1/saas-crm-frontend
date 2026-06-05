import React, { memo, useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import MainStatusTabContainer from "./components/mainStatus/MainStatusTabContainer";
import SubStatusTabContainer from "./components/subStatus/SubStatusTabContainer";
import MetaIdTabContainer from "./components/metaStatus/MetaIdTabContainer";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import AppButton from "components/shared/AppButton";
import { useModalColors } from "hooks/useModalColors";

const LeadStatus = memo(() => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const colors = useModalColors();

  const tabs = [
    { title: "Main Status", component: MainStatusTabContainer },
    { title: "Sub Status", component: SubStatusTabContainer },
    { title: "Meta IDs", component: MetaIdTabContainer },
  ];

  const TabComponent = tabs[activeTab].component;

  return (
    <Box bg={colors.bgDeep} minH="100vh" p={4}>
      {/* Back Button */}
      <AppButton mb="4" leftIcon={<IoArrowBack />} onClick={() => navigate(-1)} variant="outline">
        Back
      </AppButton>

      {/* Tabs */}
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
            bg={activeTab === index ? colors.goldLight : colors.bgInput}
            color={activeTab === index ? colors.headerText : colors.bodyText}
            borderTop={
              activeTab === index
                ? `4px solid ${colors.accentGold}`
                : "4px solid transparent"
            }
            borderBottom="1px solid"
            borderBottomColor={activeTab === index ? "transparent" : colors.borderColor}
            fontWeight="medium"
            _focus={{ outline: "none" }}
            _hover={{
              bg: activeTab === index ? colors.goldLight : colors.bgInputHover,
              color: activeTab === index ? colors.headerText : colors.headingText,
            }}
            rounded="none"
            shadow="sm"
            fontSize={{ base: "sm", md: "md" }}
            px={{ base: 4, md: 5 }}
            h={{ base: 8, md: 10 }}
            whiteSpace="nowrap"
            flexShrink={0}
            minW="max-content"
            transition="all 0.2s ease"
          >
            {tab.title}
          </Button>
        ))}
      </Flex>

      {/* Content Box */}
      <Box
        bg={colors.bg}
        shadow="sm"
        mt="-1px"
        borderRadius="lg"
        p={4}
        border="1px solid"
        borderColor={colors.borderColor}
        borderTop="none"
        borderTopRadius="0"
      >
        <TabComponent />
      </Box>
    </Box>
  );
});

LeadStatus.displayName = "LeadStatus";
export default LeadStatus;