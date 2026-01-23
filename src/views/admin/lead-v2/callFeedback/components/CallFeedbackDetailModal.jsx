import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  Grid,
  GridItem,
  useColorModeValue,
  Icon,
  Divider,
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
  FaDownload,
  FaCheck,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const CallFeedbackModal = ({ isOpen, onClose, feedback }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue(
    "linear-gradient(135deg, #2c3e50, #4a6491)",
    "linear-gradient(135deg, #1a202c, #2d3748)",
  );
  const infoBg = useColorModeValue("#f8f9fa", "gray.700");
  const highlightBg = useColorModeValue("#fffde7", "yellow.300");
  const highlightBorder = useColorModeValue("#fff9c4", "yellow.700");
  const borderColor = useColorModeValue("#eaeaea", "gray.600");
  const getQualityStyles = (quality) => {
    switch (quality) {
      case "excellent":
        return { bg: "#e8f5e9", color: "#2e7d32" }; // green
      case "good":
        return { bg: "#e3f2fd", color: "#1565c0" }; // blue
      case "average":
        return { bg: "#fffde7", color: "#f57f17" }; // yellow
      case "bad":
        return { bg: "#fff3e0", color: "#ef6c00" }; // orange
      case "very_bad":
        return { bg: "#ffebee", color: "#c62828" }; // red
      default:
        return { bg: "#f4f6f8", color: "#555" }; // neutral
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
  const issueBg = useColorModeValue("#f9fafb", "gray.700"); // very light gray
  const issueBorder = useColorModeValue("#e5e7eb", "gray.500");

  const descriptionBg = useColorModeValue("#f8fafc", "gray.700"); // soft light
  const descriptionBorder = useColorModeValue("#e2e8f0", "gray.600");

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
      bg="rgba(0, 0, 0, 0.5)"
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
        bg={bgColor}
        borderRadius="12px"
        boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)"
        overflow="hidden"
        animation="fadeIn 0.4s ease-out"
      >
        {/* Header */}
        <Box bg={headerBg} color="white" px={6} py="3" position="relative">
          <Flex justify="space-between" align="center" mb={2}>
            <Flex align="center">
              <Icon as={FaHeadset} mr={3} fontSize="24px" />
              <Text fontSize="24px" fontWeight="600">
                Call Feedback
              </Text>
            </Flex>
            <Button
              bg="rgba(255, 255, 255, 0.2)"
              border="none"
              w="36px"
              h="36px"
              borderRadius="50%"
              color="white"
              fontSize="18px"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                bg: "rgba(255, 255, 255, 0.3)",
                transform: "rotate(90deg)",
              }}
              onClick={onClose}
              minW="36px"
              p={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaTimes} />
            </Button>
          </Flex>
          <Text fontSize="15px" opacity="0.9" mt={1}>
            Call ID: EX{feedback.userExtensionId}
          </Text>
        </Box>

        {/* Body */}
        <Box px="6" pt="3" pb="6" overflowY="auto" maxH="calc(85vh - 120px)">
          <Stack spacing={8}>
            {/* Quality Assessment */}
            <Box>
              <Flex align="center" mb={4}>
                <Text fontSize="28px" fontWeight="700" color="#2c3e50" mr={4}>
                  {rating}.0
                </Text>

                <Flex>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={FaStar}
                      fontSize="20px"
                      mr={1}
                      color={star <= rating ? "#ffc107" : "#ddd"}
                    />
                  ))}
                </Flex>
              </Flex>

              {/* <Stack direction="row" spacing={3} flexWrap="wrap">
                <Badge
                  display="inline-flex"
                  alignItems="center"
                  px={4}
                  py={2}
                  borderRadius="20px"
                  fontWeight="500"
                  fontSize="14px"
                  bg={qualityStyles.bg}
                  color={qualityStyles.color}
                >
                  <Icon as={FaCheckCircle} mr={2} />
                  {feedback?.callQuality?.toUpperCase() || "Good"} Quality
                </Badge>

                <Badge
                  display="inline-flex"
                  alignItems="center"
                  px={4}
                  py={2}
                  borderRadius="20px"
                  fontWeight="500"
                  fontSize="14px"
                  bg="#fff3e0"
                  color="#ef6c00"
                >
                  <Icon as={FaExclamationTriangle} mr={2} />
                  {feedback?.reason || "No Issues Reported"}
                </Badge>
              </Stack> */}
              <VStack align="stretch" spacing={3}>
                {/* Quality Badge */}
                <HStack>
                  <Badge
                    display="inline-flex"
                    alignItems="center"
                    px={4}
                    py={2}
                    borderRadius="20px"
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

                {/* Issue / Reason (Next line, full width) */}
                <Box>
                  <Text fontSize="13px" color="gray.500" mb={1}>
                    Issue
                  </Text>

                  <Box
                    p={3}
                    bg="#fdf7eeff"
                    color="#ee9d5aff"
                    borderRadius="8px"
                    fontSize="14px"
                    lineHeight="1.5"
                    borderLeft="4px solid #fab983ff"
                    noOfLines={2}
                  >
                    {feedback?.reason || "No issues reported"}
                  </Box>
                </Box>
              </VStack>
            </Box>

            {/* Account Details */}
            <Box>
              <Flex align="center" mb={1} pb={2}>
                <Icon as={FaUserCircle} mr={3} color="#4a6491" />
                <Text fontSize="16px" fontWeight="600" color="#2c3e50">
                  User Details
                </Text>
              </Flex>

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    UserName
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.user?.fullName}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Email
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.user?.username}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Role
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.user?.roles[0].roleName}
                  </Box>
                </Box>
              </Grid>
            </Box>

            {/* Call Information */}
            <Box>
              <Flex align="center" mb={1} pb={2}>
                <Icon as={FaPhoneAlt} mr={3} color="#4a6491" />
                <Text fontSize="16px" fontWeight="600" color="#2c3e50">
                  Call Information
                </Text>
              </Flex>

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Created
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {formatDateTime(feedback?.createdAt)}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Medium
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {CALL_MEDIUM_LABELS[feedback?.callMedium] || "-"}
                  </Box>
                </Box>

                {/* <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Call Type
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback.callMedium}
                  </Box>
                </Box> */}

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Lead
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
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
                borderRadius="8px"
                border={`1px solid #fdf9edff`}
                bg={"#fffeefff"}
              >
                <Flex align="center" mb={3}>
                  <Icon as={FaFileAlt} mr={2} color="#ff9800" />
                  <Text fontWeight="600" color="#5d4037">
                    Call Description
                  </Text>
                </Flex>
                <Text>{feedback?.description}</Text>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Footer Actions
    <Flex
      justify="flex-end"
      p={6}
      borderTop={`1px solid ${borderColor}`}
      bg="#fafbfc"
    >
      <Button
        bg="#f0f0f0"
        color="#555"
        mr={3}
        px={6}
        py={2}
        borderRadius="6px"
        fontWeight="500"
        fontSize="15px"
        _hover={{ bg: "#e0e0e0" }}
        leftIcon={<Icon as={FaDownload} />}
      >
        Export Details
      </Button>
      <Button
        bg="#4a6491"
        color="white"
        px={6}
        py={2}
        borderRadius="6px"
        fontWeight="500"
        fontSize="15px"
        _hover={{ bg: "#3a5479" }}
        leftIcon={<Icon as={FaCheck} />}
      >
        Mark as Reviewed
      </Button>
    </Flex> */}
      </Box>
    </Box>
  );
};

export default CallFeedbackModal;
