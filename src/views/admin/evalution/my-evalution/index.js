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
import CountUpComponent from "components/countUpComponent/countUpComponent";
import AgencyFilterModal from "../components/AgencyFilterModal";
import UserEvaluationTable from "./UserEvalutionTable";
import { useUserEvalution } from "../hooks/useUserEvaluation";
import ViewEvaluation from "./components/ViewEvaluation";
import AdvancedSearchModal from "./components/AdvancedSearchModal";
import ActiveFiltersDisplay from "views/admin/payroll/components/ActiveFiltersDisplay";
import useUserSession from "hooks/useUserSession";
import SearchBox from "views/admin/payroll/components/SearchBox";
import RefreshButton from "components/refresh/RefreshButton";
import ViewToggle from "components/toggle/ViewToggle";
import UserEvaluationCards from "./UserEvaluationCard";

const MyEvaluation = () => {
  const {
    month,
    year,
    myEvaluations,
    myEvaluationsLoading,
    myEvaluationsFetching,
    myPagination,
    setMyPagination,
    handleMyPageChange,
    handleMyPageSize,
    handleMySearchChange,
    refetchMyEvaluations,
    confirmDelete,
    myFilters,
    setMyFilters,
  } = useUserEvalution();

  const { user } = useUserSession();

  const [viewEvaluation, setViewEvaluation] = useState({
    modal: false,
    data: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState(
    () => localStorage.getItem("evalView") || "table",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("evalView", newView);
  };

  const handleClearFilters = (filterKey) => {
    if (filterKey) {
      const newFilters = { ...myFilters };
      delete newFilters[filterKey];
      setMyFilters(newFilters);
      setMyPagination((prev) => ({ ...prev, page: 1 }));

      // Clear searchTerm when "search" filter is cleared
      if (filterKey === "search") {
        setSearchTerm("");
      }
    } else {
      // Clear all filters
      setMyFilters({});
      setMyPagination((prev) => ({ ...prev, page: 1 }));

      // Clear search term
      setSearchTerm("");
    }
  };

  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null,
      ),
    );
    setMyFilters(cleanedFilters);
    setMyPagination((prev) => ({ ...prev, page: 1 }));
  };
  // Add this function inside the component, before return
  const handleMySearchTermChange = (searchQuery) => {
    const trimmed = searchQuery?.trim() || "";

    if (trimmed !== "") {
      setMyFilters((prev) => ({
        ...prev,
        search: trimmed,
      }));
      setMyPagination((prev) => ({ ...prev, page: 1 }));
    } else {
      // remove search key from filters
      setMyFilters((prev) => {
        const updated = { ...prev };
        delete updated.search;
        return updated;
      });
      setMyPagination((prev) => ({ ...prev, page: 1 }));
    }

    // Always update the searchTerm state
    setSearchTerm(searchQuery);
  };

  // Then update the SearchBox usage:

  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg="white"
      minH="80vh"
      borderRadius="md"
      boxShadow="sm"
    >
      {/* Header */}
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
        mb={4}
        gap={{ base: 3, md: 0 }}
      >
        {/* Title + Count */}
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
            {user?.firstName} Evaluations
          </Text>
          <CountUpComponent
            key={myEvaluations?.total}
            targetNumber={myEvaluations?.total}
          />
          {/* Refresh button for mobile */}
          <Box display={{ base: "inline-block", md: "none" }}>
            <RefreshButton
              aria-label="Refresh evaluations"
              myEvaluationsLoading={myEvaluationsLoading}
              myEvaluationsFetching={myEvaluationsFetching}
              onClick={refetchMyEvaluations}
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
          {/* Refresh button desktop */}
          <Box display={{ base: "none", md: "inline-block" }}>
            <RefreshButton
              aria-label="Refresh evaluations"
              myEvaluationsLoading={myEvaluationsLoading}
              myEvaluationsFetching={myEvaluationsFetching}
              onClick={refetchMyEvaluations}
            />
          </Box>

          {/* Search */}
          <Box w={{ base: "100%", sm: "auto" }} flexShrink={1}>
            <SearchBox
              onSearchTermChange={(value) => {
                setSearchTerm(value);
                handleMySearchTermChange(value); // Use the new handler
              }}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Box>

          <ViewToggle
            moduleView="evalView"
            view={view}
            handleView={handleViewChange}
          />
        </HStack>
      </Flex>

      {/* Active Filters */}
      <ActiveFiltersDisplay
        filters={myFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Pagination */}
      {!myEvaluationsLoading && (
        <TopPagination
          currentPage={myPagination.page}
          totalPages={myEvaluations?.totalPages || 0}
          onPageChange={handleMyPageChange}
          totalItems={myEvaluations?.total || 0}
          itemsPerPage={myPagination.limit}
          refetching={myEvaluationsFetching}
          loading={myEvaluationsLoading}
          handlePageSize={handleMyPageSize}
        />
      )}

      {/* Main Content */}
      {view !== "grid" ? (
        <UserEvaluationTable
          confirmDelete={confirmDelete}
          data={myEvaluations?.doc || []}
          isLoading={myEvaluationsLoading || myEvaluationsFetching}
          setView={setViewEvaluation}
          month={month}
          year={year}
        />
      ) : (
        <UserEvaluationCards
          confirmDelete={confirmDelete}
          data={myEvaluations?.doc || []}
          isLoading={myEvaluationsLoading || myEvaluationsFetching}
          setView={setViewEvaluation}
          month={month}
          year={year}
        />
      )}

      {/* View Evaluation Modal */}
      {viewEvaluation?.modal && (
        <ViewEvaluation
          isOpen={viewEvaluation.modal}
          onClose={() => setViewEvaluation({ modal: false, data: null })}
          data={viewEvaluation.data}
          selectedMonth={month}
          selectedYear={year}
        />
      )}

      {/* Advanced Search Modal */}
      {isFilterOpen && (
        <AdvancedSearchModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={myFilters}
        />
      )}
    </Box>
  );
};

export default MyEvaluation;
