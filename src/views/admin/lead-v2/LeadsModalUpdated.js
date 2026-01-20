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
  Badge,
  Link,
} from "@chakra-ui/react";
import {
  FaEdit,
  FaPhoneAlt,
  FaPlus,
  FaTrash,
  FaWhatsapp,
} from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { EmailIcon } from "@chakra-ui/icons";
import { getApi, postApi } from "services/api";
import { extractLocationData, formatPostDate } from "utils/helpers";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import useUserSession from "hooks/useUserSession";
import NoData from "components/Message/NoData";
import { leadStatusLabels, mainLeadStatusLabels } from "utils/searchLabels";
import { format } from "date-fns";
import { constant } from "constant";
import { updateLeadField } from "../../../redux/leadsSlice";
import {
  useDeleteItemMutation,
  useUpdateItemMutation,
} from "../../../api/apiSlice";
import { usePermissions } from "hooks/usePermissions";
import { useSearchParams } from "react-router-dom";
import { safeValue } from "utils";

// const safeValue = (value) => {
//   // treat these as "empty"
//   if (
//     value === undefined ||
//     value === null ||
//     value === "" ||
//     value === "null" ||
//     value === "undefined"
//   ) {
//     return "N/A";
//   }

//   // empty array or empty object -> N/A
//   if (Array.isArray(value) && value.length === 0) return "N/A";
//   if (
//     typeof value === "object" &&
//     value !== null &&
//     !Array.isArray(value) &&
//     Object.keys(value).length === 0
//   )
//     return "N/A";

//   // whitespace-only string -> N/A
//   if (typeof value === "string" && value.trim().length === 0) return "N/A";

//   // otherwise return original value (preserve 0, false)
//   return value;
// };

class TimelineItem {
  constructor(type, updatedAt, updatedBy, updatedData, role) {
    this.type = type;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.updatedData = updatedData;
    this.role = role;
  }
}

// Helper functions
const getStatusColor = (type) => {
  const colors = {
    creation: "blue.500",
    "assignment-manager": "teal.500",
    "assignment-agent": "cyan.500",
    "unassigned-manager": "gray.500",
    "unassigned-agent": "gray.500",
    status: "purple.500",
    mStatus: "brand.500",
    "lead-buy": "green.500",
    release: "red.500",
  };
  return colors[type] || "gray.500";
};

const getBadgeColor = (type) => {
  const colors = {
    creation: "blue",
    "assignment-manager": "teal",
    "assignment-agent": "cyan",
    "unassigned-manager": "gray",
    "unassigned-agent": "gray",
    status: "purple",
    mStatus: "brand",
    "lead-buy": "green",
    release: "red",
  };
  return colors[type] || "gray";
};

const getTypeLabel = (type) => {
  const labels = {
    creation: "Created",
    release: "Release",
    "assignment-manager": "Manager Assigned",
    "assignment-agent": "Agent Assigned",
    "unassigned-manager": "Unassigned Manager",
    "unassigned-agent": "Unassigned Agent",
    status: "Status Changed",
    mStatus: "M Status Changed",
    "lead-buy": "Purchased",
  };
  return labels[type] || type;
};

const LeadsModal = ({
  leadsModal,
  onClose,
  reFreshData,
  isInLeadPool,
  isLeadCycle,
}) => {
  // Lead Details Logic

  const { user, userRoleName } = useUserSession();
  const { hasPermission } = usePermissions();
  const countries = useSelector((state) => state.countries.countryNames);
  const { createUserLog } = useUserActivityLog();

  const [data, setData] = useState();
  const [leadIp, setLeadIp] = useState({ ip: "", city: "", country: "" });

  const dispatch = useDispatch();

  const leadId = leadsModal.lid;

  const fetchData = async () => {
    try {
      const response = await getApi("api/lead/view/", leadId);
      setData(response?.data?.lead);

      const { ip, city, country } = extractLocationData(
        response?.data?.lead?.ip,
        countries,
      );
      setLeadIp({ ip, city, country });

      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadId,
        status: "success",
        message: `${user?.fullName || ""} viewed ${
          response?.data?.lead?.leadName || ""
        } lead.`,
      });
    } catch (err) {
      console.error(err);
      const errorMsg = err?.data?.message || "Lead details not found!";
      toast.error(errorMsg);

      createUserLog({
        userId: user?._id,
        action: "VIEW",
        entity: "Lead",
        entityType: "Lead",
        entityId: leadId,
        status: err?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lead Cycle Logic

  const [searchParams] = useSearchParams();
  let hideContact = false;

  if (userRoleName === "superAdmin") {
    hideContact = false;
  } else if (searchParams.get("invite") && userRoleName !== "superAdmin") {
    hideContact = user?._id !== data?.agentAssigned;
  } else if (isInLeadPool) hideContact = true;

  const [leadCycledata, setLeadCycleData] = useState([]);

  const fetchLeadCycleData = useCallback(async () => {
    try {
      const data = await getApi(`api/lead/cycle/${leadId}`);
      console.log("fetching lead cycle data in preview popup", data);

      const response = data?.data;

      let timelineData = [];
      let createdByName = response.lead?.createBy?.fullName || "Web";

      const leadCreatedItem = new TimelineItem(
        "creation",
        new Date(response.lead.createdDate)?.toUTCString(),
        createdByName,
        "",
      );

      timelineData.push(leadCreatedItem);

      if (response?.data?.length) {
        const newItems = response.data.map(
          (updated) =>
            new TimelineItem(
              updated.type,
              updated.updatedAt,
              updated.updatedBy?.fullName,
              updated.updatedData,
              updated.updatedBy?.roles[0]?.roleName,
            ),
        );

        timelineData = [...timelineData, ...newItems].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        );
      }

      setLeadCycleData(timelineData);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }, [leadId]); // include dependencies

  useEffect(() => {
    if (user && user?._id) {
      fetchLeadCycleData();
    }
  }, [fetchLeadCycleData, user]);

  // Notes Logic

  const addNoteRef = useRef(null);

  const [allNotes, setAllNotes] = useState([]);

  const fetchLeadNotes = async (lid) => {
    console.log(lid, "Checking the Idssssss");
    try {
      const leadNotes = await getApi("api/leadnote/" + lid);

      setAllNotes(leadNotes.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Couldn't fetch lead notes");
    }
  };

  useEffect(() => {
    if (leadId) {
      fetchLeadNotes(leadId);
    }
  }, [leadId]);

  // State for adding new note
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // <-- loading state

  const [openPopoverId, setOpenPopoverId] = useState(null);

  const canManageNotes = userRoleName === "superAdmin";

  // Add new note handler
  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setIsAdding(true); // start loading

      const res = await postApi("api/leadnote", {
        leadID: leadId,
        note: newNote,
      });

      toast.success("Note added successfully");
      setNewNote(""); // clear input after add

      // Refetch latest notes from server
      if (leadId) {
        await fetchLeadNotes(leadId);
      }

      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Lead",
        entityId: leadId || null,
        status: "success",
        message: `${user?.fullName} added a new note to lead.`,
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Something went wrong!");

      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Lead",
        entityId: leadId || null,
        status: error?.status === 500 ? "error" : "fail",
        message: `${user?.fullName} failed to add a new note.`,
      });
    } finally {
      setIsAdding(false); // stop loading
    }
  };

  // ---------------------------
  // STATE
  // ---------------------------
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const [updateItemMutation, { isLoading: isUpdating }] =
    useUpdateItemMutation();

  // ---------------------------
  // HELPER: Pick correct latest note
  // ---------------------------
  const getLatestNoteText = (notes) => {
    if (!notes || notes.length === 0) return "N/A";

    // Ensure notes are sorted by date DESC
    const sorted = [...notes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return sorted[0]?.note || "N/A";
  };

  // ---------------------------
  // START EDIT MODE
  // ---------------------------
  const startEditing = (note) => {
    setEditingNoteId(note._id);
    setEditedContent(note.note);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditedContent("");
  };

  // ---------------------------
  // MAIN FUNCTION: Save Edited Note
  // ---------------------------
  const saveEditedNote = async () => {
    if (!editedContent.trim()) return;

    try {
      // 1️⃣ API CALL
      const response = await updateItemMutation({
        path: `/leadnote/${editingNoteId}`,
        body: {
          note: editedContent,
          latestNote: true,
        },
      }).unwrap();

      // 2️⃣ UPDATE LOCAL NOTES
      const updatedNotes = allNotes.map((n) =>
        n._id === editingNoteId ? { ...n, note: editedContent } : n,
      );

      setAllNotes(updatedNotes);

      // 3️⃣ UPDATE LEAD.lastNote IN REDUX
      const latestNoteText = getLatestNoteText(updatedNotes);

      dispatch(
        updateLeadField({
          id: leadId,
          key: "lastNote",
          value: latestNoteText,
        }),
      );

      // 4️⃣ SUCCESS MESSAGE
      toast.success("Note updated successfully");

      // 5️⃣ LOG
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Lead",
        entityId: editingNoteId,
        status: "success",
        message: `${user?.fullName} updated a note.`,
      });

      // 6️⃣ EXIT EDIT MODE
      cancelEditing();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note!");

      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Lead",
        entityId: editingNoteId,
        status: error?.status === 500 ? "error" : "fail",
        message: `Failed to update the note.`,
      });
    }
  };

  const [deleteItemMutation] = useDeleteItemMutation();

  const [deletingNoteId, setDeletingNoteId] = useState();
  // main delete logic

  const confirmDelete = async (noteId) => {
    const note = allNotes.find((n) => n._id === noteId);
    if (!note) return;

    try {
      setDeletingNoteId(noteId);

      const res = await deleteItemMutation({ path: `/leadnote/${noteId}` });

      // If your API returns { success: true } or 204, check here
      if (res.error) {
        throw res.error;
      }

      // Update UI
      const updatedNotes = allNotes.filter((n) => n._id !== noteId);
      setAllNotes(updatedNotes);

      dispatch(
        updateLeadField({
          id: leadId,
          key: "lastNote",
          value: updatedNotes[0]?.note || "",
        }),
      );

      toast.success("Note Deleted successfully");

      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Lead",
        entityId: noteId,
        status: "success",
        message: `${user?.fullName} deleted a note.`,
      });

      setOpenPopoverId(null);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
      createUserLog({
        userId: user?._id,
        action: "DELETE",
        entity: "Lead",
        entityId: noteId,
        status: error?.status === 500 ? "error" : "fail",
        message: `Failed to delete the note.`,
      });
    } finally {
      setDeletingNoteId(null);
    }
  };

  const DefaultTabContent = ({ data }) => (
    <Box
      minH="150px"
      px={4}
      py={4}
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-thumb": {
          background: "#ccc",
          borderRadius: "3px",
        },
      }}
    >
      <Flex direction="column" gap={4}>
        {data.map((item) => {
          let isUrl = false;
          let displayText = item?.value || "N/A";

          try {
            const url = new URL(item.value);
            isUrl = true;
            displayText = `${url.hostname}${url.pathname}`;
          } catch (e) {
            // not a valid URL, leave displayText as-is
          }

          return (
            <Flex
              key={item.label}
              direction={{ base: "column", md: "row" }}
              gap={2}
              justify="space-between"
              p={3}
              border="1px solid"
              borderColor="gray.100"
              borderRadius="md"
              bg="gray.50"
              align={{ base: "flex-start" }}
              w="100%"
            >
              {/* LABEL */}
              <Text
                fontWeight="500"
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.600"
                flexShrink={0}
              >
                {item.label}
              </Text>

              {/* VALUE */}
              {isUrl ? (
                <Link
                  href={item.value}
                  color="blue.600"
                  fontWeight="600"
                  isExternal
                  fontSize={{ base: "xs", md: "sm" }}
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  textAlign={{ base: "left", sm: "right" }}
                >
                  {displayText} 🔗
                </Link>
              ) : (
                <Text
                  fontWeight="600"
                  color="gray.800"
                  fontSize={{ base: "xs", md: "sm" }}
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  textAlign={{ base: "left", sm: "right" }}
                  w={{ base: "100%", sm: "auto" }}
                >
                  {displayText}
                </Text>
              )}
            </Flex>
          );
        })}

        {/* {data.map((item) => (
          <Flex
            key={item.label}
            direction={{ base: "column", sm: "row" }} // mobile stack
            gap={2}
            justify="space-between"
            p={3}
            border="1px solid"
            borderColor="gray.100"
            borderRadius="md"
            bg="gray.50"
            align={{ base: "flex-start", sm: "center" }} // better mobile alignment
            w="100%"
          >
            <Text fontWeight="500" color="gray.600" flexShrink={0}>
              {item.label}
            </Text>

            <Text
              fontWeight="600"
              color="gray.800"
              wordBreak="break-word" // important for long URLs
              whiteSpace="pre-wrap" // allow multi-line
              textAlign={{ base: "left", sm: "right" }}
              w={{ base: "100%", sm: "auto" }}
            >
              {item?.value || "N/A"}
            </Text>
          </Flex>
        ))} */}
      </Flex>
    </Box>
  );

  if (!data) {
    return (
      <Box>
        <NoData label="lead details" />
      </Box>
    );
  }

  const formatValue = (value) =>
    !value
      ? "N/A"
      : typeof value === "object"
        ? value.result || value.text
        : value;

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
          maxH={{ base: "50vh", md: "81vh" }}
          overflowY="auto"
          scrollBehavior="smooth"
          display={"flex"}
          flexDirection={"column"}
          gap={6}
        >
          <Box
            display="flex"
            alignItems="center"
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
            {/* Text Area */}
            <Box
              display="flex"
              flexDirection="column"
              gap="14px"
              alignItems={{ base: "center", md: "flex-start" }}
            >
              {/* Name */}
              <Heading as="h2" size="md" color="gray.800" letterSpacing="0.3px">
                {data?.leadName}
              </Heading>

              {hasPermission("leads", "contactDetails") && !hideContact && (
                <>
                  <Box display="flex" gap="28px" flexWrap="wrap">
                    {/* Email */}

                    <Box display="flex" alignItems="center" gap="8px">
                      <EmailIcon color="gray.500" boxSize={4} />
                      <Text fontSize="sm" color="gray.700">
                        {data?.leadEmail}
                      </Text>
                    </Box>

                    {/* Phone */}
                    <Box display="flex" alignItems="center" gap="8px">
                      <FaPhoneAlt color="gray" size={15} />
                      <Text fontSize="sm" color="gray.700">
                        {formatValue(data?.leadPhoneNumber)}
                      </Text>
                    </Box>

                    {/* WhatsApp */}
                    <Box display="flex" alignItems="center" gap="8px">
                      <FaWhatsapp color="#25D366" size={17} />
                      <Text fontSize="sm" color="gray.700">
                        {/* +923041349020 */}
                        {formatValue(data?.leadWhatsappNumber)}
                      </Text>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
            {/* Secondary Contact */}
            <Box
              display="flex"
              flexDirection="column"
              gap="10px"
              alignItems={{ base: "center", md: "flex-start" }}
              borderLeftWidth={{ base: "0", md: "1px" }}
              borderLeftStyle="solid"
              borderLeftColor="gray.200"
              pl={{ base: 0, md: 5 }}
              mt={{ base: 4, md: 0 }}
              flex="1"
            >
              <Heading as="h4" size="sm" color="gray.600">
                Secondary Contact
              </Heading>

              <Box display="flex" gap="16px">
                <Box display="flex" alignItems="center" gap="8px">
                  <FaPhoneAlt color="gray" size={15} />
                  <Text fontSize="sm" color="gray.700">
                    +923009876543
                  </Text>
                </Box>

                <Box display="flex" alignItems="center" gap="8px">
                  <FaWhatsapp color="#25D366" size={17} />
                  <Text fontSize="sm" color="gray.700">
                    +923009876543
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* TABS */}
          <Tabs variant="unstyled">
            {/* TAB LIST */}
            <TabList
              position="sticky"
              top="-24px"
              mx="-24px"
              px="24px"
              zIndex="20"
              bg="white"
              borderBottom="1px solid"
              borderColor="gray.200"
              overflowX="auto"
              whiteSpace="nowrap"
              css={{
                scrollBehavior: "smooth",

                /* Chrome, Safari, Edge */
                "&::-webkit-scrollbar": {
                  height: "2px",
                },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#d4d4d4",
                  borderRadius: "2px",
                },

                /* Firefox */
                scrollbarWidth: "thin",
                scrollbarColor: "#d4d4d4 transparent",
              }}
            >
              {/* 1️⃣ Additional Details */}
              <Tab
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
                Basic Details
              </Tab>

              {/* 2️⃣ Lead Cycle */}
              {hasPermission("leads", "viewLeadCycle") && (
                <Tab
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
                  Lead Cycle
                </Tab>
              )}

              {/* 3️⃣ Source & Tracking */}
              <Tab
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
                Source & Tracking
              </Tab>

              {/* 4️⃣ Lead Status */}
              <Tab
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
                Lead Status
              </Tab>

              <Tab
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
                Notes
              </Tab>
            </TabList>

            {/* TAB PANELS */}
            <TabPanels>
              <TabPanel p={0}>
                <DefaultTabContent
                  data={[
                    {
                      label: "Nationality",
                      value: safeValue(data?.nationality),
                    },
                    {
                      label: "Preferred Time",
                      value: safeValue(data?.timetocall),
                    },
                    { label: "In UAE?", value: safeValue(data?.r_u_in_uae) },
                    { label: "Interest", value: safeValue(data?.interest) },
                    { label: "Language", value: safeValue(data?.leadLang) },
                    { label: "Budget", value: safeValue(data?.budget) },
                    { label: "City", value: leadIp?.city },
                    { label: "Country", value: leadIp?.country },
                  ]}
                />
              </TabPanel>

              {/* 2️⃣ Lead Cycle */}
              {hasPermission("leads", "viewLeadCycle") && (
                <TabPanel py={6}>
                  {leadCycledata?.map((item, index) => (
                    <Flex
                      key={index}
                      pb={8}
                      pl={8}
                      py={2}
                      borderLeft="2px solid"
                      borderColor="gray.100"
                      borderRadius="md"
                      bg="gray.50"
                      alignItems="flex-start"
                      position="relative"
                      transition="all 0.2s"
                    >
                      {/* Timeline dot */}
                      <Box
                        w={6}
                        h={6}
                        bg={getStatusColor(item.type)}
                        borderRadius="full"
                        position="absolute"
                        top={2}
                        left={0}
                        transform="translateX(-50%)"
                        border="3px solid white"
                        boxShadow="md"
                      />

                      {/* Timeline content */}
                      <Box flex={1} pr="2" py="1">
                        <Flex
                          flexDir={{ base: "column", md: "row" }}
                          justify="space-between"
                          align={{ base: "flex-start", md: "center" }}
                          mb={2}
                        >
                          <Badge
                            colorScheme={getBadgeColor(item.type)}
                            variant="subtle"
                            borderRadius="md"
                            shadow="sm"
                            px={2}
                            py={1}
                            fontSize={{ base: "xs", md: "sm", lg: "md" }}
                            textTransform="uppercase"
                          >
                            {getTypeLabel(item.type)}
                          </Badge>
                          <Text
                            fontSize={{ base: "10px", md: "sm" }}
                            color="gray.500"
                          >
                            {formatPostDate(item?.updatedAt, "Asia/Dubai")}
                          </Text>
                        </Flex>

                        <Box
                          bg="white"
                          p={{ base: 2, md: 4 }}
                          borderRadius="lg"
                          boxShadow="sm"
                        >
                          {(item.type === "assignment-manager" ||
                            item.type === "assignment-agent") && (
                            <Box>
                              <Text fontSize={{ base: "sm", md: "md" }} mb={1}>
                                {item.type === "assignment-manager"
                                  ? "👔"
                                  : "👤"}{" "}
                                <Text
                                  as="span"
                                  color={getStatusColor(item.type)}
                                  fontWeight="600"
                                >
                                  {item?.updatedData}
                                </Text>
                              </Text>
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.500"
                              >
                                By{" "}
                                <Text as="span" color="brand.500">
                                  {item?.updatedBy}
                                </Text>
                              </Text>
                            </Box>
                          )}
                          {(item.type === "unassigned-manager" ||
                            item.type === "unassigned-agent") && (
                            <Box>
                              <Text fontSize={{ base: "sm", md: "md" }} mb={1}>
                                ♻️
                                <Text
                                  as="span"
                                  color={getStatusColor(item.type)}
                                  fontWeight="600"
                                >
                                  {item?.updatedData}
                                </Text>
                              </Text>
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.500"
                              >
                                By{" "}
                                <Text as="span" color="brand.500">
                                  {item?.updatedBy}
                                </Text>
                              </Text>
                            </Box>
                          )}

                          {item.type === "status" && (
                            <Box>
                              <Text fontSize={{ base: "sm", md: "md" }} mb={1}>
                                🔄
                                <Text
                                  as="span"
                                  color={getStatusColor(item.type)}
                                  fontWeight="600"
                                >
                                  {item?.updatedData}
                                </Text>
                              </Text>
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.500"
                              >
                                By{" "}
                                <Text as="span" color="brand.500">
                                  {item?.updatedBy}
                                </Text>
                              </Text>
                            </Box>
                          )}

                          {item.type === "mStatus" && (
                            <Box>
                              <Text fontSize={{ base: "sm", md: "md" }} mb={1}>
                                🔄
                                <Text
                                  as="span"
                                  color={getStatusColor(item.type)}
                                  fontWeight="600"
                                >
                                  {item?.updatedData}
                                </Text>
                              </Text>
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.500"
                              >
                                By{" "}
                                <Text as="span" color="brand.500">
                                  {item?.updatedBy}
                                </Text>
                              </Text>
                            </Box>
                          )}

                          {item.type === "lead-buy" && (
                            <Box>
                              <Text fontSize={{ base: "sm", md: "md" }} mb={1}>
                                💰
                                <Text
                                  as="span"
                                  color={getStatusColor(item.type)}
                                  fontWeight="600"
                                >
                                  {item?.updatedData}
                                </Text>
                              </Text>
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.500"
                              >
                                By{" "}
                                <Text as="span" color="brand.500">
                                  {item?.updatedBy}
                                </Text>
                              </Text>
                            </Box>
                          )}
                          {item.type === "release" && (
                            <Box>
                              <Text fontSize={{ base: "sm", md: "md" }} mb={1}>
                                🔓
                                <Text
                                  as="span"
                                  color={getStatusColor(item.type)}
                                  fontWeight="600"
                                >
                                  {`${item?.role} Release Lead`}
                                </Text>
                              </Text>
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.500"
                              >
                                By{" "}
                                <Text as="span" color="brand.500">
                                  {item?.updatedBy}
                                </Text>
                              </Text>
                            </Box>
                          )}

                          {/* Dynamic content based on type */}
                          {item.type === "creation" && (
                            <Text fontSize={{ base: "sm", md: "md" }}>
                              🎯 <strong>Lead created</strong> by{" "}
                              <Text
                                as="span"
                                color={getStatusColor(item.type)}
                                fontWeight="600"
                              >
                                {item?.updatedBy}
                              </Text>
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </Flex>
                  ))}
                </TabPanel>
              )}

              {/* 3️⃣ Source & Tracking */}
              <TabPanel p={2}>
                <DefaultTabContent
                  data={[
                    { label: "Platform", value: safeValue(data?.leadSource) },
                    {
                      label: "Channel",
                      value: safeValue(data?.leadSourceChannel),
                    },
                    {
                      label: "Placement",
                      value: safeValue(data?.leadSourceMedium),
                    },
                    {
                      label: "Campaign Name",
                      value: safeValue(data?.leadCampaign),
                    },
                    { label: "Adset", value: safeValue(data?.adset) },
                    {
                      label: "Ad Name",
                      value: safeValue(data?.leadSourceDetails),
                    },
                    { label: "Campaign URL", value: safeValue(data?.pageUrl) },
                  ]}
                />
              </TabPanel>

              {/* 4️⃣ Lead Status */}
              <TabPanel p={2}>
                <DefaultTabContent
                  data={[
                    {
                      label: "Status",
                      value: safeValue(leadStatusLabels[data?.leadStatus]),
                    },
                    {
                      label: "Main Status",
                      value: safeValue(mainLeadStatusLabels[data?.eLeadStatus]),
                    },
                    {
                      label: "Follow-up Status",
                      value: safeValue(data?.leadFollowUpStatus),
                    },
                    {
                      label: "Attendance Day",
                      value: safeValue(data?.attendanceDay),
                    },
                    {
                      label: "Created Date",
                      value: data?.createdDate
                        ? format(
                            new Date(data?.createdDate),
                            "d MMM, yyyy h:mm a",
                          )
                        : "N/A",
                    },
                  ]}
                />
              </TabPanel>

              {/* 4️⃣ Notes */}
              <TabPanel py={4}>
                {/* Notes */}
                <Box
                  mt={6} // spacing from tabs
                  display="flex"
                  flexDirection="column"
                  gap={4}
                >
                  {/* Notes Header */}
                  <Flex align="center" justify="space-between">
                    {/* <Text fontSize="lg" fontWeight="600" color="#B79045">
                      Notes
                    </Text> */}

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
                    px={2}
                    py={1}
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
                    display="flex"
                    flexDirection="column"
                    gap={3}
                  >
                    {(!allNotes || allNotes.length === 0) && (
                      <Text
                        textAlign="center"
                        color="gray.500"
                        fontSize="sm"
                        py={4}
                        fontStyle="italic"
                      >
                        No notes have been added yet.
                      </Text>
                    )}

                    {allNotes?.map((note) => {
                      return (
                        <Flex
                          key={note._id}
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
                              <Avatar
                                size="sm"
                                src={
                                  note.addedBy?.profileImage
                                    ? `${constant.baseUrl}${note.addedBy.profileImage}`
                                    : undefined
                                }
                              />
                              <Text
                                fontWeight="600"
                                fontSize="sm"
                                color="gray.800"
                              >
                                {note.addedBy?.firstName +
                                  " " +
                                  note.addedBy?.lastName}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {formatPostDate(new Date(note?.createdAt))}
                              </Text>
                            </HStack>

                            {/* ⭐ SHOW ACTION BUTTONS ONLY IF SUPERADMIN */}
                            {canManageNotes && (
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
                                <Popover
                                  placement="bottom-end"
                                  isOpen={openPopoverId === note._id}
                                  onClose={() => setOpenPopoverId(null)}
                                  closeOnBlur={false} // important to prevent auto-close
                                >
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
                                      onClick={() => setOpenPopoverId(note._id)} // open this popover
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

                                    {/* <PopoverHeader
																			fontWeight='600'
																			fontSize='md'
																			border='none'
																			pb={1}
																			color='gray.800'
																		>
																			Delete Note?
																		</PopoverHeader> */}

                                    <PopoverBody
                                      fontSize="sm"
                                      color="gray.600"
                                      pt={0}
                                    >
                                      This action cannot be undone.
                                      <Flex mt={4} justify="flex-end" gap={2}>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          color="gray.700"
                                          _hover={{ bg: "gray.100" }}
                                          onClick={() => setOpenPopoverId(null)} // cancel closes popover
                                        >
                                          Cancel
                                        </Button>

                                        <Button
                                          size="sm"
                                          bg="red.500"
                                          color="white"
                                          _hover={{ bg: "red.600" }}
                                          onClick={() =>
                                            confirmDelete(note._id)
                                          } // triggers API
                                          isLoading={
                                            deletingNoteId === note._id
                                          } // optional loading state
                                        >
                                          Delete
                                        </Button>
                                      </Flex>
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>
                              </HStack>
                            )}
                          </Flex>

                          {/* Content or Editing Mode */}
                          {editingNoteId === note._id ? (
                            <Box pl={10} w="100%">
                              <Textarea
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
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
                                  isLoading={isUpdating}
                                >
                                  Save
                                </Button>
                              </Flex>
                            </Box>
                          ) : (
                            <Text fontSize="sm" color="gray.700" pl={10}>
                              {note?.note}
                            </Text>
                          )}
                        </Flex>
                      );
                    })}
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
                        isLoading={isAdding}
                      >
                        Add
                      </Button>
                    </Flex>
                  )}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default LeadsModal;
