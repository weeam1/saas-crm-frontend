import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  Flex,
  Text,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  SimpleGrid,
  HStack,
  Badge,
  VStack,
} from "@chakra-ui/react";
import { useModalColors } from "hooks/useModalColors";

const ViewUserModal = ({ open, onClose }) => {
  const colors = useModalColors();

  const user = {
    fullName: "Admin Account",
    email: "admin@gmail.com",
    phone: "7874263692223",
    location: "Dubai",
    agency: "Dubai",
    role: "Super Admin",
    status: "Active",
    onlineStatus: "Online",
    firstName: "Admin",
    lastName: "Account",
    salaryType: "Salary + Commission + Incentive",
    salary: "500 AED",
    commissionType: "Company Commission",
    commission: "5%",
    incentive: "500 AED",
    currency: "AED",
    target: "5000",
    revenue: "24,000",
    coins: "5710",
    emails: "118",
    texts: "0",
    calls: "7",
    leads: 508,
    contacts: 0,
    properties: 1,
    tasks: 33,
    whatsappConnected: true,
    whatsappPhone: "692415337293083",
    businessId: "769788645371216",
    whatsappStatus: "Active",
    permissions: [
      { module: "Email", access: true },
      { module: "Call", access: true },
      { module: "Meeting", access: true },
      { module: "Task", access: true },
      { module: "Property", access: true },
      { module: "Contacts", access: true },
      { module: "Leads", access: true },
      { module: "Calendar", access: true },
      { module: "Deals", access: true },
      { module: "Announcement", access: true },
      { module: "Attendance", access: true },
      { module: "Payroll", access: true },
      { module: "Expense", access: true },
      { module: "WhatsApp", access: true },
      { module: "Listing", access: true },
      { module: "Evaluation", access: true },
      { module: "Reports", access: true },
      { module: "Survey", access: true },
      { module: "SIP", access: true },
      { module: "Others", access: true },
    ],
    createdAt: "2025-01-04",
    updatedAt: "2025-12-11",
    deleted: false,
    parent: "None",
  };

  const sidebarBg = colors.bgInput;
  const cardBg = colors.bg;
  const infoBg = colors.bgInput;
  const borderColor = colors.borderColor;

  return (
    <Modal onClose={onClose} isOpen={open} size="6xl" isCentered>
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(6px)" />
      <ModalContent m="3" borderRadius="2xl" shadow={colors.modalShadow} overflow="hidden" bg={colors.bg}>
        {/* HEADER */}
        <ModalHeader
          px={6}
          py={6}
          borderBottom="1px solid"
          borderColor={colors.borderColor}
          bg={colors.bgDeep}
        >
          <Flex align="center" justify="space-between" w="full">
            <Text
              fontSize="lg"
              fontWeight="600"
              color={colors.headingText}
              letterSpacing="0.2px"
            >
              User Preview
            </Text>

            <ModalCloseButton
              position="relative"
              top="0"
              right="0"
              color={colors.closeBtnColor}
              boxSize={6}
              _focus={{ outline: "none" }}
              _hover={{ bg: colors.closeBtnHoverBg }}
            />
          </Flex>
        </ModalHeader>

        <Box
          bg={colors.bg}
          color={colors.bodyText}
          p={6}
          borderTopRadius="2xl"
          maxH={{ base: "50vh", md: "81vh" }}
          overflowY="auto"
          scrollBehavior="smooth"
          display="flex"
          flexDirection="column"
          gap={6}
        >
          <Box mb={12}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 6, md: 10 }}
              w="full"
              align="flex-start"
            >
              {/* PROFILE SUMMARY SIDEBAR */}
              <Box
                flexShrink={0}
                w={{ base: "100%", md: "220px" }}
                textAlign="center"
                p={6}
                borderRadius="2xl"
                bg={sidebarBg}
                boxShadow={colors.cardShadow}
                position="relative"
                border="1px solid"
                borderColor={colors.borderColor}
              >
                <Avatar
                  size="2xl"
                  name={user.fullName}
                  mb={3}
                  border="3px solid"
                  borderColor={colors.accentGold}
                />
                <Box
                  position="absolute"
                  bottom={6}
                  right={{ base: "50%", md: 6 }}
                  transform={{ base: "translateX(50%)", md: "translateX(0)" }}
                  w={4}
                  h={4}
                  borderRadius="full"
                  bg={user.onlineStatus === "Online" ? colors.accentGold : colors.mutedText}
                  border="2px solid"
                  borderColor={colors.bg}
                />
                <Text fontWeight="700" fontSize="lg" color={colors.headingText} mt={2}>
                  {user.fullName}
                </Text>
                <Text fontSize="sm" color={colors.mutedText} mt={1}>
                  {user.role}
                </Text>

                <HStack justify="center" mt={4} spacing={2}>
                  <Badge
                    bg={user.status === "Active" ? `${colors.accentGold}15` : `${colors.badgeErrorText}15`}
                    color={user.status === "Active" ? colors.accentGold : colors.badgeErrorText}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="600"
                    fontSize="xs"
                    boxShadow={colors.cardShadow}
                  >
                    {user.status}
                  </Badge>
                  <Badge
                    bg={user.onlineStatus === "Online" ? `${colors.accentGold}15` : `${colors.mutedText}15`}
                    color={user.onlineStatus === "Online" ? colors.accentGold : colors.mutedText}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="600"
                    fontSize="xs"
                    boxShadow={colors.cardShadow}
                  >
                    {user.onlineStatus}
                  </Badge>
                </HStack>
              </Box>

              {/* MAIN INFO AND METRICS */}
              <VStack flex="1" spacing={6} w="full" align="stretch">
                {/* Personal Info Section */}
                <Box
                  w="full"
                  bg={cardBg}
                  borderRadius="2xl"
                  p={{ base: 4, md: 6 }}
                  boxShadow={colors.cardShadow}
                  overflow="hidden"
                  border="1px solid"
                  borderColor={colors.borderColor}
                >
                  <Text fontSize="lg" fontWeight="700" mb={4} color={colors.headingText}>
                    Personal Information
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {[
                      ["Full Name", user.fullName],
                      ["Email", user.email],
                      ["Phone", user.phone],
                      ["Location", user.location],
                      ["Agency", user.agency],
                      ["Role", user.role],
                    ].map(([label, value]) => (
                      <Box
                        key={label}
                        bg={infoBg}
                        p={3}
                        borderRadius="lg"
                        _hover={{ shadow: colors.modalShadow, transform: "translateY(-1px)" }}
                        transition="all 0.2s"
                        border="1px solid"
                        borderColor={colors.borderColor}
                      >
                        <Text fontSize="xs" fontWeight="500" color={colors.mutedText}>
                          {label}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color={colors.headingText}
                          mt={1}
                        >
                          {value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>

                {/* Compensation & Metrics */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                  {[
                    ["Salary Type", user.salaryType, "💰"],
                    ["Salary", user.salary, "💵"],
                    ["Commission Type", user.commissionType, "📊"],
                    ["Commission %", user.commission, "📈"],
                    ["Incentive", user.incentive, "🎁"],
                    ["Currency", user.currency, "💳"],
                  ].map(([label, value, icon]) => (
                    <Box
                      key={label}
                      bg={cardBg}
                      borderRadius="2xl"
                      p={4}
                      boxShadow={colors.cardShadow}
                      _hover={{ shadow: colors.modalShadow, transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                      border="1px solid"
                      borderColor={colors.borderColor}
                    >
                      <HStack spacing={2}>
                        <Text fontSize="xl">{icon}</Text>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color={colors.mutedText} fontWeight="500">
                            {label}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color={colors.headingText}
                            mt={1}
                          >
                            {value}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </Flex>
          </Box>

          {/* TABS */}
          <Tabs variant="unstyled">
            {/* TAB LIST */}
            <TabList
              position="sticky"
              top="-24px"
              mx="-24px"
              px="24px"
              zIndex="20"
              bg={colors.bg}
              borderBottom="1px solid"
              borderColor={colors.borderColor}
              overflowX="auto"
              whiteSpace="nowrap"
              css={{
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": {
                  height: "2px",
                },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  background: colors.accentGold,
                  borderRadius: "2px",
                },
                scrollbarWidth: "thin",
                scrollbarColor: `${colors.accentGold} transparent`,
              }}
            >
              <Tab
                _selected={{
                  color: colors.accentGold,
                  borderBottom: "2px solid",
                  borderColor: colors.accentGold,
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
                color={colors.bodyText}
              >
                Performance
              </Tab>

              <Tab
                _selected={{
                  color: colors.accentGold,
                  borderBottom: "2px solid",
                  borderColor: colors.accentGold,
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
                color={colors.bodyText}
              >
                Records
              </Tab>

              <Tab
                _selected={{
                  color: colors.accentGold,
                  borderBottom: "2px solid",
                  borderColor: colors.accentGold,
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
                color={colors.bodyText}
              >
                WhatsApp
              </Tab>

              <Tab
                _selected={{
                  color: colors.accentGold,
                  borderBottom: "2px solid",
                  borderColor: colors.accentGold,
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
                color={colors.bodyText}
              >
                Permissions
              </Tab>

              <Tab
                _selected={{
                  color: colors.accentGold,
                  borderBottom: "2px solid",
                  borderColor: colors.accentGold,
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
                color={colors.bodyText}
              >
                System & Metadata
              </Tab>
            </TabList>

            <TabPanels>
              {/* Performance & Activity */}
              <TabPanel p={0}>
                <Box mt={10} mb={10}>
                  <Text
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }}
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }}
                    color={colors.headingText}
                    lineHeight={{ base: "short", md: "shorter" }}
                  >
                    Performance & Activity Insights
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    {[
                      ["Target", user.target],
                      ["Total Revenue", user.revenue],
                      ["Coins", user.coins],
                      ["Emails Sent", user.emails],
                      ["Texts Sent", user.texts],
                      ["Outbound Calls", user.calls],
                    ].map(([label, value]) => (
                      <Box
                        key={label}
                        p={5}
                        bg={cardBg}
                        borderRadius="2xl"
                        boxShadow={colors.cardShadow}
                        _hover={{ shadow: colors.modalShadow, transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                        border="1px solid"
                        borderColor={colors.borderColor}
                      >
                        <Text fontSize="xs" color={colors.mutedText} fontWeight="500">
                          {label}
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="700"
                          color={colors.headingText}
                          mt={1}
                        >
                          {value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </TabPanel>

              {/* Source & Tracking */}
              <TabPanel p={0}>
                <Box mt={10} mb={10}>
                  <Text
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }}
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }}
                    color={colors.headingText}
                    lineHeight={{ base: "short", md: "shorter" }}
                  >
                    Created Records Summary
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                    {[
                      ["Leads", user.leads],
                      ["Contacts", user.contacts],
                      ["Properties", user.properties],
                      ["Tasks", user.tasks],
                    ].map(([label, value]) => (
                      <Box
                        key={label}
                        p={5}
                        bg={cardBg}
                        borderRadius="2xl"
                        boxShadow={colors.cardShadow}
                        _hover={{ shadow: colors.modalShadow, transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                        textAlign="center"
                        border="1px solid"
                        borderColor={colors.borderColor}
                      >
                        <Text fontSize="xs" color={colors.mutedText} fontWeight="500">
                          {label}
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="700"
                          color={colors.headingText}
                          mt={1}
                        >
                          {value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </TabPanel>

              {/* WhatsApp Integration */}
              <TabPanel p={0}>
                <Box mt={10} mb={10}>
                  <Text
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }}
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }}
                    color={colors.headingText}
                    lineHeight={{ base: "short", md: "shorter" }}
                  >
                    WhatsApp Integration
                  </Text>

                  {user.whatsappConnected ? (
                    <VStack
                      align="flex-start"
                      spacing={4}
                      p={6}
                      bg={cardBg}
                      borderRadius="2xl"
                      boxShadow={colors.cardShadow}
                      border="1px solid"
                      borderColor={colors.borderColor}
                    >
                      <InfoRow label="Phone" value={user.whatsappPhone} colors={colors} />
                      <InfoRow label="Business ID" value={user.businessId} colors={colors} />
                      <Badge
                        bg={`${colors.accentGold}15`}
                        color={colors.accentGold}
                        px={4}
                        py={1}
                        borderRadius="full"
                        fontWeight="600"
                      >
                        {user.whatsappStatus}
                      </Badge>
                    </VStack>
                  ) : (
                    <Badge
                      bg={`${colors.badgeErrorText}15`}
                      color={colors.badgeErrorText}
                      px={4}
                      py={1}
                      borderRadius="full"
                      fontWeight="600"
                    >
                      Not Connected
                    </Badge>
                  )}
                </Box>
              </TabPanel>

              {/* Role Permissions */}
              <TabPanel p={0}>
                <Box mt={10} mb={10}>
                  <Text
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }}
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }}
                    color={colors.headingText}
                    lineHeight={{ base: "short", md: "shorter" }}
                  >
                    Role Permissions Overview
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    {user.permissions.map((p) => (
                      <Box
                        key={p.module}
                        p={5}
                        bg={cardBg}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={colors.borderColor}
                        textAlign="center"
                        _hover={{ shadow: colors.modalShadow, transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                      >
                        <Text fontWeight="600" mb={2} color={colors.headingText}>
                          {p.module}
                        </Text>
                        <Badge
                          px={4}
                          py={1}
                          borderRadius="full"
                          bg={p.access ? `${colors.accentGold}15` : `${colors.badgeErrorText}15`}
                          color={p.access ? colors.accentGold : colors.badgeErrorText}
                          fontWeight="600"
                        >
                          {p.access ? "Full Access" : "No Access"}
                        </Badge>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </TabPanel>

              {/* System & Metadata */}
              <TabPanel p={0}>
                <Box mt={10} mb={10}>
                  <Text
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }}
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }}
                    color={colors.headingText}
                    lineHeight={{ base: "short", md: "shorter" }}
                  >
                    System & Metadata
                  </Text>

                  <VStack
                    spacing={3}
                    p={6}
                    bg={cardBg}
                    borderRadius="2xl"
                    boxShadow={colors.cardShadow}
                    border="1px solid"
                    borderColor={colors.borderColor}
                  >
                    <InfoRow label="Created" value={user.createdAt} colors={colors} />
                    <InfoRow label="Updated" value={user.updatedAt} colors={colors} />
                    <InfoRow label="Deleted" value={user.deleted ? "Yes" : "No"} colors={colors} />
                    <InfoRow label="Parent User" value={user.parent || "None"} colors={colors} />
                  </VStack>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default ViewUserModal;

function InfoRow({ label, value, colors }) {
  return (
    <Flex
      justify="space-between"
      w="100%"
      align="center"
      px={2}
      py={1}
      _hover={{ bg: colors.bgInput, borderRadius: "md" }}
      transition="all 0.2s"
    >
      <Text color={colors.mutedText} fontWeight="500" fontSize="sm">
        {label}
      </Text>
      <Text color={colors.headingText} fontWeight="600" fontSize="sm">
        {value}
      </Text>
    </Flex>
  );
}