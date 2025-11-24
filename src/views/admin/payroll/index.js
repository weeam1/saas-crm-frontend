import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import TopPagination from "components/pagination/TopPagination";
import DateFilter from "views/admin/attendance/components/DateFilter";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import { buttonStyle } from "utils/btn";
import { BiX } from "react-icons/bi";
import { useEmployeePayroll } from "./hooks/usePayroll";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import AgencyFilterModal from "../finance/components/AgencyFilterModal";
import EmployeePayrollTable from "./components/EmployeePayrollTable";
import SearchBar from "components/search/SearchBar";
import AdvancedSearchModal from "./components/AdvancedSearchModal";
import { useFetchItemsQuery } from "api/apiSlice";
import ActiveFiltersDisplay from "./components/ActiveFiltersDisplay";

const Payroll = () => {
  const {
    month,
    year,
    isAgenciesAllowed,
    agencies,
    queryParams,
    data,
    totalPages,
    totalRecords,
    agencyId,
    setAgencyId,
    isLoading,
    isFetching,
    handlePageChange,
    handlePageSize,
    onDateFilterChange,
  } = useEmployeePayroll();

  const selectedAgency = useMemo(
    () => agencies.find((a) => a._id === agencyId) || null,
    [agencies, agencyId]
  );

  const [clearFilters, setClearFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);

  const {
    isOpen: agencyFilterIsOpen,
    onOpen: agencyFilterOnOpen,
    onClose: agencyFilterOnClose,
  } = useDisclosure();

  const agencyName = agencies.find((a) => a._id === agencyId);

  const { data: usersData } = useFetchItemsQuery({
    path: "/v2/user/search_users",
    params: { agencyFilter: agencyName?.name || "" },
  });

  const handleAgencyFilter = (value) => {
    setAgencyId(value);

    if (value) {
      setClearFilters(true);
    } else setClearFilters(false);
  };

  const handleClear = () => {
    setClearFilters(false);
    setAgencyId(null);
  };

  const handleSearchTermChange = () => {};
  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    setFilters(cleanedFilters);
    setFilterChanged(true);
  };

  const handleClearFilters = (filterKey) => {
    if (filterKey) {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
    } else {
      setFilters({});
    }
    setFilterChanged(true);
  };

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 3, md: 0 }}
        mb={4}
        w="100%"
      >
        <Flex
          alignSelf={{ base: "center", md: "flex-start" }}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold"
          gap="2"
          textAlign={{ base: "center", md: "left" }}
          order={{ base: 1, md: 1 }}
        >
          <Text>{selectedAgency?.name || "All "} Employee Payroll</Text>
          <CountUpComponent key={totalRecords} targetNumber={totalRecords} />
        </Flex>

        <HStack
          gap={{ base: 1, sm: 2 }}
          alignItems="center"
          flexWrap="wrap"
          justify={{ base: "center", md: "flex-end" }}
          w={{ base: "100%", md: "auto" }}
          order={{ base: 2, md: 2 }}
        >
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh Analytics"
            onClick={() => {}}
            isLoading={isFetching}
            isDisabled={isLoading}
            variant="outline"
            size="sm"
          />

          {isAgenciesAllowed && (
            <IconButton
              icon={<FiFilter />}
              onClick={agencyFilterOnOpen}
              aria-label="Filter agency"
              colorScheme="brand"
              variant="solid"
              size="sm"
              borderRadius="full"
              boxShadow="md"
            />
          )}

          <Box w={{ base: "100%", sm: "auto" }} flexShrink={1}>
            <SearchBar onSearchTermChange={handleSearchTermChange} />
          </Box>

          <Button
            colorScheme="brand"
            size="sm"
            borderRadius={"md"}
            py={3}
            px={6}
            onClick={() => setIsFilterOpen(true)}
          >
            Advanced Search
          </Button>

          <Box w={{ base: "100%", sm: "auto" }}>
            <DateFilter onFilterChange={onDateFilterChange} />
          </Box>

          {clearFilters && (
            <Button
              {...buttonStyle}
              variant="solid"
              bg="softGray.100"
              w="fit-content"
              color="gray.800"
              sx={{
                svg: {
                  fill: "gray.800",
                },
              }}
              _active={{ bg: "gray.200" }}
              leftIcon={<BiX />}
              aria-label="Clear"
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
        </HStack>
      </Flex>
      {/* <SummaryCards data={summary || {}} isLoading={summaryLoading} /> */}
      <ActiveFiltersDisplay
        filters={filters}
        onClearFilters={handleClearFilters}
        users={usersData}
      />

      {!isLoading && (
        <TopPagination
          currentPage={queryParams.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalRecords}
          itemsPerPage={queryParams.limit}
          refetching={isFetching}
          loading={isLoading}
          handlePageSize={handlePageSize}
          pageLimit={false}
        />
      )}

      <EmployeePayrollTable
        data={data || []}
        isLoading={isLoading || isFetching}
      />

      {agencyFilterIsOpen && (
        <AgencyFilterModal
          isOpen={agencyFilterIsOpen}
          onClose={agencyFilterOnClose}
          handleFilter={handleAgencyFilter}
          storeKey="payrollAgency"
        />
      )}

      <AdvancedSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
        clearFilter={filterChanged}
        usersData={usersData}
      />
    </Box>
  );
};

export default Payroll;
