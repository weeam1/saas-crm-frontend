import { Button, HStack, Box } from "@chakra-ui/react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Pending", "Rejected"];

  return (
    <Box width="100%">
      <HStack spacing={2} p={2}>
        {tabs.map((tab) => (
          <Button
            borderRadius="10px"
            w="160px"
            key={tab}
            onClick={() => setActiveTab(tab)}
            bg={activeTab === tab ? "#b79045" : "white"}
            color={activeTab === tab ? "white" : "black"}
            _hover={{ bg: "gray.200" }}
            border="1px solid"
            borderColor="gray.300"
            py={2}
          >
            {tab}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default Tabs;
