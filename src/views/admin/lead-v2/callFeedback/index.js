import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  VStack,
  SimpleGrid,
  Text,
  Icon,
  Td,
  Badge,
  Tbody,
  Table,
  Thead,
  Th,
  Tr,
  Skeleton,
  IconButton,
  TableContainer,
} from "@chakra-ui/react";
import { FiEye } from "react-icons/fi";
import { useFetchCallFeedback } from "./hooks/useFetchCallFeedback";
import { CallFeedbackCard } from "./components/FeedBackCard";
import { CallFeedbackSummary } from "./components/FeedBackOverview";
import CallFeedbackDetailModal from "./components/CallFeedbackDetailModal";
import { CallFeedbackHeader } from "./components/FeedBackHeader";
import {
  CallFeedbackCardSkeleton,
  CallFeedbackSummarySkeleton,
} from "./components/skeleton";
import TopPagination from "components/pagination/TopPagination";
import dayjs from "dayjs";
import NoData from "components/Message/NoData";
import SearchTags from "components/shared/SearchTags";
import { useModalColors } from "hooks/useModalColors";

const CallFeedback = () => {
  const colors = useModalColors();
  // Filters
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [searchTags, setSearchTags] = useState([]);

  // Advanced filters - all as text fields
  const [advancedFilters, setAdvancedFilters] = useState({
    leadName: "",
    leadIntId: "",
    callMedium: "",
    callQuality: "",
    reason: "",
    extension: "",
  });

  // Modal state
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: callFeedbackData,
    isLoading,
    isFetching,
    stats,
    setStats,
    pagination,
    setPagination,
    totalPages,
    totalRecords,
    handlePageChange,
    handlePageSize,
    month,
    setMonth,
    filters,
    setFilters,
    refetch,
    queryParams,
  } = useFetchCallFeedback();

  const [view, setView] = useState(() => {
    return localStorage.getItem("callFeedbackView") || "grid";
  });

  const handleViewChange = useCallback((newView) => {
    setView(newView);
    localStorage.setItem("callFeedbackView", newView);
  }, []);

  const columns = [
    "Lead ID",
    "Lead Name",
    "Call Medium",
    "Call Quality",
    "Reason",
    "Extension",
    "Created At",
    "Action",
  ];

  const getQualityColor = (quality) => {
    switch (quality?.toLowerCase()) {
      case "good":
        return "green";
      case "average":
        return "yellow";
      case "bad":
        return "red";
      default:
        return "gray";
    }
  };

  const handleSearch = useCallback(
    (term) => {
      setAppliedSearch(term);
      setSearch(term);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [setPagination],
  );

  const handleAdvancedSearch = useCallback(
    (filters) => {
      setAdvancedFilters(filters);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [setPagination],
  );

  const removeTag = useCallback(
    (key) => {
      const removedTag = searchTags.find((tag) => tag.key === key);
      if (!removedTag) return;

      const updatedTags = searchTags.filter((tag) => tag.key !== key);
      setSearchTags(updatedTags);

      const updatedFilters = updatedTags.reduce((acc, tag) => {
        acc[tag.originalKey] = tag.originalValue;
        return acc;
      }, {});

      setAdvancedFilters(updatedFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    [searchTags, setPagination],
  );

  const clearAllTags = useCallback(() => {
    setSearchTags([]);
    setAdvancedFilters({
      leadName: "",
      leadIntId: "",
      callMedium: "",
      callQuality: "",
      reason: "",
      extension: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [setPagination]);

  const clearSearch = useCallback(() => {
    setSearch("");
    setAppliedSearch("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [setPagination]);

  const handleClearAll = useCallback(() => {
    setSearch("");
    setAppliedSearch("");
    setSearchTags([]);
    setAdvancedFilters({
      leadName: "",
      leadIntId: "",
      callMedium: "",
      callQuality: "",
      reason: "",
      extension: "",
    });
    setMonth(dayjs().format("YYYY-MM"));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [setPagination, setMonth]);

  useEffect(() => {
    const newFilters = {
      ...(appliedSearch && { q: appliedSearch }),
      ...advancedFilters,
    };

    const cleanedFilters = Object.keys(newFilters).reduce((acc, key) => {
      if (newFilters[key] && newFilters[key].trim() !== "") {
        acc[key] = newFilters[key].trim();
      }
      return acc;
    }, {});

    setFilters(cleanedFilters);
  }, [appliedSearch, advancedFilters, setFilters]);

  useEffect(() => {
    const tags = Object.entries(advancedFilters)
      .filter(([_, value]) => value && value.trim() !== "")
      .map(([key, value]) => ({
        key: key.charAt(0).toUpperCase() + key.slice(1),
        value: value,
        originalKey: key,
        originalValue: value,
      }));

    setSearchTags(tags);
  }, [advancedFilters]);

  const handleViewDetails = useCallback((feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  }, []);

  return (
    <Box bg={colors.bgDeep} p={4} rounded="lg" shadow="md" minH="100vh">
      <Box>
        <VStack spacing={4} align="stretch">
          <>
            {/* Summary */}
            {isLoading || isFetching ? (
              <CallFeedbackSummarySkeleton />
            ) : (
              <CallFeedbackSummary
                month={month}
                year={dayjs(month).year()}
                data={stats || []}
                totalRecords={totalRecords}
              />
            )}
            {/* Header with Filters */}
            <CallFeedbackHeader
              onSearch={handleSearch}
              onAdvancedSearch={handleAdvancedSearch}
              onClear={clearSearch}
              onClearAll={handleClearAll}
              month={month}
              setMonth={setMonth}
              advancedFilters={advancedFilters}
              filters={filters}
              setFilters={setFilters}
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalRecords}
              itemsPerPage={pagination.limit}
              refetching={isFetching}
              loading={isLoading}
              handlePageSize={handlePageSize}
              refetch={refetch}
              removeTag={removeTag}
              searchTags={searchTags}
              clearAllTags={clearAllTags}
              search={search}
              view={view}
              handleViewChange={handleViewChange}
            />

            {isLoading || isFetching ? (
              view === "grid" ? (
                <CallFeedbackCardSkeleton />
              ) : (
                // Table loading skeleton
                <TableContainer
                  border="1px solid"
                  borderColor={colors.borderColor}
                  borderRadius="lg"
                >
                  <Table variant="simple" size="md">
                    <Thead bg={colors.bg} position="sticky" top={0} zIndex={1}>
                      <Tr>
                        {columns.map((header, index) => (
                          <Th
                            key={index}
                            textAlign="center"
                            whiteSpace="nowrap"
                            color={colors.headingText}
                            borderBottom={`2px solid ${colors.borderColor}`}
                            py={3}
                          >
                            {header}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Tr key={index}>
                          {columns.map((_, colIndex) => (
                            <Td key={colIndex} py={3}>
                              <Skeleton
                                height="20px"
                                borderRadius="4px"
                                bg={colors.bg}
                              />
                            </Td>
                          ))}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )
            ) : (
              <>
                {callFeedbackData.length === 0 ? (
                  <NoData label="Feedback" />
                ) : view === "grid" ? (
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
                    spacing={6}
                  >
                    {callFeedbackData?.map((feedback) => (
                      <CallFeedbackCard
                        key={feedback._id}
                        feedback={feedback}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <TableContainer
                    border="1px solid"
                    borderColor={colors.
                    borderColor}
                    borderRadius="lg"

                  maxHeight="70vh"
      minH="70vh"
                  >
                    <Table variant="simple" size="md">
                      <Thead  position="sticky" top={0} zIndex={1}>
                        <Tr bg={colors.bgDeep}>
                          {columns.map((header, index) => (
                            <Th
                              key={index}
                              textAlign="center"
                              whiteSpace="nowrap"
                              color={colors.headingText}
                              borderBottom={`2px solid ${colors.borderColor}`}
                              py={3}
                            >
                              {header}
                            </Th>
                          ))}
                        </Tr>
                      </Thead>
                      <Tbody>
                        {callFeedbackData.map((feedback) => (
                          <Tr
                          bg={colors.bg}
                            key={feedback._id}
                            borderBottom={`1px solid ${colors.borderColor}`}
                            _hover={{ bg: colors.bg }}
                          >
                            <Td
                              textAlign="center"
                              cursor="pointer"
                              color={colors.bodyText}
                              py={3}
                              _hover={{ textDecoration: "underline", color: colors.accentGold }}
                              onClick={() => handleViewDetails(feedback)}
                            >
                              {feedback.lead?.intID || "N/A"}
                            </Td>
                            <Td textAlign="center" color={colors.bodyText} py={3}>
                              {feedback.lead?.leadName || "N/A"}
                            </Td>
                            <Td textAlign="center" py={3}>
                              <Badge
                                bg={`rgba(212, 175, 55, 0.15)`}
                                color={colors.accentGold}
                                px={2}
                                py={1}
                                borderRadius="full"
                              >
                                {feedback.callMedium || "N/A"}
                              </Badge>
                            </Td>
                            <Td textAlign="center" py={3}>
                              <Badge
                                colorScheme={getQualityColor(feedback.callQuality)}
                              >
                                {feedback.callQuality || "N/A"}
                              </Badge>
                            </Td>
                            <Td textAlign="center" color={colors.bodyText} py={3}>
                              {feedback.reason || "N/A"}
                            </Td>
                            <Td textAlign="center" color={colors.bodyText} py={3}>
                              {feedback.userExtensionId || "N/A"}
                            </Td>
                            <Td textAlign="center" color={colors.bodyText} whiteSpace="nowrap" py={3}>
                              {feedback.createdAt ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A") : "N/A"}
                            </Td>
                            <Td textAlign="center" py={3}>
                              <IconButton
                                aria-label="View Details"
                                icon={<FiEye />}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDetails(feedback)}
                                color={colors.accentGold}
                                _hover={{
                                  bg: `rgba(212, 175, 55, 0.1)`,
                                  color: colors.goldLight,
                                  transform: "scale(1.1)",
                                }}
                                transition="all 0.2s ease"
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}
              </>
            )}
          </>
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