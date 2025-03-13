import { Button, HStack, Box, Flex, Stack } from "@chakra-ui/react";

<<<<<<< HEAD
const Tabs = ({ activeTab, setActiveTab }) => {
=======
const Tabs = ({ activeTab, setActiveTab, isLoading }) => {
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
<<<<<<< HEAD
              _hover={{ bg: "gray.200" }}
=======
              _hover={{ bg: activeTab === tab ? "#b79045" : "gray.200" }}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
              border="1px solid"
              borderColor="gray.300"
              fontFamily="DM Sans"
              fontWeight="400"
              borderRadius="6px"
              w={{ base: "100%", sm: "120px", md: "160px" }}
              h="42px"
<<<<<<< HEAD
=======
              isDisabled={isLoading && activeTab !== tab && tab !== "All"}
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
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
