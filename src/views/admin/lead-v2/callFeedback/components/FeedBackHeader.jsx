import React from "react";
import {
  Box,
  Button,
  Text,
  useDisclosure,
  useColorModeValue,
  Flex,
  VStack,
  HStack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { FiCalendar } from "react-icons/fi";
import TopPagination from "components/pagination/TopPagination";
import { SearchBarV2 } from "components/search/SearchBarV2";
import AdvancedSearch from "./AdvanceSearch";

export const CallFeedbackHeader = ({
  search,
  setSearch,
  onSearch,
  onAdvancedSearch,
  onClear,
  setMonth, // we'll store YYYY-MM here
  month,
  advancedFilters,
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
  const [advanceSearch, setAdvanceSearch] = React.useState(false);

  const currentMonth = dayjs().format("MM");
  const currentYear = dayjs().year();

  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  // Check if any filters are active
  const hasActiveFilters = React.useMemo(() => {
    // Check if search has value
    const hasSearch = search && search.trim() !== "";

    // Check if any advanced filter has value
    const hasAdvancedFilters = Object.values(advancedFilters || {}).some(
      (value) => value && value.trim() !== "",
    );

    // Check if month is different from current month
    const isCurrentMonth = month === `${currentYear}-${currentMonth}`;
    const hasMonthFilter = !isCurrentMonth;

    return hasSearch || hasAdvancedFilters || hasMonthFilter;
  }, [search, advancedFilters, month, currentYear, currentMonth]);

  // Set default month-year as YYYY-MM
  React.useEffect(() => {
    if (!month) {
      setMonth?.(`${currentYear}-${currentMonth}`);
    }
  }, [currentMonth, currentYear, setMonth, month]);

  const handleClearAll = () => {
    // Clear search
    setSearch?.("");
    onSearch?.("");

    // Call parent's clear function
    onClear?.();

    // Reset month to current
    setMonth?.(`${currentYear}-${currentMonth}`);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  };

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr", // mobile: 1 per row
            md: "1fr 1fr", // tablet: 2 per row
            lg: " 1fr 1fr 1fr", // desktop: full layout
            xl: "4fr 1.5fr 1fr 1fr", // desktop: full layout
          }}
          gap={3}
          alignItems="center"
        >
          {/* Search Bar */}
          <Box>
            <SearchBarV2
              value={search}
              onSearchTermChange={onSearch}
              onClear={() => {
                setSearch?.("");
                onSearch?.("");
              }}
            />
          </Box>

          {/* Advanced Search Button */}
          <Button
            colorScheme="brand"
            borderRadius="md"
            size="md"
            onClick={() => setAdvanceSearch(true)}
          >
            Advanced Search
          </Button>

          {/* Month-Year Picker */}
          <Box>
            <Button
              onClick={onOpen}
              variant="outline"
              size="md"
              leftIcon={<FiCalendar />}
              width="100%"
              borderRadius="md"
            >
              {dayjs(month || `${selectedYear}-${selectedMonth}-01`).format(
                "MMMM YYYY",
              )}
            </Button>
          </Box>

          {/* Clear Filters Button - Disabled when no filters are active */}
          <Button
            bg={hasActiveFilters ? "gray.300" : "gray.200"}
            color={hasActiveFilters ? "gray.800" : "gray.600"}
            borderRadius="md"
            size="md"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            _hover={
              hasActiveFilters
                ? { bg: "gray.400", cursor: "pointer" }
                : { bg: "gray.200", cursor: "not-allowed" }
            }
            _active={hasActiveFilters ? { bg: "gray.500" } : { bg: "gray.100" }}
            cursor={hasActiveFilters ? "pointer" : "not-allowed"}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Month-Year Modal */}
        <MonthYearModal
          isOpen={isOpen}
          onClose={onClose}
          month={selectedMonth}
          year={selectedYear}
          setMonth={setSelectedMonth}
          setYear={setSelectedYear}
          onApply={(month, year) => {
            setSelectedMonth(month.padStart(2, "0"));
            setSelectedYear(year);
            setMonth?.(`${year}-${month.padStart(2, "0")}`);
          }}
        />
      </Box>

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

      {advanceSearch && (
        <AdvancedSearch
          isOpen={advanceSearch}
          onClose={() => setAdvanceSearch(false)}
          onSearch={onAdvancedSearch}
          initialValues={advancedFilters}
        />
      )}
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
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const currentYear = dayjs().year();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

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

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>

              <Select value={year} onChange={(e) => setYear(e.target.value)}>
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
