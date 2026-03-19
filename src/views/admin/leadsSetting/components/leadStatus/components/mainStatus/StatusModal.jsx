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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
  isSubmitting,
}) => {
  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const handleColorChange = (color) => {
    setFormData({
      ...formData,
      color: color,
      bgColor: generateBgColor(color, 80),
      textColor: color,
    });
  };

  const handleRandomColor = () => {
    const randomColor = getRandomColor("main");
    setFormData({
      ...formData,
      color: randomColor,
      bgColor: generateBgColor(randomColor, 80),
      textColor: randomColor,
    });
  };

  const previewBgColor = formData.bgColor;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingItem ? "Edit Main Status" : "Add Main Status"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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

          {/* Coin Cost Field - New */}
          <FormControl mb={4}>
            <FormLabel>Coin Cost</FormLabel>
            <NumberInput
              size="sm"
              value={formData.coinCost || 0}
              onChange={(valueString) =>
                setFormData({
                  ...formData,
                  coinCost: parseInt(valueString) || 0,
                })
              }
              min={0}
              step={1}
            >
              <NumberInputField placeholder="Enter coin cost" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Number of coins required for this status
            </Text>
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

export default StatusModal;
