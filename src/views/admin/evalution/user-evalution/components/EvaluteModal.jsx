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
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";
import { toast } from "react-toastify";
import { useFetchItemsQuery } from "api/apiSlice";

const EvaluteModal = ({ isOpen, onClose, user, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

  const [feedback, setFeedback] = useState("");
  const [evaluationInputs, setEvaluationInputs] = useState([]);
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
        setFeedback(user.feedback);
        setEvaluationInputs(
          user.evaluations.map((e) => ({
            entityName: e.entityName,
            number: e.number,
          }))
        );
      } else {
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
    const updated = [...evaluationInputs];
    updated[index].number = value;
    setEvaluationInputs(updated);
  };

  const handleSave = () => {
    if (!feedback || evaluationInputs.some((i) => i.number === "")) {
      toast.info("Please complete all fields");
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
    toast.success("Evaluation saved successfully");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent
        mx="auto"
        boxShadow="lg"
        m="2"
        borderRadius="2xl"
        bg={bg}
        shadow="2xl"
        overflow="hidden"
        maxH="85vh"
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
            Evaluate: {user?.fullName}
          </Text>
          <ModalCloseButton aria-label="Close" position="static" />
        </Flex>

        <ModalBody overflowY="auto">
          {isLoading ? (
            <Text>Loading evaluation template...</Text>
          ) : !hasTemplate ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="md" fontWeight="bold" color="red.500">
                No evaluation template available yet.
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
                    Evaluation Points
                  </Text>
                  <SimpleGrid columns={2} spacing={4}>
                    {evaluationInputs.map((item, index) => (
                      <FormControl key={index}>
                        <FormLabel fontSize="sm">{item.entityName}</FormLabel>
                        <Input
                          type="number"
                          placeholder="Enter score"
                          value={item.number}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                        />
                      </FormControl>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              <FormControl mt={4} mb={3}>
                <FormLabel>Feedback</FormLabel>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Write feedback..."
                />
              </FormControl>
            </>
          )}
        </ModalBody>

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
              Save Evaluation
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EvaluteModal;
