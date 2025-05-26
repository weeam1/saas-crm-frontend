import React from "react";
import { Flex, Box, Text, Input, Button, Select } from "@chakra-ui/react";
import TopPagination from "components/pagination/TopPagination";

const FilterSearch = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  setPageSize,
  handlePageSizeChange,
  isLoading,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="sm" mb={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        gap={4}
      >
        {/* Pagination */}
        <Box>
          <TopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            setPageSize={setPageSize}
            handlePageSize={handlePageSizeChange}
            refetching={isLoading}
            loading={isLoading}
          />
        </Box>

        {/* Date Filters */}
        <Flex align="center" gap={2}>
          <Text fontSize="sm" fontWeight="medium" minW="max-content">
            Date
          </Text>
          <Input
            type="date"
            size="sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || undefined}
          />
          <Text fontSize="sm" fontWeight="medium">
            To
          </Text>
          <Input
            type="date"
            size="sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default FilterSearch;
