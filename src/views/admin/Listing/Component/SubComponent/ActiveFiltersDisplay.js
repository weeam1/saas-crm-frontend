import React from "react";
import { Box, Flex, Tag, TagLabel, Button } from "@chakra-ui/react";

const ActiveFiltersDisplay = ({
  filters,
  onClearFilters,
  listingTypes = [],
  unitTypes = [],
}) => {
  const hasFilters = Object.keys(filters).length > 0;

  if (!hasFilters) return null;

  const getNameFromId = (id, options) => {
    const found = options.find((option) => option._id === id);
    return found ? found.name : id;
  };

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

            if (key === "unitType") {
              displayValue = `Unit: ${getNameFromId(value, unitTypes)}`;
            } else if (key === "listingType") {
              displayValue = `Type: ${getNameFromId(value, listingTypes)}`;
            } else if (key === "minPrice") {
              displayValue = `Min: AED ${value}`;
            } else if (key === "maxPrice") {
              displayValue = `Max: AED ${value}`;
            } else if (key === "minArea") {
              displayValue = `Min Area: ${value} sqft`;
            } else if (key === "maxArea") {
              displayValue = `Max Area: ${value} sqft`;
            } else if (key === "month") {
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
            else if (key === "country") {
              displayValue = `Country: ${value}`;
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