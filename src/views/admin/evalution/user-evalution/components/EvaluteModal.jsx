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
  useToast,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";
import { useFetchItemsQuery } from "api/apiSlice";

const EvaluteModal = ({ isOpen, onClose, user, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
  const toast = useToast();

  const [feedback, setFeedback] = useState("");
  const [evaluationInputs, setEvaluationInputs] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [hasTemplate, setHasTemplate] = useState(true);

  const { data, isLoading } = useFetchItemsQuery(
    { path: `/evaluation/templates/${user?.roles[0]?._id}` },
    { skip: !user?.roles[0]?._id, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (!isOpen) return;

    if (data?.evaluationTemplate?.evaluationPoints?.length) {
      setHasTemplate(true);

      if (user?.feedback && user?.evaluations?.length) {
        setIsUpdate(true);
        setFeedback(user.feedback);
        setEvaluationInputs(
          user.evaluations.map((e) => ({
            entityName: e.entityName,
            number: e.number,
          }))
        );
      } else {
        setIsUpdate(false);
        const fields = data.evaluationTemplate.evaluationPoints.map((point) => ({
          entityName: point,
          number: "",
        }));
        setEvaluationInputs(fields);
        setFeedback("");
      }
    } else {
      setHasTemplate(false);
      setEvaluationInputs([]);
      setFeedback("");
    }
  }, [isOpen, user, data]);

  const handleInputChange = (index, value) => {
    if (value === "" || (Number(value) >= 0 && Number(value) <= 10)) {
      const updated = [...evaluationInputs];
      updated[index].number = value;
      setEvaluationInputs(updated);
    } else {
      toast({
        description: "Score must be between 0 and 10",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSave = () => {
    if (!feedback || evaluationInputs.some((i) => i.number === "")) {
      toast({
        description: "Please complete all fields",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      userId: user._id,
      feedback,
      evaluations: evaluationInputs.map((e) => ({
        entityName: e.entityName,
        number: Number(e.number),
      })),
    };

    onSave(payload);
    toast({
      description: `Evaluation ${isUpdate ? "updated" : "added"} successfully`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    onClose();
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

        {/* Body */}
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
            <>
              {evaluationInputs.length > 0 && (
                <Box mt={4}>
                  <Text fontWeight="bold" mb={2}>
                    Evaluation Points (0-10)
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {evaluationInputs.map((item, index) => (
                      <FormControl key={index}>
                        <FormLabel fontSize="sm">{item.entityName}</FormLabel>
                        <Input
                          type="number"
                          placeholder="0-10"
                          value={item.number}
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          focusBorderColor="brand.500"
                          border="1px solid transparent"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #3182ce" }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                          }}
                        />
                      </FormControl>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Feedback */}
              <FormControl mt={6}>
                <FormLabel>Feedback</FormLabel>
                <Textarea
                  value={feedback}
                  maxLength={300}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write feedback..."
                  focusBorderColor="brand.500"
                  border="1px solid transparent"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #3182ce" }}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {feedback.length}/300
                </Text>
              </FormControl>
            </>
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
              onClick={handleSave}
            >
              {isUpdate ? "Update Evaluation" : "Add Evaluation"}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EvaluteModal;
