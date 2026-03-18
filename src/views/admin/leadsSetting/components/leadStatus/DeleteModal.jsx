import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormControl,
  FormLabel,
  Select,
  Badge,
  useColorModeValue,
  Divider,
  Heading,
  VStack,
  HStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { InfoIcon, WarningIcon } from "@chakra-ui/icons";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  itemName,
  mainStatusName,
  itemType = "status",
  availableReplacements = [],
  isLoading = false,
  confirmText = "Delete",
  cancelText = "Cancel",
  warningType = "warning", // 'warning', 'error', 'info'
}) => {
  const [selectedReplacementId, setSelectedReplacementId] = useState("");

  // All useColorModeValue hooks must be at the top level
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.700", "gray.200");

  // Colors for the replacement section
  const replacementBorderColor = useColorModeValue("blue.200", "blue.700");
  const replacementBg = useColorModeValue("blue.50", "blue.900");
  const replacementIconBg = useColorModeValue("blue.100", "blue.800");
  const replacementTextColor = useColorModeValue("blue.700", "blue.200");

  // Select dropdown colors
  const selectBg = useColorModeValue("white", "gray.800");
  const selectBorderColor = useColorModeValue("gray.200", "gray.600");

  // Colors for the warning icon background based on warning type
  const getWarningBg = () => {
    switch (warningType) {
      case "error":
        return "red";
      case "info":
        return "blue";
      default:
        return "orange";
    }
  };

  const warningColor = getWarningBg();
  const warningBg = useColorModeValue(
    `${warningColor}.50`,
    `${warningColor}.900`,
  );

  const hasReplacements =
    availableReplacements && availableReplacements.length > 0;

  // In DeleteConfirmationModal.jsx, make sure the onConfirm is called with the selectedReplacementId
  const handleConfirm = () => {
    onConfirm(selectedReplacementId);
  };
  const getWarningIcon = () => {
    switch (warningType) {
      case "error":
        return <WarningIcon color="red.500" boxSize={5} />;
      case "info":
        return <InfoIcon color="blue.500" boxSize={5} />;
      default:
        return <WarningIcon color="orange.500" boxSize={5} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
      closeOnOverlayClick={false}
      blockScrollOnMount={false}
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader
          borderBottomWidth="1px"
          borderBottomColor={borderColor}
          display="flex"
          alignItems="center"
          gap={3}
          py={4}
        >
          <Flex bg={warningBg} p={2} borderRadius="full">
            {getWarningIcon()}
          </Flex>
          <Heading size="md" color={headingColor}>
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} />

        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            {/* Main warning message */}
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb={2}>
                You are about to delete this {itemType}
              </Text>
              <Flex align="center" wrap="wrap" gap={2}>
                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                  textTransform="none"
                >
                  {itemName}
                </Badge>
                {mainStatusName && (
                  <>
                    <Text color={textColor}>in</Text>
                    <Badge
                      colorScheme="teal"
                      fontSize="md"
                      px={3}
                      py={1}
                      borderRadius="full"
                      textTransform="none"
                    >
                      {mainStatusName}
                    </Badge>
                  </>
                )}
              </Flex>
            </Box>

            <Divider borderColor={borderColor} />

            {/* Impact warning */}
            <Box>
              <Text fontWeight="semibold" color={headingColor} mb={3}>
                Impact Summary
              </Text>
              <VStack spacing={2} align="stretch">
                <HStack spacing={3}>
                  <Box w={1.5} h={1.5} borderRadius="full" bg={textColor} />
                  <Text fontSize="sm" color={textColor}>
                    All tickets associated with this {itemType} will be affected
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Box w={1.5} h={1.5} borderRadius="full" bg={textColor} />
                  <Text fontSize="sm" color={textColor}>
                    A replacement {itemType} must be selected for affected
                    tickets
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Box w={1.5} h={1.5} borderRadius="full" bg={textColor} />
                  <Text fontSize="sm" color={textColor}>
                    Historical data and reports may be impacted
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Divider borderColor={borderColor} />

            {/* Replacement selection */}
            {hasReplacements ? (
              <Box
                borderWidth="1px"
                borderColor={replacementBorderColor}
                borderRadius="lg"
                bg={replacementBg}
                p={5}
              >
                <HStack mb={4}>
                  <Flex bg={replacementIconBg} p={1.5} borderRadius="md">
                    <InfoIcon color="blue.500" boxSize={4} />
                  </Flex>
                  <Text
                    fontWeight="semibold"
                    color={replacementTextColor}
                    fontSize="sm"
                  >
                    REQUIRED ACTION
                  </Text>
                </HStack>

                <FormControl isRequired>
                  <FormLabel fontWeight="medium" fontSize="sm">
                    Select replacement {itemType}
                  </FormLabel>
                  <Select
                    placeholder={`Choose a ${itemType} to replace "${itemName}"...`}
                    value={selectedReplacementId}
                    onChange={(e) => setSelectedReplacementId(e.target.value)}
                    bg={selectBg}
                    borderColor={selectBorderColor}
                    _hover={{ borderColor: "blue.400" }}
                    _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
                    mb={2}
                  >
                    {availableReplacements.map((item) => {
                      console.log("Available replacement item:", item); // Debug log to check the structure of replacement items
                      return (
                        <option key={item._id} value={item._id}>
                          {item.label}{" "}
                          {item.mainStatus ? `(${item.mainStatus.label})` : ""}
                        </option>
                      );
                    })}
                  </Select>
                  <Text fontSize="sm" color="gray.500">
                    All tickets using "{itemName}" will be automatically updated
                    to use the selected replacement
                  </Text>
                </FormControl>
              </Box>
            ) : (
              <Alert
                status="error"
                variant="subtle"
                borderRadius="lg"
                flexDirection="column"
                alignItems="flex-start"
                p={5}
              >
                <Flex mb={3}>
                  <AlertIcon />
                  <AlertTitle ml={2}>Cannot Delete This {itemType}</AlertTitle>
                </Flex>
                <AlertDescription fontSize="sm">
                  <Text mb={2}>
                    There are no alternative {itemType}s available in the{" "}
                    <Badge colorScheme="teal" px={2} py={0.5} mx={1}>
                      {mainStatusName}
                    </Badge>{" "}
                    category to replace this one.
                  </Text>
                  <Text>
                    To proceed with deletion, first create another {itemType} in
                    this category, then try again.
                  </Text>
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter
          borderTopWidth="1px"
          borderTopColor={borderColor}
          gap={3}
          py={4}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            isDisabled={isLoading}
            size="md"
          >
            {cancelText}
          </Button>
          <Button
            colorScheme={warningColor}
            onClick={handleConfirm}
            isLoading={isLoading}
            isDisabled={!hasReplacements || !selectedReplacementId}
            leftIcon={<WarningIcon />}
            size="md"
            px={6}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  itemName: PropTypes.string,
  mainStatusName: PropTypes.string,
  itemType: PropTypes.string,
  availableReplacements: PropTypes.array,
  isLoading: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  warningType: PropTypes.string,
};

export default DeleteConfirmationModal;
