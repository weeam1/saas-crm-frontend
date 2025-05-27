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
  Divider,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { IoArrowBack, IoSearch, IoThumbsUp, IoThumbsDown } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { toast } from "react-toastify";
import { GiConsoleController } from "react-icons/gi";

const ViewSurveyResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [evaluations, setEvaluations] = useState([]);

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

  const {
    data: surveyResponse,
    isError: surveyError,
    refetch,
  } = useFetchItemsQuery({
    path: `/surveys/user_survey_response/${surveyData?._id}/${currentUserId}`,
  });

  const [createItemMutation, { isLoading: isEvaluating }] = useCreateItemMutation();

  useEffect(() => {
    if (surveyResponse?.doc) {
      const initialEvaluations = surveyResponse?.doc.questions?.map(question => {
        console.log("question", question)
        return {
        question: question.question,
        liked: question.liked
      }}) || [];

      setEvaluations(initialEvaluations);
    }
  }, [surveyResponse, surveyData]);

  const handleEvaluation = (questionId, liked) => {
    setEvaluations(prev => {
      const existingIndex = prev.findIndex(e => e.question === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], liked };
        return updated;
      }
      return [...prev, { question: questionId, liked }];
    });
  };

  const handleSubmitEvaluation = async () => {
    try {
      const submittedEvaluations = evaluations.filter(e => e.liked !== null);
      
      if (submittedEvaluations.length === 0) {
        toast({
          title: "No evaluations to submit",
          description: "Please evaluate at least one question before submitting",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await createItemMutation({
        path: `/surveys/responses/evaluate/${surveyResponse?.doc?._id}`,
        body: { evaluations: submittedEvaluations },
      }).unwrap();

      toast({
        title: "Evaluation submitted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to submit evaluation",
        description: err?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <Box>Loading...</Box>;
  if (isError) return <Box>Error: {error.message}</Box>;
  if (!surveyData) return <Box>Survey not found</Box>;

  const handleUserClick = (userId) => {
    setCurrentUserId(userId);
    refetch();
  };

  console.log("surveyResponse",surveyResponse)
  return (
    <Flex h="100vh" overflow="hidden">
      {/* Main Content Area */}
      <Box flex="1" overflowY="auto">
        <Box p={8}>
          <Flex justify="space-between" align="flex-start" mb={6} flexDirection="column">
            <Heading as="h1" size="xl" color="brand.600">
              {surveyData.title}
            </Heading>
            <AppButton leftIcon={<IoArrowBack />} onClick={() => navigate(-1)}>
              Back
            </AppButton>
          </Flex>

          {/* Survey Questions and Responses */}
          {surveyError ? (
            <Box color="red.500" p={4} bg="red.50" borderRadius="md">
              User survey response not found!
            </Box>
          ) : (
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              {surveyData.questions.map((question, index) => {
                const currentEval = evaluations.find(e => e.question === question._id);
                const answer = surveyResponse?.doc?.questions?.find(
                  q => q.question === question._id
                )?.answer;
                
                return (
                  <React.Fragment key={question._id}>
                    <Flex align="center" justify="space-between" mb={3}>
                      <FormLabel fontSize="lg" fontWeight="bold" mb={0}>
                        {index + 1}. {question.text}
                      </FormLabel>
                      <Flex gap={2}>
                        <Icon
                          as={IoThumbsUp}
                          boxSize={5}
                          color={currentEval?.liked === true    ? "green.500" : "gray.400"}
                          cursor="pointer"
                          onClick={() => handleEvaluation(question._id, true)}
                          _hover={{ color: "green.500" }}
                        />
                        <Icon
                          as={IoThumbsDown}
                          boxSize={5}
                          color={currentEval?.liked === false ? "red.500" : "gray.400"}
                          cursor="pointer"
                          onClick={() => handleEvaluation(question._id, false)}
                          _hover={{ color: "red.500" }}
                        />
                      </Flex>
                    </Flex>

                    <FormControl mb={6}>
                      {question.type === "radio" && (
                        <RadioGroup
                          value={
                            surveyResponse?.doc?.questions
                              ?.find((q) => q.question === question._id)
                              ?.answer?.toString() || ""
                          }
                          isReadOnly
                        >
                          <Stack direction="column" spacing={2}>
                            {question.options.map((option) => (
                              <Radio
                                key={option.opId}
                                value={option.opId.toString()}
                                colorScheme="brand"
                              >
                                {option.text}
                              </Radio>
                            ))}
                          </Stack>
                        </RadioGroup>
                      )}

                      {question.type === "checkbox" && (
                        <CheckboxGroup
                          value={
                            surveyResponse?.doc?.questions
                              ?.find((q) => q.question === question._id)
                              ?.answer?.map(String) || []
                          }
                        >
                          <Stack direction="column" spacing={2}>
                            {question.options.map((option) => (
                              <Checkbox
                                key={option.opId}
                                value={option.opId.toString()}
                                colorScheme="brand"
                                isReadOnly
                              >
                                {option.text}
                              </Checkbox>
                            ))}
                          </Stack>
                        </CheckboxGroup>
                      )}

                      {question.type === "text" && (
                        <Textarea
                          value={
                            surveyResponse?.doc?.questions?.find(
                              (q) => q.question === question._id
                            )?.answer || ""
                          }
                          isReadOnly
                          bg="gray.50"
                          focusBorderColor="brand.500"
                          minH="100px"
                        />
                      )}
                    </FormControl>

                    {index < surveyData.questions.length - 1 && (
                      <Divider my={6} borderColor="gray.200" />
                    )}
                  </React.Fragment>
                );
              })}

              {/* Submit Evaluation Button */}
              <Flex justify="flex-end" mt={8}>
                <AppButton
                  colorScheme="brand"
                  isLoading={isEvaluating}
                  onClick={handleSubmitEvaluation}
                >
                  Submit Evaluation
                </AppButton>
              </Flex>
            </Box>
          )}
        </Box>
      </Box>

      {/* Sidebar */}
      <Box
        width="400px"
        borderRight="1px solid"
        borderColor="gray.200"
        bg="white"
        overflowY="auto"
      >
        <Box p={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={IoSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search users..."
              focusBorderColor="brand.500"
              bg="gray.100"
            />
          </InputGroup>
        </Box>

        <VStack align="stretch" spacing={2} px={4} pb={4}>
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            Survey Users
          </Text>
          {invitedUsers.map((userData) => (
            <HStack
              key={userData.user._id}
              spacing={3}
              bg={currentUserId === userData.user._id ? "#ABFF8D" : "gray.100"}
              p={3}
              borderRadius="md"
              _hover={{
                bg: currentUserId === userData.user._id ? "#ABFF8D" : "gray.200",
              }}
              cursor="pointer"
              onClick={() => handleUserClick(userData.user._id)}
            >
              <Avatar
                size="sm"
                name={userData.user.fullName}
                src={userData.user.profileImage}
              />
              <Box flex="1">
                <Text fontWeight="medium">{userData.user.fullName}</Text>
                <Text fontSize="sm" color="gray.500">
                  {userData.user.roles[0]?.roleName || "User"}
                </Text>
              </Box>
              <Box
                bg="brand.500"
                borderRadius="md"
                p={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Icon as={IoEye} color="white" boxSize={4} />
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default ViewSurveyResponse;