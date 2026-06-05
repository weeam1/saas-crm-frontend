import React from "react";
import {
  Box,
  VStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Stack,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";

// Skeleton for CallFeedbackCard component
export const CallFeedbackCardSkeleton = () => {
  const colors = useModalColors();

  return (
    <Box
      bg={colors.bg}
      borderRadius="xl"
      border="1px solid"
      borderColor={colors.borderColor}
      p={{ base: 4 }}
      shadow={colors.cardShadow}
      position="relative"
      overflow="hidden"
    >
      {/* Quality indicator bar skeleton - using gold accent */}
      <Skeleton
        startColor={colors.bgInput}
        endColor={colors.accentGold}
        height="4px"
        position="absolute"
        top={0}
        left={0}
        right={0}
      />

      {/* Glow effect skeleton */}
      <Box
        position="absolute"
        top="4px"
        right={0}
        w="140px"
        h="140px"
        opacity={0.3}
        borderRadius="0 0 0 100%"
        bgGradient={`linear(to-br, transparent, ${colors.bgDeep})`}
      >
        <Skeleton
          startColor={colors.bgInput}
          endColor={colors.bgInputHover}
          height="100%"
        />
      </Box>

      <VStack align="stretch" pt="2" spacing={4}>
        {/* User Profile Section */}
        <Stack direction="row" spacing={3} align="center">
          <SkeletonCircle
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            size="16"
          />
          <Box flex={1}>
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              mb={2}
            >
              <Skeleton
                startColor={colors.bgInput}
                endColor={colors.bgInputHover}
                height="20px"
                width="120px"
              />
              <SkeletonCircle
                startColor={colors.bgInput}
                endColor={colors.bgInputHover}
                size="8"
              />
            </Stack>
            <Stack direction="row" justify="space-between" align="center">
              <Box>
                <Skeleton
                  startColor={colors.bgInput}
                  endColor={colors.bgInputHover}
                  height="16px"
                  width="80px"
                  mb={2}
                />
                <Skeleton
                  startColor={colors.bgInput}
                  endColor={colors.bgInputHover}
                  height="14px"
                  width="60px"
                />
              </Box>
              <SkeletonCircle
                startColor={colors.bgInput}
                endColor={colors.bgInputHover}
                size="6"
              />
            </Stack>
          </Box>
        </Stack>

        {/* Extension ID */}
        <Skeleton
          startColor={colors.bgInput}
          endColor={colors.bgInputHover}
          height="20px"
          width="100px"
        />

        {/* Phone and Reason */}
        <VStack align="stretch" spacing={3}>
          <Stack direction="row" align="center" spacing={2}>
            <SkeletonCircle
              startColor={colors.bgInput}
              endColor={colors.bgInputHover}
              size="4"
            />
            <Skeleton
              startColor={colors.bgInput}
              endColor={colors.bgInputHover}
              height="16px"
              width="150px"
            />
          </Stack>

          <Stack direction="row" align="center" spacing={2}>
            <SkeletonCircle
              startColor={colors.bgInput}
              endColor={colors.bgInputHover}
              size="4"
            />
            <Skeleton
              startColor={colors.bgInput}
              endColor={colors.bgInputHover}
              height="16px"
              width="120px"
            />
          </Stack>
        </VStack>

        {/* Description */}
        <Box pt={2}>
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="14px"
            mb={1}
          />
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="14px"
            width="80%"
          />
        </Box>
      </VStack>
    </Box>
  );
};

// Skeleton for CallFeedbackHeader component
export const CallFeedbackHeaderSkeleton = () => {
  const colors = useModalColors();

  return (
    <Box
      p={3}
      borderWidth="1px"
      borderRadius="lg"
      bg={colors.bg}
      borderColor={colors.borderColor}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        align="center"
        wrap="wrap"
      >
        {/* Search Input */}
        <Skeleton
          startColor={colors.bgInput}
          endColor={colors.bgInputHover}
          height="40px"
          width={{ base: "100%", md: "200px" }}
        />

        {/* Buttons */}
        <Stack direction="row" spacing={2}>
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="40px"
            width="150px"
          />
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="40px"
            width="80px"
          />
        </Stack>

        {/* Spacer */}
        <Box flex="1" />

        {/* Pagination - using gold accent for active page hint */}
        <Stack direction="row" spacing={2} align="center">
          {[1, 2, 3, 4, 5].map((item) => (
            <SkeletonCircle
              key={item}
              startColor={colors.bgInput}
              endColor={item === 3 ? colors.accentGold : colors.bgInputHover}
              size="8"
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

// Skeleton for CallFeedbackSummary component
export const CallFeedbackSummarySkeleton = () => {
  const colors = useModalColors();

  return (
    <Box
      bg={colors.bg}
      p={6}
      borderRadius="xl"
      shadow={colors.modalShadow}
      borderWidth="1px"
      borderColor={colors.borderColor}
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
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="16px"
            width="100px"
            mb={2}
          />
          <Stack direction="row" align="baseline" spacing={3}>
            <Skeleton
              startColor={colors.bgInput}
              endColor={colors.bgInputHover}
              height="36px"
              width="80px"
            />
            <Skeleton
              startColor={colors.bgInput}
              endColor={colors.bgInputHover}
              height="24px"
              width="60px"
            />
          </Stack>
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="14px"
            width="120px"
            mt={2}
          />
        </Box>

        {/* Average Rating */}
        <Box flex="1">
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="16px"
            width="100px"
            mb={2}
          />
          <Stack direction="row" align="baseline" spacing={3}>
            <Stack direction="row" spacing={0.5}>
              {[1, 2, 3, 4, 5].map((star) => (
                <SkeletonCircle
                  key={star}
                  startColor={colors.bgInput}
                  endColor={colors.accentGold}
                  size="6"
                />
              ))}
            </Stack>
            <Skeleton
              startColor={colors.bgInput}
              endColor={colors.bgInputHover}
              height="28px"
              width="60px"
            />
          </Stack>
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="14px"
            width="120px"
            mt={2}
          />
        </Box>

        {/* Star Distribution */}
        <Box flex="2" minW="320px">
          <Skeleton
            startColor={colors.bgInput}
            endColor={colors.bgInputHover}
            height="30px"
            width="100px"
            mb={4}
          />

          {[1, 2, 3, 4, 5].map((item) => (
            <Stack key={item} direction="row" align="center" spacing={3} mb={3}>
              <Skeleton
                startColor={colors.bgInput}
                endColor={colors.bgInputHover}
                height="20px"
                width="40px"
              />
              <Skeleton
                startColor={colors.bgInput}
                endColor={item === 3 ? colors.accentGold : colors.bgInputHover}
                height="20px"
                flex="1"
                borderRadius="full"
              />
              <Skeleton
                startColor={colors.bgInput}
                endColor={colors.bgInputHover}
                height="20px"
                width="40px"
              />
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

// Main skeleton wrapper for the entire CallFeedback component
export const CallFeedbackSkeleton = () => {
  const colors = useModalColors();

  return (
    <Box bg={colors.bgDeep} p={2}>
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