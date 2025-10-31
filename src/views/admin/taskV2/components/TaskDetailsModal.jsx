import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Flex,
  Button,
  Badge,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";

// Priority and status color maps
const priorityColors = {
  Low: "green",
  Medium: "yellow",
  High: "orange",
  Urgent: "red",
};

const statusColors = {
  Pending: "yellow",
  "In Progress": "blue",
  Completed: "green",
  Overdue: "red",
};

const TaskDetailsModal = ({ isOpen, onClose, task }) => {

  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent
        mx={{ base: 3, sm: 6 }}
        borderRadius="2xl"
        shadow="2xl"
        bg={bgColor}
        maxH="85vh"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Sticky Header */}
        <Flex
          align="center"
          justify="space-between"
          bg={headerBg}
          color={headerText}
          px={6}
          py={3}
          borderBottom="1px solid"
          borderColor={borderColor}
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Text fontSize="lg" fontWeight="bold">
            Task Details
          </Text>
          <ModalCloseButton position="static" />
        </Flex>

        {/* Scrollable Body */}
        <ModalBody
          p={5}
          overflowY="auto"
          maxH="65vh"
          scrollBehavior="smooth"
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "10px",
            },
          }}
        >
          <VStack spacing={5}>
            {/* Title */}
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={task.title || ""} isReadOnly bg={inputBg} />
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={task.description || ""}
                isReadOnly
                bg={inputBg}
                minH="120px"
              />
            </FormControl>

            {/* Due Date & Priority */}
            <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
              <FormControl>
                <FormLabel>Due Date</FormLabel>
                <Input
                  value={
                    task.due_date
                      ? format(new Date(task.due_date), "MMM d, yyyy")
                      : "N/A"
                  }
                  isReadOnly
                  bg={inputBg}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Badge
                  colorScheme={priorityColors[task.priority] || "gray"}
                  p={2}
                  w="100%"
                  textAlign="center"
                  fontSize="md"
                  borderRadius="md"
                >
                  {task.priority || "N/A"}
                </Badge>
              </FormControl>
            </Flex>

            {/* Type & Status */}
            <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Input value={task.type || "N/A"} isReadOnly bg={inputBg} />
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Badge
                  colorScheme={statusColors[task.status] || "gray"}
                  p={2}
                  w="100%"
                  textAlign="center"
                  fontSize="md"
                  borderRadius="md"
                >
                  {task.status || "N/A"}
                </Badge>
              </FormControl>
            </Flex>

            {/* Assigned To & Assigned By */}
            <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
              <FormControl>
                <FormLabel>Assigned To</FormLabel>
                <Input
                  value={task.assigned_to?.fullName || "N/A"}
                  isReadOnly
                  bg={inputBg}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Assigned By</FormLabel>
                <Input
                  value={task.assigned_by?.fullName || "N/A"}
                  isReadOnly
                  bg={inputBg}
                />
              </FormControl>
            </Flex>

            {/* Created At */}
            <FormControl>
              <FormLabel>Created At</FormLabel>
              <Input
                value={
                  task.createdAt
                    ? format(new Date(task.createdAt), "MMM d, yyyy h:mm a")
                    : "N/A"
                }
                isReadOnly
                bg={inputBg}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        {/* Sticky Footer */}
        <ModalFooter
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
          position="sticky"
          bottom="0"
          zIndex="10"
          py={3}
          px={5}
          justifyContent="flex-end"
        >
          <Button variant="outline" onClick={onClose} size="md" borderRadius={"md"}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;
