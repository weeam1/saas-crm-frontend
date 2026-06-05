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
  Badge,
  Divider,
  Tooltip,
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

  // const SidebarContent = (
  //   <>
  //     <Box p={4}>
  //       <InputGroup>
  //         <InputLeftElement pointerEvents="none">
  //           <Icon as={IoSearch} color="gray.400" />
  //         </InputLeftElement>
  //         <Input
  //           placeholder="Search users..."
  //           focusBorderColor="brand.500"
  //           bg="#F4F4F4"
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           fontWeight="700"
  //         />
  //       </InputGroup>
  //     </Box>
  //     <VStack
  //       align="stretch"
  //       spacing={2}
  //       px={4}
  //       pb={4}
  //       flex="1"
  //       overflowY="auto"
  //       css={{
  //         "&::-webkit-scrollbar": {
  //           width: "6px",
  //         },
  //         "&::-webkit-scrollbar-track": {
  //           background: "#f1f1f1",
  //         },
  //         "&::-webkit-scrollbar-thumb": {
  //           background: "#888",
  //           borderRadius: "3px",
  //         },
  //         "&::-webkit-scrollbar-thumb:hover": {
  //           background: "#555",
  //         },
  //       }}
  //     >
  //       <Text fontWeight="bold" fontSize="lg" mb={2}>
  //         Survey Users
  //       </Text>
  //       {filteredUsers.length === 0 ? (
  //         <Box py={8} textAlign="center" color="gray.500" fontWeight="medium">
  //           No user found
  //         </Box>
  //       ) : (
  //         filteredUsers.map((userData) => (
  //           <HStack
  //             key={userData.user._id}
  //             spacing={3}
  //             bg={currentUserId === userData.user._id ? "#ABFF8D" : "gray.100"}
  //             p={3}
  //             borderRadius="md"
  //             _hover={{
  //               bg:
  //                 currentUserId === userData.user._id ? "#ABFF8D" : "gray.200",
  //             }}
  //             cursor="pointer"
  //             onClick={() => handleUserClick(userData.user._id)}
  //           >
  //             <Avatar
  //               size="sm"
  //               name={userData?.user?.fullName}
  //               src={userData?.user?.profileImage}
  //             />
  //             <Box flex="1">
  //               <Text fontWeight="medium">{userData?.user?.fullName || 'N/A'}</Text>
  //               <Text fontSize="sm" color="gray.500">
  //                 {userData.user.roles[0]?.roleName || "User"}
  //               </Text>

  //               <Text fontSize={"sm"} color={"#FF0000"}>
  //                 {(userPoints[userData.user._id] ?? userData?.points ?? 0) ===
  //                   0 && userData?.status === "pending"
  //                   ? "Pending"
  //                   : `${userPoints[userData.user._id] ?? userData?.points ?? 0}/${surveyData?.questionsCount}`}
  //               </Text>
  //             </Box>
  //             <Box
  //               bg="brand.500"
  //               borderRadius="md"
  //               p={1}
  //               display="flex"
  //               justifyContent="center"
  //               alignItems="center"
  //             >
  //               <Icon as={IoEye} color="white" boxSize={4} />
  //             </Box>
  //           </HStack>
  //         ))
  //       )}
  //     </VStack>
  //   </>
  // );

  const SidebarContent = (
    <>
      <Box p={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={IoSearch} color="text.muted" />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            borderColor="border.default"
            bg="bg.input"
            color="text.body"
            _placeholder={{ color: "text.muted" }}
            _hover={{ borderColor: "gold.dark" }}
            _focus={{
              borderColor: "gold.primary",
              boxShadow: "0 0 0 1px #D4AF37",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fontWeight="500"
            fontSize="sm"
            borderRadius="lg"
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
            background: "rgba(212, 175, 55, 0.05)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "navy.600",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "gold.dark",
          },
        }}
      >
        <Text fontWeight="bold" fontSize="md" color="text.heading" mb={2}>
          Survey Users
        </Text>
        {filteredUsers.length === 0 ? (
          <Box py={8} textAlign="center" color="text.muted" fontWeight="medium">
            No user found
          </Box>
        ) : (
          filteredUsers.map((userData) => {
            const isCurrentUser = currentUserId === userData.user._id;
            const userPointsValue = userPoints[userData.user._id] ?? userData?.points ?? 0;
            const isPending = userPointsValue === 0 && userData?.status === "pending";

            return (
              // <HStack
              //   key={userData.user._id}
              //   spacing={3}
              //   bg={isCurrentUser ? "rgba(146, 147, 147, 0.5)" : "bg.elevated"}
              //   p={3}
              //   borderRadius="lg"
              //   border="1px solid"
              //   borderColor={isCurrentUser ? "gold.primary" : "border.subtle"}
              //   transition="all 0.2s"
              //   _hover={{
              //     bg: isCurrentUser ? "rgba(212, 175, 55, 0.15)" : "bg.elevated",
              //     borderColor: "gold.primary",
              //     transform: "translateX(2px)",
              //   }}
              //   cursor="pointer"
              //   onClick={() => handleUserClick(userData.user._id)}
              // >
              //   <Avatar
              //     size="sm"
              //     name={userData?.user?.fullName}
              //     src={userData?.user?.profileImage}
              //     bg="navy.600"
              //   />
              //   <Box flex="1">
              //     <Text fontWeight="600" fontSize="sm" color="text.heading">
              //       {userData?.user?.fullName || 'N/A'}
              //     </Text>
              //     <Text fontSize="xs" color="text.muted">
              //       {userData.user.roles[0]?.roleName || "User"}
              //     </Text>
              //     <Text fontSize="xs" fontWeight="500" color={isPending ? "orange.400" : "gold.primary"}>
              //       {isPending
              //         ? "Pending"
              //         : `${userPointsValue}/${surveyData?.questionsCount}`}
              //     </Text>
              //   </Box>
              //   <Box
              //     bg="rgba(212, 175, 55, 0.1)"
              //     borderRadius="lg"
              //     p={1.5}
              //     display="flex"
              //     justifyContent="center"
              //     alignItems="center"
              //     transition="all 0.2s"
              //     _hover={{ bg: "rgba(212, 175, 55, 0.2)", transform: "scale(1.05)" }}
              //   >
              //     <Icon as={IoEye} color="gold.primary" boxSize={4} />
              //   </Box>
              // </HStack>

              <HStack
                key={userData.user._id}
                spacing={3}
                bg={isCurrentUser ? "rgba(212, 175, 55, 0.12)" : "bg.elevated"}
                p={3}
                borderRadius="xl"
                border="1px solid"
                borderColor={isCurrentUser ? "gold.primary" : "border.subtle"}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                overflow="hidden"
                _hover={{
                  bg: isCurrentUser ? "rgba(212, 175, 55, 0.18)" : "bg.elevated",
                  borderColor: "gold.primary",
                  transform: "translateX(4px)",
                  boxShadow: "goldGlow",
                }}
                cursor="pointer"
                onClick={() => handleUserClick(userData.user._id)}
              >
                {/* Active indicator dot for current user */}
                {isCurrentUser && (
                  <Box
                    position="absolute"
                    left={0}
                    top="50%"
                    transform="translateY(-50%)"
                    w="3px"
                    h="40px"
                    bg="gold.primary"
                    borderTopRightRadius="full"
                    borderBottomRightRadius="full"
                  />
                )}

                {/* Avatar with status ring */}
                <Box position="relative">
                  <Avatar
                    size="sm"
                    name={userData?.user?.fullName}
                    src={userData?.user?.profileImage}
                  />
                </Box>

                <Box flex="1">
                  <Flex align="center" gap={2}>
                    <Text fontWeight="600" fontSize="sm" color="text.heading">
                      {userData?.user?.fullName || 'N/A'}
                    </Text>
                    {isCurrentUser && (
                      <Badge variant="gold" fontSize="9px" px={1.5} py={0.5} borderRadius="full">
                        You
                      </Badge>
                    )}
                  </Flex>
                  <Text fontSize="xs" color="text.muted" mt={0.5}>
                    {userData.user.roles[0]?.roleName || "User"}
                  </Text>

                  {/* Progress indicator */}
                  {!isPending && (
                    <Flex align="center" gap={2} mt={1.5}>
                      <Box flex="1" bg="border.subtle" borderRadius="full" h="3px" maxW="60px">
                        <Box
                          w={`${(userPointsValue / (surveyData?.questionsCount || 1)) * 100}%`}
                          bg="gold.primary"
                          borderRadius="full"
                          h="3px"
                          transition="width 0.3s ease"
                        />
                      </Box>
                      <Text fontSize="xs" fontWeight="600" color={isPending ? "orange.400" : "gold.primary"}>
                        {`${userPointsValue}/${surveyData?.questionsCount}`}
                      </Text>
                    </Flex>
                  )}

                  {isPending && (
                    <Text fontSize="xs" fontWeight="500" color="orange.400" mt={1.5}>
                      ⏳ Pending
                    </Text>
                  )}
                </Box>

                {/* View button with tooltip */}
                <Box
                  bg="rgba(212, 175, 55, 0.1)"
                  borderRadius="lg"
                  p={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  transition="all 0.2s"
                  _hover={{
                    bg: "rgba(212, 175, 55, 0.25)",
                    transform: "scale(1.1)",
                    cursor: "pointer",
                  }}
                >
                  <Icon as={IoEye} color="gold.primary" boxSize={4} />
                </Box>
              </HStack>
            );
          })
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
              leftIcon={<IoArrowBack />}
              onClick={() => navigate(-1)}
              mb={4}
              size='sm'
              variant='ghost'
            >
              Back
            </AppButton>
          </Flex>
          <Heading
            as="h1"
            mb={2}
            color="white"
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
            <Box
              bg="bg.surface"
              p={6}
              borderRadius="xl"
              boxShadow="card"
              border="1px solid"
              borderColor="border.default"
            >
              {/* User Profile Skeleton */}
              <Flex align="center" gap={4} mb={6}>
                <Skeleton
                  boxSize="50px"
                  borderRadius="full"
                  startColor="rgba(212, 175, 55, 0.1)"
                  endColor="rgba(26, 53, 80, 0.2)"
                />
                <Box flex="1">
                  <Skeleton
                    height="20px"
                    width="200px"
                    mb={2}
                    startColor="rgba(212, 175, 55, 0.1)"
                    endColor="rgba(26, 53, 80, 0.2)"
                  />
                  <Skeleton
                    height="14px"
                    width="150px"
                    startColor="rgba(212, 175, 55, 0.1)"
                    endColor="rgba(26, 53, 80, 0.2)"
                  />
                </Box>
              </Flex>

              {/* Questions Skeleton */}
              {[1, 2, 3].map((i) => (
                <Box key={i} mb={5}>
                  <Skeleton
                    height="20px"
                    width="250px"
                    mb={3}
                    startColor="rgba(212, 175, 55, 0.1)"
                    endColor="rgba(26, 53, 80, 0.2)"
                  />
                  <Skeleton
                    height="14px"
                    width="90%"
                    mb={2}
                    startColor="rgba(212, 175, 55, 0.08)"
                    endColor="rgba(26, 53, 80, 0.15)"
                  />
                  <Skeleton
                    height="14px"
                    width="80%"
                    mb={2}
                    startColor="rgba(212, 175, 55, 0.08)"
                    endColor="rgba(26, 53, 80, 0.15)"
                  />
                  <Skeleton
                    height="14px"
                    width="70%"
                    startColor="rgba(212, 175, 55, 0.08)"
                    endColor="rgba(26, 53, 80, 0.15)"
                  />
                  {i < 3 && <Divider my={4} borderColor="border.subtle" />}
                </Box>
              ))}

              {/* Button Skeleton */}
              <Flex justify="flex-end" mt={4}>
                <Skeleton
                  height="36px"
                  width="100px"
                  borderRadius="lg"
                  startColor="rgba(212, 175, 55, 0.1)"
                  endColor="rgba(26, 53, 80, 0.2)"
                />
              </Flex>
            </Box>
          )}

          {/* Survey Questions and Responses */}
          {surveyResponseData && !isLoadingResponse && !isFetchingResponse && (
            <Box
              bg="bg.surface"
              p={6}
              borderRadius="xl"
              boxShadow="card"
              border="1px solid"
              borderColor="border.default"
              width="100%"
              mx="auto"
              mt={8}
            >
              {!surveyResponse?.doc && (
                <Alert
                  status="info"
                  mb={6}
                  borderRadius="lg"
                  bg="rgba(66, 153, 225, 0.1)"
                  borderLeft="3px solid"
                  borderLeftColor="#4299E1"
                >
                  <AlertIcon color="#4299E1" />
                  <Text color="text.body" fontSize="sm">
                    This user hasn't submitted their survey response yet.
                  </Text>
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
                        mb={index < surveyData.questions.length - 1 ? 6 : 0}
                        pb={index < surveyData.questions.length - 1 ? 4 : 0}
                        borderBottom={index < surveyData.questions.length - 1 ? "1px solid" : "none"}
                        borderBottomColor="border.subtle"
                      >
                        <FormLabel
                          fontSize="md"
                          fontWeight="600"
                          mb={3}
                          color="text.heading"
                        >
                          {index + 1}. {question.text.charAt(0).toUpperCase() + question.text.slice(1).toLowerCase()}
                        </FormLabel>
                        <FormControl mb={4}>
                          {question.type === "radio" && (
                            <RadioGroup value="">
                              <Stack direction="column" spacing={2}>
                                {question.options.map((option) => (
                                  <Radio
                                    key={option.opId}
                                    value={option.opId.toString()}
                                    colorScheme="brand"
                                    isReadOnly
                                    isDisabled
                                    color="text.body"
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
                                    colorScheme="brand"
                                    isReadOnly
                                    isDisabled
                                    color="text.body"
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
                              bg="bg.input"
                              borderColor="border.default"
                              focusBorderColor="gold.primary"
                              minH="100px"
                              placeholder="No answer submitted"
                              color="text.muted"
                              _placeholder={{ color: "text.muted" }}
                            />
                          )}
                        </FormControl>
                      </Box>
                    );
                  }

                  return (
                    <Box
                      key={question._id}
                      mb={index < surveyData.questions.length - 1 ? 6 : 0}
                      pb={index < surveyData.questions.length - 1 ? 4 : 0}
                      borderBottom={index < surveyData.questions.length - 1 ? "1px solid" : "none"}
                      borderBottomColor="border.subtle"
                    >
                      <Flex align="center" justify="space-between" mb={3}>
                        <FormLabel
                          fontSize="md"
                          fontWeight="600"
                          mb={0}
                          color="text.heading"
                        >
                          {index + 1}. {question.text}
                        </FormLabel>

                        {answerData && (
                          <HStack spacing={2}>
                            <Tooltip label="Helpful" placement="top" hasArrow>
                              <Icon
                                as={IoThumbsUp}
                                boxSize={5}
                                color={currentEval?.liked === true ? "green.400" : "text.muted"}
                                cursor="pointer"
                                onClick={() => handleEvaluation(question._id, true)}
                                _hover={{ color: "green.400", transform: "scale(1.1)" }}
                                transition="all 0.15s"
                              />
                            </Tooltip>
                            <Tooltip label="Not Helpful" placement="top" hasArrow>
                              <Icon
                                as={IoThumbsDown}
                                boxSize={5}
                                color={currentEval?.liked === false ? "red.400" : "text.muted"}
                                cursor="pointer"
                                onClick={() => handleEvaluation(question._id, false)}
                                _hover={{ color: "red.400", transform: "scale(1.1)" }}
                                transition="all 0.15s"
                              />
                            </Tooltip>
                          </HStack>
                        )}
                      </Flex>

                      <FormControl mb={4}>
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
                                  color="text.body"
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
                                  color="text.body"
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
                            bg="bg.input"
                            borderColor="border.default"
                            _hover={{ borderColor: "gold.dark" }}
                            focusBorderColor="gold.primary"
                            minH="100px"
                            placeholder={
                              hasSubmitted
                                ? "No answer provided"
                                : "User hasn't answered this question yet"
                            }
                            color="text.body"
                            _placeholder={{ color: "text.muted" }}
                          />
                        )}
                      </FormControl>
                    </Box>
                  );
                })
              ) : (
                <Text color="text.muted" textAlign="center" py={8}>
                  No questions found for this survey.
                </Text>
              )}

              {/* Submit Evaluation Button - only show if response exists */}
              {surveyResponse?.doc && (
                <Flex justify="flex-end" mt={6}>
                  <AppButton
                    onClick={handleSubmitEvaluation}
                    variant="brand"
                    isDisabled={
                      !hasChangedEvaluation ||
                      !evaluations.some(
                        (e) => e.liked !== undefined && e.liked !== null
                      ) ||
                      isButtonDisable
                    }
                  >
                    Submit Evaluation
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
        borderColor="brand.200"
        bg='gray.800'
        overflowY="auto"
        position="fixed"
        top="80px"
        right="0"
        zIndex="1"
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
