
import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  IconButton,
  Avatar,
  Badge,
  Button,
  useBreakpointValue,
  HStack,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiSearch,  FiTrendingUp, FiCheckCircle, FiClock, FiAward } from "react-icons/fi";
import { useFetchItemsQuery } from "api/apiSlice";
import TopPagination from "components/pagination/TopPagination";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import ActiveFiltersDisplay from "./Component/FilterComponent/ActiveFiltersDisplay";
import AdvancedSearchModal from "./Component/FilterComponent/AdvancedSearchModal";
import LeaderBoardLoader from "./Loader/LeaderBoardLoader";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AppButton from "components/shared/AppButton";
import RefreshButton from "components/refresh/RefreshButton";

const LeaderBoard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);
  const { data: agencies } = useFetchItemsQuery({ path: "/agencies" });
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const columns = [
    "SR.No",
    "Name",
    "Survey taken",
    "Score %",
    "Rank",
    "Role",
    "Agency",
  ];

  // Build query params with filters
  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };

    if (Object.keys(filters).length > 0) {
      if (filters.name) params.name = filters.name;
      if (filters.role) params.role = filters.role;
      if (filters.agency) params.agency = filters.agency;
      if (filters.to) params.to = filters.to;
      if (filters.from) params.from = filters.from;
    }

    return params;
  };

  // Fetch leaderboard data
  const {
    data: leaderboardData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchItemsQuery(
    { path: "/surveys/leaderboard", params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );

  // Fetch stats data
  const { data: leaderBoardStats } = useFetchItemsQuery(
    { path: "/surveys/leaderboard/stats" },
    { refetchOnMountOrArgChange: true }
  );

  // Format survey taken count as "completed/invited"
  const formatSurveyTaken = (completed, invited) => {
    return `${completed}/${invited}`;
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    setFilters(cleanedFilters);
    setCurrentPage(1);
    setFilterChanged(true);
    refetch();
  };

  const handleClearFilters = (filterKey) => {
    if (filterKey) {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
    } else {
      setFilters({});
    }
    setCurrentPage(1);
    setFilterChanged(true);
    refetch();
  };

  // Stat card configurations
  const statCards = [
    {
      label: "Survey Created",
      value: leaderBoardStats?.doc?.createdSurveys || 0,
      icon: FiTrendingUp,
      iconBg: "rgba(66, 153, 225, 0.1)",
      iconColor: "#4299E1",
      borderColor: "#4299E1",
    },
    {
      label: "Assigned",
      value: leaderBoardStats?.doc?.assignedSurveys || 0,
      icon: FiClock,
      iconBg: "rgba(212, 175, 55, 0.1)",
      iconColor: "#D4AF37",
      borderColor: "#D4AF37",
    },
    {
      label: "Survey Filled",
      value: leaderBoardStats?.doc?.filledSurveys || 0,
      icon: FiCheckCircle,
      iconBg: "rgba(72, 187, 120, 0.1)",
      iconColor: "#48BB78",
      borderColor: "#48BB78",
    },
    {
      label: "Live Surveys",
      value: leaderBoardStats?.doc?.activeSurveys || 0,
      icon: FiAward,
      iconBg: "rgba(237, 137, 54, 0.1)",
      iconColor: "#ED8936",
      borderColor: "#ED8936",
    },
  ];

  // Use custom loader when loading
  if (isLoading) {
    return <LeaderBoardLoader />;
  }

  return (
    <Box p={{ base: 2, md: 4 }} bg="bg.app" minH="100vh">
      {/* Back Button */}
      <AppButton
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
        size="sm"
        variant="ghost"
      >
        Back
      </AppButton>

      {/* Header */}
      <Box mb={6}>
        <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} color="text.heading">
          Leader Board
        </Text>
        <Text fontSize="sm" color="text.muted" mt={1}>
          Track survey performance and user rankings
        </Text>
      </Box>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} mb={6}>
        {statCards.map((card, index) => (
          <Box
            key={index}
            bg="bg.surface"
            p={4}
            borderRadius="xl"
            border="1px solid"
            borderColor="border.default"
            boxShadow="card"
            transition="all 0.2s ease"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "goldGlow",
              borderColor: card.borderColor,
            }}
            position="relative"
            overflow="hidden"
          >
            {/* Colored top border */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              h="3px"
              bg={card.borderColor}
            />

            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="xs" color="text.muted" fontWeight="500" textTransform="uppercase" letterSpacing="0.08em">
                  {card.label}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="text.heading" mt={1}>
                  {card.value}
                </Text>
              </Box>
              <Flex
                align="center"
                justify="center"
                w="48px"
                h="48px"
                bg={card.iconBg}
                borderRadius="lg"
              >
                <Icon as={card.icon} boxSize={5} color={card.iconColor} />
              </Flex>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {/* Actions Row */}
      <Flex
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-end", md: "center" }}
        justifyContent="flex-end"
        gap={3}
        mb={4}
      >
        <RefreshButton
        label="Refresh"
        onClick={refetch}
        isLoading={isLoading}
        isFetching={isFetching}
        size="sm"
      />
        {isMobile ? (
          <IconButton
            icon={<FiSearch />}
            onClick={() => setIsFilterOpen(true)}
            aria-label="Search"
            variant="brand"
            size="sm"
            borderRadius="full"
          />
        ) : (
          <Button
            variant="outline"
            size="sm"
            borderRadius="lg"
            borderColor="border.default"
            color="text.body"
            onClick={() => setIsFilterOpen(true)}
            _hover={{ bg: "bg.elevated", borderColor: "gold.primary", color: "gold.primary" }}
          >
            Advanced Search
          </Button>
        )}
      </Flex>

      {/* Pagination */}
      <Box mt={2}>
        <TopPagination
          currentPage={currentPage}
          totalPages={leaderboardData?.totalPages || 0}
          onPageChange={setCurrentPage}
          totalItems={leaderboardData?.totalDocs || 0}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>

      {/* Active Filters Display */}
      <Box my={4}>
        <ActiveFiltersDisplay
          filters={filters}
          onClearFilters={handleClearFilters}
          agencies={agencies?.doc || []}
        />
      </Box>

      {/* Leaderboard Table */}
      <Box
        borderRadius="xl"
        boxShadow="card"
        bg="bg.surface"
        overflowY="auto"
        maxH="85vh"
        border="1px solid"
        borderColor="border.default"
      >
        <Table variant="simple" size="md">
          <Thead position="sticky" top={0} bg="bg.elevated" zIndex={2}>
            <Tr>
              {columns.map((header, index) => (
                <Th
                  key={index}
                  py={4}
                  px={3}
                  textAlign="center"
                  color="gold.primary"
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  whiteSpace="nowrap"
                >
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>

          {isLoading || isFetching ? (
            <TableLoading columns={columns} length={20} py={4} />
          ) : (
            <Tbody>
              {leaderboardData?.doc?.leaderboard?.length > 0 ? (
                leaderboardData.doc.leaderboard.map((item, index) => {
                  const getScoreColor = () => {
                    if (item.rank === 1) return "#E53E3E";
                    if (item.avgScore > 90) return "#48BB78";
                    if (item.avgScore > 0) return "#ED8936";
                    return "text.muted";
                  };

                  const getRankColor = () => {
                    if (item.rank === 1) return "red";
                    if (item.rank === 2) return "cyan";
                    if (item.rank === 3) return "green";
                    return "gray";
                  };

                  return (
                    <Tr
                      key={item._id}
                      _hover={{ bg: "bg.elevated" }}
                      transition="background 0.15s"
                    >
                      <Td
                        py={3}
                        px={2}
                        fontSize="14px"
                        fontWeight="500"
                        minWidth="60px"
                        textAlign="center"
                        color="text.muted"
                      >
                        {index + 1}
                      </Td>
                      <Td textAlign="left" px={2}>
                        <Flex align="center" justify="flex-start" gap={2}>
                          <Avatar
                            size="sm"
                            src={item.profileImage}
                            name={item.fullName}
                          // bg="navy.600"
                          />
                          <Box textAlign="left">
                            <Text fontSize="sm" fontWeight="semibold" color="text.heading">
                              {item.fullName}
                            </Text>
                            <Text fontSize="xs" color="text.muted">
                              {item.username}
                            </Text>
                          </Box>
                        </Flex>
                      </Td>
                      <Td textAlign="center" fontSize={{ base: 'sm', md: 'md' }} color="text.body" px={2}>
                        {formatSurveyTaken(item.completedSurveyCount, item.invitedSurveyCount)}
                      </Td>
                      <Td textAlign="center" px={2}>
                        {item.avgScore ? (
                          <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" color={getScoreColor()}>
                            {item.avgScore}%
                          </Text>
                        ) : (
                          <Text fontSize={{ base: 'xs', md: 'md' }} color="text.muted">N/A</Text>
                        )}
                      </Td>
                      <Td textAlign="center" px={2}>
                        {item?.totalScore > 0 ? (
                          <Badge
                            variant={'stuble'}
                            bg={getRankColor() === "gold" ? "rgba(212, 175, 55, 0.1)" : undefined}
                            color={
                              getRankColor() === "red" ? "#E53E3E" :
                                getRankColor() === "cyan" ? "#00B5D8" :
                                  getRankColor() === "green" ? "#48BB78" : "gold.primary"
                            }
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize={{ base: 'sm', md: 'md' }}
                            fontWeight="bold"
                          >
                            #{item.rank}
                          </Badge>
                        ) : (
                          <Text fontSize={{ base: 'sm', md: 'md' }} color="text.muted">N/A</Text>
                        )}
                      </Td>
                      <Td textAlign="center" fontSize={{ base: 'sm', md: 'md' }} color="text.body" px={2}>
                        {item.role || "—"}
                      </Td>
                      <Td textAlign="center" fontSize={{ base: 'sm', md: 'md' }} color="text.body" px={2}>
                        {item.agency || "—"}
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={columns.length} py={12} textAlign="center">
                    <NoData label="leaderboard" />
                  </Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </Box>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
        clearFilter={filterChanged}
        agencies={agencies?.doc || []}
      />
    </Box>
  );
};

export default LeaderBoard;