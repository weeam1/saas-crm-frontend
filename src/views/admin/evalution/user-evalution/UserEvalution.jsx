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
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiRefreshCw, FiSearch, FiEye, FiEdit2 } from "react-icons/fi";
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

  const {
    data: usersData,
    isFetching: usersFetching,
    refetch: refetchUsers,
  } = useFetchItemsQuery(
    { path: "/v2/user/search_users" },
    { refetchOnMountOrArgChange: true }
  );
  const isMobile = useBreakpointValue({ base: true, sm: true, md: false });

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };

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
          Avg: evaluation?.avg?.toFixed(2) || "N/A",
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

  const handleEvaluate = (user) => {
    setSelectedUser(user);
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
    if (filterChanged) {
      setFilterChanged(false);
    }
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

  const columns = [
    "User",
    "Avg",
    "No. of Evaluations",
    "Agency",
    "Role",
    "Evaluated By",
    "Actions",
  ];

  return (
    <Box
      overflowY="auto"
      scrollBehavior="smooth"
      boxShadow="sm"
      bg="white"
      px={2}
    >
      <Flex
        justifyContent="space-between"
        alignItems={{ base: "normal", sm: "normal", md: "center" }}
        p={3}
        flexDir={{ base: "column", sm: "column", md: "row" }}
      >
        <Text fontSize="20px" fontWeight="bold" color="black" p={3}>
          Evaluation
        </Text>

        <Box
          gap={2}
          display="flex"
          alignItems="center"
          flexDir={{ base: "column", sm: "column", md: "row" }}
          justifyContent={{ base: "center", sm: "center", md: "normal" }}
        >
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
              size="sm"
              borderRadius="md"
              py={3}
              px={6}
              onClick={() => setIsFilterOpen(true)}
            >
              Advanced Search
            </Button>
          )}
        </Box>
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
              {mergedData?.length > 0 ? (
                mergedData.map((user, index) => (
                  <Tr key={index}>
                    <Td textAlign="center">{user?.fullName}</Td>
                    <Td
                      textAlign="center"
                      color={user?.Avg > 0 ? "black" : "gray.400"}
                    >
                      {user?.Avg > 0 ? user?.Avg : "No evaluations"}
                    </Td>
                    <Td
                      textAlign="center"
                      color={user?.noOfEvaluations > 0 ? "black" : "gray.400"}
                    >
                      {user?.noOfEvaluations > 0
                        ? user?.noOfEvaluations
                        : "No evaluations"}
                    </Td>
                    <Td textAlign="center">{user?.agency || "N/A"}</Td>
                    <Td textAlign="center">
                      {user?.roles[0]?.roleName || "N/A"}
                    </Td>
                    <Td textAlign="center">{user?.evaluatedBy}</Td>
                    <Td textAlign="center">
                      {user?.noOfEvaluations > 0 ? (
                        <IconButton
                          aria-label="View"
                          icon={<FiEye />}
                          size="sm"
                          colorScheme="teal"
                          variant="ghost"
                          onClick={() => handleEvaluate(user)}
                        />
                      ) : (
                         <IconButton
                          aria-label="Evaluate User"
                          icon={<FiEdit2 />}
                          size="sm"
                          colorScheme="teal"
                          variant="ghost"
                          onClick={() => handleEvaluate(user)}
                        />
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td
                    colSpan={columns.length}
                    borderBottom="none"
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color="gray.500"
                    textAlign="center"
                  >
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
