import React from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SurveyCard = ({ data, isActive }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const isAdmin = user ? JSON.parse(user).role === "superAdmin" : false;
  return (
    <Box
      width="355px"
      height="319px"
      borderWidth="1px"
      borderRadius="20px"
      p={4}
      mb={4}
      bg="white"
      position="relative"
      boxShadow="sm"
    >
      <Box display={"flex"} justifyContent="flex-end">
        <Box
          width="24px"
          height="24px"
          bg={isActive ? "green.600" : "red.600"}
          borderRadius={"full"}
        ></Box>
      </Box>

      {/* Active/Close indicator */}
      <Flex
        position="absolute"
        top={3}
        right="-30px"
        bg="#00000080"
        color="white"
        px={2}
        py={1}
        borderRadius="md"
        fontSize="xs"
        alignItems="center"
        width={"58px"}
        height={"17px"}
        justifyContent={"center"}
      >
        {isActive ? (
          <Text fontSize={"10px"}>Active</Text>
        ) : (
          <Text fontSize={"10px"}>Complete</Text>
        )}
      </Flex>
      <Box>
        {/* Survey Name */}
        <Box mb={3}>
          <Text
            fontSize="36px"
            fontWeight="bold"
            noOfLines={1}
            lineHeight="1.5em"
            wordBreak="break-word"
            textOverflow="ellipsis"
            display="-webkit-box"
            webkitLineClamp={2}
            webkitBoxOrient="vertical"
          >
            {data.name}
          </Text>
        </Box>

        {/* Survey Details */}
        <Flex direction="column" gap={2} mb={4}  width={"80%"}>
          <Flex justify="space-between">
            <Text color="gray.600">Survey taken</Text>
            <Text fontWeight="medium">{data.taken}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text color="gray.600">Total questions</Text>
            <Text fontWeight="medium">{data.totalQuestions}</Text>
          </Flex>
          <Flex justify="space-between">
            <Text color="gray.600">Closing date</Text>
            <Text fontWeight="medium">{data.closingDate}</Text>
          </Flex>
          <Button bg={"#D8A541"} borderRadius={"4px"} color="white" mt="15px" onClick={(() => {
            if (isAdmin) {
               navigate(`/survey/view-survey/${data.id}`);
            } else {
                console.log("Taking survey:", data.id);
               navigate(`/survey/take-survey/${data.id}`);
            }
          })}>
            {isAdmin ? "View" : "Take Survey"}
          </Button>
        </Flex>
      </Box>
      {/* Action Row */}
      <Flex justify="flex-end">
        <Text fontSize="sm" color="gray.500" alignSelf="flex-end">
          {data.surveyDate}
        </Text>
      </Flex>
    </Box>
  );
};

export default SurveyCard;
