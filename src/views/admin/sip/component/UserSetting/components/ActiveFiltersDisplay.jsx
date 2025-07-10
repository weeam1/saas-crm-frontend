import React from "react";
import { Flex, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

const ActiveFiltersDisplay = ({ filters, onClearFilters }) => {
  const hasFilters = Object.keys(filters).length > 0;

  if (!hasFilters) return null;

  const getDisplayValue = (key, value) => {
    switch (key) {
      case "sipId":
        return `SIP ID: ${value}`;
      case "extensionId":
        return `Extension: ${value}`;
      case "sipIp":
        return `IP: ${value}`;
      case "sipPort":
        return `Port: ${value}`;
      case "sipSimNumber":
        return `SIM: ${value}`;
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <Flex
      align="center"
      wrap="wrap"
      gap={2}
      p={3}
      mb={3}
      borderRadius="md"
      justify="space-between"
    >
      <Flex gap={2} wrap="wrap">
        {Object.entries(filters).map(([key, value]) => (
          <Tag key={key} size="md" colorScheme="brand" borderRadius="full">
            <Flex>
              <TagLabel>{getDisplayValue(key, value)}</TagLabel>
              <TagCloseButton onClick={() => onClearFilters(key)} ml={2} />
            </Flex>
          </Tag>
        ))}
      </Flex>
      <Tag
        size="md"
        colorScheme="red"
        borderRadius="full"
        cursor="pointer"
        onClick={() => onClearFilters()}
      >
        <TagLabel>Clear All</TagLabel>
      </Tag>
    </Flex>
  );
};

export default ActiveFiltersDisplay;