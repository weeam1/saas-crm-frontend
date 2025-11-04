import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  Flex,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import LeadDetails from "./LeadDetails";
import { buttonStyle } from "utils/btn";
import LeadNotesModal from "./components/lead-note/LeadNotesModal";
import { useState } from "react";
import { FaPen } from "react-icons/fa";

const LeadsModal = ({ leadsModal, onClose, reFreshData, isInLeadPool }) => {
  const [leadNotes, setLeadNotes] = useState(false);

  return (
    <Modal onClose={onClose} isOpen={leadsModal.isOpen} size="6xl" isCentered>
      <ModalOverlay />

      <ModalContent m="2">
        <ModalHeader>
          <Flex justify="space-between" align="center" pt="5">
            <HStack
              gap="1"
              color="gray.800"
              fontSize={{ base: "xs", md: "sm", lg: "md" }}
              fontWeight="600"
              px="1"
              mt="5"
            >
              <Text> Lead Details</Text>
            </HStack>
            <Button
              {...buttonStyle}
              variant="solid"
              bg="softGray.100"
              color="gray.800"
              py="1"
              px="3"
              leftIcon={<FaPen />}
              aria-label="lead notes"
              onClick={() => setLeadNotes(true)}
            >
              Lead Notes
            </Button>
          </Flex>
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: "none" }} />
        <Box
          p={4}
          maxH={{ base: "80vh", md: "80vh", lg: "90vh" }}
          overflow="scroll"
          scrollBehavior="smooth"
        >
          <LeadDetails
            leadId={leadsModal.lid}
            isInLeadPool={isInLeadPool}
            reFreshData={reFreshData}
          />

          {leadNotes && (
            <LeadNotesModal
              leadId={leadsModal.lid}
              isOpen={leadNotes}
              onClose={() => setLeadNotes(false)}
            />
          )}
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default LeadsModal;
