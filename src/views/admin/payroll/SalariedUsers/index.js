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

import DateFilter from "views/admin/attendance/components/DateFilter";
import TopPagination from "components/pagination/TopPagination";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import RefreshButton from "components/refresh/RefreshButton";
import ViewToggle from "components/toggle/ViewToggle";

import AgencyFilter from "../components/AgencyFilter";
import AdvancedSearchModal from "../components/AdvancedSearchModal";
import ActiveFiltersDisplay from "../components/ActiveFiltersDisplay";
import SearchBox from "../components/SearchBox";
import EmployeePayrollTable from "./EmployeePayrollTable";
import EmployeePayrollCards from "./EmployeePayrollCards";

import { useFetchItemsQuery } from "api/apiSlice";
import { useEmployeePayroll } from "../hooks/usePayroll";
import { ViewWarningsModal } from "../components/ViewWarningsModal";
import { AddHistoryModal } from "../components/AddWarningHistoryModal";
import ExportPayrollReport from "../components/ExportPayroll";
import { useModalColors } from "hooks/useModalColors";
import FilterButton from "components/base/FilterButton";

const Payroll = () => {
  const colors = useModalColors();
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
    filters,
    setPagination,
    setFilters,
    refetch,
  } = useEmployeePayroll();
  const {
    isOpen: isAddHistoryModalOpen,
    onOpen: onAddHistoryModalOpen,
    onClose: onAddHistoryModalClose,
  } = useDisclosure();
  const {
    isOpen: isViewHistoryModalOpen,
    onOpen: onViewHistoryModalOpen,
    onClose: onViewHistoryModalClose,
  } = useDisclosure();
  const selectedAgency = useMemo(
    () => agencies.find((a) => a._id === agencyId) || null,
    [agencies, agencyId],
  );

  const [clearFilters, setClearFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [payRollData, setPayRollData] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState(() => {
    return localStorage.getItem("payrollView") || "table";
  });
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
      setPagination((prev) => ({ ...prev, page: 1 }));
    } else setClearFilters(false);
  };

  const handleClear = () => {
    setClearFilters(false);
    setAgencyId(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchTermChange = (searchQuery) => {
    const trimmed = searchQuery?.trim() || "";

    if (trimmed !== "") {
      setFilters((prev) => ({
        ...prev,
        search: trimmed,
      }));
      setClearFilters(true);
      setPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      setFilters((prev) => {
        const updated = { ...prev };
        delete updated.search;
        return updated;
      });
      setPagination((prev) => ({ ...prev, page: 1 }));
      setClearFilters(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null,
      ),
    );

    setFilters(cleanedFilters);
    setFilterChanged(true);
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = (filterKey) => {
    if (filterKey) {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      setFilters({});
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
    setFilterChanged(true);
    setSearchTerm("");
  };

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("payrollView", newView);
  };

  return (
    <Box p={6} bg={colors.bg} borderRadius="lg" boxShadow={colors.cardShadow} border="1px solid" borderColor={colors.borderColor}>
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
          <Text color={colors.headingText}>{selectedAgency?.name || "All "} Employee Payroll</Text>
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
          <Box w={{ base: "100%", sm: "auto" }} flexShrink={1}>
            <SearchBox
              onSearchTermChange={handleSearchTermChange}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
            />
          </Box>

          <Button
            variant="outline"
            size="sm"
            borderRadius={"md"}
            py={3}
            px={6}
            onClick={() => setIsFilterOpen(true)}
          >
            Advanced Search
          </Button>
          <ExportPayrollReport type={1} />
          {isAgenciesAllowed && (
         <FilterButton
	label="Filter agency"
	onClick={agencyFilterOnOpen}
	size="sm"
/>
          )}

          <Box
            w={{ base: "100%", sm: "auto" }}
            display="flex"
            justifyContent={{ base: "center", md: "flex-end" }}
          >
            <DateFilter onFilterChange={onDateFilterChange} />
          </Box>
          <RefreshButton
            aria-label="Refresh payroll"
            isLoading={isLoading}
            isFetching={isFetching}
            onClick={refetch}
          />
          <ViewToggle
            moduleView="payrollView"
            view={view}
            handleView={handleViewChange}
          />
        </HStack>
      </Flex>

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

      {view !== "grid" ? (
        <EmployeePayrollTable
          setPayRollData={setPayRollData}
          onViewHistoryModalOpen={onViewHistoryModalOpen}
          onAddHistoryModalOpen={onAddHistoryModalOpen}
          data={data || []}
          isLoading={isLoading || isFetching}
          month={month}
          year={year}
          refetchPayslips={refetch}
        />
      ) : (
        <EmployeePayrollCards
          setPayRollData={setPayRollData}
          onViewHistoryModalOpen={onViewHistoryModalOpen}
          onAddHistoryModalOpen={onAddHistoryModalOpen}
          data={data || []}
          isLoading={isLoading || isFetching}
          month={month}
          year={year}
          refetchPayslips={refetch}
        />
      )}

      {agencyFilterIsOpen && (
        <AgencyFilter
          isOpen={agencyFilterIsOpen}
          onClose={agencyFilterOnClose}
          handleFilter={handleAgencyFilter}
          storeKey="payrollAgency"
        />
      )}

      {isFilterOpen && (
        <AdvancedSearchModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
          clearFilter={filterChanged}
          usersData={usersData}
        />
      )}

      <ViewWarningsModal
        isOpen={isViewHistoryModalOpen}
        onClose={onViewHistoryModalClose}
        employeeId={payRollData?._id}
        data={payRollData}
        month={month}
        year={year}
      />

      <AddHistoryModal
        employeeId={payRollData?._id}
        month={month}
        year={year}
        isOpen={isAddHistoryModalOpen}
        onClose={onAddHistoryModalClose}
      />
    </Box>
  );
};

export default Payroll;