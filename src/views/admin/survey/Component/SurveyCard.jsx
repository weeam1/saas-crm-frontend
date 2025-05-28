import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SurveyCard = ({ data, isActive }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const isAdmin = parsedUser?.role === "superAdmin";
  const currentUserId = parsedUser?._id;

  let isSurveyCompleted = false;
  if (Array.isArray(data.invitedUsers) && currentUserId) {
    const invitedUserObj = data.invitedUsers.find(
      (u) =>
        u.user &&
        u.user._id &&
        u.user._id.toString() === currentUserId.toString() &&
        u.status === "completed"
    );
    if (invitedUserObj) {
      isSurveyCompleted = true;
    }
  }

  const cardWidth = useBreakpointValue({
    base: "95%",
    sm: "220px",
    md: "240px",
    lg: "260px",
  });

  const cardPadding = useBreakpointValue({
    base: 2,
    md: 3,
    lg: 3,
  });

  return (
    <Box
      width={cardWidth}
      minW="180px"
      maxW="100%"
      borderWidth="1px"
      borderRadius="lg"
      p={cardPadding}
      mb={3}
      bg="#FFFFFF"
      position="relative"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box display="flex" justifyContent="flex-end">
        <Tooltip
          label={isActive ? "Active" : "Complete"}
          fontSize="sm"
          placement="top"
          hasArrow
        >
          <Box
            width="18px"
            height="18px"
            bg={isActive ? "green.600" : "red.600"}
            borderRadius="full"
            cursor="pointer"
          ></Box>
        </Tooltip>
      </Box>

      <Box flex="1">
        <Box mb={1}>
          <Text
            fontSize="sm"
            fontWeight={"700"}
            noOfLines={2}
            lineHeight="1.3em"
            wordBreak="break-word"
            textOverflow="ellipsis"
            display="-webkit-box"
            sx={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {data.name || data.title}
          </Text>
        </Box>
        {data.description && (
          <Box mb={2}>
            <Text fontSize="xs" color="gray.600" fontWeight={"700"}>
              {data.description}
            </Text>
          </Box>
        )}

        {/* Survey Details */}
        <Flex direction="column" gap={2} mb={3} width="80%" mt="20px">
          <Flex justify="space-between">
            <Text color="#666666" fontSize="xs" fontWeight="700">
              Survey taken
            </Text>
            <Text color="#666666" fontSize="xs" fontWeight="700">
              {data.taken ?? data.submittedUsers}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text color="#666666" fontSize="xs" fontWeight="700">
              Total questions
            </Text>
            <Text color="#666666" fontSize="xs" fontWeight="700">
              {data.totalQuestions ?? data.questionsCount}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text color="#666666" fontSize="xs" fontWeight="700">
              Closing date
            </Text>
            <Text color="#666666" fontSize="xs" fontWeight="700">
              {data.closingDate ?? data.closesAt?.slice(0, 10)}
            </Text>
          </Flex>
          <Button
            bg={
              isAdmin ? "#D8A541" : isSurveyCompleted ? "gray.300" : "#D8A541"
            }
            borderRadius="4px"
            color={isAdmin ? "white" : isSurveyCompleted ? "gray.600" : "white"}
            mt="10px"
            fontSize="xs"
            size="sm"
            width="100%"
            isDisabled={isSurveyCompleted && !isAdmin}
            _disabled={{ opacity: 1, cursor: "not-allowed" }}
            _hover={
              isSurveyCompleted && !isAdmin
                ? {}
                : { bg: "brand.400", color: "white" }
            }
            onClick={() => {
              if (isAdmin) {
                navigate(`/survey/view-survey/${data.id || data._id}`);
              } else if (!isSurveyCompleted) {
                navigate(`/survey/take-survey/${data.id || data._id}`);
              }
            }}
          >
            {isAdmin
              ? "View"
              : isSurveyCompleted
                ? "Survey Completed"
                : "Take Survey"}
          </Button>
        </Flex>
      </Box>
      <Flex justify="flex-end">
        <Text fontSize="xs" color="black" alignSelf="flex-end" fontWeight={"700"}> 
          {data.surveyDate || data.createdAt?.slice(0, 10)}
        </Text>
      </Flex>
    </Box>
  );
};

export default SurveyCard;
