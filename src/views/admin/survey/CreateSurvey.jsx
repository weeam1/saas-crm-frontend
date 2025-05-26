import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  NumberInput,
  NumberInputField,
  useRadioGroup,
  Icon,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import RadioCard from "./RadioCard";
import useFetchUserHierarchy from "hooks/useFetchUserHierarchy";
import { IoArrowBack } from "react-icons/io5";
import AppButton from "components/shared/AppButton";

const CreateSurvey = () => {
  const navigate = useNavigate();
  const [surveyName, setSurveyName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const [questions, setQuestions] = useState(
    Array(3)
      .fill()
      .map((_, i) => ({ id: i + 1, text: "" }))
  );
  const user = JSON.parse(localStorage.getItem("user"));
  const { allUsers, managers, agents } = useFetchUserHierarchy(user);
  console.log("managers", managers);
  const handleQuestionChange = (id, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text: value } : q))
    );
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        text: "",
      },
    ]);
    setNumQuestions(numQuestions + 1);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
      setNumQuestions(numQuestions - 1);
    }
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    if (value !== "team") {
      setSelectedManager(null);
    }
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
  };

  // Radio group setup
  const options = ["all", "managers", "agents", "team"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "roles",
    value: selectedRole,
    onChange: handleRoleChange,
  });
  const group = getRootProps();

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
      <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
        {/* Main Content Area */}
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Left Side - Survey Configuration */}
          <Box bg="white" flex="1">
            <VStack spacing={6} align="stretch">
              <VStack align="flex-start">
                <Text fontWeight="bold">Survey Title</Text>
                <Input
                  type="text "
                  value={endDate}
                  placeholder="Survey name here"
                  onChange={(e) => setSurveyName(e.target.value)}
                  size="md"
                  focusBorderColor="brand.500"
                  bg="gray.300"
                  color="black"
                  border="1px solid"
                  borderColor="gray.300"
                />
              </VStack>

              <VStack align="flex-start">
                <Text fontWeight="bold">Survey end date</Text>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="md"
                  focusBorderColor="brand.500"
                  bg="gray.300"
                  color="black"
                  border="1px solid"
                  borderColor="gray.300"
                />
              </VStack>

              <VStack align="flex-start">
                <Text fontWeight="bold">Survey questions</Text>
                <NumberInput
                  min={1}
                  max={20}
                  value={numQuestions}
                  onChange={(value) => {
                    const num = parseInt(value);
                    if (num > questions.length) {
                      const newQuestions = [...questions];
                      for (let i = questions.length + 1; i <= num; i++) {
                        newQuestions.push({ id: i, text: "" });
                      }
                      setQuestions(newQuestions);
                    } else if (num < questions.length) {
                      setQuestions(questions.slice(0, num));
                    }
                    setNumQuestions(num);
                  }}
                  width={"100%"}
                >
                  <NumberInputField
                    focusBorderColor="brand.500"
                    bg="gray.300"
                    color="black"
                    border="1px solid"
                    borderColor="gray.300"
                  />
                </NumberInput>
              </VStack>

              <VStack align="flex-start">
                <Text fontWeight="bold">Survey Users</Text>
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
                <Select
                  placeholder="Select manager"
                  value={selectedManager}
                  onChange={handleManagerChange}
                  size="md"
                  focusBorderColor="brand.500"
                  bg="gray.100"
                  color="black"
                  border="1px solid"
                  borderColor="gray.300"
                  isDisabled={selectedRole !== "team"}
                  width={"50%"}
                  mt={10}
                >
                  {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                      {manager.name}
                    </option>
                  ))}
                </Select>
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
            {questions.map((question, index) => (
              <React.Fragment key={question.id}>
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
                    {question.id}
                  </Box>
                  <Heading as="h3" size="md" flex={1} color="brand.600">
                    Question {question.id}
                  </Heading>
                  {questions.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeQuestion(question.id)}
                    >
                      Remove
                    </Button>
                  )}
                </Flex>

                <Input
                  variant="filled"
                  placeholder={`Enter question ${question.id} text`}
                  size="lg"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(question.id, e.target.value)
                  }
                  focusBorderColor="brand.500"
                  bg="gray.300"
                  color="black"
                  border="1px solid"
                  borderColor="gray.300"
                />
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
          <Button colorScheme="brand" size="lg" px={8}>
            Create Survey
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default CreateSurvey;
