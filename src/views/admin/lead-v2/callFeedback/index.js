import React, { useState, useMemo } from "react";
import {
  Box,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Text,
  Badge,
  Flex,
  Icon,
  HStack,
  Divider,
  Spinner,
  Center,
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
  FiMinus,
  FiThumbsDown,
  FiX,
} from "react-icons/fi";
import { FaSimCard, FaWhatsapp } from "react-icons/fa";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { useFetchCallFeedback } from "./hooks/useFetchCallFeedback";
import { constant } from "constant";

// Mock data for call feedback analytics
const mockSummary = [
  { label: "Total Calls", value: 1250, trend: "+12%", isPositive: true },
  { label: "Excellent Quality", value: 680, trend: "+8%", isPositive: true },
  { label: "Good Quality", value: 320, trend: "+5%", isPositive: true },
  { label: "Average Quality", value: 150, trend: "-2%", isPositive: false },
  { label: "Poor Quality", value: 100, trend: "-15%", isPositive: false },
  { label: "VPN Issues", value: 45, trend: "-5%", isPositive: false },
  { label: "Voice Cutting", value: 32, trend: "-8%", isPositive: false },
  { label: "High Latency", value: 28, trend: "-12%", isPositive: false },
];

const mockTotals = {
  total: 1250,
  excellent: 680,
  good: 320,
  average: 150,
  poor: 100,
};

const categories = [
  { value: "all", label: "All Calls" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

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

const getQualityIcon = (quality) => {
  switch (quality) {
    case "excellent":
      return FiStar;
    case "good":
      return FiThumbsUp;
    case "average":
      return FiMinus;
    case "bad":
      return FiThumbsDown;
    case "very_bad":
      return FiX;
    default:
      return FiPhone;
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
      boxSize={4}
      fill={index < rating ? "yellow.400" : "transparent"}
    />
  ));
};

const getMediumIcon = (medium) => {
  switch (medium) {
    case "external_sim":
      return FaSimCard;
    case "whatsapp":
      return FaWhatsapp;
    case "dailer":
      return FiPhone;
    default:
      return FiPhone;
  }
};

const CallFeedbackCard = ({ feedback }) => {
  console.log(feedback, "show feedback");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={6}
      shadow="lg"
      _hover={{
        shadow: "xl",
        bg: hoverBgColor,
        transform: "translateY(-2px)",
      }}
      transition="all 0.3s ease"
      position="relative"
      overflow="hidden"
    >
      {/* Quality indicator bar */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="4px"
        bgGradient={getQualityGradient(feedback.callQuality)}
      />

      {/* Quality Badge - Top Right Corner */}
      <Box position="absolute" top={3} right={3} zIndex={1}>
        <HStack spacing={1}>
          {renderStars(getStarRating(feedback.callQuality))}
        </HStack>
      </Box>

      <VStack align="stretch" pt="2" spacing={4}>
        {/* User Profile Section */}
        <HStack spacing={4}>
          <Avatar
            src={`${constant.baseUrl}/${feedback.user?.profileImage}`}
            size="md"
            name={feedback.user.username}
            bg="blue.500"
            color="white"
          >
            <AvatarBadge boxSize="1em" bg="green.500" />
          </Avatar>
          <Box flex={1}>
            <Text
              fontWeight="bold"
              fontSize="lg"
              color="gray.800"
              _dark={{ color: "white" }}
            >
              {feedback?.user?.username}
            </Text>
            <Badge colorScheme="purple" variant="subtle">
              Ext ID {feedback.userExtensionId}
            </Badge>
          </Box>
        </HStack>

        <HStack spacing={3}>
          <Box p={2} borderRadius="lg" bg="blue.50" _dark={{ bg: "blue.900" }}>
            <Icon
              as={getMediumIcon(feedback.callMedium)}
              color="blue.500"
              boxSize={5}
            />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {feedback.callMedium.replace("_", " ").toUpperCase()}
            </Text>
          </Box>
        </HStack>

        <Divider />

        <VStack align="stretch" spacing={3}>
          <HStack spacing={3}>
            <Icon as={FiPhone} color="green.500" boxSize={4} />
            <Text
              fontSize="sm"
              color="gray.700"
              _dark={{ color: "gray.300" }}
              fontWeight="medium"
            >
              {feedback?.lead?.leadName || "Unknown Lead"}
            </Text>
          </HStack>

          {feedback.reason && (
            <HStack spacing={3}>
              <Icon as={FiWifiOff} color="red.500" boxSize={4} />
              <Text fontSize="sm" color="red.600" fontWeight="medium">
                Issue: {feedback.reason}
              </Text>
            </HStack>
          )}

          <HStack spacing={3}>
            <Icon as={FiCalendar} color="purple.500" boxSize={4} />
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {formatDate(feedback.createdAt)}
            </Text>
          </HStack>
        </VStack>

        {feedback.description && (
          <>
            <Divider />
            <Box>
              <HStack align="start" spacing={3}>
                <Icon
                  as={FiMessageSquare}
                  color="gray.500"
                  boxSize={4}
                  mt={0.5}
                />
                <Text
                  fontSize="sm"
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.5"
                  flex={1}
                >
                  {feedback.description}
                </Text>
              </HStack>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

const CallFeedback = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: callFeedbackData, isLoading } = useFetchCallFeedback();

  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bgColor} p={8}>
      <Box maxW="1400px" mx="auto">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" mb={6}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              mb={2}
            >
              Call Feedback Dashboard
            </Text>
            <Text fontSize="lg" color="gray.600" _dark={{ color: "gray.400" }}>
              Monitor and analyze call quality feedback
            </Text>
          </Box>

          {/* Call Feedback Cards Grid */}
          {isLoading ? (
            <Center py={16}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {callFeedbackData.map((feedback) => (
                <CallFeedbackCard key={feedback._id} feedback={feedback} />
              ))}
            </SimpleGrid>
          )}

          {!isLoading && callFeedbackData.length === 0 && (
            <Center py={16}>
              <VStack spacing={4}>
                <Icon as={FiPhone} boxSize={12} color="gray.400" />
                <Text fontSize="lg" color="gray.500" fontWeight="medium">
                  No call feedback records found
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Call feedback data will appear here once available
                </Text>
              </VStack>
            </Center>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default CallFeedback;
