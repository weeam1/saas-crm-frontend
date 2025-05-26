import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import LeaderBoardIcon from "../../../../assets/img/survey/LeaderBoardIcon.png";
const NavigationLinks = () => {
  const navigate = useNavigate();
  return (
    <Flex direction="column" width="100%">
      {/* Navigation Links */}
      <Flex gap={10}>
        {/* New Survey Card */}
        <Box
          bg="#FF5757"
          width="355px"
          height="319px"
          borderRadius="20px"
          cursor="pointer"
          position="relative"
          _hover={{ bg: "#FF7A7A" }}
          transition="background 0.2s ease"
          onClick={() => navigate("/survey/create-survey")}
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            height="100%"
            color="white"
          >
            <Icon
              as={FiPlus}
              boxSize={14}
              mb={4}
              bg="white"
              color="#FF5757"
              borderRadius="full"
              p="2"
            />
            <Text fontSize="2xl" fontWeight="bold">
              New Survey
            </Text>
          </Flex>
        </Box>

        {/* Leaderboard Card */}
        <Box
          bg="#57FF5D"
          width="355px"
          height="319px"
          borderRadius="20px"
          cursor="pointer"
          position="relative"
          _hover={{ bg: "#7AFF7F" }}
          transition="background 0.2s ease"
          onClick={() => navigate("/survey/leader-board")}
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            height="100%"
            color="white"
          >
            <img
              src={LeaderBoardIcon}
              alt="LeaderBoardIcon"
              mb={4}
              boxSize={14}
            />
            <Text fontSize="2xl" fontWeight="bold">
              Leader board
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default NavigationLinks;
