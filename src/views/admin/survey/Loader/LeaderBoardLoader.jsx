import React from "react";
import { Box, Flex, Skeleton, SkeletonText, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

const LeaderBoardLoader = () => (
  <Box p={4} bg="white">
    {/* Header Skeleton */}
    <Flex mb={6} alignItems="flex-end" gap={4}>
      <Skeleton height="100px" width="100px" borderRadius="md" />
      <Skeleton height="50px" width="300px" borderRadius="md" />
    </Flex>

    {/* Stats Skeleton */}
    <Flex direction={{ base: "column", sm: "row" }} gap={4} mb={8} flexWrap="wrap">
      {[1, 2, 3, 4].map((_, idx) => (
        <Box
          key={idx}
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex gap={"20px"} alignItems={"center"} width={"100%"} height={"100%"}>
            <Skeleton height="50px" width="50px" borderRadius="full" />
            <Box flex="1">
              <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="8" />
            </Box>
          </Flex>
        </Box>
      ))}
    </Flex>

    {/* Filter and Pagination Skeleton */}
    <Flex justifyContent="space-between" alignItems="center" p={3}>
      <Skeleton height="30px" width="200px" />
      <Skeleton height="30px" width="40px" borderRadius="full" />
    </Flex>
    <Box mb={1}>
      <Skeleton height="40px" width="100%" borderRadius="md" />
    </Box>

    {/* Table Skeleton */}
    <Box borderRadius="lg" boxShadow="sm" bg="white" overflowY="auto">
      <Table variant="striped" size="lg">
        <Thead>
          <Tr>
            {[...Array(7)].map((_, idx) => (
              <Th key={idx}>
                <Skeleton height="20px" width="60px" />
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {[...Array(7)].map((_, rowIdx) => (
            <Tr key={rowIdx}>
              {[...Array(7)].map((_, colIdx) => (
                <Td key={colIdx}>
                  <Skeleton height="20px" width="100%" />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  </Box>
);

export default LeaderBoardLoader;