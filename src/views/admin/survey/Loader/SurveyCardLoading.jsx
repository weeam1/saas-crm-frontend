import React from "react";
import { Box, Skeleton, SkeletonText, Flex } from "@chakra-ui/react";

const SurveyCardLoading = () => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={{ base: 2, md: 3, lg: 3 }}
      mb={3}
      bg="#FFFFFF"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box display="flex" justifyContent="flex-end">
        <Skeleton height="18px" width="18px" borderRadius="full" />
      </Box>
      <Box flex="1">
        <SkeletonText mt="2" noOfLines={2} spacing="2" skeletonHeight="4" />
        <SkeletonText mt="2" noOfLines={1} spacing="2" skeletonHeight="3" width="60%" />
        <Flex direction="column" gap={2} mb={3} width="80%" mt="20px">
          <Skeleton height="16px" width="100%" borderRadius="md" />
          <Skeleton height="16px" width="100%" borderRadius="md" />
          <Skeleton height="16px" width="100%" borderRadius="md" />
          <Skeleton height="32px" width="100%" borderRadius="4px" mt="10px" />
        </Flex>
      </Box>
      <Flex justify="flex-end">
        <Skeleton height="12px" width="60px" borderRadius="md" />
      </Flex>
    </Box>
  );
};

export default SurveyCardLoading;