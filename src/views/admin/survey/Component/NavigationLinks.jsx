import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Icon, Image } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import LeaderBoardIcon from "../../../../assets/img/survey/LeaderBoardIcon.png";

const NavigationLinks = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const isAdmin = user ? JSON.parse(user).role === "superAdmin" : false;

  return (
    <Flex direction="column" width="100%">
      {/* Navigation Links */}
      <Flex
        gap={{ base: 4, md: 6, lg: 10 }}
        direction={{ base: "column", sm: "row" }}
        align={{ base: "center", sm: "stretch" }}
      >
        {/* New Survey Card */}
        {isAdmin && (
          <Box
            bg="#FF5757"
            width={{ base: "90%", sm: "100px", md: "200px" }}
            height={{ base: "250px", sm: "140px", md: "200px" }}
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
                boxSize={{ base: 10, md: 14 }}
                mb={4}
                bg="white"
                color="#FF5757"
                borderRadius="full"
                p="2"
              />
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                New Survey
              </Text>
            </Flex>
          </Box>
        )}

        {/* Leaderboard Card */}
        <Box
          bg="#57FF5D"
          width={{ base: "90%", sm: "100px", md: "200px" }}
          height={{ base: "250px", sm: "140px", md: "200px" }}
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
            <Image
              src={LeaderBoardIcon}
              alt="LeaderBoardIcon"
              mb={4}
              boxSize={{ base: 10, md: 14 }}
            />
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
              Leader board
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default NavigationLinks;
