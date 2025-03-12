import React, { memo } from "react";
import { VStack, Text } from "@chakra-ui/react";

const InfoPair = memo(({ label, value, color = "#ff0307" }) => (
  <VStack align="start" spacing={0} flex="1" minWidth="0">
    <Text fontSize="9px" color="#C1C1C1" fontFamily="DM Sans">
      {label}
    </Text>
    <Text fontSize="10px" color={color} fontFamily="DM Sans">
      {value || "N/A"}
    </Text>
  </VStack>
));

export default InfoPair;