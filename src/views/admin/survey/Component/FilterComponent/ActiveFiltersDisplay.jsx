import React from "react";
import { Box, Flex, Tag, TagLabel, Button } from "@chakra-ui/react";

const ActiveFiltersDisplay = ({
  filters,
  onClearFilters,
  agencies = [],
}) => {
  const hasFilters =
    filters &&
    (filters.agency || filters.from || filters.to);

  if (!hasFilters) return null;

  const getAgencyName = (id) => {
    const found = agencies.find((agency) => agency._id === id);
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
          {filters.agency && (
            <Tag size="md" variant="subtle" bg="softGray.600">
              <TagLabel>
                Agency: {getAgencyName(filters.agency)}
              </TagLabel>
            </Tag>
          )}
          {filters.from && (
            <Tag size="md" variant="subtle" bg="softGray.600">
              <TagLabel>
                From: {formatDate(filters.from)}
              </TagLabel>
            </Tag>
          )}
          {filters.to && (
            <Tag size="md" variant="subtle" bg="softGray.600">
              <TagLabel>
                To: {formatDate(filters.to)}
              </TagLabel>
            </Tag>
          )}
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