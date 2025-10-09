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
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontSize: { base: "0.8rem", md: "0.9rem" },
      }}
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

      {/* Stats */}
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between" wrap="wrap" spacing={3}>
          <Stat>
            <StatLabel color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
              Total Calls
            </StatLabel>
            <StatNumber color="gray.800" fontSize={{ base: "md", md: "xl" }}>
              {item.total_calls.today}
            </StatNumber>
            <StatHelpText
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.500"
            >
              Month: {item.total_calls.month}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel color="green.600" fontSize={{ base: "xs", md: "sm" }}>
              Answered
            </StatLabel>
            <StatNumber color="green.700" fontSize={{ base: "md", md: "xl" }}>
              {item.answered.today}
            </StatNumber>
            <StatHelpText
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.500"
            >
              Month: {item.answered.month}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel color="red.500" fontSize={{ base: "xs", md: "sm" }}>
              Unanswered
            </StatLabel>
            <StatNumber color="red.600" fontSize={{ base: "md", md: "xl" }}>
              {item.unanswered.today}
            </StatNumber>
            <StatHelpText
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.500"
            >
              Month: {item.unanswered.month}
            </StatHelpText>
          </Stat>
        </HStack>
      </VStack>

      <Divider borderColor="gray.200" my={3} />

      {/* Duration Section */}
      <Box>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700" mb={1}>
          ⏱ Duration (Daily):{" "}
          <Text as="span" fontWeight="bold" color="goldenrod">
            {formatDuration(
              item.duration.today_hours,
              item.duration.today_seconds
            )}
          </Text>
        </Text>

        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.700">
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
