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
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaPen, FaUserCircle } from "react-icons/fa";
import LeadDetails from "./LeadDetails";
import LeadNotesModal from "./components/lead-note/LeadNotesModal";
import { useState } from "react";
import { buttonStyle } from "utils/btn";

const LeadsModal = ({ leadsModal, onClose, reFreshData, isInLeadPool }) => {
  const [leadNotes, setLeadNotes] = useState(false);

  // header bg uses your theme token 'brand'
  const headerBg = useColorModeValue("brand.600", "brand.700");
  const headerText = useColorModeValue("white", "gray.100");

  return (
    <Modal onClose={onClose} isOpen={leadsModal.isOpen} size="6xl" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.6)" backdropFilter="blur(6px)" />
      <ModalContent
        m="3"
        bg={headerBg}
        color={headerText}
        borderRadius="2xl"
        shadow="2xl"
        overflow="hidden"
      >
        <ModalHeader px="4" py="4">
          <Flex justify="space-between" align="center" mt={8}>
            <HStack spacing="3" align="center">
              <Icon as={FaUserCircle} boxSize={6} color="white" />
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                Lead Details
              </Text>
            </HStack>

            <Button
              {...buttonStyle}
              bg="whiteAlpha.200"
              color="white"
              _hover={{ bg: "whiteAlpha.300" }}
              size="sm"
              leftIcon={<FaPen />}
              onClick={() => setLeadNotes(true)}
              aria-label="lead notes"
            >
              Lead Notes
            </Button>
          </Flex>
        </ModalHeader>

        <ModalCloseButton color="white" _focus={{ outline: "none" }} />

        <Box
          bg="white"
          color="gray.800"
          p={5}
          borderTopRadius="2xl"
          maxH="85vh"
          overflowY="auto"
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
