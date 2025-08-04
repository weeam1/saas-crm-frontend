import React, { useState, useEffect } from "react";
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
  Badge,
  useColorModeValue,
  Icon,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { FiFilter, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import TopPagination from "components/pagination/TopPagination";
import { useFetchItemsQuery } from "api/apiSlice";
import { toast } from "react-toastify";
import LogDetailsDrawer from "./component/LogDetailsDrawer";
import AdvancedFilter from "./component/AdvancedFilter";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import TableLoading from "components/loading/TableLoading";

const grayColors = {
  primary: "#49505cff",
  light: "#a0aec0ff",
  dark: "#2d3748ff",
  lighter: "#edf2f7ff",
  darkest: "#1a202cff",
  text: "#2d3748ff",
  lightBg: "#f7fafcff",
  darkBg: "#171923ff",
  hoverBg: "rgba(0, 0, 0, 0.05)",
  hoverText: "#4a5568ff",
};

const levels = {
  VIEW: 1,
  LOGIN_SUCCESS: 2,
  LIST: 2,
  CREATE: 3,
  UPDATE: 4,
  UPDATE_FAIL: 5,
  LOGIN_FAIL: 5,
  DELETE: 6,
  DELETE_FAIL: 6,
  BULK_DELETE: 7,
};

const statusOptions = [
  { label: "Success", value: "success" },
  { label: "Fail", value: "fail" },
  { label: "Pending", value: "pending" },
];

const entityOptions = [
  { label: "Lead", value: "Lead" },
  { label: "Contact", value: "Contact" },
  { label: "Account", value: "Account" },
  // Add more entities as needed
];

const actionOptions = Object.keys(levels).map((action) => ({
  label: action.replace(/_/g, " "),
  value: action,
}));

const levelOptions = Object.entries(levels).map(([name, value]) => ({
  label: `${name.replace(/_/g, " ")} (${value})`,
  value: value.toString(),
}));

const MotionTr = motion(Tr);

const LogTable = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    userId: "",
    status: "",
    from: "",
    to: "",
    entity: "",
    action: "",
    securityLevel: "",
  });

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue(grayColors.primary, grayColors.darkest);
  const headerBorderColor = "gray.800";
  const bodyBorderColor = useColorModeValue("gray.200", "gray.600");

  const buildQueryParams = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
    };

    if (filters.userId) params.userId = filters.userId;
    if (filters.status) params.status = filters.status;
    if (filters.from)
      params.from = new Date(filters.from).toISOString().split("T")[0];
    if (filters.to)
      params.to = new Date(filters.to).toISOString().split("T")[0];
    if (filters.entity) params.entity = filters.entity;
    if (filters.action) params.action = filters.action;
    if (filters.securityLevel) params.securityLevel = filters.securityLevel;

    return params;
  };

  const { data, isLoading, isFetching, error, refetch } = useFetchItemsQuery({
    path: "/logs/user_activities",
    params: buildQueryParams(),
  });

  const { data: usersData } = useFetchItemsQuery({
    path: "/v2/user/search_users",
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.total || 0);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching logs",
        description: error.message || "Failed to load logs",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error]);

  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      height: "6px",
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: useColorModeValue("#f1f1f1", "gray.700"),
    },
    "&::-webkit-scrollbar-thumb": {
      background: useColorModeValue("#c1c1c1", "gray.500"),
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: useColorModeValue("#a8a8a8", "gray.400"),
    },
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "green";
      case "fail":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const renderSecurityLevel = (levelValue) => {
    const maxLevel = 7;
    const boxHeight = "8px";

    const getLevelColor = (level) => {
      if (level >= 6) return "red.500";
      if (level >= 4) return "orange.500";
      if (level >= 2) return "blue.500";
      return "green.500";
    };

    const levelColor = getLevelColor(levelValue);

    return (
      <Flex
        borderWidth="1px"
        borderColor="gray.300"
        borderRadius="sm"
        p="2px"
        w="80%"
        h={`calc(${boxHeight} + 4px)`}
        alignItems="center"
        justifyContent="center"
        bg="white"
        textAlign={"center"}
      >
        <Flex width="100%" justify="space-between" gap="2px">
          {Array.from({ length: maxLevel }).map((_, index) => (
            <Box
              key={index}
              flex="1"
              minWidth="0"
              h={boxHeight}
              borderRadius="sm"
              bg={index < levelValue ? levelColor : "gray.100"}
              borderWidth="1px"
              borderColor={index < levelValue ? levelColor : "gray.300"}
            />
          ))}
        </Flex>
      </Flex>
    );
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      userId: "",
      status: "",
      from: "",
      to: "",
      entity: "",
      action: "",
      securityLevel: "",
    });
    setCurrentPage(1);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const transformLogData = (log) => ({
    ...log,
    userName: log.user?.fullName || log.user?.username || "Unknown User",
    securityLevel: levels[log.action] || 1,
    metadata: {
      ip: log.metadata?.ip || "N/A",
      device: log.metadata?.device || "Unknown Device",
      browser: log.metadata?.browser || "Unknown Browser",
      country: log.metadata?.country || "Unknown Country",
      region: log.metadata?.region || "Unknown Region",
      city: log.metadata?.city || "Unknown City",
      timezone: log.metadata?.timezone || "Unknown Timezone",
      timestamp: log.createdAt,
    },
  });

  return (
    <Box borderRadius="md" mt={"-18px"} mr={"-5px"}>
      <Box mb={1}>
        <TopPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setPageSize={setPageSize}
          handlePageSize={handlePageSizeChange}
          refetching={isFetching}
          loading={isLoading}
          sizeMedium={true}
        />
      </Box>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        overflowX="auto"
        sx={scrollbarStyles}
      >
        <Table variant="simple" size="sm" layout="fixed">
          <Thead
            position="sticky"
            top={0}
            bg={headerBg}
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            height="24px"
          >
            <Tr>
              <Th
                color="white"
                fontSize="xx-small"
                borderRightWidth="1px"
                borderRightColor={headerBorderColor}
                borderBottomWidth="1px"
                borderBottomColor={headerBorderColor}
                whiteSpace="nowrap"
              >
                <Text fontSize="xx-small">User</Text>
              </Th>
              <Th
                color="white"
                fontSize="xx-small"
                borderRightWidth="1px"
                borderRightColor={headerBorderColor}
                borderBottomWidth="1px"
                borderBottomColor={headerBorderColor}
                textAlign={"center"}
                whiteSpace="nowrap"
              >
                Action
              </Th>
              <Th
                color="white"
                fontSize="xx-small"
                borderRightWidth="1px"
                borderRightColor={headerBorderColor}
                borderBottomWidth="1px"
                borderBottomColor={headerBorderColor}
                textAlign={"center"}
                whiteSpace="nowrap"
              >
                Status
              </Th>
              <Th
                color="white"
                fontSize="xx-small"
                borderRightWidth="1px"
                borderRightColor={headerBorderColor}
                borderBottomWidth="1px"
                borderBottomColor={headerBorderColor}
                textAlign={"center"}
                whiteSpace="nowrap"
              >
                Ip Address
              </Th>
              <Th
                color="white"
                fontSize="xx-small"
                borderRightWidth="1px"
                borderRightColor={headerBorderColor}
                borderBottomWidth="1px"
                borderBottomColor={headerBorderColor}
                textAlign={"center"}
                whiteSpace="nowrap"
              >
                Security Level
              </Th>
              <Th
                color="white"
                fontSize="xx-small"
                borderRightWidth="1px"
                borderRightColor={headerBorderColor}
                borderBottomWidth="1px"
                borderBottomColor={headerBorderColor}
                textAlign={"center"}
                whiteSpace="nowrap"
              >
                Message
              </Th>
              <Th
                color="white"
                fontSize="xx-small"
                borderBottomWidth="1px"
                borderBottomColor={headerBorderColor}
                textAlign={"center"}
                whiteSpace="nowrap"
              >
                <Flex align="center" justifyContent={"space-between"}>
                  <Text fontSize="xx-small"> Timestamp</Text>
                  <IconButton
                    icon={<FiFilter />}
                    variant="ghost"
                    color="white"
                    _hover={{ bg: grayColors.dark }}
                    onClick={() => setIsFilterOpen(true)}
                    aria-label="Filter"
                    size="xs"
                    ml={2}
                  />
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading || isFetching ? (
              <TableLoading
                columns={[
                  "User",
                  "Action",
                  "Status",
                  "Ip Address",
                  "Security Level",
                  "Message",
                  "TimeStamp",
                ]}
                length={6}
                py="4"
              />
            ) : data?.doc?.length > 0 ? (
              data?.doc.map((log, index) => {
                const transformedLog = transformLogData(log);
                return (
                  <MotionTr
                    key={log._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    _hover={{
                      bg: colorMode === "light" ? "gray.100" : "gray.700",
                    }}
                    onClick={() => {
                      setSelectedLog(transformedLog);
                      setIsDrawerOpen(true);
                    }}
                    cursor="pointer"
                  >
                    <Td
                      py={2}
                      px={4}
                      fontSize="xx-small"
                      borderRightWidth="1px"
                      borderRightColor={bodyBorderColor}
                      borderBottomWidth="1px"
                      borderBottomColor={bodyBorderColor}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      textAlign={"center"}
                    >
                      <Flex align="center">
                        <Icon as={FiUser} mr={2} color={grayColors.primary} />
                        <Text fontSize="xx-small">
                          {transformedLog.userName}
                        </Text>
                      </Flex>
                    </Td>
                    <Td
                      py={2}
                      px={4}
                      fontSize="xx-small"
                      borderRightWidth="1px"
                      borderRightColor={bodyBorderColor}
                      borderBottomWidth="1px"
                      borderBottomColor={bodyBorderColor}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      textAlign={"center"}
                    >
                      {transformedLog.action.replace(/_/g, " ")}
                    </Td>
                    <Td
                      py={2}
                      px={4}
                      fontSize="xx-small"
                      borderRightWidth="1px"
                      borderRightColor={bodyBorderColor}
                      borderBottomWidth="1px"
                      borderBottomColor={bodyBorderColor}
                    >
                      <Badge
                        colorScheme={getStatusColor(transformedLog.status)}
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="xx-small"
                      >
                        {transformedLog.status}
                      </Badge>
                    </Td>
                    <Td
                      py={2}
                      px={4}
                      fontSize="xx-small"
                      borderRightWidth="1px"
                      borderRightColor={bodyBorderColor}
                      borderBottomWidth="1px"
                      borderBottomColor={bodyBorderColor}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      textAlign={"center"}
                    >
                      {transformedLog.metadata.ip}
                    </Td>
                    <Td
                      py={2}
                      px={4}
                      fontSize="xx-small"
                      borderRightWidth="1px"
                      borderRightColor={bodyBorderColor}
                      borderBottomWidth="1px"
                      borderBottomColor={bodyBorderColor}
                      textAlign={"center"}
                    >
                      {renderSecurityLevel(transformedLog.securityLevel)}
                    </Td>
                    <Td
                      py={2}
                      px={4}
                      fontSize="xx-small"
                      borderRightWidth="1px"
                      borderRightColor={bodyBorderColor}
                      borderBottomWidth="1px"
                      borderBottomColor={bodyBorderColor}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {transformedLog.message}
                    </Td>
                    <Td
                      py={2}
                      px={4}
                      fontSize="xx-small"
                      borderBottomWidth="1px"
                      borderBottomColor={bodyBorderColor}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      textAlign={"center"}
                    >
                      {new Date(
                        transformedLog.metadata.timestamp
                      ).toLocaleString()}
                    </Td>
                  </MotionTr>
                );
              })
            ) : (
              <Tr borderColor="gray.200" textAlign="center">
                <Td
                  borderBottom="none"
                  colSpan="7"
                  fontSize={{ base: "12px", md: "15px" }}
                  fontWeight="500"
                  color="gray.500"
                  textAlign="center"
                >
                  <NoData label="log" />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <AdvancedFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        grayColors={grayColors}
        statusOptions={statusOptions}
        actionOptions={actionOptions}
        levelOptions={levelOptions}
        entityOptions={entityOptions}
        usersData={usersData}
      />

      <LogDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        selectedLog={selectedLog}
        grayColors={grayColors}
        renderSecurityLevel={renderSecurityLevel}
        getStatusColor={getStatusColor}
      />
    </Box>
  );
};

export default LogTable;
