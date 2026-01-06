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
  onSearch,
  onClear,
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
      <HStack spacing={4} align="center" wrap="wrap">
        {/* Search */}
        <Input
          placeholder="Search by user or lead..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          maxW={{ base: "full", md: "200px" }}
          size="sm"
        />

        {/* Date Range Picker + Clear */}
        <HStack spacing={2}>
          <Button onClick={onOpen} variant="outline" size="sm">
            Select Date Range
          </Button>

          <Button onClick={onClear} variant="ghost" size="sm" colorScheme="red">
            Clear
          </Button>
        </HStack>

        {/* Spacer pushes pagination to the right */}
        <Box flex="1" />

        {/* Pagination */}
        <HStack spacing={2}>
          <Tooltip label="First page">
            <IconButton
              size="sm"
              icon={<FiChevronsLeft />}
              aria-label="First"
              onClick={() => setPage(1)}
              isDisabled={page === 1 || totalPages <= 1}
              variant="ghost"
            />
          </Tooltip>

          <Tooltip label="Previous page">
            <IconButton
              size="sm"
              icon={<FiChevronLeft />}
              aria-label="Previous"
              onClick={() => setPage((p) => p - 1)}
              isDisabled={page === 1 || totalPages <= 1}
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
              isDisabled={totalPages <= 1}
              onChange={(valueAsString, valueAsNumber) => {
                if (valueAsString === "") {
                  setPage(""); // allow clearing input while typing
                  return;
                }
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
              isDisabled={page === totalPages || totalPages <= 1}
              variant="ghost"
            />
          </Tooltip>

          <Tooltip label="Last page">
            <IconButton
              size="sm"
              icon={<FiChevronsRight />}
              aria-label="Last"
              onClick={() => setPage(totalPages)}
              isDisabled={page === totalPages || totalPages <= 1}
              variant="ghost"
            />
          </Tooltip>
        </HStack>
      </HStack>

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
