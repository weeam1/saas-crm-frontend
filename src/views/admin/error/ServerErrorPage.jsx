import React from "react";
import { Box, Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Server_Page_Error from "assets/error/server_page_error.png"; 

// Motion wrapper for animations
const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function ServerErrorPage() {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      px={6}
    >
      <MotionBox
        textAlign="center"
        py={10}
        px={6}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Error Illustration */}
        <Image
          src={Server_Page_Error}
          alt="Server Error"
          maxW="400px"
          mx="auto"
          mb={6}
        />

        {/* Heading */}
        <Heading
          as="h2"
          size="xl"
          mb={2}
          color="red.500"
        >
          Server Unavailable
        </Heading>

        {/* Subtext */}
        <Text fontSize="lg" color="gray.600" mb={8}>
          Our server is not responding at the moment.<br />
          Please try again later.
        </Text>

        {/* Button */}
        <MotionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          colorScheme="brand" // ✅ brand color
          px={8}
          py={6}
          fontSize="md"
          borderRadius="xl"
          shadow="md"
          onClick={() => window.location.reload()}
        >
          Try Again
        </MotionButton>
      </MotionBox>
    </Flex>
  );
}
