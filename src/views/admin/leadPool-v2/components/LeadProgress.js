import { Box, Text, Flex } from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";

const LeadsProgress = ({ totalLeads, userData }) => {
  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb={1}
        flexDirection={["column", "row"]}
      >
        <Text
          fontSize={["20px", "28px", "32px"]}
          fontWeight="medium"
          fontFamily="DM Sans"
          mb={[2, 0]}
        >
          Leads: <CountUpComponent targetNumber={totalLeads} />
        </Text>

        {userData?.coins !== undefined && (
          <Text
            fontSize={["16px", "20px", "24px"]}
            fontFamily="DM Sans"
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
