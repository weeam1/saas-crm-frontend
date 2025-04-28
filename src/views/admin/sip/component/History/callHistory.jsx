import React, { useEffect, useState, useRef } from "react";
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
  Spinner,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { FaPlay, FaPause } from "react-icons/fa";
import { fetchCallHistoryData } from "../../../../../services/sip/index";
import moment from "moment";
import Pagination from "../../../developers/components/Pagination";

const formatTime = (time) => {
  if (!isFinite(time) || time < 0) return "00:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
const AudioPlayer = ({ url }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!isSeeking && !isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, [isSeeking]);

  const handleSeek = (value) => {
    setCurrentTime(value);
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      audioRef.current.currentTime = value;
    }
  };

  return (
    <Flex align="center" w="100%" gap={2}>
      <audio ref={audioRef} src={url} preload="metadata" />
      <IconButton
        aria-label={isPlaying ? "Pause" : "Play"}
        icon={isPlaying ? <FaPause /> : <FaPlay />}
        size="sm"
        onClick={togglePlay}
        variant="ghost"
        colorScheme="blue"
      />
      <Slider
        flex="1"
        size="sm"
        value={isNaN(currentTime) ? 0 : currentTime}
        min={0}
        max={isNaN(duration) ? 1 : duration}
        onChangeStart={() => setIsSeeking(true)}
        onChangeEnd={() => setIsSeeking(false)}
        onChange={handleSeek}
        isDisabled={isNaN(duration)}
      >
        <SliderTrack bg="gray.200">
          <SliderFilledTrack bg="blue.400" />
        </SliderTrack>
        <SliderThumb boxSize={2} />
      </Slider>
      <Text fontSize="xs" whiteSpace="nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </Text>
    </Flex>
  );
};

const StatusBadge = ({ status }) => {
  let color;
  switch (status) {
    case "ANSWERED":
      color = "green";
      break;
    case "NO ANSWER":
      color = "yellow";
      break;
    case -"FAILED":
      color = "red";
      break;
    default:
      color = "gray";
  }

  return (
    <Badge colorScheme={color} px={2} py={1} borderRadius="md">
      {status ? status : "no data found"}
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

  const loadCalls = async (page) => {
    try {
      setLoading(true);
      const data = await fetchCallHistoryData(page, pageSize);
      setCalls(data.data || []);
      setTotalItems(data.page_size);
      setTotalPages(
        data.totalPages || Math.ceil((data.total_pages || 0) / pageSize)
      );
    } catch (err) {
      setError("Failed to fetch call history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls(page);
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize.target.value);
    setPage(1);
  };
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      overflowX="auto"
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      bg="white"
      p={3}
      mt={"-15.5px"}
      ml={"-5px"}
    >
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
      {loading ? (
        <Flex justify="center" py={6}>
          <Spinner size="lg" />
        </Flex>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box
          borderRadius="lg"
          boxShadow="sm"
          bg="white"
          maxH={"calc(70vh - 100px)"}
          overflowY="auto"
          mt={3}
        >
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
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Call Id
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Call date
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Call Mode
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Call from
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Call to
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Recording
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Type
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Call Duration
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Talk Duration
                </Th>
                <Th
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  fontSize={{ base: "12px", md: "14px" }}
                  fontWeight="500"
                  color="gray.700"
                  textTransform={"capitalize"}
                  textAlign={"center"}
                >
                  Status
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {calls.map((call) => (
                <Tr key={call.id}>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.uniqueid ? call.uniqueid : "no data found"}
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
                    {call.call_mode ? call.call_mode : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.call_from ? call.call_from : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.call_to ? call.call_to : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.recording ? (
                      <AudioPlayer
                        url={`https://webrtc.weeam.info/file/${call.recording}`}
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
                    {call.lastapp ? call.lastapp : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.duration ? `${call.duration} sec` : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    {call.billsec ? `${call.billsec} sec` : "no data found"}
                  </Td>
                  <Td
                    py={4}
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="400"
                    minWidth="100px"
                    textAlign={"center"}
                  >
                    <StatusBadge status={call.disposition} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
