import React from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";

const SearchDisplay = ({ searchQuery, advancedSearchValues, onClear }) => {
  const isAdvancedSearch = advancedSearchValues && Object.keys(advancedSearchValues).length > 0;
  const displayText = isAdvancedSearch
    ? "Advanced Search: " +
      Object.entries(advancedSearchValues)
        .filter(([_, value]) => value) 
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")
    : `Simple Search: ${searchQuery}`;

  return (
    <Box
      bg="gray.100"
      p={2}
      borderRadius="md"
      w="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <VStack align="start" spacing={0}>
        <Text fontSize="sm" fontWeight="bold" color="gray.700">
          Current Search
        </Text>
        <Text fontSize="xs" color="gray.600" isTruncated maxW="80%">
          {displayText || "No active search"}
        </Text>
      </VStack>
      {(searchQuery || isAdvancedSearch) && (
        <Button
          size="xs"
          colorScheme="red"
          variant="outline"
          onClick={onClear}
          _hover={{ bg: "red.50" }}
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

export default SearchDisplay;