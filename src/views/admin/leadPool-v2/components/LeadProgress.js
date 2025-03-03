import { Box, Text, Flex } from "@chakra-ui/react";

const LeadsProgress = ({ totalLeads }) => {
  return (
    <Box w={{ base: "100%", lg: "80%" }}>
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="32px" fontWeight="medium" fontFamily="DM Sans">
          Leads {totalLeads}
        </Text>
        <Text fontSize="24px" fontFamily="DM Sans" mt={{ base: 0, lg: 10 }}>
          300 coins
        </Text>
      </Flex>
    </Box>
  );
};

export default LeadsProgress;
