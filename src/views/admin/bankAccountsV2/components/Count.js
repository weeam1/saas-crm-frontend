import React from "react";
import { Text } from "@chakra-ui/react";
import CountUpComponent from "components/countUpComponent/countUpComponent";

const AccountCount = ({ count }) => {
  const formattedCount = count.toString().padStart(2, "0"); // Ensure 2 digits

  return (
    <Text
      fontSize={{ base: "15px", md: "xl", lg: "32px" }}
      fontWeight="medium"
      fontFamily="DM Sans"
      color="#333"
    >
      All Accounts (<CountUpComponent targetNumber={Number(formattedCount)} />)
    </Text>
  );
};

export default AccountCount;