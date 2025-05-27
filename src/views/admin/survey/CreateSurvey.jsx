import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  Box,
  Heading,
  Text,
  Flex,
  Divider,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  useRadioGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import RadioCard from "./RadioCard";
import useFetchUserHierarchy from "hooks/useFetchUserHierarchy";
import { IoArrowBack } from "react-icons/io5";
import AppButton from "components/shared/AppButton";
import { useCreateItemMutation } from "api/apiSlice";

const CreateSurvey = () => {
  const navigate = useNavigate();
  const [createItemMutation] = useCreateItemMutation();
  const user = JSON.parse(localStorage.getItem("user"));
  const { allUsers, managers, agents } = useFetchUserHierarchy(user);

  const formik = useFormik({
    initialValues: {
      title: "",
      closesAt: "",
      questions: [
        {
          text: "",
          type: "text",
          options: [],
        },
      ],
      invitedUsers: [],
      selectedRole: "",
      selectedManager: null,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        // Prepare invitedUsers based on selection
        let invitedUsers = [];
        if (values.selectedRole === "all") {
          invitedUsers = allUsers.map((user) => user._id);
        } else if (values.selectedRole === "managers") {
          invitedUsers = managers.map((manager) => manager._id);
        } else if (values.selectedRole === "agents") {
          invitedUsers = agents.map((agent) => agent._id);
        } else if (values.selectedRole === "team" && values.selectedManager) {
          const manager = managers.find((m) => m._id === values.selectedManager);
          if (manager) {
            invitedUsers = manager.team.map((member) => member._id);
          }
        }

        const payload = {
          title: values.title,
          questions: values.questions.map((q) => {
            if (q.type === "text") {
              return { text: q.text, type: q.type };
            } else {
              return {
                text: q.text,
                type: q.type,
                options: q.options.map((opt) => ({ text: opt.text })),
              };
            }
          }),
          closesAt: new Date(values.closesAt).toISOString(),
          invitedUsers,
        };

        await createItemMutation({
          path: "/surveys",
          body: payload,
        }).unwrap();

        resetForm();
        navigate("/survey");
      } catch (error) {
        console.error("Failed to create survey:", error);
      }
    },
  });

  const addQuestion = () => {
    formik.setFieldValue("questions", [
      ...formik.values.questions,
      {
        text: "",
        type: "text",
        options: [],
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (formik.values.questions.length > 1) {
      const newQuestions = [...formik.values.questions];
      newQuestions.splice(index, 1);
      formik.setFieldValue("questions", newQuestions);
    }
  };

  const handleQuestionTypeChange = (index, type) => {
    const newQuestions = [...formik.values.questions];
    newQuestions[index].type = type;

    // Initialize options if switching to radio/checkbox
    if (
      (type === "radio" || type === "checkbox") &&
      newQuestions[index].options.length === 0
    ) {
      newQuestions[index].options = [{ text: "" }, { text: "" }];
    }

    formik.setFieldValue("questions", newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...formik.values.questions];
    newQuestions[questionIndex].options.push({ text: "" });
    formik.setFieldValue("questions", newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...formik.values.questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    formik.setFieldValue("questions", newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formik.values.questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    formik.setFieldValue("questions", newQuestions);
  };

  // Radio group setup for user selection
  const options = ["all", "managers", "agents", "team"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "roles",
    value: formik.values.selectedRole,
    onChange: (value) => formik.setFieldValue("selectedRole", value),
  });
  const group = getRootProps();
  const isFormIncomplete = () => {
    return (
      !formik.values.title ||
      !formik.values.closesAt ||
      !formik.values.selectedRole ||
      (formik.values.selectedRole === "team" && !formik.values.selectedManager)
    );
  };

  return (
    <Box p={{ base: 4, md: 8 }}>
      {/* Back Button */}
      <AppButton
        ml="2"
        leftIcon={<IoArrowBack />}
        onClick={() => navigate(-1)}
        mb={4}
      >
        Back
      </AppButton>

      <form onSubmit={formik.handleSubmit}>
        <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
          {/* Main Content Area */}
          <Flex direction={{ base: "column", lg: "row" }} gap={8}>
            {/* Left Side - Survey Configuration */}
            <Box bg="white" flex="1">
              <VStack spacing={6} align="stretch">
                <VStack align="flex-start">
                  <Text fontWeight="bold">Survey Title</Text>
                  <FormControl isInvalid={formik.errors.title && formik.touched.title}>
                    <Input
                      name="title"
                      value={formik.values.title}
                      placeholder="Survey name here"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      size="md"
                      focusBorderColor="brand.500"
                      bg="gray.300"
                      color="black"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                    <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
                  </FormControl>
                </VStack>

                <VStack align="flex-start">
                  <Text fontWeight="bold">Survey end date</Text>
                  <FormControl isInvalid={formik.errors.closesAt && formik.touched.closesAt}>
                    <Input
                      name="closesAt"
                      type="datetime-local"
                      value={formik.values.closesAt}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      size="md"
                      focusBorderColor="brand.500"
                      bg="gray.300"
                      color="black"
                      border="1px solid"
                      borderColor="gray.300"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <FormErrorMessage>{formik.errors.closesAt}</FormErrorMessage>
                  </FormControl>
                </VStack>

                <VStack align="flex-start">
                  <Text fontWeight="bold">Survey Users</Text>
                  <FormControl isInvalid={formik.errors.selectedRole}>
                    <HStack
                      {...group}
                      spacing={{ base: 2, md: 4 }}
                      mb={{ base: 2, md: 4 }}
                      wrap="wrap"
                      gap="2"
                    >
                      {options.map((value) => {
                        const radio = getRadioProps({ value });
                        return (
                          <RadioCard key={value} {...radio}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </RadioCard>
                        );
                      })}
                    </HStack>
                    <FormErrorMessage>{formik.errors.selectedRole}</FormErrorMessage>
                  </FormControl>

                  <FormControl 
                    isInvalid={formik.errors.selectedManager && formik.touched.selectedManager}
                    isDisabled={formik.values.selectedRole !== "team"}
                  >
                    <Select
                      name="selectedManager"
                      placeholder="Select manager"
                      value={formik.values.selectedManager || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      size="md"
                      focusBorderColor="brand.500"
                      bg="gray.100"
                      color="black"
                      border="1px solid"
                      borderColor="gray.300"
                      width={"50%"}
                      mt={3}
                    >
                      {managers.map((manager) => (
                        <option key={manager._id} value={manager._id}>
                          {manager.name}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{formik.errors.selectedManager}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </VStack>
            </Box>

            {/* Vertical Divider - Visible on desktop */}
            <Box
              display={{ base: "none", lg: "block" }}
              width="1px"
              bg="gray.200"
              mx={4}
            />

            {/* Right Side - Questions (Scrollable) */}
            <Box
              bg="white"
              p={3}
              flex="1"
              overflowY="auto"
              maxH={{ base: "auto", lg: "calc(100vh - 200px)" }}
            >
              {formik.values.questions.map((question, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider my={6} borderColor="gray.200" />}

                  <Flex align="center" mb={4}>
                    <Box
                      bg="brand.500"
                      color="white"
                      borderRadius="full"
                      w="32px"
                      h="32px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      mr={4}
                      flexShrink={0}
                    >
                      {index + 1}
                    </Box>
                    <Heading as="h3" size="md" flex={1} color="brand.600">
                      Question {index + 1}
                    </Heading>
                    {formik.values.questions.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeQuestion(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Flex>

                  <FormControl 
                    mb={4} 
                    isInvalid={formik.errors.questions?.[index]?.text && formik.touched.questions?.[index]?.text}
                  >
                    <FormLabel>Question Text</FormLabel>
                    <Input
                      name={`questions[${index}].text`}
                      value={question.text}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={`Enter question ${index + 1} text`}
                      size="lg"
                      focusBorderColor="brand.500"
                      bg="gray.300"
                      color="black"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                    <FormErrorMessage>
                      {formik.errors.questions?.[index]?.text}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      value={question.type}
                      onChange={(e) =>
                        handleQuestionTypeChange(index, e.target.value)
                      }
                      focusBorderColor="brand.500"
                      bg="gray.300"
                      color="black"
                      border="1px solid"
                      borderColor="gray.300"
                    >
                      <option value="text">Text Answer</option>
                      <option value="radio">Multiple Choice (Single Answer)</option>
                      <option value="checkbox">Multiple Choice (Multiple Answers)</option>
                    </Select>
                  </FormControl>

                  {(question.type === "radio" || question.type === "checkbox") && (
                    <Box mb={4}>
                      <FormLabel>Options</FormLabel>
                      <VStack spacing={3} align="stretch">
                        {question.options.map((option, optionIndex) => (
                          <HStack key={optionIndex}>
                            <FormControl
                              isInvalid={
                                formik.errors.questions?.[index]?.options?.[optionIndex]?.text &&
                                formik.touched.questions?.[index]?.options?.[optionIndex]?.text
                              }
                            >
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                                onBlur={formik.handleBlur}
                                placeholder={`Option ${optionIndex + 1}`}
                                focusBorderColor="brand.500"
                                bg="gray.300"
                                color="black"
                                border="1px solid"
                                borderColor="gray.300"
                              />
                              <FormErrorMessage>
                                {formik.errors.questions?.[index]?.options?.[optionIndex]?.text}
                              </FormErrorMessage>
                            </FormControl>
                            {question.options.length > 2 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                Remove
                              </Button>
                            )}
                          </HStack>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="brand"
                          onClick={() => addOption(index)}
                        >
                          Add Option
                        </Button>
                        {formik.errors.questions?.[index]?.options && (
                          <Text color="red.500" fontSize="sm">
                            {formik.errors.questions?.[index]?.options}
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  )}
                </React.Fragment>
              ))}

              <Button
                mt={6}
                colorScheme="brand"
                variant="outline"
                onClick={addQuestion}
              >
                Add Question
              </Button>
            </Box>
          </Flex>

            {/* Submit Section */}
          <Flex justify="flex-end" mt={8}>
            <Button
              colorScheme="brand"
              size="lg"
              px={8}
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={isFormIncomplete() || !formik.isValid}
            >
              Create Survey
            </Button>
          </Flex>
        </Box>
      </form>
    </Box>
  );
};

export default CreateSurvey;