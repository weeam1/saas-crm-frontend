
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Button,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
  IconButton,
  HStack,
  Text,
  Icon,
} from "@chakra-ui/react";
import { animateValue } from "utils/animation";
import useUserSession from "hooks/useUserSession";
import { usePermissions } from "hooks/usePermissions";
import {  FiTrendingUp, FiTrendingDown, FiCheckCircle, FiClock, FiAward, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "components/shared/CustomTooltip";
import RefreshButton from "components/refresh/RefreshButton";


const SurveySummary = ({

  data = [],
  isLoading,
  refetch,
  isFetching,
}) => {
  const [animatedValues, setAnimatedValues] = useState(data.map(() => 0));
  const { user, isSuperAdmin } = useUserSession();
  const { hasPermission } = usePermissions();

  // Fixed theme colors (no useColorModeValue)
  const bgColor = "bg.surface";
  const textColor = "text.heading";
  const skeletonColor = "rgba(212, 175, 55, 0.08)";
  const isMobile = useBreakpointValue({ base: true, md: false });

  const navigate = useNavigate();

  // Card background colors (gold-tinted variations)
  const cardBgColors = [
    "rgba(212, 175, 55, 0.04)",
    "rgba(212, 175, 55, 0.06)",
    "rgba(212, 175, 55, 0.08)",
    "rgba(212, 175, 55, 0.05)",
  ];


  // Card configurations with different colors for each
  const cardConfigs = [
    {
      icon: FiFileText,
      iconBg: "rgba(66, 153, 225, 0.1)",
      iconColor: "#4299E1",
      borderColor: "#4299E1",
      gradient: "linear-gradient(135deg, rgba(66, 153, 225, 0.03) 0%, transparent 100%)",
    },
    {
      icon: FiCheckCircle,
      iconBg: "rgba(72, 187, 120, 0.1)",
      iconColor: "#48BB78",
      borderColor: "#48BB78",
      gradient: "linear-gradient(135deg, rgba(72, 187, 120, 0.03) 0%, transparent 100%)",
    },
    {
      icon: FiTrendingUp,
      iconBg: "rgba(212, 175, 55, 0.1)",
      iconColor: "#D4AF37",
      borderColor: "#D4AF37",
      gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, transparent 100%)",
    },
    {
      icon: FiAward,
      iconBg: "rgba(237, 137, 54, 0.1)",
      iconColor: "#ED8936",
      borderColor: "#ED8936",
      gradient: "linear-gradient(135deg, rgba(237, 137, 54, 0.03) 0%, transparent 100%)",
    },
  ];


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
      bg="bg.surface"
      p={6}
      borderRadius="xl"
      boxShadow="card"
      border="1px solid"
      borderColor="border.default"
      position="relative"
      overflow="hidden"
    >
      <Box>
        <SkeletonText noOfLines={1} width="60%" mb={4} startColor="rgba(212, 175, 55, 0.1)" endColor="rgba(26, 53, 80, 0.2)" />
        <Skeleton height="28px" width="40%" mb={3} startColor="rgba(212, 175, 55, 0.1)" endColor="rgba(26, 53, 80, 0.2)" />
        <SkeletonText noOfLines={1} width="80%" startColor="rgba(212, 175, 55, 0.1)" endColor="rgba(26, 53, 80, 0.2)" />
      </Box>
    </Box>
  );

  return (
    <Box p={6} mx="auto" bg={bgColor} mt="-16px" boxShadow="card" borderRadius="xl" border="1px solid" borderColor="border.default">
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
          fontSize="20px"
          color={textColor}
          fontWeight="700"
          letterSpacing="-0.5px"
          mb={{ base: 2, md: 0 }}
        >
          Survey Dashboard
        </Heading>
        <Flex gap={3} direction={{ base: "column", md: "row" }}>
          {/* Refresh Button */}
    	<RefreshButton
	label="Refresh"
	onClick={refetch}
	isLoading={isLoading}
	isFetching={isFetching}
	size="sm"
/>
          {hasPermission("survey", "create") && (
            <Button
              variant="brand"
              size="sm"
              onClick={() => navigate("/survey/create")}
              isDisabled={isLoading}
              minW={isMobile ? "full" : "auto"}
            >
              + Create Survey
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/survey/dashboard/survey-leader-board")}
            isDisabled={isLoading}
            minW={isMobile ? "full" : "auto"}
            borderColor="border.default"
            color="text.body"
            _hover={{ bg: "bg.elevated", borderColor: "gold.primary", color: "gold.primary" }}
          >
            Leaderboard
          </Button>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
        {isLoading || isFetching
          ? Array(4)
            .fill(0)
            .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />)
          : data.map((item, index) => {
            const config = cardConfigs[index % cardConfigs.length];
            const animatedValue = displayValue(index);
            const isPercentage =
              typeof item.value === "string" &&
              item.value.includes("%");

            return (
              <Box
                key={item.id || index}
                position="relative"
                overflow="hidden"
                bg="bg.surface"
                border="1px solid"
                borderColor="border.default"
                borderRadius="2xl"
                p={5}
                boxShadow="card"
                transition="all 0.3s ease"
                cursor="pointer"
                _hover={{
                  transform: "translateY(-6px)",
                  borderColor: config.borderColor,
                  boxShadow: "goldGlow",
                }}
              >
                {/* Top Accent */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="4px"
                  bg={config.borderColor}
                />

                {/* Background Gradient */}
                <Box
                  position="absolute"
                  inset={0}
                  bg={config.gradient}
                  pointerEvents="none"
                />

                {/* Content */}
                <Flex
                  direction="column"
                  position="relative"
                  zIndex={1}
                  h="100%"
                >
                  {/* Header */}
                  <Flex
                    align="center"
                    justify="space-between"
                    mb={5}
                  >
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        w="44px"
                        h="44px"
                        borderRadius="xl"
                        bg={config.iconBg}
                        border="1px solid"
                        borderColor={`${config.iconColor}30`}
                      >
                        <Icon
                          as={config.icon}
                          boxSize={5}
                          color={config.iconColor}
                        />
                      </Flex>

                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        color="text.muted"
                        lineHeight="short"
                      >
                        {item.label}
                      </Text>
                    </Flex>
                  </Flex>

                  {/* Main Value */}
                  <Flex align="end" gap={2}>
                    <Text
                      fontSize={{ base: "2xl", md: "3xl" }}
                      fontWeight="800"
                      lineHeight="1"
                      color={
                        isPercentage
                          ? config.iconColor
                          : "text.heading"
                      }
                      fontFamily="mono"
                    >
                      {animatedValue}
                    </Text>

                    {isPercentage && (
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        mb="2px"
                        color="text.muted"
                      >
                        Completion
                      </Text>
                    )}
                  </Flex>

                  {/* Footer Text */}
                  {(item.id === 3 || item.id === 4) && (
                    <Text
                      mt={3}
                      fontSize="xs"
                      color="text.muted"
                      fontWeight="500"
                      lineHeight="short"
                    >
                      {item.id === 3 &&
                        "Based on assigned surveys"}

                      {item.id === 4 &&
                        "Overall performance score"}
                    </Text>
                  )}

                  {/* Decorative Glow */}
                  <Box
                    position="absolute"
                    bottom="-20px"
                    right="-20px"
                    w="80px"
                    h="80px"
                    bg={`${config.iconColor}15`}
                    filter="blur(40px)"
                    borderRadius="full"
                    zIndex={0}
                  />
                </Flex>
              </Box>
            );
          })}
      </SimpleGrid>
    </Box >
  );
};

export default SurveySummary;