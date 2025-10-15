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

/**
 * ShareRecordingModal.jsx
 * - Allows selecting multiple active users
 * - Search dropdown with live filter
 * - Selected users shown as tags
 */
const ShareRecordingModal = ({ isOpen, onClose, call, currentUser }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // 🔹 Fetch all users (active ones)
  const { data: usersData, isLoading } = useFetchItemsQuery(
    { path: "/v2/user/search_users" },
    { refetchOnMountOrArgChange: true }
  );

  const [createItemMutation, { isLoading: isSharing }] = useCreateItemMutation();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setSearch("");
      setShowDropdown(false);
    }
  }, [isOpen]);

  // Close dropdown on outside click
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
        sharedBy: currentUser?._id,
      };

      await createItemMutation({
        path: "/sipSetting/sharedSipRecording/share",
        body: payload,
      }).unwrap();

      onClose();
    } catch (err) {
      console.error("❌ Share failed:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        boxShadow="2xl"
        p={[2, 4, 6]}
        mx={2}
        ref={dropdownRef}
      >
        <ModalHeader
          fontWeight="bold"
          fontSize={["lg", "xl"]}
          color="brand.600"
          textAlign="center"
        >
          Share Recording
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {/* 🎧 Recording Details */}
          <Box mb={4}>
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              <b>Recording:</b> {call?.uniqueid || call?.recording}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {call?.src} → {call?.dst}
            </Text>
          </Box>

          {/* 🔍 User Search Input */}
          <Box position="relative" mb={3}>
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              bg={useColorModeValue("gray.50", "gray.700")}
              borderColor={borderColor}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
              size="md"
            />

            {/* 🔽 Dropdown */}
            {showDropdown && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                right="0"
                bg={bgColor}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                mt={1}
                zIndex={20}
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
                    color="gray.500"
                    p={3}
                    textAlign="center"
                  >
                    No active users found
                  </Text>
                ) : (
                  filteredUsers.map((user) => (
                    <Box
                      key={user._id}
                      px={3}
                      py={2}
                      _hover={{ bg: "brand.50" }}
                      cursor="pointer"
                      transition="all 0.2s"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Text fontWeight="500" color="gray.800">
                        {user.fullName || user.name || user.email}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {user.email}
                      </Text>
                    </Box>
                  ))
                )}
              </Box>
            )}
          </Box>

          {/* 👥 Selected Users */}
          {selectedUsers.length > 0 && (
            <VStack align="start" spacing={2} w="full">
              <Text fontSize="sm" color="gray.600" fontWeight="500">
                Selected Users:
              </Text>
              <Wrap spacing={2} shouldWrapChildren>
                {selectedUsers.map((user) => (
                  <WrapItem key={user._id}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant="subtle"
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

        <ModalFooter flexWrap="wrap" justifyContent="space-between">
          <Button
            variant="outline"
            borderColor="brand.500"
            color="brand.600"
            _hover={{ bg: "brand.50" }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            bg="brand.500"
            color="white"
            _hover={{ bg: "brand.600" }}
            onClick={handleShare}
            isLoading={isSharing}
            disabled={selectedUsers.length === 0}
          >
            Share Recording
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareRecordingModal;
