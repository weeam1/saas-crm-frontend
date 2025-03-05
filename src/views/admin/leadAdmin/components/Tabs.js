import {
  Button,
  HStack,
  Box,
  Flex,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
// import DatePicker from "./DateFilter";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Pending", "Approved", "Rejected"];

  // Dynamic button width for responsiveness
  const buttonWidth = useBreakpointValue({
    base: "100%",
    sm: "140px",
    md: "160px",
  });

  return (
    <Box width="100%">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={2}
        width="100%"
        flexWrap="wrap"
        gap={{ base: 2, md: 0 }}
        flexDirection={{ base: "column", md: "row" }} // Stack on small screens
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

        {/* DatePicker Section (Uncomment when needed) */}
        {/* <DatePicker /> */}
      </Flex>
    </Box>
  );
};

export default Tabs;
