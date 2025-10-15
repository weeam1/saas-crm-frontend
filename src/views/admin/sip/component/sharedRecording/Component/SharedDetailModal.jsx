// ./Modals/SharedDetailModal.jsx
import React from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";

/**
 * Props:
 * - isOpen, onClose
 * - call: call object
 * - currentUser: logged in user (optional)
 */
const SharedDetailModal = ({ isOpen, onClose, call, currentUser }) => {
  const recordingId = call?.uniqueid || call?.recording;

  const { data: sharedData, isLoading } = useFetchItemsQuery(
    { path: `/sharedSipRecording/${recordingId}` },
    { refetchOnMountOrArgChange: true, skip: !recordingId }
  );

  const [createItemMutation, { isLoading: isMutating }] = useCreateItemMutation();

  const unshareUser = async (userId) => {
    try {
      await createItemMutation({
        path: "/sharedSipRecording/unshare",
        body: { recordingId, userId },
      }).unwrap();
      // after unshare, the useFetchItemsQuery above should refetch because of refetchOnMountOrArgChange true
    } catch (err) {
      console.error("Unshare failed:", err);
    }
  };

  const shared = sharedData?.data || null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Shared Detail</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={3}>
            <Text fontSize="sm" color="gray.600">Recording: {recordingId}</Text>
            <Text fontSize="xs" color="gray.500">{call?.src} → {call?.dst}</Text>
          </Box>

          <VStack align="start" spacing={3}>
            {isLoading ? <Text>Loading...</Text> : !shared ? <Text>Not shared yet</Text> : (shared.sharedWith || []).length === 0 ? <Text>No shared users</Text> : (shared.sharedWith || []).map((s) => (
              <HStack key={s._id} w="full" justify="space-between" p={2} borderWidth="1px" borderRadius="md">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="600">{s.user?.name || s.user?.email}</Text>
                  <Text fontSize="xs" color="gray.500">Shared: {new Date(s.sharedAt).toLocaleString()}</Text>
                </VStack>
                <Button size="sm" colorScheme={s.active ? "red" : "gray"} onClick={() => unshareUser(s.user._id)} isLoading={isMutating}>
                  {s.active ? "Unshare" : "Inactive"}
                </Button>
              </HStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="ghost">Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SharedDetailModal;
