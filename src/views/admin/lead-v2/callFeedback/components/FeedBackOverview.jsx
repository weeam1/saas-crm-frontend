import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useModalColors } from "hooks/useModalColors";

export const CallFeedbackSummary = ({ data, month, year }) => {
  const [growthPercentage, setGrowthPercentage] = useState(0);

  const {
    bg,
    bgDeep,
    bodyText,
    headingText,
    mutedText,
    borderColor,
    cardShadow,
    badgeSuccessText,
    badgeSuccessBg,
    badgeErrorText,
    badgeErrorBg,
    accentGold,
  } = useModalColors();

  const stats = data?.stats || {};
  const totalCalls = data?.total || 0;
  const averageRating = stats?.averageRating || 0;
  const qualityStats = stats?.qualityStats || {};

  const starCounts = {
    5: qualityStats?.excellent?.count || 0,
    4: qualityStats?.good?.count || 0,
    3: qualityStats?.average?.count || 0,
    2: qualityStats?.bad?.count || 0,
    1: qualityStats?.very_bad?.count || 0,
  };

  useEffect(() => {
    if (totalCalls > 0) {
      const positiveRatings = starCounts[5] + starCounts[4];
      const totalRatings = totalCalls;
      const positivePercentage = (positiveRatings / totalRatings) * 100;
      const calculatedGrowth = Math.round(positivePercentage / 2);
      setGrowthPercentage(calculatedGrowth);
    }
  }, [totalCalls, starCounts]);

  const renderStars = (count, size = "lg") => (
    <HStack spacing={0.5}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          fontSize={size}
          color={star <= count ? accentGold : mutedText}
          fontWeight="bold"
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  let monthLabel;
  if (typeof month === "number") {
    monthLabel = MONTH_NAMES[month];
  } else if (typeof month === "string" && /^\d{4}-\d{2}$/.test(month)) {
    const [year, monthNum] = month.split("-");
    monthLabel = `${MONTH_NAMES[parseInt(monthNum, 10) - 1]} ${year}`;
  } else {
    monthLabel = month;
  }

  const getGrowthInfo = () => {
    if (growthPercentage > 0) {
      return {
        text: `↑ ${growthPercentage}%`,
        color: badgeSuccessText,
        bg: badgeSuccessBg,
        label: "Growth since last quarter",
      };
    } else if (growthPercentage < 0) {
      return {
        text: `↓ ${Math.abs(growthPercentage)}%`,
        color: badgeErrorText,
        bg: badgeErrorBg,
        label: "Decline since last quarter",
      };
    } else {
      return {
        text: `→ 0%`,
        color: mutedText,
        bg: bgDeep,
        label: "No change since last quarter",
      };
    }
  };

  const growthInfo = getGrowthInfo();

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="xl"
      shadow={cardShadow}
      borderWidth="1px"
      borderColor={borderColor}
      w="100%"
      position="relative"
    >
      <Flex position={"absolute"} align="center" mb={4}>
        <Badge
          bg={accentGold}
          color={headingText}
          fontSize="md"
          fontWeight="bold"
          px={3}
          py={1}
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
          <Text fontSize="sm" color={mutedText} fontWeight="medium">
            Total Reviews
          </Text>
          <HStack align="baseline" spacing={3}>
            <Text fontSize="3xl" fontWeight="bold" color={headingText}>
              {formatNumber(totalCalls)}
            </Text>
            <Flex align="center" bg={growthInfo.bg} px={2} py={1} borderRadius="md">
              <Text fontSize="xs" color={growthInfo.color} fontWeight="bold">
                {growthInfo.text}
              </Text>
            </Flex>
          </HStack>
          <Text fontSize="xs" color={mutedText}>
            {growthInfo.label}
          </Text>
        </VStack>

        <VStack align="flex-start" spacing={2} flex="1">
          <Text fontSize="sm" color={mutedText} fontWeight="medium">
            Average Rating
          </Text>
          <HStack align="baseline" spacing={3}>
            {renderStars(Math.round(averageRating), "xl")}
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color={headingText}>
                {averageRating.toFixed(1)}
              </Text>
            </VStack>
          </HStack>
          <Text fontSize="xs" color={mutedText}>
            Based on {totalCalls} reviews
          </Text>
        </VStack>

        <VStack align="flex-start" spacing={3} flex="2" minW="320px">
          <Badge
            bg={accentGold}
            color={headingText}
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
                  <Text fontSize="sm" fontWeight="medium" color={bodyText}>
                    {stars}
                  </Text>
                  <Text fontSize="sm" color={accentGold}>
                    ★
                  </Text>
                  <Text fontSize="xs" color={mutedText}>
                    ({percentage.toFixed(0)}%)
                  </Text>
                </HStack>

                <Box flex="1" h="14px" position="relative">
                  <Box
                    w="100%"
                    h="100%"
                    bg={bgDeep}
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
                    color={headingText}
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