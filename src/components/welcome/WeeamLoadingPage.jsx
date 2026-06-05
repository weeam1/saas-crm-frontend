// import React from "react";
// import { Box, Image, keyframes, useBreakpointValue } from "@chakra-ui/react";
// import logo from "assets/logo/logo.png";
// import "./loader.css"; // Import the CSS file below
// import useUserSession from "hooks/useUserSession";

// const shimmer = keyframes`
//   0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
//   50% { opacity: 1; }
//   100% { transform: translateX(100%) skewX(-20deg); opacity: 0; }
// `;

// const glowPulse = keyframes`
//   0% { filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.15)); }
//   50% { filter: drop-shadow(0px 0px 20px rgba(0,0,0,0.3)); }
//   100% { filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.15)); }
// `;

// const WeeamLoadingPage = () => {
//   const logoSize = useBreakpointValue({
//     base: "80px",
//     md: "100px",
//     lg: "150px",
//   });
// const {agencyLogo}=useUserSession()
//   return (
//     <Box
//       bg="white"
//       h="100vh"
//       display="flex"
//       flexDirection="column"
//       justifyContent="center"
//       alignItems="center"
//       position="relative"
//       overflow="hidden"
//     >
//       {/* Logo with shimmer and glow */}
//       <Box
//         position="relative"
//         overflow="hidden"
//         animation={`${glowPulse} 3s ease-in-out infinite`}
//       >
//         <Image
//           src={agencyLogo}
//           alt="logo"
//           boxSize={logoSize}
//           objectFit="contain"
//           draggable={false}
//         />
//         {/* Shimmer overlay */}
//         <Box
//           position="absolute"
//           top="0"
//           left="0"
//           h="100%"
//           w="100%"
//           bgGradient="linear(to-r, transparent, rgba(255,255,255,0.3), transparent)"
//           animation={`${shimmer} 2s linear infinite`}
//         />
//       </Box>

//       {/* Custom Dot Loader */}
//       <div className="dot-loader" />
//     </Box>
//   );
// };

// export default WeeamLoadingPage;


import React from "react";
import {
  Box,
  Image,
  Text,
  keyframes,
  useBreakpointValue,
  VStack,
  Progress,
  Flex,
} from "@chakra-ui/react";
import logo from "assets/logo/logo.png";
import useUserSession from "hooks/useUserSession";

// Elegant golden pulse animation for the logo
const goldPulse = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.3)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.6)); transform: scale(1.02); }
  100% { filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.3)); transform: scale(1); }
`;

// Subtle shimmer across the logo
const shimmer = keyframes`
  0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
  50% { opacity: 0.4; }
  100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
`;

// Fade-in-up animation for text elements
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Progress bar fill animation (width from 0 to 100%)
const progressFill = keyframes`
  0% { width: 0%; }
  20% { width: 15%; }
  40% { width: 35%; }
  60% { width: 65%; }
  80% { width: 85%; }
  100% { width: 100%; }
`;

const WeeamLoadingPage = () => {
  const logoSize = useBreakpointValue({
    base: "90px",
    md: "120px",
    lg: "160px",
  });
  const { agencyLogo, agencyName } = useUserSession();
  const displayName = agencyName || "Weam CRM";

  return (
    <Box
      bg="bg.app" // navy.900 background
      h="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      {/* Animated background gradient (subtle golden waves) */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="radial-gradient(circle at 20% 40%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="radial-gradient(circle at 80% 60%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)"
        pointerEvents="none"
      />

      {/* Main content */}
      <VStack spacing={6} zIndex={1}>
        {/* Logo container with gold glow and shimmer */}
        {/* <Box
          position="relative"
          animation={`${goldPulse} 2.5s ease-in-out infinite`}
          borderRadius="full"
          bg="rgba(212, 175, 55, 0.05)"
          p={4}
        >
          <Image
            src={agencyLogo || logo}
            alt={`${displayName} logo`}
            boxSize={logoSize}
            objectFit="contain"
            draggable={false}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            h="100%"
            w="100%"
            bgGradient="linear(to-r, transparent, rgba(255,255,255,0.15), transparent)"
            animation={`${shimmer} 2.2s ease-in-out infinite`}
            pointerEvents="none"
            borderRadius="full"
          />
        </Box> */}

        {/* App name / greeting with fade-in animation */}
        <VStack spacing={2} animation={`${fadeInUp} 0.6s ease-out`}>
          {/* <Text
            fontSize={{ base: "xl", md: "2xl" }}ead
            fontWeight="bold"
            color="text.heading"
            letterSpacing="tight"
          >
            {displayName}
          </Text> */}
          <Text
            fontSize={{ base: "sm", md: "md", lg: 'lg' }}
            color="text.accent"
            fontWeight="500"
          >
            Enterprise CRM Platform
          </Text>
        </VStack>

        {/* Modern progress bar (simulates loading) */}
        <Box w={{ base: "220px", md: "280px" }} mt={4}>
          <Progress
            value={0}
            size="sm"
            w='100%'
            borderRadius="full"
            bg="rgba(212, 175, 55, 0.2)"
            sx={{
              "& > div": {
                animation: `${progressFill} 2s ease-out forwards`,
                bgGradient: "linear-gradient(90deg, #D4AF37, #F5D67B, #D4AF37)",
              },
            }}
          />
        </Box>

        {/* Loading message with ellipsis animation */}
        <Text
          fontSize="xs"
          color="text.muted"
          mt={2}
          animation={`${fadeInUp} 0.6s ease-out 0.2s both`}
        >
          Securely loading your workspace
          <span className="dot-animation">...</span>
        </Text>
      </VStack>

      {/* Inline style for dot animation (if not using keyframes) */}
      <style jsx>{`
        .dot-animation {
          animation: blink 1.4s infinite;
        }
        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </Box>
  );
};

export default WeeamLoadingPage;