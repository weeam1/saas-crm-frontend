import React from "react";
import { Box, Flex, Tag, TagLabel, Button } from "@chakra-ui/react";

const ActiveFiltersDisplay = ({
  filters,
  onClearFilters,
}) => {
  const hasFilters = Object.keys(filters).length > 0;

  if (!hasFilters) return null;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? dateString
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Box>
      <Flex align="center" justify="space-between" gap={3}>
        <Flex align="center" wrap="wrap" gap={3}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;

            let displayValue = value;

            if (key === "filterStatus") {
              displayValue = `filter-Status: ${value}`;
            } 
             else if (key === "month") {
              const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              const monthIndex = parseInt(value, 10);
              displayValue =
                isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12
                  ? `${value}`
                  : `${monthNames[monthIndex - 1]}`;
            } else if (key === "year") {
              displayValue = `${value}`;
            } else if (key === "startFrom" || key === "startTo") {
              displayValue = `${key === "startFrom" ? "From" : "To"}: ${formatDate(value)}`;
            }
          
            return (
              <Tag key={key} size="md" variant="subtle" bg="softGray.600">
                <TagLabel>{displayValue}</TagLabel>
              </Tag>
            );
          })}
        </Flex>
        <Button
          variant="outline"
          size="sm"
          colorScheme="red"
          onClick={() => onClearFilters()}
        >
          Clear
        </Button>
      </Flex>
    </Box>
  );
};

export default ActiveFiltersDisplay;