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
}) => {
  const handleClose = () => {
    setMetaFormErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editingMetaId ? "Edit Meta ID" : "Add New Meta ID"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={metaFormErrors.label} mb={4}>
            <FormLabel>Label Name</FormLabel>
            <Input
              size="sm"
              value={metaFormData.label}
              onChange={(e) =>
                setMetaFormData({ ...metaFormData, label: e.target.value })
              }
              placeholder="Enter label name (e.g., Interested)"
            />
            <FormErrorMessage>{metaFormErrors.label}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={metaFormErrors.key} mb={4} isRequired>
            <FormLabel>
              Key <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              size="sm"
              value={metaFormData.key}
              onChange={(e) =>
                setMetaFormData({
                  ...metaFormData,
                  key: e.target.value,
                })
              }
              placeholder="e.g., Lead_Interested"
            />
            <FormErrorMessage>{metaFormErrors.key}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={metaFormErrors.description} mb={4} isRequired>
            <FormLabel>
              Description <span style={{ color: "red" }}>*</span>
            </FormLabel>
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
          <Button colorScheme="purple" size="sm" onClick={onSubmit}>
            {editingMetaId ? "Update" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MetaIdModal;
