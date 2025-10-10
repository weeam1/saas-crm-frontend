import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Divider,
  VStack,
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

  //  Daily values
  const dailyCalls = isCurrentMonth ? item.total_calls.today : 0;
  const dailyAnswered = isCurrentMonth ? item.answered.today : 0;
  const dailyUnanswered = isCurrentMonth ? item.unanswered.today : 0;

  // Monthly values
  const monthlyCalls = item.total_calls.month;
  const monthlyAnswered = item.answered.month;
  const monthlyUnanswered = item.unanswered.month;

  // Average calls and duration
  const avgCalls =
    monthlyCalls > 0 ? (monthlyCalls / 30).toFixed(1) : 0;
  const avgDuration =
    monthlyAnswered > 0
      ? (item.duration.month_seconds / monthlyAnswered).toFixed(1)
      : 0;

  return (
    <Box
      p={{ base: 4, md: 6 }}
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
          Caller ID: {item.sipId}
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

      {/*  Summary Section */}
      <VStack align="flex-start" spacing={2}>
        {/*  Daily Section (only if current month) */}
        {isCurrentMonth && (
          <>
            <Text fontWeight="bold" color="goldenrod">
              📅 Daily Summary
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }}>
              📞 <b>Total Calls:</b> {dailyCalls}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="green.700">
              ✅ <b>Answered:</b> {dailyAnswered}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="red.600">
              ❌ <b>Unanswered:</b> {dailyUnanswered}
            </Text>
            <Text fontSize={{ base: "sm", md: "md" }} color="orange.700">
              ⏱ <b>Duration:</b>{" "}
              {formatDuration(
                item.duration.today_hours,
                item.duration.today_seconds
              )}
            </Text>
            <Divider borderColor="gray.300" my={2} />
          </>
        )}

        {/*  Monthly Section */}
        <Text fontWeight="bold" color="goldenrod">
          🗓️ Monthly Summary
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }}>
          📞 <b>Total Calls:</b> {monthlyCalls}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="green.700">
          ✅ <b>Answered:</b> {monthlyAnswered}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="red.600">
          ❌ <b>Unanswered:</b> {monthlyUnanswered}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="purple.700">
          📊 <b>Average Calls/Day:</b> {avgCalls}
        </Text>
        <Text fontSize={{ base: "sm", md: "md" }} color="orange.700">
          ⏱ <b>Avg Call Duration:</b> {avgDuration}s
        </Text>
        <Text fontSize={{ base: "sm", md: "sm" }} color="gray.700">
          🕒 <b>Total Duration:</b>{" "}
          {formatDuration(
            item.duration.month_hours,
            item.duration.month_seconds
          )}
        </Text>
      </VStack>
    </Box>
  );
};

export default AnalyticsCard;
