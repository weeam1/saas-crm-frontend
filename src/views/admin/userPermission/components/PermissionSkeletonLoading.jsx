import {
  Box,
  Flex,
  Skeleton,
  SimpleGrid,
} from "@chakra-ui/react";

const PermissionSkeletonLoading = ({ count = 2 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          p={4}
          w="100%"
        >
          {/* Card Header Skeleton */}
          <Flex justify="space-between" align="center" mb={3}>
            <Skeleton height="16px" width="150px" />
            <Skeleton height="16px" width="80px" />
          </Flex>

          {/* Divider mimic */}
          <Skeleton height="1px" mb={3} />

          {/* Actions Grid Skeleton */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton
                key={idx}
                height="20px"
                borderRadius="md"
                width="80%"
              />
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </>
  );
};

export default PermissionSkeletonLoading;
