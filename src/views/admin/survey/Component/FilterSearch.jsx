import React, { useState } from "react";
import { Flex, Box, Text, Stack } from "@chakra-ui/react";
import TopPagination from "components/pagination/TopPagination";
import CustomDatePicker from "components/datetime/CustomDatePicker";

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
  const [openCalendar, setOpenCalendar] = useState(null);

  const toggleCalendar = (calendar) => {
    setOpenCalendar((prev) => (prev === calendar ? null : calendar));
  };

  return (
    <Box
      bg="white"
      p={{ base: 3, md: 4 }}
      borderRadius="md"
      boxShadow="sm"
      mb={4}
      width="100%"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 1, md: 1 }}
        width="100%"
      >
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

        {/* Date Filters - Responsive and prevent calendar overflow */}
        <Flex
          direction="row"
          align="center"
          gap={1}
          width={{ base: "100%", md: "auto" }}
          flexWrap="wrap"
        >
          <Text
            fontSize="sm"
            fontWeight="medium"
            minW="max-content"
            mr={2}
            whiteSpace="nowrap"
          >
            Date
          </Text>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            width={{ base: "100%", sm: "auto" }}
            flexWrap="wrap"
          >
            <Box minW="160px" maxW="200px">
              <CustomDatePicker
                selectedDate={startDate}
                handleDateChange={setStartDate}
                placeholder="Select start date"
                maxDate={endDate || new Date()}
                isCalendarOpen={openCalendar === "startFrom"}
                toggleCalendar={() => toggleCalendar("startFrom")}
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "preventOverflow",
                    options: {
                      boundary: "viewport",
                      padding: 8,
                    },
                  },
                ]}
              />
            </Box>
            <Text fontSize="sm" fontWeight="medium" textAlign="center" mx={1}>
              To
            </Text>
            <Box minW="160px" maxW="200px">
              <CustomDatePicker
                selectedDate={endDate}
                handleDateChange={setEndDate}
                placeholder="Select end date"
                minDate={startDate}
                maxDate={new Date()}
                isCalendarOpen={openCalendar === "endDate"}
                toggleCalendar={() => toggleCalendar("endDate")}
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
      <Flex justifyContent={"flex-end"} mt={3}>
         {/* Clear Button */}
            {(endDate || startDate) && (
              <Box>
                <Text
                  as="button"
                  fontSize="sm"
                  color="red.500"
                  fontWeight="medium"
                  px={3}
                  py={1}
                  borderRadius="md"
                  _hover={{ bg: "red.50" }}
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  Clear
                </Text>
              </Box>
            )}
        </Flex>
    </Box>
  );
};

export default FilterSearch;