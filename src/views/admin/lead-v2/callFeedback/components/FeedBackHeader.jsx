import React from "react";
import {
  Box,
  SimpleGrid,
  Input,
  Button,
  Text,
  useDisclosure,
  useColorModeValue,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import DateRangeFilter from "views/admin/deals/components/DateRangeFilter";
import { IconButton, HStack, Tag, Tooltip } from "@chakra-ui/react";
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";

const CallFeedbackHeader = ({
  search,
  setSearch,
  setFromDate,
  setToDate,
  page,
  setPage,
  totalPages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDateFilter = ({ from, to }) => {
    setFromDate(from);
    setToDate(to);
    onClose();
  };

  return (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.800")}
    >
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        {/* Search */}
        <Input
          placeholder="Search by user or lead..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Global Date Range Picker Button */}
        <Button onClick={onOpen} variant="outline">
          Select Date Range
        </Button>

        {/* spacer so layout stays nice */}
        <Box />

        {/* Pagination */}
        {/* Pagination */}
        <Box display="flex" alignItems="center" justifyContent="center">
          <HStack spacing={2}>
            <Tooltip label="First page">
              <IconButton
                size="sm"
                icon={<FiChevronsLeft />}
                aria-label="First"
                onClick={() => setPage(1)}
                isDisabled={page === 1}
                variant="ghost"
              />
            </Tooltip>

            <Tooltip label="Previous page">
              <IconButton
                size="sm"
                icon={<FiChevronLeft />}
                aria-label="Previous"
                onClick={() => setPage((p) => p - 1)}
                isDisabled={page === 1}
                variant="ghost"
              />
            </Tooltip>

            {/* Jump to page */}
            <HStack spacing={1}>
              <NumberInput
                size="sm"
                width="60px"
                min={1}
                max={totalPages || 1}
                value={page}
                onChange={(valueAsString, valueAsNumber) => {
                  // Allow empty string while typing
                  if (valueAsString === "") {
                    setPage(""); // let user clear input before typing
                    return;
                  }

                  // Only update if it's a valid number
                  const num = parseInt(valueAsString, 10);
                  if (!isNaN(num)) {
                    setPage(Math.min(Math.max(1, num), totalPages || 1));
                  }
                }}
                clampValueOnBlur
              >
                <NumberInputField textAlign="center" />
              </NumberInput>

              <Text fontSize="sm">/ {totalPages || 1}</Text>
            </HStack>

            <Tooltip label="Next page">
              <IconButton
                size="sm"
                icon={<FiChevronRight />}
                aria-label="Next"
                onClick={() => setPage((p) => p + 1)}
                isDisabled={page === totalPages}
                variant="ghost"
              />
            </Tooltip>

            <Tooltip label="Last page">
              <IconButton
                size="sm"
                icon={<FiChevronsRight />}
                aria-label="Last"
                onClick={() => setPage(totalPages)}
                isDisabled={page === totalPages}
                variant="ghost"
              />
            </Tooltip>
          </HStack>
        </Box>
      </SimpleGrid>

      {/* Global Date Filter Modal */}
      <DateRangeFilter
        isOpen={isOpen}
        onClose={onClose}
        handleDateFilter={handleDateFilter}
      />
    </Box>
  );
};

export default CallFeedbackHeader;
