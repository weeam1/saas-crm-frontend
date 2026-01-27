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
import { FiFilter } from "react-icons/fi";

import TopPagination from "components/pagination/TopPagination";
import DateFilter from "views/admin/attendance/components/DateFilter";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import AgencyFilterModal from "../components/AgencyFilterModal";
import UserEvaluationTable from "./UserEvalutionTable";
import { useUserEvalution } from "../hooks/useUserEvaluation";
import ViewEvaluation from "./components/ViewEvaluation";
import AdvancedSearchModal from "./components/AdvancedSearchModal";
import ActiveFiltersDisplay from "views/admin/payroll/components/ActiveFiltersDisplay";
import useUserSession from "hooks/useUserSession";
import SearchBox from "views/admin/payroll/components/SearchBox";
import { BsArrowRepeat } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import CustomTooltip from "components/shared/CustomTooltip";
import RefreshButton from "components/refresh/RefreshButton";
import ViewToggle from "components/toggle/ViewToggle";
import UserEvaluationCard from "./UserEvaluationCard";
import UserEvaluationCards from "./UserEvaluationCard";

const UserEvaluation = () => {
  const {
    month,
    year,
    refetchEvaluations,
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
    confirmDelete,
    handlePageChange,
    handlePageSize,
    onDateFilterChange,
    setPagination,
    filters,
    handleSearchChange,
    setFilters,
  } = useUserEvalution();

  const { userRoleName } = useUserSession();

  const selectedAgency = useMemo(
    () => agencies.find((a) => a._id === agencyId) || null,
    [agencies, agencyId],
  );

  const [clearFilters, setClearFilters] = useState(false);
  const [viewEvaluation, setViewEvaluation] = useState({
    modal: false,
    data: null,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    isOpen: agencyFilterIsOpen,
    onOpen: agencyFilterOnOpen,
    onClose: agencyFilterOnClose,
  } = useDisclosure();
  const [view, setView] = useState(() => {
    return localStorage.getItem("evalView") || "table";
  });
  const handleAgencyFilter = (value) => {
    setAgencyId(value);

    // if (value) {
    // 	setClearFilters(true);
    // } else setClearFilters(false);
  };

  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null,
      ),
    );

    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters(cleanedFilters);
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
    setClearFilters(false);
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
      // remove search key from filters
      setFilters((prev) => {
        const updated = { ...prev };
        delete updated.search;
        return updated;
      });
      setClearFilters(false);
    }
  };
  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("evalView", newView); // persist selection
  };
  return (
    // <Box p={6} bg="white" minH="80vh" borderRadius="md" boxShadow="sm">
    //   <Flex
    //     flexDir={{ base: "column", md: "row" }}
    //     justify="space-between"
    //     align="center"
    //     mb={4}
    //   >
    //     <Flex alignSelf="flex-start" fontSize="lg" fontWeight="bold" gap="2">
    //       <Text>{selectedAgency?.name} User Evaluations</Text>

    //       <CountUpComponent key={totalRecords} targetNumber={totalRecords} />
    //     </Flex>

    //     <HStack gap="2" alignItems="center">
    //       <RefreshButton
    //         aria-label="Refresh evaluations"
    //         isLoading={isLoading}
    //         isFetching={isFetching}
    //         onClick={refetchEvaluations}
    //       />

    //       <Box w={{ base: "100%", sm: "auto" }} flexShrink={1}>
    //         <SearchBox
    //           onSearchTermChange={handleSearchTermChange}
    //           setSearchTerm={setSearchTerm}
    //           searchTerm={searchTerm}
    //         />
    //       </Box>

    //       {isAgenciesAllowed && (
    //         <IconButton
    //           icon={<FiFilter />}
    //           onClick={agencyFilterOnOpen}
    //           aria-label="Filter agency"
    //           colorScheme="brand"
    //           variant="solid"
    //           size="sm"
    //           borderRadius="full"
    //           boxShadow="md"
    //         />
    //       )}

    //       <DateFilter onFilterChange={onDateFilterChange} />

    //       {!["Team Leader", "Agent"].includes(userRoleName) && (
    //         <Button
    //           colorScheme="brand"
    //           size="sm"
    //           borderRadius={"md"}
    //           py={4}
    //           px={6}
    //           onClick={() => setIsFilterOpen(true)}
    //         >
    //           Advanced Search
    //         </Button>
    //       )}
    //       <ViewToggle
    //         moduleView="evalView"
    //         view={view}
    //         handleView={handleViewChange}
    //       />
    //       {/* {clearFilters && (
    // 					<Button
    // 						{...buttonStyle}
    // 						variant='solid'
    // 						bg='softGray.100'
    // 						w='fit-content'
    // 						color='gray.800'
    // 						sx={{
    // 							svg: {
    // 								fill: 'gray.800',
    // 							},
    // 						}}
    // 						_active={{ bg: 'gray.200' }}
    // 						leftIcon={<BiX />}
    // 						aria-label='Clear'
    // 						onClick={handleClear}
    // 					>
    // 						Clear
    // 					</Button>
    // 				)} */}
    //     </HStack>
    //   </Flex>

    //   <ActiveFiltersDisplay
    //     filters={filters}
    //     onClearFilters={handleClearFilters}
    //   />

    //   {!isLoading && (
    //     <TopPagination
    //       currentPage={queryParams.page}
    //       totalPages={totalPages}
    //       onPageChange={handlePageChange}
    //       totalItems={totalRecords}
    //       itemsPerPage={queryParams.limit}
    //       refetching={isFetching}
    //       loading={isLoading}
    //       handlePageSize={handlePageSize}
    //     />
    //   )}

    //   {view !== "grid" ? (
    //     <UserEvaluationTable
    //       data={data || []}
    //       isLoading={isLoading || isFetching}
    //       setView={setViewEvaluation}
    //     />
    //   ) : (
    //     <UserEvaluationCards
    //       data={data || []}
    //       isLoading={isLoading || isFetching}
    //       setView={setViewEvaluation}
    //     />
    //   )}

    //   {viewEvaluation?.modal && (
    //     <ViewEvaluation
    //       isOpen={viewEvaluation?.modal}
    //       onClose={() => setViewEvaluation({ modal: false, data: null })}
    //       data={viewEvaluation?.data}
    //       selectedMonth={month}
    //       selectedYear={year}
    //     />
    //   )}

    //   {agencyFilterIsOpen && (
    //     <AgencyFilterModal
    //       isOpen={agencyFilterIsOpen}
    //       onClose={agencyFilterOnClose}
    //       handleFilter={handleAgencyFilter}
    //     />
    //   )}

    //   {isFilterOpen && (
    //     <AdvancedSearchModal
    //       isOpen={isFilterOpen}
    //       onClose={() => setIsFilterOpen(false)}
    //       onApplyFilters={handleApplyFilters}
    //       initialFilters={filters}
    //     />
    //   )}
    // </Box>
    <Box
      p={{ base: 4, md: 6 }}
      bg="white"
      minH="80vh"
      borderRadius="md"
      boxShadow="sm"
    >
      {/* Header */}
      {/* <Flex
        flexDir={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
        mb={4}
        gap={{ base: 3, md: 0 }}
      >

        <Flex
          align="center"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold"
          gap={2}
          flexWrap="wrap"
          justify={{ base: "center", md: "flex-start" }}
          w={{ base: "100%", md: "auto" }}
        >
          <Text textAlign={{ base: "center", md: "left" }}>
            {selectedAgency?.name} User Evaluations
          </Text>
          <CountUpComponent key={totalRecords} targetNumber={totalRecords} />
        </Flex>


        <HStack
          spacing={{ base: 2, md: 4 }}
          align="center"
          flexWrap="wrap"
          justify={{ base: "center", md: "flex-end" }} // center on mobile
          w={{ base: "100%", md: "auto" }}
          mt={{ base: 3, md: 0 }} // add spacing when stacked
        >
          <RefreshButton
            aria-label="Refresh evaluations"
            isLoading={isLoading}
            isFetching={isFetching}
            onClick={refetchEvaluations}
          />

          <Box w={{ base: "100%", sm: "auto" }} flexShrink={1}>
            <SearchBox
              onSearchTermChange={handleSearchTermChange}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
            />
          </Box>

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

          <DateFilter onFilterChange={onDateFilterChange} />

          {!["Team Leader", "Agent"].includes(userRoleName) && (
            <Button
              colorScheme="brand"
              size="sm"
              borderRadius="md"
              py={2}
              px={4}
              flexShrink={0}
              w={{ base: "100%", md: "auto" }}
              onClick={() => setIsFilterOpen(true)}
            >
              Advanced Search
            </Button>
          )}

          <ViewToggle
            moduleView="evalView"
            view={view}
            handleView={handleViewChange}
          />
        </HStack>
      </Flex> */}
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
        mb={4}
        gap={{ base: 3, md: 0 }}
      >
        {/* Title + Count + Refresh button on mobile */}
        <Flex
          align="center"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold"
          gap={2}
          flexWrap="wrap"
          justify={{ base: "center", md: "flex-start" }}
          w={{ base: "100%", md: "auto" }}
        >
          <Text textAlign={{ base: "center", md: "left" }}>
            {selectedAgency?.name} User Evaluations
          </Text>
          <CountUpComponent key={totalRecords} targetNumber={totalRecords} />

          {/* Show refresh button next to text only on mobile */}
          <Box display={{ base: "inline-block", md: "none" }}>
            <RefreshButton
              aria-label="Refresh evaluations"
              isLoading={isLoading}
              isFetching={isFetching}
              onClick={refetchEvaluations}
            />
          </Box>
        </Flex>

        {/* Actions */}
        <HStack
          spacing={{ base: 2, md: 4 }}
          align="center"
          flexWrap="wrap"
          justify={{ base: "center", md: "flex-end" }}
          w={{ base: "100%", md: "auto" }}
          mt={{ base: 1, md: 0 }}
          gap={2}
        >
          {/* Hide refresh button here on mobile */}
          <Box display={{ base: "none", md: "inline-block" }}>
            <RefreshButton
              aria-label="Refresh evaluations"
              isLoading={isLoading}
              isFetching={isFetching}
              onClick={refetchEvaluations}
            />
          </Box>

          <Box w={{ base: "100%", sm: "auto" }} flexShrink={1}>
            <SearchBox
              onSearchTermChange={(value) => {
                setSearchTerm(value);
                handleSearchChange(value); // Use hook's function
              }}
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
            />
          </Box>

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

          <DateFilter onFilterChange={onDateFilterChange} />

          {!["Team Leader", "Agent"].includes(userRoleName) && (
            <Button
              colorScheme="brand"
              size="sm"
              borderRadius="md"
              py={2}
              px={4}
              flexShrink={0}
              w={{ base: "100%", md: "auto" }}
              onClick={() => setIsFilterOpen(true)}
            >
              Advanced Search
            </Button>
          )}

          <ViewToggle
            moduleView="evalView"
            view={view}
            handleView={handleViewChange}
          />
        </HStack>
      </Flex>

      {/* Active Filters */}
      <ActiveFiltersDisplay
        filters={filters}
        onClearFilters={handleClearFilters}
      />

      {/* Pagination */}
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
        />
      )}

      {/* Main Content */}
      {view !== "grid" ? (
        <UserEvaluationTable
          confirmDelete={confirmDelete}
          data={data || []}
          isLoading={isLoading || isFetching}
          setView={setViewEvaluation}
          month={month}
          year={year}
        />
      ) : (
        <UserEvaluationCards
          confirmDelete={confirmDelete}
          data={data || []}
          isLoading={isLoading || isFetching}
          setView={setViewEvaluation}
          month={month}
          year={year}
        />
      )}

      {/* Modals */}
      {viewEvaluation?.modal && (
        <ViewEvaluation
          isOpen={viewEvaluation?.modal}
          onClose={() => setViewEvaluation({ modal: false, data: null })}
          data={viewEvaluation?.data}
          selectedMonth={month}
          selectedYear={year}
        />
      )}

      {agencyFilterIsOpen && (
        <AgencyFilterModal
          isOpen={agencyFilterIsOpen}
          onClose={agencyFilterOnClose}
          handleFilter={handleAgencyFilter}
        />
      )}

      {isFilterOpen && (
        <AdvancedSearchModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={filters}
        />
      )}
    </Box>
  );
};

export default UserEvaluation;
