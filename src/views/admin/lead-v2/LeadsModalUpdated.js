import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  Flex,
  Text,
  Avatar,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Button,
  HStack,
  IconButton,
  Textarea,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import {
  FaEdit,
  FaPhoneAlt,
  FaPlus,
  FaTrash,
  FaWhatsapp,
} from "react-icons/fa";
import { useRef, useState } from "react";
import { AtSignIcon } from "@chakra-ui/icons";

const LeadsModal = ({ leadsModal, onClose, reFreshData, isInLeadPool }) => {
  const addNoteRef = useRef(null);

  const leadTabs = [
    {
      label: "Source & Tracking",
      data: [
        { label: "Source", value: "N/A" },
        { label: "Channel", value: "N/A" },
        { label: "Campaign", value: "N/A" },
        { label: "Adset", value: "N/A" },
        { label: "Source Content", value: "N/A" },
        {
          label: "Page URL",
          value: "https://landing-stage.weeam.info/abu-dhab",
        },
      ],
    },
    {
      label: "Status & Timeline",
      data: [
        { label: "Status", value: "Deal" },
        { label: "Main Status", value: "Deal" },
        { label: "Follow-up Status", value: "N/A" },
        { label: "Attendance Day", value: "الأحد، 16 نوفمبر" },
        { label: "Created Date", value: "9 Nov, 2025 4:39 PM" },
      ],
    },
    {
      label: "Additional Details",
      data: [
        { label: "Nationality", value: "American Samoa" },
        { label: "Preferred Time", value: "N/A" },
        { label: "In UAE?", value: "N/A" },
        { label: "Interest", value: "N/A" },
        { label: "Language", value: "N/A" },
        { label: "Budget", value: "N/A" },
      ],
    },
    {
      label: "Technical Details",
      data: [
        { label: "City", value: "Karachi" },
        { label: "Country", value: "Pakistan" },
      ],
    },
  ];

  // State to store notes with full info for professional UI
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: "Initial note 1",
      userName: "Nada Amin",
      userAvatar: "https://i.pravatar.cc/150?img=32", // placeholder avatar
      timeAgo: "2 hours ago",
    },
    {
      id: 2,
      content: "Initial note 2",
      userName: "John Doe",
      userAvatar: "https://i.pravatar.cc/150?img=12",
      timeAgo: "1 day ago",
    },
  ]);

  // State for adding new note
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // Add new note handler
  const handleAddNote = () => {
    if (newNote.trim() === "") return;
    const newEntry = { id: Date.now(), content: newNote };
    setNotes([newEntry, ...notes]);
    setNewNote("");
    setAddingNote(false);
  };

  // Edit note handler (simple example)
  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditedContent(note.content);
  };

  const saveEditedNote = () => {
    setNotes(
      notes.map((n) =>
        n.id === editingNoteId ? { ...n, content: editedContent } : n
      )
    );
    setEditingNoteId(null);
    setEditedContent("");
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditedContent("");
  };

  // Confirm delete action
  const confirmDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <Modal onClose={onClose} isOpen={leadsModal.isOpen} size="6xl" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.6)" backdropFilter="blur(6px)" />
      <ModalContent m="3" borderRadius="2xl" shadow="2xl" overflow="hidden">
        {/* HEADER */}
        <ModalHeader
          px={6}
          py={6}
          borderBottom="1px solid"
          borderColor="gray.200"
          bg="white"
        >
          <Flex align="center" justify="space-between" w="full">
            {/* Title */}
            <Text
              fontSize="lg"
              fontWeight="600"
              color="gray.800"
              letterSpacing="0.2px"
            >
              Lead Preview
            </Text>

            {/* Close Button */}
            <ModalCloseButton
              position="relative"
              top="0"
              right="0"
              color="black"
              boxSize={6}
              _focus={{ outline: "none" }}
              _hover={{ bg: "gray.100" }}
            />
          </Flex>
        </ModalHeader>

        <Box
          bg="white"
          color="gray.800"
          p={6}
          borderTopRadius="2xl"
          maxH={{ base: "50vh", md: "70vh" }}
          overflowY="auto"
          scrollBehavior="smooth"
          display={"flex"}
          flexDirection={"column"}
          gap={6}
        >
          <Box
            display="flex"
            alignItems="center"
            // gap="28px"
            flexDirection={{ base: "column", md: "row" }}
            gap={{ base: "18px", md: "28px" }}
            p={5}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            bg="white"
            boxShadow="xs"
            textAlign={{ base: "center", md: "left" }}
          >
            {/* Avatar */}
            <Avatar width="72px" height="72px" />

            {/* Text Area */}
            <Box
              display="flex"
              flexDirection="column"
              gap="14px"
              alignItems={{ base: "center", md: "flex-start" }}
            >
              {/* Name */}
              <Heading as="h2" size="md" color="gray.800" letterSpacing="0.3px">
                Nada Amin
              </Heading>

              {/* Contact Info */}
              <Box display="flex" gap="28px" flexWrap="wrap">
                {/* Email */}

                <Box display="flex" alignItems="center" gap="8px">
                  <AtSignIcon color="gray.500" boxSize={4} />
                  <Text fontSize="sm" color="gray.700">
                    hammadarain326@gmail.com
                  </Text>
                </Box>

                {/* Phone */}
                <Box display="flex" alignItems="center" gap="8px">
                  <FaPhoneAlt color="gray" size={15} />
                  <Text fontSize="sm" color="gray.700">
                    923041349020
                  </Text>
                </Box>

                {/* WhatsApp */}
                <Box display="flex" alignItems="center" gap="8px">
                  <FaWhatsapp color="#25D366" size={17} />
                  <Text fontSize="sm" color="gray.700">
                    +923041349020
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* TABS */}
          <Tabs variant="unstyled">
            {/* TAB LIST */}
            <TabList
              borderBottom="1px solid"
              borderColor="gray.200"
              overflowX="auto"
              whiteSpace="nowrap"
              css={{
                "&::-webkit-scrollbar": { height: "4px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#ccc",
                  borderRadius: "2px",
                },
              }}
            >
              {leadTabs.map((tab) => (
                <Tab
                  key={tab.label}
                  _selected={{
                    color: "#B79045",
                    borderBottom: "2px solid",
                    borderColor: "#B79045",
                    fontWeight: "600",
                  }}
                  fontWeight="500"
                  px={4}
                  py={2}
                  borderRadius="none"
                  _focus={{ boxShadow: "none" }}
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>

            {/* TAB PANELS */}
            <TabPanels>
              {leadTabs.map((tab) => (
                <TabPanel key={tab.label} p={0}>
                  {/* Scrollable container */}
                  <Box
                    maxH={{ base: "260px", md: "240px" }}
                    minH="150px" // min height
                    overflowY="auto" // vertical scroll
                    px={4}
                    py={4}
                    css={{
                      "&::-webkit-scrollbar": { width: "6px" },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#ccc",
                        borderRadius: "3px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "transparent",
                      },
                    }}
                  >
                    <Flex direction="column" gap={4}>
                      {tab.data.map((item) => (
                        <Flex
                          key={item.label}
                          justify="space-between"
                          p={3}
                          border="1px solid"
                          borderColor="gray.100"
                          borderRadius="md"
                          bg="gray.50"
                          align="center"
                        >
                          <Text fontWeight="500" color="gray.600">
                            {item.label}
                          </Text>
                          <Text
                            fontWeight="600"
                            color="gray.800"
                            textAlign="right"
                          >
                            {item.value}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </Box>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          {/* Notes */}
          <Box
            mt={6} // spacing from tabs
            display="flex"
            flexDirection="column"
            gap={4}
          >
            {/* Notes Header */}
            <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="600" color="#B79045">
                Notes
              </Text>

              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                onClick={() => {
                  setAddingNote(true);

                  // Smooth Scroll Trigger
                  setTimeout(() => {
                    addNoteRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}
              >
                Add Note
              </Button>
            </Flex>

            {/* Notes List */}
            <Box
              maxH="240px"
              overflowY="auto"
              px={2}
              py={1}
              css={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#ccc",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-track": { background: "transparent" },
              }}
              display="flex"
              flexDirection="column"
              gap={3}
            >
              {notes.map((note) => (
                <Flex
                  key={note.id}
                  direction="column"
                  p={{ base: 3, md: 4 }}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  boxShadow="sm"
                  _hover={{ bg: "gray.100", transition: "0.2s" }}
                >
                  {/* Header: Avatar + User + Time */}
                  <Flex
                    justify="space-between"
                    align={{ base: "flex-start", md: "center" }}
                    flexDirection={{ base: "column", md: "row" }}
                    gap={{ base: 2, md: 0 }}
                    mb={2}
                  >
                    <HStack spacing={3}>
                      <Avatar size="sm" src={note.userAvatar} />
                      <Text fontWeight="600" fontSize="sm" color="gray.800">
                        {note.userName}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {note.timeAgo}
                      </Text>
                    </HStack>

                    <HStack spacing={2}>
                      {/* Edit Button */}
                      <Tooltip
                        label="Edit Note"
                        placement="top"
                        openDelay={300}
                      >
                        <IconButton
                          icon={<FaEdit />}
                          size="sm"
                          variant="ghost"
                          color="gray.600"
                          _hover={{
                            bg: "#B79045",
                            color: "white",
                            transform: "scale(1.1)",
                            transition: "0.2s",
                          }}
                          aria-label="Edit Note"
                          onClick={() => startEditing(note)}
                        />
                      </Tooltip>

                      {/* Delete Button */}

                      <Popover placement="top-end">
                        <PopoverTrigger>
                          <IconButton
                            icon={<FaTrash size={13} />}
                            size="sm"
                            variant="ghost"
                            aria-label="Delete Note"
                            color="gray.600"
                            borderRadius="full"
                            _hover={{
                              bg: "red.50",
                              color: "red.600",
                              transform: "scale(1.15)",
                              transition: "0.18s ease",
                            }}
                          />
                        </PopoverTrigger>

                        <PopoverContent
                          p={2}
                          borderRadius="xl"
                          boxShadow="lg"
                          border="1px solid"
                          borderColor="gray.200"
                          width="260px"
                        >
                          <PopoverArrow />

                          <PopoverHeader
                            fontWeight="600"
                            fontSize="md"
                            border="none"
                            pb={1}
                            color="gray.800"
                          >
                            Delete Note?
                          </PopoverHeader>

                          <PopoverBody fontSize="sm" color="gray.600" pt={0}>
                            This action cannot be undone.
                            <Flex mt={4} justify="flex-end" gap={2}>
                              <Button
                                size="sm"
                                variant="ghost"
                                color="gray.700"
                                _hover={{ bg: "gray.100" }}
                              >
                                Cancel
                              </Button>

                              <Button
                                size="sm"
                                bg="red.500"
                                color="white"
                                _hover={{ bg: "red.600" }}
                                onClick={() => confirmDelete(note.id)}
                              >
                                Delete
                              </Button>
                            </Flex>
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </HStack>
                  </Flex>

                  {/* Content or Editing Mode */}
                  {editingNoteId === note.id ? (
                    <Box pl={10} w="100%">
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        bg="white"
                        borderColor="gray.300"
                        borderRadius="lg"
                        size="sm"
                        autoFocus
                        resize="vertical"
                        minH="80px"
                        _focus={{
                          borderColor: "#B79045",
                          boxShadow: "0 0 0 1px #B79045",
                        }}
                      />

                      {/* Action Buttons */}
                      <Flex justify="flex-end" mt={3} gap={3}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          _hover={{ bg: "gray.100" }}
                        >
                          Cancel
                        </Button>

                        <Button
                          size="sm"
                          bg="#B79045"
                          color="white"
                          _hover={{ bg: "#a77a3f" }}
                          onClick={saveEditedNote}
                        >
                          Save
                        </Button>
                      </Flex>
                    </Box>
                  ) : (
                    <Text fontSize="sm" color="gray.700" pl={10}>
                      {note.content}
                    </Text>
                  )}
                </Flex>
              ))}
            </Box>

            {/* Add New Note */}
            {addingNote && (
              <Flex
                ref={addNoteRef}
                gap={3}
                p={4}
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="xl"
                boxShadow="sm"
                direction={{ base: "column", md: "row" }}
                align="center"
              >
                <Textarea
                  placeholder="Write a note..."
                  size="sm"
                  flex={1}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  borderRadius="lg"
                  borderColor="gray.300"
                  _focus={{
                    borderColor: "#B79045",
                    boxShadow: "0 0 0 1px #B79045",
                  }}
                  resize="vertical"
                  minH="60px"
                  bg="white"
                />

                <Button
                  leftIcon={<FaPlus />}
                  colorScheme="yellow"
                  bg="#B79045"
                  color="white"
                  size="sm"
                  px={6}
                  py={3}
                  borderRadius="lg"
                  boxShadow="sm"
                  _hover={{
                    bg: "#a77a3f",
                    transform: "scale(1.02)",
                    transition: "0.2s",
                  }}
                  onClick={handleAddNote}
                >
                  Add
                </Button>
              </Flex>
            )}
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default LeadsModal;
