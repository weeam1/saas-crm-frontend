import React from "react";
import { Box, Text, Image, VStack } from "@chakra-ui/react";
import no_permission from "assets/img/nopermission/no_permission.png";

const NotPermission = ({ moduleFound }) => {
  if (moduleFound) return null;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      width="100%"
      px={4}
    >
      <VStack spacing={6} maxW="md" textAlign="center">
        <Image
          src={no_permission}
          alt="No Permission"
          maxW={{ base: "80%", md: "60%" }}
          borderRadius="lg"
          objectFit="contain"
        />
        <Text fontSize={{ base: "md", md: "xl" }} color="gray.600">
          You don't have permission or access. Contact the super admin or admin.
        </Text>
      </VStack>
    </Box>
  );
};

export default NotPermission;
