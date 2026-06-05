import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Text,
  VStack,
  Box,
  Grid,
  GridItem,
  IconButton,
  Textarea,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import DataNotFound from "components/notFoundData";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfirmationModal from "components/Message/ConfirmationModal";
import { format } from "date-fns";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { useModalColors } from "hooks/useModalColors";

const NotesModal = ({ isOpen, onClose, listingId }) => {
  const colors = useModalColors();

  const addNoteDisclosure = useDisclosure();
  const editNoteDisclosure = useDisclosure();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteId, setNoteId] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState({ id: "", text: "" });
  const user = JSON.parse(localStorage.getItem("user"));

  const { createUserLog } = useUserActivityLog();
  const [deleteItemMutation] = useDeleteItemMutation();
  const [createItemMutation] = useCreateItemMutation();
  const [updateItemMutation] = useUpdateItemMutation();

  const {
    data: notes,
    isLoading,
    isFetching,
    refetch,
  } = useFetchItemsQuery(
    { path: `/listing/secondary/listing-notes/${listingId}` },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (notes?.data) {
      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Listing_Note",
        entityType: "listingNotes",
        entityId: notes.data._id,
        status: "success",
        message: `${user?.fullName} viewed listing notes.`,
      });
    }
    if (!notes?.data && !isLoading && !isFetching) {
      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Listing_Note",
        entityType: "listingNotes",
        entityId: listingId,
        status: "error",
        message: `${user?.fullName} attempted to view listing notes, but it was not found.`,
      });
    }
  }, [listingId]);

  const handleAddNote = async () => {
    try {
      const response = await createItemMutation({
        path: `/listing/secondary/listing-notes/${listingId}`,
        body: { note: newNote },
      }).unwrap();

      toast.success("Note added successfully.", {
        autoClose: 3000,
      });
      setNewNote("");
      addNoteDisclosure.onClose();
      refetch();
      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Listing_Note",
        entityType: "listingNotes",
        entityId: response?.data._id,
        status: "success",
        message: `${user?.fullName} created secondary listing notes.`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add note", {
        autoClose: 3000,
      });
      const errorMsg =
        error?.data?.message ||
        "Failed to add listing notes. Please try again.";
      createUserLog({
        userId: user?._id,
        entity: "Listing_Note",
        entityType: "listingNotes",
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const handleUpdateNote = async () => {
    try {
      const response = await updateItemMutation({
        path: `/listing/secondary/listing-notes/${editingNote.id}`,
        body: { note: editingNote.text },
      }).unwrap();

      toast.success("Note updated successfully.", {
        autoClose: 3000,
      });
      setEditingNote({ id: "", text: "" });
      editNoteDisclosure.onClose();
      refetch();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Listing_Note",
        entityType: "listingNotes",
        entityId: editingNote.id,
        status: "success",
        message: `"${user?.fullName}" update the secondary listing notes.`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note", {
        autoClose: 3000,
      });
      const errorMsg =
        error?.data?.message ||
        "Failed to update listing notes. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Listing_Note",
        entityType: "listingNotes",
        entityId: editingNote.id || null,
        status: error?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    }
  };

  const handleConfirmRemove = async () => {
    try {
      await deleteItemMutation({
        path: `/listing/secondary/listing-notes/${noteId}`,
        body: {},
      }).unwrap();
      toast.success("Note deleted successfully.", {
        autoClose: 3000,
      });
      refetch();
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Listing_Note",
        entityType: "listingNotes",
        entityId: noteId,
        status: "success",
        message: `"${user?.fullName}" deleted listing notes.`,
      });
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error(
        error.data?.message || "Failed to delete the note. Please try again.",
        { autoClose: 3000 }
      );
      const errorMsg =
        error?.data?.message ||
        "Failed to delete the listing notes. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Listing_Note",
        entityType: "listingNotes",
        entityId: noteId,
        status: error?.status === 500 ? "error" : "fail",
        message: errorMsg,
      });
    }
    setDeleteModalOpen(false);
  };

  const handleEditClick = (note) => {
    setEditingNote({
      id: note._id,
      text: note.note,
    });
    editNoteDisclosure.onOpen();
  };

  const handleDeleteClick = (noteId) => {
    setNoteId(noteId);
    setDeleteModalOpen(true);
  };

  // Open add note modal
  const openAddNoteModal = () => {
    setNewNote("");
    addNoteDisclosure.onOpen();
  };

  return (
    <>
      {/* Main Notes Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="2xl"
          boxShadow={colors.modalShadow}
          bg={colors.bg}
          overflow={"hidden"}
          border="1px solid"
          borderColor={colors.borderColor}
        >
          {/* Header */}
          <ModalHeader px={4} py={4} bg={colors.headerBg} color={colors.headerText} borderBottom="1px solid" borderColor={colors.borderColor}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              justify="space-between"
              align={{ base: "flex-start", sm: "center" }}
              gap={{ base: 3, sm: 2 }}
              w="full"
              flexWrap="wrap"
            >
              <HStack spacing={3} align="center">
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="600"
                  noOfLines={1}
                  maxW={{ base: "200px", sm: "none" }}
                  color={colors.headerText}
                >
                  Listing Notes
                </Text>
              </HStack>

              <HStack spacing={2} align="center" justify="flex-end">
                <Button
                  size="sm"
                  onClick={openAddNoteModal}
                  variant="ghost"
                  color={colors.headerText}
                  _hover={{ bg: colors.closeBtnHoverBg }}
                  outline={"none"}
                >
                  Add New Note
                </Button>
                <ModalCloseButton
                  position="relative"
                  color={colors.headerText}
                  top="0"
                  right="0"
                  _hover={{ bg: colors.closeBtnHoverBg }}
                  _focus={{ outline: "none" }}
                />
              </HStack>
            </Flex>
          </ModalHeader>

          {/* Body */}
          <ModalBody pt={4} maxH="60vh" overflowY="auto" bg={colors.bg}>
            <VStack align="flex-start" spacing={3}>
              {notes?.data?.length > 0 ? (
                <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
                  {notes.data.map((note) => (
                    <GridItem key={note._id} colSpan={{ base: 12, md: 6 }}>
                      <Box
                        bg={colors.bgInput}
                        borderRadius="lg"
                        p={4}
                        h="100%"
                        position="relative"
                        boxShadow={colors.cardShadow}
                        _hover={{ boxShadow: colors.modalShadow }}
                        border="1px solid"
                        borderColor={colors.borderColor}
                      >
                        <Flex justify="space-between" mb={2}>
                          <Box>
                            <Text fontWeight="bold" color={colors.headingText}>
                              {note.user.fullName}
                            </Text>
                            <Text fontSize="xs" color={colors.mutedText}>
                              {format(
                                new Date(note.createdAt),
                                "MMM d, yyyy h:mm a"
                              )}
                            </Text>
                          </Box>
                          <Flex gap={1}>
                            <IconButton
                              aria-label="Edit Note"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditClick(note)}
                              color={colors.bodyText}
                              _hover={{ color: colors.accentGold, bg: colors.bgDeep }}
                            />
                            <IconButton
                              aria-label="Delete Note"
                              icon={<FiTrash2 />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteClick(note._id.toString())}
                              color={colors.badgeErrorText}
                              _hover={{ bg: colors.badgeErrorBg, color: colors.badgeErrorText }}
                            />
                          </Flex>
                        </Flex>
                        <Box overflowY="auto" maxH="200px">
                          <Text
                            as="pre"
                            whiteSpace="pre-wrap"
                            wordBreak="break-word"
                            color={colors.bodyText}
                          >
                            {note.note}
                          </Text>
                        </Box>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              ) : (
                <Box width="100%" textAlign="center">
                  <DataNotFound />
                </Box>
              )}
            </VStack>
          </ModalBody>

          {/* Footer */}
          <ModalFooter
            bg={colors.footerBg}
            borderTop="1px solid"
            borderColor={colors.borderColor}
          >
            <Button
              variant="outline"
              onClick={onClose}
              borderRadius="md"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={addNoteDisclosure.isOpen}
        onClose={addNoteDisclosure.onClose}
        isCentered
      >
        <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="2xl"
          boxShadow={colors.modalShadow}
          bg={colors.bg}
          overflow={"hidden"}
          border="1px solid"
          borderColor={colors.borderColor}
        >
          <ModalHeader
            bg={colors.headerBg}
            color={colors.headerText}
            position="sticky"
            top="0"
            zIndex="10"
            py={4}
            borderBottom="1px solid"
            borderColor={colors.borderColor}
          >
            Add New Note
            <ModalCloseButton
              top="14px"
              right="16px"
              color={colors.headerText}
              _hover={{ bg: colors.closeBtnHoverBg }}
            />
          </ModalHeader>
          <ModalBody bg={colors.bg}>
            <Textarea
              placeholder="Enter your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              minH="150px"
              bg={colors.bgInput}
              borderColor={colors.borderColor}
              color={colors.headingText}
              _placeholder={{ color: colors.mutedText }}
              _hover={{ borderColor: colors.accentGold }}
              _focus={{
                borderColor: colors.accentGold,
                boxShadow: `0 0 0 1px ${colors.accentGold}`,
              }}
            />
          </ModalBody>
          <ModalFooter
            bg={colors.footerBg}
            borderTop="1px solid"
            borderColor={colors.borderColor}
          >
            <Button
              variant="outline"
              mr={3}
              onClick={addNoteDisclosure.onClose}
              borderRadius={"md"}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleAddNote}
              isDisabled={!newNote.trim()}
            >
              Save Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        isOpen={editNoteDisclosure.isOpen}
        onClose={editNoteDisclosure.onClose}
        isCentered
      >
        <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="2xl"
          boxShadow={colors.modalShadow}
          bg={colors.bg}
          overflow={"hidden"}
          border="1px solid"
          borderColor={colors.borderColor}
        >
          <ModalHeader
            bg={colors.headerBg}
            color={colors.headerText}
            position="sticky"
            top="0"
            zIndex="10"
            py={4}
            borderBottom="1px solid"
            borderColor={colors.borderColor}
          >
            Edit Note
            <ModalCloseButton
              top="14px"
              right="16px"
              color={colors.headerText}
              _hover={{ bg: colors.closeBtnHoverBg }}
            />
          </ModalHeader>
          <ModalBody bg={colors.bg}>
            <Textarea
              placeholder="Edit your note here..."
              value={editingNote.text}
              onChange={(e) =>
                setEditingNote({ ...editingNote, text: e.target.value })
              }
              minH="150px"
              bg={colors.bgInput}
              borderColor={colors.borderColor}
              color={colors.headingText}
              _placeholder={{ color: colors.mutedText }}
              _hover={{ borderColor: colors.accentGold }}
              _focus={{
                borderColor: colors.accentGold,
                boxShadow: `0 0 0 1px ${colors.accentGold}`,
              }}
            />
          </ModalBody>
          <ModalFooter
            bg={colors.footerBg}
            borderTop="1px solid"
            borderColor={colors.borderColor}
          >
            <Button
              variant="outline"
              mr={3}
              onClick={editNoteDisclosure.onClose}
              borderRadius={"md"}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleUpdateNote}
              isDisabled={!editingNote.text.trim()}
            >
              Update Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default NotesModal;