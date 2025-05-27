import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Input,
  Heading,
  Text,
  VStack,
  Avatar,
  HStack,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { IoArrowBack, IoSearch } from "react-icons/io5";
import { IoEye } from "react-icons/io5";

const ViewSurveyResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);

  const {
    data: survey,
    isLoading,
    isError,
    error,
  } = useFetchItemsQuery({
    path: `/surveys/${id}`,
  });

  const surveyData = survey?.doc;
  const invitedUsers = surveyData?.invitedUsers || [];

  useEffect(() => {
    if (surveyData && !isLoading) {
      setCurrentUserId(invitedUsers[0]?.user?._id);
    }
  }, [surveyData]);

  const { data: surveyResponse, isError: surveyError, refetch } = useFetchItemsQuery({
    path: `/surveys/user_survey_response/${surveyData?._id}/${currentUserId}`,
  });
  if (isLoading) return <Box>Loading...</Box>;
  if (isError) return <Box>Error: {error.message}</Box>;
  if (!surveyData) return <Box>Survey not found</Box>;

  const handleUserClick = (userId) => {
    setCurrentUserId(userId);
    refetch()
  };

  console.log("surveyResponse", surveyResponse);
  return (
    <Flex>
      {/* Main Content Area */}
      <Box flex="1" p={{ base: 4, md: 8 }}>
        <Heading as="h1" size="xl" mb={4}>
          {surveyData.title}
        </Heading>
        <AppButton
          leftIcon={<IoArrowBack />}
          onClick={() => navigate(-1)}
          mb={4}
        >
          Back
        </AppButton>
      </Box>
      {/* User Response */}

      <Box>
        {surveyError ? (
          <Box color={"red"}> User survey response not found!</Box>
        ) : (
          <>
          Survey Found
          </>
        )}
      </Box>
      {/* Sidebar */}
      <Box
        width="500px"
        borderLeft="1px solid"
        borderColor="gray.200"
        p={4}
        bg="white"
        height={"60vh"}
        maxHeight={"80vh"}
        overflowY={"auto"}
      >
        {/* Search Box */}
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none">
            <Icon as={IoSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            focusBorderColor="brand.500"
            bg={"gray.300"}
          />
        </InputGroup>

        {/* Users List */}
        <VStack align="stretch" spacing={4}>
          <Text fontWeight="bold">Survey Users</Text>
          {invitedUsers.map((userData) => (
            <HStack
              key={userData.user._id}
              spacing={3}
              bg={currentUserId === userData.user._id ? "#ABFF8D" : "gray.200"}
              py={6}
              px={3}
              borderRadius={"md"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              _hover={{
                bg:
                  currentUserId === userData.user._id ? "#ABFF8D" : "gray.300",
              }}
              cursor={"pointer"}
              onClick={() => handleUserClick(userData.user._id)}
            >
              <Flex gap={2}>
                <Avatar
                  size="sm"
                  name={userData.user.fullName}
                  src={userData.user.profileImage}
                />
                <Box>
                  <Text fontWeight="bold">{userData.user.fullName}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {userData.user.roles[0]?.roleName || "User"}
                  </Text>
                  <Text fontSize="sm" color="red.800">
                    {`${1}/${surveyData?.questionsCount}`}
                  </Text>
                </Box>
              </Flex>
              <Box
                ml="auto"
                bg={"brand.500"}
                borderRadius={"md"}
                px={"15px"}
                py={"4px"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Icon as={IoEye} color="white" />
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default ViewSurveyResponse;
