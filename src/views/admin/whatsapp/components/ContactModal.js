import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Flex,
  Text,
  Avatar,
  IconButton,
  Box
} from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

const ContactModal = ({
  isOpen,
  onClose,
  contacts,
  onUpdateContact,
  onDeleteContact,
  onAddContact,
}) => {
  const [editingContact, setEditingContact] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setEmail(contact.email || "");
    setPhone(contact.phone || "");
  };

  const handleUpdate = () => {
    if (name.trim() && editingContact) {
      onUpdateContact(editingContact.id, { name, email, phone });
      setEditingContact(null);
      setName("");
      setEmail("");
      setPhone("");
    }
  };

  const handleAddContact = () => {
    if (name.trim()) {
      onAddContact({ name, email, phone });
      setIsAdding(false);
      setName("");
      setEmail("");
      setPhone("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Contacts</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isAdding ? (
            <Box>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  type="email"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  type="tel"
                />
              </FormControl>
              <Flex justify="flex-end">
                <Button mr={2} onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button colorScheme="whatsapp" onClick={handleAddContact}>
                  Add Contact
                </Button>
              </Flex>
            </Box>
          ) : editingContact ? (
            <Box>
              <FormControl mb={4}>
                <FormLabel>Edit Contact Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter new name"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  type="email"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  type="tel"
                />
              </FormControl>
              <Flex justify="flex-end">
                <Button mr={2} onClick={() => setEditingContact(null)}>
                  Cancel
                </Button>
                <Button colorScheme="whatsapp" onClick={handleUpdate}>
                  Save
                </Button>
              </Flex>
            </Box>
          ) : (
            <>
              <Flex justify="flex-end" mb={4}>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="whatsapp"
                  onClick={() => setIsAdding(true)}
                >
                  Add Contact
                </Button>
              </Flex>
              <VStack spacing={4} align="stretch">
                {contacts.map((contact) => (
                  <Flex key={contact.id} justify="space-between" align="center">
                    <Flex align="center">
                      <Avatar src={contact.avatar} size="sm" mr={3} />
                      <Box>
                        <Text fontWeight="medium">{contact.name}</Text>
                        {contact.email && (
                          <Text fontSize="xs" color="gray.500">
                            {contact.email}
                          </Text>
                        )}
                        {contact.phone && (
                          <Text fontSize="xs" color="gray.500">
                            {contact.phone}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                    <HStack>
                      <IconButton
                        icon={<FiEdit />}
                        aria-label="Edit contact"
                        size="sm"
                        onClick={() => handleEdit(contact)}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label="Delete contact"
                        size="sm"
                        colorScheme="red"
                        onClick={() => onDeleteContact(contact.id)}
                      />
                    </HStack>
                  </Flex>
                ))}
              </VStack>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContactModal;