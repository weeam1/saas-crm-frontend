import { Button, HStack, Box } from "@chakra-ui/react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["All", "Pending", "Rejected"];

  return (
    <Box width="100%" mb={4}>
      <HStack spacing={2} bg="gray.100" p={2} borderRadius="md">
        {tabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            bg={activeTab === tab ? "goldenrod" : "white"}
            color={activeTab === tab ? "white" : "black"}
            _hover={{ bg: "gray.200" }}
            border="1px solid"
            borderColor="gray.300"
            px={6}
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
