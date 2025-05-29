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
  useBreakpointValue,
  Button,
} from "@chakra-ui/react";
import {
  IoArrowBack,
  IoSearch,
  IoThumbsUp,
  IoThumbsDown,
  IoEye,
  IoClose,
} from "react-icons/io5";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { toast } from "react-toastify";
import ViewSurveyResponseLoading from "./Loader/ViewSurveyResponseLoading";
import { skipToken } from "@reduxjs/toolkit/query";
import Breadcrumb from "../invoice/components/BreadCrumb";

const SIDEBAR_WIDTH = "400px";

const ViewSurveyResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDesktop = useBreakpointValue({ base: false, lg: true });

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
    isLoading: isLoadingResponse,
    refetch,
  } = useFetchItemsQuery(
    surveyData?._id && currentUserId
      ? {
          path: `/surveys/user_survey_response/${surveyData._id}/${currentUserId}`,
        }
      : skipToken
  );

  const [createItemMutation, { isLoading: isEvaluating }] =
    useCreateItemMutation();

  useEffect(() => {
    if (surveyResponse?.doc) {
      const initialEvaluations =
        surveyResponse?.doc.questions?.map((question) => ({
          question: question.question,
          liked: question.liked,
        })) || [];
      setEvaluations(initialEvaluations);
    }
  }, [surveyResponse, surveyData]);

  const handleEvaluation = (questionId, liked) => {
    setEvaluations((prev) => {
      const existingIndex = prev.findIndex((e) => e.question === questionId);
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
      const submittedEvaluations = evaluations.filter((e) => e.liked !== null);
      if (submittedEvaluations.length === 0) {
        toast({
          title: "No evaluations to submit",
          description:
            "Please evaluate at least one question before submitting",
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

  if (isLoading || isLoadingResponse) return <ViewSurveyResponseLoading />;
  if (isError && surveyError)
    return (
      <Flex h="100vh" align="center" justify="center" bg="red.50">
        <Box
          bg="#FFF0F0"
          border="1px solid #FFB3B3"
          borderRadius="md"
          p={8}
          textAlign="center"
          color="red.600"
          fontWeight="bold"
          fontSize="lg"
        >
          Error loading survey
          <Text mt={2} fontWeight="normal" color="red.500" fontSize="md">
            {error?.message}
          </Text>
        </Box>
      </Flex>
    );
  if (!surveyData)
    return (
      <Flex h="100vh" align="center" justify="center" bg="yellow.50">
        <Box
          bg="#FFFBEA"
          border="1px solid #FFE6A1"
          borderRadius="md"
          p={10}
          textAlign="center"
          color="orange.700"
          fontWeight="bold"
          fontSize="lg"
          maxW="400px"
          mx="auto"
        >
          <Text fontSize="xl" mb={2}>
            Survey Not Found
          </Text>
          <Text fontWeight="normal" color="orange.700" fontSize="md" mb={4}>
            The survey you are looking for does not exist or may have been
            removed.
            <br />
            Please check the link or contact your administrator for assistance.
          </Text>
          <AppButton
            leftIcon={<IoArrowBack />}
            onClick={() => navigate(-1)}
            bg="#EDC270"
            color="#000"
            borderRadius="4px"
            size="sm"
          >
            Go Back
          </AppButton>
        </Box>
      </Flex>
    );

  const handleUserClick = (userId) => {
    setCurrentUserId(userId);
    setSidebarOpen(false);
    refetch();
  };

  // Filter users based on search term
  const filteredUsers = invitedUsers.filter((userData) =>
    userData.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Sidebar
  const SidebarContent = (
    <>
      <Box p={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={IoSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            focusBorderColor="brand.500"
            bg="#F4F4F4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fontWeight="700"
          />
        </InputGroup>
      </Box>
      <VStack
        align="stretch"
        spacing={2}
        px={4}
        pb={4}
        flex="1"
        overflowY="auto"
      >
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          Survey Users
        </Text>
        {filteredUsers.map((userData) => (
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
              <Text fontSize={"sm"} color={"#FF0000"}>
                {userData?.submittedQuestions}/{surveyData?.questionsCount}
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
    </>
  );

  const items = [
    {
      path: "/survey",
      label: "Surveys",
    },
    {
      path: `/survey/view-survey/${id}`,
      label: "View Survey",
    },
  ];
  return (
    <Flex h="100vh" overflow="hidden" position="relative">
      {/* Main Content Area */}
      <Box
        flex="1"
        overflowY="auto"
        pr={{ base: 0, lg: SIDEBAR_WIDTH }}
        transition="padding-right 0.3s"
      >
        <Box width={{ base: "100%", lg: "85%" }} maxW="100%" mx="0">
          <Breadcrumb items={items} />
          {/* Title first, then Back Button below */}
          <Heading
            as="h1"
            mb={2}
            color="black"
            fontSize="24px"
            fontWeight="700"
          >
            {surveyData.title}
          </Heading>
          <Flex justify="flex-start" mb={4}>
            <AppButton
              ml="2"
              leftIcon={<IoArrowBack />}
              onClick={() => navigate(-1)}
            >
              Back
            </AppButton>
          </Flex>

          {/* Survey Questions and Responses */}
          {surveyError ? (
            <Box color="red.500" p={4} bg="red.50" borderRadius="md">
              User survey response not found!
            </Box>
          ) : (
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              mb={{ base: 3, lg: 0 }}
              mr={0}
              width="100%"
            >
              {surveyData.questions.map((question, index) => {
                const currentEval = evaluations.find(
                  (e) => e.question === question._id
                );
                const answer = surveyResponse?.doc?.questions?.find(
                  (q) => q.question === question._id
                )?.answer;

                return (
                  <React.Fragment key={question._id}>
                    <Box mb={index < surveyData.questions.length - 1 ? 8 : 0}>
                      <Flex align="center" justify="space-between" mb={3}>
                        <FormLabel
                          fontSize="md"
                          fontWeight="bold"
                          mb={0}
                          color="black"
                        >
                          {index + 1}. {question.text}
                        </FormLabel>
                        <Flex gap={2}>
                          <Icon
                            as={IoThumbsUp}
                            boxSize={5}
                            color={
                              currentEval?.liked === true
                                ? "green.500"
                                : "gray.400"
                            }
                            cursor="pointer"
                            onClick={() => handleEvaluation(question._id, true)}
                            _hover={{ color: "green.500" }}
                          />
                          <Icon
                            as={IoThumbsDown}
                            boxSize={5}
                            color={
                              currentEval?.liked === false
                                ? "red.500"
                                : "gray.400"
                            }
                            cursor="pointer"
                            onClick={() =>
                              handleEvaluation(question._id, false)
                            }
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
                    </Box>
                  </React.Fragment>
                );
              })}

              {/* Submit Evaluation Button */}
              <Flex justify="flex-end" mt={8}>
                <AppButton
                  isLoading={isEvaluating}
                  onClick={handleSubmitEvaluation}
                  color="black"
                  bg="#EDC270"
                  borderRadius="4px"
                  _hover={{ bg: "#e0b85c" }}
                  _active={{ bg: "#d1a94b" }}
                >
                  Submit
                </AppButton>
              </Flex>
            </Box>
          )}
        </Box>
      </Box>

      {/* Responsive Sidebar */}
      {isDesktop ? (
        <Box
          width={SIDEBAR_WIDTH}
          height="calc(100vh - 78px)" // Sidebar height minus navbar
          borderLeft="1px solid"
          borderColor="gray.200"
          bg="white"
          overflowY="auto"
          position="fixed"
          top="80px" // Start below navbar
          right="0"
          zIndex="10"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
        >
          {SidebarContent}
        </Box>
      ) : (
        <>
          {/* Floating Search Button */}
          {!sidebarOpen && (
            <Button
              position="fixed"
              bottom="24px"
              right="24px"
              zIndex="20"
              bg="#EDC270"
              color="#000"
              leftIcon={<IoSearch />}
              borderRadius="full"
              size="lg"
              boxShadow="lg"
              onClick={() => setSidebarOpen(true)}
              _hover={{ bg: "#e0b85c" }}
              _active={{ bg: "#d1a94b" }}
            >
              Search
            </Button>
          )}
          {/* Sidebar Drawer for mobile/tablet */}
          {sidebarOpen && (
            <Box
              position="fixed"
              top="80px" // Start below navbar
              right="0"
              width="90vw"
              maxW={SIDEBAR_WIDTH}
              height="calc(100vh - 70px)" // Sidebar height minus navbar
              bg="white"
              zIndex="30"
              boxShadow="2xl"
              display="flex"
              flexDirection="column"
              p={0}
              m={0}
              transition="transform 0.3s"
            >
              <Flex
                justify="flex-end"
                align="center"
                p={4}
                borderBottom="1px solid #eee"
              >
                <Icon
                  as={IoClose}
                  boxSize={6}
                  color="gray.600"
                  cursor="pointer"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                />
              </Flex>
              {SidebarContent}
            </Box>
          )}
        </>
      )}
    </Flex>
  );
};

export default ViewSurveyResponse;
