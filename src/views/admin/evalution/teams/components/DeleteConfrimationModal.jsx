// components/DeleteConfirmationModal.jsx
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
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiAlertTriangle } from "react-icons/fi";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Team",
  message = "Are you sure you want to delete this team?",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  teamName = "",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottom="1px solid" borderColor="gray.100">
          <HStack spacing={3} align="center">
            <Icon as={FiAlertTriangle} color="red.500" boxSize={6} />
            <Text fontSize="lg" fontWeight="bold">
              {title}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <Text>
            {message}
            {teamName && (
              <Text as="span" fontWeight="bold" color="red.500">
                {" "}
                "{teamName}"{" "}
              </Text>
            )}
            This action cannot be undone.
          </Text>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor="gray.100" gap={3}>
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            colorScheme="red"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Deleting..."
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
