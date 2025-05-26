import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import TopPagination from "components/pagination/TopPagination";
import LeaderBoardHeaderIcon from "../../../assets/img/survey/LeaderBoardHeaderIcon.png";
import Assigned_Survey from "../../../assets/img/survey/Assigned_Survey.png";
import Inbox_survey from "../../../assets/img/survey/Inbox_survey.png";
import Survey_Live from "../../../assets/img/survey/Survey_Live.png";
import Survey_filled from "../../../assets/img/survey/Survey_filled.png";
import { FiFilter } from "react-icons/fi";

const LeaderBoard = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  setPageSize,
  handlePageSizeChange,
  isLoading,
}) => {
  const columns = [
    "SR.No",
    "Name",
    "Survey taken",
    "Score %",
    "Rank",
    "Role",
    "Agency",
  ];
  const leaderboardData = [
    {
      name: "Muhammad Usman",
      surveyTaken: "10/11",
      score: "96%",
      rank: "1",
      role: "Agent",
      agency: "Dubai",
    },
    {
      name: "Kafil Ali",
      surveyTaken: "10/11",
      score: "91%",
      rank: "2",
      role: "Manager",
      agency: "Dubai",
    },
    {
      name: "Aksar",
      surveyTaken: "10/11",
      score: "92%",
      rank: "3",
      role: "Manager",
      agency: "Egypt",
    },
    {
      name: "Hamd",
      surveyTaken: "10/11",
      score: "80%",
      rank: "4",
      role: "Manager",
      agency: "Egypt",
    },
  ];

  return (
    <Box p={4}>
      {/* Header */}
      <Box mb={6} display="flex">
        <img
          src={LeaderBoardHeaderIcon}
          alt="icon"
          width={"100px"}
          height={"100px"}
        />
        <Flex fontWeight={"bold"} fontSize={"50px"} alignItems={"flex-end"}>
          Leader Board
        </Flex>
      </Box>
      {/* Report Count Statistics*/}
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={4}
        mb={8}
        flexWrap="wrap"
      >
        {/* Survey Created */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <Box bg={"#F4F7FE"} borderRadius="full" py={"25px"} px={"25px"}>
              <img
                src={Inbox_survey}
                alt="icon"
                width={"50px"}
                height={"50px"}
              />
            </Box>
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Survey Created
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                350
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Assigned */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <img
              src={Assigned_Survey}
              alt="icon"
              width={"100px"}
              height={"100px"}
            />
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Assigned
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                450
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Survey Filled */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <img
              src={Survey_filled}
              alt="icon"
              width={"100px"}
              height={"100px"}
            />
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Survey Filled
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                3,500
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Live Surveys */}
        <Box
          flex="1"
          minW="150px"
          bg="white"
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="sm"
        >
          <Flex
            gap={"20px"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <img
              src={Survey_Live}
              alt="icon"
              width={"100px"}
              height={"100px"}
            />
            <Box flex="1">
              <Text fontSize="16px" color="gray.600" mb={1}>
                Live Surveys
              </Text>
              <Text fontSize="36px" fontWeight="bold">
                3
              </Text>
            </Box>
          </Flex>
        </Box>
      </Flex>

      {/* Pagination */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        gap={4}
      >
        {/* Pagination */}
        <Box>
          <TopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            setPageSize={setPageSize}
            handlePageSize={handlePageSizeChange}
            refetching={isLoading}
            loading={isLoading}
          />
        </Box>
        
        {/* Filter Icon */}
        <IconButton
          icon={<FiFilter />}
          aria-label="Filter Date"
          colorScheme="brand"
          variant="solid"
          size="sm"
          borderRadius="full"
          boxShadow="md"
        />
      </Flex>

      {/* Leaderboard Table */}
      <Box overflowX="auto" mt="10px">
        <Table size="lg">
          <Thead
            position="sticky"
            top={0}
            bg="white"
            zIndex={2}
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
            fontSize={"16px"}
            borderRadius="lg"
          >
            <Tr>
              {columns.map((header, index) => (
                <Th
                  key={index}
                  bg="brand.200"
                  whiteSpace="nowrap"
                  py={4}
                  textAlign="center"
                >
                  <Text
                    fontSize={{ base: "12px", md: "14px" }}
                    fontWeight="600"
                    color="gray.700"
                    textTransform="capitalize"
                  >
                    {header}
                  </Text>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {leaderboardData.map((item, index) => (
              <Tr
                key={index}
                bg={
                  item.rank === "1"
                    ? "red.500"
                    : item.rank === "2"
                      ? "cyan.100"
                      : item.rank === "3"
                        ? "green.100"
                        : "white"
                }
                // color={item.rank === "1" ? "white" : ""}
                _hover={{
                  bg:
                    item.rank === "1"
                      ? "red.400"
                      : item.rank === "2"
                        ? "cyan.50"
                        : item.rank === "3"
                          ? "green.50"
                          : "gray.50",
                }}
              >
                <Td textAlign="center">{index + 1}</Td>
                <Td textAlign="center" fontWeight="medium">
                  {item.name}
                </Td>
                <Td textAlign="center">{item.surveyTaken}</Td>
                <Td
                  textAlign="center"
                  color={
                    item.rank === "#1"
                      ? "white"
                      : parseInt(item.score) > 90
                        ? "green.500"
                        : "orange.500"
                  }
                  fontWeight="bold"
                >
                  {item.score}
                </Td>
                <Td textAlign="center" fontWeight="bold">
                  # {item.rank}
                </Td>
                <Td textAlign="center">{item.role}</Td>
                <Td textAlign="center">{item.agency}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default LeaderBoard;
