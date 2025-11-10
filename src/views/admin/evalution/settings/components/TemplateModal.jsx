import React, { useEffect, useState } from "react";
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
import { useFetchItemsQuery } from "api/apiSlice";

const TemplateModal = ({ isOpen, onClose, role, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
  const [evalutions, setEvalutions] = useState([]);
  const [newEvalution, setNewEvalution] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const { data, isLoading, refetch } = useFetchItemsQuery(
    { path: `/evaluation/templates/${role?._id}` },
    { skip: !role?._id, refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (isOpen && role?._id) {
      refetch();
    }
  }, [isOpen, role, refetch]);

  useEffect(() => {
    if (data?.evaluationTemplate?.evaluationPoints) {
      setEvalutions(data.evaluationTemplate.evaluationPoints);
    } else {
      setEvalutions([]);
    }
    setNewEvalution("");
  }, [data, isOpen]);

  const handleClose = () => {
    setEvalutions([]);
    setNewEvalution("");
    setEditingIndex(null);
    setEditText("");
    onClose();
  };

  const handleAddQuestion = () => {
    if (!newEvalution.trim()) {
      toast.error("Evaluation cannot be empty.");
      return;
    }
    if (evalutions.length >= 10) {
      toast.info("Maximum 10 evaluations allowed.");
      return;
    }
    setEvalutions([...evalutions, newEvalution]);
    setNewEvalution("");
  };

  const handleDelete = (index) => {
    setEvalutions(evalutions.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditText(evalutions[index]);
  };

  const handleSaveEdit = () => {
    const updated = [...evalutions];
    updated[editingIndex] = editText;
    setEvalutions(updated);
    setEditingIndex(null);
    setEditText("");
  };

  const handleSaveTemplate = async () => {
    if (!role?._id) return toast.error("Role not found!");
    const flatPoints = evalutions
      .flat()
      .map((item) => item.trim())
      .filter(Boolean);

    if (flatPoints.length === 0) {
      toast.error("Please add at least one evaluation point.");
      return;
    }

    await onSave({ role: role._id, evaluationPoints: flatPoints });

    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent
        mx="auto"
        boxShadow="lg"
        m="2"
        borderRadius="2xl"
        bg={bg}
        shadow="2xl"
        overflow="hidden"
        H="85vh"
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
            Evaluation Template — {role?.roleName || "N/A"}
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
              <FormLabel>Add New Evaluation</FormLabel>
              <HStack>
                <Input
                  value={newEvalution}
                  onChange={(e) => setNewEvalution(e.target.value)}
                  placeholder="Enter evaluation point"
                />
                <IconButton
                  icon={<FiPlus />}
                  type="submit"
                  aria-label="Add evaluation"
                  colorScheme="brand"
                  onClick={handleAddQuestion}
                />
              </HStack>
            </FormControl>

            <Text fontWeight="600" mt={4}>
              Evaluation points ({evalutions.length}/10)
            </Text>

            {evalutions.length === 0 ? (
              <Text color="gray.500" fontSize="sm">
                No evaluation points added yet.
              </Text>
            ) : (
              evalutions.map((q, index) => (
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
            borderRadius={"md"}
            size="sm"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button colorScheme="brand" size="sm" borderRadius={"md"} onClick={handleSaveTemplate}>
            Save Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TemplateModal;
