import React, { useState } from "react";
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
  InputGroup,
  InputLeftElement,
  Flex,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Select,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { IconButton, HStack, Tag, Tooltip } from "@chakra-ui/react";
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiSearch,
  FiCalendar,
} from "react-icons/fi";
import TopPagination from "components/pagination/TopPagination";
import { SearchBarV2 } from "components/search/SearchBarV2";

export const CallFeedbackHeader = ({
  search,
  setSearch,
  onSearch,
  onClear,
  setFromDate,
  setToDate,
  setMonth,
  setYear,
  // Pagination props
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  refetching,
  loading,
  handlePageSize,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  // ✅ Set default month on mount
  React.useEffect(() => {
    if (setMonth) setMonth(currentMonth);
    if (setYear) setYear(currentYear);
  }, [currentMonth, currentYear, setMonth, setYear]);

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Flex gap={3} align="center">
          {/* Search Bar with 70% width */}
          <Box width="80%">
            <SearchBarV2
              value={search} // parent state for controlled "submitted" search
              onSearchTermChange={onSearch} // parent function called with latest term
              onClear={() => {
                if (setSearch) setSearch("");
                if (onClear) onClear();
              }}
            />
          </Box>

          {/* Month-Year Picker with icon + Clear button */}
          <HStack spacing={2} width="20%">
            <Button
              onClick={onOpen}
              variant="outline"
              size="md"
              leftIcon={<FiCalendar />}
              width="full"
            >
              {dayjs().month(selectedMonth).format("MMMM")} {selectedYear}
            </Button>

            {/* <Button
              onClick={onClear}
              variant="ghost"
              size="md"
              colorScheme="red"
            >
              Clear
            </Button> */}
          </HStack>
        </Flex>

        <MonthYearModal
          isOpen={isOpen}
          onClose={onClose}
          month={selectedMonth}
          year={selectedYear}
          setMonth={setSelectedMonth}
          setYear={setSelectedYear}
          onApply={(month, year) => {
            if (setMonth) setMonth(month);
            if (setYear) setYear(year);

            // Also set from/to dates if needed
            if (setFromDate) {
              const from = dayjs()
                .year(year)
                .month(month)
                .startOf("month")
                .toISOString();
              setFromDate(from);
            }
            if (setToDate) {
              const to = dayjs()
                .year(year)
                .month(month)
                .endOf("month")
                .toISOString();
              setToDate(to);
            }
          }}
        />
      </Box>

      {/* Add TopPagination with all props */}
      <TopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        refetching={refetching}
        loading={loading}
        handlePageSize={handlePageSize}
      />
    </>
  );
};

const MonthYearModal = ({
  isOpen,
  onClose,
  onApply,
  month,
  year,
  setMonth,
  setYear,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const months = [
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

  const currentYear = dayjs().year();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  const handleApply = () => {
    onApply(month, year);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
      size="sm"
    >
      <ModalOverlay />
      <ModalContent bg={bgColor} borderRadius="2xl" overflow="hidden">
        {/* Header */}
        <ModalHeader p={0}>
          <Flex
            bg={headerBg}
            color={headerText}
            px={5}
            py={3}
            align="center"
            justify="space-between"
          >
            <Text fontSize="lg" fontWeight="bold">
              Select Month & Year
            </Text>
            <ModalCloseButton position="static" />
          </Flex>
        </ModalHeader>

        {/* Body */}
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              {/* Month */}
              <Select value={month} onChange={(e) => setMonth(+e.target.value)}>
                {months.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </Select>

              {/* Year */}
              <Select value={year} onChange={(e) => setYear(+e.target.value)}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </HStack>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Select month and year to filter data
            </Text>
          </VStack>
        </ModalBody>

        {/* Footer */}
        <ModalFooter borderTop="1px solid" borderColor={borderColor} gap={3}>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brand" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
