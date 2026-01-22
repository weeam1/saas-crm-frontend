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
import { useFetchItemsQuery } from "api/apiSlice";
import { CallFeedbackCard } from "./components/FeedBackCard";
import { CallFeedbackSummary } from "./components/FeedBackOverview";
import CallFeedbackDetailModal from "./components/CallFeedbackDetailModal";
import CallFeedbackHeader from "./components/FeedBackHeader";

const CallFeedback = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  // Filters
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Modal state
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: callFeedbackData,
    isLoading,
    pagination,
    setPagination,
    totalPages,
    totalRecords,
    handlePageChange,
    filters,
    setFilters,
  } = useFetchCallFeedback();

  // Fetch all data for summary stats
  const { data: allData } = useFetchItemsQuery(
    {
      path: "/sipSetting/feedback",
      params: { search: appliedSearch, fromDate, toDate, limit: 10000 },
    }, // large limit to get all
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Handle search on Enter key press
  const handleSearch = useCallback(() => {
    setAppliedSearch(search);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [search, setPagination]);

  // Handle clear all filters
  const handleClear = useCallback(() => {
    setSearch("");
    setAppliedSearch("");
    setFromDate("");
    setToDate("");
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
    setFilters({
      search: appliedSearch,
      fromDate,
      toDate,
    });
  }, [appliedSearch, fromDate, toDate, setFilters]);

  // Reset page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [appliedSearch, fromDate, toDate, setPagination]);

  return (
    <Box bg={bgColor} p={2}>
      <Box mx="auto">
        <VStack spacing={4} align="stretch">
          {isLoading ? (
            <Center py={16}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : (
            <>
              {" "}
              <CallFeedbackSummary data={allData?.doc || []} />
              <CallFeedbackHeader
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                onClear={handleClear}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                page={pagination.page}
                setPage={handlePageChange}
                totalPages={totalPages}
              />
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
