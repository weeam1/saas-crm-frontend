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

// lighter gradients for a softer look
const gradients = [
  "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", // light blue → sky
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", // pink → lavender
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // peach → soft orange
  "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)", // lime → mint
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", // light gold → coral
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", // mint → sky blue
  "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)", // soft gray → light blue
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)", // lavender → baby blue
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", // soft pink blend
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)", // warm cream → aqua
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
              shadow="md"
              position="relative"
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                shadow: "xl",
              }}
              cursor="pointer"
              onClick={() => navigate(route.path)}
              backdropFilter="blur(6px) saturate(140%)"
            >
              {/* Icon */}
              <Flex justify="space-between" align="center" mb={4}>
                <Box
                  bg="whiteAlpha.700"
                  p={3}
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="gray.700"
                >
                  {route.icon}
                </Box>
              </Flex>

              {/* Texts */}
              <VStack align="flex-start" spacing={2}>
                <Text fontWeight="bold" fontSize="md" color="gray.800">
                  {route.name}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {moduleDescriptions[route.moduleId] ||
                    "Module functionality."}
                </Text>

                {/* Action button */}
                <Button
                  size="sm"
                  variant="solid"
                  bg="white"
                  color="gray.800"
                  width="100%"
                  boxShadow="sm"
                  _hover={{ boxShadow: "md", transform: "scale(1.02)" }}
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
