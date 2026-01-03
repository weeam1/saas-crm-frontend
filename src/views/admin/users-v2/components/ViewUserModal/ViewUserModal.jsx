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
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

const ViewUserModal = ({ open, onClose }) => {
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

  // Move all useColorModeValue calls to top-level of component
  const sidebarBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const infoBg = useColorModeValue("gray.50", "gray.600");

  // At the top of your component
  const bgCardLight = "white";
  const bgCardDark = "gray.700";
  const bgCardHoverLight = "gray.50";
  const bgCardHoverDark = "gray.600";
  const borderColorLight = "gray.200";
  const borderColorDark = "gray.600";

  const bgCard = useColorModeValue(bgCardLight, bgCardDark);
  const bgCardHover = useColorModeValue(bgCardHoverLight, bgCardHoverDark);
  const borderColor = useColorModeValue(borderColorLight, borderColorDark);
  // Lead Details Logic

  return (
    <Modal onClose={onClose} isOpen={open} size="6xl" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.6)" backdropFilter="blur(6px)" />
      <ModalContent m="3" borderRadius="2xl" shadow="2xl" overflow="hidden">
        {/* HEADER */}
        <ModalHeader
          px={6}
          py={6}
          borderBottom="1px solid"
          borderColor="gray.200"
          bg="white"
        >
          <Flex align="center" justify="space-between" w="full">
            {/* Title */}
            <Text
              fontSize="lg"
              fontWeight="600"
              color="gray.800"
              letterSpacing="0.2px"
            >
              User Preview
            </Text>

            {/* Close Button */}
            <ModalCloseButton
              position="relative"
              top="0"
              right="0"
              color="black"
              boxSize={6}
              _focus={{ outline: "none" }}
              _hover={{ bg: "gray.100" }}
            />
          </Flex>
        </ModalHeader>

        <Box
          bg="white"
          color="gray.800"
          p={6}
          borderTopRadius="2xl"
          maxH={{ base: "50vh", md: "81vh" }}
          overflowY="auto"
          scrollBehavior="smooth"
          display={"flex"}
          flexDirection={"column"}
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
                boxShadow="0 4px 24px rgba(0,0,0,0.06)"
                position="relative"
              >
                <Avatar
                  size="2xl"
                  name={user.fullName}
                  mb={3}
                  border="3px solid"
                  borderColor="gray.200"
                />
                <Box
                  position="absolute"
                  bottom={6}
                  right={{ base: "50%", md: 6 }}
                  transform={{ base: "translateX(50%)", md: "translateX(0)" }}
                  w={4}
                  h={4}
                  borderRadius="full"
                  bg={user.onlineStatus === "Online" ? "green.400" : "gray.400"}
                  border="2px solid white"
                />
                <Text fontWeight="700" fontSize="lg" color="gray.800" mt={2}>
                  {user.fullName}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {user.role}
                </Text>

                <HStack justify="center" mt={4} spacing={2}>
                  <Badge
                    colorScheme={user.status === "Active" ? "green" : "red"}
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="600"
                    fontSize="xs"
                    boxShadow="0 1px 4px rgba(0,0,0,0.1)"
                  >
                    {user.status}
                  </Badge>
                  <Badge
                    colorScheme={
                      user.onlineStatus === "Online" ? "green" : "gray"
                    }
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="600"
                    fontSize="xs"
                    boxShadow="0 1px 4px rgba(0,0,0,0.1)"
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
                  boxShadow="0 6px 20px rgba(0,0,0,0.05)"
                  overflow="hidden"
                >
                  <Text fontSize="lg" fontWeight="700" mb={4}>
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
                        _hover={{ shadow: "md", transform: "translateY(-1px)" }}
                        transition="all 0.2s"
                      >
                        <Text fontSize="xs" fontWeight="500" color="gray.500">
                          {label}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.800"
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
                      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
                      _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      <HStack spacing={2}>
                        <Text fontSize="xl">{icon}</Text>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" color="gray.500" fontWeight="500">
                            {label}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.800"
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
              bg="white"
              borderBottom="1px solid"
              borderColor="gray.200"
              overflowX="auto"
              whiteSpace="nowrap"
              css={{
                scrollBehavior: "smooth",

                /* Chrome, Safari, Edge */
                "&::-webkit-scrollbar": {
                  height: "2px",
                },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#d4d4d4",
                  borderRadius: "2px",
                },

                /* Firefox */
                scrollbarWidth: "thin",
                scrollbarColor: "#d4d4d4 transparent",
              }}
            >
              {/* 3️⃣ Source & Tracking */}
              <Tab
                _selected={{
                  color: "#B79045",
                  borderBottom: "2px solid",
                  borderColor: "#B79045",
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
              >
                Performance
              </Tab>

              {/* 4️⃣ Lead Status */}
              <Tab
                _selected={{
                  color: "#B79045",
                  borderBottom: "2px solid",
                  borderColor: "#B79045",
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
              >
                Records
              </Tab>

              <Tab
                _selected={{
                  color: "#B79045",
                  borderBottom: "2px solid",
                  borderColor: "#B79045",
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
              >
                WhatsApp
              </Tab>

              <Tab
                _selected={{
                  color: "#B79045",
                  borderBottom: "2px solid",
                  borderColor: "#B79045",
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
              >
                Permissions
              </Tab>

              <Tab
                _selected={{
                  color: "#B79045",
                  borderBottom: "2px solid",
                  borderColor: "#B79045",
                  fontWeight: "600",
                }}
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="none"
                _focus={{ boxShadow: "none" }}
              >
                System & Metadata
              </Tab>
            </TabList>

            <TabPanels>
              {/* Performance & Activity */}
              <TabPanel p={0}>
                <Box mt={10} mb={10}>
                  <Text
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }} // smaller on mobile, bigger on desktop
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }} // slightly smaller margin on mobile
                    color="gray.800"
                    lineHeight={{ base: "short", md: "shorter" }} // better readability
                  >
                    {" "}
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
                        bg={bgCard}
                        borderRadius="2xl"
                        boxShadow="0 6px 20px rgba(0,0,0,0.05)"
                        _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                      >
                        <Text fontSize="xs" color="gray.500" fontWeight="500">
                          {label}
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="700"
                          color="gray.800"
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
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }} // smaller on mobile, bigger on desktop
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }} // slightly smaller margin on mobile
                    color="gray.800"
                    lineHeight={{ base: "short", md: "shorter" }} // better readability
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
                        bg={bgCard}
                        borderRadius="2xl"
                        boxShadow="0 4px 16px rgba(0,0,0,0.05)"
                        _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                        textAlign="center"
                      >
                        <Text fontSize="xs" color="gray.500" fontWeight="500">
                          {label}
                        </Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="700"
                          color="gray.800"
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
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }} // smaller on mobile, bigger on desktop
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }} // slightly smaller margin on mobile
                    color="gray.800"
                    lineHeight={{ base: "short", md: "shorter" }} // better readability
                  >
                    WhatsApp Integration
                  </Text>

                  {user.whatsappConnected ? (
                    <VStack
                      align="flex-start"
                      spacing={4}
                      p={6}
                      bg={bgCard}
                      borderRadius="2xl"
                      boxShadow="0 6px 20px rgba(0,0,0,0.05)"
                    >
                      <InfoRow label="Phone" value={user.whatsappPhone} />
                      <InfoRow label="Business ID" value={user.businessId} />
                      <Badge
                        colorScheme="green"
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
                      colorScheme="red"
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
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }} // smaller on mobile, bigger on desktop
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }} // slightly smaller margin on mobile
                    color="gray.800"
                    lineHeight={{ base: "short", md: "shorter" }} // better readability
                  >
                    Role Permissions Overview
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    {user.permissions.map((p) => (
                      <Box
                        key={p.module}
                        p={5}
                        bg={bgCard}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={borderColor}
                        textAlign="center"
                        _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                      >
                        <Text fontWeight="600" mb={2}>
                          {p.module}
                        </Text>
                        <Badge
                          px={4}
                          py={1}
                          borderRadius="full"
                          colorScheme={p.access ? "green" : "red"}
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
                    fontSize={{ base: "xl", sm: "2xl", md: "2xl" }} // smaller on mobile, bigger on desktop
                    fontWeight="700"
                    mb={{ base: 3, sm: 4, md: 4 }} // slightly smaller margin on mobile
                    color="gray.800"
                    lineHeight={{ base: "short", md: "shorter" }} // better readability
                  >
                    System & Metadata
                  </Text>

                  <VStack
                    spacing={3}
                    p={6}
                    bg={bgCard}
                    borderRadius="2xl"
                    boxShadow="0 6px 20px rgba(0,0,0,0.05)"
                  >
                    <InfoRow label="Created" value={user.createdAt} />
                    <InfoRow label="Updated" value={user.updatedAt} />
                    <InfoRow
                      label="Deleted"
                      value={user.deleted ? "Yes" : "No"}
                    />
                    <InfoRow
                      label="Parent User"
                      value={user.parent || "None"}
                    />
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

function InfoRow({ label, value }) {
  return (
    <Flex
      justify="space-between"
      w="100%"
      align="center"
      px={2}
      py={1}
      _hover={{ bg: "gray.50", borderRadius: "md" }}
      transition="all 0.2s"
    >
      <Text color="gray.500" fontWeight="500" fontSize="sm">
        {label}
      </Text>
      <Text color="gray.800" fontWeight="600" fontSize="sm">
        {value}
      </Text>
    </Flex>
  );
}


