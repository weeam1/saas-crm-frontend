import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Flex,
  SimpleGrid,
  Box,
  FormErrorMessage,
  VStack,
  Divider,
  Progress,
  useColorModeValue,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";
import { useFetchItemsQuery } from "api/apiSlice";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiAlertCircle } from "react-icons/fi";

const EvaluteModal = ({ isOpen, onClose, user, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const [evaluationInputs, setEvaluationInputs] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [hasTemplate, setHasTemplate] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const mode = user?.mode || "add";
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const isDisabled = isView;

  const { data, isLoading, refetch } = useFetchItemsQuery(
    { path: `/evaluation/templates/${user?.roles[0]?._id}` },
    { skip: !user?.roles[0]?._id, refetchOnMountOrArgChange: true }
  );

  const validationSchema = Yup.object().shape({
    feedback: Yup.string()
      .max(300, "Maximum 300 characters allowed")
      .required("Feedback is required"),
    evaluations: Yup.array()
      .of(
        Yup.object().shape({
          number: Yup.number()
            .typeError("Must be a number")
            .min(0, "Minimum is 0")
            .max(10, "Maximum is 10")
            .required("Score required"),
        })
      )
      .min(1, "Evaluation points required"),
  });

  const formik = useFormik({
    initialValues: { feedback: "", evaluations: [] },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        userId: user._id,
        feedback: values.feedback.trim(),
        evaluations: values.evaluations.map((e, i) => ({
          entityName: evaluationInputs[i].entityName,
          number: Number(e.number),
        })),
      };
      onSave(payload);
      toast.success(
        `Evaluation ${isUpdate ? "updated" : "added"} successfully`
      );
      onClose();
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    setShowSkeleton(true);
    refetch().finally(() => setShowSkeleton(false));

    if (data?.evaluationTemplate?.evaluationPoints?.length) {
      setHasTemplate(true);
      const templatePoints = data.evaluationTemplate.evaluationPoints;
      const mergedEvaluations = templatePoints.map((point) => {
        const existing = user?.evaluations?.find((e) => e.entityName === point);
        return {
          entityName: point,
          number: existing ? existing.number.toString() : "0",
        };
      });
      setEvaluationInputs(mergedEvaluations);
      formik.setFieldValue(
        "evaluations",
        mergedEvaluations.map((e) => ({ number: e.number }))
      );
      formik.setFieldValue("feedback", user?.feedback || "");
      setIsUpdate(Boolean(user?.feedback && user?.evaluations?.length));
    } else {
      setHasTemplate(false);
      setEvaluationInputs([]);
      formik.setFieldValue("feedback", "");
      formik.setFieldValue("evaluations", []);
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    if (
      value === "" ||
      (/^\d{0,2}$/.test(value) && value >= 0 && value <= 10)
    ) {
      const updated = [...formik.values.evaluations];
      updated[index] = { ...updated[index], number: value };
      formik.setFieldValue("evaluations", updated);
    }
  };

  const totalPercentage = useMemo(() => {
    if (!formik.values.evaluations.length) return 0;
    const sum = formik.values.evaluations.reduce(
      (acc, e) => acc + Number(e.number || 0),
      0
    );
    return Math.round((sum / (formik.values.evaluations.length * 10)) * 100);
  }, [formik.values.evaluations]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent
        mx="auto"
        boxShadow="2xl"
        borderRadius="2xl"
        bg={bg}
        overflow="hidden"
        maxH="90vh"
        display="flex"
        flexDirection="column"
      >
        <Flex
          align="center"
          justify="space-between"
          bg={headerBg}
          color={headerText}
          px={6}
          py={3}
          borderBottom="1px solid"
          borderColor={borderColor}
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Text fontSize="lg" fontWeight="bold">
            {isView
              ? "View Evaluation"
              : isEdit
                ? "Edit Evaluation"
                : "Add Evaluation"}
            : {user?.fullName}
          </Text>
          <ModalCloseButton aria-label="Close" position="static" />
        </Flex>

        <form onSubmit={formik.handleSubmit}>
          <ModalBody overflowY="auto" py={5} px={6}>
            {showSkeleton || isLoading ? (
              <VStack spacing={8} align="stretch">
                {/* Progress Section Skeleton */}
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Skeleton height="16px" width="120px" />
                    <Skeleton height="16px" width="40px" />
                  </Flex>
                  <Skeleton height="8px" borderRadius="md" />
                </Box>

                {/* Evaluation Points Skeleton */}
                <Box>
                  <Skeleton height="18px" width="160px" mb={3} />
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {[...Array(4)].map((_, i) => (
                      <Box key={i}>
                        <Skeleton height="14px" width="100px" mb={2} />
                        <Skeleton height="40px" borderRadius="md" />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Feedback Section Skeleton */}
                <Box>
                  <Skeleton height="20px" width="100px" mb={3} />
                  <Skeleton height="14px" width="250px" mb={4} />
                  <Skeleton height="120px" borderRadius="xl" />
                  <Flex justify="space-between" mt={3}>
                    <Skeleton height="10px" width="60px" />
                    <Skeleton height="10px" width="100px" />
                  </Flex>
                </Box>
              </VStack>
            ) : !hasTemplate ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={10}
                color="gray.500"
              >
                <Icon as={FiAlertCircle} boxSize={10} color="red.400" mb={3} />
                <Text fontWeight="bold" fontSize="md">
                  No evaluation template found
                </Text>
                <Text fontSize="sm">Please contact the administrator.</Text>
              </Flex>
            ) : (
              <VStack spacing={8} align="stretch">
                <Box mb={6}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Overall Progress
                    </Text>
                    <Text
                      fontSize="sm"
                      color={totalPercentage === 100 ? "green" : "brand.500"}
                      fontWeight="bold"
                    >
                      {totalPercentage}%
                    </Text>
                  </Flex>

                  <Box w="100%">
                    <Progress
                      value={totalPercentage}
                      size="md"
                      colorScheme={totalPercentage === 100 ? "green" : "blue"}
                      borderRadius="lg"
                      isAnimated
                      width="100%"
                    />
                  </Box>

                  {totalPercentage === 100 && (
                    <Text
                      fontSize="xs"
                      color="green.500"
                      mt={1}
                      fontWeight="medium"
                    >
                      Perfect score achieved!
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={3}>
                    Evaluation Points (0–10)
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {evaluationInputs.map((item, index) => (
                      <FormControl
                        key={index}
                        isInvalid={
                          formik.touched.evaluations?.[index]?.number &&
                          formik.errors.evaluations?.[index]?.number
                        }
                      >
                        <FormLabel fontSize="sm" fontWeight="semibold">
                          {item.entityName}
                        </FormLabel>
                        <Input
                          type="number"
                          placeholder="0–10"
                          bg={inputBg}
                          value={formik.values.evaluations[index]?.number || ""}
                          onChange={(e) =>
                            !isDisabled &&
                            handleInputChange(index, e.target.value)
                          }
                          isReadOnly={isDisabled}
                          min={0}
                          max={10}
                          textAlign="center"
                          fontWeight="bold"
                          focusBorderColor="brand.500"
                          border="1px solid transparent"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                        <FormErrorMessage fontSize="xs">
                          {formik.errors.evaluations?.[index]?.number}
                        </FormErrorMessage>
                      </FormControl>
                    ))}
                  </SimpleGrid>
                </Box>

                <Divider />

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={3} color="gray.800">
                    Feedback
                  </Text>
                  <Text fontSize="sm" color="gray.500" mb={3}>
                    Share your thoughts, suggestions, or areas of improvement.
                  </Text>

                  <FormControl
                    isInvalid={
                      formik.touched.feedback && formik.errors.feedback
                    }
                  >
                    <Textarea
                      value={formik.values.feedback}
                      onChange={formik.handleChange}
                      name="feedback"
                      placeholder="Write constructive feedback..."
                      rows={6}
                      resize="none"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="gray.50"
                      borderRadius="xl"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px #3182ce",
                        bg: "white",
                      }}
                      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                        isReadOnly={isDisabled}
                    />
                    <FormErrorMessage>
                      {formik.errors.feedback}
                    </FormErrorMessage>
                    <Flex justify="space-between" mt={2}>
                      <Text fontSize="xs" color="gray.500">
                        {formik.values.feedback.length}/300
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Be clear and specific
                      </Text>
                    </Flex>
                  </FormControl>
                </Box>
              </VStack>
            )}
          </ModalBody>

          {hasTemplate  && !isView && (
            <ModalFooter
              bg={footerBg}
              borderTop="1px solid"
              borderColor={borderColor}
              position="sticky"
              bottom="0"
              py={3}
              px={5}
              justifyContent="flex-end"
              gap={3}
            >
              <Button
                variant="outline"
                size="sm"
                borderRadius="md"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                size="sm"
                borderRadius="md"
                type="submit"
                isDisabled={isLoading}
              >
                {isUpdate ? "Update Evaluation" : "Submit Evaluation"}
              </Button>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EvaluteModal;
