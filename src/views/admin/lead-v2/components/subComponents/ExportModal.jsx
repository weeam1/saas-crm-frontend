// import { useEffect, useRef, useState } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Progress,
//   Text,
//   VStack,
//   Box,
//   Icon,
//   HStack,
//   Badge,
//   CircularProgress,
//   Flex,
//   Divider,
//   Tooltip,
//   SimpleGrid,
// } from "@chakra-ui/react";
// import {
//   FiDownload,
//   FiFileText,
//   FiFile,
//   FiCheckCircle,
//   FiInfo,
//   FiX,
//   FiFileMinus,
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";

// const MotionBox = motion(Box);
// const MotionVStack = motion(VStack);

// const ExportModal = ({ isOpen, onClose, totalRecords = 0 }) => {
//   const [progress, setProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [exportStatus, setExportStatus] = useState("ready"); // ready, processing, success
//   const [currentStep, setCurrentStep] = useState("Preparing data...");
//   const [exportType, setExportType] = useState(null); // null, 'csv', 'excel'
//   const [exportOptions, setExportOptions] = useState({
//     sheetName: "Leads",
//   });
//   const progressRef = useRef(null);

//   // Reset export type when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setExportType(null);
//     }
//   }, [isOpen]);

//   // --------------------- Fake Progress Logic ---------------------
//   const startFakeProgress = () => {
//     if (progressRef.current) clearInterval(progressRef.current);

//     progressRef.current = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 99.9) return prev;
//         const increment = 0.5 + Math.random() * 0.5;
//         const newProgress = prev + increment;

//         // Update step based on progress
//         if (newProgress < 30) setCurrentStep("Preparing data...");
//         else if (newProgress < 60) setCurrentStep("Formatting records...");
//         else if (newProgress < 90) setCurrentStep("Compressing file...");
//         else setCurrentStep("Finalizing export...");

//         return Math.min(newProgress, 99.9);
//       });
//     }, 100);
//   };

//   const stopProgress = () => {
//     if (progressRef.current) {
//       clearInterval(progressRef.current);
//       progressRef.current = null;
//     }
//   };

//   const handleExport = () => {
//     setLoading(true);
//     setExportStatus("processing");
//     setProgress(0);
//     startFakeProgress();

//     // Simulate completion
//     setTimeout(() => {
//       stopProgress();
//       setProgress(100);
//       setLoading(false);
//       setExportStatus("success");
//     }, 3000);
//   };

//   const resetModal = () => {
//     stopProgress();
//     setProgress(0);
//     setLoading(false);
//     setExportStatus("ready");
//     setCurrentStep("Preparing data...");
//   };

//   useEffect(() => {
//     if (!isOpen) resetModal();
//   }, [isOpen]);

//   const getStatusColor = () => {
//     switch (exportStatus) {
//       case "processing":
//         return "blue.500";
//       case "success":
//         return "green.500";
//       default:
//         return "gray.500";
//     }
//   };

//   const getStatusIcon = () => {
//     switch (exportStatus) {
//       case "processing":
//         return FiFile;
//       case "success":
//         return FiCheckCircle;
//       default:
//         return FiDownload;
//     }
//   };

//   const getFileExtension = () => {
//     return exportType === "excel" ? "xlsx" : "csv";
//   };

//   const getFileName = () => {
//     return `leads_export.${getFileExtension()}`;
//   };

//   const getFileTypeName = () => {
//     return exportType === "excel" ? "Excel (XLSX)" : "CSV";
//   };

//   // Render format selection screen
//   const renderFormatSelection = () => (
//     <MotionVStack
//       spacing={6}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       <Text fontSize="md" color="gray.600" textAlign="center">
//         Choose export format for {totalRecords?.toLocaleString()} records
//       </Text>

//       <SimpleGrid columns={2} spacing={4} w="full">
//         {/* CSV Option */}
//         <MotionBox
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.98 }}
//           cursor="pointer"
//           onClick={() => setExportType("csv")}
//         >
//           <Box
//             border="2px solid"
//             borderColor="blue.200"
//             borderRadius="xl"
//             p={6}
//             textAlign="center"
//             bg="white"
//             _hover={{
//               borderColor: "blue.400",
//               bg: "blue.50",
//               transform: "translateY(-2px)",
//               boxShadow: "lg",
//             }}
//             transition="all 0.2s"
//           >
//             <VStack spacing={4}>
//               <Box p={3} bg="blue.100" borderRadius="full" color="blue.600">
//                 <Icon as={FiFileText} boxSize={8} />
//               </Box>
//               <VStack spacing={2}>
//                 <Text fontWeight="bold" fontSize="lg" color="gray.800">
//                   CSV Format
//                 </Text>
//                 <Text fontSize="sm" color="gray.600">
//                   Comma-separated values
//                 </Text>
//               </VStack>
//               <Badge colorScheme="blue" borderRadius="full" px={3}>
//                 .CSV
//               </Badge>
//             </VStack>
//           </Box>
//         </MotionBox>

//         {/* Excel Option */}
//         <MotionBox
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.98 }}
//           cursor="pointer"
//           onClick={() => setExportType("excel")}
//         >
//           <Box
//             border="2px solid"
//             borderColor="green.200"
//             borderRadius="xl"
//             p={6}
//             textAlign="center"
//             bg="white"
//             _hover={{
//               borderColor: "green.400",
//               bg: "green.50",
//               transform: "translateY(-2px)",
//               boxShadow: "lg",
//             }}
//             transition="all 0.2s"
//           >
//             <VStack spacing={4}>
//               <Box p={3} bg="green.100" borderRadius="full" color="green.600">
//                 <Icon as={FiFile} boxSize={8} />
//               </Box>
//               <VStack spacing={2}>
//                 <Text fontWeight="bold" fontSize="lg" color="gray.800">
//                   Excel Format
//                 </Text>
//                 <Text fontSize="sm" color="gray.600">
//                   Spreadsheet with formatting
//                 </Text>
//               </VStack>
//               <Badge colorScheme="green" borderRadius="full" px={3}>
//                 .XLSX
//               </Badge>
//             </VStack>
//           </Box>
//         </MotionBox>
//       </SimpleGrid>
//     </MotionVStack>
//   );

//   // Render CSV options - Exactly like Excel but with CSV format
//   const renderCSVOptions = () => (
//     <MotionVStack
//       spacing={4}
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//     >
//       <VStack spacing={3} align="stretch" w="full">
//         <Text fontWeight="semibold" color="gray.700">
//           CSV Options
//         </Text>

//         <Box p={4} bg="gray.50" borderRadius="lg">
//           <VStack spacing={3} align="stretch">
//             {/* File Format Section */}
//             <HStack justify="space-between" align="center">
//               <VStack align="start" spacing={0}>
//                 <Text fontSize="sm" fontWeight="medium" color="gray.700">
//                   File Format
//                 </Text>
//                 <Text fontSize="xs" color="gray.500">
//                   CSV format
//                 </Text>
//               </VStack>
//               <Button
//                 size="sm"
//                 variant="solid"
//                 colorScheme="blue"
//                 isDisabled
//                 _disabled={{
//                   opacity: 1,
//                   cursor: "default",
//                   bg: "blue.500",
//                   color: "white",
//                 }}
//               >
//                 CSV
//               </Button>
//             </HStack>

//             <Divider borderColor="gray.300" />

//             {/* Sheet Name Section */}
//             <HStack justify="space-between" align="center">
//               <VStack align="start" spacing={0}>
//                 <Text fontSize="sm" fontWeight="medium" color="gray.700">
//                   Sheet Name
//                 </Text>
//                 <Text fontSize="xs" color="gray.500">
//                   Name of the worksheet
//                 </Text>
//               </VStack>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 colorScheme="blue"
//                 onClick={() => {
//                   const name = prompt(
//                     "Enter sheet name",
//                     exportOptions.sheetName,
//                   );
//                   if (name) {
//                     setExportOptions((prev) => ({ ...prev, sheetName: name }));
//                   }
//                 }}
//               >
//                 {exportOptions.sheetName}
//               </Button>
//             </HStack>
//           </VStack>
//         </Box>
//       </VStack>
//     </MotionVStack>
//   );

//   // Render Excel options
//   const renderExcelOptions = () => (
//     <MotionVStack
//       spacing={4}
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//     >
//       <VStack spacing={3} align="stretch" w="full">
//         <Text fontWeight="semibold" color="gray.700">
//           Excel Options
//         </Text>

//         <Box p={4} bg="gray.50" borderRadius="lg">
//           <VStack spacing={3} align="stretch">
//             {/* File Format Section */}
//             <HStack justify="space-between" align="center">
//               <VStack align="start" spacing={0}>
//                 <Text fontSize="sm" fontWeight="medium" color="gray.700">
//                   File Format
//                 </Text>
//                 <Text fontSize="xs" color="gray.500">
//                   Excel format
//                 </Text>
//               </VStack>
//               <Button
//                 size="sm"
//                 variant="solid"
//                 colorScheme="green"
//                 isDisabled
//                 _disabled={{
//                   opacity: 1,
//                   cursor: "default",
//                   bg: "green.500",
//                   color: "white",
//                 }}
//               >
//                 XLSX
//               </Button>
//             </HStack>

//             <Divider borderColor="gray.300" />

//             {/* Sheet Name Section */}
//             <HStack justify="space-between" align="center">
//               <VStack align="start" spacing={0}>
//                 <Text fontSize="sm" fontWeight="medium" color="gray.700">
//                   Sheet Name
//                 </Text>
//                 <Text fontSize="xs" color="gray.500">
//                   Name of the worksheet
//                 </Text>
//               </VStack>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 colorScheme="green"
//                 onClick={() => {
//                   const name = prompt(
//                     "Enter sheet name",
//                     exportOptions.sheetName,
//                   );
//                   if (name) {
//                     setExportOptions((prev) => ({ ...prev, sheetName: name }));
//                   }
//                 }}
//               >
//                 {exportOptions.sheetName}
//               </Button>
//             </HStack>
//           </VStack>
//         </Box>
//       </VStack>
//     </MotionVStack>
//   );

//   // Render progress screen (common for both CSV and Excel)
//   const renderProgressScreen = () => (
//     <MotionVStack
//       spacing={5}
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       {/* File Preview Box */}
//       <MotionBox
//         w="full"
//         border="1px solid"
//         borderColor="gray.200"
//         boxShadow="sm"
//         borderRadius="xl"
//         overflow="hidden"
//         bg="white"
//       >
//         <Box p={5}>
//           <VStack spacing={4} align="stretch">
//             <Flex justify="space-between" align="center">
//               <HStack spacing={3}>
//                 <Box
//                   p={2.5}
//                   bg={exportType === "csv" ? "blue.50" : "green.50"}
//                   borderRadius="lg"
//                   color={exportType === "csv" ? "blue.600" : "green.600"}
//                 >
//                   <Icon as={FiFileText} boxSize={4} />
//                 </Box>
//                 <VStack align="start" spacing={0.5}>
//                   <Text fontWeight="bold" fontSize="md">
//                     {getFileName()}
//                   </Text>
//                   <Text fontSize="xs" color="gray.500">
//                     {getFileTypeName()} • {totalRecords?.toLocaleString()}{" "}
//                     records
//                   </Text>
//                 </VStack>
//               </HStack>
//               <Badge
//                 colorScheme={
//                   exportStatus === "processing"
//                     ? "blue"
//                     : exportStatus === "success"
//                       ? "green"
//                       : "gray"
//                 }
//                 borderRadius="full"
//                 px={2.5}
//                 py={0.5}
//                 fontSize="2xs"
//                 fontWeight="semibold"
//               >
//                 {exportStatus}
//               </Badge>
//             </Flex>

//             <Divider />

//             {/* File Stats */}
//             <HStack justify="space-around">
//               <VStack align="center" spacing={1.5} flex={1}>
//                 <Box
//                   p={2}
//                   bg={exportType === "csv" ? "blue.50" : "green.50"}
//                   borderRadius="md"
//                   color={exportType === "csv" ? "blue.600" : "green.600"}
//                 >
//                   <Icon as={FiFileText} boxSize={4} />
//                 </Box>
//                 <VStack spacing={0}>
//                   <Text fontSize="xs" color="gray.600">
//                     Total Records
//                   </Text>
//                   <Text fontSize="lg" fontWeight="bold" color="gray.800">
//                     {totalRecords?.toLocaleString()}
//                   </Text>
//                 </VStack>
//               </VStack>
//               <VStack align="center" spacing={1.5} flex={1}>
//                 <Box p={2} bg="blue.50" borderRadius="md" color="blue.600">
//                   <Icon
//                     as={exportType === "csv" ? FiFileText : FiFile}
//                     boxSize={4}
//                   />
//                 </Box>
//                 <VStack spacing={0}>
//                   <Text fontSize="xs" color="gray.600">
//                     Format
//                   </Text>
//                   <Text fontSize="lg" fontWeight="bold" color="gray.800">
//                     {exportType === "csv" ? "CSV" : "Excel"}
//                   </Text>
//                 </VStack>
//               </VStack>
//             </HStack>
//           </VStack>
//         </Box>
//       </MotionBox>

//       {/* Progress Section */}
//       <Box w="full">
//         <VStack spacing={4} align="stretch">
//           <Flex justify="space-between" align="center">
//             <Text fontSize="sm" fontWeight="semibold" color="gray.700">
//               Export Progress
//             </Text>
//             <HStack spacing={2}>
//               <Text fontSize="xs" fontWeight="medium" color="gray.600">
//                 {Math.round(progress)}%
//               </Text>
//               {exportStatus === "processing" && (
//                 <CircularProgress
//                   size="16px"
//                   thickness="3px"
//                   color="blue.500"
//                   isIndeterminate
//                 />
//               )}
//             </HStack>
//           </Flex>

//           <Box position="relative" w="full">
//             <Progress
//               value={progress}
//               height="8px"
//               width="full"
//               borderRadius="full"
//               colorScheme={exportStatus === "success" ? "green" : "blue"}
//               hasStripe={exportStatus === "processing"}
//               isAnimated={exportStatus === "processing"}
//             />

//             <MotionBox
//               position="absolute"
//               top="50%"
//               left={`${Math.min(progress, 100)}%`}
//               style={{ transform: "translate(-50%, -50%)" }}
//               animate={{ left: `${Math.min(progress, 100)}%` }}
//               transition={{
//                 type: "tween",
//                 duration: 0.2,
//                 ease: "linear",
//               }}
//             >
//               <Box
//                 width="16px"
//                 height="16px"
//                 borderRadius="full"
//                 bg="white"
//                 border="2px solid"
//                 borderColor={getStatusColor()}
//                 boxShadow="0 1px 4px rgba(0,0,0,0.2)"
//               />
//             </MotionBox>
//           </Box>

//           {/* Current Step */}
//           {exportStatus === "processing" && (
//             <MotionBox
//               initial={{ opacity: 0, y: -8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <Box
//                 p={3}
//                 bg="blue.50"
//                 borderRadius="lg"
//                 border="1px solid"
//                 borderColor="blue.100"
//               >
//                 <HStack spacing={2}>
//                   <CircularProgress
//                     size="16px"
//                     thickness="4px"
//                     color="blue.500"
//                     isIndeterminate
//                   />
//                   <VStack align="start" spacing={0} flex={1}>
//                     <Text fontSize="xs" fontWeight="medium" color="blue.700">
//                       {currentStep}
//                     </Text>
//                     <Text fontSize="2xs" color="blue.600">
//                       This may take a moment...
//                     </Text>
//                   </VStack>
//                   <Tooltip label="Export process details" placement="top">
//                     <Icon
//                       as={FiInfo}
//                       color="blue.500"
//                       cursor="help"
//                       boxSize={3.5}
//                     />
//                   </Tooltip>
//                 </HStack>
//               </Box>
//             </MotionBox>
//           )}

//           {/* Success Message */}
//           <AnimatePresence mode="wait">
//             {exportStatus === "success" && (
//               <MotionBox
//                 key="success"
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 16 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Box
//                   p={5}
//                   bg="green.50"
//                   borderRadius="xl"
//                   border="1px solid"
//                   borderColor="green.200"
//                   textAlign="center"
//                 >
//                   <MotionBox
//                     animate={{ scale: [1, 1.15, 1] }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     <Icon
//                       as={FiCheckCircle}
//                       boxSize={10}
//                       color="green.500"
//                       mb={2}
//                     />
//                   </MotionBox>
//                   <Text
//                     fontSize="md"
//                     fontWeight="bold"
//                     color="green.800"
//                     mb={1.5}
//                   >
//                     Export Completed!
//                   </Text>
//                   <Text fontSize="xs" color="green.700">
//                     {totalRecords?.toLocaleString()} records exported to{" "}
//                     {getFileTypeName()} successfully.
//                   </Text>
//                 </Box>
//               </MotionBox>
//             )}
//           </AnimatePresence>
//         </VStack>
//       </Box>
//     </MotionVStack>
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       isCentered
//       closeOnOverlayClick={!loading}
//       size="md"
//       motionPreset="scale"
//     >
//       <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
//       <ModalContent borderRadius="2xl" maxW="520px" mx={4} overflow="hidden">
//         <ModalHeader
//           bg={
//             exportType === "csv"
//               ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//               : exportType === "excel"
//                 ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
//                 : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//           }
//           color="white"
//           py={5}
//           position="relative"
//         >
//           <Flex justify="space-between" align="center">
//             <HStack spacing={3}>
//               <MotionBox
//                 animate={{
//                   scale: exportStatus === "processing" ? [1, 1.1, 1] : 1,
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: exportStatus === "processing" ? Infinity : 0,
//                 }}
//               >
//                 <Icon as={getStatusIcon()} boxSize={6} />
//               </MotionBox>
//               <Box>
//                 <Text fontSize="xl" fontWeight="bold">
//                   {exportType
//                     ? `Export to ${exportType === "csv" ? "CSV" : "Excel"}`
//                     : "Export Leads"}
//                 </Text>
//                 <Text fontSize="xs" opacity={0.9} mt={0.5}>
//                   {exportType
//                     ? `Download as ${getFileTypeName()} file`
//                     : "Choose your export format"}
//                 </Text>
//               </Box>
//             </HStack>
//             {exportType && exportStatus !== "processing" && (
//               <MotionBox
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 cursor="pointer"
//                 onClick={() => {
//                   if (exportStatus === "success") {
//                     onClose();
//                   } else {
//                     setExportType(null);
//                     resetModal();
//                   }
//                 }}
//               >
//                 <Icon as={FiX} boxSize={5} />
//               </MotionBox>
//             )}
//           </Flex>
//         </ModalHeader>

//         <ModalBody py={6} px={6}>
//           {!exportType ? (
//             renderFormatSelection()
//           ) : exportStatus === "ready" ? (
//             <>
//               {exportType === "csv" ? renderCSVOptions() : renderExcelOptions()}
//               {renderProgressScreen()}
//             </>
//           ) : (
//             renderProgressScreen()
//           )}
//         </ModalBody>

//         <ModalFooter
//           borderTop="1px solid"
//           borderColor="gray.200"
//           pt={5}
//           pb={6}
//           px={6}
//         >
//           <HStack spacing={3} w="full">
//             {!exportType ? (
//               <>
//                 <Button
//                   onClick={onClose}
//                   variant="outline"
//                   colorScheme="gray"
//                   flex={1}
//                 >
//                   Cancel
//                 </Button>
//               </>
//             ) : exportStatus !== "success" ? (
//               <>
//                 <Button
//                   onClick={() => {
//                     setExportType(null);
//                     resetModal();
//                   }}
//                   variant="outline"
//                   colorScheme="gray"
//                   flex={1}
//                   isDisabled={loading}
//                   leftIcon={<FiFileMinus />}
//                 >
//                   Change Format
//                 </Button>
//                 <MotionBox
//                   flex={2}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button
//                     onClick={handleExport}
//                     isLoading={loading}
//                     loadingText="Starting..."
//                     colorScheme={exportType === "csv" ? "blue" : "green"}
//                     bg={
//                       exportType === "csv"
//                         ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//                         : "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
//                     }
//                     color="white"
//                     size="md"
//                     borderRadius="lg"
//                     fontWeight="bold"
//                     fontSize="sm"
//                     w="full"
//                     leftIcon={<FiDownload size={16} />}
//                   >
//                     Start {exportType === "csv" ? "CSV" : "Excel"} Export
//                   </Button>
//                 </MotionBox>
//               </>
//             ) : (
//               <Button
//                 onClick={onClose}
//                 colorScheme="green"
//                 flex={1}
//                 bg="linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
//                 color="white"
//               >
//                 Done
//               </Button>
//             )}
//           </HStack>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ExportModal;

// import { useEffect, useRef, useState } from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Progress,
//   Text,
//   VStack,
//   Box,
//   Icon,
//   HStack,
//   Badge,
//   CircularProgress,
//   Flex,
//   Divider,
//   Tooltip,
// } from "@chakra-ui/react";
// import {
//   FiDownload,
//   FiFileText,
//   FiFile,
//   FiCheckCircle,
//   FiInfo,
//   FiX,
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { constant } from "constant";
// import { useFetchItemsQuery } from "api/apiSlice";
// const MotionBox = motion(Box);
// const MotionVStack = motion(VStack);

// const ExportModal = ({ isOpen, onClose, totalRecords = 0, params }) => {
//   const [progress, setProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [exportStatus, setExportStatus] = useState("ready"); // ready, processing, success
//   const [currentStep, setCurrentStep] = useState("Preparing data...");
//   const [exportType, setExportType] = useState("csv"); // Default to CSV directly
//   const [exportOptions, setExportOptions] = useState({
//     sheetName: "Leads",
//   });
//   const progressRef = useRef(null);
//   console.log(params, "params");

//   // --------------------- Fake Progress Logic ---------------------

//   useEffect(() => {
//     if (progress >= 90 && exportStatus === "processing") {
//       slowAtNinety();
//     }
//   }, [progress, exportStatus]);

//   const slowAtNinety = () => {
//     if (progressRef.current) clearInterval(progressRef.current);

//     progressRef.current = setInterval(() => {
//       setProgress((p) => (p < 92 ? p + 0.1 : p));
//     }, 1500);
//   };

//   const stopProgress = () => {
//     if (progressRef.current) {
//       clearInterval(progressRef.current);
//       progressRef.current = null;
//     }
//   };

//   // Update the progress increment logic
//   const startFakeProgress = () => {
//     stopProgress();

//     progressRef.current = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 95) return 95; // Changed from 90 to 95 to leave room for smooth completion

//         const inc = 2 + Math.random() * 2;
//         const next = Math.min(prev + inc, 95); // Changed from 90 to 95

//         if (next < 30) setCurrentStep("Preparing data...");
//         else if (next < 60) setCurrentStep("Formatting records...");
//         else setCurrentStep("Finalizing export..."); // Changed step text

//         return next;
//       });
//     }, 300);
//   };

//   // New function to smoothly complete the progress to 100%
//   const completeProgressToHundred = () => {
//     if (progressRef.current) clearInterval(progressRef.current);

//     progressRef.current = setInterval(() => {
//       setProgress((prev) => {
//         const newProgress = prev + 1; // Increment by 1% each interval

//         if (newProgress >= 100) {
//           clearInterval(progressRef.current);
//           setCurrentStep("Downloading file...");
//           return 100;
//         }

//         return newProgress;
//       });
//     }, 50); // Fast interval to reach 100 quickly but smoothly
//   };

//   // Modified useEffect for progress monitoring
//   useEffect(() => {
//     if (progress >= 95 && exportStatus === "processing") {
//       // Keep it at 95 until API completes
//       if (progressRef.current) clearInterval(progressRef.current);

//       progressRef.current = setInterval(() => {
//         setProgress((p) => (p < 96 ? p + 0.1 : p)); // Very slow increment at 95-96%
//       }, 1000);
//     }
//   }, [progress, exportStatus]);

//   // Modified handleExport function
//   const handleExport = async () => {
//     setLoading(true);
//     setExportStatus("processing");
//     setProgress(0);
//     startFakeProgress();

//     try {
//       const token =
//         localStorage.getItem("token") || sessionStorage.getItem("token");

//       // Convert params object to query string
//       let query = "";
//       if (params && Object.keys(params).length > 0) {
//         query = "?" + new URLSearchParams(params).toString();
//       }

//       const response = await fetch(
//         `${constant["baseUrl"]}api/lead/export/csv${query}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "text/csv",
//           },
//         },
//       );

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(`Failed to fetch CSV: ${text}`);
//       }

//       const blob = await response.blob();

//       // API succeeded, now smoothly complete to 100%
//       completeProgressToHundred();

//       // Wait for progress to reach 100% before showing success and downloading
//       const waitForCompletion = () => {
//         return new Promise((resolve) => {
//           const checkProgress = setInterval(() => {
//             if (progress >= 100) {
//               clearInterval(checkProgress);
//               resolve();
//             }
//           }, 50);
//         });
//       };

//       await waitForCompletion();

//       // Set success status
//       setExportStatus("success");

//       // Download CSV
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = getFileName();
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error(err);
//       stopProgress();
//       setExportStatus("failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add this new useEffect to handle the success state transition
//   useEffect(() => {
//     if (exportStatus === "success") {
//       // Change current step when success
//       setCurrentStep("Export completed successfully!");

//       // Auto-close modal after 3 seconds (optional)
//       // setTimeout(() => {
//       //   onClose();
//       // }, 3000);
//     }
//   }, [exportStatus]);

//   const resetModal = () => {
//     stopProgress();
//     setProgress(0);
//     setLoading(false);
//     setExportStatus("ready");
//     setCurrentStep("Preparing data...");
//   };

//   useEffect(() => {
//     if (!isOpen) resetModal();
//   }, [isOpen]);

//   const getStatusColor = () => {
//     switch (exportStatus) {
//       case "processing":
//         return "blue.500";
//       case "success":
//         return "green.500";
//       default:
//         return "gray.500";
//     }
//   };

//   const getStatusIcon = () => {
//     switch (exportStatus) {
//       case "processing":
//         return FiFile;
//       case "success":
//         return FiCheckCircle;
//       default:
//         return FiDownload;
//     }
//   };

//   const getFileExtension = () => {
//     return "csv";
//   };
//   const getFileName = () => {
//     const now = new Date();

//     const pad = (num) => String(num).padStart(2, "0");

//     const year = now.getFullYear();
//     const month = pad(now.getMonth() + 1);
//     const day = pad(now.getDate());

//     let hours = now.getHours();
//     const minutes = pad(now.getMinutes());
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12; // convert to 12-hour format
//     const hourStr = pad(hours);

//     return `leads_${year}/${month}/${day}_${hourStr}:${minutes}${ampm}.${getFileExtension()}`;
//   };

//   const getFileTypeName = () => {
//     return "CSV";
//   };

//   // Render CSV options - Show directly by default
//   // const renderCSVOptions = () => (
//   //   <MotionVStack spacing={4} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//   //     <VStack spacing={3} align="stretch" w="full">
//   //       <Text fontWeight="semibold" color="gray.700">
//   //         CSV Options
//   //       </Text>

//   //       <Box p={4} bg="gray.50" borderRadius="lg">
//   //         <VStack spacing={3} align="stretch">
//   //           {/* File Format Section */}
//   //           <HStack justify="space-between" align="center">
//   //             <VStack align="start" spacing={0}>
//   //               <Text fontSize="sm" fontWeight="medium" color="gray.700">
//   //                 File Format
//   //               </Text>
//   //               <Text fontSize="xs" color="gray.500">
//   //                 CSV format
//   //               </Text>
//   //             </VStack>
//   //             <Button
//   //               size="sm"
//   //               variant="solid"
//   //               colorScheme="blue"
//   //               isDisabled
//   //               _disabled={{
//   //                 opacity: 1,
//   //                 cursor: "default",
//   //                 bg: "blue.500",
//   //                 color: "white",
//   //               }}
//   //             >
//   //               CSV
//   //             </Button>
//   //           </HStack>

//   //           <Divider borderColor="gray.300" />

//   //           {/* Sheet Name Section */}
//   //           <HStack justify="space-between" align="center">
//   //             <VStack align="start" spacing={0}>
//   //               <Text fontSize="sm" fontWeight="medium" color="gray.700">
//   //                 Sheet Name
//   //               </Text>
//   //               <Text fontSize="xs" color="gray.500">
//   //                 Name of the worksheet
//   //               </Text>
//   //             </VStack>
//   //             <Button
//   //               size="sm"
//   //               variant="outline"
//   //               colorScheme="blue"
//   //               onClick={() => {
//   //                 const name = prompt(
//   //                   "Enter sheet name",
//   //                   exportOptions.sheetName,
//   //                 );
//   //                 if (name) {
//   //                   setExportOptions((prev) => ({ ...prev, sheetName: name }));
//   //                 }
//   //               }}
//   //             >
//   //               {exportOptions.sheetName}
//   //             </Button>
//   //           </HStack>
//   //         </VStack>
//   //       </Box>
//   //     </VStack>
//   //   </MotionVStack>
//   // );

//   // Render progress screen
//   const renderProgressScreen = () => (
//     <MotionVStack spacing={5} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       {/* File Preview Box */}
//       {exportStatus !== "success" && (
//         <MotionBox
//           w="full"
//           border="1px solid"
//           borderColor="gray.200"
//           boxShadow="sm"
//           borderRadius="xl"
//           overflow="hidden"
//           bg="white"
//         >
//           <Box p={5}>
//             <VStack spacing={4} align="stretch">
//               <Flex justify="space-between">
//                 <HStack spacing={3}>
//                   <Box p={2.5} bg="blue.50" borderRadius="lg" color="blue.600">
//                     <Icon as={FiFileText} boxSize={4} />
//                   </Box>
//                   <VStack align="start" spacing={0.5}>
//                     <Text fontWeight="bold" fontSize="md">
//                       Export Leads
//                     </Text>
//                     {/* <Text fontSize="xs" color="gray.500">
//                       {getFileTypeName()} • {totalRecords?.toLocaleString()}{" "}
//                       records
//                     </Text> */}
//                   </VStack>
//                 </HStack>
//                 {exportStatus !== "ready" && exportStatus !== "failed" && (
//                   <Badge
//                     colorScheme={
//                       exportStatus === "processing"
//                         ? "blue"
//                         : exportStatus === "success"
//                           ? "green"
//                           : "gray"
//                     }
//                     borderRadius="lg"
//                     px={2}
//                     py={0.5}
//                     fontSize="xs"
//                     lineHeight="1"
//                     height="18px"
//                   >
//                     {exportStatus}
//                   </Badge>
//                 )}
//               </Flex>

//               {/* <Divider /> */}

//               {/* File Stats */}
//               <HStack justify="space-around">
//                 <VStack align="center" spacing={1.5} flex={1}>
//                   <Box p={2} bg="blue.50" borderRadius="md" color="blue.600">
//                     <Icon as={FiFileText} boxSize={4} />
//                   </Box>
//                   <VStack spacing={0}>
//                     <Text fontSize="xs" color="gray.600">
//                       Total Records
//                     </Text>
//                     <Text fontSize="lg" fontWeight="bold" color="gray.800">
//                       {totalRecords?.toLocaleString()}
//                     </Text>
//                   </VStack>
//                 </VStack>
//                 <VStack align="center" spacing={1.5} flex={1}>
//                   <Box
//                     p={2}
//                     bg="purple.50"
//                     borderRadius="md"
//                     color="purple.600"
//                   >
//                     <Icon as={FiFileText} boxSize={4} />
//                   </Box>
//                   <VStack spacing={0}>
//                     <Text fontSize="xs" color="gray.600">
//                       Format
//                     </Text>
//                     <Text fontSize="lg" fontWeight="bold" color="gray.800">
//                       CSV
//                     </Text>
//                   </VStack>
//                 </VStack>
//               </HStack>
//               <MotionBox
//                 flex={2}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <Button
//                   onClick={handleExport}
//                   isLoading={loading}
//                   loadingText="Starting..."
//                   colorScheme="blue"
//                   bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//                   color="white"
//                   size="md"
//                   borderRadius="lg"
//                   fontWeight="bold"
//                   fontSize="sm"
//                   w="full"
//                   leftIcon={<FiDownload size={16} />}
//                 >
//                   Export CSV
//                 </Button>
//               </MotionBox>
//             </VStack>
//           </Box>
//         </MotionBox>
//       )}
//       <AnimatePresence mode="wait">
//         {exportStatus === "success" && progress >= 100 && (
//           <MotionBox
//             width="full"
//             key="success"
//             initial={{ opacity: 0, y: 16 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 16 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Box
//               p={5}
//               bg="green.50"
//               borderRadius="xl"
//               border="1px solid"
//               borderColor="green.200"
//               textAlign="center"
//             >
//               <MotionBox
//                 animate={{ scale: [1, 1.15, 1] }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Icon
//                   as={FiCheckCircle}
//                   boxSize={10}
//                   color="green.500"
//                   mb={2}
//                 />
//               </MotionBox>
//               <Text fontSize="md" fontWeight="bold" color="green.800" mb={1.5}>
//                 Export Completed!
//               </Text>
//               <Text fontSize="xs" color="green.700">
//                 {totalRecords?.toLocaleString()} records exported to{" "}
//                 {getFileTypeName()} successfully.
//               </Text>
//             </Box>
//           </MotionBox>
//         )}
//       </AnimatePresence>
//       {exportStatus === "success" && (
//         <MotionBox
//           key="success"
//           initial={{ opacity: 0, y: 16 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 16 }}
//           width="full"
//           transition={{ duration: 0.3 }}
//         >
//           <Box
//             p={5}
//             bg="green.50"
//             borderRadius="xl"
//             border="1px solid"
//             borderColor="green.200"
//             textAlign="left"
//           >
//             {/* Instruction guide */}
//             <VStack spacing={2} align="start" pl={3}>
//               <Text fontWeight="semibold">How to open CSV in Excel:</Text>
//               <VStack
//                 as="ul"
//                 align="start"
//                 spacing={1.5}
//                 pl={4}
//                 color="gray.700"
//                 fontSize="sm"
//               >
//                 <Flex as="li" align="flex-start">
//                   <Box as="span" mr={2}>
//                     •
//                   </Box>
//                   <Text>Go to Excel</Text>
//                 </Flex>
//                 <Flex as="li" align="flex-start">
//                   <Box as="span" mr={2}>
//                     •
//                   </Box>
//                   <Text>Go to Data tab</Text>
//                 </Flex>
//                 <Flex as="li" align="flex-start">
//                   <Box as="span" mr={2}>
//                     •
//                   </Box>
//                   <Text>Click Get Data</Text>
//                 </Flex>
//                 <Flex as="li" align="flex-start">
//                   <Box as="span" mr={2}>
//                     •
//                   </Box>
//                   <Text>Select "From Text/CSV"</Text>
//                 </Flex>
//                 <Flex as="li" align="flex-start">
//                   <Box as="span" mr={2}>
//                     •
//                   </Box>
//                   <Text>Select the exported CSV file</Text>
//                 </Flex>
//                 <Flex as="li" align="flex-start">
//                   <Box as="span" mr={2}>
//                     •
//                   </Box>
//                   <Text>Click "Load" to import your data into Excel</Text>
//                 </Flex>
//                 <Flex as="li" align="flex-start">
//                   <Box as="span" mr={2}>
//                     •
//                   </Box>
//                   <Text>You can now view, sort, or filter your records</Text>
//                 </Flex>
//               </VStack>
//             </VStack>
//           </Box>
//         </MotionBox>
//       )}
//       {exportStatus === "failed" && (
//         <Box
//           p={5}
//           width="full"
//           bg="red.50"
//           borderRadius="xl"
//           border="1px solid"
//           borderColor="red.200"
//           textAlign="center"
//         >
//           <Icon as={FiX} boxSize={10} color="red.500" mb={2} />
//           <Text fontWeight="bold" color="red.700">
//             Export Failed
//           </Text>
//           <Text fontSize="xs" color="red.600">
//             Something went wrong while exporting CSV.
//           </Text>
//         </Box>
//       )}

//       {/* Progress Section */}

//       <Box w="full">
//         <VStack spacing={4} align="stretch">
//           {exportStatus === "processing" && (
//             <>
//               <Flex justify="space-between" align="center">
//                 <Text fontSize="sm" fontWeight="semibold" color="gray.700">
//                   Export Progress
//                 </Text>
//                 <HStack spacing={2}>
//                   <Text fontSize="xs" fontWeight="medium" color="gray.600">
//                     {Math.round(progress)}%
//                   </Text>
//                   {exportStatus === "processing" && (
//                     <CircularProgress
//                       size="16px"
//                       thickness="3px"
//                       color="blue.500"
//                       isIndeterminate
//                     />
//                   )}
//                 </HStack>
//               </Flex>

//               <Box position="relative" w="full">
//                 <Progress
//                   value={progress}
//                   height="8px"
//                   width="full"
//                   borderRadius="full"
//                   colorScheme={exportStatus === "success" ? "green" : "blue"}
//                   hasStripe={exportStatus === "processing"}
//                   isAnimated={exportStatus === "processing"}
//                 />

//                 <MotionBox
//                   position="absolute"
//                   top="50%"
//                   left={`${Math.min(progress, 100)}%`}
//                   style={{ transform: "translate(-50%, -50%)" }}
//                   animate={{ left: `${Math.min(progress, 100)}%` }}
//                   transition={{
//                     type: "tween",
//                     duration: 0.2,
//                     ease: "linear",
//                   }}
//                 >
//                   <Box
//                     width="16px"
//                     height="16px"
//                     borderRadius="full"
//                     bg="white"
//                     border="2px solid"
//                     borderColor={getStatusColor()}
//                     boxShadow="0 1px 4px rgba(0,0,0,0.2)"
//                   />
//                 </MotionBox>
//               </Box>
//             </>
//           )}
//           {/* Current Step */}
//           {exportStatus === "processing" && (
//             <MotionBox
//               initial={{ opacity: 0, y: -8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <Box
//                 p={3}
//                 bg="blue.50"
//                 borderRadius="lg"
//                 border="1px solid"
//                 borderColor="blue.100"
//               >
//                 <HStack spacing={2}>
//                   <CircularProgress
//                     size="16px"
//                     thickness="4px"
//                     color="blue.500"
//                     isIndeterminate
//                   />
//                   <VStack align="start" spacing={0} flex={1}>
//                     <Text fontSize="xs" fontWeight="medium" color="blue.700">
//                       {exportStatus === "success"
//                         ? "Export completed successfully!"
//                         : currentStep}
//                     </Text>
//                     <Text fontSize="2xs" color="blue.600">
//                       This may take a moment...
//                     </Text>
//                   </VStack>
//                   <Tooltip label="Export process details" placement="top">
//                     <Icon
//                       as={FiInfo}
//                       color="blue.500"
//                       cursor="help"
//                       boxSize={3.5}
//                     />
//                   </Tooltip>
//                 </HStack>
//               </Box>
//             </MotionBox>
//           )}

//           {/* Success Message */}
//         </VStack>
//       </Box>
//     </MotionVStack>
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       isCentered
//       closeOnOverlayClick={!loading}
//       size="md"
//       motionPreset="scale"
//     >
//       <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
//       <ModalContent borderRadius="2xl" maxW="520px" mx={4} overflow="hidden">
//         <ModalHeader
//           bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//           color="white"
//           py={3}
//           position="relative"
//         >
//           <Flex justify="space-between" align="center">
//             <HStack spacing={3}>
//               <MotionBox
//                 animate={{
//                   scale: exportStatus === "processing" ? [1, 1.1, 1] : 1,
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: exportStatus === "processing" ? Infinity : 0,
//                 }}
//               >
//                 <Icon as={getStatusIcon()} boxSize={6} />
//               </MotionBox>
//               <Box>
//                 <Text fontSize="xl" fontWeight="bold">
//                   Export
//                 </Text>
//               </Box>
//             </HStack>
//             {exportStatus !== "processing" && (
//               <MotionBox
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 cursor="pointer"
//                 onClick={() => {
//                   if (exportStatus === "success") {
//                     onClose();
//                   } else {
//                     onClose();
//                   }
//                 }}
//               >
//                 <Icon as={FiX} boxSize={5} />
//               </MotionBox>
//             )}
//           </Flex>
//         </ModalHeader>

//         <ModalBody py={6} px={6}>
//           {renderProgressScreen()}
//         </ModalBody>

//         <ModalFooter
//           borderTop="1px solid"
//           borderColor="gray.200"
//           pt={5}
//           pb={6}
//           px={6}
//         >
//           <HStack spacing={3} w="full">
//             {exportStatus !== "success" ? (
//               <>
//                 <Button
//                   onClick={onClose}
//                   variant="outline"
//                   colorScheme="gray"
//                   flex={1}
//                   isDisabled={loading}
//                 >
//                   Cancel
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 onClick={onClose}
//                 colorScheme="green"
//                 flex={1}
//                 bg="linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
//                 color="white"
//               >
//                 Done
//               </Button>
//             )}
//           </HStack>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ExportModal;

import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Progress,
  Text,
  VStack,
  Box,
  Icon,
  HStack,
  Badge,
  CircularProgress,
  Flex,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiDownload,
  FiFileText,
  FiFile,
  FiCheckCircle,
  FiInfo,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { constant } from "constant";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const ExportModal = ({ isOpen, onClose, totalRecords = 0, params }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState("ready");
  const [currentStep, setCurrentStep] = useState("Preparing data...");
  const progressRef = useRef(null);
  const blobRef = useRef(null);

  // Start fake progress that goes to 100%
  const startFakeProgress = () => {
    stopProgress();

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressRef.current);
          setExportStatus("success");
          setCurrentStep("Export completed successfully!");
          return 100;
        }

        const inc = 3 + Math.random() * 3;
        const next = Math.min(prev + inc, 100);

        if (next < 30) setCurrentStep("Preparing data...");
        else if (next < 60) setCurrentStep("Formatting records...");
        else if (next < 90) setCurrentStep("Generating file...");
        else setCurrentStep("Finalizing export...");

        return next;
      });
    }, 300);
  };

  const stopProgress = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  };

  // Function to trigger file download
  const handleDownload = () => {
    if (blobRef.current) {
      try {
        const url = window.URL.createObjectURL(blobRef.current);
        const a = document.createElement("a");
        a.href = url;
        a.download = getFileName();
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      } catch (error) {
        console.error("Download error:", error);
      }
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setExportStatus("processing");
    setProgress(0);
    blobRef.current = null;

    // Start fake progress
    startFakeProgress();

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // Convert params to query string
      let query = "";
      if (params && Object.keys(params).length > 0) {
        query = "?" + new URLSearchParams(params).toString();
      }

      // Make API call
      const response = await fetch(
        `${constant["baseUrl"]}api/lead/export/csv${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/csv",
          },
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch CSV: ${text}`);
      }

      // Get the blob data and store it
      const blob = await response.blob();
      blobRef.current = blob;
    } catch (err) {
      console.error("Export error:", err);
      stopProgress();
      setExportStatus("failed");
      setCurrentStep("Export failed");
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    stopProgress();
    setProgress(0);
    setLoading(false);
    setExportStatus("ready");
    setCurrentStep("Preparing data...");
    blobRef.current = null;
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const getStatusColor = () => {
    switch (exportStatus) {
      case "processing":
        return "blue.500";
      case "success":
        return "green.500";
      default:
        return "gray.500";
    }
  };

  const getStatusIcon = () => {
    switch (exportStatus) {
      case "processing":
        return FiFile;
      case "success":
        return FiCheckCircle;
      default:
        return FiDownload;
    }
  };

  const getFileExtension = () => {
    return "csv";
  };

  const getFileName = () => {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, "0");
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    let hours = now.getHours();
    const minutes = pad(now.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hourStr = pad(hours);

    return `leads_${year}-${month}-${day}_${hourStr}-${minutes}${ampm}.${getFileExtension()}`;
  };

  const getFileTypeName = () => {
    return "CSV";
  };

  // Render progress screen
  const renderProgressScreen = () => (
    <MotionVStack spacing={5} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* File Preview Box */}
      {exportStatus !== "success" && (
        <MotionBox
          w="full"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
          borderRadius="xl"
          overflow="hidden"
          bg="white"
        >
          <Box p={5}>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between">
                <HStack spacing={3}>
                  <Box p={2.5} bg="blue.50" borderRadius="lg" color="blue.600">
                    <Icon as={FiFileText} boxSize={4} />
                  </Box>
                  <VStack align="start" spacing={0.5}>
                    <Text fontWeight="bold" fontSize="md">
                      Export Leads
                    </Text>
                  </VStack>
                </HStack>
                {exportStatus !== "ready" && exportStatus !== "failed" && (
                  <Badge
                    colorScheme={
                      exportStatus === "processing"
                        ? "blue"
                        : exportStatus === "success"
                          ? "green"
                          : "gray"
                    }
                    borderRadius="lg"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                    lineHeight="1"
                    height="18px"
                  >
                    {exportStatus}
                  </Badge>
                )}
              </Flex>

              <HStack justify="space-around">
                <VStack align="center" spacing={1.5} flex={1}>
                  <Box p={2} bg="blue.50" borderRadius="md" color="blue.600">
                    <Icon as={FiFileText} boxSize={4} />
                  </Box>
                  <VStack spacing={0}>
                    <Text fontSize="xs" color="gray.600">
                      Total Records
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      {totalRecords?.toLocaleString() || 0}
                    </Text>
                  </VStack>
                </VStack>
                <VStack align="center" spacing={1.5} flex={1}>
                  <Box
                    p={2}
                    bg="purple.50"
                    borderRadius="md"
                    color="purple.600"
                  >
                    <Icon as={FiFileText} boxSize={4} />
                  </Box>
                  <VStack spacing={0}>
                    <Text fontSize="xs" color="gray.600">
                      Format
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="gray.800">
                      CSV
                    </Text>
                  </VStack>
                </VStack>
              </HStack>

              <MotionBox
                flex={2}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleExport}
                  isLoading={loading}
                  loadingText="Starting..."
                  colorScheme="blue"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  size="md"
                  borderRadius="lg"
                  fontWeight="bold"
                  fontSize="sm"
                  w="full"
                  leftIcon={<FiDownload size={16} />}
                  isDisabled={
                    exportStatus === "processing" || exportStatus === "success"
                  }
                >
                  {exportStatus === "processing"
                    ? "Exporting..."
                    : "Export CSV"}
                </Button>
              </MotionBox>
            </VStack>
          </Box>
        </MotionBox>
      )}

      <AnimatePresence mode="wait">
        {exportStatus === "success" && (
          <MotionBox
            width="full"
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              p={5}
              bg="green.50"
              borderRadius="xl"
              border="1px solid"
              borderColor="green.200"
              textAlign="center"
            >
              <MotionBox
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Icon
                  as={FiCheckCircle}
                  boxSize={10}
                  color="green.500"
                  mb={2}
                />
              </MotionBox>
              <Text fontSize="md" fontWeight="bold" color="green.800" mb={1.5}>
                Export Completed!
              </Text>
              <Text fontSize="xs" color="green.700" mb={3}>
                {totalRecords?.toLocaleString() || 0} records exported to{" "}
                {getFileTypeName()} successfully.
              </Text>
              <Button
                onClick={handleDownload}
                colorScheme="green"
                variant="solid"
                size="sm"
                leftIcon={<FiDownload />}
              >
                Download File
              </Button>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {exportStatus === "success" && (
        <MotionBox
          key="instructions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          width="full"
          transition={{ duration: 0.3 }}
        >
          <Box
            p={5}
            bg="green.50"
            borderRadius="xl"
            border="1px solid"
            borderColor="green.200"
            textAlign="left"
          >
            {/* Instruction guide */}
            <VStack spacing={2} align="start" pl={3}>
              <Text fontWeight="semibold">How to open CSV in Excel:</Text>
              <VStack
                as="ul"
                align="start"
                spacing={1.5}
                pl={4}
                color="gray.700"
                fontSize="sm"
              >
                <Flex as="li" align="flex-start">
                  <Box as="span" mr={2}>
                    •
                  </Box>
                  <Text>Open Excel</Text>
                </Flex>
                <Flex as="li" align="flex-start">
                  <Box as="span" mr={2}>
                    •
                  </Box>
                  <Text>Go to Data tab</Text>
                </Flex>
                <Flex as="li" align="flex-start">
                  <Box as="span" mr={2}>
                    •
                  </Box>
                  <Text>Click Get Data</Text>
                </Flex>
                <Flex as="li" align="flex-start">
                  <Box as="span" mr={2}>
                    •
                  </Box>
                  <Text>Select "From Text/CSV"</Text>
                </Flex>
                <Flex as="li" align="flex-start">
                  <Box as="span" mr={2}>
                    •
                  </Box>
                  <Text>Select CSV file</Text>
                </Flex>
                <Flex as="li" align="flex-start">
                  <Box as="span" mr={2}>
                    •
                  </Box>
                  <Text>Click "Load" to import your data into Excel</Text>
                </Flex>
                <Flex as="li" align="flex-start">
                  <Box as="span" mr={2}>
                    •
                  </Box>
                  <Text>You can now view, sort, or filter your records</Text>
                </Flex>
              </VStack>
            </VStack>
          </Box>
        </MotionBox>
      )}

      {exportStatus === "failed" && (
        <Box
          p={5}
          width="full"
          bg="red.50"
          borderRadius="xl"
          border="1px solid"
          borderColor="red.200"
          textAlign="center"
        >
          <Icon as={FiX} boxSize={10} color="red.500" mb={2} />
          <Text fontWeight="bold" color="red.700">
            Export Failed
          </Text>
          <Text fontSize="xs" color="red.600">
            Something went wrong while exporting CSV.
          </Text>
        </Box>
      )}

      {/* Progress Section */}
      <Box w="full">
        <VStack spacing={4} align="stretch">
          {exportStatus === "processing" && (
            <>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Export Progress
                </Text>
                <HStack spacing={2}>
                  <Text fontSize="xs" fontWeight="medium" color="gray.600">
                    {Math.round(progress)}%
                  </Text>
                  {exportStatus === "processing" && (
                    <CircularProgress
                      size="16px"
                      thickness="3px"
                      color="blue.500"
                      isIndeterminate
                    />
                  )}
                </HStack>
              </Flex>

              <Box position="relative" w="full">
                <Progress
                  value={progress}
                  height="8px"
                  width="full"
                  borderRadius="full"
                  colorScheme={exportStatus === "success" ? "green" : "blue"}
                  hasStripe={exportStatus === "processing"}
                  isAnimated={exportStatus === "processing"}
                />

                {/* <MotionBox
                  position="absolute"
                  top="50%"
                  left={`${Math.min(progress, 100)}%`}
                  style={{ transform: "translate(-50%, -50%)" }}
                  animate={{ left: `${Math.min(progress, 100)}%` }}
                  transition={{
                    type: "tween",
                    duration: 0.5,
                    ease: "linear",
                  }}
                >
                  <Box
                    width="16px"
                    height="16px"
                    borderRadius="full"
                    bg="white"
                    border="2px solid"
                    borderColor={getStatusColor()}
                    boxShadow="0 1px 4px rgba(0,0,0,0.2)"
                  />
                </MotionBox> */}
              </Box>
            </>
          )}

          {/* Current Step */}
          {exportStatus === "processing" && (
            <MotionBox
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Box
                p={3}
                bg="blue.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="blue.100"
              >
                <HStack spacing={2}>
                  <CircularProgress
                    size="16px"
                    thickness="4px"
                    color="blue.500"
                    isIndeterminate
                  />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="xs" fontWeight="medium" color="blue.700">
                      {currentStep}
                    </Text>
                    <Text fontSize="2xs" color="blue.600">
                      This may take a moment...
                    </Text>
                  </VStack>
                  <Tooltip label="Export process details" placement="top">
                    <Icon
                      as={FiInfo}
                      color="blue.500"
                      cursor="help"
                      boxSize={3.5}
                    />
                  </Tooltip>
                </HStack>
              </Box>
            </MotionBox>
          )}
        </VStack>
      </Box>
    </MotionVStack>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={!loading}
      size="md"
      motionPreset="scale"
    >
      <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.600" />
      <ModalContent borderRadius="2xl" maxW="520px" mx={4} overflow="hidden">
        <ModalHeader
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          py={3}
          position="relative"
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <MotionBox
                animate={{
                  scale: exportStatus === "processing" ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: exportStatus === "processing" ? Infinity : 0,
                }}
              >
                <Icon as={getStatusIcon()} boxSize={6} />
              </MotionBox>
              <Box>
                <Text fontSize="xl" fontWeight="bold">
                  Export
                </Text>
              </Box>
            </HStack>
            {exportStatus !== "processing" && (
              <MotionBox
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                cursor="pointer"
                onClick={() => {
                  if (exportStatus === "success") {
                    onClose();
                  } else {
                    onClose();
                  }
                }}
              >
                <Icon as={FiX} boxSize={5} />
              </MotionBox>
            )}
          </Flex>
        </ModalHeader>

        <ModalBody py={6} px={6}>
          {renderProgressScreen()}
        </ModalBody>

        <ModalFooter
          borderTop="1px solid"
          borderColor="gray.200"
          pt={5}
          pb={6}
          px={6}
        >
          <HStack spacing={3} w="full">
            {exportStatus !== "success" ? (
              <>
                <Button
                  onClick={onClose}
                  variant="outline"
                  colorScheme="gray"
                  flex={1}
                  isDisabled={loading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                colorScheme="green"
                flex={1}
                bg="linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
                color="white"
              >
                Done
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExportModal;
