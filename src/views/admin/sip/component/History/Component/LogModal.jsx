// ./Modals/LogModal.jsx
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Heading,
  Text,
  Divider,
  VStack,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";

/**
 * Props:
 * - isOpen, onClose
 * - call: call object for which log is shown
 */
const LogModal = ({ isOpen, onClose, call }) => {
  const recordingId = call?.uniqueid || call?.recording;
  // Fetch shared details (which includes sharedWith)
  const { data: sharedData, isLoading: isSharedLoading } = useFetchItemsQuery(
    { path: `/sipSetting/sharedSipRecording/${recordingId}` },
    { refetchOnMountOrArgChange: true, skip: !recordingId }
  );

  // Fetch play history
  const { data: playHistoryData, isLoading: isPlayLoading } = useFetchItemsQuery(
    { path: `/playHistory/${recordingId}` },
    { refetchOnMountOrArgChange: true, skip: !recordingId }
  );

  const shared = sharedData?.data || null;
  const playHistory = playHistoryData?.data || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Recording Log</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontSize="sm" color="gray.600">Recording: {recordingId}</Text>
            <Text fontSize="xs" color="gray.500">{call?.src} → {call?.dst}</Text>
          </Box>

          <Heading size="sm" mb={2}>Play History</Heading>
          {isPlayLoading ? <Text>Loading play history...</Text> : playHistory.length === 0 ? <Text>No play records</Text> : (
            <VStack align="start" spacing={3} mb={4}>
              {playHistory.map((ph) => (
                <Box key={ph._id} p={2} borderWidth="1px" borderRadius="md" w="full">
                  <Text fontWeight="600">{ph.userId?.name || ph.userId?.email || "Unknown user"}</Text>
                  <Text fontSize="sm">{ph.playCount} plays</Text>
                  <Text fontSize="xs" color="gray.500">{(ph.timestamps || []).map(ts => new Date(ts).toLocaleString()).join(", ")}</Text>
                </Box>
              ))}
            </VStack>
          )}

          <Divider />

          <Heading size="sm" mt={4} mb={2}>Shared With</Heading>
          {isSharedLoading ? <Text>Loading shared details...</Text> : !shared ? <Text>Not shared yet</Text> : (
            <VStack align="start" spacing={2}>
              {(shared.sharedWith || []).filter(s => s.active).length === 0 ? <Text>Not shared with anyone (active)</Text> : (shared.sharedWith || []).filter(s => s.active).map((s) => (
                <Box key={s._id} p={2} borderWidth="1px" borderRadius="md" w="full">
                  <Text fontWeight="600">{s.user?.name || s.user?.email}</Text>
                  <Text fontSize="xs" color="gray.500">Shared At: {new Date(s.sharedAt).toLocaleString()}</Text>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LogModal;
