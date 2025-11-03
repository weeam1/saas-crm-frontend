// InputPair.jsx
import React from 'react';
import { VStack, Text, InputGroup, Input, InputRightElement, Icon } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const InputPair = ({
  label,
  value,
  bg,
  color,
  width = { base: "60px", md: "70px" },
}) => (
  
  <VStack align="start" spacing={0} flex="1" minW={0}>
    <Text fontSize="9px" color="#C1C1C1" fontFamily="DM Sans">
      {label}
    </Text>
    <InputGroup w={width}>
      <Input
        size="xs"
        value={value || "N/A"}
        h="1.3rem"
        bg={bg}
        color={color}
        border="1px solid"
        borderRadius="5px"
        borderColor="gray.300"
        fontSize="xs"
        fontFamily="DM Sans"
        _focus={{ borderColor: "#B79045", boxShadow: "0 0 0 1px #B79045" }}
        _hover={{ borderColor: "#B79045" }}
        pr="1.5rem"
        isDisabled
        pl={label === "Status" ? "3px" : undefined}
      />
      <InputRightElement
        pointerEvents="none"
        h="1.3rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="1.5rem"
      >
        <Icon as={ChevronDownIcon} color={color} boxSize={4} />
      </InputRightElement>
    </InputGroup>
  </VStack>
);

export default InputPair;