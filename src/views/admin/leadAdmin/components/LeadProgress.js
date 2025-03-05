import { Box, Text, Flex } from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";

const LeadsProgress = ({ totalLeads }) => {
  return (
    <Box w={{ base: "100%", lg: "80%" }}>
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="32px" fontWeight="medium" fontFamily="DM Sans">
          Leads:
          <CountUpComponent targetNumber={totalLeads} />
        </Text>
      </Flex>
    </Box>
  );
};

export default LeadsProgress;
