import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const TopHeader = () => {
  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="md" 
      boxShadow="md" 
      mb={6}
      h="150px"
    >
      <Flex direction="column">
        <Heading as="h1" size="lg" mb={2}>
          Generate Survey
        </Heading>
        <Text fontSize="md" color="gray.600">
          Generate survey for your users and evaluate their performances
        </Text>
      </Flex>
    </Box>
  );
};

export default TopHeader;