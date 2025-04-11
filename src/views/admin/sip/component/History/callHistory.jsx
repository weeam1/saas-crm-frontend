"use client"

import React, { useState } from "react"
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
  Tooltip,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon, Icon } from "@chakra-ui/icons"
import { FaPlay, FaPause } from "react-icons/fa"

// Sample data
const callData = [
  {
    id: "c3cda248-a67a-4844-bcf2-5...",
    userName: "John Smith",
    dateOfCall: "04/10/2025 10:47PM",
    leadName: "Acme Corporation",
    duration: "00:00:11",
    callStatus: "answered",
    recordingUrl: "/sample-recording-1.mp3",
    summary: "The call was a brief inquiry with the client about their upcoming project.",
  },
  {
    id: "f55dcbee-4aaa-4805-8cd0-...",
    userName: "Sarah Johnson",
    dateOfCall: "04/10/2025 10:46PM",
    leadName: "Global Industries",
    duration: "00:00:49",
    callStatus: "no answer",
    recordingUrl: "/sample-recording-2.mp3",
    summary: "The caller expressed a desire to learn more about our premium services.",
  },
  {
    id: "a77bcf12-9e23-4567-b123-...",
    userName: "Michael Brown",
    dateOfCall: "04/10/2025 10:30PM",
    leadName: "Tech Solutions Inc.",
    duration: "00:03:22",
    callStatus: "answered",
    recordingUrl: "/sample-recording-3.mp3",
    summary: "Detailed discussion about implementation timeline and resource allocation.",
  },
  {
    id: "d45ef789-1a2b-3c4d-5e6f-...",
    userName: "Emily Davis",
    dateOfCall: "04/10/2025 09:15PM",
    leadName: "Innovative Startups",
    duration: "00:01:05",
    callStatus: "failed",
    recordingUrl: "/sample-recording-4.mp3",
    summary: "Technical issues prevented full discussion, follow-up scheduled.",
  },
]

// Audio Player Component
const AudioPlayer = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = React.useRef(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  React.useEffect(() => {
    const audioElement = audioRef.current

    const handleEnded = () => {
      setIsPlaying(false)
    }

    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded)
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  return (
    <Flex align="center">
      <audio ref={audioRef} src={url} />
      <IconButton
        aria-label={isPlaying ? "Pause" : "Play"}
        icon={isPlaying ? <Icon as={FaPause} /> : <Icon as={FaPlay} />}
        size="sm"
        onClick={togglePlay}
        colorScheme="blue"
        variant="ghost"
      />
      <Text fontSize="xs" ml={2}>
        {isPlaying ? "Playing..." : "Play recording"}
      </Text>
    </Flex>
  )
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  let color
  switch (status) {
    case "answered":
      color = "green"
      break
    case "no answer":
      color = "yellow"
      break
    case "failed":
      color = "red"
      break
    default:
      color = "gray"
  }

  return (
    <Badge colorScheme={color} px={2} py={1} borderRadius="md">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function CallHistory() {
  const [sortField, setSortField] = useState("dateOfCall")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = [...callData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  const borderColor = useColorModeValue("gray.200", "gray.700")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  return (
    <Box overflowX="auto" borderWidth="1px" borderColor={borderColor} borderRadius="md" my={4}  bg="white">
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => handleSort("id")} position="relative" pr={10}>
              CALL ID
              {sortField === "id" && (
                <Box position="absolute" right={2} top="50%" transform="translateY(-50%)">
                  {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Box>
              )}
            </Th>
            <Th cursor="pointer" onClick={() => handleSort("userName")} position="relative" pr={10}>
              USER NAME
              {sortField === "userName" && (
                <Box position="absolute" right={2} top="50%" transform="translateY(-50%)">
                  {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Box>
              )}
            </Th>
            <Th cursor="pointer" onClick={() => handleSort("dateOfCall")} position="relative" pr={10}>
              DATE OF CALL
              {sortField === "dateOfCall" && (
                <Box position="absolute" right={2} top="50%" transform="translateY(-50%)">
                  {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Box>
              )}
            </Th>
            <Th cursor="pointer" onClick={() => handleSort("leadName")} position="relative" pr={10}>
              LEAD NAME
              {sortField === "leadName" && (
                <Box position="absolute" right={2} top="50%" transform="translateY(-50%)">
                  {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Box>
              )}
            </Th>
            <Th cursor="pointer" onClick={() => handleSort("duration")} position="relative" pr={10}>
              DURATION
              {sortField === "duration" && (
                <Box position="absolute" right={2} top="50%" transform="translateY(-50%)">
                  {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Box>
              )}
            </Th>
            <Th cursor="pointer" onClick={() => handleSort("callStatus")} position="relative" pr={10}>
              CALL STATUS
              {sortField === "callStatus" && (
                <Box position="absolute" right={2} top="50%" transform="translateY(-50%)">
                  {sortDirection === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Box>
              )}
            </Th>
            <Th>RECORDING</Th>
            <Th>SUMMARY</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((call) => (
            <Tr key={call.id} _hover={{ bg: hoverBg }}>
              <Td>
                <Tooltip label={call.id} placement="top">
                  <Text isTruncated maxW="200px">
                    {call.id}
                  </Text>
                </Tooltip>
              </Td>
              <Td>{call.userName}</Td>
              <Td>{call.dateOfCall}</Td>
              <Td>{call.leadName}</Td>
              <Td>{call.duration}</Td>
              <Td>
                <StatusBadge status={call.callStatus} />
              </Td>
              <Td>
                <AudioPlayer url={call.recordingUrl} />
              </Td>
              <Td>
                <Tooltip label={call.summary} placement="top">
                  <Text isTruncated maxW="200px">
                    {call.summary}
                  </Text>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
