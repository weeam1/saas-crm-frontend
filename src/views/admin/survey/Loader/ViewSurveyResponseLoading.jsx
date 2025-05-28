import React from "react";
import { Box, Flex, Skeleton, SkeletonText, VStack } from "@chakra-ui/react";

const ViewSurveyResponseLoading = () => (
  <Flex h="100vh" overflow="hidden">
    <Box flex="1" overflowY="auto">
      <Box p={8}>
        <Skeleton height="36px" width="40%" mb={6} />
        <Skeleton height="32px" width="80px" mb={6} />
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i} mb={6}>
              <SkeletonText noOfLines={1} spacing="4" skeletonHeight="4" width="60%" mb={2} />
              <Skeleton height="20px" width="90%" mb={2} />
              <Skeleton height="20px" width="80%" mb={2} />
              <Skeleton height="20px" width="70%" />
            </Box>
          ))}
          <Flex justify="flex-end" mt={8}>
            <Skeleton height="32px" width="100px" borderRadius="4px" />
          </Flex>
        </Box>
      </Box>
    </Box>
    <Box width="400px" borderRight="1px solid" borderColor="gray.200" bg="white" overflowY="auto">
      <Box p={4}>
        <Skeleton height="40px" width="100%" mb={4} />
      </Box>
      <VStack align="stretch" spacing={2} px={4} pb={4}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="56px" borderRadius="md" />
        ))}
      </VStack>
    </Box>
  </Flex>
);

export default ViewSurveyResponseLoading;