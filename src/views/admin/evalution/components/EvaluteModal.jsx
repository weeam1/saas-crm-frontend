import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";
import { toast } from "react-toastify";

const EvaluteModal = ({ isOpen, onClose, user, onSave }) => {
  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();
  const [avg, setAvg] = useState(user.Avg);
  const [feedback, setFeedback] = useState("");
  const [date, setDate] = useState("");

  const handleSave = () => {
    if (!avg || !feedback) {
      toast.info("Missing Fields");
      return;
    }

    onSave({ ...user, Avg: avg, feedback, date });
    toast.success("Evaluation Saved");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay backdropFilter="blur(3px)"/>
      <ModalContent
        mx="auto"
        boxShadow="lg"
        m="2"
        borderRadius="2xl"
        bg={bg}
        shadow="2xl"
        overflow="hidden"
        maxH="85vh"
        display="flex"
        flexDirection="column"
      >
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
            Evaluate: {user.Role}
          </Text>

          <ModalCloseButton aria-label="Close" position="static" />
        </Flex>

        <ModalBody
          overflowY="auto"
          scrollBehavior="smooth"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "10px",
            },
          }}
        >
          <FormControl mb={3}>
            <FormLabel>Average Score</FormLabel>
            <Input
              type="number"
              value={avg}
              onChange={(e) => setAvg(Number(e.target.value))}
              placeholder="Enter new average score"
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Feedback</FormLabel>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write feedback..."
            />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
        </ModalBody>

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
          gap={3}
        >
          <Button
            variant="outline"
            size="sm"
            borderRadius={"md"}
            mr={3}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            size="sm"
            borderRadius={"md"}
            onClick={handleSave}
          >
            Save Evaluation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EvaluteModal;
