import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Text,
  Icon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiPhone } from "react-icons/fi";
import { useFetchCallFeedback } from "./hooks/useFetchCallFeedback";
import { CallFeedbackCard } from "./components/FeedBackCard";
import { CallFeedbackSummary } from "./components/FeedBackOverview";
import CallFeedbackHeader from "./components/FeedBackHeader";

const CallFeedback = () => {
  const { data: callFeedbackData, isLoading } = useFetchCallFeedback();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const mockData = [
    {
      _id: "1",
      userExtensionId: "101",
      callMedium: "external_sim",
      description:
        "The call started perfectly fine, but after a few minutes the other side experienced a lot of echo and occasional dropouts. The network seemed unstable, and the participant had to reconnect multiple times. Overall, the conversation lasted about 15 minutes, and we could only complete the first 10 minutes clearly.",
      callQuality: "good",
      reason: "voice_cutting",
      createdAt: "2026-01-01T10:00:00Z",
      user: {
        _id: "u1",
        username: "john.doe@gmail.com",
        fullName: "John Doe",
        profileImage: "uploads/profileImages/john.jpg",
      },
      lead: {
        _id: "l1",
        leadName: "Lead One",
      },
    },
    {
      _id: "2",
      userExtensionId: "102",
      callMedium: "whatsapp",
      description:
        "Call quality was excellent initially. After 5 minutes, intermittent delays started to occur, causing miscommunication. The client reported that the connection dropped twice. I had to call back each time, and finally, we managed to discuss all points. Notes: ensure better network connection next time.",
      callQuality: "average",
      reason: "VPN Issue",
      createdAt: "2026-01-01T11:30:00Z",
      user: {
        _id: "u2",
        username: "jane.doe@gmail.com",
        fullName: "Jane Doe",
        profileImage: "uploads/profileImages/jane.jpg",
      },
      lead: {
        _id: "l2",
        leadName: "Lead Two",
      },
    },

    {
      _id: "3",
      userExtensionId: "104",
      callMedium: "whatsapp",
      description:
        "Call started normally but then the voice was extremely distorted. It was hard to understand any of the client's responses. Attempted to troubleshoot by asking them to switch networks, but the quality remained very poor. Only 3 minutes of conversation were usable.",
      callQuality: "bad",
      reason: "distorted_audio",
      createdAt: "2026-01-02T14:45:00Z",
      user: {
        _id: "u4",
        username: "sarah.connor@gmail.com",
        fullName: "Sarah Connor",
        profileImage: "uploads/profileImages/sarah.jpg",
      },
      lead: {
        _id: "l4",
        leadName: "Lead Four",
      },
    },
    {
      _id: "4",
      userExtensionId: "105",
      callMedium: "external_sim",
      description:
        "The call was extremely bad from start to finish. Constant disconnects, overlapping voices, and complete loss of communication for multiple minutes. Unable to complete discussion. Follow-up required immediately to resolve issues.",
      callQuality: "very_bad",
      reason: "no_audio",
      createdAt: "2026-01-03T08:00:00Z",
      user: {
        _id: "u5",
        username: "linda.jackson@gmail.com",
        fullName: "Linda Jackson",
        profileImage: "uploads/profileImages/linda.jpg",
      },
      lead: {
        _id: "l5",
        leadName: "Lead Five",
      },
    },
  ];
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 4;

  // Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Filter data
  const filteredData = useMemo(() => {
    return (callFeedbackData || [])
      .filter((f) =>
        search
          ? f?.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            f?.lead?.leadName?.toLowerCase().includes(search.toLowerCase())
          : true
      )
      .filter((f) =>
        fromDate ? new Date(f.createdAt) >= new Date(fromDate) : true
      )
      .filter((f) =>
        toDate ? new Date(f.createdAt) <= new Date(toDate) : true
      );
  }, [callFeedbackData, search, fromDate, toDate]);

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, fromDate, toDate]);

  return (
    <Box bg={bgColor} p={2}>
      <Box mx="auto">
        <VStack spacing={4} align="stretch">
          {isLoading ? (
            <Center py={16}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : (
            <>
              {" "}
              <CallFeedbackSummary data={callFeedbackData || []} />
              <CallFeedbackHeader
                search={search}
                setSearch={setSearch}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
                spacing={6}
              >
                {paginatedData.map((feedback) => (
                  <CallFeedbackCard key={feedback._id} feedback={feedback} />
                ))}
              </SimpleGrid>
            </>
          )}

          {!isLoading && callFeedbackData.length === 0 && (
            <Center py={16}>
              <VStack spacing={4}>
                <Icon as={FiPhone} boxSize={12} color="gray.400" />
                <Text fontSize="lg" color="gray.500" fontWeight="medium">
                  No call feedback records found
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Call feedback data will appear here once available
                </Text>
              </VStack>
            </Center>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default CallFeedback;
