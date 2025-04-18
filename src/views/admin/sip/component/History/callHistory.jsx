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
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { fetchCallHistoryData } from "../../../../../services/sip/index"; 
import moment from 'moment';

const formatTime = (time) => {
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
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleTimeUpdate = () => !isSeeking && setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
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
    if (audioRef.current) {
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
        value={currentTime}
        min={0}
        max={duration}
        onChangeStart={() => setIsSeeking(true)}
        onChangeEnd={() => setIsSeeking(false)}
        onChange={handleSeek}
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
  )
}

const StatusBadge = ({ status }) => {
  let color
  switch (status) {
    case "ANSWERED":
      color = "green";
      break
    case "NO ANSWER":
      color = "yellow";
      break
    case -"FAILED":
      color = "red";
      break
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPage,setTotalPage] = useState("");
  const loadCalls = async (page) => {
    try {
      setLoading(true);
      const data = await fetchCallHistoryData(page);
      setTotalPage(data.total_pages);
      setCalls(data.data || []);
      console.log("Fetched call data:", data.data);
    } catch (err) {
      setError("Failed to fetch call history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalls(page);
  }, [page]);

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box overflowX="auto" borderWidth="1px" borderColor={borderColor} borderRadius="md" my={4} bg="white" p={4}>
      {loading ? (
        <Flex justify="center" py={6}>
          <Spinner size="lg" />
        </Flex>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Call Id</Th>
                <Th>Call date</Th>
                <Th>Call Mode</Th>
                <Th>Call from</Th>
                <Th>Call to</Th>
                <Th>Recording</Th>
                <Th>Type</Th>
                <Th>Call Duration</Th>
                <Th>Talk Duration</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {calls.map((call) => (
                <Tr key={call.id}>
                  <Td>{call.uniqueid ? call.uniqueid : "no data found"}</Td>
                  <Td>{call.calldate ? moment(call.calldate).format("MM/DD/YYYY hh:mmA") : "no data found"}</Td>
                  <Td>{call.call_mode ? call.call_mode : "no data found"}</Td>
                  <Td>{call.call_from ? call.call_from : "no data found"}</Td>
                  <Td>{call.call_to ? call.call_to : "no data found"}</Td>
                  <Td>
                    {call.recording ? (
                      <AudioPlayer url={`https://webrtc.weeam.info/file/${call.recording}`} />
                    ) : (
                      <Text fontSize="sm" color="gray.500">
                        no data found
                      </Text>
                    )}
                  </Td>
                  <Td>{call.lastapp ? call.lastapp : "no data found"}</Td>
                  <Td>{call.duration ? call.duration : "no data found"}</Td>
                  <Td>{call.billsec ? call.billsec : "no data found"}</Td>
                  <Td>
                    <StatusBadge status={call.disposition} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex align="center" justify="end" gap={1} mt={3}>
            <IconButton
              icon={<ChevronLeftIcon boxSize={6} />}
              onClick={() => {
                if (page > 1) setPage((p) => p - 1);
              }}
              isDisabled={page === 1}
              aria-label="Previous Page"
              background="transparent"
              _hover={{ bg: "transparent" }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
            />

            <Text fontWeight="medium">
              Page {page} / {totalPage}
            </Text>

            <IconButton
              icon={<ChevronRightIcon boxSize={6} />}
              onClick={() => {
                if (page < totalPage) setPage((p) => p + 1);
              }}
              isDisabled={page === totalPage}
              aria-label="Next Page"
              background="transparent"
              _hover={{ bg: "transparent" }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
            />
          </Flex>
        </>
      )}
    </Box>
  );
}
