import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Box,
  Text,
  Flex,
  useColorModeValue,
  ModalCloseButton,
} from '@chakra-ui/react';

const MessageViewModal = ({ title, message, isOpen, onClose }) => {
  const headerBg = useColorModeValue('brand.300', 'brand.100');
  const headerText = useColorModeValue('brand.700', 'brand.900');
  const footerBg = useColorModeValue('gray.50', 'gray.700');
  const bodyBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay backdropFilter="blur(3px)" />
      <ModalContent
        mx="2"
        borderRadius="2xl"
        bg={bodyBg}
        shadow="2xl"
        overflow="hidden"
      >
        {/* Header */}
        <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
          <Flex
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            align="center"
            position="sticky"
            top="0"
            zIndex="10"
            boxShadow="md"
          >
            <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
              {title}
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: 'whiteAlpha.200' }}
            />
          </Flex>
        </ModalHeader>

        {/* Body */}
        <ModalBody p={6}>
          <Box
            border="none"
            outline="none"
            bg="softGray.100"
            py="2"
            px="3"
            rounded="md"
            overflowY="auto"
            scrollBehavior="smooth"
            shadow="sm"
            minH="100px"
            maxH="400px"
          >
            <Text
              as="pre"
              fontSize={{ base: 'sm', md: 'md' }}
              whiteSpace="pre-wrap"
              overflowWrap="break-word"
              wordBreak="break-word"
              fontFamily="DM Sans, sans-serif"
            >
              {message}
            </Text>
          </Box>
        </ModalBody>

        {/* Footer */}
        <ModalFooter
          bg={footerBg}
          borderTop="1px solid"
          borderColor={borderColor}
          py={3}
          px={6}
          justifyContent="flex-end"
        >
          <Button onClick={onClose} variant='outline' colorScheme="gray" borderRadius="md">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MessageViewModal;
