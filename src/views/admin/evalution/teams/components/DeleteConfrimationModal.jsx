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
  Flex,
} from "@chakra-ui/react";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";
import { useModalColors } from "hooks/useModalColors";

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
  const colors = useModalColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius="2xl"
        bg={colors.bg}
        boxShadow={colors.modalShadow}
        border="1px solid"
        borderColor={colors.borderColor}
        overflow="hidden"
      >
        {/* Header — Gold Gradient with Warning Icon */}
        <ModalHeader p={0}>
          <Flex
            align="center"
            bg={colors.headerBg}
            color={colors.headerText}
            px={6}
            py={4}
            boxShadow="0 2px 10px rgba(0,0,0,0.15)"
          >
            <Icon as={FiAlertTriangle} boxSize={5} mr={3} />
            <Text fontSize="lg" fontWeight="bold" color="inherit">
              {title}
            </Text>
            <ModalCloseButton
              position="absolute"
              right="14px"
              top="14px"
              bg={colors.closeBtnBg}
              color={colors.closeBtnColor}
              borderRadius="full"
              _hover={{ bg: colors.closeBtnHoverBg }}
              _focus={{ boxShadow: "none" }}
            />
          </Flex>
        </ModalHeader>

        {/* Body — Warning Content */}
        <ModalBody py={6} px={6}>
          <Flex direction="column" align="center" textAlign="center">
            {/* Warning Icon Circle */}
            <Flex
              align="center"
              justify="center"
              bg={colors.badgeErrorBg}
              border="2px solid"
              borderColor={colors.badgeErrorBorder}
              borderRadius="full"
              w="64px"
              h="64px"
              mb={4}
            >
              <Icon as={FiTrash2} color={colors.badgeErrorText} boxSize={7} />
            </Flex>

            {/* Message */}
            <Text fontSize="md" color={colors.bodyText} lineHeight="1.6">
              {message}
              {teamName && (
                <Text as="span" fontWeight="bold" color={colors.badgeErrorText}>
                  {" "}
                  "{teamName}"{" "}
                </Text>
              )}
            </Text>

            {/* Warning Subtext */}
            <Flex
              mt={4}
              bg={colors.badgeErrorBg}
              border="1px solid"
              borderColor={colors.badgeErrorBorder}
              borderRadius="lg"
              p={3}
              w="full"
              align="center"
              gap={2}
            >
              <Icon as={FiAlertTriangle} color={colors.badgeErrorText} boxSize={4} flexShrink={0} />
              <Text fontSize="sm" color={colors.badgeErrorText} textAlign="left">
                This action is permanent and cannot be reversed.
              </Text>
            </Flex>
          </Flex>
        </ModalBody>

        {/* Footer — Navy with red delete button */}
        <ModalFooter
          bg={colors.footerBg}
          borderTop="2px solid"
          borderColor={colors.headerBg}
          py={4}
          px={6}
          gap={3}
        >
          <Button
            variant="ghost"
            borderRadius="md"
            onClick={onClose}
            isDisabled={isLoading}
            color={colors.secondaryBtnText}
            _hover={{
              bg: colors.secondaryBtnHoverBg,
              color: colors.secondaryBtnHoverText,
            }}
            leftIcon={<FiX />}
          >
            {cancelText}
          </Button>
          <Button
            borderRadius="md"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Deleting..."
            bg="red.500"
            color="white"
            fontWeight="bold"
            px={6}
            _hover={{
              bg: "red.600",
              boxShadow: "0 4px 15px rgba(238, 93, 80, 0.4)",
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: "red.700",
              transform: "translateY(0)",
            }}
            _disabled={{
              opacity: 0.6,
              cursor: "not-allowed",
              transform: "none",
              boxShadow: "none",
            }}
            leftIcon={<FiTrash2 />}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;