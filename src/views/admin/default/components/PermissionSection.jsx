import React, { useMemo } from "react";
import { Box, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { usePermissions } from "hooks/usePermissions";
import { useNavigate } from "react-router-dom"; // if using react-router-dom v5
import sidebarRoutes from "sidebarRoutes";

const PermissionSection = () => {
  const navigate = useNavigate()
  const { hasPermission } = usePermissions();

  // filter by permissions
  const visibleRoutes = useMemo(() => {
    return sidebarRoutes?.filter((route) => {
      if (!route.moduleId) return true;
      return hasPermission(route.moduleId);
    });
  }, [hasPermission]);

  return (
    <Box my={3}>

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {visibleRoutes.map((route) => (
          <Box
            key={route.moduleId}
            onClick={() => navigate(route.path)}
            cursor="pointer"
            p={5}
            rounded="xl"
            bg="white"
            shadow="md"
            borderWidth="1px"
            borderColor="gray.100"
            transition="all 0.2s"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl",
              borderColor: "brand.400",
            }}
          >
            <VStack spacing={3}>
              <Box
                w="48px"
                h="48px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                rounded="full"
                bg="brand.50"
                color="brand.500"
                fontSize="2xl"
              >
                {route.icon}
              </Box>
              <Text fontWeight="semibold" color="gray.700">
                {route.name}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PermissionSection;
