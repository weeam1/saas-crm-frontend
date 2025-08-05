import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Flex,
  Avatar,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

const capitalizeFirstLetter = (str) => {
  if (!str) return "N/A";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ContactDetailsModal = ({
  isOpen,
  onClose,
  contacts,
  developerName,
  developerImageUrl,
}) => {
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent maxH="80vh" overflow="hidden">
        <ModalHeader>
          <Flex align="center" gap={4} mt={1}>
            <Avatar
              size="md"
              name={capitalizeFirstLetter(developerName)}
              src={developerImageUrl || ""}
            />
            <Text
              fontWeight="bold"
              fontSize={{ base: "md", md: "lg" }}
              isTruncated
              maxW="70%"
            >
              {capitalizeFirstLetter(developerName)}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">
          {contacts?.length > 0 ? (
            contacts.map((contact, index) => (
              <Box key={contact._id || index} mb={4}>
                <Flex align="center" gap={3}>
                  <Box>
                    <Text fontSize="xs" color={textColor}>
                      {capitalizeFirstLetter(contact.role)}
                    </Text>
                    <Text fontWeight="bold" fontSize="md">
                      {capitalizeFirstLetter(contact.name)}
                    </Text>
                    <Text fontSize="md" color={textColor}>
                      {contact.phoneNumber}
                    </Text>
                    {contact.email && (
                      <Text fontSize="sm" color={textColor}>
                        {contact.email.toLowerCase()}
                      </Text>
                    )}
                  </Box>
                </Flex>
                {index < contacts.length - 1 && <Divider my={3} />}
              </Box>
            ))
          ) : (
            <Text>No contact details available</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContactDetailsModal;
