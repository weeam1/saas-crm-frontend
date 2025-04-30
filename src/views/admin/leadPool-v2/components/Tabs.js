import { Button, HStack, Box, Flex, Stack } from "@chakra-ui/react";

const Tabs = ({ activeTab, setActiveTab, isLoading }) => {
  const tabs = ["Buy Leads", "Pending", "Rejected"];

  const handleTabClick = (tab) => {
    if (tab !== activeTab && !isLoading) {
      setActiveTab(tab);
    }
  };

  return (
    <Box width="100%">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={2}
        width="100%"
        flexWrap="wrap"
      >
        <Stack
          direction={{ base: "column", sm: "row" }}
		  display={"flex"}
          width={{ base: "100%", md: "auto" }}
          align="center"
		  spacing={0}
        >
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="unstyled"
              onClick={() => handleTabClick(tab)}
              bg={activeTab === tab ? "#EDD199" : "softGray.50"}
              color={activeTab === tab ? "black" : "gray.500"}
              fontWeight={activeTab === tab ? "semi-bold" : "normal"}
              borderTop={
                activeTab === tab
                  ? "4px solid #B79045"
                  : "4px solid transparent"
              }
              borderRadius="0"
              h="42px"
              minW="100px"
              _focus={{ outline: "none" }}
              outline="none"
              fontFamily="DM Sans"
            >
              {tab}
            </Button>
          ))}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Tabs;
