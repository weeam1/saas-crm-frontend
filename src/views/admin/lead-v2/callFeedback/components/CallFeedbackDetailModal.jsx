import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Avatar,
  Divider,
  Icon,
  Image,
  useColorModeValue,
  Tooltip,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FiPhone,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiWifi,
  FiWifiOff,
  FiStar,
  FiThumbsUp,
  FiInfo,
  FiMinus,
  FiThumbsDown,
  FiClock,
  FiHash,
} from "react-icons/fi";
import { FaSimCard, FaWhatsapp } from "react-icons/fa";
import { constant } from "constant";

const CallFeedbackDetailModal = ({ isOpen, onClose, feedback }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!feedback) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getQualityGradient = (quality) => {
    switch (quality) {
      case "excellent":
        return "linear(to-r, green.400, green.600)";
      case "good":
        return "linear(to-r, blue.400, blue.600)";
      case "average":
        return "linear(to-r, yellow.400, yellow.600)";
      case "bad":
        return "linear(to-r, orange.400, orange.600)";
      case "very_bad":
        return "linear(to-r, red.400, red.600)";
      default:
        return "linear(to-r, gray.400, gray.600)";
    }
  };

  const getStarRating = (quality) => {
    const ratings = {
      excellent: 5,
      good: 4,
      average: 3,
      bad: 2,
      very_bad: 1,
    };
    return ratings[quality] || 3;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        as={FiStar}
        color={index < rating ? "yellow.400" : "gray.300"}
        boxSize={5}
        fill={index < rating ? "yellow.400" : "transparent"}
      />
    ));
  };

  const getMediumImage = (medium) => {
    switch (medium) {
      case "external_sim":
        return { src: "/sim_logo.png", alt: "SIM Call" };
      case "whatsapp":
        return { src: "/whatsapp_logo.png", alt: "WhatsApp Call" };
      case "dailer":
        return { src: "/phone_logo.png", alt: "Phone Call" };
      default:
        return { src: "/phone_logo.png", alt: "Phone Call" };
    }
  };

  const mediumImage = getMediumImage(feedback.callMedium);

  const getQualityColor = (quality) => {
    switch (quality) {
      case "excellent":
        return "green";
      case "good":
        return "blue";
      case "average":
        return "yellow";
      case "bad":
        return "orange";
      case "very_bad":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent bg={bgColor} borderRadius="xl" maxH="85vh">
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={FiPhone} color="blue.500" />
            <Text>Call Feedback Details</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody maxH="70vh" overflowY="auto" pb={6}>
          <VStack spacing={4} align="stretch">
            {/* Quality Indicator and Assessment - Horizontal Layout */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Box
                  p={4}
                  borderRadius="lg"
                  bgGradient={getQualityGradient(feedback.callQuality)}
                  color="white"
                  h="full"
                >
                  <VStack spacing={2} justify="center" h="full">
                    <HStack spacing={2}>
                      {renderStars(getStarRating(feedback.callQuality))}
                    </HStack>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      textTransform="capitalize"
                      textAlign="center"
                    >
                      {feedback.callQuality?.replace("_", " ")} Quality
                    </Text>
                  </VStack>
                </Box>
              </GridItem>

              <GridItem>
                <Box
                  p={3}
                  borderWidth={1}
                  borderRadius="lg"
                  borderColor={borderColor}
                  h="full"
                >
                  <VStack spacing={3} align="stretch" justify="center" h="full">
                    <Text fontWeight="medium" fontSize="md">
                      Call Quality Assessment
                    </Text>
                    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                      <GridItem>
                        <VStack spacing={1} align="start">
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color="gray.600"
                          >
                            Rating:
                          </Text>
                          <Badge
                            colorScheme={getQualityColor(feedback.callQuality)}
                            variant="solid"
                            size="sm"
                            textTransform="capitalize"
                          >
                            {feedback.callQuality?.replace("_", " ")}
                          </Badge>
                        </VStack>
                      </GridItem>
                      <GridItem>
                        <VStack spacing={1} align="start">
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color="gray.600"
                          >
                            Issue:
                          </Text>
                          <Badge
                            colorScheme={feedback.reason ? "red" : "green"}
                            variant="subtle"
                            size="sm"
                          >
                            {feedback.reason || "No Issues"}
                          </Badge>
                        </VStack>
                      </GridItem>
                    </Grid>
                    <HStack spacing={2} justify="center">
                      <Text fontSize="sm" fontWeight="medium" color="gray.600">
                        Stars:
                      </Text>
                      <HStack spacing={1}>
                        {renderStars(getStarRating(feedback.callQuality))}
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        ({getStarRating(feedback.callQuality)}/5)
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </GridItem>
            </Grid>

            {/* User, Lead, and Call Information - 3 Column Layout */}
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <Box
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  borderColor={borderColor}
                >
                  <VStack spacing={3} align="start">
                    <HStack spacing={3}>
                      <Avatar
                        src={`${constant.baseUrl}/${feedback.user?.profileImage}`}
                        size="md"
                        name={feedback.user?.username}
                        bg="blue.500"
                        color="white"
                      />
                      <Box>
                        <Text fontWeight="bold" fontSize="md">
                          {feedback.user?.fullName || "Unknown User"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          @{feedback.user?.username}
                        </Text>
                      </Box>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon as={FiHash} color="purple.500" boxSize={4} />
                      <Text fontSize="sm">Ext: {feedback.userExtensionId}</Text>
                    </HStack>
                    {feedback.user?.roles && feedback.user.roles.length > 0 && (
                      <HStack spacing={2} align="center" flexWrap="wrap">
                        <Text fontSize="sm" fontWeight="medium">
                          Roles:
                        </Text>

                        {feedback.user.roles.map((role, index) => (
                          <Badge
                            key={index}
                            colorScheme="blue"
                            variant="subtle"
                            size="sm"
                          >
                            {role.roleName}
                          </Badge>
                        ))}
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </GridItem>

              <GridItem>
                <Box
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  borderColor={borderColor}
                >
                  <VStack spacing={3} align="start">
                    <HStack spacing={3}>
                      <Icon as={FiPhone} color="green.500" boxSize={5} />
                      <Box>
                        <Text fontWeight="bold" fontSize="lg">
                          {feedback.lead?.leadName || "No Lead Assigned"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {feedback.lead ? "Lead Information" : "Direct Call"}
                        </Text>
                      </Box>
                    </HStack>
                    <HStack spacing={2}>
                      <Tooltip label={mediumImage.alt}>
                        <Image
                          src={mediumImage.src}
                          alt={mediumImage.alt}
                          boxSize={4}
                          objectFit="contain"
                        />
                      </Tooltip>
                      <Text fontSize="sm" textTransform="capitalize">
                        {feedback.callMedium?.replace("_", " ")}
                      </Text>
                    </HStack>
                    {feedback.lead && (
                      <HStack spacing={2}>
                        <Icon as={FiHash} color="green.500" boxSize={4} />
                        <Text fontSize="sm">
                          Lead: ...{feedback.lead._id?.slice(-8)}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </GridItem>

              <GridItem>
                <Box
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  borderColor={borderColor}
                >
                  <VStack spacing={3} align="stretch">
                    <Text fontWeight="medium" fontSize="md">
                      Call Information
                    </Text>

                    <VStack spacing={3} align="stretch">
                      {/* Started */}
                      <HStack spacing={2} align="center" wrap="nowrap">
                        <Icon as={FiCalendar} color="purple.500" boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium">
                          Started:
                        </Text>
                        <Text fontSize="sm" whiteSpace="nowrap">
                          {formatDate(feedback.createdAt)}
                        </Text>
                      </HStack>

                      {/* Updated */}
                      <HStack spacing={2} align="center" wrap="nowrap">
                        <Icon as={FiClock} color="blue.500" boxSize={4} />
                        <Text fontSize="sm" fontWeight="medium">
                          Updated:
                        </Text>
                        <Text fontSize="sm" whiteSpace="nowrap">
                          {formatDate(feedback.updatedAt)}
                        </Text>
                      </HStack>

                      {/* Medium */}
                      <HStack spacing={2} align="center" wrap="nowrap">
                        <Tooltip label={mediumImage.alt}>
                          <Image
                            src={mediumImage.src}
                            alt={mediumImage.alt}
                            boxSize={4}
                            objectFit="contain"
                          />
                        </Tooltip>
                        <Text fontSize="sm" fontWeight="medium">
                          Medium:
                        </Text>
                        <Text
                          fontSize="sm"
                          textTransform="capitalize"
                          whiteSpace="nowrap"
                        >
                          {feedback.callMedium?.replace("_", " ")}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              </GridItem>
            </Grid>

            {/* Call Description - Full Width */}
            {feedback.description && (
              <Box
                p={3}
                borderWidth={1}
                borderRadius="lg"
                borderColor={borderColor}
              >
                <VStack spacing={2} align="stretch" h="full">
                  <HStack spacing={2} align="start">
                    <Icon as={FiMessageSquare} color="blue.500" boxSize={4} />
                    <Text fontWeight="medium" fontSize="md">
                      Call Description
                    </Text>
                  </HStack>
                  <Text
                    lineHeight="1.6"
                    whiteSpace="pre-wrap"
                    fontSize="sm"
                    flex={1}
                  >
                    {feedback.description}
                  </Text>
                </VStack>
              </Box>
            )}

            {/* Additional Information */}
            {/* Additional Information */}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CallFeedbackDetailModal;
