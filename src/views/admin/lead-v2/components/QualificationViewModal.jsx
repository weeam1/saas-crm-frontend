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

  const core = data.coreQualification || {};
  const deal = data.dealQualification || {};
  const investment = data.investmentProfile || {};
  const lead = data.lead || {};

  const fieldIcons = {
    leadType: { icon: FiTag, color: "text.accent" },
    budgetRange: { icon: FiDollarSign, color: "text.accent" },
    exactRequirement: { icon: FiMessageSquare, color: "text.accent" },
    exactRequest: { icon: FiMessageSquare, color: "text.accent" },
    propertyTypes: { icon: FiInfo, color: "text.accent" },
    preferredLocations: { icon: FiInfo, color: "text.accent" },
    purchaseTimeline: { icon: FiClock, color: "text.accent" },
    decisionStatus: { icon: FiCheckCircle, color: "text.accent" },
    clientTemperature: { icon: FiThermometer, color: "text.accent" },
    nextActionType: { icon: FiCalendar, color: "text.accent" },
    nextActionDate: { icon: FiCalendar, color: "text.accent" },
    decisionMaker: { icon: FiUserCheck, color: "text.accent" },
    paymentMethod: { icon: FiCreditCard, color: "text.accent" },
    downPaymentPreference: { icon: FiPercent, color: "text.accent" },
    handoverPreference: { icon: FiPackage, color: "text.accent" },
    installmentDuration: { icon: FiCalendar, color: "text.accent" },
    clientPriority: { icon: FiStar, color: "text.accent" },
    clientPriorities: { icon: FiStar, color: "text.accent" },
    investmentGoal: { icon: FiTarget, color: "text.accent" },
    targetROI: { icon: FiTrendingUp, color: "text.accent" },
    holdingPeriod: { icon: FiClock, color: "text.accent" },
    exitStrategy: { icon: FiLogOut, color: "text.accent" },
  };

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

  const formatArray = (array) => {
    if (!array || !Array.isArray(array)) return "-";
    return array.join(", ").replace(/_/g, " ");
  };

  const formatEnum = (value) => {
    if (!value) return "-";
    return value.replace(/_/g, " ");
  };

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

  const getTemperatureGradient = (temp) => {
    switch (temp?.toLowerCase()) {
      case "hot":
        return "linear(to-r, red.500, red.400)";
      case "warm":
        return "linear(to-r, orange.500, orange.400)";
      case "cold":
        return "linear(to-r, blue.500, blue.400)";
      default:
        return "linear(to-r, gray.500, gray.400)";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay bg="bg.overlay" />
      <ModalContent
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="deep"
        maxW={{ base: "95vw", md: "800px" }}
        maxH="85vh"
        display="flex"
        flexDirection="column"
      >
        {/* Gradient Header - Keep as is (decorative) */}
        <Box
          h="4px"
          bgGradient="linear(to-r, #FF6B6B, #FFD93D, #6BCB77, #4D96FF)"
        />

        <ModalHeader pb={4} pt={6} position="relative" pr={16}>
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="lg" fontWeight="700" color="text.heading">
                Qualification Details
              </Text>
              <Flex align="center" gap={2} mt={1}>
                <Flex align="center" gap={1}>
                  <Icon as={FiHash} color="text.accent" boxSize={3} />
                  <Text fontSize="xs" color="text.muted">
                    {lead.leadName || "N/A"}
                  </Text>
                </Flex>
              </Flex>
            </Box>

            <Box mr={12}>
              <Badge
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
                bgGradient={getTemperatureGradient(core.clientTemperature)}
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

        <ModalCloseButton
          top={6}
          right={4}
          size="md"
          bg="bg.surface"
          border="1px solid"
          borderColor="border.default"
          _hover={{ bg: "bg.elevated" }}
          zIndex={1}
        />

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
          <Box mb={8} pt="2">
            <Flex align="center" gap={2} mb={4}>
              <Box
                p={2}
                bg="accent.gold"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiInfo} color="text.inverse" boxSize={4} />
              </Box>
              <Text
                fontSize="lg"
                fontWeight="700"
                color="text.accent"
              >
                Core Qualification
              </Text>
            </Flex>

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

            <Box
              mt={4}
              p={4}
              borderRadius="lg"
              border="1px solid"
              borderColor="border.default"
              bg="bg.surface"
            >
              <InfoRow
                label="Exact Requirement"
                value={core.exactRequirement}
                iconData={fieldIcons.exactRequirement}
                fullWidth={true}
              />
            </Box>
          </Box>

          <Flex align="center" justify="center" my={8}>
            <Divider w="40%" borderColor="border.default" />
            <Icon as={FiChevronDown} color="text.muted" mx={4} />
            <Divider w="40%" borderColor="border.default" />
          </Flex>

          {/* DEAL SECTION */}
          <Box mb={8}>
            <Flex align="center" gap={2} mb={4}>
              <Box
                p={2}
                bg="accent.gold"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiBriefcase} color="text.inverse" boxSize={4} />
              </Box>
              <Text
                fontSize="lg"
                fontWeight="700"
                color="text.accent"
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
                <Divider w="40%" borderColor="border.default" />
                <Icon as={FiChevronDown} color="text.muted" mx={4} />
                <Divider w="40%" borderColor="border.default" />
              </Flex>

              <Box mb={8}>
                <Flex align="center" gap={2} mb={4}>
                  <Box
                    p={2}
                    bg="accent.gold"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiTrendingUp} color="text.inverse" boxSize={4} />
                  </Box>
                  <Text
                    fontSize="lg"
                    fontWeight="700"
                    color="text.accent"
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

const InfoRow = ({ label, value, iconData = null, highlight = false, fullWidth = false }) => (
  <Flex
    align="start"
    gap={3}
    p={2.5}
    borderRadius="lg"
    _hover={{ bg: "bg.elevated" }}
  >
    {iconData && (
      <Box
        p={1.5}
        bg="bg.elevated"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={iconData.icon} color="text.accent" boxSize={3} />
      </Box>
    )}
    <Box flex="1">
      <Text fontSize="xs" color="text.muted" fontWeight="500" mb={0.5}>
        {label}
      </Text>
      <Text
        fontSize="sm"
        fontWeight={highlight ? "600" : "400"}
        color={highlight ? "text.heading" : "text.body"}
        wordBreak="break-word"
      >
        {value || "-"}
      </Text>
    </Box>
  </Flex>
);