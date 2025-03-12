import { Box, Text, Flex } from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";

const LeadsProgress = ({ totalLeads, userData }) => {
  return (
    <Box w={{ base: "100%", lg: "80%" }}>
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="32px" fontWeight="medium" fontFamily="DM Sans">
          Leads: <CountUpComponent targetNumber={totalLeads} />
        </Text>
        {userData?.coins !== undefined && (
          <Text
            fontSize="24px"
            fontFamily="DM Sans"
            mt={{ base: 0, lg: 10 }}
            backgroundColor="#B79045"
            textColor="white"
            p="5px"
            borderRadius="5px"
          >
            Coins: <CountUpComponent targetNumber={userData.coins} />
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default LeadsProgress;
