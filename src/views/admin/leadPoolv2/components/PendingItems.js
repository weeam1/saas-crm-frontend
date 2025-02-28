import { Box, Text } from "@chakra-ui/react";

const PendingItems = () => {
  return (
    <Box mt={4} p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
      <Text fontSize="lg">Showing Pending Items</Text>
      {/* Add Pending Items Content Here */}
    </Box>
  );
};

export default PendingItems;
