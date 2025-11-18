import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Text,
  IconButton,
  useDisclosure,
  HStack,
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import {
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import EvaluteModal from "./components/EvaluteModal";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import TopPagination from "components/pagination/TopPagination";
import AdvancedSearchModal from "./components/AdvancedSearchModal";
import ActiveFiltersDisplay from "./components/ActiveFiltersDisplay";

const UserEvaluation = () => {
  const [mergedData, setMergedData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);

  const buildQueryParamsForUser = () => {
    const params = { page: currentPage, limit: pageSize };
    if (Object.keys(filters).length > 0) {
      if (filters.agency) params.agency = filters.agency;
      if(filters.userId) params.userId = filters.userId;
      if(filters.roleId) params.roleId = filters.roleId;
    }
    return params;
  };

  const {
    data: usersData,
    isFetching: usersFetching,
    refetch: refetchUsers,
  } = useFetchItemsQuery(
    { path: "/v2/user/search_users",params:buildQueryParamsForUser() },
    { refetchOnMountOrArgChange: true }
  );

  const buildQueryParams = () => {
    const params = { page: currentPage, limit: pageSize };
    if (Object.keys(filters).length > 0) {
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      if (filters.startFrom) params.startDate = filters.startFrom;
      if (filters.startTo) params.endDate = filters.startTo;
      if (filters.filterStatus) params.filterStatus = filters.filterStatus;
    }
    return params;
  };

  const {
    data: evaluationsData,
    isFetching: evalFetching,
    refetch: refetchEvaluations,
  } = useFetchItemsQuery(
    { path: "/evaluation/user-evaluation", params: buildQueryParams() },
    { refetchOnMountOrArgChange: true }
  );

  const [createEvaluation] = useCreateItemMutation();

  useEffect(() => {
    if (usersData?.doc) {
      const merged = usersData.doc.map((user) => {
        const evaluation = evaluationsData?.data?.find(
          (e) => e.userId?._id === user._id
        );
        return {
          ...user,
          Avg: evaluation?.avg?.toFixed(2) || 0,
          noOfEvaluations: evaluation?.noOfEvaluations || 0,
          feedback: evaluation?.feedback || "",
          agency: evaluation?.userId?.agency?.name || "",
          evaluations: evaluation?.evaluations || [],
          evaluatedBy: evaluation?.evaluatedBy?.fullName || "N/A",
        };
      });
      setMergedData(merged);
      if (evaluationsData?.data) {
        setTotalPages(evaluationsData.totalPages || 0);
        setTotalItems(evaluationsData.totalItems || 0);
      }
    }
  }, [usersData, evaluationsData]);

  const handleEvaluate = (user, mode) => {
    setSelectedUser({ ...user, mode });
    onOpen();
  };

  const handleSaveEvaluation = async (payload) => {
    try {
      await createEvaluation({
        path: "/evaluation/user-evaluation",
        body: payload,
      }).unwrap();
      refetchEvaluations();
      onClose();
    } catch (err) {
      console.error("Error saving evaluation:", err);
    }
  };

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
    setIsFilterOpen(false);
    setFilterChanged(true);
    refetchEvaluations();
  };

  useEffect(() => {
    if (filterChanged) setFilterChanged(false);
  }, [filterChanged]);

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
    refetchEvaluations();
  };

  const isLoading = usersFetching || evalFetching;

  // Card calculations
  const totalUsers = mergedData.length;
  const evaluatedUsers = mergedData.filter((u) => u.noOfEvaluations > 0).length;
  const nonEvaluatedUsers = totalUsers - evaluatedUsers;

  const columns = [
    "User",
    "Avg",
    "No. of Evaluations",
    "Agency",
    "Role",
    "Evaluated By",
    "Status",
    "Actions",
  ];

  const handleDelete = () => {};
  return (
    <Box px={{ base: 2, md: 6 }} py={4} bg="white" minH="100vh">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <Stat
          px={5}
          py={6}
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
          borderTop="6px solid"
          borderTopColor="blue.400"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
        >
          <HStack mb={3}>
            <FiUsers size={28} color="#3182CE" />
            <StatLabel fontWeight="bold">Total Users</StatLabel>
          </HStack>
          <StatNumber fontSize="2xl">{totalUsers}</StatNumber>
          <StatHelpText>All registered users</StatHelpText>
        </Stat>

        <Stat
          px={5}
          py={6}
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
          borderTop="6px solid"
          borderTopColor="green.400"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
        >
          <HStack mb={3}>
            <FiCheckCircle size={28} color="#38A169" />
            <StatLabel fontWeight="bold">Evaluated Users</StatLabel>
          </HStack>
          <StatNumber fontSize="2xl">{evaluatedUsers}</StatNumber>
          <StatHelpText>Users with evaluations</StatHelpText>
        </Stat>

        <Stat
          px={5}
          py={6}
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
          borderTop="6px solid"
          borderTopColor="red.400"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
        >
          <HStack mb={3}>
            <FiXCircle size={28} color="#E53E3E" />
            <StatLabel fontWeight="bold">Non-Evaluated Users</StatLabel>
          </HStack>
          <StatNumber fontSize="2xl">{nonEvaluatedUsers}</StatNumber>
          <StatHelpText>Users pending evaluation</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexDir={{ base: "column", md: "row" }}
      >
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          User Evaluations
        </Text>
        <HStack spacing={2} mt={{ base: 2, md: 0 }}>
          <IconButton
            icon={<FiRefreshCw />}
            aria-label="Refresh"
            variant="outline"
            size="sm"
            onClick={() => {
              refetchUsers();
              refetchEvaluations();
            }}
            isLoading={isLoading}
          />
          <Button
            colorScheme="brand"
            size="sm"
            borderRadius="md"
            onClick={() => setIsFilterOpen(true)}
          >
            Advanced Search
          </Button>
        </HStack>
      </Flex>

      <ActiveFiltersDisplay
        filters={filters}
        onClearFilters={handleClearFilters}
      />

      <Box my={2}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isLoading}
          loading={isLoading}
        />
      </Box>
      <Box
        borderRadius="lg"
        boxShadow="sm"
        bg="white"
        maxH="85vh"
        overflowY="auto"
      >
        <Table variant="striped" size="lg" bg="white">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            fontSize="16px"
            borderRadius="lg"
          >
            <Tr>
              {columns.map((header, index) => (
                <Th key={index} bg="brand.200" whiteSpace="nowrap" py={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      fontSize={{ base: "12px", md: "14px" }}
                      fontWeight="600"
                      color="gray.700"
                      textTransform="capitalize"
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>

          {isLoading ? (
            <TableLoading columns={columns} length={10} py="4" />
          ) : (
            <Tbody>
              {mergedData.length > 0 ? (
                mergedData.map((user, index) => (
                  <Tr key={index} _hover={{ bg: "gray.50" }}>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <Flex align="center" gap={3}>
                        <Avatar size="sm" name={user.fullName} />
                        <Text fontSize="sm">{user.fullName}</Text>
                      </Flex>
                    </Td>
                    <Td textAlign="center">
                      {user.Avg > 0 ? user.Avg : "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {user.noOfEvaluations > 0 ? user.noOfEvaluations : "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {user.agency || "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {user.roles[0]?.roleName || "N/A"}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {user.evaluatedBy}
                    </Td>
                    <Td
                      textAlign="center"
                      whiteSpace="nowrap"
                      minWidth="100px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      <Badge
                        colorScheme={user.noOfEvaluations > 0 ? "green" : "red"}
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {user.noOfEvaluations > 0
                          ? "Evaluated"
                          : "Not Evaluated"}
                      </Badge>
                    </Td>
                    <Td textAlign="center" whiteSpace="nowrap" minWidth="100px">
                      <Box display={"flex"} gap={2} justifyContent="center">
                        {user.noOfEvaluations > 0 && (
                          <IconButton
                            aria-label="View"
                            icon={<FiEye />}
                            size="sm"
                            colorScheme="teal"
                            variant="ghost"
                            onClick={() => handleEvaluate(user, "view")}
                          />
                        )}
                        {user.noOfEvaluations > 0 && (
                          <IconButton
                            aria-label="Edit"
                            icon={<FiEdit2 />}
                            size="sm"
                            colorScheme="orange"
                            variant="ghost"
                            onClick={() => handleEvaluate(user, "edit")}
                          />
                        )}
                        {user.noOfEvaluations <= 0 && (
                          <IconButton
                            aria-label="Add Evaluation"
                            icon={<FiEdit2 />}
                            size="sm"
                            colorScheme="green"
                            variant="ghost"
                            onClick={() => handleEvaluate(user, "add")}
                          />
                        )}
                        {user.noOfEvaluations > 0 && (
                          <IconButton
                            aria-label="Delete"
                            icon={<FiXCircle />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(user._id)}
                          />
                        )}
                      </Box>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={columns.length} textAlign="center">
                    <NoData label="evaluations" />
                  </Td>
                </Tr>
              )}
            </Tbody>
          )}
        </Table>
      </Box>

      {selectedUser && (
        <EvaluteModal
          isOpen={isOpen}
          onClose={onClose}
          user={selectedUser}
          onSave={handleSaveEvaluation}
        />
      )}

      <AdvancedSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
        clearFilter={filterChanged}
      />
    </Box>
  );
};

export default UserEvaluation;
