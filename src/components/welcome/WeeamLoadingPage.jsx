import React from "react";
import { Box, Image, keyframes, useBreakpointValue } from "@chakra-ui/react";
import logo from "assets/logo/logo.png";
import "./loader.css"; // Import the CSS file below

const shimmer = keyframes`
  0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%) skewX(-20deg); opacity: 0; }
`;

const glowPulse = keyframes`
  0% { filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.15)); }
  50% { filter: drop-shadow(0px 0px 20px rgba(0,0,0,0.3)); }
  100% { filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.15)); }
`;

const WeeamLoadingPage = () => {
  const logoSize = useBreakpointValue({
    base: "80px",
    md: "100px",
    lg: "150px",
  });

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
      {/* Logo with shimmer and glow */}
      <Box
        position="relative"
        overflow="hidden"
        animation={`${glowPulse} 3s ease-in-out infinite`}
      >
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

      {/* Custom Dot Loader */}
      <div className="dot-loader" />
    </Box>
  );
};

export default WeeamLoadingPage;
