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
  Box,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";

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
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent mx={{ base: 4, sm: 6 }}>
        <ModalHeader>Task Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="60vh" overflowY="auto">
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={task.title || ""} isReadOnly bg="gray.50" />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={task.description || ""}
                isReadOnly
                bg="gray.50"
                minH="120px"
              />
            </FormControl>

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
                  bg="gray.50"
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
                >
                  {task.priority || "N/A"}
                </Badge>
              </FormControl>
            </Flex>

            <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Input value={task.type || "N/A"} isReadOnly bg="gray.50" />
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Badge
                  colorScheme={statusColors[task.status] || "gray"}
                  p={2}
                  w="100%"
                  textAlign="center"
                  fontSize="md"
                >
                  {task.status || "N/A"}
                </Badge>
              </FormControl>
            </Flex>

            <Flex gap={4} w="100%" flexDirection={{ base: "column", md: "row" }}>
              <FormControl>
                <FormLabel>Assigned To</FormLabel>
                <Input
                  value={task.assigned_to?.fullName || "N/A"}
                  isReadOnly
                  bg="gray.50"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Assigned By</FormLabel>
                <Input
                  value={task.assigned_by?.fullName || "N/A"}
                  isReadOnly
                  bg="gray.50"
                />
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel>Created At</FormLabel>
              <Input
                value={
                  task.createdAt
                    ? format(new Date(task.createdAt), "MMM d, yyyy h:mm a")
                    : "N/A"
                }
                isReadOnly
                bg="gray.50"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;