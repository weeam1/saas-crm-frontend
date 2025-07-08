import React from "react";
import { Flex, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { format } from "date-fns";

const ActiveFiltersDisplay = ({ filters, onClearFilters, users }) => {
  const hasFilters = Object.keys(filters).length > 0;

  if (!hasFilters) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : format(date, "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const getDisplayValue = (key, value) => {
    switch (key) {
      case "dueDateFrom":
        return `From: ${formatDate(value)}`;
      case "dueDateTo":
        return `To: ${formatDate(value)}`;
      case "assignedTo":
        const assignedUser = users.find((u) => u._id === value);
        return `Assigned To: ${assignedUser ? assignedUser.name : value}`;
      case "type":
        return `Type: ${value}`;
      case "status":
        return `Status: ${value}`;
      case "overdue":
        return "Overdue Tasks";
      case "todays":
        return "Today's Tasks";
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
      {Object.entries(filters).map(([key, value]) => (
        <Tag key={key} size="md" colorScheme="brand" borderRadius="full">
          <Flex align="center" justify="space-between" w="100%">
            <TagLabel>{getDisplayValue(key, value)}</TagLabel>
            <TagCloseButton onClick={() => onClearFilters(key)} ml={2} />
          </Flex>
        </Tag>
      ))}
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
