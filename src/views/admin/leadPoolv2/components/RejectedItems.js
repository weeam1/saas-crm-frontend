import { Box, Text } from "@chakra-ui/react";

const RejectedItems = () => {
  return (
    <Box mt={4} p={4} border="1px solid" borderColor="gray.300" borderRadius="md">
      <Text fontSize="lg">Showing Rejected Items</Text>
      {/* Add Rejected Items Content Here */}
    </Box>
  );
};

export default RejectedItems;
