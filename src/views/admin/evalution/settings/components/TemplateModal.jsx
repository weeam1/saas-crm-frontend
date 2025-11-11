import React, { useEffect, useState } from "react";
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
  IconButton,
  VStack,
  HStack,
  Text,
  Flex,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useModalColors } from "hooks/useModalColors";
import { toast } from "react-toastify";
import { useFetchItemsQuery, useDeleteItemMutation } from "api/apiSlice"
import CustomTooltip  from "components/shared/CustomTooltip"; 

const TemplateModal = ({ isOpen, onClose, role, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
  const [evaluations, setEvaluations] = useState([]);
  const [newEvaluation, setNewEvaluation] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteItemMutation] = useDeleteItemMutation();

  const { data, refetch } = useFetchItemsQuery(
    { path: `/evaluation/templates/${role?._id}` },
    { skip: !role?._id, refetchOnMountOrArgChange: true }
  );

  const hasTemplate = Boolean(data?.evaluationTemplate?._id);

  useEffect(() => {
    if (isOpen && role?._id) refetch();
  }, [isOpen, role, refetch]);

  useEffect(() => {
    setEvaluations(data?.evaluationTemplate?.evaluationPoints || []);
    setNewEvaluation("");
  }, [data, isOpen]);

  const handleClose = () => {
    setEvaluations([]);
    setNewEvaluation("");
    setEditingIndex(null);
    setEditText("");
    onClose();
  };

  const handleAddQuestion = () => {
    if (!newEvaluation.trim()) return toast.error("Evaluation cannot be empty.");
    if (evaluations.length >= 10)
      return toast.info("Maximum 10 evaluations allowed.");
    setEvaluations([...evaluations, newEvaluation.trim()]);
    setNewEvaluation("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddQuestion();
    }
  };

  const handleDelete = (index) => {
    setEvaluations(evaluations.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditText(evaluations[index]);
  };

  const handleSaveEdit = () => {
    const updated = [...evaluations];
    updated[editingIndex] = editText.trim();
    setEvaluations(updated);
    setEditingIndex(null);
    setEditText("");
  };

  const handleSaveTemplate = async () => {
    if (!role?._id) return toast.error("Role not found!");
    const flatPoints = evaluations.map((item) => item.trim()).filter(Boolean);
    if (flatPoints.length === 0)
      return toast.error("Please add at least one evaluation point.");

    await onSave({ role: role._id, evaluationPoints: flatPoints });
    refetch();
    toast.success(hasTemplate ? "Template updated!" : "Template added!");
    handleClose();
  };

  const handleDeleteTemplate = async () => {
    if (!data?.evaluationTemplate?._id) return;
    try {
      await deleteItemMutation({
        path: `/evaluation/templates/${data.evaluationTemplate._id}`,
        body: {},
      }).unwrap();
      toast.success("Template deleted successfully!");
      refetch();
    } catch {
      toast.error("Failed to delete the template!");
    }
  };

  const modalSize = useBreakpointValue({ base: "sm", md: "xl" });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size={modalSize}>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        mx={{ base: 3, md: 8 }}
        boxShadow="2xl"
        borderRadius="2xl"
        bg={bg}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        h="65vh"
      >
        <Flex
          align="center"
          justify="space-between"
          bg={headerBg}
          color={headerText}
          px={{ base: 4, md: 6 }}
          py={3}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            noOfLines={1}
          >
            Evaluation Template — {role?.roleName || "N/A"}
          </Text>
          <ModalCloseButton position="static" />
        </Flex>

        <ModalBody
          overflowY="auto"
          px={{ base: 4, md: 6 }}
          py={4}
          flex="1"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#b0b0b0",
              borderRadius: "8px",
            },
          }}
        >
          <VStack align="stretch" spacing={4}>
            <FormControl>
              <FormLabel fontWeight="600" fontSize="sm">
                Add New Evaluation
              </FormLabel>
              <HStack spacing={2}>
                <Input
                  value={newEvaluation}
                  onChange={(e) => setNewEvaluation(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter evaluation point"
                  size="sm"
                  borderColor="brand.500"
                  focusBorderColor="brand.500"
                  borderRadius={"md"}
                />
                <CustomTooltip label="Add Evaluation" hasArrow>
                  <IconButton
                    icon={<FiPlus />}
                    aria-label="Add evaluation"
                    colorScheme="brand"
                    onClick={handleAddQuestion}
                    size="sm"
                  />
                </CustomTooltip>
              </HStack>
            </FormControl>

            <Box>
              <Text fontWeight="600" fontSize="sm" mb={2}>
                Evaluation Points ({evaluations.length}/10)
              </Text>

              {evaluations.length === 0 ? (
                <Text color="gray.500" fontSize="sm">
                  No evaluation points added yet.
                </Text>
              ) : (
                <VStack align="stretch" spacing={2}>
                  {evaluations.map((q, index) => (
                    <Flex
                      key={index}
                      justify="space-between"
                      align="center"
                      border="1px solid"
                      borderColor="gray.200"
                      p={2}
                      borderRadius="md"
                      _hover={{ bg: "gray.50" }}
                    >
                      {editingIndex === index ? (
                        <HStack w="full" spacing={2}>
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            size="sm"
                            autoFocus
                            borderColor="brand.500"
                            focusBorderColor="brand.500"
                          />
                          <Button
                            size="xs"
                            colorScheme="brand"
                            borderRadius="md"
                            onClick={handleSaveEdit}
                          >
                            Save
                          </Button>
                        </HStack>
                      ) : (
                        <>
                          <Text fontSize="sm" flex="1">
                            {q}
                          </Text>
                          <HStack spacing={1}>
                            <CustomTooltip label="Edit" hasArrow>
                              <IconButton
                                icon={<FiEdit2 />}
                                aria-label="Edit"
                                size="xs"
                                variant="ghost"
                                onClick={() => handleEdit(index)}
                              />
                            </CustomTooltip>
                            <CustomTooltip label="Delete" hasArrow>
                              <IconButton
                                icon={<FiTrash2 />}
                                aria-label="Delete"
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(index)}
                              />
                            </CustomTooltip>
                          </HStack>
                        </>
                      )}
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
          py={3}
          px={{ base: 4, md: 6 }}
          justifyContent="space-between"
        >
          <Box>
            {hasTemplate && (
              <>
                <Box display={{ base: "none", md: "block" }}>
                  <CustomTooltip label="Delete Template" hasArrow>
                    <Button
                      colorScheme="red"
                      borderRadius="md"
                      size="sm"
                      onClick={handleDeleteTemplate}
                      leftIcon={<FiTrash2 />}
                    >
                      Delete Template
                    </Button>
                  </CustomTooltip>
                </Box>
                <Box display={{ base: "block", md: "none" }}>
                  <CustomTooltip label="Delete Template" hasArrow>
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Delete Template"
                      colorScheme="red"
                      size="sm"
                      onClick={handleDeleteTemplate}
                    />
                  </CustomTooltip>
                </Box>
              </>
            )}
          </Box>

          <HStack spacing={3}>
            <Button
              variant="outline"
              borderRadius="md"
              size="sm"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              size="sm"
              borderRadius="md"
              onClick={handleSaveTemplate}
            >
              {hasTemplate ? "Update Template" : "Add Template"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TemplateModal;
