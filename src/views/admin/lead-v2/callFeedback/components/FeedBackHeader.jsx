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
  Flex,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { IconButton, HStack, Tag, Tooltip } from "@chakra-ui/react";
import {
  FiChevronsLeft,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsRight,
  FiSearch,
} from "react-icons/fi";

const CallFeedbackHeader = ({
  search,
  setSearch,
  onSearch,
  onClear,
  setFromDate,
  setToDate,
  setMonth,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  // ✅ Set default month on mount
  React.useEffect(() => {
    setMonth(currentMonth);
  }, [currentMonth, setMonth]);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.800")}
    >
      <HStack spacing={4} align="center" wrap="wrap">
        {/* Search Input with Icon */}
        <InputGroup flex="1" maxW={{ base: "full", md: "400px" }}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search by user or lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            size="md"
            pl={10}
          />
        </InputGroup>

        {/* Date Range Picker + Clear */}
        <HStack spacing={2}>
          <Button onClick={onOpen} variant="outline" size="md">
            Select Date Range
          </Button>

          <Button onClick={onClear} variant="ghost" size="md" colorScheme="red">
            Clear
          </Button>
        </HStack>
      </HStack>

      <MonthFilterModal
        isOpen={isOpen}
        onClose={onClose}
        month={selectedMonth}
        year={selectedYear}
        setMonth={setSelectedMonth}
        setYear={setSelectedYear}
        handleDateFilter={({ from, to, month }) => {
          setFromDate(from);
          setToDate(to);
          setMonth(month); // ✅ sync with parent
        }}
      />
    </Box>
  );
};

const CallFeedbackFooter = ({ page, setPage, totalPages }) => {
  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.800")}
      mt={4}
    >
      <Flex justify="space-between" align="center" wrap="wrap">
        {/* Page Info */}
        <Text fontSize="sm" color="gray.600">
          Page {page} of {totalPages || 1}
        </Text>

        {/* Pagination Controls */}
        <HStack spacing={2}>
          <Tooltip label="First page">
            <IconButton
              size="sm"
              icon={<FiChevronsLeft />}
              aria-label="First"
              onClick={() => setPage(1)}
              isDisabled={page === 1 || totalPages <= 1}
              variant="outline"
            />
          </Tooltip>

          <Tooltip label="Previous page">
            <IconButton
              size="sm"
              icon={<FiChevronLeft />}
              aria-label="Previous"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              isDisabled={page === 1 || totalPages <= 1}
              variant="outline"
            />
          </Tooltip>

          {/* Jump to page */}
          <HStack spacing={1} align="center">
            <Text fontSize="sm" whiteSpace="nowrap">
              Go to:
            </Text>
            <NumberInput
              size="sm"
              width="70px"
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
          </HStack>

          <Tooltip label="Next page">
            <IconButton
              size="sm"
              icon={<FiChevronRight />}
              aria-label="Next"
              onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
              isDisabled={page === totalPages || totalPages <= 1}
              variant="outline"
            />
          </Tooltip>

          <Tooltip label="Last page">
            <IconButton
              size="sm"
              icon={<FiChevronsRight />}
              aria-label="Last"
              onClick={() => setPage(totalPages)}
              isDisabled={page === totalPages || totalPages <= 1}
              variant="outline"
            />
          </Tooltip>
        </HStack>

        {/* Total Pages Info */}
        <Text fontSize="sm" color="gray.600">
          Total: {totalPages || 1} {totalPages === 1 ? "page" : "pages"}
        </Text>
      </Flex>
    </Box>
  );
};

export { CallFeedbackHeader, CallFeedbackFooter };
const MonthFilterModal = ({
  isOpen,
  onClose,
  handleDateFilter,
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
    const from = dayjs().year(year).month(month).startOf("month").toISOString();

    const to = dayjs().year(year).month(month).endOf("month").toISOString();

    handleDateFilter({ from, to, month });
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
              Select Month
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

              <Select value={year} onChange={(e) => setYear(+e.target.value)}>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </HStack>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              Filters data for the selected month
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
