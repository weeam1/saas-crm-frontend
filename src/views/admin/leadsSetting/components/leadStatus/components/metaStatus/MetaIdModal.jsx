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
  Textarea,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";

const MetaIdModal = ({
  isOpen,
  onClose,
  editingMetaId,
  metaFormData,
  setMetaFormData,
  metaFormErrors,
  setMetaFormErrors,
  onSubmit,
  isSubmitting, // Add this prop for loading state
}) => {
  const handleClose = () => {
    setMetaFormErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingMetaId ? "Edit Meta ID" : "Add New Meta ID"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Label is now required */}
          <FormControl isInvalid={metaFormErrors.label} mb={4} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              size="sm"
              value={metaFormData.label}
              onChange={(e) =>
                setMetaFormData({ ...metaFormData, label: e.target.value })
              }
              placeholder="Enter Name"
            />
            <FormErrorMessage>{metaFormErrors.label}</FormErrorMessage>
          </FormControl>

          {/* Description is now optional - removed isRequired */}
          <FormControl isInvalid={metaFormErrors.description} mb={4}>
            <FormLabel>Description (Optional)</FormLabel>
            <Textarea
              size="sm"
              value={metaFormData.description}
              onChange={(e) =>
                setMetaFormData({
                  ...metaFormData,
                  description: e.target.value,
                })
              }
              placeholder="Enter description for this meta ID"
              rows={4}
            />
            <FormErrorMessage>{metaFormErrors.description}</FormErrorMessage>
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
            loadingText={editingMetaId ? "Updating..." : "Saving..."}
          >
            {editingMetaId ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MetaIdModal;
