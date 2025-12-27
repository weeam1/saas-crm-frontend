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
  Alert,
  AlertIcon,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Skeleton,
  SkeletonText,
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
import Breadcrumb from "../../../components/shared/BreadCrumb";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const SIDEBAR_WIDTH = "400px";

const ViewSurveyResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasChangedEvaluation, setHasChangedEvaluation] = useState(false);
  const [userPoints, setUserPoints] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [surveyResponseData, setSurveyResponseData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const { createUserLog } = useUserActivityLog();

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    sx: true,
    lg: false,
  });

  const {
    data: survey,
    isLoading: isLoadingSurvey,
    isError: isSurveyError,
    error: surveyError,
    refetch,
  } = useFetchItemsQuery(
    {
      path: `/surveys/${id}`,
    },
    { refetchOnMountOrArgChange: true }
  );

  const surveyData = survey?.doc;
  const invitedUsers = surveyData?.invitedUsers || [];

  const filteredUsers = invitedUsers
    .filter((userData) =>
      userData.user?.fullName?.toLowerCase()?.includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return -1;
      if (b.status === "completed" && a.status !== "completed") return 1;
      const totalQuestions = surveyData?.questionsCount || 0;

      const aComplete = a.submittedQuestions === totalQuestions;
      const bComplete = b.submittedQuestions === totalQuestions;

      const aPoints = a.points || 0;
      const bPoints = b.points || 0;

      const getPriority = (complete, points) => {
        if (complete && points > 0) return 1;
        if (complete && points === 0) return 2;
        return 3;
      };

      const aPriority = getPriority(aComplete, aPoints);
      const bPriority = getPriority(bComplete, bPoints);

      if (aPriority !== bPriority) return aPriority - bPriority;

      return bPoints - aPoints;
    });

  useEffect(() => {
    if (filteredUsers.length > 0 && !currentUserId) {
      setCurrentUserId(filteredUsers[0]?.user?._id);
    }
  }, [filteredUsers, currentUserId]);

  const {
    data: surveyResponse,
    isError: isResponseError,
    error: responseError,
    isLoading: isLoadingResponse,
    isFetching: isFetchingResponse,
    refetch: refetchResponse,
  } = useFetchItemsQuery(
    // surveyData?._id && currentUserId
    // 	? {
    // 			path: `/surveys/user_survey_response/${surveyData._id}/${currentUserId}`,
    // 		}
    // 	: skipToken

    {
      path: `/surveys/user_survey_response/${surveyData?._id}/${currentUserId}`,
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !surveyData?._id || !currentUserId,
    }
  );

  const [createItemMutation] = useCreateItemMutation();

  useEffect(() => {
    setEvaluations([]);
    if (surveyResponse?.doc) {
      setSurveyResponseData(surveyResponse?.doc);
      const initialEvaluations =
        surveyResponse?.doc.questions?.map((question) => ({
          question: question.question,
          liked: question.liked,
        })) || [];
      setEvaluations(initialEvaluations);
      setHasChangedEvaluation(false);
    } else {
      setSurveyResponseData([]);
    }
  }, [surveyResponse, currentUserId, survey, id]);

  const handleEvaluation = (questionId, liked) => {
    setEvaluations((prev) => {
      const existingIndex = prev.findIndex((e) => e.question === questionId);
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], liked };
      } else {
        updated = [...prev, { question: questionId, liked }];
      }
      setHasChangedEvaluation(true);

      // Calculate new points for current user
      const likeCount = updated.filter((e) => e.liked === true).length;
      setUserPoints((prevPoints) => ({
        ...prevPoints,
        [currentUserId]: likeCount,
      }));

      return updated;
    });
  };

  const handleSubmitEvaluation = async () => {
    try {
      setIsButtonDisable(true);
      const submittedEvaluations = evaluations.filter(
        (e) => e.liked !== null && e.liked !== undefined
      );
      if (submittedEvaluations.length === 0) {
        toast.warning(
          "Please evaluate at least one question before submitting"
        );
        return;
      }
      await createItemMutation({
        path: `/surveys/responses/evaluate/${surveyResponse?.doc?._id}`,
        body: { evaluations: submittedEvaluations },
      }).unwrap();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Survey",
        entityType: "SurveyResponse",
        entityId: surveyResponse?.doc?._id,
        status: "success",
        message: `"${user?.fullName}" evaluate the survey "${surveyData.title || "Untitled"}".`,
      });
      toast.success("Evaluation submitted successfully");
      setHasChangedEvaluation(false);
      setEvaluations((prev) =>
        prev.map((evaluation) => ({
          ...evaluation,
          liked:
            submittedEvaluations.find(
              (se) => se.question === evaluation.question
            )?.liked ?? evaluation.liked,
        }))
      );
      setSurveyResponseData((prevData) => {
        if (!prevData || !Array.isArray(prevData.questions)) return prevData;

        const updatedQuestions = prevData.questions.map((question) => {
          const matchedEvaluation = submittedEvaluations.find(
            (evaluation) => evaluation.question === question.question
          );
          return {
            ...question,
            liked: matchedEvaluation?.liked ?? question.liked,
          };
        });

        return {
          ...prevData,
          questions: updatedQuestions,
        };
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit evaluation");
      const errorMsg =
        error?.data?.message ||
        "Failed to evaluate the survey. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Survey",
        entityType: "SurveyResponse",
        entityId: surveyResponse?.doc?._id || null,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setIsButtonDisable(false);
    }
  };

  const handleUserClick = (userId) => {
    if (userId !== currentUserId) {
      setCurrentUserId(userId);
      onClose();
      // refetchResponse();
      // refetch();
    }
  };
  if (isLoadingSurvey) return <ViewSurveyResponseLoading />;

  if (isSurveyError)
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
            {surveyError?.message}
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
          </Text>
        </Box>
      </Flex>
    );

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
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          Survey Users
        </Text>
        {filteredUsers.length === 0 ? (
          <Box py={8} textAlign="center" color="gray.500" fontWeight="medium">
            No user found
          </Box>
        ) : (
          filteredUsers.map((userData) => (
            <HStack
              key={userData.user._id}
              spacing={3}
              bg={currentUserId === userData.user._id ? "#ABFF8D" : "gray.100"}
              p={3}
              borderRadius="md"
              _hover={{
                bg:
                  currentUserId === userData.user._id ? "#ABFF8D" : "gray.200",
              }}
              cursor="pointer"
              onClick={() => handleUserClick(userData.user._id)}
            >
              <Avatar
                size="sm"
                name={userData?.user?.fullName}
                src={userData?.user?.profileImage}
              />
              <Box flex="1">
                <Text fontWeight="medium">{userData?.user?.fullName || 'N/A'}</Text>
                <Text fontSize="sm" color="gray.500">
                  {userData.user.roles[0]?.roleName || "User"}
                </Text>

                <Text fontSize={"sm"} color={"#FF0000"}>
                  {(userPoints[userData.user._id] ?? userData?.points ?? 0) ===
                    0 && userData?.status === "pending"
                    ? "Pending"
                    : `${userPoints[userData.user._id] ?? userData?.points ?? 0}/${surveyData?.questionsCount}`}
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
          ))
        )}
      </VStack>
    </>
  );

  const items = [
    {
      path: "/survey/records",
      label: "Surveys",
    },
    {
      path: `/survey/view-survey/${id}`,
      label: "View Survey",
    },
  ];

  const currentUserData = filteredUsers.find(
    (user) => user.user._id === currentUserId
  );
  const hasSubmitted =
    currentUserData?.submittedQuestions === surveyData?.questionsCount;

  return (
    <Flex
      h="100vh"
      overflow="hidden"
      position="relative"
      p={{ base: 2, sm: 2 }}
    >
      {/* Main Content Area */}
      <Box
        flex="1"
        overflowY="auto"
        pr={{ base: 0, lg: SIDEBAR_WIDTH }}
        transition="padding-right 0.3s"
        pb={isMobile ? "80px" : 0}
      >
        <Box width={{ base: "100%", lg: "85%" }} maxW="100%" mx="0">
          {/* <Breadcrumb items={items} /> */}
          <Flex justify="flex-start" mb={4}>
            <AppButton
              ml="2"
              leftIcon={<IoArrowBack />}
              onClick={() => navigate(-1)}
            >
              Back
            </AppButton>
          </Flex>
          <Heading
            as="h1"
            mb={2}
            color="black"
            fontSize="24px"
            fontWeight="700"
          >
            {surveyData.title
              ? surveyData.title.charAt(0).toUpperCase() +
                surveyData.title.slice(1).toLowerCase()
              : ""}
          </Heading>

          {/* Loading state when changing users */}
          {(isLoadingResponse || isFetchingResponse) && (
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              {[1, 2, 3].map((i) => (
                <Box key={i} mb={6}>
                  <SkeletonText
                    noOfLines={1}
                    spacing="4"
                    skeletonHeight="4"
                    width="60%"
                    mb={2}
                  />
                  <Skeleton height="20px" width="90%" mb={2} />
                  <Skeleton height="20px" width="80%" mb={2} />
                  <Skeleton height="20px" width="70%" />
                </Box>
              ))}
              <Flex justify="flex-end" mt={8}>
                <Skeleton height="32px" width="100px" borderRadius="4px" />
              </Flex>
            </Box>
          )}

          {/* Survey Questions and Responses */}
          {surveyResponseData && !isLoadingResponse && !isFetchingResponse && (
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="md"
              width="100%"
              mx="auto"
              mt={8}
            >
              {!surveyResponse?.doc && (
                <Alert status="info" mb={6} borderRadius="md">
                  <AlertIcon />
                  This user hasn't submitted their survey response yet.
                </Alert>
              )}

              {surveyData.questions && surveyData.questions.length > 0 ? (
                surveyData.questions.map((question, index) => {
                  const answerData = surveyResponseData?.questions?.find(
                    (q) => q.question === question._id
                  );
                  const answer = answerData?.answer;
                  const currentEval = evaluations.find(
                    (e) => e.question === question._id
                  );
                  if (!surveyResponseData) {
                    return (
                      <Box
                        key={question._id}
                        mb={index < surveyData.questions.length - 1 ? 8 : 0}
                      >
                        <FormLabel
                          fontSize="md"
                          fontWeight="bold"
                          mb={2}
                          color="black"
                        >
                          {index + 1}.
                          {question.text.charAt(0).toUpperCase() +
                            question.text.slice(1).toLowerCase()}
                        </FormLabel>
                        <FormControl mb={6}>
                          {question.type === "radio" && (
                            <RadioGroup value="">
                              <Stack direction="column" spacing={2}>
                                {question.options.map((option) => (
                                  <Radio
                                    key={option.opId}
                                    value={option.opId.toString()}
                                    colorScheme="blackAlpha"
                                    isReadOnly
                                    isDisabled
                                    color="black"
                                  >
                                    {option.text}
                                  </Radio>
                                ))}
                              </Stack>
                            </RadioGroup>
                          )}

                          {question.type === "checkbox" && (
                            <CheckboxGroup value={[]}>
                              <Stack direction="column" spacing={2}>
                                {question.options.map((option) => (
                                  <Checkbox
                                    key={option.opId}
                                    value={option.opId.toString()}
                                    colorScheme="blackAlpha"
                                    isReadOnly
                                    isDisabled
                                    color="black"
                                  >
                                    {option.text}
                                  </Checkbox>
                                ))}
                              </Stack>
                            </CheckboxGroup>
                          )}

                          {question.type === "text" && (
                            <Textarea
                              value=""
                              isReadOnly
                              bg="gray.50"
                              focusBorderColor="brand.500"
                              minH="100px"
                              placeholder="No answer submitted"
                            />
                          )}
                        </FormControl>
                      </Box>
                    );
                  }

                  return (
                    <Box
                      key={question._id}
                      mb={index < surveyData.questions.length - 1 ? 8 : 0}
                    >
                      <Flex align="center" justify="space-between" mb={3}>
                        <FormLabel
                          fontSize="md"
                          fontWeight="bold"
                          mb={0}
                          color="black"
                        >
                          {index + 1}. {question.text}
                        </FormLabel>

                        {answerData && (
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
                              onClick={() =>
                                handleEvaluation(question._id, true)
                              }
                              _hover={{ color: "green.500" }}
                            />
                            <Icon
                              as={IoThumbsDown}
                              boxSize={5}
                              color={
                                currentEval?.liked === false
                                  ? "red.400"
                                  : "gray.400"
                              }
                              cursor="pointer"
                              onClick={() =>
                                handleEvaluation(question._id, false)
                              }
                              _hover={{ color: "red.500" }}
                            />
                          </Flex>
                        )}
                      </Flex>

                      <FormControl mb={6}>
                        {question.type === "radio" && (
                          <RadioGroup
                            value={answer ? answer.toString() : ""}
                            isReadOnly
                          >
                            <Stack direction="column" spacing={2}>
                              {question.options.map((option) => (
                                <Radio
                                  key={option.opId}
                                  value={option.opId.toString()}
                                  colorScheme="brand"
                                  isChecked={answer === option.opId.toString()}
                                >
                                  {option.text}
                                </Radio>
                              ))}
                            </Stack>
                          </RadioGroup>
                        )}

                        {question.type === "checkbox" && (
                          <CheckboxGroup
                            value={answer ? answer.map(String) : []}
                          >
                            <Stack direction="column" spacing={2}>
                              {question.options.map((option) => (
                                <Checkbox
                                  key={option.opId}
                                  value={option.opId.toString()}
                                  colorScheme="brand"
                                  isChecked={
                                    answer &&
                                    answer.includes(option.opId.toString())
                                  }
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
                            value={answer || ""}
                            isReadOnly
                            bg="gray.50"
                            focusBorderColor="brand.500"
                            minH="100px"
                            placeholder={
                              hasSubmitted
                                ? "No answer provided"
                                : "User hasn't answered this question yet"
                            }
                          />
                        )}
                      </FormControl>
                    </Box>
                  );
                })
              ) : (
                <Text color="gray.500" textAlign="center">
                  No questions found for this survey.
                </Text>
              )}

              {/* Submit Evaluation Button - only show if response exists */}
              {surveyResponse?.doc && (
                <Flex justify="flex-end" mt={8}>
                  <AppButton
                    onClick={handleSubmitEvaluation}
                    color="black"
                    bg="#EDC270"
                    borderRadius="4px"
                    _hover={{ bg: "#e0b85c" }}
                    _active={{ bg: "#d1a94b" }}
                    isDisabled={
                      !hasChangedEvaluation ||
                      !evaluations.some(
                        (e) => e.liked !== undefined && e.liked !== null
                      ) ||
                      isButtonDisable
                    }
                  >
                    Submit
                  </AppButton>
                </Flex>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Desktop Sidebar */}
      <Box
        width={SIDEBAR_WIDTH}
        height="calc(100vh - 78px)"
        borderLeft="1px solid"
        borderColor="gray.200"
        bg="white"
        overflowY="auto"
        position="fixed"
        top="80px"
        right="0"
        zIndex="10"
        display="flex"
        flexDirection="column"
        sx={{
          // >= 0px
          "@media (min-width: 0px)": {
            display: "none",
          },
          // // >= 812px
          // '@media (min-width: 812px)': {
          // 	gridTemplateColumns: '1fr',
          // },
          // >= 992px
          "@media (min-width: 600px)": {
            display: "none",
          },
          // >= 1280px
          "@media (min-width: 1040px)": {
            display: "block",
          },
          // >= 1664px
          "@media (min-width: 1564px)": {
            display: "block",
          },
          // >= 1920px (e.g., Full HD+)
          "@media (min-width: 2120px)": {
            display: "block",
          },
          // >= 2560px (2.5K / QHD)
          "@media (min-width: 2560px)": {
            display: "block",
          },
          // >= 3840px (4K)
          "@media (min-width: 3840px)": {
            display: "block",
          },
          // >= 7680px (8K)
          "@media (min-width: 7680px)": {
            display: "block",
          },
        }}
      >
        {SidebarContent}
      </Box>

      <>
        {/* Mobile Search Button */}
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
          onClick={onOpen}
          _hover={{ bg: "#e0b85c" }}
          _active={{ bg: "#d1a94b" }}
          sx={{
            // >= 0px
            "@media (min-width: 0px)": {
              display: "block",
            },
            // // >= 812px
            // '@media (min-width: 812px)': {
            // 	gridTemplateColumns: '1fr',
            // },
            // >= 992px
            "@media (min-width: 600px)": {
              display: "block",
            },
            // >= 1280px
            "@media (min-width: 1040px)": {
              display: "none",
            },
            // >= 1664px
            "@media (min-width: 1564px)": {
              display: "none",
            },
            // >= 1920px (e.g., Full HD+)
            "@media (min-width: 2120px)": {
              display: "none",
            },
            // >= 2560px (2.5K / QHD)
            "@media (min-width: 2560px)": {
              display: "none",
            },
            // >= 3840px (4K)
            "@media (min-width: 3840px)": {
              display: "none",
            },
            // >= 7680px (8K)
            "@media (min-width: 7680px)": {
              display: "none",
            },
          }}
        >
          Search
        </Button>

        {/* Mobile Sidebar Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Survey Users</DrawerHeader>
            <DrawerBody p={0}>{SidebarContent}</DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    </Flex>
  );
};

export default ViewSurveyResponse;
