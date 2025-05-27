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
  Spinner,
  Center,
  Badge,
} from "@chakra-ui/react";
import LeaderBoardHeaderIcon from "../../../assets/img/survey/LeaderBoardHeaderIcon.png";
import Assigned_Survey from "../../../assets/img/survey/Assigned_Survey.png";
import Inbox_survey from "../../../assets/img/survey/Inbox_survey.png";
import Survey_Live from "../../../assets/img/survey/Survey_Live.png";
import Survey_filled from "../../../assets/img/survey/Survey_filled.png";
import { FiFilter, FiSearch } from "react-icons/fi";
import { useFetchItemsQuery } from "api/apiSlice";
import TopPagination from "components/pagination/TopPagination";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
// import ActiveFiltersDisplay from "./ActiveFiltersDisplay";
// import AdvancedSearchModal from "./AdvancedSearchModal";

const LeaderBoard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);

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

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={4} bg="white">
      {/* Header */}
      <Box mb={6} display="flex">
        <img
          src={LeaderBoardHeaderIcon}
          alt="icon"
          width={"100px"}
          height={"100px"}
        />
        <Flex fontWeight={"bold"} fontSize={"50px"} alignItems={"flex-end"}>
          Leader Board
        </Flex>
      </Box>

      {/* Report Count Statistics*/}
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={4}
        mb={8}
        flexWrap="wrap"
      >
        {/* Survey Created */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <Box bg={"#F4F7FE"} borderRadius="full" py={"25px"} px={"25px"}>
              <img
                src={Inbox_survey}
                alt="icon"
                width={"50px"}
                height={"50px"}
              />
            </Box>
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Survey Created
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                {leaderBoardStats?.doc?.createdSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Assigned */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <img
              src={Assigned_Survey}
              alt="icon"
              width={"100px"}
              height={"100px"}
            />
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Assigned
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                {leaderBoardStats?.doc?.assignedSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Survey Filled */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <img
              src={Survey_filled}
              alt="icon"
              width={"100px"}
              height={"100px"}
            />
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Survey Filled
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                {leaderBoardStats?.doc?.filledSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Live Surveys */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <img
              src={Survey_Live}
              alt="icon"
              width={"100px"}
              height={"100px"}
            />
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Live Surveys
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                {leaderBoardStats?.doc?.activeSurveys || 0}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>

      {/* Filter and Pagination Header */}
      <Flex justifyContent="space-between" alignItems="center" p={3}>
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Leaderboard
        </Text>
        <Flex justifyContent="space-between" alignItems="center" gap={2}>
          {/* <ActiveFiltersDisplay
            filters={filters}
            onClearFilters={handleClearFilters}
          /> */}
          <IconButton
            icon={<FiSearch />}
            onClick={() => setIsFilterOpen(true)}
            aria-label="Search Leaderboard"
            colorScheme="brand"
            variant="solid"
            size="sm"
            borderRadius="full"
            boxShadow="md"
          />
        </Flex>
      </Flex>

      {/* Pagination */}
      <Box mb={1}>
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

      {/* Leaderboard Table */}
      <Box borderRadius="lg" boxShadow="sm" bg="white" overflowY="auto">
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
                    fontSize="14px"
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
            <TableLoading columns={columns} length={7} py="4" />
          ) : (
            <Tbody>
              {leaderboardData?.doc?.leaderboard?.length > 0 ? (
                leaderboardData.doc.leaderboard.map((item, index) => (
                  <Tr key={item._id}>
                    <Td
                      py={4}
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="400"
                      minWidth="100px"
                      textAlign={"center"}
                    >
                      {index + 1}
                    </Td>
                    <Td textAlign="center" fontWeight="medium">
                      <Flex alignItems="center" justifyContent="center" gap={2}>
                        {item.profileImage ? (
                          <Avatar
                            size="sm"
                            src={item.profileImage}
                            name={item.fullName}
                          />
                        ) : (
                          <Avatar size="sm" name={item.fullName} />
                        )}
                        {item.fullName}
                      </Flex>
                    </Td>
                    <Td textAlign="center">
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
                    >
                      {item.avgScore ? `${item.avgScore}%` : "N/A"}
                    </Td>
                    <Td textAlign="center" fontWeight="bold">
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
                      >
                        #{item.rank}
                      </Badge>
                    </Td>
                    <Td textAlign="center">{item.role}</Td>
                    <Td textAlign="center">{item.agency?.name}</Td>
                  </Tr>
                ))
              ) : (
                <Tr borderColor="gray.200" textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan={columns.length}
                    fontSize={{ base: "12px", md: "15px" }}
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
      {/* <AdvancedSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
        clearFilter={filterChanged}
      /> */}
    </Box>
  );
};

export default LeaderBoard;