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
  Divider,
  Heading,
  VStack,
  HStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { InfoIcon, WarningIcon } from "@chakra-ui/icons";
import { useModalColors } from "hooks/useModalColors";

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
  const colors = useModalColors();
  const [selectedReplacementId, setSelectedReplacementId] = useState("");

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedReplacementId("");
    }
  }, [isOpen]);

  const hasReplacements = availableReplacements && availableReplacements.length > 0;

  const handleConfirm = () => {
    onConfirm(selectedReplacementId);
  };

  const getWarningIcon = () => {
    switch (warningType) {
      case "error":
        return <WarningIcon color={colors.badgeErrorText} boxSize={5} />;
      case "info":
        return <InfoIcon color={colors.accentGold} boxSize={5} />;
      default:
        return <WarningIcon color={colors.accentGold} boxSize={5} />;
    }
  };

  const getWarningBg = () => {
    switch (warningType) {
      case "error":
        return colors.badgeErrorBg;
      case "info":
        return `rgba(212, 175, 55, 0.15)`;
      default:
        return `rgba(212, 175, 55, 0.15)`;
    }
  };

  const warningBg = getWarningBg();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
      closeOnOverlayClick={false}
      blockScrollOnMount={false}
    >
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        bg={colors.bg}
        borderRadius="xl"
        boxShadow={colors.modalShadow}
        overflow="hidden"
      >
        <ModalHeader
          bg={colors.bgDeep}
          borderBottomWidth="1px"
          borderBottomColor={colors.borderColor}
          display="flex"
          alignItems="center"
          gap={3}
          py={4}
          px={6}
        >
          <Flex bg={warningBg} p={2} borderRadius="full">
            {getWarningIcon()}
          </Flex>
          <Heading size="md" color={colors.headingText}>
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton
          color={colors.bodyText}
          top={4}
          right={4}
          _hover={{ color: colors.accentGold }}
        />

        <ModalBody py={6} px={6} bg={colors.bg}>
          <VStack spacing={5} align="stretch">
            {/* Main warning message */}
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb={2} color={colors.headingText}>
                You are about to delete this {itemType}
              </Text>
              <Flex align="center" wrap="wrap" gap={2}>
                <Badge
                  bg={`rgba(212, 175, 55, 0.15)`}
                  color={colors.accentGold}
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
                    <Text color={colors.bodyText}>in</Text>
                    <Badge
                      bg={`rgba(212, 175, 55, 0.1)`}
                      color={colors.accentGold}
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

            <Divider borderColor={colors.borderColor} />

            {/* Impact warning */}
            <Box>
              <Text fontWeight="semibold" color={colors.headingText} mb={3}>
                Impact Summary
              </Text>
              <VStack spacing={2} align="stretch">
                <HStack spacing={3}>
                  <Box w={1.5} h={1.5} borderRadius="full" bg={colors.accentGold} />
                  <Text fontSize="sm" color={colors.bodyText}>
                    All Leads associated with this {itemType} will be affected
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Box w={1.5} h={1.5} borderRadius="full" bg={colors.accentGold} />
                  <Text fontSize="sm" color={colors.bodyText}>
                    A replacement {itemType} must be selected for affected Leads
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <Box w={1.5} h={1.5} borderRadius="full" bg={colors.accentGold} />
                  <Text fontSize="sm" color={colors.bodyText}>
                    Historical data and reports may be impacted
                  </Text>
                </HStack>
              </VStack>
            </Box>

            <Divider borderColor={colors.borderColor} />

            {/* Replacement selection */}
            {hasReplacements ? (
              <Box
                borderWidth="1px"
                borderColor={colors.accentGold}
                borderRadius="lg"
                bg={`rgba(212, 175, 55, 0.08)`}
                p={5}
              >
                <HStack mb={4}>
                  <Flex bg={`rgba(212, 175, 55, 0.15)`} p={1.5} borderRadius="md">
                    <InfoIcon color={colors.accentGold} boxSize={4} />
                  </Flex>
                  <Text
                    fontWeight="semibold"
                    color={colors.accentGold}
                    fontSize="sm"
                  >
                    REQUIRED ACTION
                  </Text>
                </HStack>

                <FormControl isRequired>
                  <FormLabel fontWeight="medium" fontSize="sm" color={colors.headingText}>
                    Select replacement {itemType}
                  </FormLabel>
                  <Select
                    placeholder={`Choose a ${itemType} to replace "${itemName}"...`}
                    value={selectedReplacementId}
                    onChange={(e) => setSelectedReplacementId(e.target.value)}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`
                    }}
                    mb={2}
                  >
                    {availableReplacements.map((item) => (
                      <option key={item._id} value={item._id} style={{ background: colors.bg, color: colors.headingText }}>
                        {item.label}{" "}
                        {item.mainStatus ? `(${item.mainStatus.label})` : ""}
                      </option>
                    ))}
                  </Select>
                  <Text fontSize="sm" color={colors.mutedText}>
                    All Leads using "{itemName}" will be automatically updated
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
                bg={colors.badgeErrorBg}
              >
                <Flex mb={3}>
                  <AlertIcon color={colors.badgeErrorText} />
                  <AlertTitle ml={2} color={colors.badgeErrorText}>
                    Cannot Delete This {itemType}
                  </AlertTitle>
                </Flex>
                <AlertDescription fontSize="sm" color={colors.bodyText}>
                  <Text mb={2}>
                    There are no alternative {itemType}s available in the{" "}
                    <Badge
                      bg={`rgba(212, 175, 55, 0.15)`}
                      color={colors.accentGold}
                      px={2}
                      py={0.5}
                      mx={1}
                    >
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
          borderTopColor={colors.borderColor}
          gap={3}
          py={4}
          px={6}
          bg={colors.bgDeep}
        >
          <Button
            variant="ghost"
            onClick={onClose}
            isDisabled={isLoading}
            size="md"
            color={colors.bodyText}
            _hover={{
              bg: colors.bgInput,
              color: colors.headingText,
            }}
          >
            {cancelText}
          </Button>
          <Button
            bg={colors.accentGold}
            color={colors.headerText}
            onClick={handleConfirm}
            isLoading={isLoading}
            isDisabled={!hasReplacements || !selectedReplacementId}
            leftIcon={<WarningIcon />}
            size="md"
            px={6}
            _hover={{
              bg: colors.goldLight,
              transform: "translateY(-1px)",
              boxShadow: colors.goldGlow,
            }}
            _active={{
              bg: colors.goldDark,
              transform: "translateY(0)",
            }}
            transition="all 0.2s ease"
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