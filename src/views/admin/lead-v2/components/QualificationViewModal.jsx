import {
  Badge,
  Flex,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  SimpleGrid,
  Divider,
  Box,
} from "@chakra-ui/react";
import {
  FiTag,
  FiDollarSign,
  FiCalendar,
  FiMessageSquare,
  FiClock,
  FiCheckCircle,
  FiThermometer,
  FiUserCheck,
  FiCreditCard,
  FiPercent,
  FiPackage,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiLogOut,
  FiInfo,
  FiBriefcase,
  FiHash,
  FiChevronDown,
} from "react-icons/fi";

export const QualificationViewModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  // Access nested data
  const core = data.coreQualification || {};
  const deal = data.dealQualification || {};
  const investment = data.investmentProfile || {};
  const lead = data.lead || {};

  // Icon mapping for fields with unique colors
  const fieldIcons = {
    // Core Qualification Icons - All different colors
    leadType: { icon: FiTag, color: "#FF6B6B" }, // Red
    budgetRange: { icon: FiDollarSign, color: "#4D96FF" }, // Blue
    exactRequirement: { icon: FiMessageSquare, color: "#6BCB77" }, // Green
    exactRequest: { icon: FiMessageSquare, color: "#6BCB77" }, // Green
    propertyTypes: { icon: FiInfo, color: "#FFD93D" }, // Yellow
    preferredLocations: { icon: FiInfo, color: "#9D4EDD" }, // Purple
    purchaseTimeline: { icon: FiClock, color: "#FF8C42" }, // Orange
    decisionStatus: { icon: FiCheckCircle, color: "#32CD32" }, // Lime Green
    clientTemperature: { icon: FiThermometer, color: "#FF4500" }, // Red-Orange
    nextActionType: { icon: FiCalendar, color: "#00CED1" }, // Teal
    nextActionDate: { icon: FiCalendar, color: "#1E90FF" }, // Dodger Blue

    // Deal Qualification Icons - All different colors
    decisionMaker: { icon: FiUserCheck, color: "#9370DB" }, // Medium Purple
    paymentMethod: { icon: FiCreditCard, color: "#20B2AA" }, // Light Sea Green
    downPaymentPreference: { icon: FiPercent, color: "#FF69B4" }, // Hot Pink
    handoverPreference: { icon: FiPackage, color: "#F4A261" }, // Sandy Brown
    installmentDuration: { icon: FiCalendar, color: "#2A9D8F" }, // Persian Green
    clientPriority: { icon: FiStar, color: "#FFD700" }, // Gold
    clientPriorities: { icon: FiStar, color: "#E9C46A" }, // Maize

    // Investment Profile Icons - All different colors
    investmentGoal: { icon: FiTarget, color: "#E76F51" }, // Coral
    targetROI: { icon: FiTrendingUp, color: "#2A9D8F" }, // Sea Green
    holdingPeriod: { icon: FiClock, color: "#264653" }, // Charcoal
    exitStrategy: { icon: FiLogOut, color: "#E63946" }, // Crimson
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format array values
  const formatArray = (array) => {
    if (!array || !Array.isArray(array)) return "-";
    return array.join(", ").replace(/_/g, " ");
  };

  // Format enum values
  const formatEnum = (value) => {
    if (!value) return "-";
    return value.replace(/_/g, " ");
  };

  // Get temperature badge color scheme
  const getTemperatureColorScheme = (temp) => {
    switch (temp?.toLowerCase()) {
      case "hot":
        return "red";
      case "warm":
        return "orange";
      case "cold":
        return "blue";
      default:
        return "gray";
    }
  };

  // Get temperature badge color for gradient
  const getTemperatureGradient = (temp) => {
    switch (temp?.toLowerCase()) {
      case "hot":
        return "linear(to-r, red.400, red.300)";
      case "warm":
        return "linear(to-r, orange.400, orange.300)";
      case "cold":
        return "linear(to-r, blue.400, blue.300)";
      default:
        return "linear(to-r, gray.400, gray.300)";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
        maxW={{ base: "95vw", md: "800px" }}
        maxH="85vh"
        display="flex"
        flexDirection="column"
      >
        {/* Gradient Header */}
        <Box
          h="4px"
          bgGradient="linear(to-r, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)"
        />

        <ModalHeader pb={4} pt={6} position="relative" pr={16}>
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="lg" fontWeight="700" color="gray.800">
                Qualification Details
              </Text>
              <Flex align="center" gap={2} mt={1}>
                <Flex align="center" gap={1}>
                  <Icon as={FiHash} color="#B79045" boxSize={3} />
                  <Text fontSize="xs" color="gray.500">
                    {lead.leadName || "N/A"}
                  </Text>
                </Flex>
              </Flex>
            </Box>

            {/* Temperature Badge with proper spacing */}
            <Box mr={12}>
              <Badge
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
                bgGradient={getTemperatureGradient(core.leadType)}
                color="white"
                fontWeight="bold"
                boxShadow="sm"
                textTransform="capitalize"
              >
                {formatEnum(core.leadType)}
              </Badge>
            </Box>
          </Flex>
        </ModalHeader>

        {/* Close Button moved to not overlap badge */}
        <ModalCloseButton
          top={6}
          right={4}
          size="md"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          _hover={{ bg: "gray.50" }}
          zIndex={1}
        />

        {/* Scrollable Content Area with Colorful Scrollbar */}
        <Box
          flex="1"
          overflowY="auto"
          px={6}
          pb={4}
          css={{
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#F7FAFC",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              background:
                "linear-gradient(to bottom, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)",
              borderRadius: "5px",
              border: "2px solid #F7FAFC",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background:
                "linear-gradient(to bottom, #FF5252, #FFC107, #4CAF50, #2196F3)",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "#6BCB77 #F7FAFC",
          }}
        >
          {/* CORE SECTION */}
          {/* CORE SECTION */}
          <Box mb={8}>
            <Flex align="center" gap={2} mb={4}>
              <Box
                p={2}
                bg="linear-gradient(135deg, #FF6B6B, #FFD93D)"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiInfo} color="white" boxSize={4} />
              </Box>
              <Text
                fontSize="lg"
                fontWeight="700"
                bgGradient="linear(to-r, #FF6B6B, #FFD93D)"
                bgClip="text"
              >
                Core Qualification
              </Text>
            </Flex>

            {/* Regular grid items except Exact Requirement */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mb={4}>
              <InfoRow
                label="Lead Type"
                value={formatEnum(core.leadType)}
                iconData={fieldIcons.leadType}
              />
              <InfoRow
                label="Budget Range"
                value={formatEnum(core.budgetRange)}
                iconData={fieldIcons.budgetRange}
              />
              <InfoRow
                label="Property Types"
                value={formatArray(core.propertyTypes)}
                iconData={fieldIcons.propertyTypes}
              />
              <InfoRow
                label="Preferred Locations"
                value={formatArray(core.preferredLocations)}
                iconData={fieldIcons.preferredLocations}
              />
              <InfoRow
                label="Purchase Timeline"
                value={formatEnum(core.purchaseTimeline)}
                iconData={fieldIcons.purchaseTimeline}
              />
              <InfoRow
                label="Decision Status"
                value={formatEnum(core.decisionStatus)}
                iconData={fieldIcons.decisionStatus}
              />
              <InfoRow
                label="Client Temperature"
                value={formatEnum(core.clientTemperature)}
                iconData={fieldIcons.clientTemperature}
              />
              <InfoRow
                label="Next Action Type"
                value={formatEnum(core.nextActionType)}
                iconData={fieldIcons.nextActionType}
              />
              <InfoRow
                label="Next Action Date"
                value={formatDate(core.nextActionDate)}
                iconData={fieldIcons.nextActionDate}
              />
            </SimpleGrid>

            {/* Exact Requirement - Full width at the end */}
            <Box
              mt={4}
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              bg="gray.50"
            >
              <InfoRow
                label="Exact Requirement"
                value={core.exactRequirement}
                iconData={fieldIcons.exactRequirement}
                // highlight={true}
                fullWidth={true}
              />
            </Box>
          </Box>

          {/* Separator */}
          <Flex align="center" justify="center" my={8}>
            <Divider w="40%" />
            <Icon as={FiChevronDown} color="gray.300" mx={4} />
            <Divider w="40%" />
          </Flex>

          {/* DEAL SECTION */}
          <Box mb={8}>
            <Flex align="center" gap={2} mb={4}>
              <Box
                p={2}
                bg="linear-gradient(135deg, #4D96FF, #6BCB77)"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiBriefcase} color="white" boxSize={4} />
              </Box>
              <Text
                fontSize="lg"
                fontWeight="700"
                bgGradient="linear(to-r, #4D96FF, #6BCB77)"
                bgClip="text"
              >
                Deal Qualification
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              <InfoRow
                label="Decision Maker"
                value={formatEnum(deal.decisionMaker)}
                iconData={fieldIcons.decisionMaker}
              />
              <InfoRow
                label="Payment Method"
                value={formatEnum(deal.paymentMethod)}
                iconData={fieldIcons.paymentMethod}
              />
              <InfoRow
                label="Down Payment Preference"
                value={formatEnum(deal.downPaymentPreference)}
                iconData={fieldIcons.downPaymentPreference}
              />
              <InfoRow
                label="Handover Preference"
                value={formatEnum(deal.handoverPreference)}
                iconData={fieldIcons.handoverPreference}
              />
              <InfoRow
                label="Installment Duration"
                value={formatEnum(deal.installmentDuration)}
                iconData={fieldIcons.installmentDuration}
              />
              <InfoRow
                label="Client Priorities"
                value={formatArray(deal.clientPriorities)}
                iconData={fieldIcons.clientPriorities}
              />
            </SimpleGrid>
          </Box>

          {/* INVESTMENT SECTION */}
          {data.isInvestor && (
            <>
              <Flex align="center" justify="center" my={8}>
                <Divider w="40%" />
                <Icon as={FiChevronDown} color="gray.300" mx={4} />
                <Divider w="40%" />
              </Flex>

              <Box mb={8}>
                <Flex align="center" gap={2} mb={4}>
                  <Box
                    p={2}
                    bg="linear-gradient(135deg, #9D4EDD, #E76F51)"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiTrendingUp} color="white" boxSize={4} />
                  </Box>
                  <Text
                    fontSize="lg"
                    fontWeight="700"
                    bgGradient="linear(to-r, #9D4EDD, #E76F51)"
                    bgClip="text"
                  >
                    Investment Profile
                  </Text>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  <InfoRow
                    label="Investment Goal"
                    value={formatEnum(investment.investmentGoal)}
                    iconData={fieldIcons.investmentGoal}
                  />
                  <InfoRow
                    label="Target ROI"
                    value={formatEnum(investment.targetROI)}
                    iconData={fieldIcons.targetROI}
                  />
                  <InfoRow
                    label="Holding Period"
                    value={formatEnum(investment.holdingPeriod)}
                    iconData={fieldIcons.holdingPeriod}
                  />
                  <InfoRow
                    label="Exit Strategy"
                    value={formatEnum(investment.exitStrategy)}
                    iconData={fieldIcons.exitStrategy}
                  />
                </SimpleGrid>
              </Box>
            </>
          )}
        </Box>
      </ModalContent>
    </Modal>
  );
};

const InfoRow = ({ label, value, iconData = null, highlight = false }) => (
  <Flex
    align="start"
    gap={3}
    p={2.5}
    borderRadius="lg"
    _hover={{ bg: "gray.50" }}
  >
    {iconData && (
      <Box
        p={1.5}
        bg={`${iconData.color}15`} // Using color with 15% opacity
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={iconData.icon} color={iconData.color} boxSize={3} />
      </Box>
    )}
    <Box flex="1">
      <Text fontSize="xs" color="gray.500" fontWeight="500" mb={0.5}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight={highlight ? "600" : "400"}
        color={highlight ? "gray.800" : "gray.700"}
        wordBreak="break-word"
      >
        {value || "-"}
      </Text>
    </Box>
  </Flex>
);
