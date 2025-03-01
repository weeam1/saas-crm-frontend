import { Button, HStack, Box, Flex } from "@chakra-ui/react";
import DatePicker from "./DateFilter"

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Pending", "Rejected"];

  return (
    <Box width="100%">
      <Flex
        justifyContent="space-between" 
        alignItems="center"
        p={2}
        width="100%"
        flexWrap="wrap" 
        gap={{ base: 2, md: 0 }} 
      >
        {/* Tabs on the left */}
        <HStack spacing={1}>
          {tabs.map((tab) => (
            <Button
              borderRadius="6px"
              w="160px"
              h="42px"
              key={tab}
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

        {/* DatePicker on the right */}
        <DatePicker />
      </Flex>
    </Box>
  );
};

export default Tabs;