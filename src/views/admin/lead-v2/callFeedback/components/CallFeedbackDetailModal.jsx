import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  Grid,
  GridItem,
  Icon,
  Stack,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  FaHeadset,
  FaStar,
  FaUserCircle,
  FaPhoneAlt,
  FaFileAlt,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { useModalColors } from "hooks/useModalColors";

const CallFeedbackModal = ({ isOpen, onClose, feedback }) => {
  const {
    bg,
    bgDeep,
    bodyText,
    headingText,
    mutedText,
    borderColor,
    modalShadow,
    closeBtnColor,
    closeBtnBg,
    closeBtnHoverBg,
    accentGold,
    badgeInfoBg,
    badgeInfoText,
    badgeSuccessBg,
    badgeSuccessText,
    badgeErrorBg,
    badgeErrorText,
    badgeWarningBg,
    badgeWarningText,
  } = useModalColors();

  const getQualityStyles = (quality) => {
    switch (quality) {
      case "excellent":
        return { bg: badgeSuccessBg, color: badgeSuccessText };
      case "good":
        return { bg: badgeInfoBg, color: badgeInfoText };
      case "average":
        return { bg: badgeWarningBg, color: badgeWarningText };
      case "bad":
        return { bg: badgeErrorBg, color: badgeErrorText };
      case "very_bad":
        return { bg: badgeErrorBg, color: badgeErrorText };
      default:
        return { bg: bgDeep, color: bodyText };
    }
  };

  const qualityStyles = getQualityStyles(feedback?.callQuality);

  const getRatingFromQuality = (quality) => {
    switch (quality) {
      case "excellent":
        return 5;
      case "good":
        return 4;
      case "average":
        return 3;
      case "bad":
        return 2;
      case "very_bad":
        return 1;
      default:
        return 3;
    }
  };

  const rating = getRatingFromQuality(feedback?.callQuality);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const CALL_MEDIUM_LABELS = {
    external_sim: "External SIM",
    whatsapp: "WhatsApp",
    dialer: "Dialer",
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="bg.overlay"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
      zIndex={1000}
    >
      <Box
        w="100%"
        maxW="650px"
        maxH="85vh"
        bg={bg}
        borderRadius="xl"
        boxShadow={modalShadow}
        overflow="hidden"
      >
        {/* Header - VIEW MODAL: Navy header, not gold */}
        <Box bg="bg.elevated" color="text.heading" px={6} py="3" position="relative">
          <Flex justify="space-between" align="center" mb={2}>
            <Flex align="center">
              <Icon as={FaHeadset} color="text.heading" mr={3} fontSize="24px" />
              <Text fontSize="24px" color="text.heading" fontWeight="600">
                Call Feedback
              </Text>
            </Flex>
            <Button
              bg={closeBtnBg}
              w="36px"
              h="36px"
              borderRadius="full"
              color={closeBtnColor}
              onClick={onClose}
              _hover={{ bg: closeBtnHoverBg, transform: "rotate(90deg)" }}
              transition="all 0.2s"
              minW="36px"
              p={0}
            >
              <Icon as={FaTimes} />
            </Button>
          </Flex>
          <Text fontSize="15px" opacity="0.9" mt={1}>
            Call ID: EX{feedback.userExtensionId}
          </Text>
        </Box>

        {/* Body */}
        <Box px="6" pt="3" pb="6" overflowY="auto" maxH="calc(85vh - 120px)" bg={bgDeep}>
          <Stack spacing={8}>
            {/* Quality Assessment */}
            <Box>
              <Flex align="center" mb={4}>
                <Text fontSize="28px" fontWeight="700" color={headingText} mr={4}>
                  {rating}.0
                </Text>
                <Flex>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={FaStar}
                      fontSize="20px"
                      mr={1}
                      color={star <= rating ? accentGold : mutedText}
                    />
                  ))}
                </Flex>
              </Flex>

              <VStack align="stretch" spacing={3}>
                <HStack>
                  <Badge
                    display="inline-flex"
                    alignItems="center"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontWeight="500"
                    fontSize="14px"
                    bg={qualityStyles.bg}
                    color={qualityStyles.color}
                  >
                    <Icon as={FaCheckCircle} mr={2} />
                    {feedback?.callQuality?.toUpperCase() || "GOOD"} Quality
                  </Badge>
                  <Box>
                    <Badge
                      colorScheme="blue"
                      variant="subtle"
                      size="xs"
                      fontSize="14px"
                    >
                      Lead ID {feedback?.lead?.intID}
                    </Badge>
                  </Box>
                </HStack>

                <Box>
                  <Text fontSize="13px" color={mutedText} mb={1}>
                    Issue
                  </Text>
                  <Box
                    p={3}
                    bg={badgeWarningBg}
                    color={badgeWarningText}
                    borderRadius="lg"
                    fontSize="14px"
                    lineHeight="1.5"
                    borderLeft="4px solid"
                    borderLeftColor={accentGold}
                  >
                    {feedback?.reason || "No issues reported"}
                  </Box>
                </Box>
              </VStack>
            </Box>

            {/* Account Details */}
            <Box>
              <Flex align="center" mb={1} pb={2}>
                <Icon as={FaUserCircle} mr={3} color={accentGold} />
                <Text fontSize="16px" fontWeight="600" color={headingText}>
                  User Details
                </Text>
              </Flex>

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Box>
                  <Text fontSize="13px" color={mutedText} mb={1}>
                    UserName
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color={bodyText}
                    p={2}
                    bg={bg}
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderLeftColor={accentGold}
                  >
                    {feedback?.user?.fullName}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color={mutedText} mb={1}>
                    Email
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color={bodyText}
                    p={2}
                    bg={bg}
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderLeftColor={accentGold}
                  >
                    {feedback?.user?.username}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color={mutedText} mb={1}>
                    Role
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color={bodyText}
                    p={2}
                    bg={bg}
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderLeftColor={accentGold}
                  >
                    {feedback?.user?.roles[0].roleName}
                  </Box>
                </Box>
              </Grid>
            </Box>

            {/* Call Information */}
            <Box>
              <Flex align="center" mb={1} pb={2}>
                <Icon as={FaPhoneAlt} mr={3} color={accentGold} />
                <Text fontSize="16px" fontWeight="600" color={headingText}>
                  Call Information
                </Text>
              </Flex>

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Box>
                  <Text fontSize="13px" color={mutedText} mb={1}>
                    Created
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color={bodyText}
                    p={2}
                    bg={bg}
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderLeftColor={accentGold}
                  >
                    {formatDateTime(feedback?.createdAt)}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color={mutedText} mb={1}>
                    Medium
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color={bodyText}
                    p={2}
                    bg={bg}
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderLeftColor={accentGold}
                  >
                    {CALL_MEDIUM_LABELS[feedback?.callMedium] || "-"}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color={mutedText} mb={1}>
                    Lead
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color={bodyText}
                    p={2}
                    bg={bg}
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderLeftColor={accentGold}
                  >
                    {feedback?.lead?.leadName || "Unknown Lead"}
                  </Box>
                </Box>
              </Grid>
            </Box>

            {/* Call Description */}
            <Box>
              <Box
                p={5}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                bg={bg}
              >
                <Flex align="center" mb={3}>
                  <Icon as={FaFileAlt} mr={2} color={accentGold} />
                  <Text fontWeight="600" color={headingText}>
                    Call Description
                  </Text>
                </Flex>
                <Text color={bodyText}>{feedback?.description}</Text>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CallFeedbackModal;