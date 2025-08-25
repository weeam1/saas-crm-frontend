import React, { useMemo } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { usePermissions } from "hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@chakra-ui/icons"; // arrow

import sidebarRoutes from "sidebarRoutes";

const PermissionSection = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  // filter by permissions
  const visibleRoutes = useMemo(() => {
    return sidebarRoutes?.filter((route) => {
      if (!route.moduleId) return true;
      return hasPermission(route.moduleId);
    });
  }, [hasPermission]);

  return (
    <Box my={6}>
      {/* Fancy Heading */}
      <Heading
        textAlign="center"
        size="lg"
        mb={3}
        color="brand.600"
        fontWeight="bold"
      >
        Available Permissions
      </Heading>
      <Divider
        borderColor="brand.400"
        opacity={0.6}
        w="120px"
        mx="auto"
        mb={8}
      />

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={8}>
        {visibleRoutes.map((route) => (
          <Box
            key={route.moduleId}
            onClick={() => navigate(route.path)}
            cursor="pointer"
            p={6}
            rounded="2xl"
            bg="white"
            shadow="md"
            borderWidth="1px"
            borderColor="gray.100"
            transition="all 0.25s ease"
            _hover={{
              transform: "translateY(-6px) scale(1.02)",
              shadow: "xl",
              borderColor: "brand.400",
              bgGradient: "linear(to-b, white, brand.50)",
            }}
          >
            <VStack spacing={4}>
              {/* Icon Circle */}
              <Box
                w="56px"
                h="56px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                rounded="full"
                bg="brand.50"
                color="brand.500"
                fontSize="2xl"
                shadow="sm"
              >
                {route.icon}
              </Box>

              {/* Title */}
              <Text fontWeight="semibold" color="gray.700" fontSize="md">
                {route.name}
              </Text>

              {/* Arrow at bottom */}
              <ChevronRightIcon
                boxSize={6}
                color="brand.400"
                transition="transform 0.2s"
                _groupHover={{ transform: "translateX(4px)" }}
              />
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PermissionSection;
