import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  IconButton,
  VStack,
  HStack,
  Text,
  Flex,
  Box,
  useBreakpointValue,
  Divider,
  Badge,
  Grid,
} from "@chakra-ui/react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFileText,
  FiTag,
  FiList,
  FiCheckCircle,
} from "react-icons/fi";
import { useModalColors } from "hooks/useModalColors";
import { toast } from "react-toastify";

const TemplateModal = ({ isOpen, onClose, role, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

  const [attributes, setAttributes] = useState([]);
  const [newAttr, setNewAttr] = useState({ name: "", description: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editItem, setEditItem] = useState({ name: "", description: "" });

  const hasTemplate = Boolean(role?.template?.attributes?.length);

  useEffect(() => {
    if (isOpen) {
      setAttributes(role?.template?.attributes || []);
      setNewAttr({ name: "", description: "" });
    }
  }, [isOpen, role]);

  const handleClose = () => {
    setAttributes([]);
    setNewAttr({ name: "", description: "" });
    setEditingIndex(null);
    setEditItem({ name: "", description: "" });
    onClose();
  };

  const handleAdd = () => {
    if (!newAttr.name.trim() || !newAttr.description.trim())
      return toast.error("Name and Description are required.");

    setAttributes([...attributes, { ...newAttr }]);
    setNewAttr({ name: "", description: "" });
  };

  const handleDelete = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditItem({ ...attributes[index] });
  };

  const handleSaveEdit = () => {
    const updated = [...attributes];
    updated[editingIndex] = { ...editItem };
    setAttributes(updated);
    setEditingIndex(null);
    setEditItem({ name: "", description: "" });
  };

  const handleSaveTemplate = async () => {
    if (!role?._id) return toast.error("Role not found.");
    if (attributes.length === 0)
      return toast.error("Add at least one attribute.");

    onSave({
      role: role._id,
      attributes: attributes.map((a) => ({
        name: a.name.trim(),
        description: a.description.trim(),
      })),
    });

    toast.success(hasTemplate ? "Template Updated!" : "Template Added!");
    handleClose();
  };

  const modalSize = useBreakpointValue({ base: "lg", md: "5xl" });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size={modalSize}>
      <ModalOverlay backdropFilter="blur(8px)" />

      <ModalContent
        mx={{ base: 3, md: 8 }}
        boxShadow="0 12px 45px rgba(0,0,0,0.25)"
        borderRadius="2xl"
        bg={bg}
        overflow="hidden"
        h="85vh"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          bg={headerBg}
          color={headerText}
          px={{ base: 6, md: 8 }}
          py={4}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <HStack spacing={3}>
            <FiList size={22} />
            <Text fontSize="lg" fontWeight="700">
              Role Attributes — {role?.roleName || "N/A"}
            </Text>
          </HStack>
          <ModalCloseButton position="static" />
        </Flex>

        {/* Body */}
        <ModalBody
          overflowY="auto"
          px={{ base: 6, md: 8 }}
          py={5}
          flex="1"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "gray.400",
              borderRadius: "12px",
            },
          }}
        >
          <VStack align="stretch" spacing={6}>
            {/* Add Attribute Section */}
            <Box
              p={5}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              bg="white"
              shadow="sm"
              transition="0.3s"
              _hover={{ shadow: "md" }}
            >
              <HStack mb={3} spacing={2}>
                <FiTag size={18} color="#3b82f6" />
                <Text fontWeight="600" fontSize="md">
                  Add New Attribute
                </Text>
              </HStack>

              <Grid templateColumns={"1fr"} gap={4}>
                <Input
                  placeholder="E.g. Performance, Communication, Leadership"
                  value={newAttr.name}
                  onChange={(e) =>
                    setNewAttr({ ...newAttr, name: e.target.value })
                  }
                  size="md"
                  focusBorderColor="brand.500"
                  borderRadius="md"
                  _placeholder={{ color: "gray.400" }}
                />

                <Textarea
                  placeholder="E.g. Evaluate how the employee performs under pressure."
                  value={newAttr.description}
                  onChange={(e) =>
                    setNewAttr({ ...newAttr, description: e.target.value })
                  }
                  size="md"
                  focusBorderColor="brand.500"
                  borderRadius="md"
                  resize="none"
                  _placeholder={{ color: "gray.400" }}
                />
              </Grid>

              <Button
                leftIcon={<FiPlus />}
                mt={4}
                colorScheme="brand"
                borderRadius="md"
                onClick={handleAdd}
              >
                Add Attribute
              </Button>
            </Box>

            {/* ATTRIBUTE LIST */}
            <Box>
              <HStack mb={3}>
                <FiFileText size={18} color="#10b981" />
                <Text fontWeight="600" fontSize="md">
                  Attributes ({attributes.length})
                </Text>
              </HStack>

              {attributes.length === 0 ? (
                <Text fontSize="sm" color="gray.500">
                  No attributes added yet.
                </Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {attributes.map((item, index) => (
                    <Box
                      key={index}
                      p={4}
                      borderRadius="xl"
                      shadow="md"
                      bg="white"
                      position="relative"
                      borderLeft="5px solid"
                      borderColor="brand.500"
                      transition="0.3s"
                      _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                    >
                      {editingIndex === index ? (
                        <VStack spacing={3} align="stretch">
                          <Input
                            value={editItem.name}
                            onChange={(e) =>
                              setEditItem({ ...editItem, name: e.target.value })
                            }
                            size="md"
                            focusBorderColor="brand.500"
                            borderRadius="md"
                          />
                          <Textarea
                            value={editItem.description}
                            onChange={(e) =>
                              setEditItem({
                                ...editItem,
                                description: e.target.value,
                              })
                            }
                            size="md"
                            focusBorderColor="brand.500"
                            borderRadius="md"
                            resize="none"
                          />
                          <Button
                            size="sm"
                            leftIcon={<FiCheckCircle />}
                            colorScheme="brand"
                            borderRadius="md"
                            onClick={handleSaveEdit}
                          >
                            Save
                          </Button>
                        </VStack>
                      ) : (
                        <>
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={1}>
                              <HStack spacing={2}>
                                <Badge colorScheme="brand" variant="subtle">
                                  #{index + 1}
                                </Badge>
                                <Text fontWeight="600" fontSize="md">
                                  {item.name}
                                </Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {item.description}
                              </Text>
                            </VStack>

                            <HStack spacing={2}>
                              <IconButton
                                icon={<FiEdit2 />}
                                size="sm"
                                variant="ghost"
                                borderRadius="md"
                                onClick={() => handleEdit(index)}
                                _hover={{ bg: "blue.50", color: "brand.600" }}
                              />
                              <IconButton
                                icon={<FiTrash2 />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                borderRadius="md"
                                onClick={() => handleDelete(index)}
                                _hover={{ bg: "red.50" }}
                              />
                            </HStack>
                          </HStack>
                        </>
                      )}
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        </ModalBody>

        {/* Footer */}
        <ModalFooter
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
          py={4}
          px={{ base: 6, md: 8 }}
          justifyContent="flex-end"
        >
          <HStack spacing={3}>
            <Button
              size="sm"
              variant="outline"
              borderRadius="md"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              colorScheme="brand"
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
