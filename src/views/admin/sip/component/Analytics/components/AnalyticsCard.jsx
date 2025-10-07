import React from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
} from "@chakra-ui/react";

const AnalyticsCard = ({ item }) => {

  const now = new Date();
  const currentMonth = now.getMonth() + 1; 
  const currentYear = now.getFullYear();

  const isCurrentMonth =
    item.month === currentMonth && item.year === currentYear;

  const dayLabel = isCurrentMonth ? "Today" : "Previous month";

  return (
    <Box
      p={6}
      borderRadius="2xl"
      shadow="lg"
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
      <Flex justify="space-between" align="center" mb={3}>
        <Heading size="md" color="goldenrod">
          {item.fullName || "Unknown User"}
        </Heading>
        <Badge
          colorScheme="yellow"
          fontSize="0.8em"
          px={2}
          py={1}
          borderRadius="md"
        >
          Ext: {item.extension}
        </Badge>
      </Flex>

      <Divider borderColor="goldenrod" opacity={0.3} mb={3} />

      {/* Stats */}
      <HStack justify="space-between" spacing={3} mb={3}>
        <Stat>
          <StatLabel color="gray.600" fontSize="sm">
            Total Calls ({dayLabel})
          </StatLabel>
          <StatNumber color="gray.800" fontSize="xl">
            {item.total_calls.today}
          </StatNumber>
          <StatHelpText fontSize="sm" color="gray.500">
            Month: {item.total_calls.month}
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel color="green.600" fontSize="sm">
            Answered
          </StatLabel>
          <StatNumber color="green.700" fontSize="xl">
            {item.answered.today}
          </StatNumber>
          <StatHelpText fontSize="sm" color="gray.500">
            Month: {item.answered.month}
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel color="red.500" fontSize="sm">
            Unanswered
          </StatLabel>
          <StatNumber color="red.600" fontSize="xl">
            {item.unanswered.today}
          </StatNumber>
          <StatHelpText fontSize="sm" color="gray.500">
            Month: {item.unanswered.month}
          </StatHelpText>
        </Stat>
      </HStack>

      <Divider borderColor="gray.200" mb={3} />

      {/* Duration */}
      <Box>
        <Text fontSize="sm" color="gray.700" mb={1}>
          ⏱ Duration ({dayLabel}):{" "}
          <Text as="span" fontWeight="bold" color="goldenrod">
            {item.duration.today_hours}h {item.duration.today_seconds}s
          </Text>
        </Text>
        <Text fontSize="sm" color="gray.700">
          📆 Duration (Month):{" "}
          <Text as="span" fontWeight="bold" color="goldenrod">
            {item.duration.month_hours}h {item.duration.month_seconds}s
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

export default AnalyticsCard;
