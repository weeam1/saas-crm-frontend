import React, { useState } from "react";
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
  Badge,
  Divider,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SharedDetailModal = ({ isOpen, onClose, call }) => {
  const recordingId = call?.uniqueid;

  const brandColor = useColorModeValue("brand.600", "brand.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgCard = useColorModeValue("gray.50", "gray.700");
  const hoverEffect = useColorModeValue("gray.100", "gray.600");

  const { data: sharedData, isLoading, refetch } = useFetchItemsQuery(
    { path: `/sipSetting/sharedSipRecording/${recordingId}` },
    { skip: !isOpen || !recordingId, refetchOnMountOrArgChange: true }
  );

  const [createItemMutation] = useCreateItemMutation();
  const [loadingUserId, setLoadingUserId] = useState(null);

  const updateAccess = async (userId) => {
    try {
      setLoadingUserId(userId);
      const target = sharedData?.data?.find((u) => u.sharedWith?._id === userId);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
       <ModalContent borderRadius="2xl" overflow="hidden" maxH="85vh">
        <ModalHeader bg={brandColor} color="white" fontWeight="semibold" fontSize="lg">
          Shared Recording Detail
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody py={5} px={6} bg={bgCard}>
          {isLoading ? (
            <VStack py={10}>
              <Spinner size="lg" />
              <Text color="gray.500">Loading...</Text>
            </VStack>
          ) : sharedList.length === 0 ? (
            <Text textAlign="center" color="gray.500">
              No shared records found
            </Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {/* Recording Info */}
              <Box p={3} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
                <Text fontSize="sm" color="gray.500">
                  Recording ID
                </Text>
                <Text fontWeight="bold" color={brandColor}>
                  {sharedList[0]?.recordingId}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {sharedList[0]?.callData?.src} → {sharedList[0]?.callData?.dst}
                </Text>
              </Box>

              <Divider />

              {/* Shared Users */}
              <Text fontWeight="600" fontSize="md" color={brandColor}>
                Shared With ({sharedList.length})
              </Text>

              {sharedList.map((item) => (
                <Box
                  key={item._id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  _hover={{ bg: hoverEffect }}
                  transition="0.2s ease"
                >
                  <HStack justify="space-between" align="start">
                    <HStack>
                      <Avatar
                        size="sm"
                        name={item.sharedWith?.fullName}
                        bg={brandColor}
                        color="white"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="600">{item.sharedWith?.fullName}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {item.sharedWith?.agency?.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Shared on: {new Date(item.sharedAt).toLocaleString()}
                        </Text>
                      </VStack>
                    </HStack>

                    <VStack spacing={2}>
                      <Badge
                        colorScheme={item.active ? "green" : "gray"}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {item.active ? "Shared" : "Un Shared"}
                      </Badge>

                      <Button
                        size="xs"
                        colorScheme={item.active ? "red" : "green"}
                        onClick={() => updateAccess(item.sharedWith?._id)}
                        isLoading={loadingUserId === item.sharedWith?._id}
                        borderRadius="md"
                      >
                        {item.active ? "Shared" : "Un Shared"}
                      </Button>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>

        <ModalFooter bg={bgCard}>
          <Button
            onClick={onClose}
            variant="outline"
            borderColor={brandColor}
            color={brandColor}
            _hover={{ bg: useColorModeValue("brand.50", "gray.600") }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SharedDetailModal;
