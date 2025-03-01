import { Button, HStack, Box } from "@chakra-ui/react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Pending", "Rejected"];

  return (
    <Box width="100%">
      <HStack spacing={1} p={2}>
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
    </Box>
  );
};

export default Tabs;
