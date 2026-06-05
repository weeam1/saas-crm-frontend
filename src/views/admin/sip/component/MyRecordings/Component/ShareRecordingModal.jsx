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
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import { useModalColors } from "hooks/useModalColors";

const ShareRecordingModal = ({ isOpen, onClose, call }) => {
  const colors = useModalColors();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        mx={{ base: 4, sm: 6 }}
        borderRadius="2xl"
        overflow="hidden"
        bg={colors.bg}
        boxShadow={colors.modalShadow}
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
          borderBottom="1px solid"
          borderColor={colors.borderColor}
        >
          Share Recording
        </ModalHeader>
        <ModalCloseButton color={colors.headerText} />

        <ModalBody bg={colors.bg} p={5}>
          <Box mb={4}>
            <Text fontSize="sm" color={colors.headingText}>
              <b>Recording:</b> {call?.uniqueid || call?.recording}
            </Text>
            <Text fontSize="xs" color={colors.mutedText}>
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
              bg={colors.bgInput}
              borderColor={colors.borderColor}
              color={colors.headingText}
              _placeholder={{ color: colors.mutedText }}
              _focus={{
                borderColor: colors.accentGold,
                boxShadow: `0 0 0 1px ${colors.accentGold}`,
              }}
              _hover={{ borderColor: colors.accentGold }}
            />

            {showDropdown && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                right="0"
                bg={colors.bg}
                border="1px solid"
                borderColor={colors.borderColor}
                borderRadius="md"
                mt={1}
                zIndex="9999"
                maxH="230px"
                overflowY="auto"
                boxShadow={colors.cardShadow}
              >
                {isLoading ? (
                  <HStack justify="center" py={3}>
                    <Spinner size="sm" color={colors.accentGold} />
                    <Text fontSize="sm" color={colors.bodyText}>Loading users...</Text>
                  </HStack>
                ) : filteredUsers.length === 0 ? (
                  <Text
                    fontSize="sm"
                    color={colors.mutedText}
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
                      _hover={{ bg: colors.bgDeep }}
                      cursor="pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <Text fontWeight="500" color={colors.headingText}>
                        {user.fullName || user.name || user.email}
                      </Text>
                      <Text fontSize="xs" color={colors.mutedText}>
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
              <Text fontSize="sm" color={colors.headingText} fontWeight="500">
                Selected Users:
              </Text>
              <Wrap spacing={2}>
                {selectedUsers.map((user) => (
                  <WrapItem key={user._id}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      bg={colors.badgeInfoBg}
                      color={colors.badgeInfoText}
                      border="1px solid"
                      borderColor={colors.badgeInfoBorder}
                      _hover={{ bg: colors.bgDeep }}
                    >
                      <TagLabel>
                        {user.fullName || user.name || user.email}
                      </TagLabel>
                      <TagCloseButton
                        onClick={() => handleRemoveUser(user._id)}
                        color={colors.badgeInfoText}
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
          borderColor={colors.borderColor}
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
            variant="brand"
            onClick={handleShare}
            isLoading={isSharing}
            isDisabled={selectedUsers.length === 0}
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