import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  useColorModeValue,
  Flex,
  Spinner,
  Divider,
  Badge,
  Icon,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import useUserSession from "hooks/useUserSession";
import { toast } from "react-toastify";
import { getBadgeColors } from "utils/colorUtils";

import { AddIcon, MinusIcon, StarIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { FiChevronLeft } from "react-icons/fi";

const EvaluationEditForm = () => {
  const { roleId, userId, evaluationId } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { user: loggedInUser } = useUserSession();

  const now = new Date();
  const defaultMonth = String(now.getMonth() + 1).padStart(2, "0");
  const defaultYear = String(now.getFullYear());

  const month = searchParams.get("month") || defaultMonth;
  const year = searchParams.get("year") || defaultYear;

  // States
  const [errorMessage, setErrorMessage] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [showTooltip, setShowTooltip] = useState({});
  const [existingEvaluation, setExistingEvaluation] = useState(null);

  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headerBg = useColorModeValue("gray.50", "gray.600");
  const focusColor = useColorModeValue("brand.500", "brand.300");

  // Fetch template data
  const { data: templateData, isLoading: templateLoading } = useFetchItemsQuery(
    {
      path: `/evaluation/templates/roles`,
      params: { role: roleId },
    },
    {
      skip: !roleId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  // Fetch user evaluation details
  const {
    data: userEval,
    isLoading: userEvalLoading,
    refetch: refetchUserEval,
  } = useFetchItemsQuery(
    {
      path: `/evaluation/users/user/${userId}`,
      params: { month, year },
    },
    {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    },
  );

  // Fetch specific evaluation by ID if available
  const { data: specificEvaluation, isLoading: specificEvaluationLoading } =
    useFetchItemsQuery(
      {
        path: `/evaluation/users/${evaluationId}`,
      },
      {
        skip: !evaluationId,
        refetchOnMountOrArgChange: true,
      },
    );

  // Update evaluation mutation
  const [createEvaluation, { isLoading: creating }] = useCreateItemMutation();
  // Initialize form with dynamic validation
  const evaluationSchema = yup.object().shape({
    notes: yup
      .string()
      .max(500, "Notes cannot exceed 500 characters")
      .required("Evaluation notes are required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(evaluationSchema),
    defaultValues: {
      notes: "",
    },
  });

  const notesLength = watch("notes")?.length || 0;

  // Process template data and existing evaluation
  useEffect(() => {
    if (templateData?.doc?.[0]?.hasTemplate) {
      const templateInfo = templateData.doc[0];
      setTemplate(templateInfo.template);

      // Initialize scores with 0 for all attributes
      const initialScores = {};
      templateInfo.template.attributes.forEach((attr) => {
        initialScores[attr.name] = 0;
      });
      setScores(initialScores);
    }

    // Find existing evaluation
    if (userEval?.doc?.evaluations) {
      let evalToEdit = null;

      // If evaluationId is provided, find that specific evaluation
      if (evaluationId) {
        evalToEdit = userEval.doc.evaluations.find(
          (item) => item._id === evaluationId,
        );
      } else {
        // Otherwise, find evaluation by current logged-in user
        evalToEdit = userEval.doc.evaluations.find(
          (item) => item.evaluator?._id === loggedInUser?._id,
        );
      }

      if (evalToEdit) {
        setExistingEvaluation(evalToEdit);

        // Pre-fill scores
        const prefilledScores = {};
        evalToEdit.attributes.forEach((attr) => {
          prefilledScores[attr.name] = attr.score || 0;
        });
        setScores(prefilledScores);

        // Pre-fill notes
        setValue("notes", evalToEdit.notes || "");

        // Check if it's the logged-in user's evaluation
        if (evalToEdit.evaluator?._id === loggedInUser?._id) {
          setErrorMessage({
            type: "info",
            title: "Edit Evaluation",
            message: "You are editing your previously submitted evaluation.",
          });
        } else {
          setErrorMessage({
            type: "info",
            title: "View/Edit Evaluation",
            message: `You are viewing evaluation submitted by ${evalToEdit.evaluator?.fullName || "another evaluator"}.`,
          });
        }
      }
    }

    // If specific evaluation API returns data, use it
    if (specificEvaluation?.doc) {
      setExistingEvaluation(specificEvaluation.doc);

      // Pre-fill scores
      const prefilledScores = {};
      specificEvaluation.doc.attributes.forEach((attr) => {
        prefilledScores[attr.name] = attr.score || 0;
      });
      setScores(prefilledScores);

      // Pre-fill notes
      setValue("notes", specificEvaluation.doc.notes || "");
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [
    templateData,
    userEval,
    specificEvaluation,
    loggedInUser,
    setValue,
    evaluationId,
  ]);

  // Handle score change
  const handleScoreChange = (attributeName, value) => {
    setScores((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  // Calculate total score
  const calculateTotalScore = () => {
    return Object.values(scores).reduce(
      (total, score) => Number(total) + Number(score),
      0,
    );
  };

  // Calculate maximum possible score
  const calculateMaxScore = () => {
    if (!template?.attributes) return 0;
    return template.attributes.reduce(
      (total, attr) => Number(total) + Number(attr.maxScore),
      0,
    );
  };

  const totalPercentage = Number(
    ((calculateTotalScore() / calculateMaxScore()) * 100).toFixed(2),
  );

  // Submit handler for update
  const submitHandler = async (formData) => {
    try {
      // Prepare attributes array with scores
      const evaluationAttributes = template.attributes.map((attr) => ({
        name: attr.name,
        description: attr.description,
        score: scores[attr.name] || 0,
        maxScore: attr.maxScore,
      }));

      // Get evaluator ID (use existing if available)
      const evaluatorId =
        existingEvaluation?.evaluator?._id || loggedInUser?._id;

      const payload = {
        userId: userId,
        month: month,
        year: year,
        evaluationId: existingEvaluation?._id || evaluationId,
        evaluations: [
          {
            evaluator: evaluatorId,
            attributes: evaluationAttributes,
            notes: formData.notes.trim(),
          },
        ],
      };

      await createEvaluation({
        path: "/evaluation/users",
        body: payload,
      }).unwrap();

      toast.success("Evaluation has been updated successfully.");

      // Refetch user evaluation data
      await refetchUserEval();

      // Navigate back or to success page
      navigate(-1);
    } catch (error) {
      console.error("Evaluation update error:", error);
      toast.error(
        error?.data?.errors?.[0]?.msg || "Failed to update evaluation",
      );
    }
  };

  const roleName = templateData?.doc[0]?.roleName.replace(/^./, (c) =>
    c.toUpperCase(),
  );

  const { bg: roleBg, text: roleText } = getBadgeColors(roleName);

  // Loading state
  if (
    loading ||
    templateLoading ||
    userEvalLoading ||
    specificEvaluationLoading
  ) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text>Loading evaluation data...</Text>
        </VStack>
      </Flex>
    );
  }

  // No template found
  if (!template) {
    return (
      <Box maxW="3xl" mx="auto" mt={20} p={6} textAlign="center">
        <Box
          bg="yellow.50"
          border="1px solid"
          borderColor="yellow.200"
          borderRadius="xl"
          p={8}
          boxShadow="md"
        >
          <WarningTwoIcon boxSize={14} color="yellow.500" mb={4} />
          <Text fontSize="xl" fontWeight="semibold" mb={2}>
            No Evaluation Template Found
          </Text>
          <Text fontSize="md" color="gray.600">
            This role doesn't have an evaluation template yet. You might need to
            create one or pick a different role.
          </Text>

          <Button
            mt={6}
            colorScheme="brand"
            onClick={() => navigate("/evaluation/settings")}
          >
            Add Template
          </Button>
        </Box>
      </Box>
    );
  }

  // No existing evaluation found
  if (!existingEvaluation && !evaluationId) {
    return (
      <Box maxW="3xl" mx="auto" mt={20} p={6} textAlign="center">
        <Box
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
          borderRadius="xl"
          p={8}
          boxShadow="md"
        >
          <WarningTwoIcon boxSize={14} color="blue.500" mb={4} />
          <Text fontSize="xl" fontWeight="semibold" mb={2}>
            No Evaluation Found
          </Text>
          <Text fontSize="md" color="gray.600">
            You haven't submitted an evaluation for this user yet. Please use
            the create form to submit a new evaluation.
          </Text>

          <Button
            mt={6}
            colorScheme="brand"
            onClick={() => navigate(`/evaluation/create/${roleId}/${userId}`)}
          >
            Create New Evaluation
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      maxW={{ base: "full", md: "5xl" }}
      rounded="lg"
      shadow="md"
      bg="white"
      mx="auto"
      p={8}
    >
      <IconButton
        aria-label="Go back"
        icon={<FiChevronLeft />}
        onClick={() => navigate(-1)}
        size="md"
        isRound
      />

      {/* Header */}
      <VStack spacing={4} align="stretch" mb={8}>
        <Heading textTransform="capitalize" size="md" color="gray.700">
          Edit Evaluation - {userEval?.userDetails?.fullName}
        </Heading>
        <HStack justify="space-between">
          <Text color="gray.600" fontSize="md">
            Role:{" "}
            <Badge
              bg={roleBg}
              color={roleText}
              variant="subtle"
              fontSize=".8em"
              px={4}
              py={2}
              borderRadius="full"
              textTransform="capitalize"
            >
              {roleName}
            </Badge>
          </Text>
        </HStack>
        {existingEvaluation?.evaluator?._id !== loggedInUser?._id && (
          <Box
            bg="yellow.50"
            border="1px solid"
            borderColor="yellow.200"
            borderRadius="md"
            p={3}
          >
            <Text fontSize="sm" color="yellow.800">
              <strong>Note:</strong> You are editing an evaluation submitted by{" "}
              {existingEvaluation?.evaluator?.fullName || "another evaluator"}.
            </Text>
          </Box>
        )}
      </VStack>

      <form onSubmit={handleSubmit(submitHandler)}>
        <VStack spacing={4} align="stretch">
          {/* Evaluation Attributes */}
          <Box
            bg={cardBg}
            border="1px"
            rounded="md"
            borderColor={borderColor}
            shadow="sm"
          >
            <Box p={6}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="gray.700">
                  Evaluation Criteria
                </Heading>

                {template.attributes.map((attribute, index) => (
                  <Box key={attribute.name}>
                    {index > 0 && <Divider my={3} />}

                    <FormControl>
                      <HStack justify="space-between" mb={3}>
                        <FormLabel
                          fontWeight="600"
                          fontSize="lg"
                          color="gray.800"
                          mb={0}
                        >
                          {attribute.name}
                        </FormLabel>
                        <Box
                          bg="green.50"
                          border="1px solid"
                          borderColor="green.200"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="green.700"
                          >
                            {scores[attribute.name] || 0}/{attribute.maxScore}
                          </Text>
                        </Box>
                      </HStack>

                      <Text
                        color="gray.600"
                        mb={4}
                        fontSize="sm"
                        lineHeight="tall"
                      >
                        {attribute.description}
                      </Text>

                      {/* Custom Input Section */}
                      <Box>
                        {/* Visual Feedback Bar */}
                        <Box
                          position="relative"
                          h="8px"
                          bg="gray.100"
                          borderRadius="full"
                          mb={4}
                          overflow="hidden"
                        >
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            h="100%"
                            width={`${((scores[attribute.name] || 0) / attribute.maxScore) * 100}%`}
                            bgGradient="linear(to-r, green.400, green.500)"
                            borderRadius="full"
                            transition="width 0.3s ease"
                          />

                          {/* Tick Marks */}
                          <HStack
                            position="absolute"
                            top="0"
                            left="0"
                            width="100%"
                            height="100%"
                            justify="space-between"
                            px="2px"
                          >
                            {[...Array(attribute.maxScore + 1)].map(
                              (_, index) => (
                                <Box
                                  key={index}
                                  w="2px"
                                  h="100%"
                                  bg={
                                    index <= (scores[attribute.name] || 0)
                                      ? "white"
                                      : "gray.300"
                                  }
                                  opacity={
                                    index <= (scores[attribute.name] || 0)
                                      ? 0.8
                                      : 0.6
                                  }
                                />
                              ),
                            )}
                          </HStack>
                        </Box>

                        <ScoreInput
                          attribute={attribute}
                          scores={scores}
                          handleScoreChange={handleScoreChange}
                        />
                      </Box>
                    </FormControl>
                  </Box>
                ))}

                {/* Total Score Summary */}
                <Box
                  mt={4}
                  p={4}
                  bg={headerBg}
                  borderRadius="lg"
                  border="1px"
                  borderColor={borderColor}
                >
                  <HStack justify="space-between">
                    <Text fontWeight="600" color="gray.700">
                      Total Score
                    </Text>
                    <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                      {calculateTotalScore()} / {calculateMaxScore()}
                    </Badge>
                  </HStack>

                  {/* Percentage */}
                  <HStack justify="space-between" mt={3}>
                    <Text fontWeight="600" color="gray.700">
                      Total Percentage
                    </Text>

                    <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                      {totalPercentage}%
                    </Badge>
                  </HStack>

                  <Text fontSize="sm" color="gray.600" mt={2}>
                    Overall performance rating based on all criteria
                  </Text>

                  {existingEvaluation && (
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      <strong>Original Score:</strong>{" "}
                      {existingEvaluation.attributes?.reduce(
                        (sum, attr) => sum + (attr.score || 0),
                        0,
                      )}{" "}
                      / {calculateMaxScore()} (
                      {(
                        (existingEvaluation.attributes?.reduce(
                          (sum, attr) => sum + (attr.score || 0),
                          0,
                        ) /
                          calculateMaxScore()) *
                        100
                      ).toFixed(2)}
                      %)
                    </Text>
                  )}
                </Box>
              </VStack>
            </Box>
          </Box>

          {/* Evaluation Notes */}
          <Box
            bg={cardBg}
            border="1px"
            borderColor={borderColor}
            rounded="md"
            shadow="sm"
          >
            <Box p={6}>
              <FormControl isInvalid={!!errors.notes} isRequired>
                <FormLabel
                  fontWeight="600"
                  fontSize="lg"
                  color="gray.700"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={StarIcon} color="yellow.500" />
                  Evaluation Notes
                </FormLabel>
                <Text color="gray.600" mb={3}>
                  Update your feedback and comments for the employee
                </Text>

                <Textarea
                  placeholder="Write your evaluation notes, feedback, and recommendations..."
                  resize="vertical"
                  minH="120px"
                  focusBorderColor={focusColor}
                  borderColor={borderColor}
                  bg="white"
                  {...register("notes")}
                />

                <Flex justify="space-between" mt={2}>
                  {errors.notes ? (
                    <Text fontSize="sm" color="red.500">
                      {errors.notes.message}
                    </Text>
                  ) : (
                    <Text fontSize="xs" color="gray.500">
                      {notesLength}/500 characters
                    </Text>
                  )}
                </Flex>
              </FormControl>
            </Box>
          </Box>

          {/* Action Buttons */}
          <HStack justify="flex-end" spacing={4} pt={4}>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              size="lg"
              rounded="lg"
              isDisabled={creating}
            >
              Cancel
            </Button>

            <Button
              size="lg"
              rounded="lg"
              colorScheme="brand"
              type="submit"
              isLoading={creating}
              isDisabled={!isValid || creating}
              px={8}
            >
              Update Evaluation
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default EvaluationEditForm;

const ScoreInput = ({ attribute, scores, handleScoreChange }) => {
  const max = attribute.maxScore;
  const value = scores[attribute.name] ?? "";

  const handleChange = (e) => {
    const val = e.target.value;

    // Allow empty
    if (val === "") {
      handleScoreChange(attribute.name, "");
      return;
    }

    // Digits only
    if (!/^\d+$/.test(val)) return;

    const num = parseInt(val, 10);

    // DYNAMIC RULE:
    // Allow typing only if it does not exceed maxScore
    if (num > max) return;

    handleScoreChange(attribute.name, val);
  };

  const handleBlur = () => {
    if (value === "") return;

    let num = parseInt(value, 10);

    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > max) num = max;

    handleScoreChange(attribute.name, num);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode="numeric"
      textAlign="center"
      fontWeight="bold"
      fontSize="md"
      height="40px"
      border="2px solid"
      borderColor="gray.200"
      borderRadius="xl"
      bg="white"
      onFocus={(e) => e.target.select()}
      _hover={{ borderColor: "brand.300" }}
      _focus={{
        borderColor: "brand.500",
        boxShadow: "0 0 0 3px rgba(216, 201, 114, 0.15)",
      }}
      aria-label={`${attribute.name} score (0 - ${max})`}
    />
  );
};
