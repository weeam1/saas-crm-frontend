import {
  Box,
  VStack,
  useColorModeValue,
  Text,
  Badge,
  Flex,
  HStack,
} from "@chakra-ui/react";

export const CallFeedbackSummary = ({ data, month }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  const getStarRating = (quality) => {
    const mapping = {
      excellent: 5,
      good: 4,
      average: 3,
      bad: 2,
      very_bad: 1,
    };
    return mapping[quality] || 0;
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

  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  data.forEach((item) => {
    const stars = getStarRating(item.callQuality);
    starCounts[stars] += 1;
  });

  const totalCalls = data.length;
  const averageRating =
    totalCalls > 0
      ? data.reduce((sum, item) => sum + getStarRating(item.callQuality), 0) /
        totalCalls
      : 0;

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
  const monthLabel = typeof month === "number" ? MONTH_NAMES[month] : month;

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="xl"
      shadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
      mb={6}
      w="100%"
    >
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
              bg="green.50"
              _dark={{ bg: "green.900" }}
              px={2}
              py={1}
              borderRadius="md"
            >
              <Text fontSize="xs" color="green.500" fontWeight="bold">
                ↑ 12%
              </Text>
            </Flex>
          </HStack>
          <Text fontSize="xs" color={textColor}>
            Growth since last quarter
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
            const count = starCounts[stars];
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
                {/* Star label */}
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

                {/* Progress bar */}
                <Box flex="1" h="20px" position="relative">
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
                  {/* {percentage > 25 && ( */}
                  <Text
                    position="absolute"
                    left="3"
                    top="50%"
                    transform="translateY(-50%)"
                    fontSize="xs"
                    color="white"
                    fontWeight="bold"
                    zIndex={1}
                  >
                    {displayCount}
                  </Text>
                </Box>

                {/* {percentage <= 25 && ( */}
                {/* <Text
                  fontSize="sm"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  minW="50px"
                  textAlign="right"
                  fontWeight="medium"
                >
                  {displayCount}
                </Text> */}
                {/* )} */}
              </Flex>
            );
          })}
        </VStack>
      </Flex>
    </Box>
  );
};
