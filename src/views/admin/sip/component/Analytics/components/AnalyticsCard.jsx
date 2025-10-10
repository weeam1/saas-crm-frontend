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

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "0h 0m 0s";
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

  const dailyCalls = isCurrentMonth ? item?.total_calls?.today || 0 : 0;
  const dailyAnswered = isCurrentMonth ? item?.answered?.today || 0 : 0;
  const dailyUnanswered = isCurrentMonth ? item?.unanswered?.today || 0 : 0;
  const dailySeconds = isCurrentMonth ? item?.duration?.today_seconds || 0 : 0;

  const monthlyCalls = item?.total_calls?.month || 0;
  const monthlyAnswered = item?.answered?.month || 0;
  const monthlyUnanswered = item?.unanswered?.month || 0;
  const monthSeconds = item?.duration?.month_seconds || 0;

  const dailyAvgDurationSeconds =
    dailyAnswered > 0 ? dailySeconds / dailyAnswered : 0;
  const avgCallsSeconds = monthlyCalls > 0 ? monthSeconds / 30 : 0;
  const avgDurationSeconds =
    monthlyAnswered > 0 ? monthSeconds / monthlyAnswered : 0;

  const dailyAvgDuration = formatDuration(dailyAvgDurationSeconds);
  const avgCalls = formatDuration(avgCallsSeconds);
  const avgDuration = formatDuration(avgDurationSeconds);

  return (
    <Box
      p={{ base: 3, md: 6 }}
      borderRadius="2xl"
      shadow="md"
      bgGradient="linear(to-br, white, #fff8e1)"
      border="1px solid"
      borderColor="goldenrod"
      _hover={{
        transform: "translateY(-4px) scale(1.01)",
        boxShadow: "lg",
      }}
      transition="all 0.25s ease"
      fontSize={{ base: "xs", sm: "sm", md: "md" }}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        mb={2}
        gap={2}
      >
        <Heading
          size={{ base: "xs", sm: "sm", md: "md" }}
          color="goldenrod"
          noOfLines={1}
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          maxW="100%"
        >
          {item.fullName || "Unknown User"}
        </Heading>

        <Badge
          colorScheme="yellow"
          fontSize={{ base: "0.65em", sm: "0.75em", md: "0.8em" }}
          px={{ base: 1.5, sm: 2 }}
          py={{ base: 0.5, sm: 1 }}
          borderRadius="md"
          whiteSpace="nowrap"
        >
          Caller ID: {item.sipId || "-"}
        </Badge>
      </Flex>

      {/* Month Label */}
      <Badge
        px={{ base: 2, sm: 3 }}
        py={{ base: 0.5, sm: 1 }}
        borderRadius="full"
        bg="goldenrod"
        color="white"
        fontSize={{ base: "0.65rem", sm: "0.75rem", md: "0.8rem" }}
        fontWeight="semibold"
        shadow="sm"
        mb={3}
      >
        📅 {label}
      </Badge>

      <Divider borderColor="goldenrod" opacity={0.3} mb={2} />

      {/* Stats Table */}
      <TableContainer width="100%">
        <Table size={{ base: "sm", md: "md" }} variant="simple">
          <Thead>
            <Tr>
              <Th color="black" fontSize={{ base: "xs", sm: "sm" }}>
                Status
              </Th>
              {isCurrentMonth && (
                <Th
                  color="black"
                  textAlign="center"
                  fontSize={{ base: "xs", sm: "sm" }}
                >
                  Today
                </Th>
              )}
              <Th
                color="black"
                textAlign="center"
                fontSize={{ base: "xs", sm: "sm" }}
              >
                Monthly
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td fontWeight="medium" color="green.700">
                ✅ Answered
              </Td>
              {isCurrentMonth && <Td textAlign="center">{dailyAnswered}</Td>}
              <Td textAlign="center">{monthlyAnswered}</Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="red.600">
                ❌ Unanswered
              </Td>
              {isCurrentMonth && <Td textAlign="center">{dailyUnanswered}</Td>}
              <Td textAlign="center">{monthlyUnanswered}</Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="purple.700">
                📊 Avg Calls (Time)
              </Td>
              {isCurrentMonth && (
                <Td textAlign="center" color="purple.600" fontWeight="semibold">
                  {avgCalls}
                </Td>
              )}
              <Td textAlign="center" color="purple.600" fontWeight="semibold">
                {avgCalls}
              </Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="orange.700">
                ⏱ Avg Duration
              </Td>
              {isCurrentMonth && (
                <Td textAlign="center" color="orange.600" fontWeight="semibold">
                  {dailyAvgDuration}
                </Td>
              )}
              <Td textAlign="center" color="orange.600" fontWeight="semibold">
                {avgDuration}
              </Td>
            </Tr>

            <Tr>
              <Td fontWeight="medium" color="gray.800">
                📞 Total Calls
              </Td>
              {isCurrentMonth && <Td textAlign="center">{dailyCalls}</Td>}
              <Td textAlign="center" fontWeight="bold" color="gray.800">
                {monthlyCalls}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Divider borderColor="gray.200" my={2} />

      {/* Duration Section */}
      <Text
        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
        color="gray.700"
        noOfLines={1}
      >
        🕒 <b>Total Duration ({label}):</b>{" "}
        <Text as="span" color="goldenrod" fontWeight="bold">
          {formatDuration(monthSeconds)}
        </Text>
      </Text>
    </Box>
  );
};

export default AnalyticsCard;
