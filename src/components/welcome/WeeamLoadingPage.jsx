import React from "react";
import { Box, Image, Spinner, keyframes, useBreakpointValue, Text } from "@chakra-ui/react";
import logo from "assets/logo/logo.png";

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%) skewX(-20deg); opacity: 0; }
`;

const glowPulse = keyframes`
  0% { filter: drop-shadow(0px 0px 5px rgba(255,255,255,0.2)); }
  50% { filter: drop-shadow(0px 0px 25px rgba(255,255,255,0.6)); }
  100% { filter: drop-shadow(0px 0px 5px rgba(255,255,255,0.2)); }
`;

const WeeamLoadingPage = () => {
  const logoSize = useBreakpointValue({ base: "80px", md: "100px", lg: "150px" });

  return (
    <Box
      bg="white"
      h="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      {/* Logo  */}
      <Box position="relative" overflow="hidden" animation={`${glowPulse} 3s ease-in-out infinite`}>
        <Image
          src={logo}
          alt="logo"
          boxSize={logoSize}
          objectFit="contain"
          draggable={false}
        />
        {/* Shimmer overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          h="100%"
          w="100%"
          bgGradient="linear(to-r, transparent, rgba(255,255,255,0.3), transparent)"
          animation={`${shimmer} 2s linear infinite`}
        />
      </Box>

      {/* Spinner */}
      <Spinner
        mt={4}
        thickness="5px"
        speed="0.8s"
        emptyColor="gray.600"
        color="white"
        size="md"
      />
      
      <Text
        mt={2}
        color="black.800"
        fontSize="md"
        fontWeight="medium"
        letterSpacing="wide"
        animation="pulse 1.5s infinite"
        sx={{
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.3 },
            "50%": { opacity: 1 },
          },
        }}
      >
        Loading...
      </Text>
    </Box>
  );
};

export default WeeamLoadingPage;
