import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";

const DeletePopup = ({ isOpen, onClose, onConfirm, itemName, isDeleting }) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        fontFamily="DM Sans"
        maxW={{ base: "xs", md: "sm" }}
        borderRadius="md"
        mx="auto"
        my="auto"
        data-testid="delete-confirmation-modal"
      >
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you want to delete{" "}
            <strong>
              {itemName ? `Account Name: ${itemName}` : "this item"}
            </strong>
            ? This action cannot be undone.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            bg="red.500"
            color="white"
            onClick={handleConfirm}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            _hover={{
              bg: "#9E7A3B",
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePopup;
