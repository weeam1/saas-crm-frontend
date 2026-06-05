import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  VStack,
  HStack,
  Tag,
  Circle,
  Button,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import moment from "moment";
import { useModalColors } from "hooks/useModalColors";

const LogModal = ({ isOpen, onClose, call }) => {
  const colors = useModalColors();
  const recordingId = call?.uniqueid || call?.recording;

  const { data: logsData, isLoading } = useFetchItemsQuery(
    { path: `/sipSetting/log/recording/${recordingId}` },
    { refetchOnMountOrArgChange: true, skip: !isOpen || !recordingId }
  );

  const logs = logsData?.data || [];

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const getTagColor = (type) => {
    switch (type) {
      case "SHARED":
        return { bg: "rgba(1,181,116,0.12)", color: "#10B981" };
      case "PLAYED":
        return { bg: "rgba(46,92,135,0.25)", color: "#7AAAC4" };
      case "STATUS_CHANGED":
        return { bg: "rgba(255,179,71,0.12)", color: "#FFB347" };
      default:
        return { bg: colors.bgInput, color: colors.accentGold };
    }
  };

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
        bg={colors.viewBg}
        boxShadow={colors.modalShadow}
      >
        <ModalHeader
          bg={colors.viewHeaderBg}
          color={colors.viewHeaderText}
          fontWeight="700"
          fontSize="lg"
          py={4}
          borderBottom="1px solid"
          borderColor={colors.viewHeaderBorder}
        >
          Recording Activity Log
        </ModalHeader>
        <ModalCloseButton color={colors.viewHeaderText} />

        <ModalBody p={5} bg={colors.viewBg} maxH="70vh" overflowY="auto">
          {isLoading ? (
            <Text textAlign="center" color={colors.mutedText}>
              Loading activity logs...
            </Text>
          ) : sortedLogs.length === 0 ? (
            <Text textAlign="center" color={colors.mutedText}>
              No activities logged yet
            </Text>
          ) : (
            <VStack align="start" spacing={5} mt={2}>
              {sortedLogs.map((log, i) => {
                const tagStyle = getTagColor(log.action);
                return (
                  <HStack
                    key={log._id || i}
                    align="start"
                    spacing={4}
                    w="full"
                    position="relative"
                  >
                    <VStack spacing={0} align="center">
                      <Circle size="10px" bg={tagStyle.color} />
                      {i < sortedLogs.length - 1 && (
                        <Box w="2px" h="50px" bg={colors.borderColor} />
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
                    >
                      <HStack justify="space-between" mb={2}>
                        <Tag
                          size="sm"
                          bg={tagStyle.bg}
                          color={tagStyle.color}
                          fontWeight="600"
                          borderRadius="md"
                        >
                          {log.action}
                        </Tag>
                        <Text fontSize="xs" color={colors.mutedText}>
                          {moment(log.createdAt).fromNow()}
                        </Text>
                      </HStack>

                      <Text fontSize="sm" color={colors.bodyText}>
                        {log.message}
                      </Text>
                      <Text fontSize="xs" color={colors.mutedText} mt={1}>
                        By{" "}
                        {log.userId?.fullName || log.userId?.email || "Unknown"}
                      </Text>
                    </Box>
                  </HStack>
                );
              })}
            </VStack>
          )}
        </ModalBody>

        <ModalFooter
          position="sticky"
          bottom="0"
          bg={colors.viewFooterBg}
          borderTop="1px solid"
          borderColor={colors.viewFooterBorder}
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

export default LogModal;