import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
} from "@chakra-ui/react";
import { animateValue } from "utils/animation";

const SurveySummary = ({
  title = "Survey Dashboard",
  data = [],
  buttonText = "+ Create Survey",
  secondaryButtonText = "Leaderboard",
  onButtonClick,
  onSecondaryButtonClick,
  isLoading,
}) => {
  const [animatedValues, setAnimatedValues] = useState(data.map(() => 0));
  const user = localStorage.getItem("user");
  const isAdmin = user ? JSON.parse(user).role === "superAdmin" : false;

  const vibrantColors = {
    cards: ["#F0F9FF", "#FEF6FF", "#FFF6F0", "#F0FFF4"],
    accents: ["#0EA5E9", "#D946EF", "#F97316", "#22C55E"],
    buttons: ["#8B5CF6", "#0EA5E9"], // Purple and Sky Blue
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const skeletonColor = useColorModeValue("#f0f0f0", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (!isLoading && data.length > 0) {
      data.forEach((item, index) => {
        const targetValue =
          typeof item.value === "string"
            ? parseFloat(item.value.replace("%", "")) || 0
            : item.value;

        animateValue({
          start: 0,
          end: targetValue,
          duration: 1000,
          onUpdate: (value) => {
            setAnimatedValues((prev) => {
              const newValues = [...prev];
              newValues[index] = Math.round(value);
              return newValues;
            });
          },
        });
      });
    }
  }, [data, isLoading]);

  const displayValue = (index) => {
    const item = data[index];
    if (!item) return "0";

    if (typeof item.value === "string" && item.value.includes("%")) {
      return `${animatedValues[index]}%`;
    }
    return animatedValues[index];
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <Box
      bg={skeletonColor}
      p={6}
      borderRadius="xl"
      boxShadow="sm"
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "4px",
        height: "100%",
        bg: skeletonColor,
      }}
    >
      <Box>
        <SkeletonText noOfLines={1} width="60%" mb={4} />
        <Skeleton height="28px" width="40%" mb={3} />
        <SkeletonText noOfLines={1} width="80%" />
      </Box>
    </Box>
  );

  return (
    <Box p={6} mx="auto" bg={bgColor} mt={"-16px"} boxShadow="sm">
      {/* Header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={8}
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        <Heading
          as="h2"
          size="lg"
          color={textColor}
          fontWeight="700"
          letterSpacing="-0.5px"
          mb={{ base: 2, md: 0 }}
        >
          {title}
        </Heading>
        <Flex gap={3} direction={{ base: "column", md: "row" }}>
          {buttonText && isAdmin && (
            <Button
              bg={vibrantColors.buttons[0]}
              color="white"
              size="md"
              onClick={onButtonClick}
              _hover={{
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              _active={{
                opacity: 1,
                transform: "translateY(0)",
              }}
              fontWeight="600"
              px={6}
              borderRadius="lg"
              transition="all 0.2s ease"
              isDisabled={isLoading}
              minW={isMobile ? "full" : "auto"}
            >
              {buttonText}
            </Button>
          )}
          {secondaryButtonText && (
            <Button
              bg={vibrantColors.buttons[1]}
              color="white"
              size="md"
              onClick={onSecondaryButtonClick}
              _hover={{
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              _active={{
                opacity: 1,
                transform: "translateY(0)",
              }}
              fontWeight="600"
              px={6}
              borderRadius="lg"
              transition="all 0.2s ease"
              isDisabled={isLoading}
              minW={isMobile ? "full" : "auto"}
            >
              {secondaryButtonText}
            </Button>
          )}
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
          : data.map((item, index) => (
              <Box
                key={item.id || index}
                bg={vibrantColors.cards[index % vibrantColors.cards.length]}
                p={6}
                borderRadius="xl"
                boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                transition="all 0.3s ease-out"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`,
                }}
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  bg: vibrantColors.accents[
                    index % vibrantColors.accents.length
                  ],
                }}
                cursor={"pointer"}
              >
                <Stat>
                  <StatLabel
                    fontSize="sm"
                    color="gray.600"
                    fontWeight="600"
                    mb={2}
                  >
                    {item.label}
                  </StatLabel>
                  <StatNumber
                    fontSize="24px"
                    fontWeight="800"
                    color={
                      vibrantColors.accents[
                        index % vibrantColors.accents.length
                      ]
                    }
                    lineHeight="1.2"
                  >
                    {displayValue(index)}
                  </StatNumber>
                  {item.helpText && (
                    <StatHelpText
                      fontSize="xs"
                      mb={0}
                      mt={3}
                      color="gray.500"
                      fontWeight="500"
                    >
                      {item.helpText}
                    </StatHelpText>
                  )}
                </Stat>
              </Box>
            ))}
      </SimpleGrid>
    </Box>
  );
};

export default SurveySummary;
