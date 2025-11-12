import React, { useState, useEffect } from "react";
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
  Spinner,
  FormErrorMessage,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";
import { useFetchItemsQuery } from "api/apiSlice";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const EvaluteModal = ({ isOpen, onClose, user, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

  const [evaluationInputs, setEvaluationInputs] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [hasTemplate, setHasTemplate] = useState(true);

  const { data, isLoading } = useFetchItemsQuery(
    { path: `/evaluation/templates/${user?.roles[0]?._id}` },
    { skip: !user?.roles[0]?._id, refetchOnMountOrArgChange: true }
  );

  const validationSchema = Yup.object().shape({
    feedback: Yup.string().required("Feedback is required"),
    evaluations: Yup.array()
      .of(
        Yup.object().shape({
          number: Yup.number()
            .typeError("Must be a number")
            .min(0, "Min 0")
            .max(10, "Max 10")
            .required("Score is required"),
        })
      )
      .min(1, "Evaluation points are required"),
  });

  const formik = useFormik({
    initialValues: {
      feedback: "",
      evaluations: [],
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        userId: user._id,
        feedback: values.feedback,
        evaluations: values.evaluations.map((e, i) => ({
          entityName: evaluationInputs[i].entityName,
          number: Number(e.number),
        })),
      };
      onSave(payload);
      toast.success(`Evaluation ${isUpdate ? "updated" : "added"} successfully`);
      onClose();
    },
  });

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, user, data]);

  const handleInputChange = (index, value) => {
    const updated = [...formik.values.evaluations];
    updated[index] = { ...updated[index], number: value };
    formik.setFieldValue("evaluations", updated);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent
        mx="auto"
        boxShadow="2xl"
        borderRadius="2xl"
        bg={bg}
        overflow="hidden"
        maxH="85vh"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
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
            Evaluate: {user?.fullName}
          </Text>
          <ModalCloseButton aria-label="Close" position="static" />
        </Flex>

        <form onSubmit={formik.handleSubmit}>
          <ModalBody overflowY="auto" py={4}>
            {isLoading ? (
              <Flex justify="center" align="center" py={10}>
                <Spinner size="xl" color="brand.500" />
              </Flex>
            ) : !hasTemplate ? (
              <Box textAlign="center" py={10}>
                <Text fontSize="md" fontWeight="bold" color="red.500">
                  No evaluation template available
                </Text>
                <Text mt={2} color="gray.600">
                  Please contact the administrator to create one.
                </Text>
              </Box>
            ) : (
              <VStack spacing={6} align="stretch">
                {/* Evaluation Points */}
                {evaluationInputs.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Evaluation Points (0-10)
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
                          <FormLabel fontSize="sm">{item.entityName}</FormLabel>
                          <Input
                            type="number"
                            placeholder="0-10"
                            value={formik.values.evaluations[index]?.number || ""}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            focusBorderColor="brand.500"
                            border="1px solid transparent"
                            _hover={{ borderColor: "gray.300" }}
                            _focus={{
                              borderColor: "brand.500",
                              boxShadow: "0 0 0 1px #3182ce",
                            }}
                          />
                          <FormErrorMessage>
                            {formik.errors.evaluations?.[index]?.number}
                          </FormErrorMessage>
                        </FormControl>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                <Divider />

                {/* Feedback */}
                <FormControl
                  isInvalid={formik.touched.feedback && formik.errors.feedback}
                >
                  <FormLabel>Feedback</FormLabel>
                  <Textarea
                    value={formik.values.feedback}
                    onChange={formik.handleChange}
                    name="feedback"
                    placeholder="Write feedback..."
                    focusBorderColor="brand.500"
                    border="1px solid transparent"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  />
                  <FormErrorMessage>{formik.errors.feedback}</FormErrorMessage>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {formik.values.feedback.length}/300
                  </Text>
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          {/* Footer */}
          {hasTemplate && (
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
              <Button variant="outline" size="sm" borderRadius="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                size="sm"
                borderRadius="md"
                type="submit"
              >
                {isUpdate ? "Update Evaluation" : "Add Evaluation"}
              </Button>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EvaluteModal;
