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
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { buttonStyle } from "utils/btn";
import { useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";

const AddShortListedNote = ({ applicationId, isOpen, onClose, refetch }) => {
  const [note, setNote] = useState("");
  const [createNote, { isLoading }] = useCreateItemMutation();

  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const bodyBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent
        mx="4"
        borderRadius="2xl"
        bg={bodyBg}
        shadow="2xl"
        overflow="hidden"
      >
        {/* Header */}
        <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
          <Flex
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            align="center"
            position="sticky"
            top="0"
            zIndex="10"
            boxShadow="md"
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
              Candidate Feedback Note
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </Flex>
        </ModalHeader>

        {/* Body */}
        <ModalBody p={6}>
          <FormControl>
            <FormLabel>Note</FormLabel>
            <Textarea
              placeholder="Type Note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              focusBorderColor="brand.500"
              height="160px"
              resize="none"
              overflowY="auto"
            />
          </FormControl>
        </ModalBody>

        {/* Footer */}
        <ModalFooter
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
          py={3}
          px={6}
          justifyContent="flex-end"
        >
          <Button
            {...buttonStyle}
            bg="softGray.100"
            color="gray.700"
            _active={{ bg: "gray.200" }}
            mr={3}
            onClick={onClose}
            variant="outline"
            borderRadius="md"
          >
            Cancel
          </Button>
          <Button
            {...buttonStyle}
            colorScheme="brand"
            isLoading={isLoading}
            onClick={handleSubmit}
            disabled={note.trim() === ""}
            borderRadius="md"
          >
            {isLoading ? "Loading..." : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddShortListedNote;
