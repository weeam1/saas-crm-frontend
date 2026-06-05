import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import { useModalColors } from "hooks/useModalColors";

const AddShortListedNote = ({ applicationId, isOpen, onClose, refetch }) => {
  const [note, setNote] = useState("");
  const [createNote, { isLoading }] = useCreateItemMutation();
  const colors = useModalColors();

  const handleSubmit = async () => {
    try {
      await createNote({
        path: `/applications/short-listed/notes/${applicationId}`,
        body: { note },
      }).unwrap();
      refetch();
      toast.success("Feedback note added successfully.");
      setNote("");
      onClose();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(
        error?.data?.message || "Failed to add note. Please try again."
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(3px)" />
      <ModalContent
        mx="4"
        borderRadius="2xl"
        bg={colors.bg}
        shadow={colors.modalShadow}
        overflow="hidden"
      >
        {/* Header */}
        <ModalHeader p={0} borderBottom="1px solid" borderColor={colors.borderColor}>
          <Flex
            bg={colors.headerBg}
            color={colors.headerText}
            px={6}
            py={3}
            align="center"
            position="sticky"
            top="0"
            zIndex="10"
            boxShadow="md"
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color={colors.headerText}>
              Candidate Feedback Note
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={colors.closeBtnColor}
              _hover={{ bg: colors.closeBtnHoverBg }}
            />
          </Flex>
        </ModalHeader>

        {/* Body */}
        <ModalBody p={6}>
          <FormControl>
            <FormLabel color={colors.labelColor}>Note</FormLabel>
            <Textarea
              placeholder="Type Note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              focusBorderColor={colors.accentGold}
              height="160px"
              resize="none"
              overflowY="auto"
              bg={colors.bgInput}
              borderColor={colors.borderColor}
              color={colors.headingText}
              _hover={{ borderColor: colors.accentGold }}
              _placeholder={{ color: colors.mutedText }}
            />
          </FormControl>
        </ModalBody>

        {/* Footer */}
        <ModalFooter
          bg={colors.footerBg}
          borderTop="1px solid"
          borderColor={colors.borderColor}
          py={3}
          px={6}
          justifyContent="flex-end"
          gap={3}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            borderRadius="md"
            color={colors.bodyText}
            _hover={{
              bg: colors.secondaryBtnHoverBg,
              color: colors.headingText,
            }}
          >
            Cancel
          </Button>
          <Button
            bg={colors.accentGold}
            color={colors.headerText}
            isLoading={isLoading}
            onClick={handleSubmit}
            isDisabled={note.trim() === ""}
            borderRadius="md"
            _hover={{
              bg: colors.goldLight,
              transform: "translateY(-1px)",
              boxShadow: colors.goldGlow,
            }}
            _active={{ bg: colors.goldDark }}
            transition="all 0.2s ease"
          >
            {isLoading ? "Loading..." : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddShortListedNote;