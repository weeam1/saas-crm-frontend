import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Flex,
  Box,
  Text,
  Select,
} from "@chakra-ui/react";
import { FaPalette } from "react-icons/fa";

const StatusModal = ({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  getRandomColor,
  generateBgColor,
  metaStatuses,
}) => {
  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const handleColorChange = (color) => {
    // Only store the valid hex color, not the modified version
    setFormData({
      ...formData,
      color: color,
      // Don't set bgColor and textColor here - let the backend handle it
      // or generate them only for display purposes
    });
  };

  const handleRandomColor = () => {
    const randomColor = getRandomColor(
      formData.parentStatus !== undefined ? "sub" : "main",
    );
    setFormData({
      ...formData,
      color: randomColor,
      // Don't set bgColor and textColor here
    });
  };

  // Preview color (for display only)
  const previewBgColor = formData.color + "20";
  const previewTextColor = formData.color;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingItem ? "Edit Status" : "Add New Status"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={formErrors.label} mb={4} isRequired>
            <FormLabel>
              Label <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              size="sm"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              placeholder="Enter display label"
            />
            <FormErrorMessage>{formErrors.label}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Color</FormLabel>
            <Flex gap={4} align="center">
              <Input
                type="color"
                value={formData.color || "#06B6D4"}
                onChange={(e) => handleColorChange(e.target.value)}
                w="100px"
                h="35px"
                p={1}
              />
              <Button
                size="sm"
                leftIcon={<FaPalette />}
                onClick={handleRandomColor}
              >
                Random
              </Button>
            </Flex>

            {/* Color Preview - for display only */}
            {formData.color && (
              <Box mt={2} p={2} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" mb={1}>
                  Preview:
                </Text>
                <Flex align="center" gap={2}>
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="md"
                    bg={formData.color}
                  />
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="md"
                    bg={previewBgColor}
                  />
                  <Text fontSize="xs" color="gray.600">
                    Selected: {formData.color}
                  </Text>
                </Flex>
              </Box>
            )}
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Meta Status (Optional)</FormLabel>
            <Select
              size="sm"
              value={formData.metaStatus || ""}
              onChange={(e) =>
                setFormData({ ...formData, metaStatus: e.target.value || null })
              }
              placeholder="Select meta status (optional)"
            >
              <option value="">None</option>
              {metaStatuses.map((status) => (
                <option key={status._id} value={status._id}>
                  {status.label} {status.key ? `(${status.key})` : ""}
                </option>
              ))}
            </Select>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Link to a meta status for additional categorization
            </Text>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" size="sm" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" size="sm" onClick={onSubmit}>
            {editingItem ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StatusModal;
