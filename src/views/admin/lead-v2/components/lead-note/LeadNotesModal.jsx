import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Button,
  HStack,
} from "@chakra-ui/react";
import { getApi } from "services/api";
import { toast } from "react-toastify";
import AddNewNote from "./AddNewNote";
import { buttonStyle } from "../constants";
import NoteCard from "./NoteCard";
import EditNote from "./EditNote";
import { useDeleteItemMutation } from "api/apiSlice";
import { useDispatch } from "react-redux";
import { updateLeadField } from "../../../../../redux/leadsSlice";
import CardShimmer from "components/loading/CardShimmer";
import NoData from "components/Message/NoData";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import useUserSession from "hooks/useUserSession";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const LeadNotesModal = ({ leadId, isOpen, onClose }) => {
  const [notesLoading, setNotesLoading] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const textColor = useColorModeValue("gray.500", "white");

  const [addNote, setAddNote] = useState(false);
  const [editNote, setEditNote] = useState(false);
  const [leadNote, setLeadNote] = useState(null);
  const [latestNote, setLatestNote] = useState(null);

  const [deleteItemMutation] = useDeleteItemMutation();

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const fetchLeadNotes = useCallback(async () => {
    if (!leadId) return;
    setNotesLoading(true);
    try {
      const leadNotes = await getApi(`api/leadnote/${leadId}`);
      setAllNotes(leadNotes.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't fetch lead notes");
    } finally {
      setNotesLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLeadNotes();
  }, [fetchLeadNotes]);

  const handleEditNote = (note) => {
    // Implement logic to open edit modal or form with `note` data

    const latestNote = allNotes[0]?._id === note._id;

    latestNote && setLatestNote(latestNote);

    setLeadNote(note);
    setEditNote(true);
  };

  const dispatch = useDispatch();

  const handleDeleteNote = async (note) => {
    try {
      await deleteItemMutation({
        path: `/leadnote/${note._id}`,
      }).unwrap();

      const updatedNotes = allNotes.filter((n) => n._id !== note._id);

      setAllNotes(updatedNotes);

      // Step 3: Update lastNote field in lead
      const latestNoteText = updatedNotes[0]?.note || "";

      dispatch(
        updateLeadField({
          id: leadId,
          key: "lastNote",
          value: latestNoteText,
        })
      );
      toast.success("Note Deleted successfuly");
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Lead",
        entityId: note._id || null,
        status: "success",
        message: `${user?.fullName} delete the note.`,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");

      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Lead",
        entityId: note._id || null,
        status: error?.status === 500 ? "error" : "fail",
        message: `Failed to delete the note.`,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered >
      <ModalOverlay />
      <ModalContent m="2" borderRadius="2xl">
        <ModalHeader
          bg="brand.500"
          color="white"
          px={{ base: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          borderTopRadius="lg"
        >
          <Flex
            justify="space-between"
            align="center"
            flexWrap="wrap"
            gap={{ base: 3, md: 0 }}
          >
            <HStack
              spacing="2"
              align="center"
              fontWeight="600"
              mb={{ base: 1, md: 0 }}
            >
              <Text
                fontSize="clamp(1rem, 2.5vw, 1.5rem)"
                lineHeight="short"
                fontWeight="600"
              >
                Lead Notes
              </Text>
              <CountUpComponent targetNumber={allNotes?.length || 0} />
            </HStack>

            <HStack spacing="3" align="center" gap={2}>
              <Button
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: "whiteAlpha.300" }}
                _active={{ bg: "whiteAlpha.400" }}
                py="2"
                px="4"
                size={{ base: "xs", md: "sm" }}
                fontSize="clamp(0.75rem, 1.8vw, 0.875rem)"
                onClick={() => setAddNote(true)}
                aria-label="add new note"
				borderRadius={"md"}
              >
                Add Note
              </Button>

              <ModalCloseButton
                position="relative"
                top="0"
				right="0"
                color="white"
                _focus={{ outline: "none" }}
                _hover={{ bg: "whiteAlpha.300" }}
              />
            </HStack>
          </Flex>
        </ModalHeader>

        <ModalBody>
          <Box
            h={{ base: "50vh", md: "60vh", lg: "70vh" }}
            overflow="scroll"
            scrollBehavior="smooth"
            p="2"
          >
            {notesLoading ? (
              <CardShimmer
                count={5}
                height="100px"
                columns={{ base: 1, sm: 1, md: 1, lg: 1, xl: 1, "2xl": 1 }}
              />
            ) : (
              <VStack alignItems="flex-start">
                {allNotes.length > 0 ? (
                  <Grid width="100%" templateColumns="1fr" gap={4} mb={2}>
                    {allNotes.map((note, id) => (
                      <NoteCard
                        id={id}
                        note={note}
                        onDelete={handleDeleteNote}
                        onEdit={handleEditNote}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box mx="auto" h="full">
                    <NoData label="notes" />
                  </Box>
                )}
              </VStack>
            )}
          </Box>

          {addNote && (
            <AddNewNote
              isOpen={addNote}
              onClose={() => setAddNote(false)}
              paramId={leadId}
              setNoteAdded={setAddNote}
              setAllNotes={setAllNotes}
              refreshNotes={fetchLeadNotes}
            />
          )}

          {editNote && (
            <EditNote
              isOpen={editNote}
              onClose={() => setEditNote(false)}
              leadNote={leadNote}
              leadId={leadId}
              refreshNotes={fetchLeadNotes}
              setAllNotes={setAllNotes}
              allNotes={allNotes}
              latestNote={latestNote}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeadNotesModal;
