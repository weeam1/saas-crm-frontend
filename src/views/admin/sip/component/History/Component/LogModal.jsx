import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  VStack,
  HStack,
  Tag,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFetchItemsQuery } from "api/apiSlice";
import moment from "moment";

const LogModal = ({ isOpen, onClose, call }) => {
  const recordingId = call?.uniqueid || call?.recording;

  const colors = {
    bg: useColorModeValue("gray.50", "gray.800"),
    card: useColorModeValue("white", "gray.700"),
    border: useColorModeValue("gray.200", "gray.600"),
    text: useColorModeValue("gray.700", "gray.200"),
    time: useColorModeValue("gray.500", "gray.400"),
    tag: useColorModeValue("brand.50", "brand.900"),
    tagText: useColorModeValue("brand.600", "brand.300"),
  };

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
        return { bg: "green.50", color: "green.600" };
      case "PLAYED":
        return { bg: "blue.50", color: "blue.600" };
      case "STATUS_CHANGED":
        return { bg: "orange.50", color: "orange.600" };
      default:
        return { bg: colors.tag, color: colors.tagText };
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent borderRadius="2xl" overflow="hidden" maxH="85vh">
        <ModalHeader
          fontWeight="700"
          color="white"
          borderBottomWidth="1px"
          borderColor={colors.border}
          bg="brand.600"
        >
          Recording Activity Log
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody p={5}>
          {isLoading ? (
            <Text>Loading activity logs...</Text>
          ) : sortedLogs.length === 0 ? (
            <Text color={colors.time}>No activities logged yet</Text>
          ) : (
            <VStack align="start" spacing={5} position="relative" mt={2}>
              {sortedLogs.map((log, i) => {
                const tagStyle = getTagColor(log.action);
                return (
                  <HStack
                    key={log._id || i}
                    align="start"
                    spacing={4}
                    position="relative"
                    w="full"
                  >
                    {/* Timeline dot + connector */}
                    <VStack spacing={0} align="center" position="relative">
                      <Circle size="10px" bg={tagStyle.color} />
                      {i < sortedLogs.length - 1 && (
                        <Box
                          w="2px"
                          h="50px"
                          bg={colors.border}
                          mt="2px"
                          mb="2px"
                        />
                      )}
                    </VStack>

                    {/* Activity card */}
                    <Box
                      flex="1"
                      bg={colors.card}
                      borderWidth="1px"
                      borderColor={colors.border}
                      borderRadius="md"
                      p={3}
                      boxShadow="sm"
                    >
                      <HStack justify="space-between" mb={2}>
                        <Tag
                          size="sm"
                          bg={tagStyle.bg}
                          color={tagStyle.color}
                          fontWeight="600"
                          textTransform="uppercase"
                          borderRadius="md"
                        >
                          {log.action}
                        </Tag>
                        <Text fontSize="xs" color={colors.time}>
                          {moment(log.createdAt).fromNow()}
                        </Text>
                      </HStack>

                      <Text fontSize="sm" color={colors.text}>
                        {log.message}
                      </Text>
                      <Text fontSize="xs" color={colors.time} mt={1}>
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
      </ModalContent>
    </Modal>
  );
};

export default LogModal;
