import React, { useState, useEffect, useRef } from "react";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FaPalette } from "react-icons/fa";
import Select from "react-select";
import { useFetchItemsQuery } from "api/apiSlice";

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
  metaStatuses: initialMetaStatuses,
  isSubmitting,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Handle input change with debounce
  const handleInputChange = (inputValue) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout to search after 500ms of no typing
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fetch meta statuses with search
  const { data, isLoading, isFetching } = useFetchItemsQuery(
    {
      path: "/lead/meta-status",
      params: {
        ...(searchTerm && { search: searchTerm }),
        limit: 20,
      },
    },
    {
      skip: !isOpen, // Only fetch when modal is open
      refetchOnMountOrArgChange: true,
    },
  );

  // Prepare options from API data
  const options = data?.doc
    ? data.doc.map((status) => ({
        value: status._id,
        label: status.label || status.key,
      }))
    : [];

  // Set initial selected option when editing
  useEffect(() => {
    if (editingItem?.metaStatus && initialMetaStatuses) {
      // Try to find in initial data first
      const metaStatus = initialMetaStatuses.find(
        (ms) => ms._id === editingItem.metaStatus,
      );

      if (metaStatus) {
        setSelectedOption({
          value: metaStatus._id,
          label: metaStatus.label || metaStatus.key,
        });
      }
    } else if (!editingItem) {
      setSelectedOption(null);
      setSearchTerm("");
    }
  }, [editingItem, initialMetaStatuses]);

  // Update formData when selected option changes
  const handleChange = (option) => {
    setSelectedOption(option);
    setFormData({
      ...formData,
      metaStatus: option ? option.value : null,
    });
  };

  const handleClose = () => {
    setFormErrors({});
    setSearchTerm("");
    setSelectedOption(null);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
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

  // Custom styles for react-select to match Chakra UI
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#3182CE" : "#E2E8F0",
      boxShadow: state.isFocused ? "0 0 0 1px #3182CE" : "none",
      minHeight: "32px",
      fontSize: "14px",
      "&:hover": {
        borderColor: "#CBD5E0",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3182CE"
        : state.isFocused
          ? "#EBF8FF"
          : "white",
      color: state.isSelected ? "white" : "#1A202C",
      fontSize: "14px",
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#A0AEC0",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1A202C",
      fontSize: "14px",
    }),
    input: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: "#3182CE",
    }),
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

          {/* Coin Cost Field */}
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
              options={options}
              value={selectedOption}
              onChange={handleChange}
              onInputChange={handleInputChange}
              isLoading={isFetching || isLoading}
              placeholder="Search meta status..."
              isClearable
              styles={customStyles}
              noOptionsMessage={({ inputValue }) =>
                inputValue ? "No results found" : "Start typing to search"
              }
              loadingMessage={() => "Searching..."}
            />
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
