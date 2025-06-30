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
} from "@chakra-ui/react";
import LeaderBoardHeaderIcon from "../../../assets/img/survey/LeaderBoardHeaderIcon.png";
import Assigned_Survey from "../../../assets/img/survey/Assigned_Survey.png";
import Inbox_survey from "../../../assets/img/survey/Inbox_survey.png";
import Survey_Live from "../../../assets/img/survey/Survey_Live.png";
import Survey_filled from "../../../assets/img/survey/Survey_filled.png";
import { FiSearch } from "react-icons/fi";
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
import Breadcrumb from "../../../components/shared/BreadCrumb";

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

  // Use custom loader when loading
  if (isLoading) {
    return <LeaderBoardLoader />;
  }

  const items = [
    {
      path: "/survey",
      label: "Surveys",
    },
    {
      path: "/survey/survey-leader-board",
      label: "Leader Board",
    },
  ];
  return (
    <Box p={{ base: 2, md: 4 }}>
      <Breadcrumb items={items} />

      {/* Back Button */}
      <AppButton
        ml="2"
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
      >
        Back
      </AppButton>
      {/* Header */}
      <Box mb={6} display="flex" alignItems="flex-end" gap={2}>
        <img
          src={LeaderBoardHeaderIcon}
          alt="icon"
          style={{ width: "4.5rem", height: "4.5rem" }}
        />
        <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl", lg: "2xl" }}>
          Leader Board
        </Text>
      </Box>

      {/* Report Count Statistics */}
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={4}
        flexWrap="wrap"
      >
        {/* Survey Created */}
        <Box
          flex="1"
          minW={{ base: "100%", md: "150px", lg: "200px" }}
          bg="white"
          p={{ base: 2, md: 3, lg: 4 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={{ base: "10px", md: "20px" }}
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Box
              bg="#F4F7FE"
              borderRadius="full"
              py={{ base: "5px", md: "13px", lg: "15px" }}
              px={{ base: "5px", md: "13px", lg: "15px" }}
            >
              <img
                src={Inbox_survey}
                alt="icon"
                width="28"
                height="28"
                style={{ width: "2.75rem", height: "2.75rem" }}
              />
            </Box>
            <Box flex="1">
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={1}>
                Survey Created
              </Text>
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                {leaderBoardStats?.doc?.createdSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Assigned */}
        <Box
          flex="1"
          minW={{ base: "100%", md: "150px", lg: "200px" }}
          bg="white"
          p={{ base: 2, md: 3, lg: 4 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={{ base: "10px", md: "20px" }}
            alignItems="center"
            width="100%"
            height="100%"
          >
            <img
              src={Assigned_Survey}
              alt="icon"
              style={{ width: "4.5rem", height: "4.5rem" }}
            />
            <Box flex="1">
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={1}>
                Assigned
              </Text>
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                {leaderBoardStats?.doc?.assignedSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Survey Filled */}
        <Box
          flex="1"
          minW={{ base: "100%", md: "150px", lg: "200px" }}
          bg="white"
          p={{ base: 2, md: 3, lg: 4 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={{ base: "10px", md: "20px" }}
            alignItems="center"
            width="100%"
            height="100%"
          >
            <img
              src={Survey_filled}
              alt="icon"
              style={{ width: "4.5rem", height: "4.5rem" }}
            />
            <Box flex="1">
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={1}>
                Survey Filled
              </Text>
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                {leaderBoardStats?.doc?.filledSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Live Surveys */}
        <Box
          flex="1"
          minW={{ base: "100%", md: "150px", lg: "200px" }}
          bg="white"
          p={{ base: 2, md: 3, lg: 4 }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={{ base: "10px", md: "20px" }}
            alignItems="center"
            width="100%"
            height="100%"
          >
            <img
              src={Survey_Live}
              alt="icon"
              style={{ width: "4.5rem", height: "4.5rem" }}
            />
            <Box flex="1">
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={1}>
                Live Surveys
              </Text>
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                {leaderBoardStats?.doc?.activeSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>

      <Flex
        direction={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-end", md: "center" }}
        justifyContent="space-between"
        gap={3}
        mb={4}
        flexWrap="wrap"
      >
        <Box minW="250px">
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
        {isMobile ? (
          <IconButton
            icon={<FiSearch />}
            onClick={() => setIsFilterOpen(true)}
            aria-label="Search Listings"
            colorScheme="brand"
            variant="solid"
            size="sm"
            borderRadius="full"
            boxShadow="md"
          />
        ) : (
          <Button
            colorScheme="brand"
            size="md"
            borderRadius="full"
            py={3}
            px={6}
            onClick={() => setIsFilterOpen(true)}
          >
            Advanced Search
          </Button>
        )}
      </Flex>
      <Box marginY={5}>
        <ActiveFiltersDisplay
          filters={filters}
          onClearFilters={handleClearFilters}
          agencies={agencies?.doc || []}
        />
      </Box>

      {/* Leaderboard Table */}
      <Box
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        overflowY="auto"
        maxH={"85vh"}
      >
        <Table variant="striped" size="lg">
          <Thead position="sticky" top={0} bg="white" zIndex={2}>
            <Tr>
              {columns.map((header, index) => (
                <Th
                  key={index}
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  textAlign="center"
                >
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="600"
                    color="gray.700"
                    textTransform="capitalize"
                  >
                    {header}
                  </Text>
                </Th>
              ))}
            </Tr>
          </Thead>

          {isLoading || isFetching ? (
            <TableLoading columns={columns} length={7} py="2" />
          ) : (
            <Tbody>
              {leaderboardData?.doc?.leaderboard?.length > 0 ? (
                leaderboardData.doc.leaderboard.map((item, index) => (
                  <Tr key={item._id}>
                    <Td
                      py={2}
                      px={2}
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="400"
                      minWidth="40px"
                      textAlign={"center"}
                      whiteSpace="nowrap"
                    >
                      {index + 1}
                    </Td>
                    <Td
                      fontWeight="medium"
                      textAlign={"center"}
                      whiteSpace="nowrap"
                      px={2}
                    >
                      <Flex alignItems="center" gap={1}>
                        {item.profileImage ? (
                          <Avatar
                            size="sm"
                            src={item.profileImage}
                            name={item.fullName}
                          />
                        ) : (
                          <Avatar size="sm" name={item.fullName} />
                        )}
                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            whiteSpace="nowrap"
                          >
                            {item.fullName}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            whiteSpace="nowrap"
                          >
                            {item.email}
                          </Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td
                      textAlign="center"
                      fontSize={{ base: "sm", md: "md" }}
                      px={2}
                      whiteSpace="nowrap"
                    >
                      {formatSurveyTaken(
                        item.completedSurveyCount,
                        item.invitedSurveyCount
                      )}
                    </Td>
                    <Td
                      textAlign="center"
                      color={
                        item.rank === 1
                          ? "red"
                          : item.avgScore > 90
                            ? "green.500"
                            : item.avgScore > 0
                              ? "orange.500"
                              : "gray.500"
                      }
                      fontWeight="bold"
                      fontSize={{ base: "sm", md: "md" }}
                      px={2}
                      whiteSpace="nowrap"
                    >
                      {item.avgScore ? (
                        `${item.avgScore}%`
                      ) : (
                        <Text fontSize="xs" color="gray.500">
                          N/A
                        </Text>
                      )}
                    </Td>
                    <Td
                      textAlign="center"
                      fontWeight="bold"
                      px={2}
                      whiteSpace="nowrap"
                    >
                      {item?.totalScore > 0 ? (
                        <Badge
                          colorScheme={
                            item.rank === 1
                              ? "red"
                              : item.rank === 2
                                ? "cyan"
                                : item.rank === 3
                                  ? "green"
                                  : "gray"
                          }
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize={{ base: "sm", md: "md" }}
                        >
                          #{item.rank}
                        </Badge>
                      ) : (
                        <Text fontSize="xs" color="gray.500">
                          N/A
                        </Text>
                      )}
                    </Td>
                    <Td
                      textAlign="center"
                      fontSize={{ base: "sm", md: "md" }}
                      px={2}
                      whiteSpace="nowrap"
                    >
                      {item.role}
                    </Td>
                    <Td
                      textAlign="center"
                      fontSize={{ base: "sm", md: "md" }}
                      px={2}
                      whiteSpace="nowrap"
                    >
                      {item.agency}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr borderColor="gray.200" textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan={columns.length}
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
                    <NoData label="leaderboard data" />
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
