import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

const AnalyticsCard = ({ item, month, year }) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const formatDuration = (hours, seconds) => {
    const totalSeconds = Math.round(seconds);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const getLabel = () => {
    if (year === currentYear && month === currentMonth) return "This Month";
    if (year === currentYear && month === currentMonth - 1) return "Last Month";
    const monthName = new Date(year, month - 1).toLocaleString("default", {
      month: "long",
    });
    return `${monthName} ${year}`;
  };

  const label = getLabel();
  const isCurrentMonth = year === currentYear && month === currentMonth;

  // Values
  const dailyCalls = isCurrentMonth ? item.total_calls.today : "-";
  const dailyAnswered = isCurrentMonth ? item.answered.today : "-";
  const dailyUnanswered = isCurrentMonth ? item.unanswered.today : "-";

  const monthlyCalls = item.total_calls.month || 0;
  const monthlyAnswered = item.answered.month || 0;
  const monthlyUnanswered = item.unanswered.month || 0;

  const avgCalls =
    monthlyCalls > 0 ? (monthlyCalls / 30).toFixed(1) : 0;
  const avgDuration =
    monthlyAnswered > 0
      ? (item.duration.month_seconds / monthlyAnswered).toFixed(1)
      : 0;

  return (
    <Box
      p={{ base: 3, md: 6 }}
      borderRadius="2xl"
      shadow="md"
      bgGradient="linear(to-br, white, #fff8e1)"
      border="1px solid"
      borderColor="goldenrod"
      _hover={{
        transform: "translateY(-5px) scale(1.02)",
        boxShadow: "xl",
      }}
      transition="all 0.3s ease"
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        mb={3}
        gap={2}
      >
        <Heading
          size={{ base: "sm", md: "md" }}
          color="goldenrod"
          wordBreak="break-word"
        >
          {item.fullName || "Unknown User"}
        </Heading>
        <Badge
          colorScheme="yellow"
          fontSize={{ base: "0.7em", md: "0.8em" }}
          px={2}
          py={1}
          borderRadius="md"
        >
          Caller ID: {item.sipId || item.extension}
        </Badge>
      </Flex>

      {/* Month Label */}
      <Badge
        px={3}
        py={1}
        borderRadius="full"
        bg="goldenrod"
        color="white"
        fontSize={{ base: "0.7rem", md: "0.8rem" }}
        fontWeight="semibold"
        shadow="sm"
        alignSelf="flex-start"
        mb={3}
      >
        📅 {label}
      </Badge>

      <Divider borderColor="goldenrod" opacity={0.3} mb={3} />

      {/* Stats Table */}
      <TableContainer width="100%">
        <Table size={{ base: "sm", md: "md" }} variant="simple">
          <Thead>
            <Tr>
              <Th color="black" fontSize={{ base: "xs", md: "sm" }} pl={2}>
                Status
              </Th>
              {isCurrentMonth && (
                <Th color="black" textAlign="center" fontSize={{ base: "xs", md: "sm" }}>
                  Today
                </Th>
              )}
              <Th color="black" textAlign="center" fontSize={{ base: "xs", md: "sm" }}>
                Monthly
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td fontWeight="medium" color="green.700">✅ Answered</Td>
              {isCurrentMonth && (
                <Td textAlign="center">{dailyAnswered}</Td>
              )}
              <Td textAlign="center">{monthlyAnswered}</Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="red.600">❌ Unanswered</Td>
              {isCurrentMonth && (
                <Td textAlign="center">{dailyUnanswered}</Td>
              )}
              <Td textAlign="center">{monthlyUnanswered}</Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="purple.700">📊 Avg Calls</Td>
              {isCurrentMonth && <Td textAlign="center">-</Td>}
              <Td textAlign="center">{avgCalls}</Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="orange.700">⏱ Avg Duration (s)</Td>
              {isCurrentMonth && <Td textAlign="center">-</Td>}
              <Td textAlign="center">{avgDuration}</Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="gray.800">📞 Total Calls</Td>
              {isCurrentMonth && (
                <Td textAlign="center">{dailyCalls}</Td>
              )}
              <Td textAlign="center">{monthlyCalls}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Divider borderColor="gray.200" my={3} />

      {/* Duration Section */}
      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700">
        🕒 <b>Total Duration ({label}):</b>{" "}
        <Text as="span" color="goldenrod" fontWeight="bold">
          {formatDuration(
            item.duration.month_hours,
            item.duration.month_seconds
          )}
        </Text>
      </Text>
    </Box>
  );
};

export default AnalyticsCard;
