import React from "react";
import {
  Box,
  Flex,
  Tag,
  TagLabel,
  Button,
} from "@chakra-ui/react";

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
