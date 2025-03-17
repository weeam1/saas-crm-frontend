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
    base: "90px",
    sm: "100px",
    md: "120px",
  });

  const [buttonWidth, setButtonWidth] = useState("120px");

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
        <HStack
          gap={{
            base: { column: 2, row: 2 },
            sm: { column: 4, row: 6 },
            md: { column: 3, row: 4 },
          }}
          flexWrap="wrap"
          justify={{ base: "center", md: "start" }}
          width="100%"
        >
          {tabs.map((tab) => (
            <Button
              key={tab}
              sx={{
                ...(tab !== "All" && {
                  "@media screen and (max-width: 30em)": {
                    marginTop: "5px !important",
                    marginBottom: "0px !important",
                  },
                }),
              }}
              borderRadius="6px"
              w={buttonWidth}
              minWidth={resolvedWidth}
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
