import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Flex,
  IconButton,
  Badge,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Icon,
} from "@chakra-ui/react";
import { FaPlay, FaPause } from "react-icons/fa";
import { fetchCallHistoryData } from "../../../../../services/sip/index";
import moment from "moment";
import Pagination from "../../../developers/components/Pagination";
import TableLoading from "components/loading/TableLoading";
import NoData from "views/admin/lead-v2/components/subComponents/NoData";
import { FiSearch } from "react-icons/fi";
import ActiveFiltersDisplay from "./Component/ActiveFiltersDisplay";
import AdvancedSearchModal from "./Component/AdvancedSearchModal";
import Vector from "assets/icons/Vector.png";
import subway_call_2 from "assets/icons/subway_call-2.png";
import subway_call_3 from "assets/icons/subway_call-3.png";
import { FaPhone } from "react-icons/fa6";
import IncomingCallIcon from "assets/icons/incomming-call.png";
import OutgoingCallIcon from "assets/icons/Outgoing-call.png";
import AudioPlayer from "./Component/AudioPlayer";

const StatusBadge = ({ status }) => {
  return (
    <Badge bg={"transparent"} px={2} py={1} color={"black"}>
      {status || "no data found"}
    </Badge>
  );
};

const StatusColor = ({ children, status }) => {
  let color;
  switch (status) {
    case "ANSWERED":
      color = "#DEFFF3";
      break;
    case "NO ANSWER":
      color = "#F8E3FF";
      break;
    case "FAILED":
      color = "#FFE0E0";
      break;
    case "BUSY":
      color = "#FFE0E0";
      break;
    default:
      color = "gray.500";
  }

  return (
    <Badge bg={color} px={2} py={1} borderRadius={"15px"} color={"black"}>
      {children}
    </Badge>
  );
};

export default function CallHistory() {
  const [calls, setCalls] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [filterChanged, setFilterChanged] = useState(false);

  const columns = [
    "Call id",
    "Call date",
    "Call Mode",
    "Call from",
    "Call to",
    "Recording",
    "Status",
    "Type",
    "Call Duration",
    "Talk Duration",
  ];

  const buildQueryParams = useCallback(() => {
    const params = {
      page: page,
      limit: pageSize,
    };

    if (filters.call_from) params.call_from = filters.call_from;
    if (filters.call_to) params.call_to = filters.call_to;
    if (filters.clid) params.clid = filters.clid;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.disposition) params.disposition = filters.disposition;

    return params;
  }, [page, pageSize, filters]);

  const loadCalls = useCallback(async () => {
    try {
      setLoading(true);
      const params = buildQueryParams();
      const data = await fetchCallHistoryData(params);

      setCalls(data.data || []);
      setTotalItems(data.total_records || 0);
      setTotalPages(data.total_pages || 1);
      if (data.page) setPage(data.page);
      if (data.page_size) setPageSize(data.page_size);
    } catch (err) {
      setError("Failed to fetch call history");
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((e) => {
    setPageSize(e.target.value);
    setPage(1);
  }, []);

  // Function to handle setting currently playing audio
  const handleSetCurrentlyPlaying = useCallback((playerId) => {
    setCurrentlyPlayingId(playerId);
  }, []);

  const handleClearFilters = useCallback((filterKey) => {
    if (filterKey) {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[filterKey];
        return newFilters;
      });
    } else {
      setFilters({});
    }
    setPage(1);
    setFilterChanged((prev) => !prev);
  }, []);

  const handleApplyFilters = useCallback((newFilters) => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    setFilters(cleanedFilters);
    setPage(1);
    setFilterChanged((prev) => !prev);
  }, []);

  const borderColor = useColorModeValue("gray.200", "gray.700");

  const CallHelper = (callMode) => {
    let color = "";
    let text = "";
    switch (callMode) {
      case "Outgoing":
        color = "#E11111";

        break;
      case "Incoming":
        color = "#1EB006";
        break;
      default:
        color = "black";
    }
    return (
      <Flex gap={2} alignItems={"center"} color={color}>
        <Box>{CallModeIcon(callMode)}</Box>
        <Box>{callMode}</Box>
      </Flex>
    );
  };
  return (
    <Box
      overflowX="auto"
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="0px"
      bg="white"
      p={3}
      marginTop={"-16px"}
      marginLeft={"-4px"}
    >
      <Flex
        justifyContent={{ base: "flex-end", sm: "flex-end", lg: "flex-end" }}
        m={3}
      >
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
      </Flex>
      <Box m={3}>
        <ActiveFiltersDisplay
          filters={filters}
          onClearFilters={handleClearFilters}
        />
      </Box>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        setPageSize={setPageSize}
        handlePageSize={handlePageSizeChange}
        refetching={loading}
        loading={loading}
      />

      <Box borderRadius="lg" boxShadow="sm" bg="white" overflowY="auto" mt={3}>
        <Table variant="striped" size="sm" bg="white">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            fontSize={"16px"}
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
                    >
                      {header}
                    </Text>
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <TableLoading columns={columns} length={10} py="4" />
            ) : calls && calls.length > 0 ? (
              calls.map((call, index) => (
                <Tr key={call.id || call.uniqueid || index}>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.uniqueid || "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.calldate
                      ? moment(call.calldate).format("MM/DD/YYYY hh:mmA")
                      : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.call_mode
                      ? CallHelper(call.call_mode)
                      : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.src || "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                    color={"#8247FF"}
                  >
                    {call.dst || "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "11px", md: "13px" }}
                    fontWeight="400"
                    minWidth="180px"
                    textAlign={"center"}
                  >
                    {call.recording ? (
                      <AudioPlayer
                        url={`https://webrtc.weeam.info/file/${call.recording}`}
                        currentlyPlayingId={currentlyPlayingId}
                        setCurrentlyPlayingId={handleSetCurrentlyPlaying}
                        playerId={call.id || call.uniqueid || `player-${index}`}
                      />
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        no data found
                      </Text>
                    )}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    <Flex align="center" justify="center" gap={1}>
                      <StatusColor status={call.disposition}>
                        <Flex alignItems={"center"}>
                          <CallStatusIcon status={call.disposition} />
                          <StatusBadge status={call.disposition} />
                        </Flex>
                      </StatusColor>
                    </Flex>
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.lastapp || "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.duration ? `${call.duration} sec` : "0 sec"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.billsec ? `${call.billsec} sec` : "0 sec"}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr borderColor="gray.200" textAlign="center">
                <Td
                  borderBottom="none"
                  colSpan="10"
                  fontSize={{ base: "12px", md: "15px" }}
                  fontWeight="500"
                  color="gray.500"
                  textAlign="center"
                >
                  <NoData label="listing" />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
      <AdvancedSearchModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
        clearFilter={filterChanged}
      />
    </Box>
  );
}

const CallStatusIcon = ({ status }) => {
  switch (status) {
    case "ANSWERED":
      return (
        <img
          src={Vector}
          alt="icon"
          style={{ width: "1rem", height: "1rem" }}
          color="#DEFFF3"
        />
      );
    case "NO ANSWER":
      return (
        <img
          src={subway_call_2}
          alt="icon"
          style={{ width: "1rem", height: "1rem" }}
          color="##F8E3FF"
        />
      );
    case "FAILED":
    case "BUSY":
      return (
        <img
          src={subway_call_3}
          alt="icon"
          style={{ width: "1rem", height: "1rem" }}
          color="#DEFFF3"
        />
      );
    default:
      return <Icon as={FaPhone} color="gray.500" h={"1rem"} w={"1rem"} />;
  }
};

const CallModeIcon = (callMode) => {
  switch (callMode) {
    case "Outgoing":
      return (
        <img
          src={OutgoingCallIcon}
          alt="icon"
          style={{ width: "1rem", height: "1rem" }}
          color="#E11111"
        />
      );
    case "Incoming":
      return (
        <img
          src={IncomingCallIcon}
          alt="icon"
          style={{ width: "1rem", height: "1rem" }}
          color="#1EB006"
        />
      );
    default:
      return "";
  }
};
