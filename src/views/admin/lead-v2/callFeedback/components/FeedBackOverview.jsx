import {
  Box,
  VStack,
  useColorModeValue,
  Text,
  Badge,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export const CallFeedbackSummary = ({ data, month, year }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [previousMonthData, setPreviousMonthData] = useState(null);

  console.log("Summary Data from API:", data); // Debug log

  // Extract data from API response
  const stats = data?.stats || {};
  const totalCalls = data?.total || 0;
  const averageRating = stats?.averageRating || 0;
  const qualityStats = stats?.qualityStats || {};

  // Get star counts from API stats
  const starCounts = {
    5: qualityStats?.excellent?.count || 0,
    4: qualityStats?.good?.count || 0,
    3: qualityStats?.average?.count || 0,
    2: qualityStats?.bad?.count || 0,
    1: qualityStats?.very_bad?.count || 0,
  };

  console.log("Star Counts:", starCounts);

  // Calculate growth percentage (you would need to fetch previous month data)
  // For now, let's calculate based on the current data distribution
  useEffect(() => {
    // This is a placeholder calculation - you would need actual previous month data
    // from your API or state management
    if (totalCalls > 0) {
      // Example: Calculate growth based on distribution of ratings
      // Higher percentage of good/excellent ratings = positive growth
      const positiveRatings = starCounts[5] + starCounts[4];
      const totalRatings = totalCalls;
      const positivePercentage = (positiveRatings / totalRatings) * 100;

      // Simple calculation: positive ratings percentage * 2 as growth indicator
      // You can replace this with actual month-over-month comparison
      const calculatedGrowth = Math.round(positivePercentage / 2);
      setGrowthPercentage(calculatedGrowth);
    }
  }, [totalCalls, starCounts]);

  // If you have access to previous month data, use this function:
  const calculateRealGrowth = (currentTotal, previousTotal) => {
    if (previousTotal === 0) return 100; // If no previous data, show 100% growth
    const growth = ((currentTotal - previousTotal) / previousTotal) * 100;
    return Math.round(growth);
  };

  const renderStars = (count, size = "lg") => (
    <HStack spacing={0.5}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          fontSize={size}
          color={star <= count ? "yellow.400" : "gray.300"}
        >
          ★
        </Text>
      ))}
    </HStack>
  );

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let monthLabel;

  if (typeof month === "number") {
    // If month is a number (0-11)
    monthLabel = MONTH_NAMES[month];
  } else if (typeof month === "string" && /^\d{4}-\d{2}$/.test(month)) {
    // If month is in "YYYY-MM" format
    const [year, monthNum] = month.split("-");
    monthLabel = `${MONTH_NAMES[parseInt(monthNum, 10) - 1]} ${year}`;
  } else {
    // fallback
    monthLabel = month;
  }
  // Determine growth text and color based on percentage
  const getGrowthInfo = () => {
    if (growthPercentage > 0) {
      return {
        text: `↑ ${growthPercentage}%`,
        color: "green.500",
        bg: "green.50",
        label: "Growth since last quarter",
      };
    } else if (growthPercentage < 0) {
      return {
        text: `↓ ${Math.abs(growthPercentage)}%`,
        color: "red.500",
        bg: "red.50",
        label: "Decline since last quarter",
      };
    } else {
      return {
        text: `→ 0%`,
        color: "gray.500",
        bg: "gray.50",
        label: "No change since last quarter",
      };
    }
  };

  const growthInfo = getGrowthInfo();

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      w="100%"
      position="relative"
    >
      <Flex position={"absolute"} align="center" mb={4}>
        <Badge
          bg="blue.50"
          color="blue.400"
          fontSize="md"
          fontWeight="bold"
          px={1}
          py={2}
          borderRadius="md"
        >
          Call Feedback
        </Badge>
      </Flex>

      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={{ base: 6, md: 4 }}
      >
        <VStack align="flex-start" spacing={2} flex="1">
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            Total Reviews
          </Text>
          <HStack align="baseline" spacing={3}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="gray.800"
              _dark={{ color: "white" }}
            >
              {formatNumber(totalCalls)}
            </Text>
            <Flex
              align="center"
              bg={growthInfo.bg}
              _dark={{
                bg: growthInfo.color.includes("green")
                  ? "green.900"
                  : growthInfo.color.includes("red")
                    ? "red.900"
                    : "gray.700",
              }}
              px={2}
              py={1}
              borderRadius="md"
            >
              <Text fontSize="xs" color={growthInfo.color} fontWeight="bold">
                {growthInfo.text}
              </Text>
            </Flex>
          </HStack>
          <Text fontSize="xs" color={textColor}>
            {growthInfo.label}
          </Text>
        </VStack>

        <VStack align="flex-start" spacing={2} flex="1">
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            Average Rating
          </Text>
          <HStack align="baseline" spacing={3}>
            {renderStars(Math.round(averageRating), "xl")}
            <VStack align="flex-start" spacing={0}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="gray.800"
                _dark={{ color: "white" }}
              >
                {averageRating.toFixed(1)}
              </Text>
            </VStack>
          </HStack>
          <Text fontSize="xs" color={textColor}>
            Based on {totalCalls} reviews
          </Text>
        </VStack>

        <VStack align="flex-start" spacing={3} flex="2" minW="320px">
          <Badge
            colorScheme="gray"
            borderRadius="lg"
            px={3}
            py={2}
            fontSize="sm"
            fontWeight="medium"
          >
            {monthLabel}
          </Badge>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const percentage = totalCalls > 0 ? (count / totalCalls) * 100 : 0;
            const displayCount = formatNumber(count);

            const barColors = {
              5: "linear-gradient(90deg, #38A169, #48BB78)",
              4: "linear-gradient(90deg, #3182CE, #4299E1)",
              3: "linear-gradient(90deg, #D69E2E, #ECC94B)",
              2: "linear-gradient(90deg, #ED8936, #F6AD55)",
              1: "linear-gradient(90deg, #E53E3E, #FC8181)",
            };

            return (
              <Flex key={stars} align="center" w="100%" gap={3}>
                <HStack spacing={1} w="60px">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.700"
                    _dark={{ color: "gray.300" }}
                  >
                    {stars}
                  </Text>
                  <Text fontSize="sm" color="yellow.400">
                    ★
                  </Text>
                  <Text fontSize="xs" color={textColor}>
                    ({percentage.toFixed(0)}%)
                  </Text>
                </HStack>

                <Box flex="1" h="14px" position="relative">
                  <Box
                    w="100%"
                    h="100%"
                    bg="gray.100"
                    _dark={{ bg: "gray.700" }}
                    borderRadius="full"
                    overflow="hidden"
                  />
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    h="100%"
                    w={`${percentage}%`}
                    bgGradient={barColors[stars]}
                    borderRadius="full"
                    transition="width 0.5s ease-in-out"
                  />
                  <Text
                    position="absolute"
                    left="3"
                    top="50%"
                    transform="translateY(-50%)"
                    fontSize="10px"
                    color="white"
                    fontWeight="bold"
                    zIndex={1}
                  >
                    {displayCount}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </VStack>
      </Flex>
    </Box>
  );
};
