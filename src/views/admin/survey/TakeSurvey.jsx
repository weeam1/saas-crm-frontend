import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Stack,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AppButton from "components/shared/AppButton";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import TakeSurveyLoading from "./Loader/TakeSurveyLoading";
import Breadcrumb from "../../../components/shared/BreadCrumb";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const TakeSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [checkboxAnswers, setCheckboxAnswers] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const { createUserLog } = useUserActivityLog();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useFetchItemsQuery({
    path: `/surveys/${id}`,
  });

  const survey = response?.doc;

  const [submitAnswers, { isLoading: isSubmitting }] = useCreateItemMutation();

  const handleRadioChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const handleCheckboxChange = (questionId, optionId, isChecked) => {
    setCheckboxAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      let newAnswers;

      if (isChecked) {
        newAnswers = [...currentAnswers, parseInt(optionId)];
      } else {
        newAnswers = currentAnswers.filter((id) => id !== parseInt(optionId));
      }

      return {
        ...prev,
        [questionId]: newAnswers,
      };
    });
  };

  const handleTextAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!survey || !survey.questions) {
        throw new Error("Survey data is not available");
      }

      // Validate: all questions must be answered
      const unanswered = survey.questions.some((question) => {
        if (question.type === "checkbox") {
          return (
            !checkboxAnswers[question._id] ||
            checkboxAnswers[question._id].length === 0
          );
        } else {
          return (
            !answers[question._id] ||
            answers[question._id].toString().trim() === ""
          );
        }
      });

      if (unanswered) {
        toast.warning("Please answer all questions before submitting.");
        return;
      }

      const questionsPayload = survey.questions.map((question) => {
        if (question.type === "checkbox") {
          return {
            question: question._id,
            answer: checkboxAnswers[question._id] || null,
          };
        } else if (question.type === "radio") {
          return {
            question: question._id,
            answer: answers[question._id] || null,
          };
        } else {
          return {
            question: question._id,
            answer: answers[question._id] || null,
          };
        }
      });

      const payload = {
        questions: questionsPayload,
      };

      await submitAnswers({
        path: `/surveys/responses/submit/${id}`,
        body: payload,
      }).unwrap();

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Survey",
        entityId: id,
        entityType: "SurveyResponse",
        status: "success",
        message: `"${user?.fullName}" take a survey "${response?.doc?.title || "Untitled"}".`,
      });
      toast.success("Survey submitted");

      navigate("/survey");
    } catch (error) {
      toast.error("Error submitting survey");
      const errorMsg =
        error?.data?.message || "Failed to take the survey. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entityType: "SurveyResponse",
        entity: "Survey",
        entityId: id || null,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  if (isLoading) return <TakeSurveyLoading />;
  if (isError)
    return (
      <Box p={{ base: 2, md: 4 }}>
        <Box
          bg="#FFF0F0"
          border="1px solid #FFB3B3"
          borderRadius="md"
          p={6}
          textAlign="center"
          color="red.600"
          fontWeight="bold"
          fontSize="lg"
        >
          Error loading survey:
          <Text mt={2} fontWeight="normal" color="red.500" fontSize="md">
            {error.message}
          </Text>
        </Box>
      </Box>
    );
  if (!survey)
    return (
      <Box p={{ base: 2, md: 4 }}>
        <Box
          bg="#FFFBEA"
          border="1px solid #FFE6A1"
          borderRadius="md"
          p={6}
          textAlign="center"
          color="orange.700"
          fontWeight="bold"
          fontSize="lg"
        >
          Survey not found
        </Box>
      </Box>
    );

  const items = [
    {
      path: "/survey",
      label: "Surveys",
    },
    {
      path: `/survey/take-survey/${id}`,
      label: "Take Survey",
    },
  ];
  return (
    <Box p={{ base: 2, md: 4 }}>
      <Breadcrumb items={items} />

      <AppButton
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
        size="sm"
      >
        Back
      </AppButton>
      {/* Survey Title */}
      <Heading
        as="h1"
        size="md"
        color="black"
        mb={2}
        fontSize={{ base: "xl", md: "2xl" }}
        textAlign="left"
        fontWeight="700"
      >
        {survey.title
          ? survey.title.charAt(0).toUpperCase() + survey.title.slice(1)
          : ""}
      </Heading>
      <Box
        bg="#FFFFFF"
        p={{ base: 4, md: 6 }}
        borderRadius="md"
        boxShadow="sm"
        maxW="100%"
        width="100%"
        mx="auto"
      >
        <VStack spacing={4} align="stretch">
          {survey &&
            survey?.questions.map((question, index) => (
              <React.Fragment key={question._id}>
                <FormControl isRequired={question.isRequired}>
                  <FormLabel
                    fontSize="md"
                    fontWeight="semibold"
                    mb={2}
                    color="gray.700"
                  >
                    {index + 1}.{" "}
                    {question.text.charAt(0).toUpperCase() +
                      question.text.slice(1).toLowerCase()}
                    {question.isRequired && (
                      <Text as="span" color="red.500" ml={1}>
                        *
                      </Text>
                    )}
                  </FormLabel>

                  {question.type === "radio" && (
                    <RadioGroup
                      value={answers[question._id]?.toString() || ""}
                      onChange={(value) =>
                        handleRadioChange(question._id, value)
                      }
                    >
                      <Stack direction="column" spacing={1}>
                        {question.options.map((option) => (
                          <Radio
                            key={option.opId}
                            value={option.opId.toString()}
                            colorScheme="brand"
                            fontSize="sm"
                          >
                            <Text fontSize="sm">{option.text}</Text>
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  )}

                  {question.type === "checkbox" && (
                    <CheckboxGroup>
                      <Stack direction="column" spacing={1}>
                        {question.options.map((option) => (
                          <Checkbox
                            key={option.opId}
                            value={option.opId.toString()}
                            colorScheme="brand"
                            isChecked={
                              checkboxAnswers[question._id]?.includes(
                                option.opId
                              ) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(
                                question._id,
                                option.opId,
                                e.target.checked
                              )
                            }
                            fontSize="sm"
                          >
                            <Text fontSize="sm">{option.text}</Text>
                          </Checkbox>
                        ))}
                      </Stack>
                    </CheckboxGroup>
                  )}

                  {question.type === "text" && (
                    <Textarea
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        handleTextAnswerChange(question._id, e.target.value)
                      }
                      placeholder="Type your answer here..."
                      focusBorderColor="brand.500"
                      minH="80px"
                      fontSize="sm"
                    />
                  )}
                </FormControl>

                {index < survey.questions.length - 1 && (
                  <Divider borderColor="gray.200" my={4} />
                )}
              </React.Fragment>
            ))}

          <Flex justify="flex-end" mt={4}>
            <Button
              bg="#EDC270"
              color="#000000"
              size="sm"
              px={6}
              borderRadius="4px"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting..."
              _hover={{ bg: "#e0b85c" }}
              _active={{ bg: "#d1a94b" }}
            >
              Submit
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default TakeSurvey;
