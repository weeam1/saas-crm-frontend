import React from "react";
import { Flex, Box, Text, Input, Button, Select, Stack } from "@chakra-ui/react";
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
    <Box bg="white" p={{ base: 3, md: 4 }} borderRadius="md" boxShadow="sm" mb={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 3, md: 4 }}
      >
        {/* Pagination - Full width on mobile, auto on desktop */}
        <Box width={{ base: "100%", md: "auto" }}>
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

        {/* Date Filters - Stack vertically on mobile, row on desktop */}
        <Flex 
          direction={{ base: "column", sm: "row" }}
          align={{ base: "stretch", sm: "center" }}
          gap={{ base: 2, sm: 3, md: 4 }}
          width={{ base: "100%", md: "auto" }}
        >
          <Text 
            fontSize="sm" 
            fontWeight="medium" 
            minW="max-content"
            alignSelf={{ base: "flex-start", sm: "center" }}
          >
            Date
          </Text>
          
          <Stack 
            direction={{ base: "column", sm: "row" }} 
            spacing={{ base: 2, sm: 3, md: 2 }}
            align="center"
            width={{ base: "100%", sm: "auto" }}
          >
            <Input
              type="date"
              size="sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || undefined}
              width={{ base: "100%", sm: "150px", md: "auto" }}
            />
            <Text fontSize="sm" fontWeight="medium" textAlign="center">
              To
            </Text>
            <Input
              type="date"
              size="sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || undefined}
              width={{ base: "100%", sm: "150px", md: "auto" }}
            />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default FilterSearch;