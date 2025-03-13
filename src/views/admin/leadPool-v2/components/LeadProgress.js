import { Box, Text, Flex } from "@chakra-ui/react";
<<<<<<< HEAD

const LeadsProgress = ({ totalLeads, userData }) => {
  
  return (
    <Box w={{ base: "100%", lg: "80%" }}>
      <Flex justify="space-between" align="center" mb={1}>
        <Text fontSize="32px" fontWeight="medium" fontFamily="DM Sans">
          Leads {totalLeads}
        </Text>
        <Text fontSize="24px" fontFamily="DM Sans" mt={{ base: 0, lg: 10 }}>
          {userData?.coins} coins
        </Text>
=======
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
>>>>>>> 3f62931e1d0eef0054090539da40fe220b02da11
      </Flex>
    </Box>
  );
};

export default LeadsProgress;
