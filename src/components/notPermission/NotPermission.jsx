import React from "react";
import { Box, Text, Image, VStack } from "@chakra-ui/react";
import no_permission from "assets/img/nopermission/no_permission.png";

const NotPermission = ({moduleName}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="65vh"
      width="100%"
      p={4}
      bg="white"
      borderRadius={"md"}
      overflow={"hidden"}
    >
      <VStack  textAlign="center">
        <Image
          src={no_permission}
          alt="No Permission"
          maxW={{ base: "80%", md: "60%" }}
          borderRadius="lg"
          objectFit="cover"
          filter="grayscale(100%)"
        />
        <Text fontSize={{ base: "md", md: "xl" }} color="gray.600" fontWeight="medium" mb={{base:2 , sm:2, md:0}}>
          Access restricted of {moduleName} module.
          <br /> Please contact your administrator for permission.
        </Text>
      </VStack>
    </Box>
  );
};

export default NotPermission;
