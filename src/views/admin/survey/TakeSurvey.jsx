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

const TakeSurvey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [checkboxAnswers, setCheckboxAnswers] = useState({});

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

      const questionsPayload = survey.questions.map((question) => {
        if (question.type === "checkbox") {
          return {
            question: question._id,
            answer: checkboxAnswers[question._id] || [],
          };
        } else if (question.type === "radio") {
          return {
            question: question._id,
            answer: answers[question._id] || null,
          };
        } else {
          return {
            question: question._id,
            answer: answers[question._id] || "",
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

      toast.success("Survey submitted");

      navigate("/survey");
    } catch (error) {
      toast.error("Error submitting survey");
    }
  };

  if (isLoading) return <Box>Loading survey...</Box>;
  if (isError) return <Box>Error loading survey: {error.message}</Box>;
  if (!survey) return <Box>Survey not found</Box>;

  return (
    <Box p={{ base: 4, md: 8 }}>
      <AppButton
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
      >
        Back
      </AppButton>

      <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="xl" color="brand.600">
            {survey?.title}
          </Heading>

          <Divider borderColor="gray.200" />

          { survey && survey?.questions.map((question, index) => (
            <React.Fragment key={question._id}>
              <FormControl isRequired={question.isRequired}>
                <FormLabel fontSize="lg" fontWeight="bold" mb={4}>
                  {index + 1}. {question.text}
                  {question.isRequired && (
                    <Text as="span" color="red.500" ml={1}>
                      *
                    </Text>
                  )}
                </FormLabel>

                {question.type === "radio" && (
                  <RadioGroup
                    value={answers[question._id]?.toString() || ""}
                    onChange={(value) => handleRadioChange(question._id, value)}
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
                  <CheckboxGroup>
                    <Stack direction="column" spacing={2}>
                      {question.options.map((option) => (
                        <Checkbox
                          key={option.opId}
                          value={option.opId.toString()}
                          colorScheme="brand"
                          isChecked={
                            checkboxAnswers[question._id]?.includes(option.opId) ||
                            false
                          }
                          onChange={(e) =>
                            handleCheckboxChange(
                              question._id,
                              option.opId,
                              e.target.checked
                            )
                          }
                        >
                          {option.text}
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
                    minH="100px"
                  />
                )}
              </FormControl>

              {index < survey.questions.length - 1 && (
                <Divider borderColor="gray.200" my={6} />
              )}
            </React.Fragment>
          ))}

          <Flex justify="flex-end" mt={8}>
            <Button
              colorScheme="brand"
              size="lg"
              px={8}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit Survey
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default TakeSurvey;