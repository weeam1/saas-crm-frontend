import React from "react";
import { Box, Flex, Text, Button, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SurveyCard = ({ data, isActive }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const isAdmin = user ? JSON.parse(user).role === "superAdmin" : false;

  // Responsive values
  const cardWidth = useBreakpointValue({
    base: "100%",   
    md: "355px",     
    lg: "355px"      
  });

  const titleFontSize = useBreakpointValue({
    base: "28px",      
    md: "36px",      
    lg: "36px"
  });

  const cardPadding = useBreakpointValue({
    base: 3,      
    md: 4,          
    lg: 4
  });

  return (
    <Box
      width={cardWidth}
      height="319px"
      borderWidth="1px"
      borderRadius="20px"
      p={cardPadding}
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
        right={{sm :"-100px", md: "-25px", lg:"-30px"}}
        bg="#00000080"
        color="white"
        px={2}
        py={1}
        borderRadius="md"
        fontSize="xs"
        alignItems="center"
        width={{ base:"30px", md: "40px" ,lg:"58px"}}
        height={"17px"}
        justifyContent={"center"}
      >
        {isActive ? (
          <Text fontSize={{ base: 7, md: 6, lg: 10  } } >Active</Text>
        ) : (
          <Text fontSize={{ base: 4, md: 6, lg: 10  } } >Complete</Text>
        )}
      </Flex>
      <Box>
        {/* Survey Name */}
        <Box mb={3}>
          <Text
            fontSize={titleFontSize}
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
        <Flex direction="column" gap={2} mb={4} width={"80%"}>
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
          <Button 
            bg={"#D8A541"} 
            borderRadius={"4px"} 
            color="white" 
            mt="15px" 
            onClick={() => {
              if (isAdmin) {
                navigate(`/survey/view-survey/${data.id}`);
              } else {
                console.log("Taking survey:", data.id);
                navigate(`/survey/take-survey/${data.id}`);
              }
            }}
          >
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