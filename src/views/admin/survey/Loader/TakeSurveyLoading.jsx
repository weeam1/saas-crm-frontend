import React from "react";
import { Box, VStack, Skeleton, SkeletonText, SkeletonCircle } from "@chakra-ui/react";

const TakeSurveyLoading = () => {
  return (
    <Box p={{ base: 2, md: 4 }}>
      <VStack spacing={4} align="stretch">
        {/* Title Skeleton */}
        <Skeleton height="32px" width="40%" borderRadius="md" />
        {/* Back Button Skeleton */}
        <Skeleton height="32px" width="80px" borderRadius="md" />
        {/* Question Card Skeletons */}
        <Box
          bg="#FFFFFF"
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          boxShadow="sm"
          maxW="100%"
          width="100%"
          mx="auto"
        >
          <VStack spacing={6} align="stretch">
            {[1, 2, 3].map((i) => (
              <Box key={i}>
                <SkeletonText mt="2" noOfLines={1} spacing="4" skeletonHeight="4" width="60%" />
                <VStack spacing={2} mt={2} align="stretch">
                  <Skeleton height="20px" width="90%" borderRadius="md" />
                  <Skeleton height="20px" width="80%" borderRadius="md" />
                  <Skeleton height="20px" width="70%" borderRadius="md" />
                </VStack>
              </Box>
            ))}
            {/* Submit Button Skeleton */}
            <Box display="flex" justifyContent="flex-end">
              <Skeleton height="32px" width="100px" borderRadius="4px" />
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default TakeSurveyLoading;