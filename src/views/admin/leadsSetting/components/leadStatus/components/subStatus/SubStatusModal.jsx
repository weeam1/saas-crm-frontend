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
  Select,
  FormErrorMessage,
  Button,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { FaPalette } from "react-icons/fa";

const SubStatusModal = ({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  isSubmitting,
  getRandomColor,
  generateBgColor,
  mainStatuses = [],
  metaStatuses = [],
}) => {
  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const handleColorChange = (color) => {
    // Generate bgColor and textColor from the selected color
    setFormData({
      ...formData,
      color: color,
      bgColor: generateBgColor(color),
      textColor: color,
    });
  };

  const handleRandomColor = () => {
    const randomColor = getRandomColor("sub");
    setFormData({
      ...formData,
      color: randomColor,
      bgColor: generateBgColor(randomColor),
      textColor: randomColor,
    });
  };

  // Preview color (for display only)
  const previewBgColor = formData.color + "20";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingItem ? "Edit Sub Status" : "Add Sub Status"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Parent Main Status - Required */}
          <FormControl isInvalid={formErrors.mainStatus} mb={4} isRequired>
            <FormLabel>Main Status</FormLabel>
            <Select
              size="sm"
              value={formData.mainStatus || ""}
              onChange={(e) =>
                setFormData({ ...formData, mainStatus: e.target.value })
              }
              placeholder="Select main status"
            >
              {mainStatuses.map((status) => (
                <option key={status._id} value={status._id}>
                  {status.label} {status.meta_id ? `(${status.meta_id})` : ""}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{formErrors.mainStatus}</FormErrorMessage>
          </FormControl>

          {/* Label - Required */}
          <FormControl isInvalid={formErrors.label} mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              size="sm"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              placeholder="Enter Name"
            />
            <FormErrorMessage>{formErrors.label}</FormErrorMessage>
          </FormControl>

          {/* Color */}
          <FormControl mb={4}>
            <FormLabel>Color</FormLabel>
            <Flex gap={4} align="center">
              <Input
                type="color"
                value={formData.color || "#6366F1"}
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

            {/* Color Preview */}
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
                    bg={formData.bgColor || previewBgColor}
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
              placeholder="Select meta status"
            >
              <option value="">None</option>
              {metaStatuses.map((status) => (
                <option key={status._id} value={status._id}>
                  {status.label}
                </option>
              ))}
            </Select>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Link this lead status to a Meta Pixel event for better tracking
              and categorization.
            </Text>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" size="sm" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            size="sm"
            onClick={onSubmit}
            isLoading={isSubmitting}
            loadingText={editingItem ? "Updating..." : "Saving..."}
          >
            {editingItem ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubStatusModal;
