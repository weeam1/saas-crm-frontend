// import React from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   Box,
//   VStack,
//   HStack,
//   Text,
//   Badge,
//   Avatar,
//   Divider,
//   Icon,
//   Image,
//   useColorModeValue,
//   Tooltip,
//   Grid,
//   GridItem,
// } from "@chakra-ui/react";
// import {
//   FiPhone,
//   FiUser,
//   FiCalendar,
//   FiMessageSquare,
//   FiWifi,
//   FiWifiOff,
//   FiStar,
//   FiThumbsUp,
//   FiInfo,
//   FiMinus,
//   FiThumbsDown,
//   FiClock,
//   FiHash,
// } from "react-icons/fi";
// import { FaSimCard, FaWhatsapp } from "react-icons/fa";
// import { constant } from "constant";

// const CallFeedbackDetailModal = ({ isOpen, onClose, feedback }) => {
//   const bgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.600");

//   if (!feedback) return null;

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getQualityGradient = (quality) => {
//     switch (quality) {
//       case "excellent":
//         return "linear(to-r, green.400, green.600)";
//       case "good":
//         return "linear(to-r, blue.400, blue.600)";
//       case "average":
//         return "linear(to-r, yellow.400, yellow.600)";
//       case "bad":
//         return "linear(to-r, orange.400, orange.600)";
//       case "very_bad":
//         return "linear(to-r, red.400, red.600)";
//       default:
//         return "linear(to-r, gray.400, gray.600)";
//     }
//   };

//   const getStarRating = (quality) => {
//     const ratings = {
//       excellent: 5,
//       good: 4,
//       average: 3,
//       bad: 2,
//       very_bad: 1,
//     };
//     return ratings[quality] || 3;
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, index) => (
//       <Icon
//         key={index}
//         as={FiStar}
//         color={index < rating ? "yellow.400" : "gray.300"}
//         boxSize={5}
//         fill={index < rating ? "yellow.400" : "transparent"}
//       />
//     ));
//   };

//   const getMediumImage = (medium) => {
//     switch (medium) {
//       case "external_sim":
//         return { src: "/sim_logo.png", alt: "SIM Call" };
//       case "whatsapp":
//         return { src: "/whatsapp_logo.png", alt: "WhatsApp Call" };
//       case "dailer":
//         return { src: "/phone_logo.png", alt: "Phone Call" };
//       default:
//         return { src: "/phone_logo.png", alt: "Phone Call" };
//     }
//   };

//   const mediumImage = getMediumImage(feedback.callMedium);

//   const getQualityColor = (quality) => {
//     switch (quality) {
//       case "excellent":
//         return "green";
//       case "good":
//         return "blue";
//       case "average":
//         return "yellow";
//       case "bad":
//         return "orange";
//       case "very_bad":
//         return "red";
//       default:
//         return "gray";
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
//       <ModalOverlay />
//       <ModalContent bg={bgColor} borderRadius="xl" maxH="85vh">
//         <ModalHeader>
//           <HStack spacing={3}>
//             <Icon as={FiPhone} color="blue.500" />
//             <Text>Call Feedback Details</Text>
//           </HStack>
//         </ModalHeader>
//         <ModalCloseButton />

//         <ModalBody maxH="70vh" overflowY="auto" pb={6}>
//           <VStack spacing={4} align="stretch">
//             {/* Quality Indicator and Assessment - Horizontal Layout */}
//             <Grid templateColumns="repeat(2, 1fr)" gap={4}>
//               {/* <GridItem>
//                 <Box
//                   p={4}
//                   borderRadius="lg"
//                   bgGradient={getQualityGradient(feedback.callQuality)}
//                   color="white"
//                   h="full"
//                 >
//                   <VStack spacing={2} justify="center" h="full">
//                     <HStack spacing={2}>
//                       {renderStars(getStarRating(feedback.callQuality))}
//                     </HStack>
//                     <Text
//                       fontSize="lg"
//                       fontWeight="bold"
//                       textTransform="capitalize"
//                       textAlign="center"
//                     >
//                       {feedback.callQuality?.replace("_", " ")} Quality
//                     </Text>
//                   </VStack>
//                 </Box>
//               </GridItem> */}
//               <GridItem>
//                 <Box
//                   h="100%"
//                   p={4}
//                   borderWidth={1}
//                   borderRadius="lg"
//                   borderColor={borderColor}
//                 >
//                   <VStack spacing={3} align="start">
//                     <HStack spacing={3}>
//                       <Avatar
//                         src={`${constant.baseUrl}/${feedback.user?.profileImage}`}
//                         size="md"
//                         name={feedback.user?.username}
//                         bg="blue.500"
//                         color="white"
//                       />
//                       <Box>
//                         <Text fontWeight="bold" fontSize="md">
//                           {feedback.user?.fullName || "Unknown User"}
//                         </Text>
//                         <Text fontSize="sm" color="gray.600">
//                           @{feedback.user?.username}
//                         </Text>
//                       </Box>
//                     </HStack>
//                     <HStack spacing={2}>
//                       <Icon as={FiHash} color="purple.500" boxSize={4} />
//                       <Text fontSize="sm">Ext: {feedback.userExtensionId}</Text>
//                     </HStack>
//                     {feedback.user?.roles && feedback.user.roles.length > 0 && (
//                       <HStack spacing={2} align="center" flexWrap="wrap">
//                         <Text fontSize="sm" fontWeight="medium">
//                           Roles:
//                         </Text>

//                         {feedback.user.roles.map((role, index) => (
//                           <Badge
//                             key={index}
//                             colorScheme="blue"
//                             variant="subtle"
//                             size="sm"
//                           >
//                             {role.roleName}
//                           </Badge>
//                         ))}
//                       </HStack>
//                     )}
//                   </VStack>
//                 </Box>
//               </GridItem>

//               <GridItem>
//                 <Box
//                   p={3}
//                   borderWidth={1}
//                   borderRadius="lg"
//                   borderColor={borderColor}
//                   h="full"
//                 >
//                   <VStack spacing={3} align="stretch" justify="center" h="full">
//                     <Text fontWeight="medium" fontSize="md">
//                       Call Quality Assessment
//                     </Text>
//                     <Grid templateColumns="repeat(2, 1fr)" gap={2}>
//                       <GridItem>
//                         <VStack spacing={1} align="start">
//                           <Text
//                             fontSize="xs"
//                             fontWeight="medium"
//                             color="gray.600"
//                           >
//                             Rating:
//                           </Text>
//                           <Badge
//                             colorScheme={getQualityColor(feedback.callQuality)}
//                             variant="solid"
//                             size="sm"
//                             textTransform="capitalize"
//                           >
//                             {feedback.callQuality?.replace("_", " ")}
//                           </Badge>
//                         </VStack>
//                       </GridItem>
//                       <GridItem>
//                         <VStack spacing={1} align="start">
//                           <Text
//                             fontSize="xs"
//                             fontWeight="medium"
//                             color="gray.600"
//                           >
//                             Issue:
//                           </Text>
//                           <Badge
//                             colorScheme={feedback.reason ? "red" : "green"}
//                             variant="subtle"
//                             size="sm"
//                           >
//                             {feedback.reason || "No Issues"}
//                           </Badge>
//                         </VStack>
//                       </GridItem>
//                     </Grid>
//                     <HStack spacing={2} justify="center">
//                       {/* <Text fontSize="sm" fontWeight="medium" color="gray.600">
//                         Stars:
//                       </Text> */}
//                       <HStack spacing={1}>
//                         {renderStars(getStarRating(feedback.callQuality))}
//                       </HStack>
//                       {/* <Text fontSize="sm" color="gray.500">
//                         ({getStarRating(feedback.callQuality)}/5)
//                       </Text> */}
//                     </HStack>
//                   </VStack>
//                 </Box>
//               </GridItem>
//             </Grid>

//             {/* User, Lead, and Call Information - 3 Column Layout */}
//             {/* User and Call Information - 2 Column Layout */}
//             <Grid templateColumns="repeat(2, 1fr)" gap={4} alignItems="stretch">
//               <GridItem>
//                 <Box
//                   h="100%"
//                   p={4}
//                   borderWidth={1}
//                   borderRadius="lg"
//                   borderColor={borderColor}
//                 >
//                   <VStack spacing={3} align="stretch">
//                     <Text fontWeight="medium" fontSize="md">
//                       Call Information
//                     </Text>

//                     <VStack spacing={3} align="stretch">
//                       {/* Lead Name */}
//                       {feedback.lead?.leadName && (
//                         <HStack spacing={2} align="center" wrap="nowrap">
//                           <Icon as={FiUser} color="green.500" boxSize={4} />
//                           <Text fontSize="sm" fontWeight="medium">
//                             Lead:
//                           </Text>
//                           <Text fontSize="sm" whiteSpace="nowrap">
//                             {feedback.lead.leadName}
//                           </Text>
//                         </HStack>
//                       )}

//                       {/* Started */}
//                       <HStack spacing={2} align="center" wrap="nowrap">
//                         <Icon as={FiCalendar} color="purple.500" boxSize={4} />
//                         <Text fontSize="sm" fontWeight="medium">
//                           Started:
//                         </Text>
//                         <Text fontSize="sm" whiteSpace="nowrap">
//                           {formatDate(feedback.createdAt)}
//                         </Text>
//                       </HStack>

//                       {/* Updated */}
//                       {/* <HStack spacing={2} align="center" wrap="nowrap">
//                         <Icon as={FiClock} color="blue.500" boxSize={4} />
//                         <Text fontSize="sm" fontWeight="medium">
//                           Updated:
//                         </Text>
//                         <Text fontSize="sm" whiteSpace="nowrap">
//                           {formatDate(feedback.updatedAt)}
//                         </Text>
//                       </HStack> */}

//                       {/* Medium */}
//                       <HStack spacing={2} align="center" wrap="nowrap">
//                         <Tooltip label={mediumImage.alt}>
//                           <Image
//                             src={mediumImage.src}
//                             alt={mediumImage.alt}
//                             boxSize={4}
//                             objectFit="contain"
//                           />
//                         </Tooltip>
//                         <Text fontSize="sm" fontWeight="medium">
//                           Medium:
//                         </Text>
//                         <Text
//                           fontSize="sm"
//                           textTransform="capitalize"
//                           whiteSpace="nowrap"
//                         >
//                           {feedback.callMedium?.replace("_", " ")}
//                         </Text>
//                       </HStack>
//                     </VStack>
//                   </VStack>
//                 </Box>
//               </GridItem>
//             </Grid>

//             {/* Call Description - Full Width */}
//             {feedback.description && (
//               <Box
//                 p={3}
//                 borderWidth={1}
//                 borderRadius="lg"
//                 borderColor={borderColor}
//               >
//                 <VStack spacing={2} align="stretch" h="full">
//                   <HStack spacing={2} align="start">
//                     <Text fontWeight="medium" fontSize="md">
//                       Description
//                     </Text>
//                   </HStack>
//                   <Text
//                     lineHeight="1.6"
//                     whiteSpace="pre-wrap"
//                     fontSize="sm"
//                     flex={1}
//                   >
//                     {feedback.description}
//                   </Text>
//                 </VStack>
//               </Box>
//             )}
//           </VStack>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CallFeedbackDetailModal;

import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  Grid,
  GridItem,
  useColorModeValue,
  Icon,
  Divider,
  Stack,
} from "@chakra-ui/react";
import {
  FaHeadset,
  FaStar,
  FaUserCircle,
  FaPhoneAlt,
  FaFileAlt,
  FaTimes,
  FaDownload,
  FaCheck,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const CallFeedbackModal = ({ isOpen, onClose, feedback }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue(
    "linear-gradient(135deg, #2c3e50, #4a6491)",
    "linear-gradient(135deg, #1a202c, #2d3748)"
  );
  const infoBg = useColorModeValue("#f8f9fa", "gray.700");
  const highlightBg = useColorModeValue("#fffde7", "yellow.900");
  const highlightBorder = useColorModeValue("#fff9c4", "yellow.700");
  const borderColor = useColorModeValue("#eaeaea", "gray.600");
  const getQualityStyles = (quality) => {
    switch (quality) {
      case "excellent":
        return { bg: "#e8f5e9", color: "#2e7d32" }; // green
      case "good":
        return { bg: "#e3f2fd", color: "#1565c0" }; // blue
      case "average":
        return { bg: "#fffde7", color: "#f57f17" }; // yellow
      case "bad":
        return { bg: "#fff3e0", color: "#ef6c00" }; // orange
      case "very_bad":
        return { bg: "#ffebee", color: "#c62828" }; // red
      default:
        return { bg: "#f4f6f8", color: "#555" }; // neutral
    }
  };
  const qualityStyles = getQualityStyles(feedback?.callQuality);
  const getRatingFromQuality = (quality) => {
    switch (quality) {
      case "excellent":
        return 5;
      case "good":
        return 4;
      case "average":
        return 3;
      case "bad":
        return 2;
      case "very_bad":
        return 1;
      default:
        return 3;
    }
  };

  const rating = getRatingFromQuality(feedback?.callQuality);

  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
      zIndex={1000}
    >
      <Box
        w="100%"
        maxW="650px"
        maxH="85vh"
        bg={bgColor}
        borderRadius="12px"
        boxShadow="0 10px 30px rgba(0, 0, 0, 0.1)"
        overflow="hidden"
        animation="fadeIn 0.4s ease-out"
      >
        {/* Header */}
        <Box bg={headerBg} color="white" p={6} position="relative">
          <Flex justify="space-between" align="center" mb={2}>
            <Flex align="center">
              <Icon as={FaHeadset} mr={3} fontSize="24px" />
              <Text fontSize="24px" fontWeight="600">
                Call Feedback Details
              </Text>
            </Flex>
            <Button
              bg="rgba(255, 255, 255, 0.2)"
              border="none"
              w="36px"
              h="36px"
              borderRadius="50%"
              color="white"
              fontSize="18px"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                bg: "rgba(255, 255, 255, 0.3)",
                transform: "rotate(90deg)",
              }}
              onClick={onClose}
              minW="36px"
              p={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaTimes} />
            </Button>
          </Flex>
          <Text fontSize="15px" opacity="0.9" mt={1}>
            Call ID: EX{feedback.userExtensionId}
          </Text>
        </Box>

        {/* Body */}
        <Box p={6} overflowY="auto" maxH="calc(85vh - 120px)">
          <Stack spacing={8}>
            {/* Quality Assessment */}
            <Box>
              <Flex
                align="center"
                mb={4}
                pb={2}
                borderBottom={`1px solid ${borderColor}`}
              >
                {/* <Icon as={FaStar} mr={3} color="#4a6491" /> */}
                <Text fontSize="16px" fontWeight="600" color="#2c3e50">
                  Quality Assessment
                </Text>
              </Flex>

              <Flex align="center" mb={4}>
                <Text fontSize="28px" fontWeight="700" color="#2c3e50" mr={4}>
                  {rating}.0
                </Text>

                <Flex>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={FaStar}
                      fontSize="20px"
                      mr={1}
                      color={star <= rating ? "#ffc107" : "#ddd"}
                    />
                  ))}
                </Flex>
              </Flex>

              <Stack direction="row" spacing={3} flexWrap="wrap">
                <Badge
                  display="inline-flex"
                  alignItems="center"
                  px={4}
                  py={2}
                  borderRadius="20px"
                  fontWeight="500"
                  fontSize="14px"
                  bg={qualityStyles.bg}
                  color={qualityStyles.color}
                >
                  <Icon as={FaCheckCircle} mr={2} />
                  {feedback?.callQuality?.toUpperCase() || "Good"} Quality
                </Badge>

                <Badge
                  display="inline-flex"
                  alignItems="center"
                  px={4}
                  py={2}
                  borderRadius="20px"
                  fontWeight="500"
                  fontSize="14px"
                  bg="#fff3e0"
                  color="#ef6c00"
                >
                  <Icon as={FaExclamationTriangle} mr={2} />
                  {feedback?.reason || "No Issues Reported"}
                </Badge>
              </Stack>
            </Box>

            {/* Account Details */}
            <Box>
              <Flex
                align="center"
                mb={4}
                pb={2}
                borderBottom={`1px solid ${borderColor}`}
              >
                <Icon as={FaUserCircle} mr={3} color="#4a6491" />
                <Text fontSize="16px" fontWeight="600" color="#2c3e50">
                  Account Details
                </Text>
              </Flex>

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Account
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.user?.fullName}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Email
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.user?.username}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Role
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.user?.roles[0].roleName}
                  </Box>
                </Box>
              </Grid>
            </Box>

            {/* Call Information */}
            <Box>
              <Flex
                align="center"
                mb={4}
                pb={2}
                borderBottom={`1px solid ${borderColor}`}
              >
                <Icon as={FaPhoneAlt} mr={3} color="#4a6491" />
                <Text fontSize="16px" fontWeight="600" color="#2c3e50">
                  Call Information
                </Text>
              </Flex>

              <Grid templateColumns="1fr 1fr" gap={4}>
                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Started
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {formatDateTime(feedback?.createdAt)}
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Medium
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.callMedium?.toUpperCase()}
                  </Box>
                </Box>

                {/* <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Call Type
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback.callMedium}
                  </Box>
                </Box> */}

                <Box>
                  <Text fontSize="13px" color="#7f8c8d" mb={1}>
                    Lead
                  </Text>
                  <Box
                    fontSize="15px"
                    fontWeight="500"
                    color="#2c3e50"
                    p={2}
                    bg={infoBg}
                    borderRadius="6px"
                    borderLeft="3px solid #4a6491"
                  >
                    {feedback?.lead?.leadName || "No Lead Assigned"}
                  </Box>
                </Box>
              </Grid>
            </Box>

            {/* Call Description */}
            <Box>
              <Box
                p={5}
                borderRadius="8px"
                border={`1px solid ${highlightBorder}`}
                bg={highlightBg}
              >
                <Flex align="center" mb={3}>
                  <Icon as={FaFileAlt} mr={2} color="#ff9800" />
                  <Text fontWeight="600" color="#5d4037">
                    Call Description
                  </Text>
                </Flex>
                <Text>{feedback?.description}</Text>
              </Box>
            </Box>
          </Stack>
        </Box>

        {/* Footer Actions
    <Flex
      justify="flex-end"
      p={6}
      borderTop={`1px solid ${borderColor}`}
      bg="#fafbfc"
    >
      <Button
        bg="#f0f0f0"
        color="#555"
        mr={3}
        px={6}
        py={2}
        borderRadius="6px"
        fontWeight="500"
        fontSize="15px"
        _hover={{ bg: "#e0e0e0" }}
        leftIcon={<Icon as={FaDownload} />}
      >
        Export Details
      </Button>
      <Button
        bg="#4a6491"
        color="white"
        px={6}
        py={2}
        borderRadius="6px"
        fontWeight="500"
        fontSize="15px"
        _hover={{ bg: "#3a5479" }}
        leftIcon={<Icon as={FaCheck} />}
      >
        Mark as Reviewed
      </Button>
    </Flex> */}
      </Box>
    </Box>
  );
};

export default CallFeedbackModal;
