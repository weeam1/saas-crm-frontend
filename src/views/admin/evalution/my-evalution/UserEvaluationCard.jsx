// import {
//   Box,
//   Flex,
//   Avatar,
//   Text,
//   Badge,
//   IconButton,
//   Center,
//   Tooltip,
//   SimpleGrid,
//   CircularProgress,
//   Stack,
//   Skeleton,
//   Icon,
//   useDisclosure,
//   Modal,
//   HStack,
//   ModalOverlay,
//   useColorModeValue,
//   VStack,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
// } from "@chakra-ui/react";
// import { constant } from "constant";
// import {
//   FiEye,
//   FiClock,
//   FiCheck,
//   FiCalendar,
//   FiTrash2,
//   FiUsers,
//   FiBarChart2,
// } from "react-icons/fi";
// import { FaPlus } from "react-icons/fa6";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import NoData from "components/Message/NoData";
// import { getBadgeColors } from "utils/colorUtils";
// import useUserSession from "hooks/useUserSession";
// import { format } from "date-fns";
// import { toast } from "react-toastify";

// // Skeleton card while loading
// const CardSkeleton = () => (
//   <Box
//     bg="white"
//     rounded="2xl"
//     border="1px solid"
//     borderColor="gray.200"
//     p={4}
//     overflow="hidden"
//     boxShadow="md"
//     position="relative"
//     minH="240px"
//   >
//     <Skeleton height="4px" borderTopRadius="2xl" mb={4} />
//     <Box
//       position="absolute"
//       top="4px"
//       right={0}
//       w="140px"
//       h="140px"
//       bg="gray.100"
//       opacity={0.3}
//       borderRadius="0 0 0 100%"
//     />
//     <Flex justify="space-between" align="flex-start" mb={4}>
//       <Flex gap={3}>
//         <Skeleton circle size="64px" />
//         <Stack spacing={2}>
//           <Skeleton height="18px" width="140px" />
//           <Skeleton height="16px" width="90px" />
//           <Skeleton height="16px" width="110px" />
//         </Stack>
//       </Flex>
//       <Stack spacing={3}>
//         <Skeleton height="32px" width="32px" />
//         <Skeleton height="32px" width="32px" />
//       </Stack>
//     </Flex>
//     <Flex gap={6} align="center">
//       <Stack spacing={2} flexShrink={0}>
//         <Skeleton height="16px" width="90px" />
//         <Skeleton height="16px" width="90px" />
//         <Skeleton height="20px" width="110px" />
//       </Stack>
//       <Skeleton circle size="90px" />
//     </Flex>
//   </Box>
// );

// const UserEvaluationCards = ({
//   data = [],
//   isLoading,
//   confirmDelete,
//   setView,
//   month,
//   year,
// }) => {
//   const navigate = useNavigate();
//   const { user: loggedInUser } = useUserSession();
//   const [delayedLoading, setDelayedLoading] = useState(isLoading);
//   const [deleteEvaluation, { isLoading: isDeleting }] =

//   // Delete modal state
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [selectedRow, setSelectedRow] = useState(null);
//   const subTextColor = useColorModeValue("gray.600", "gray.300");
//   useEffect(() => {
//     let timer;
//     if (isLoading) setDelayedLoading(true);
//     else timer = setTimeout(() => setDelayedLoading(false), 400);
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   // Confirm delete function

//   // Helper function to format month-year
//   const formatMonthYear = (row) => {
//     if (row?.month && row?.year) {
//       return format(new Date(row.year, row.month - 1), "MMM yyyy");
//     }
//     return "N/A";
//   };

//   return (
//     <>
//       <Box my={4}>
//         {delayedLoading ? (
//           <SimpleGrid
//             columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
//             spacing={4}
//           >
//             {Array.from({ length: 10 }).map((_, i) => (
//               <CardSkeleton key={i} />
//             ))}
//           </SimpleGrid>
//         ) : data.length === 0 ? (
//           <Center py={10}>
//             <NoData label="user evaluation" />
//           </Center>
//         ) : (
//           <SimpleGrid
//             columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
//             spacing={4}
//           >
//             {data.map((user) => {
//               // Get aggregated evaluation data
//               const evaluations = user?.evaluations || [];
//               const finalEvaluation = {
//                 totalEvaluators: user.totalEvaluators ?? 0,
//                 finalAvg: user.finalAvg ?? 0,
//                 finalPercentage: user.finalPercentage ?? 0,
//               };
//               const hasEvaluated = evaluations.length > 0;

//               // Role & agency
//               const roleName = user?.user?.roles?.[0]?.roleName || "Unknown";
//               const agencyName = user?.agency?.name || "No Agency";

//               const { bg: roleBg, text: roleText } = getBadgeColors(roleName);
//               const { bg: agencyBg, text: agencyText } =
//                 getBadgeColors(agencyName);

//               // Can current user add evaluation?
//               const canAddEvaluation = !evaluations.find(
//                 (e) => e?.evaluator === loggedInUser?._id,
//               );

//               // Performance bar color
//               const getPerfColor = (percentage = 0) => {
//                 if (percentage >= 70) return "green";
//                 if (percentage >= 50) return "yellow";
//                 return "red";
//               };
//               const perfColor = getPerfColor(finalEvaluation.finalPercentage);

//               const imgSrc = user?.user?.profileImage
//                 ? `${constant.baseUrl}${user.user.profileImage}`
//                 : undefined;

//               // Format month-year
//               const monthYear = formatMonthYear(user);

//               return (
//                 <Box
//                   key={user?._id}
//                   bg="white"
//                   rounded="2xl"
//                   border="1px solid"
//                   borderColor="gray.200"
//                   p={3}
//                   overflow="hidden"
//                   boxShadow="md"
//                   transition="transform .2s, box-shadow .2s"
//                   _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
//                   position="relative"
//                 >
//                   {/* Top bar */}
//                   <Box
//                     position="absolute"
//                     left={0}
//                     top={0}
//                     w="100%"
//                     h="4px"
//                     bgGradient={`linear(to-r, ${perfColor}.400, ${perfColor}.600, ${perfColor}.400)`}
//                     borderTopRadius="2xl"
//                   />

//                   {/* Glow */}
//                   <Box
//                     position="absolute"
//                     top="4px"
//                     right={0}
//                     w="140px"
//                     h="140px"
//                     bgGradient={`linear(45deg, transparent 30%, ${perfColor}.50 100%)`}
//                     opacity={0.6}
//                     borderRadius="0 0 0 100%"
//                     transition="all 0.3s ease"
//                   />

//                   {/* Header: Avatar + Name + Badges + Actions */}
//                   <Flex justify="space-between" align="flex-start" mb={4}>
//                     <Flex gap={3}>
//                       <Avatar
//                         size="lg"
//                         name={user.user.fullName}
//                         src={imgSrc}
//                       />
//                       <Stack spacing={1}>
//                         <Text isTruncated maxW="145px" fontWeight="bold">
//                           {monthYear}
//                         </Text>
//                         <Badge
//                           bg={roleBg}
//                           color={roleText}
//                           rounded="full"
//                           px={2}
//                           py={0.5}
//                           fontSize="xs"
//                           width="fit-content"
//                         >
//                           {roleName}
//                         </Badge>
//                       </Stack>
//                     </Flex>

//                     {/* Actions */}
//                     <Flex gap={1}>
//                       {hasEvaluated && (
//                         <Tooltip label="View">
//                           <IconButton
//                             size="sm"
//                             icon={<FiEye />}
//                             variant="ghost"
//                             onClick={() => setView({ modal: true, data: user })}
//                           />
//                         </Tooltip>
//                       )}

//                       {/* Delete Button - Always visible if there's data */}
//                       <Tooltip label="Delete Evaluation">
//                         <IconButton
//                           size="sm"
//                           icon={<FiTrash2 />}
//                           colorScheme="red"
//                           variant="ghost"
//                           onClick={() => {
//                             setSelectedRow(user);
//                             onOpen();
//                           }}
//                         />
//                       </Tooltip>

//                       {canAddEvaluation && (
//                         <Tooltip label="Add Evaluation">
//                           <IconButton
//                             size="sm"
//                             icon={<FaPlus />}
//                             variant="ghost"
//                             colorScheme="green"
//                             onClick={() =>
//                               navigate(
//                                 `/evaluation/user-evaluation/role/${user.user.roles[0]._id}/user/${user._id}?month=${month}&year=${year}`,
//                               )
//                             }
//                           />
//                         </Tooltip>
//                       )}
//                     </Flex>
//                   </Flex>

//                   {/* Stats + Circular Progress */}
//                   <Flex gap="24" align="center" mb={4} flexWrap="nowrap">
//                     <VStack spacing={3} align="stretch" mb={4}>
//                       <HStack justify="space-between">
//                         <HStack spacing={2}>
//                           <Icon as={FiUsers} boxSize={4} color={subTextColor} />
//                           <Text fontSize="xs" color={subTextColor}>
//                             Evaluators
//                           </Text>
//                         </HStack>
//                         <Badge
//                           px={2}
//                           py={1}
//                           fontSize="xs"
//                           rounded="full"
//                           colorScheme="blue"
//                         >
//                           {finalEvaluation.totalEvaluators}
//                         </Badge>
//                       </HStack>

//                       <HStack justify="space-between">
//                         <HStack spacing={2}>
//                           <Icon
//                             as={FiBarChart2}
//                             boxSize={4}
//                             color={subTextColor}
//                           />
//                           <Text fontSize="xs" color={subTextColor}>
//                             Average Score
//                           </Text>
//                         </HStack>
//                         <Badge
//                           px={2}
//                           py={1}
//                           fontSize="xs"
//                           rounded="full"
//                           colorScheme="purple"
//                         >
//                           {finalEvaluation.finalAvg}/10
//                         </Badge>
//                       </HStack>
//                     </VStack>

//                     <Flex direction="column" align="center" gap={2}>
//                       <Center>
//                         <Box position="relative">
//                           <CircularProgress
//                             value={finalEvaluation.finalPercentage}
//                             color={
//                               finalEvaluation.finalPercentage > 70
//                                 ? "green.500"
//                                 : finalEvaluation.finalPercentage >= 50
//                                   ? "yellow.500"
//                                   : "red.500"
//                             }
//                             size={{ base: "70px", lg: "90px" }}
//                             thickness="7px"
//                           />
//                           <Center position="absolute" inset={0}>
//                             <Text fontWeight="bold">
//                               {Math.round(finalEvaluation.finalPercentage)}%
//                             </Text>
//                           </Center>
//                         </Box>
//                       </Center>
//                       <Flex align="center" gap={2}>
//                         <Text
//                           fontWeight="bold"
//                           fontSize="11px"
//                           color="gray.600"
//                         >
//                           Performance
//                         </Text>
//                       </Flex>
//                     </Flex>
//                   </Flex>
//                 </Box>
//               );
//             })}
//           </SimpleGrid>
//         )}
//       </Box>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         isCentered
//         closeOnOverlayClick={false}
//         blockScrollOnMount={false}
//       >
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Delete Evaluation</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             Are you sure you want to delete this user's evaluation for this
//             month?
//           </ModalBody>

//           <ModalFooter>
//             <Button variant="ghost" mr={3} onClick={onClose}>
//               Cancel
//             </Button>
//             <Button
//               colorScheme="red"
//               onClick={() =>
//                 confirmDelete(
//                   loggedInUser?._id,
//                   selectedRow.month,
//                   selectedRow.year,
//                   onClose,
//                 )
//               }
//               isLoading={isDeleting}
//             >
//               Delete
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default UserEvaluationCards;

// // import {
// //   Box,
// //   Flex,
// //   Avatar,
// //   Text,
// //   Badge,
// //   IconButton,
// //   Center,
// //   Tooltip,
// //   SimpleGrid,
// //   CircularProgress,
// //   Stack,
// //   Skeleton,
// //   Icon,
// //   useDisclosure,
// //   Modal,
// //   ModalOverlay,
// //   ModalContent,
// //   ModalHeader,
// //   ModalCloseButton,
// //   ModalBody,
// //   ModalFooter,
// //   Button,
// //   useColorModeValue,
// //   HStack,
// //   VStack,
// // } from "@chakra-ui/react";
// // import { constant } from "constant";
// // import {
// //   FiEye,
// //   FiClock,
// //   FiCheck,
// //   FiCalendar,
// //   FiTrash2,
// //   FiUsers,
// //   FiBarChart2,
// //   FiEdit,
// // } from "react-icons/fi";
// // import { FaPlus, FaPenToSquare } from "react-icons/fa6";
// // import { useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import NoData from "components/Message/NoData";
// // import { getBadgeColors } from "utils/colorUtils";
// // import useUserSession from "hooks/useUserSession";
// // import { format } from "date-fns";
// // impot { useDeleteUserEvaluationMonthlyMutation } from "api/apiSlice";

// // // Fixed: CardSkeleton as a proper component
// // const CardSkeleton = () => {
// //   // Move hooks inside the component function
// //   const skeletonBg = useColorModeValue("white", "gray.800");
// //   const skeletonBorderColor = useColorModeValue("gray.200", "gray.700");

// //   return (
// //     <Box
// //       bg={skeletonBg}
// //       rounded="2xl"
// //       border="1px solid"
// //       borderColor={skeletonBorderColor}
// //       p={5}
// //       overflow="hidden"
// //       boxShadow="lg"
// //       position="relative"
// //       minH="280px"
// //     >
// //       <Skeleton height="4px" borderTopRadius="2xl" mb={4} />
// //       <Box
// //         position="absolute"
// //         top="4px"
// //         right={0}
// //         w="140px"
// //         h="140px"
// //         bg="gray.100"
// //         opacity={0.3}
// //         borderRadius="0 0 0 100%"
// //       />
// //       <Flex justify="space-between" align="flex-start" mb={4}>
// //         <Flex gap={3}>
// //           <Skeleton circle size="64px" />
// //           <Stack spacing={2}>
// //             <Skeleton height="18px" width="140px" />
// //             <Skeleton height="16px" width="90px" />
// //             <Skeleton height="16px" width="110px" />
// //           </Stack>
// //         </Flex>
// //         <Stack spacing={3}>
// //           <Skeleton height="32px" width="32px" />
// //           <Skeleton height="32px" width="32px" />
// //         </Stack>
// //       </Flex>
// //       <Flex gap={6} align="center">
// //         <Stack spacing={2} flexShrink={0}>
// //           <Skeleton height="16px" width="90px" />
// //           <Skeleton height="16px" width="90px" />
// //           <Skeleton height="20px" width="110px" />
// //         </Stack>
// //         <Skeleton circle size="90px" />
// //       </Flex>
// //     </Box>
// //   );
// // };

// // const UserEvaluationCards = ({
// //   data = [],
// //   isLoading,
// //   confirmDelete,
// //   setView,
// //   month,
// //   year,
// //   refetch,
// // }) => {
// //   const navigate = useNavigate();
// //   const { user: loggedInUser } = useUserSession();
// //   const [delayedLoading, setDelayedLoading] = useState(isLoading);

// //   // Color mode values - defined at component level
// //   const cardBg = useColorModeValue("white", "gray.800");
// //   const borderColor = useColorModeValue("gray.200", "gray.700");
// //   const textColor = useColorModeValue("gray.800", "white");
// //   const subTextColor = useColorModeValue("gray.600", "gray.300");
// //   const trackColor = useColorModeValue("gray.100", "gray.700");
// //   const modalWarningBg = useColorModeValue("red.50", "red.900");
// //   const modalWarningText = useColorModeValue("red.700", "red.200");

// //   // Delete modal state
// //   const { isOpen, onOpen, onClose } = useDisclosure();
// //   const [selectedRow, setSelectedRow] = useState(null);

// //   useEffect(() => {
// //     let timer;
// //     if (isLoading) setDelayedLoading(true);
// //     else timer = setTimeout(() => setDelayedLoading(false), 400);
// //     return () => clearTimeout(timer);
// //   }, [isLoading]);

// //   // Helper function to format month-year
// //   const formatMonthYear = (row) => {
// //     if (row?.month && row?.year) {
// //       return format(new Date(row.year, row.month - 1), "MMMM yyyy");
// //     }
// //     return "N/A";
// //   };

// //   // Get performance label based on percentage
// //   const getPerformanceLabel = (percentage) => {
// //     if (percentage >= 85) return { label: "Excellent", color: "green" };
// //     if (percentage >= 70) return { label: "Good", color: "teal" };
// //     if (percentage >= 50) return { label: "Average", color: "yellow" };
// //     return { label: "Needs Improvement", color: "red" };
// //   };

// //   // Get progress color
// //   const getProgressColor = (percentage) => {
// //     if (percentage >= 85) return "green.500";
// //     if (percentage >= 70) return "teal.500";
// //     if (percentage >= 50) return "yellow.500";
// //     return "red.500";
// //   };

// //   return (
// //     <>
// //       <Box my={4}>
// //         {delayedLoading ? (
// //           <SimpleGrid
// //             columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
// //             spacing={5}
// //           >
// //             {Array.from({ length: 8 }).map((_, i) => (
// //               <CardSkeleton key={i} />
// //             ))}
// //           </SimpleGrid>
// //         ) : data.length === 0 ? (
// //           <Center py={10}>
// //             <NoData label="No evaluations found for this period" />
// //           </Center>
// //         ) : (
// //           <SimpleGrid
// //             columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
// //             spacing={5}
// //           >
// //             {data.map((user) => {
// //               const evaluations = user?.evaluations || [];
// //               const finalEvaluation = {
// //                 totalEvaluators: user.totalEvaluators ?? 0,
// //                 finalAvg: user.finalAvg?.toFixed(1) ?? "0.0",
// //                 finalPercentage: user.finalPercentage ?? 0,
// //               };
// //               const hasEvaluated = evaluations.length > 0;
// //               const canAddEvaluation = !evaluations.find(
// //                 (e) => e?.evaluator === loggedInUser?._id,
// //               );
// //               const roleName = user?.user?.roles?.[0]?.roleName || "Unknown";
// //               const agencyName = user?.agency?.name || "No Agency";
// //               const { bg: roleBg, text: roleText } = getBadgeColors(roleName);
// //               const performance = getPerformanceLabel(
// //                 finalEvaluation.finalPercentage,
// //               );
// //               const monthYear = formatMonthYear(user);
// //               const imgSrc = user?.user?.profileImage
// //                 ? `${constant.baseUrl}${user.user.profileImage}`
// //                 : undefined;

// //               return (
// //                 <Box
// //                   key={user?._id}
// //                   bg={cardBg}
// //                   rounded="2xl"
// //                   border="1px solid"
// //                   borderColor={borderColor}
// //                   p={4}
// //                   overflow="hidden"
// //                   boxShadow="lg"
// //                   transition="all 0.3s ease"
// //                   _hover={{
// //                     transform: "translateY(-4px)",
// //                     boxShadow: "xl",
// //                     borderColor: `${performance.color}.300`,
// //                   }}
// //                   position="relative"
// //                 >
// //                   {/* Performance Indicator Bar */}
// //                   <Box
// //                     position="absolute"
// //                     left={0}
// //                     top={0}
// //                     w="100%"
// //                     h="6px"
// //                     bgGradient={`linear(to-r, ${performance.color}.400, ${performance.color}.600)`}
// //                     borderTopRadius="2xl"
// //                   />

// //                   {/* Decorative Corner */}
// //                   <Box
// //                     position="absolute"
// //                     top={0}
// //                     right={0}
// //                     w="120px"
// //                     h="120px"
// //                     bgGradient={`linear(45deg, transparent 40%, ${performance.color}.100 100%)`}
// //                     opacity={0.4}
// //                     borderRadius="0 0 0 100%"
// //                     transition="all 0.3s ease"
// //                   />

// //                   {/* Header Section */}
// //                   <Flex justify="space-between" align="flex-start" mb={4}>
// //                     <Flex gap={3}>
// //                       <Avatar
// //                         size="md"
// //                         name={user.user.fullName}
// //                         src={imgSrc}
// //                         border={`2px solid`}
// //                         borderColor={`${performance.color}.200`}
// //                       />
// //                       <VStack align="start" spacing={1}>
// //                         <Text
// //                           fontWeight="bold"
// //                           fontSize="sm"
// //                           color={textColor}
// //                           noOfLines={1}
// //                           maxW="120px"
// //                         >
// //                           {user.user.fullName}
// //                         </Text>
// //                         <Badge
// //                           bg={roleBg}
// //                           color={roleText}
// //                           rounded="full"
// //                           px={2}
// //                           py={0.5}
// //                           fontSize="2xs"
// //                           fontWeight="medium"
// //                         >
// //                           {roleName}
// //                         </Badge>
// //                         <HStack spacing={1}>
// //                           <Icon as={FiCalendar} boxSize={3} color="gray.500" />
// //                           <Text fontSize="2xs" color={subTextColor}>
// //                             {monthYear}
// //                           </Text>
// //                         </HStack>
// //                       </VStack>
// //                     </Flex>

// //                     {/* Action Buttons */}
// //                     <Flex gap={1}>
// //                       {hasEvaluated && (
// //                         <Tooltip label="View Details" placement="top">
// //                           <IconButton
// //                             size="sm"
// //                             icon={<FiEye />}
// //                             variant="ghost"
// //                             colorScheme="blue"
// //                             onClick={() => setView({ modal: true, data: user })}
// //                             aria-label="View evaluation"
// //                           />
// //                         </Tooltip>
// //                       )}

// //                       <Tooltip label="Delete Evaluation" placement="top">
// //                         <IconButton
// //                           size="sm"
// //                           icon={<FiTrash2 />}
// //                           colorScheme="red"
// //                           variant="ghost"
// //                           onClick={() => {
// //                             setSelectedRow(user);
// //                             onOpen();
// //                           }}
// //                           aria-label="Delete evaluation"
// //                         />
// //                       </Tooltip>

// //                       {canAddEvaluation && (
// //                         <Tooltip label="Add Evaluation" placement="top">
// //                           <IconButton
// //                             size="sm"
// //                             icon={<FaPlus />}
// //                             colorScheme="green"
// //                             variant="ghost"
// //                             onClick={() =>
// //                               navigate(
// //                                 `/evaluation/user-evaluation/role/${user.user.roles[0]._id}/user/${user._id}?month=${month}&year=${year}`,
// //                               )
// //                             }
// //                             aria-label="Add evaluation"
// //                           />
// //                         </Tooltip>
// //                       )}
// //                     </Flex>
// //                   </Flex>

// //                   {/* Stats Section */}

// //                   {/* Performance Section */}
// //                   <Flex direction="column" align="center" gap={3}>
// //                     {/* Circular Progress */}
// //                     <Box position="relative">
// //                       <CircularProgress
// //                         value={finalEvaluation.finalPercentage}
// //                         color={getProgressColor(
// //                           finalEvaluation.finalPercentage,
// //                         )}
// //                         size="100px"
// //                         thickness="8px"
// //                         trackColor={trackColor}
// //                       />
// //                       <Center position="absolute" inset={0}>
// //                         <VStack spacing={0}>
// //                           <Text fontWeight="bold" fontSize="lg">
// //                             {Math.round(finalEvaluation.finalPercentage)}%
// //                           </Text>
// //                           <Text fontSize="2xs" color={subTextColor}>
// //                             Score
// //                           </Text>
// //                         </VStack>
// //                       </Center>
// //                     </Box>

// //                     {/* Performance Status */}
// //                     <Badge
// //                       px={3}
// //                       py={1}
// //                       fontSize="xs"
// //                       rounded="full"
// //                       colorScheme={performance.color}
// //                       display="flex"
// //                       alignItems="center"
// //                       gap={2}
// //                     >
// //                       {hasEvaluated ? (
// //                         <>
// //                           <Icon as={FiCheck} boxSize={3} />
// //                           {performance.label}
// //                         </>
// //                       ) : (
// //                         <>
// //                           <Icon as={FiClock} boxSize={3} />
// //                           Pending Evaluation
// //                         </>
// //                       )}
// //                     </Badge>

// //                     {/* Edit Action for Evaluated Users */}
// //                     {hasEvaluated &&
// //                       loggedInUser?._id &&
// //                       evaluations.some(
// //                         (e) => e.evaluator === loggedInUser._id,
// //                       ) && (
// //                         <Button
// //                           size="xs"
// //                           leftIcon={<FiEdit />}
// //                           colorScheme="blue"
// //                           variant="outline"
// //                           onClick={() =>
// //                             navigate(
// //                               `/evaluation/user-evaluation/role/${user.user.roles[0]._id}/user/${user._id}?month=${month}&year=${year}&edit=true`,
// //                             )
// //                           }
// //                           width="full"
// //                         >
// //                           Edit Your Evaluation
// //                         </Button>
// //                       )}
// //                   </Flex>
// //                 </Box>
// //               );
// //             })}
// //           </SimpleGrid>
// //         )}
// //       </Box>

// //       {/* Delete Confirmation Modal */}
// //       <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
// //         <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
// //         <ModalContent bg={cardBg}>
// //           <ModalHeader color={textColor}>Confirm Deletion</ModalHeader>
// //           <ModalCloseButton />
// //           <ModalBody>
// //             <VStack spacing={4} align="stretch">
// //               <Text color={subTextColor}>
// //                 Are you sure you want to delete {selectedRow?.user?.fullName}'s
// //                 evaluation for{" "}
// //                 {selectedRow ? formatMonthYear(selectedRow) : "this month"}?
// //               </Text>
// //               <Box
// //                 p={3}
// //                 bg={modalWarningBg}
// //                 rounded="md"
// //                 borderLeft="4px solid"
// //                 borderColor="red.500"
// //               >
// //                 <Text fontSize="sm" color={modalWarningText}>
// //                   This action cannot be undone. All evaluation data for this
// //                   period will be permanently removed.
// //                 </Text>
// //               </Box>
// //             </VStack>
// //           </ModalBody>

// //           <ModalFooter>
// //             <Button
// //               variant="ghost"
// //               mr={3}
// //               onClick={onClose}
// //               color={subTextColor}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               colorScheme="red"
// //               onClick={() => {
// //                 if (selectedRow) {
// //                   confirmDelete(
// //                     selectedRow.user._id,
// //                     selectedRow.month,
// //                     selectedRow.year,
// //                     onClose,
// //                   );
// //                 }
// //               }}
// //               isLoading={isLoading}
// //               loadingText="Deleting..."
// //             >
// //               Delete
// //             </Button>
// //           </ModalFooter>
// //         </ModalContent>
// //       </Modal>
// //     </>
// //   );
// // };

// // export default UserEvaluationCards;

import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  IconButton,
  Center,
  Tooltip,
  SimpleGrid,
  CircularProgress,
  Stack,
  Skeleton,
  Icon,
  useDisclosure,
  Modal,
  HStack,
  ModalOverlay,
  useColorModeValue,
  VStack,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { constant } from "constant";
import {
  FiEye,
  FiClock,
  FiCheck,
  FiCalendar,
  FiTrash2,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NoData from "components/Message/NoData";
import { getBadgeColors } from "utils/colorUtils";
import useUserSession from "hooks/useUserSession";
import { format } from "date-fns";

// Skeleton card while loading
const CardSkeleton = () => (
  <Box
    bg="white"
    rounded="2xl"
    border="1px solid"
    borderColor="gray.200"
    p={4}
    overflow="hidden"
    boxShadow="md"
    position="relative"
    minH="240px"
  >
    <Skeleton height="4px" borderTopRadius="2xl" mb={4} />
    <Box
      position="absolute"
      top="4px"
      right={0}
      w="140px"
      h="140px"
      bg="gray.100"
      opacity={0.3}
      borderRadius="0 0 0 100%"
    />
    <Flex justify="space-between" align="flex-start" mb={4}>
      <Flex gap={3}>
        <Skeleton circle size="64px" />
        <Stack spacing={2}>
          <Skeleton height="18px" width="140px" />
          <Skeleton height="16px" width="90px" />
          <Skeleton height="16px" width="110px" />
        </Stack>
      </Flex>
      <Stack spacing={3}>
        <Skeleton height="32px" width="32px" />
        <Skeleton height="32px" width="32px" />
      </Stack>
    </Flex>
    <Flex gap={6} align="center">
      <Stack spacing={2} flexShrink={0}>
        <Skeleton height="16px" width="90px" />
        <Skeleton height="16px" width="90px" />
        <Skeleton height="20px" width="110px" />
      </Stack>
      <Skeleton circle size="90px" />
    </Flex>
  </Box>
);

const UserEvaluationCards = ({
  data = [],
  isLoading,
  confirmDelete,
  setView,
  month,
  year,
}) => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useUserSession();
  const [delayedLoading, setDelayedLoading] = useState(isLoading);

  // Delete modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRow, setSelectedRow] = useState(null);
  const subTextColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    let timer;
    if (isLoading) setDelayedLoading(true);
    else timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Helper function to format month-year
  const formatMonthYear = (row) => {
    if (row?.month && row?.year) {
      return format(new Date(row.year, row.month - 1), "MMM yyyy");
    }
    return "N/A";
  };

  return (
    <>
      <Box my={4}>
        {delayedLoading ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
            spacing={4}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </SimpleGrid>
        ) : data.length === 0 ? (
          <Center py={10}>
            <NoData label="user evaluation" />
          </Center>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2, xl: 3, "2xl": 4 }}
            spacing={4}
          >
            {data.map((user) => {
              // Get aggregated evaluation data
              const evaluations = user?.evaluations || [];
              const finalEvaluation = {
                totalEvaluators: user.totalEvaluators ?? 0,
                finalAvg: user.finalAvg ?? 0,
                finalPercentage: user.finalPercentage ?? 0,
              };
              const hasEvaluated = evaluations.length > 0;

              // Role & agency
              const roleName = user?.user?.roles?.[0]?.roleName || "Unknown";
              const agencyName = user?.agency?.name || "No Agency";

              const { bg: roleBg, text: roleText } = getBadgeColors(roleName);
              const { bg: agencyBg, text: agencyText } =
                getBadgeColors(agencyName);

              // Can current user add evaluation?
              const canAddEvaluation = !evaluations.find(
                (e) => e?.evaluator === loggedInUser?._id,
              );

              // Performance bar color
              const getPerfColor = (percentage = 0) => {
                if (percentage >= 70) return "green";
                if (percentage >= 50) return "yellow";
                return "red";
              };
              const perfColor = getPerfColor(finalEvaluation.finalPercentage);

              const imgSrc = user?.user?.profileImage
                ? `${constant.baseUrl}${user.user.profileImage}`
                : undefined;

              // Format month-year
              const monthYear = formatMonthYear(user);

              return (
                <Box
                  key={user?._id}
                  bg="white"
                  rounded="2xl"
                  border="1px solid"
                  borderColor="gray.200"
                  p={3}
                  overflow="hidden"
                  boxShadow="md"
                  transition="transform .2s, box-shadow .2s"
                  _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
                  position="relative"
                >
                  {/* Top bar */}
                  <Box
                    position="absolute"
                    left={0}
                    top={0}
                    w="100%"
                    h="4px"
                    bgGradient={`linear(to-r, ${perfColor}.400, ${perfColor}.600, ${perfColor}.400)`}
                    borderTopRadius="2xl"
                  />

                  {/* Glow */}
                  <Box
                    position="absolute"
                    top="4px"
                    right={0}
                    w="140px"
                    h="140px"
                    bgGradient={`linear(45deg, transparent 30%, ${perfColor}.50 100%)`}
                    opacity={0.6}
                    borderRadius="0 0 0 100%"
                    transition="all 0.3s ease"
                  />

                  {/* Header: Avatar + Name + Badges + Actions */}
                  <Flex justify="space-between" align="flex-start" mb={4}>
                    <Flex gap={3}>
                      {/* <Avatar
                        size="lg"
                        name={user.user.fullName}
                        src={imgSrc}
                      /> */}
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="md" noOfLines={1}>
                          {monthYear}
                        </Text>
                        {/* <Badge
                          bg={roleBg}
                          color={roleText}
                          rounded="full"
                          px={2}
                          py={0.5}
                          fontSize="xs"
                          fontWeight="medium"
                        >
                          {roleName}
                        </Badge> */}
                      </VStack>
                    </Flex>

                    {/* Actions */}
                    <Flex gap={1}>
                      {hasEvaluated && (
                        <Tooltip label="View">
                          <IconButton
                            alignItems="flex-start"
                            mt={1}
                            size="sm"
                            icon={<FiEye />}
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => setView({ modal: true, data: user })}
                          />
                        </Tooltip>
                      )}

                      {/* Delete Button */}
                      {/* <Tooltip label="Delete Evaluation">
                        <IconButton
                          size="sm"
                          icon={<FiTrash2 />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => {
                            setSelectedRow(user);
                            onOpen();
                          }}
                        />
                      </Tooltip> */}

                      {/* {canAddEvaluation && (
                        <Tooltip label="Add Evaluation">
                          <IconButton
                            size="sm"
                            icon={<FaPlus />}
                            variant="ghost"
                            colorScheme="green"
                            onClick={() =>
                              navigate(
                                `/evaluation/user-evaluation/role/${user.user.roles[0]._id}/user/${user._id}?month=${month}&year=${year}`,
                              )
                            }
                          />
                        </Tooltip>
                      )} */}
                    </Flex>
                  </Flex>

                  {/* Stats + Circular Progress */}
                  <Flex justify="space-between" align="center" mb={4} gap={4}>
                    {/* Left Stats Section */}
                    <VStack
                      spacing={3}
                      align="stretch"
                      flex="1"
                      minW="100px"
                      maxW="170px"
                    >
                      <HStack justify="space-between">
                        <HStack spacing={2}>
                          <Icon as={FiUsers} boxSize={4} color={subTextColor} />
                          <Text fontSize="sm" color={subTextColor}>
                            Evaluators
                          </Text>
                        </HStack>
                        <Badge
                          px={2}
                          py={1}
                          fontSize="sm"
                          rounded="full"
                          colorScheme="blue"
                        >
                          {finalEvaluation.totalEvaluators}
                        </Badge>
                      </HStack>

                      <HStack justify="space-between">
                        <HStack spacing={2}>
                          <Icon
                            as={FiBarChart2}
                            boxSize={4}
                            color={subTextColor}
                          />
                          <Text fontSize="sm" color={subTextColor}>
                            Average
                          </Text>
                        </HStack>
                        <Badge
                          px={2}
                          py={1}
                          fontSize="sm"
                          rounded="full"
                          colorScheme="purple"
                        >
                          {finalEvaluation.finalAvg}/10
                        </Badge>
                      </HStack>
                    </VStack>

                    {/* Right Circular Progress Section */}
                    <Flex direction="column" align="center" gap={2}>
                      <Box position="relative">
                        <CircularProgress
                          value={finalEvaluation.finalPercentage}
                          color={
                            finalEvaluation.finalPercentage > 70
                              ? "green.500"
                              : finalEvaluation.finalPercentage >= 50
                                ? "yellow.500"
                                : "red.500"
                          }
                          size={{ base: "70px", lg: "90px" }}
                          thickness="7px"
                        />
                        <Center position="absolute" inset={0}>
                          <VStack spacing={0}>
                            <Text fontWeight="bold" fontSize="lg">
                              {Math.round(finalEvaluation.finalPercentage)}%
                            </Text>
                            <Text fontSize="xs" color={subTextColor}>
                              Score
                            </Text>
                          </VStack>
                        </Center>
                      </Box>
                      <Text fontWeight="bold" fontSize="11px" color="gray.600">
                        Performance
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Evaluation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete {selectedRow?.user?.fullName}'s
            evaluation for{" "}
            {selectedRow ? formatMonthYear(selectedRow) : "this month"}?
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                if (selectedRow) {
                  confirmDelete(
                    selectedRow.user._id,
                    selectedRow.month,
                    selectedRow.year,
                    onClose,
                    "MYEVAL",
                  );
                }
              }}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserEvaluationCards;
