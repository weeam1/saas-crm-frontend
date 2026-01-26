import React, { useState } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Center,
} from "@chakra-ui/react";

// Skeleton for CallFeedbackCard component
export const CallFeedbackCardSkeleton = () => {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      p={{ base: 4 }}
      shadow="md"
      position="relative"
      overflow="hidden"
    >
      {/* Quality indicator bar skeleton */}
      <Skeleton height="4px" position="absolute" top={0} left={0} right={0} />

      {/* Glow effect skeleton */}
      <Box
        position="absolute"
        top="4px"
        right={0}
        w="140px"
        h="140px"
        opacity={0.6}
        borderRadius="0 0 0 100%"
      >
        <Skeleton height="100%" />
      </Box>

      <VStack align="stretch" pt="2" spacing={4}>
        {/* User Profile Section */}
        <Stack direction="row" spacing={3} align="center">
          <SkeletonCircle size="16" />
          <Box flex={1}>
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              mb={2}
            >
              <Skeleton height="20px" width="120px" />
              <SkeletonCircle size="8" />
            </Stack>
            <Stack direction="row" justify="space-between" align="center">
              <Box>
                <Skeleton height="16px" width="80px" mb={2} />
                <Skeleton height="14px" width="60px" />
              </Box>
              <SkeletonCircle size="6" />
            </Stack>
          </Box>
        </Stack>

        {/* Extension ID */}
        <Skeleton height="20px" width="100px" />

        {/* Phone and Reason */}
        <VStack align="stretch" spacing={3}>
          <Stack direction="row" align="center" spacing={2}>
            <SkeletonCircle size="4" />
            <Skeleton height="16px" width="150px" />
          </Stack>

          <Stack direction="row" align="center" spacing={2}>
            <SkeletonCircle size="4" />
            <Skeleton height="16px" width="120px" />
          </Stack>
        </VStack>

        {/* Description */}
        <Box pt={2}>
          <Skeleton height="14px" mb={1} />
          <Skeleton height="14px" width="80%" />
        </Box>
      </VStack>
    </Box>
  );
};

// Skeleton for CallFeedbackHeader component
export const CallFeedbackHeaderSkeleton = () => {
  return (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="lg"
      bg={useColorModeValue("white", "gray.800")}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        align="center"
        wrap="wrap"
      >
        {/* Search Input */}
        <Skeleton height="40px" width={{ base: "100%", md: "200px" }} />

        {/* Buttons */}
        <Stack direction="row" spacing={2}>
          <Skeleton height="40px" width="150px" />
          <Skeleton height="40px" width="80px" />
        </Stack>

        {/* Spacer */}
        <Box flex="1" />

        {/* Pagination */}
        <Stack direction="row" spacing={2} align="center">
          {[1, 2, 3, 4, 5].map((item) => (
            <SkeletonCircle key={item} size="8" />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

// Skeleton for CallFeedbackSummary component
export const CallFeedbackSummarySkeleton = () => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.700")}
      p={6}
      borderRadius="xl"
      shadow="lg"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      mb={6}
      w="100%"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={6}
        align="center"
      >
        {/* Total Reviews */}
        <Box flex="1">
          <Skeleton height="16px" width="100px" mb={2} />
          <Stack direction="row" align="baseline" spacing={3}>
            <Skeleton height="36px" width="80px" />
            <Skeleton height="24px" width="60px" />
          </Stack>
          <Skeleton height="14px" width="120px" mt={2} />
        </Box>

        {/* Average Rating */}
        <Box flex="1">
          <Skeleton height="16px" width="100px" mb={2} />
          <Stack direction="row" align="baseline" spacing={3}>
            <Stack direction="row" spacing={0.5}>
              {[1, 2, 3, 4, 5].map((star) => (
                <SkeletonCircle key={star} size="6" />
              ))}
            </Stack>
            <Skeleton height="28px" width="60px" />
          </Stack>
          <Skeleton height="14px" width="120px" mt={2} />
        </Box>

        {/* Star Distribution */}
        <Box flex="2" minW="320px">
          <Skeleton height="30px" width="100px" mb={4} />

          {[1, 2, 3, 4, 5].map((item) => (
            <Stack key={item} direction="row" align="center" spacing={3} mb={3}>
              <Skeleton height="20px" width="40px" />
              <Skeleton height="20px" flex="1" borderRadius="full" />
              <Skeleton height="20px" width="40px" />
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

// Main skeleton wrapper for the entire CallFeedback component
export const CallFeedbackSkeleton = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={bgColor} p={2}>
      <Box mx="auto">
        <VStack spacing={4} align="stretch">
          {/* Summary Skeleton */}
          <CallFeedbackSummarySkeleton />

          {/* Header Skeleton */}
          <CallFeedbackHeaderSkeleton />

          {/* Cards Grid Skeleton */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
            spacing={6}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <CallFeedbackCardSkeleton key={index} />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </Box>
  );
};
