import React from "react";
import { Box, Flex, Skeleton, Grid } from "@chakra-ui/react";

const CallCardSkeleton = () => {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      mb={4}
      height="340px"
    >
      <Flex justify="space-between" mb={4}>
        <Skeleton width="80px" height="24px" borderRadius="full" />
        <Skeleton width="80px" height="24px" />
      </Flex>

      <Skeleton height="1px" mb={3} />

      <Box mb={3}>
        <Skeleton height="12px" width="40px" mb={1} />
        <Skeleton height="16px" width="120px" />
      </Box>

      <Flex justify="space-between" mb={3}>
        <Box>
          <Skeleton height="12px" width="40px" mb={1} />
          <Skeleton height="16px" width="100px" />
        </Box>
        <Box>
          <Skeleton height="12px" width="30px" mb={1} />
          <Flex align="center">
            <Skeleton height="16px" width="100px" mr={2} />
            <Skeleton height="16px" width="16px" />
          </Flex>
        </Box>
      </Flex>

      <Flex justify="space-between">
        <Box>
          <Skeleton height="12px" width="40px" mb={1} />
          <Skeleton height="16px" width="120px" />
        </Box>
        <Box textAlign="right">
          <Skeleton height="12px" width="60px" mb={1} />
          <Skeleton height="16px" width="60px" />
        </Box>
      </Flex>

      <Box mt={3}>
        <Skeleton height="12px" width="70px" mb={4} />
        <Skeleton height="40px" width="100%" borderRadius="md" />
      </Box>
    </Box>
  );
};

const CallGridSkeleton = ({ count = 10 }) => {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={4}
      p={4}
    >
      {[...Array(count)].map((_, index) => (
        <CallCardSkeleton key={index} />
      ))}
    </Grid>
  );
};

export { CallCardSkeleton, CallGridSkeleton };