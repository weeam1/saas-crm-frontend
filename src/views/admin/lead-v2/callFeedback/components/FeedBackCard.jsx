import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  SimpleGrid,
  Text,
  Badge,
  Flex,
  Icon,
  HStack,
  Divider,
  Tooltip,
  IconButton,
  useDisclosure,
  useOutsideClick,
  Avatar,
  Image,
} from "@chakra-ui/react";
import {
  FiPhone,
  FiStar,
  FiEye,
  FiInfo,
} from "react-icons/fi";
import { MdDescription } from "react-icons/md";
import { getImageUrl } from "views/admin/Listing/client-listings/propertyUtils";
import { useModalColors } from "hooks/useModalColors";

export const CallFeedbackCard = ({ feedback, onViewDetails }) => {
  const {
    bg,
    borderColor,
    bodyText,
    mutedText,
    headingText,
    accentGold,
    badgeInfoBg,
    badgeInfoText,
    cardShadow,
  } = useModalColors();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA");
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
        color={index < rating ? accentGold : mutedText}
        boxSize={4}
        fill={index < rating ? accentGold : "transparent"}
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

  const getGlowColor = (quality) => {
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

  const quality = feedback?.callQuality?.toLowerCase()?.replace(" ", "_");

  return (
    <Box
      bg={bg}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={{ base: 4 }}
      shadow={cardShadow}
      _hover={{
        shadow: "xl",
        transform: "translateY(-2px)",
      }}
      transition="all 0.3s ease"
      position="relative"
      overflow="hidden"
    >
      {/* Glow Box */}
      <Box
        position="absolute"
        top="4px"
        right={0}
        w="140px"
        h="140px"
        bgGradient={`linear(45deg, transparent 30%, ${getGlowColor(quality)}.500 100%)`}
        opacity={0.6}
        borderRadius="0 0 0 100%"
        transition="all 0.3s ease"
      />

      {/* Quality indicator bar */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="4px"
        bgGradient={getQualityGradient(feedback.callQuality)}
      />

      <VStack align="stretch" pt="2" spacing={{ base: 3, md: 4 }}>
        {/* User Profile Section */}
        <HStack spacing={{ base: 2 }} align="start">
          <Avatar
            src={`${getImageUrl(feedback.user?.profileImage)}`}
            size="lg"
            name={feedback?.user?.username}
            bg={accentGold}
            color={headingText}
          />
          <Box flex={1}>
            <Flex justify="space-between" alignItems="center">
              <Tooltip
                label={feedback.user?.fullName}
                placement="top"
                hasArrow
                isDisabled={!feedback.user?.fullName}
              >
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={bodyText}
                  maxW={{ base: "150px" }}
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
                variant="ghost"
                color={accentGold}
                onClick={() => onViewDetails(feedback)}
                _hover={{ color: accentGold, bg: bg }}
              />
            </Flex>
            <Box
              flex={1}
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <Flex display={"column"}>
                <Box>
                  <HStack spacing={1}>
                    {renderStars(getStarRating(feedback.callQuality))}
                  </HStack>
                </Box>
                <HStack spacing={{ base: 2, md: 3 }} pt={1}>
                  <Text fontSize={{ base: "xs" }} color={mutedText}>
                    {formatDate(feedback.createdAt)}
                  </Text>
                </HStack>
              </Flex>
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

        <HStack spacing={{ base: 2, md: 3 }}>
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
          <Box>
            <Badge
              colorScheme="blue"
              variant="subtle"
              size="xs"
              fontSize={{ base: "xs", md: "xs" }}
            >
              Lead ID {feedback?.lead?.intID}
            </Badge>
          </Box>
        </HStack>

        <VStack align="stretch" spacing={{ base: 2, md: 3 }}>
          <HStack spacing={{ base: 2, md: 3 }}>
            <Icon as={FiPhone} color={accentGold} boxSize={{ base: 3, md: 4 }} />
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color={bodyText}
              fontWeight="medium"
            >
              {feedback?.lead?.leadName || "Unknown Lead"}
            </Text>
          </HStack>

          {feedback.reason && (
            <HStack spacing={{ base: 2, md: 3 }}>
              <Icon as={FiInfo} color="red.500" boxSize={{ base: 3, md: 4 }} />
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
            <Divider borderColor={borderColor} />
            <HStack spacing={2} align="flex-start" mt={2}>
              <Icon as={MdDescription} color={mutedText} boxSize={4} mt={0.5} />
              <HStack
                flex={1}
                align="flex-start"
                justify="space-between"
                position="relative"
              >
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  color={bodyText}
                  lineHeight="1.5"
                  flex={1}
                  noOfLines={2}
                  mr={2}
                >
                  {feedback.description}
                </Text>

                <Box position="relative">
                  <ClickableTooltip
                    label={feedback.description}
                    placement="left"
                  >
                    <IconButton
                      aria-label="View full description"
                      icon={<FiInfo />}
                      size="xs"
                      variant="ghost"
                      color={accentGold}
                      _hover={{ color: accentGold, bg: bg }}
                      minW="auto"
                      h="auto"
                      p={1}
                    />
                  </ClickableTooltip>
                </Box>
              </HStack>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
};

const ClickableTooltip = ({ children, label, placement = "left" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();
  const { bg, bodyText, borderColor, mutedText } = useModalColors();

  useOutsideClick({
    ref,
    handler: () => {
      if (isOpen) onClose();
    },
  });

  const handleClick = () => {
    isOpen ? onClose() : onOpen();
  };

  return (
    <Box ref={ref} display="inline-block">
      <Tooltip
        label={label}
        placement={placement}
        isOpen={isOpen}
        hasArrow
        closeOnClick={false}
        closeOnBlur={false}
        borderRadius="md"
        px={3}
        py={2}
        maxW={{ base: "260px", sm: "300px" }}
        bg={bg}
        color={bodyText}
        border="1px solid"
        borderColor={borderColor}
      >
        <Box onClick={handleClick} cursor="pointer">
          {children}
        </Box>
      </Tooltip>
    </Box>
  );
};