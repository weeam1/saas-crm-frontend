import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useModalColors } from "hooks/useModalColors";
import { toast } from "react-toastify";

const TemplateModal = ({ isOpen, onClose, role, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
  const [questions, setQuestions] = useState(role.questions || []);
  const [newQuestion, setNewQuestion] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("Question cannot be empty.");
      return;
    }
    if (questions.length >= 10) {
      toast.info("Maximum 10 questions allowed.");
      return;
    }
    setQuestions([...questions, newQuestion]);
    setNewQuestion("");
  };

  const handleDelete = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditText(questions[index]);
  };

  const handleSaveEdit = () => {
    const updated = [...questions];
    updated[editingIndex] = editText;
    setQuestions(updated);
    setEditingIndex(null);
    setEditText("");
  };

  const handleSaveTemplate = () => {
    onSave({ ...role, questions });
    toast.success("Template saved successfully.");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay  backdropFilter="blur(3px)"/>
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
            Evaluation Template — {role.roleName}
          </Text>

          <ModalCloseButton aria-label="Close" position="static" />
        </Flex>
        <ModalBody
          overflowY="auto"
          scrollBehavior="smooth"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "10px",
            },
          }}
        >
          <VStack align="stretch" spacing={3}>
            <FormControl>
              <FormLabel>Add New Question</FormLabel>
              <HStack>
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter question"
                />
                <IconButton
                  icon={<FiPlus />}
                  aria-label="Add question"
                  colorScheme="brand"
                  onClick={handleAddQuestion}
                />
              </HStack>
            </FormControl>

            <Text fontWeight="600" mt={4}>
              Questions ({questions.length}/10)
            </Text>
            {questions.length === 0 ? (
              <Text color="gray.500" fontSize="sm">
                No questions added yet.
              </Text>
            ) : (
              questions.map((q, index) => (
                <HStack
                  key={index}
                  justify="space-between"
                  border="1px solid"
                  borderColor="gray.200"
                  p={2}
                  borderRadius="md"
                >
                  {editingIndex === index ? (
                    <>
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <Button
                        size="xs"
                        colorScheme="brand"
                        borderRadius={"md"}
                        onClick={handleSaveEdit}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Text fontSize="sm">{q}</Text>
                      <HStack>
                        <IconButton
                          icon={<FiEdit2 />}
                          aria-label="Edit"
                          size="xs"
                          onClick={() => handleEdit(index)}
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Delete"
                          size="xs"
                          colorScheme="red"
                          onClick={() => handleDelete(index)}
                        />
                      </HStack>
                    </>
                  )}
                </HStack>
              ))
            )}
          </VStack>
        </ModalBody>

        <ModalFooter
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
          position="sticky"
          bottom="0"
          zIndex="10"
          py={3}
          px={5}
          justifyContent="flex-end"
          gap={3}
        >
          <Button
            variant="outline"
            size="sm"
            borderRadius={"md"}
            mr={3}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            borderRadius={"md"}
            size="sm"
            onClick={handleSaveTemplate}
          >
            Save Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TemplateModal;
