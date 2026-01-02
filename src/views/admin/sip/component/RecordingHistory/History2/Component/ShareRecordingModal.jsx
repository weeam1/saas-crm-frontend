import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Input,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";

const ShareRecordingModal = ({ isOpen, onClose, call }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const colors = {
    bg: useColorModeValue("gray.50", "gray.800"),
    card: useColorModeValue("white", "gray.700"),
    border: useColorModeValue("gray.200", "gray.600"),
    text: useColorModeValue("gray.700", "gray.200"),
    placeholder: useColorModeValue("gray.500", "gray.400"),
    headerText: useColorModeValue("brand.700", "brand.900"),
    headerBg: useColorModeValue("brand.300", "brand.100"),
    footerBg: useColorModeValue("gray.100", "gray.700"),
  };

  const { data: usersData, isLoading } = useFetchItemsQuery(
    { path: "/v2/user/search_users" },
    { refetchOnMountOrArgChange: true }
  );

  const [createItemMutation, { isLoading: isSharing }] =
    useCreateItemMutation();

  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setSearch("");
      setShowDropdown(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = (usersData?.doc || []).filter((u) =>
    (u.fullName || u.name || u.email || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSelectUser = (user) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
    setSearch("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (id) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleShare = async () => {
    if (!call || selectedUsers.length === 0) return;

    try {
      const payload = {
        recordingId: call.uniqueid || call.recording,
        sharedWith: selectedUsers.map((u) => u._id),
        callData: call,
      };

      await createItemMutation({
        path: "/sipSetting/sharedSipRecording/share",
        body: payload,
      }).unwrap();

      await createItemMutation({
        path: "/sipSetting/log/share",
        body: {
          recordingId: call.uniqueid || call.recording,
          data: payload,
        },
      }).unwrap();

      setSelectedUsers([]);
      setSearch("");
      onClose();
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered borderRadius="2xl"> 
      <ModalOverlay />
      <ModalContent
        mx={{ base: 4, sm: 6 }}
        borderRadius="2xl"
        overflow="hidden"
        bg={colors.card}
        boxShadow="2xl"
        ref={dropdownRef}
        h={"65vh"}
        maxH={"80vh"}
        position={"relative"}
      >
        <ModalHeader
          bg={colors.headerBg}
          color={colors.headerText}
          fontWeight="700"
          fontSize="lg"
          py={4}
        >
          Share Recording
        </ModalHeader>
        <ModalCloseButton color={colors.headerText} />

        <ModalBody bg={colors.bg} p={5}>
          <Box mb={4}>
            <Text fontSize="sm" color={colors.text}>
              <b>Recording:</b> {call?.uniqueid || call?.recording}
            </Text>
            <Text fontSize="xs" color={colors.placeholder}>
              {call?.src} → {call?.dst}
            </Text>
          </Box>

          <Box position="relative" mb={3} zIndex="50"> 
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              bg={useColorModeValue("gray.50", "gray.700")}
              borderColor={colors.border}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />

            {showDropdown && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                right="0"
                bg={colors.card}
                border="1px solid"
                borderColor={colors.border}
                borderRadius="md"
                mt={1}
                zIndex="9999"
                maxH="230px"
                overflowY="auto"
                boxShadow="md"
              >
                {isLoading ? (
                  <HStack justify="center" py={3}>
                    <Spinner size="sm" />
                    <Text fontSize="sm">Loading users...</Text>
                  </HStack>
                ) : filteredUsers.length === 0 ? (
                  <Text
                    fontSize="sm"
                    color={colors.placeholder}
                    p={3}
                    textAlign="center"
                  >
                    No users found
                  </Text>
                ) : (
                  filteredUsers.map((user) => (
                    <Box
                      key={user._id}
                      px={3}
                      py={2}
                      _hover={{ bg: "brand.50" }}
                      cursor="pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Text fontWeight="500" color={colors.text}>
                        {user.fullName || user.name || user.email}
                      </Text>
                      <Text fontSize="xs" color={colors.placeholder}>
                        {user.email}
                      </Text>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>

          {selectedUsers.length > 0 && (
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color={colors.text} fontWeight="500">
                Selected Users:
              </Text>
              <Wrap spacing={2}>
                {selectedUsers.map((user) => (
                  <WrapItem key={user._id}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      bg="brand.50"
                      color="brand.600"
                      _hover={{ bg: "brand.100" }}
                    >
                      <TagLabel>
                        {user.fullName || user.name || user.email}
                      </TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveUser(user._id)}
                      />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter
          borderTopWidth="1px"
          borderColor={colors.border}
          bg={colors.footerBg}
          justifyContent="flex-end"
          py={3}
        >
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            borderRadius={"md"}
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleShare}
            isLoading={isSharing}
            disabled={selectedUsers.length === 0}
            borderRadius={"md"}
          >
            Share Recording
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareRecordingModal;
