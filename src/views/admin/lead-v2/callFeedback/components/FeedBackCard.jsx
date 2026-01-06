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
  Tooltip,
  IconButton,
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
  FiEye,
} from "react-icons/fi";
import { FaSimCard, FaWhatsapp } from "react-icons/fa";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { constant } from "constant";
import { Image } from "@chakra-ui/react"; // add this at top

export const CallFeedbackCard = ({ feedback, onViewDetails }) => {
  console.log(feedback, "show feedback");

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const now = new Date();

  //   const seconds = Math.floor((now - date) / 1000);

  //   const intervals = [
  //     { label: "year", seconds: 31536000 },
  //     { label: "month", seconds: 2592000 },
  //     { label: "week", seconds: 604800 },
  //     { label: "day", seconds: 86400 },
  //     { label: "hour", seconds: 3600 },
  //     { label: "minute", seconds: 60 },
  //     { label: "second", seconds: 1 },
  //   ];

  //   for (const interval of intervals) {
  //     const count = Math.floor(seconds / interval.seconds);
  //     if (count >= 1) {
  //       return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  //     }
  //   }

  //   return "just now";
  // };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Format as YYYY-MM-DD
    return date.toLocaleDateString("en-CA"); // en-CA gives YYYY-MM-DD format
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
        boxSize={4}
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

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={{ base: 4 }}
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

      <VStack align="stretch" pt="2" spacing={{ base: 3, md: 4 }}>
        {/* User Profile Section */}
        <HStack spacing={{ base: 2 }} align="start">
          <Avatar
            src={`${constant.baseUrl}/${feedback.user?.profileImage}`}
            size="md"
            name={feedback.user.username}
            bg="blue.500"
            color="white"
          ></Avatar>
          <Box flex={1}>
            <Flex justify="space-between" alignItems="center">
              {" "}
              <Tooltip
                label={feedback.user?.fullName}
                placement="top"
                hasArrow
                isDisabled={!feedback.user?.fullName}
              >
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  maxW={{ base: "100px" }} // 👈 adjust width
                  isTruncated
                  flex={1}
                  cursor="pointer"
                  fontWeight="bold"
                >
                  {feedback?.user?.fullName || "Unknown User"}
                </Text>
              </Tooltip>
              <IconButton
                position="absolute"
                top={3}
                right={3}
                aria-label="View Details"
                icon={<FiEye />}
                size="xs"
                variant="solid"
                onClick={() => onViewDetails(feedback)}
              />
            </Flex>
            <Box
              flex={1}
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <HStack spacing={{ base: 2, md: 3 }}>
                {/* <Icon
                  as={FiCalendar}
                  color="purple.500"
                  boxSize={{ base: 3, md: 4 }}
                /> */}
                <Text
                  fontSize={{ base: "xs" }}
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                >
                  {formatDate(feedback.createdAt)}
                </Text>
              </HStack>
              <Tooltip label={mediumImage.alt} hasArrow>
                <Image
                  src={mediumImage.src}
                  alt={mediumImage.alt}
                  boxSize={{ base: 4, md: 5 }}
                  objectFit="contain"
                  cursor="pointer"
                />
              </Tooltip>
            </Box>
          </Box>
        </HStack>
        <Divider />
        <Box>
          <HStack spacing={1}>
            {renderStars(getStarRating(feedback.callQuality))}
          </HStack>
        </Box>
        <HStack spacing={{ base: 2, md: 3 }}>
          {/* <Box
            p={{ base: 1.5, md: 2 }}
            borderRadius="lg"
            bg="blue.50"
            _dark={{ bg: "blue.900" }}
          ></Box> */}
          <Box>
            <Badge
              colorScheme="purple"
              variant="subtle"
              size="xs"
              fontSize={{ base: "xs", md: "xs" }}
            >
              Ext ID {feedback.userExtensionId}
            </Badge>
          </Box>
        </HStack>

        <Divider />

        <VStack align="stretch" spacing={{ base: 2, md: 3 }}>
          <HStack spacing={{ base: 2, md: 3 }}>
            <Icon as={FiPhone} color="green.500" boxSize={{ base: 3, md: 4 }} />
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.700"
              _dark={{ color: "gray.300" }}
              fontWeight="medium"
            >
              {feedback?.lead?.leadName || "Unknown Lead"}
            </Text>
          </HStack>

          {feedback.reason && (
            <HStack spacing={{ base: 2, md: 3 }}>
              <Icon
                as={FiWifiOff}
                color="red.500"
                boxSize={{ base: 3, md: 4 }}
              />
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="red.600"
                fontWeight="medium"
              >
                {feedback.reason}
              </Text>
            </HStack>
          )}
        </VStack>

        {feedback.description && (
          <>
            <Divider />
            <HStack spacing={2} align="flex-start" mt={2}>
              <Tooltip
                label={feedback.description}
                placement="top"
                hasArrow
                isDisabled={!feedback.description}
              >
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="1.5"
                  flex={1}
                  noOfLines={2} // clamps to 2 lines
                  cursor="pointer"
                >
                  {feedback.description}
                </Text>
              </Tooltip>

              {/* Spacer ensures the button stays at the far right */}
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
};
