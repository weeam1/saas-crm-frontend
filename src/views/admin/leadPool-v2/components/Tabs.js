import { Button, HStack, Box, Flex, Stack } from "@chakra-ui/react";

const Tabs = ({ activeTab, setActiveTab, isLoading }) => {
  const tabs = ["All", "Pending", "Rejected"];

  return (
    <Box width="100%">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={2}
        width="100%"
        flexWrap="wrap"
        gap={{ base: 2, md: 4 }}
      >
        {/* Tabs Section */}
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={{ base: 2, md: 1 }}
          width={{ base: "100%", md: "auto" }}
          align="center"
        >
          {tabs.map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              bg={activeTab === tab ? "#b79045" : "white"}
              color={activeTab === tab ? "white" : "black"}
              _hover={{ bg: activeTab === tab ? "#b79045" : "gray.200" }}
              border="1px solid"
              borderColor="gray.300"
              fontFamily="DM Sans"
              fontWeight="400"
              borderRadius="6px"
              w={{ base: "100%", sm: "120px", md: "160px" }}
              h="42px"
              isDisabled={isLoading && activeTab !== tab && tab !== "All"}
            >
              {tab}
            </Button>
          ))}
        </Stack>

        {/* DatePicker (Uncomment when needed) */}
        {/* <DatePicker /> */}
      </Flex>
    </Box>
  );
};

export default Tabs;
