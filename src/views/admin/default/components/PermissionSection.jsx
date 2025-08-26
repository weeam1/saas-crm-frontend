import React, { useMemo } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Button,
  Flex,
} from "@chakra-ui/react";
import { usePermissions } from "hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import sidebarRoutes from "sidebarRoutes";
import { ExternalLinkIcon } from "@chakra-ui/icons";

// descriptions for each module
const moduleDescriptions = {
  leads: "Manage and track leads efficiently.",
  leadpool_admin: "Central pool of shared leads.",
  deal: "Handle client deals and progress.",
  announcement: "Post and manage announcements.",
  hiring: "Track hiring and candidates.",
  attendance: "Monitor employee attendance.",
  invoice: "Create and manage invoices.",
  expense: "Record and control expenses.",
  task: "Assign and track tasks.",
  listing: "Manage property or item listings.",
  survey: "Collect insights through surveys.",
  sip: "Log and monitor call activities.",
  reports: "Analytics and reporting dashboard.",
  users: "Manage user accounts and roles.",
  system_log: "Track system activities and logs.",
};

const gradients = [
  "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",  // indigo → purple
  "linear-gradient(135deg, #d53f8c 0%, #e53e3e 100%)",  // pink → red
  "linear-gradient(135deg, #3182ce 0%, #00b5d8 100%)",  // blue → cyan
  "linear-gradient(135deg, #38a169 0%, #319795 100%)",  // green → teal
  "linear-gradient(135deg, #dd6b20 0%, #d69e2e 100%)",  // orange → yellow

  "linear-gradient(135deg, #7928ca 0%, #ff0080 100%)",  // violet → pink
  "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",  // red-orange → pink
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", // dark teal
  "linear-gradient(135deg, #06beb6 0%, #48b1bf 100%)",  // aqua → teal
  "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",  // golden → yellow

  "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",  // light blue → blue
  "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",  // purple → deep violet
  "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",  // orange → magenta
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",  // emerald → green
  "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",  // pink → indigo
];

const PermissionSection = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // filter by permissions
  const visibleRoutes = useMemo(() => {
    return sidebarRoutes?.filter((route) => {
      if (!route.moduleId) return true;
      if (route.moduleId === "dashboard") return false;
      return hasPermission(route.moduleId);
    });
  }, [hasPermission]);

  return (
    <Box my={8} px={[2, 4, 6]}>
      {/* Heading */}
      <Heading size="lg" mb={8} color="gray.700" fontWeight="bold">
        Modules
      </Heading>

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={8}>
        {visibleRoutes.map((route, index) => {
          const bgColor = gradients[index % gradients.length];

          return (
            <Box
              key={route.moduleId}
              bg={bgColor}
              p={6}
              borderRadius="xl"
              shadow="lg"
              position="relative"
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "2xl",
              }}
              cursor="pointer"
              onClick={() => navigate(route.path)}
              backdropFilter="blur(10px) saturate(180%)"
            >
              {/* Icon */}
              <Flex justify="space-between" align="center" mb={4}>
                <Box
                  bg="whiteAlpha.300"
                  p={3}
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color={"white"}
                >
                  {route.icon}
                </Box>
              </Flex>

              {/* Texts */}
              <VStack align="flex-start" spacing={2}>
                <Text fontWeight="bold" fontSize="md" color="white">
                  {route.name}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.800">
                  {moduleDescriptions[route.moduleId] ||
                    "Module functionality."}
                </Text>

                {/* Action button */}
                <Button
                  size="sm"
                  variant="solid"
                  bg="whiteAlpha.700"
                  color="gray.800"
                  width="100%"
                  boxShadow="md"
                  _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
                  backdropFilter="blur(8px) saturate(150%)"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(route.path);
                  }}
                  rightIcon={<ExternalLinkIcon />}
                >
                  Open Module
                </Button>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default PermissionSection;
