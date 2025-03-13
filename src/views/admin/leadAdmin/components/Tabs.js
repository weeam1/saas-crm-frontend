import { useState, useEffect } from "react";
import {
  Button,
  HStack,
  Box,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Pending", "Approved", "Rejected"];

  const resolvedWidth = useBreakpointValue({
    base: "100%",
    sm: "140px",
    md: "160px",
  });

  const [buttonWidth, setButtonWidth] = useState("160px");

  useEffect(() => {
    if (resolvedWidth) {
      setButtonWidth(resolvedWidth);
    }
  }, [resolvedWidth]);

  return (
    <Box width="100%">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={2}
        width="100%"
        flexWrap="wrap"
        gap={{ base: 2, md: 0 }}
        flexDirection={{ base: "column", md: "row" }}
      >
        {/* Tabs Section */}
        <HStack
          spacing={2}
          flexWrap="wrap"
          justify={{ base: "center", md: "start" }}
          width="100%"
        >
          {tabs.map((tab) => (
            <Button
              key={tab}
              borderRadius="6px"
              w={buttonWidth}
              minWidth="140px"
              h="42px"
              onClick={() => setActiveTab(tab)}
              bg={activeTab === tab ? "#b79045" : "white"}
              color={activeTab === tab ? "white" : "black"}
              _hover={{ bg: "gray.200" }}
              border="1px solid"
              borderColor="gray.300"
              fontFamily="DM Sans"
              fontWeight="400"
            >
              {tab}
            </Button>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Tabs;
