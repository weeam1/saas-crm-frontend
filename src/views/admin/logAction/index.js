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
  Icon,
  IconButton,
  Heading,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import {  FiUser} from "react-icons/fi";
import { motion } from "framer-motion";
import TopPagination from "components/pagination/TopPagination";
import { useFetchItemsQuery } from "api/apiSlice";
import { toast } from "react-toastify";
import LogDetailsDrawer from "./component/LogDetailsDrawer";
import AdvancedFilter from "./component/AdvancedFilter";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import TableLoading from "components/loading/TableLoading";
import { formatPostDate } from "utils/helpers";
import { usePermissions } from "hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import SearchTags from "components/search/SearchTags";
import { useModalColors } from "hooks/useModalColors";
import RefreshButton from "components/refresh/RefreshButton";
import FilterButton from "components/base/FilterButton";

const levels = {
  VIEW: 1,
  LIST: 2,
  CREATE: 3,
  LOGIN: 4,
  UPDATE: 5,
  RELEASE: 5,
  CANCEL: 6,
  APPROVE: 6,
  DELETE: 7,
  BULK_DELETE: 8,
  ASSIGN: 9,
  BULK_ASSIGN: 10,
  DOWNLOAD: 11,
};

const statusOptions = [
  { label: "Success", value: "success" },
  { label: "Fail", value: "fail" },
  { label: "Error", value: "error" },
];

const entityOptions = [
  { label: "Auth", value: "Auth" },
  { label: "Lead", value: "Lead" },
  { label: "Leads Pool", value: "Lead_Pool" },
  { label: "Deals", value: "Deals" },
  { label: "Announcement", value: "Announcement" },
  { label: "Hiring", value: "Hiring" },
  { label: "Attendance", value: "Attendance" },
  { label: "Invoice", value: "Invoice" },
  { label: "Expense", value: "Expense" },
  { label: "Task", value: "Task" },
  { label: "Call Log", value: "Call_Logs" },
  { label: "Listing", value: "Listing" },
  { label: "Survey", value: "Survey" },
  { label: "Whatsapp", value: "Whatsapp" },
  { label: "Reports", value: "Reports" },
];

const actionOptions = Object.keys(levels).map((action) => ({
  label: action.replace(/_/g, " "),
  value: action,
}));

const levelOptions = Array.from({ length: 8 }, (_, i) => ({
  value: i + 1,
}));

const MotionTr = motion(Tr);

const LogTable = () => {
  const colors = useModalColors();
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [searchTags, setSearchTags] = useState(null);

  const [filters, setFilters] = useState({
    userId: "",
    status: "",
    from: "",
    to: "",
    entity: "",
    action: "",
    securityLevel: "",
    leadAgent: "",
    leadManager: "",
  });

  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasPermission("system_log")) return navigate("/default");
  }, []);

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
    if (filters.roleId) params.roleId = filters.roleId;
    if (filters.leadAgent) params.leadAgent = filters.leadAgent;
    if (filters.leadManager) params.leadManager = filters.leadManager;

    return params;
  };

  const { data, isLoading, isFetching, error, refetch } = useFetchItemsQuery(
    {
      path: "/logs/user_activities",
      params: buildQueryParams(),
    },
    { refetchOnMountOrArgChange: true },
  );

  const { data: usersData } = useFetchItemsQuery(
    {
      path: "/v2/user/search_users",
    },
    { refetchOnMountOrArgChange: true },
  );

  const { data: roleData } = useFetchItemsQuery(
    {
      path: "/role-access/v2",
    },
    { refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.total || 0);
      if (data.total !== displayCount) {
        const duration = 1000;
        const start = displayCount;
        const end = data.total;
        const startTime = performance.now();

        const animateCount = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const currentCount = Math.floor(start + (end - start) * progress);

          setDisplayCount(currentCount);

          if (progress < 1) {
            requestAnimationFrame(animateCount);
          } else {
            setDisplayCount(end);
          }
        };

        requestAnimationFrame(animateCount);
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load logs");
    }
  }, [error]);

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
    const maxLevel = 8;
    const boxHeight = "8px";

    const getLevelColor = (level) => {
      if (level >= 6) return colors.badgeErrorText;
      if (level >= 4) return colors.badgeWarningText;
      if (level >= 2) return colors.accentGold;
      return colors.accentGold;
    };

    const levelColor = getLevelColor(levelValue);

    return (
      <Flex
        borderWidth="1px"
        borderColor={colors.borderColor}
        borderRadius="sm"
        p="2px"
        w="80px"
        h={`calc(${boxHeight} + 4px)`}
        alignItems="center"
        bg={colors.bg}
      >
        <Flex width="100%" justify="space-between" gap="2px">
          {Array.from({ length: maxLevel }).map((_, index) => (
            <Box
              key={index}
              flex="1"
              minWidth="0"
              h={boxHeight}
              borderRadius="sm"
              bg={index < levelValue ? levelColor : colors.bgInput}
              borderWidth="1px"
              borderColor={index < levelValue ? levelColor : colors.borderColor}
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
      entityId: "",
    });
    setCurrentPage(1);
    setSearchTags(null);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const transformLogData = (log) => ({
    ...log,
    userName: log.user?.fullName || log.user?.username || "Unknown User",
    securityLevel: log?.securityLevel || 1,
    metadata: {
      ip: log.metadata?.ip || "N/A",
      latitude: log.metadata?.latitude || null,
      longitude: log.metadata?.longitude || null,
      device: log.metadata?.device || "Unknown Device",
      browser: log.metadata?.browser || "Unknown Browser",
      os: log.metadata?.os || "Unknown OS",
      osVersion: log.metadata?.osVersion || "Unknown OS Version",
      browserVersion: log.metadata?.browserVersion || "Unknown Browser Version",
      country: log.metadata?.country || "Unknown Country",
      region: log.metadata?.region || "Unknown Region",
      city: log.metadata?.city || "Unknown City",
      timezone: log.metadata?.timezone || "Unknown Timezone",
      timestamp: log.createdAt,
    },
  });

  return (
    <Box bg={colors.bgDeep} minH="100vh" p={4}>
      <Box borderRadius="md" bg={colors.bg} p={4} border="1px solid" borderColor={colors.borderColor}>
        <Stack
          direction={{ base: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "flex-start", sm: "center" }}
          mb={4}
          spacing={2}
        >
          <Heading as="h3" size="md" fontWeight="bold" color={colors.headingText}>
            System Log ({displayCount})
          </Heading>
          <Flex gap={2} align="center">
         <FilterButton
	label="Filter"
	onClick={() => setIsFilterOpen(true)}
	size="sm"
/>
            <RefreshButton
                                    label="Refresh"
                               onClick={() => refetch()}
                                    isLoading={isFetching}
                                    isFetching={isFetching}
                                    size="sm"
                                  />

          </Flex>
        </Stack>

        {searchTags && searchTags?.length > 0 && filters && (
          <Flex
            gap={2}
            flexDir={{ base: "column", sm: "column", md: "row" }}
            mb={2}
            justifyContent={"space-between"}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <SearchTags searchTags={searchTags} />

            <Text
              as="button"
              fontSize="sm"
              color={colors.badgeErrorText}
              fontWeight="medium"
              borderColor={colors.badgeErrorText}
              borderWidth="1px"
              px={3}
              py={1}
              borderRadius="full"
              _hover={{ bg: colors.badgeErrorBg }}
              onClick={resetFilters}
              transition="all 0.2s ease"
            >
              Clear
            </Text>
          </Flex>
        )}

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
          borderColor={colors.borderColor}
          overflowX="auto"
          bg={colors.bg}
               maxHeight="80vh"
      minH="70vh"
          sx={{
            "&::-webkit-scrollbar": {
              height: "6px",
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: colors.bgDeep,
            },
            "&::-webkit-scrollbar-thumb": {
              background: colors.accentGold,
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: colors.goldLight,
            },
          }}
        >
          <Table variant="simple" size="sm" layout="fixed">
            <Thead
              position="sticky"
              top={0}
              bg={colors.bgDeep}
              zIndex={2}
              boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
              height="24px"
            >
              <Tr>
                <Th
                  color={colors.headingText}
                  fontSize="xs"
                  borderRightWidth="1px"
                  borderRightColor={colors.borderColor}
                  borderBottomWidth="1px"
                  borderBottomColor={colors.borderColor}
                  whiteSpace="nowrap"
                >
                  <Text fontSize="xs" color={colors.headingText}>User</Text>
                </Th>
                <Th
                  color={colors.headingText}
                  fontSize="xs"
                  borderRightWidth="1px"
                  borderRightColor={colors.borderColor}
                  borderBottomWidth="1px"
                  borderBottomColor={colors.borderColor}
                  textAlign={"center"}
                  whiteSpace="nowrap"
                >
                  Action
                </Th>
                <Th
                  color={colors.headingText}
                  fontSize="xs"
                  borderRightWidth="1px"
                  borderRightColor={colors.borderColor}
                  borderBottomWidth="1px"
                  borderBottomColor={colors.borderColor}
                  textAlign={"center"}
                  whiteSpace="nowrap"
                >
                  Status
                </Th>
                <Th
                  color={colors.headingText}
                  fontSize="xs"
                  borderRightWidth="1px"
                  borderRightColor={colors.borderColor}
                  borderBottomWidth="1px"
                  borderBottomColor={colors.borderColor}
                  textAlign={"center"}
                  whiteSpace="nowrap"
                >
                  Ip Address
                </Th>
                <Th
                  color={colors.headingText}
                  fontSize="xs"
                  borderRightWidth="1px"
                  borderRightColor={colors.borderColor}
                  borderBottomWidth="1px"
                  borderBottomColor={colors.borderColor}
                  textAlign={"center"}
                  whiteSpace="nowrap"
                >
                  Security Level
                </Th>
                <Th
                  color={colors.headingText}
                  fontSize="xs"
                  borderRightWidth="1px"
                  borderRightColor={colors.borderColor}
                  borderBottomWidth="1px"
                  borderBottomColor={colors.borderColor}
                  textAlign={"center"}
                  whiteSpace="nowrap"
                >
                  Message
                </Th>
                <Th
                  color={colors.headingText}
                  fontSize="xs"
                  borderBottomWidth="1px"
                  borderBottomColor={colors.borderColor}
                  textAlign={"center"}
                  whiteSpace="nowrap"
                >
                  Timestamp
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
                  length={20}
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
                      _hover={{ bg: colors.bgInputHover }}
                      onClick={() => {
                        setSelectedLog(transformedLog);
                        setIsDrawerOpen(true);
                      }}
                      cursor="pointer"
                    >
                      <Td
                        py={2}
                        px={4}
                        fontSize="xs"
                        borderRightWidth="1px"
                        borderRightColor={colors.borderColor}
                        borderBottomWidth="1px"
                        borderBottomColor={colors.borderColor}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        textAlign={"center"}
                        color={colors.bodyText}
                      >
                        <Flex align="center">
                          <Icon as={FiUser} mr={2} color={colors.accentGold} />
                          <Text fontSize="xs" color={colors.bodyText}>{transformedLog.userName}</Text>
                        </Flex>
                      </Td>
                      <Td
                        py={2}
                        px={4}
                        fontSize="xs"
                        borderRightWidth="1px"
                        borderRightColor={colors.borderColor}
                        borderBottomWidth="1px"
                        borderBottomColor={colors.borderColor}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        textAlign={"center"}
                        color={colors.bodyText}
                      >
                        {transformedLog.action.replace(/_/g, " ")}
                      </Td>
                      <Td
                        py={2}
                        px={4}
                        fontSize="xs"
                        borderRightWidth="1px"
                        borderRightColor={colors.borderColor}
                        borderBottomWidth="1px"
                        borderBottomColor={colors.borderColor}
                        textAlign={"center"}
                      >
                        <Badge
                          colorScheme={getStatusColor(transformedLog.status)}
                          px={2}
                          py={0.5}
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {transformedLog.status}
                        </Badge>
                      </Td>
                      <Td
                        py={2}
                        px={4}
                        fontSize="xs"
                        borderRightWidth="1px"
                        borderRightColor={colors.borderColor}
                        borderBottomWidth="1px"
                        borderBottomColor={colors.borderColor}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        textAlign={"center"}
                        color={colors.bodyText}
                      >
                        {transformedLog.metadata.ip}
                      </Td>
                      <Td
                        p={0}
                        fontSize="xs"
                        borderRightWidth="1px"
                        borderRightColor={colors.borderColor}
                        borderBottomWidth="1px"
                        borderBottomColor={colors.borderColor}
                        textAlign="center"
                      >
                        <Flex justifyContent="center" width="100%">
                          {renderSecurityLevel(transformedLog.securityLevel)}
                        </Flex>
                      </Td>
                      <Tooltip label={transformedLog.message} hasArrow>
                        <Td
                          py={2}
                          px={4}
                          fontSize="xs"
                          borderRightWidth="1px"
                          borderRightColor={colors.borderColor}
                          borderBottomWidth="1px"
                          borderBottomColor={colors.borderColor}
                          maxW="250px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          color={colors.bodyText}
                        >
                          {transformedLog.message}
                        </Td>
                      </Tooltip>

                      <Td
                        py={2}
                        px={4}
                        fontSize="xs"
                        borderBottomWidth="1px"
                        borderBottomColor={colors.borderColor}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        textAlign={"center"}
                        color={colors.bodyText}
                      >
                        {formatPostDate(transformedLog.metadata.timestamp)}
                      </Td>
                    </MotionTr>
                  );
                })
              ) : (
                <Tr borderColor={colors.borderColor} textAlign="center">
                  <Td
                    borderBottom="none"
                    colSpan="20"
                    fontSize={{ base: "12px", md: "15px" }}
                    fontWeight="500"
                    color={colors.mutedText}
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
          statusOptions={statusOptions}
          actionOptions={actionOptions}
          levelOptions={levelOptions}
          entityOptions={entityOptions}
          usersData={usersData}
          roleData={roleData}
          setSearchTags={setSearchTags}
        />

        <LogDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          selectedLog={selectedLog}
          renderSecurityLevel={renderSecurityLevel}
          getStatusColor={getStatusColor}
        />
      </Box>
    </Box>
  );
};

export default LogTable;