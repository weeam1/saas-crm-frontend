import React, { useState, useMemo } from "react";
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
  VStack,
  HStack,
  Avatar,
  Divider,
  Spinner,
  Circle,
  Tag,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import { useModalColors } from "hooks/useModalColors";

const SharedDetailModal = ({ isOpen, onClose, call }) => {
  const colors = useModalColors();
  const recordingId = call?.uniqueid;

  const {
    data: sharedData,
    isLoading,
    refetch,
  } = useFetchItemsQuery(
    { path: `/sipSetting/sharedSipRecording/${recordingId}` },
    { skip: !isOpen || !recordingId, refetchOnMountOrArgChange: true }
  );

  const [createItemMutation] = useCreateItemMutation();
  const [loadingUserId, setLoadingUserId] = useState(null);

  const updateAccess = async (userId) => {
    try {
      setLoadingUserId(userId);
      const target = sharedData?.data?.find(
        (u) => u.sharedWith?._id === userId
      );
      const oldStatus = target?.active ? "Active" : "Inactive";
      const newStatus = target?.active ? "Inactive" : "Active";

      await createItemMutation({
        path: "/sipSetting/sharedSipRecording/update",
        body: { recordingId, userId },
      }).unwrap();

      await refetch();
      toast.success("Access status updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      await createItemMutation({
        path: "/sipSetting/log/status-change",
        body: { recordingId, oldStatus, newStatus },
      }).unwrap();
    } catch (err) {
      console.error("Update access failed:", err);
      toast.error("Failed to update access!", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoadingUserId(null);
    }
  };

  const sharedList = sharedData?.data || [];

  const sortedList = useMemo(
    () =>
      [...sharedList].sort(
        (a, b) => new Date(b.sharedAt) - new Date(a.sharedAt)
      ),
    [sharedList]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        mx={{ base: 4, sm: 6 }}
        borderRadius="2xl"
        overflow="hidden"
        bg={colors.bg}
        boxShadow={colors.modalShadow}
      >
        {/* Header - Gold gradient for action modal */}
        <ModalHeader
          bg={colors.headerBg}
          color={colors.headerText}
          fontWeight="700"
          fontSize="lg"
          py={4}
          borderBottom="1px solid"
          borderColor={colors.borderColor}
        >
          Shared Recording Details
        </ModalHeader>
        <ModalCloseButton color={colors.headerText} />

        <ModalBody p={5} bg={colors.bg} maxH="75vh" overflowY="auto">
          {isLoading ? (
            <VStack py={10}>
              <Spinner size="lg" color={colors.accentGold} />
              <Text color={colors.mutedText}>Loading shared details...</Text>
            </VStack>
          ) : sortedList.length === 0 ? (
            <Text textAlign="center" color={colors.mutedText}>
              No shared records found.
            </Text>
          ) : (
            <VStack align="start" spacing={5} mt={2}>
              <Box
                w="full"
                bg={colors.bgInput}
                borderWidth="1px"
                borderColor={colors.borderColor}
                borderRadius="xl"
                p={4}
                boxShadow={colors.cardShadow}
              >
                <Text fontSize="sm" color={colors.mutedText}>
                  Recording ID
                </Text>
                <Text fontWeight="bold" color={colors.headingText}>
                  {sortedList[0]?.recordingId}
                </Text>
                <Text fontSize="xs" color={colors.mutedText}>
                  {sortedList[0]?.callData?.src} →{" "}
                  {sortedList[0]?.callData?.dst}
                </Text>
              </Box>

              <Divider borderColor={colors.borderColor} />

              <Text fontWeight="700" fontSize="md" color={colors.headingText}>
                Shared With ({sortedList.length})
              </Text>

              {sortedList.map((item, i) => (
                <HStack
                  key={item._id || i}
                  align="start"
                  spacing={4}
                  w="full"
                  position="relative"
                >
                  <VStack spacing={0} align="center">
                    <Circle
                      size="10px"
                      bg={item.active ? "#10B981" : colors.mutedText}
                    />
                    {i < sortedList.length - 1 && (
                      <Box w="2px" h="60px" bg={colors.borderColor} />
                    )}
                  </VStack>

                  <Box
                    flex="1"
                    bg={colors.bgInput}
                    borderWidth="1px"
                    borderColor={colors.borderColor}
                    borderRadius="xl"
                    p={4}
                    boxShadow={colors.cardShadow}
                    _hover={{ bg: colors.bgDeep }}
                    transition="all 0.2s ease"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Tag
                        size="sm"
                        bg={item.active ? colors.badgeSuccessBg : colors.badgeInfoBg}
                        color={item.active ? colors.badgeSuccessText : colors.mutedText}
                        fontWeight="600"
                        borderRadius="md"
                      >
                        {item.active ? "Active" : "Inactive"}
                      </Tag>

                      <Text fontSize="xs" color={colors.mutedText}>
                        {moment(item.sharedAt).fromNow()}
                      </Text>
                    </HStack>

                    <HStack align="start" spacing={3}>
                      <Avatar
                        size="sm"
                        name={item.sharedWith?.fullName}
                        bg={colors.accentGold}
                        color={colors.headerText}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="600" color={colors.headingText}>
                          {item.sharedWith?.fullName}
                        </Text>
                        <Text fontSize="xs" color={colors.mutedText}>
                          {item.sharedWith?.agency?.name}
                        </Text>
                        <Text fontSize="xs" color={colors.mutedText}>
                          Shared on: {moment(item.sharedAt).format("LLL")}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack justify="flex-end" mt={3}>
                      <Button
                        size="xs"
                        variant={item.active ? "outline" : "brand"}
                        onClick={() => updateAccess(item.sharedWith?._id)}
                        isLoading={loadingUserId === item.sharedWith?._id}
                        borderRadius="md"
                      >
                        {item.active ? "Unshare" : "Share"}
                      </Button>
                    </HStack>
                  </Box>
                </HStack>
              ))}
            </VStack>
          )}
        </ModalBody>

        {/* Footer */}
        <ModalFooter
          position="sticky"
          bottom="0"
          bg={colors.footerBg}
          borderTop="1px solid"
          borderColor={colors.borderColor}
          py={3}
          px={5}
          zIndex="10"
          justifyContent="flex-end"
          gap={3}
        >
          <Button
            onClick={onClose}
            variant="outline"
            px={8}
            borderRadius="md"
            fontWeight="600"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SharedDetailModal;