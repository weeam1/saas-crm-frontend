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
    if (year === currentYear && month === currentMonth) {
      return "This Month";
    } else if (year === currentYear && month === currentMonth - 1) {
      return "Last Month";
    } else {
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
      });
      return `${monthName} ${year}`;
    }
  };

  const label = getLabel();

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
          caller Id: {item.sipId}
        </Badge>
      </Flex>

      {/* Month Label */}
      <Flex justify="flex-start" align="center" mb={3}>
        <Badge
          px={3}
          py={1}
          borderRadius="full"
          bg="goldenrod"
          color="white"
          fontSize="0.75rem"
          fontWeight="semibold"
          shadow="sm"
          letterSpacing="wide"
        >
          📅 {label}
        </Badge>
      </Flex>

      <Divider borderColor="goldenrod" opacity={0.3} mb={3} />

      {/* Stats */}
      <HStack justify="space-between" spacing={3} mb={3}>
        <Stat>
          <StatLabel color="gray.600" fontSize="sm">
            Total Calls
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

      {/* Duration Section */}
      <Box>
        <Text fontSize="sm" color="gray.700" mb={1}>
          ⏱ Duration ({label} - Daily):{" "}
          <Text as="span" fontWeight="bold" color="goldenrod">
            {formatDuration(
              item.duration.today_hours,
              item.duration.today_seconds
            )}
          </Text>
        </Text>

        <Text fontSize="sm" color="gray.700">
          📆 Total Duration ({label}):{" "}
          <Text as="span" fontWeight="bold" color="goldenrod">
            {formatDuration(
              item.duration.month_hours,
              item.duration.month_seconds
            )}
          </Text>
        </Text>
      </Box>
    </Box>
  );
};

export default AnalyticsCard;
