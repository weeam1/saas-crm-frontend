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
    headerText: useColorModeValue("brand.700", "brand.900"),
    headerBg: useColorModeValue("brand.300", "brand.100"),
  };

  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
        return { bg: "brand.50", color: "brand.600" };
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
      <ModalOverlay />
      <ModalContent
        mx={{ base: 4, sm: 6 }}
        borderRadius="2xl"
        overflow="hidden"
      >
        <ModalHeader
          bg={colors.headerBg}
          color={colors.headerText}
          fontWeight="700"
          fontSize="lg"
          py={4}
        >
          Recording Activity Log
        </ModalHeader>
        <ModalCloseButton color={colors.headerText} />

        <ModalBody p={5} bg={colors.bg} maxH="70vh" overflowY="auto">
          {isLoading ? (
            <Text textAlign="center" color={colors.time}>
              Loading activity logs...
            </Text>
          ) : sortedLogs.length === 0 ? (
            <Text textAlign="center" color={colors.time}>
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
                        <Box w="2px" h="50px" bg={colors.border} />
                      )}
                    </VStack>

                    <Box
                      flex="1"
                      bg={colors.card}
                      borderWidth="1px"
                      borderColor={colors.border}
                      borderRadius="xl"
                      p={4}
                      boxShadow="sm"
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

        <ModalFooter
          position="sticky"
          bottom="0"
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
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
