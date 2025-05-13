import React, { useState } from "react";
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
  useColorModeValue,
  IconButton,
  Textarea,
  useDisclosure,
  GridItem,
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

const NotesModal = ({ isOpen, onClose, listingId }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const addNoteDisclosure = useDisclosure();
  const editNoteDisclosure = useDisclosure();

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteId, setNoteId] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState({ id: "", text: "" });

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

  const handleAddNote = async () => {
    try {
      await createItemMutation({
        path: `/listing/secondary/listing-notes/${listingId}`,
        body: { note: newNote },
      }).unwrap();

      toast.success("Note added successfully.", {
        autoClose: 3000,
      });
      setNewNote("");
      addNoteDisclosure.onClose();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add note", {
        autoClose: 3000,
      });
    }
  };

  const handleUpdateNote = async () => {
    try {
      await updateItemMutation({
        path: `/listing/secondary/listing-notes/${editingNote.id}`,
        body: { note: editingNote.text },
      }).unwrap();

      toast.success("Note updated successfully.", {
        autoClose: 3000,
      });
      setEditingNote({ id: "", text: "" });
      editNoteDisclosure.onClose();
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note", {
        autoClose: 3000,
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
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error(
        error.data?.message || "Failed to delete the note. Please try again.",
        { autoClose: 3000 }
      );
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

  const handlerDelete = (noteId) => {
    setNoteId(noteId);
    setDeleteModalOpen(true);
  };

  // Open add note modal
  const handlerOpenAddNote = () => {
    setNewNote("");
    addNoteDisclosure.onOpen();
  };

  return (
    <>
      {/* Main Notes Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent fontFamily="'DM Sans', sans-serif">
          <ModalHeader>
            <Flex justify="space-between" align="center" pt="8">
              <Text>Listing Notes</Text>
              <Button
                variant="solid"
                bg="brand.400"
                py="2"
                px="5"
                aria-label="add new note"
                size="sm"
                onClick={handlerOpenAddNote}
              >
                Add New Note
              </Button>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt={4}>
            <VStack
              height="60vh"
              overflow="scroll"
              mt={4}
              alignItems="flex-start"
            >
              {notes && notes.data && notes.data.length > 0 ? (
                <Grid
                  width="100%"
                  templateColumns="repeat(12, 1fr)"
                  gap={4}
                  mb={2}
                >
                  {notes.data.map((note, id) => (
                    <GridItem key={id} colSpan={{ base: 12, md: 6, lg: 6 }}>
                      <Box
                        bg="whitesmoke"
                        borderRadius="10px"
                        p={4}
                        m={1}
                        h="100%"
                        position="relative"
                        boxShadow="sm"
                        _hover={{ boxShadow: "md" }}
                      >
                        {/* Header: Name + Timestamp + Actions */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={2}
                        >
                          <Box>
                            <Text fontWeight="bold" color="black">
                              {note.user.fullName}
                            </Text>
                            <Text fontSize="13px" color="gray.600">
                              {format(
                                new Date(note?.createdAt),
                                "MMM d, yyyy h:mm a"
                              )}
                            </Text>
                          </Box>
                          <Box display="flex" gap={1}>
                            <IconButton
                              aria-label="Edit Note"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditClick(note)}
                            />
                            <IconButton
                              aria-label="Delete Note"
                              icon={<FiTrash2 />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handlerDelete(note._id.toString())}
                            />
                          </Box>
                        </Box>

                        {/* Note Body */}
                        <Box overflowY="auto" maxH="200px">
                          <Text
                            as="pre"
                            fontWeight="semibold"
                            whiteSpace="pre-wrap"
                            overflowWrap="break-word"
                            wordBreak="break-word"
                            color="black"
                          >
                            {note?.note}
                          </Text>
                        </Box>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              ) : (
                <Text
                  textAlign="center"
                  width="100%"
                  color={textColor}
                  fontSize="sm"
                  fontWeight="700"
                >
                  <DataNotFound />
                </Text>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Note Modal */}
      <Modal
        isOpen={addNoteDisclosure.isOpen}
        onClose={addNoteDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Enter your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              minH="150px"
              focusBorderColor="brand.500"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={addNoteDisclosure.onClose}
            >
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleAddNote}>
              Save Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        isOpen={editNoteDisclosure.isOpen}
        onClose={editNoteDisclosure.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Edit your note here..."
              value={editingNote.text}
              onChange={(e) =>
                setEditingNote({
                  ...editingNote,
                  text: e.target.value,
                })
              }
              minH="150px"
              focusBorderColor="brand.500"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={editNoteDisclosure.onClose}
            >
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleUpdateNote}>
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
