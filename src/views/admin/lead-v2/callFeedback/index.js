import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Text,
  Icon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiPhone } from "react-icons/fi";
import { useFetchCallFeedback } from "./hooks/useFetchCallFeedback";
import { CallFeedbackCard } from "./components/FeedBackCard";
import { CallFeedbackSummary } from "./components/FeedBackOverview";
import CallFeedbackDetailModal from "./components/CallFeedbackDetailModal";
import { CallFeedbackHeader } from "./components/FeedBackHeader";
import { CallFeedbackSkeleton } from "./components/skeleton";
import TopPagination from "components/pagination/TopPagination";
import dayjs from "dayjs";

const CallFeedback = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Filters
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());

  // Modal state
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: callFeedbackData,
    isLoading,
    isFetching,
    pagination,
    setPagination,
    totalPages,
    totalRecords,
    handlePageChange,
    handlePageSize,
    filters,
    setFilters,
    queryParams,
    // Add this if your hook can provide total data
    // allData: allCallFeedbackData
  } = useFetchCallFeedback();

  // Handle search on Enter key press
  const handleSearch = useCallback((term) => {
    setAppliedSearch(term); // use term from SearchBarV2
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Handle clear all filters
  const handleClear = useCallback(() => {
    setSearch("");
    setAppliedSearch("");
    setFromDate("");
    setToDate("");
    setMonth(dayjs().month());
    setYear(dayjs().year());
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [setPagination]);

  // Modal handlers
  const handleViewDetails = useCallback((feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  }, []);

  // Update filters in hook when local filters change
  useEffect(() => {
    const newFilters = {
      ...(appliedSearch && { search: appliedSearch }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      ...(month !== null && { month }),
      ...(year !== null && { year }),
    };

    setFilters(newFilters);
  }, [appliedSearch, fromDate, toDate, month, year, setFilters]);

  // Reset page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [appliedSearch, fromDate, toDate, month, year, setPagination]);

  // Show loading state
  return (
    <Box bg={bgColor}>
      <Box>
        <VStack spacing={4} align="stretch">
          {isLoading ? (
            <CallFeedbackSkeleton />
          ) : (
            <>
              {/* REMOVED the second API call - use current page data for summary */}
              <CallFeedbackSummary
                month={month}
                year={year}
                data={callFeedbackData || []}
                totalRecords={totalRecords} // Pass total records for accurate totals
              />

              <CallFeedbackHeader
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                onClear={handleClear}
                setFromDate={setFromDate}
                setToDate={setToDate}
                setMonth={setMonth}
                setYear={setYear}
                // Pagination props
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalRecords}
                itemsPerPage={pagination.limit}
                refetching={isFetching}
                loading={isLoading}
                handlePageSize={handlePageSize}
              />

              <Box overflowY="auto" maxHeight="calc(80vh)" pr={2}>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
                  spacing={6}
                >
                  {callFeedbackData.map((feedback) => (
                    <CallFeedbackCard
                      key={feedback._id}
                      feedback={feedback}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            </>
          )}
        </VStack>
      </Box>

      {/* Detail Modal */}
      <CallFeedbackDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        feedback={selectedFeedback}
      />
    </Box>
  );
};

export default CallFeedback;
