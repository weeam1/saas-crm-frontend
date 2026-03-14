// import React, { useState, useEffect, memo, useMemo } from "react";
// import {
//   Box,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Flex,
//   IconButton,
//   Badge,
//   useColorModeValue,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   useDisclosure,
//   FormErrorMessage,
//   Text,
//   useToast,
//   Button,
//   Checkbox,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
// } from "@chakra-ui/react";
// import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
// import { FaPalette } from "react-icons/fa";
// import NoData from "components/Message/NoData";
// import TableLoading from "components/loading/TableLoading";
// import { useLeadStatuses } from "hooks/leads/useLeadStatuses";

// const LeadStatus = memo(() => {
//   const { leadStatusMaps } = useLeadStatuses();
//   console.log(leadStatusMaps, "leadStatusMaps");
//   const [mainStatuses, setMainStatuses] = useState([]);
//   const [subStatuses, setSubStatuses] = useState([]);
//   const [selectedMainStatus, setSelectedMainStatus] = useState(null);
//   const [editingItem, setEditingItem] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [selectAllChecked, setSelectAllChecked] = useState(false);
//   const [formData, setFormData] = useState({
//     value: "",
//     label: "",
//     color: "#06B6D4",
//     bgColor: "#CFFAFE",
//     textColor: "#0E7490",
//     order: 1,
//     meta_id: "",
//     parentStatus: "",
//   });
//   const [formErrors, setFormErrors] = useState({});

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const toast = useToast();

//   const bgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.700");
//   const thBg = useColorModeValue("brand.200", "gray.700");
//   const thColor = useColorModeValue("gray.700", "white");
//   const hoverBg = useColorModeValue("gray.50", "gray.600");

//   // Mock data - replace with actual API call
//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       const mockData = {
//         success: true,
//         message: "Lead statuses fetched successfully",
//         count: 11,
//         data: [
//           {
//             value: "new",
//             label: "New",
//             color: "#06B6D4",
//             bgColor: "#CFFAFE",
//             textColor: "#0E7490",
//             order: 1,
//             meta_id: null,
//             statuses: [
//               {
//                 value: "fresh_lead",
//                 label: "Fresh Lead",
//                 color: "#6366F1",
//                 bgColor: "#EEF2FF",
//                 textColor: "#3730A3",
//                 meta_id: null,
//                 parentStatus: "new",
//               },
//             ],
//           },
//           {
//             value: "contacted",
//             label: "Contacted",
//             color: "#8B5CF6",
//             bgColor: "#F5F3FF",
//             textColor: "#5B21B6",
//             order: 2,
//             meta_id: null,
//             statuses: [
//               {
//                 value: "no_response",
//                 label: "No Response",
//                 color: "#F59E0B",
//                 bgColor: "#FEF3C7",
//                 textColor: "#92400E",
//                 meta_id: null,
//                 parentStatus: "contacted",
//               },
//               {
//                 value: "unreachable",
//                 label: "Unreachable",
//                 color: "#EF4444",
//                 bgColor: "#FEE2E2",
//                 textColor: "#991B1B",
//                 meta_id: null,
//                 parentStatus: "contacted",
//               },
//               {
//                 value: "whatsapp_sent",
//                 label: "Whatsapp Sent",
//                 color: "#10B981",
//                 bgColor: "#D1FAE5",
//                 textColor: "#065F46",
//                 meta_id: null,
//                 parentStatus: "contacted",
//               },
//               {
//                 value: "callback_requested",
//                 label: "Callback Requested",
//                 color: "#06B6D4",
//                 bgColor: "#CFFAFE",
//                 textColor: "#155E75",
//                 meta_id: "Lead_Interested",
//                 parentStatus: "contacted",
//               },
//             ],
//           },
//           {
//             value: "qualified",
//             label: "Qualified",
//             color: "#3B82F6",
//             bgColor: "#DBEAFE",
//             textColor: "#1E40AF",
//             order: 3,
//             meta_id: "Lead_Interested",
//             statuses: [
//               {
//                 value: "interested",
//                 label: "Interested",
//                 color: "#22C55E",
//                 bgColor: "#DCFCE7",
//                 textColor: "#166534",
//                 meta_id: "Lead_Interested",
//                 parentStatus: "qualified",
//               },
//               {
//                 value: "budget_confirmed",
//                 label: "Budget Confirmed",
//                 color: "#14B8A6",
//                 bgColor: "#CCFBF1",
//                 textColor: "#115E59",
//                 meta_id: "Lead_Qualified",
//                 parentStatus: "qualified",
//               },
//               {
//                 value: "not_ready_yet",
//                 label: "Not Ready Yet",
//                 color: "#A855F7",
//                 bgColor: "#FAF5FF",
//                 textColor: "#6B21A8",
//                 meta_id: "Lead_Interested",
//                 parentStatus: "qualified",
//               },
//             ],
//           },
//           {
//             value: "closing",
//             label: "Closing",
//             color: "#EC4899",
//             bgColor: "#FCE7F3",
//             textColor: "#9D174D",
//             order: 4,
//             meta_id: "Lead_Qualified",
//             statuses: [
//               {
//                 value: "ready_to_view",
//                 label: "Ready to View",
//                 color: "#F59E0B",
//                 bgColor: "#FEF3C7",
//                 textColor: "#92400E",
//                 meta_id: "Lead_Interested",
//                 parentStatus: "closing",
//               },
//               {
//                 value: "viewing_meeting_scheduled",
//                 label: "Viewing/Meeting Scheduled",
//                 color: "#8B5CF6",
//                 bgColor: "#F5F3FF",
//                 textColor: "#5B21B6",
//                 meta_id: "Lead_Qualified",
//                 parentStatus: "closing",
//               },
//               {
//                 value: "negotiation_stage",
//                 label: "Negotiation Stage",
//                 color: "#EC4899",
//                 bgColor: "#FCE7F3",
//                 textColor: "#9D174D",
//                 meta_id: "Lead_Qualified",
//                 parentStatus: "closing",
//               },
//             ],
//           },
//           {
//             value: "deal",
//             label: "Deal",
//             color: "#22C55E",
//             bgColor: "#DCFCE7",
//             textColor: "#166534",
//             order: 5,
//             meta_id: "Lead_Qualified",
//             statuses: [
//               {
//                 value: "offer_accepted",
//                 label: "Offer Accepted",
//                 color: "#10B981",
//                 bgColor: "#D1FAE5",
//                 textColor: "#065F46",
//                 meta_id: "Lead_Qualified",
//                 parentStatus: "deal",
//               },
//               {
//                 value: "mou_signed",
//                 label: "MOU Signed",
//                 color: "#3B82F6",
//                 bgColor: "#DBEAFE",
//                 textColor: "#1E40AF",
//                 meta_id: "Lead_Qualified",
//                 parentStatus: "deal",
//               },
//               {
//                 value: "deal_completed",
//                 label: "Deal Completed",
//                 color: "#22C55E",
//                 bgColor: "#DCFCE7",
//                 textColor: "#166534",
//                 meta_id: "Lead_Qualified",
//                 parentStatus: "deal",
//               },
//             ],
//           },
//           {
//             value: "not_qualified",
//             label: "Not Qualified",
//             color: "#EF4444",
//             bgColor: "#FEE2E2",
//             textColor: "#7F1D1D",
//             order: 6,
//             meta_id: "Lead_Unqualified",
//             statuses: [
//               {
//                 value: "budget_issue",
//                 label: "Budget Issue",
//                 color: "#F59E0B",
//                 bgColor: "#FEF3C7",
//                 textColor: "#92400E",
//                 meta_id: "Lead_Unqualified",
//                 parentStatus: "not_qualified",
//               },
//               {
//                 value: "no_budget",
//                 label: "No Budget",
//                 color: "#EF4444",
//                 bgColor: "#FEE2E2",
//                 textColor: "#991B1B",
//                 meta_id: "Lead_Unqualified",
//                 parentStatus: "not_qualified",
//               },
//               {
//                 value: "wrong_requirement",
//                 label: "Wrong Requirement",
//                 color: "#8B5CF6",
//                 bgColor: "#F5F3FF",
//                 textColor: "#5B21B6",
//                 meta_id: "Lead_Not_Interested",
//                 parentStatus: "not_qualified",
//               },
//             ],
//           },
//           {
//             value: "junk",
//             label: "Junk",
//             color: "#6B7280",
//             bgColor: "#F3F4F6",
//             textColor: "#374151",
//             order: 7,
//             meta_id: "Lead_Unqualified",
//             statuses: [
//               {
//                 value: "fake_lead",
//                 label: "Fake Lead",
//                 color: "#EF4444",
//                 bgColor: "#FEE2E2",
//                 textColor: "#991B1B",
//                 meta_id: "Lead_Unqualified",
//                 parentStatus: "junk",
//               },
//               {
//                 value: "broker",
//                 label: "Broker",
//                 color: "#EF4444",
//                 bgColor: "#FEE2E2",
//                 textColor: "#991B1B",
//                 meta_id: "Lead_Unqualified",
//                 parentStatus: "junk",
//               },
//               {
//                 value: "wrong_number",
//                 label: "Wrong Number",
//                 color: "#8B5CF6",
//                 bgColor: "#F5F3FF",
//                 textColor: "#5B21B6",
//                 meta_id: "Lead_Unqualified",
//                 parentStatus: "junk",
//               },
//             ],
//           },
//           {
//             value: "lost",
//             label: "Lost",
//             color: "#EF4444",
//             bgColor: "#FEE2E2",
//             textColor: "#991B1B",
//             order: 8,
//             meta_id: null,
//             statuses: [
//               {
//                 value: "client_backed_out",
//                 label: "Client Backed Out",
//                 color: "#F43F5E",
//                 bgColor: "#FFE4E6",
//                 textColor: "#9F1239",
//                 meta_id: "Lead_Not_Interested",
//                 parentStatus: "lost",
//               },
//               {
//                 value: "not_interested_anymore",
//                 label: "Not Interested Anymore",
//                 color: "#F97316",
//                 bgColor: "#FFEDD5",
//                 textColor: "#9A3412",
//                 meta_id: "Lead_Not_Interested",
//                 parentStatus: "lost",
//               },
//             ],
//           },
//         ],
//       };

//       setMainStatuses(mockData.data);

//       // Extract all substatuses with parent info
//       const allSubStatuses = mockData.data.flatMap((main) =>
//         (main.statuses || []).map((sub) => ({
//           ...sub,
//           parentLabel: main.label,
//           parentValue: main.value,
//         })),
//       );
//       setSubStatuses(allSubStatuses);
//       setIsLoading(false);
//     }, 1000);
//   }, []);

//   // Table columns definition
//   const mainStatusColumns = useMemo(
//     () => [
//       { Header: "Order", accessor: "order", width: 80 },
//       { Header: "Status", accessor: "status", width: 150 },
//       { Header: "Label", accessor: "label", width: 150 },
//       { Header: "Value", accessor: "value", width: 150 },
//       { Header: "Color Preview", accessor: "colors", width: 150 },
//       { Header: "Meta ID", accessor: "meta_id", width: 150 },
//       { Header: "Sub Statuses", accessor: "statusesCount", width: 120 },
//       { Header: "Actions", accessor: "actions", width: 100 },
//     ],
//     [],
//   );

//   const subStatusColumns = useMemo(
//     () => [
//       { Header: "Status", accessor: "status", width: 150 },
//       { Header: "Label", accessor: "label", width: 150 },
//       { Header: "Value", accessor: "value", width: 150 },
//       { Header: "Color Preview", accessor: "colors", width: 150 },
//       { Header: "Parent Status", accessor: "parentLabel", width: 150 },
//       { Header: "Meta ID", accessor: "meta_id", width: 150 },
//       { Header: "Actions", accessor: "actions", width: 100 },
//     ],
//     [],
//   );

//   const handleAddNew = (type) => {
//     setEditingItem(null);
//     setFormData({
//       value: "",
//       label: "",
//       color: type === "main" ? "#06B6D4" : "#6366F1",
//       bgColor: type === "main" ? "#CFFAFE" : "#EEF2FF",
//       textColor: type === "main" ? "#0E7490" : "#3730A3",
//       order: type === "main" ? mainStatuses.length + 1 : 1,
//       meta_id: "",
//       parentStatus: type === "sub" ? selectedMainStatus?.value || "" : "",
//     });
//     onOpen();
//   };

//   const handleEdit = (item, type) => {
//     setEditingItem(item);
//     setFormData({
//       value: item.value || "",
//       label: item.label || "",
//       color: item.color || "#06B6D4",
//       bgColor: item.bgColor || "#CFFAFE",
//       textColor: item.textColor || "#0E7490",
//       order: item.order || 1,
//       meta_id: item.meta_id || "",
//       parentStatus: item.parentValue || item.parentStatus || "",
//     });
//     onOpen();
//   };

//   const handleDelete = (item, type) => {
//     if (window.confirm(`Are you sure you want to delete "${item.label}"?`)) {
//       toast({
//         title: "Status deleted",
//         description: `${item.label} has been deleted successfully.`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });

//       if (type === "main") {
//         setMainStatuses(mainStatuses.filter((s) => s.value !== item.value));
//         // Also remove related substatuses
//         setSubStatuses(subStatuses.filter((s) => s.parentValue !== item.value));
//       } else {
//         setSubStatuses(subStatuses.filter((s) => s.value !== item.value));
//       }
//     }
//   };

//   const handleSelectAll = (checked) => {
//     setSelectAllChecked(checked);
//     if (checked) {
//       setSelectedValues(mainStatuses.map((s) => s.value));
//     } else {
//       setSelectedValues([]);
//     }
//   };

//   const handleSelectRow = (value, checked) => {
//     if (checked) {
//       setSelectedValues([...selectedValues, value]);
//     } else {
//       setSelectedValues(selectedValues.filter((v) => v !== value));
//     }
//   };

//   const handleSubmit = () => {
//     const errors = {};
//     if (!formData.value) errors.value = "Value is required";
//     if (!formData.label) errors.label = "Label is required";

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     const finalFormData = {
//       ...formData,
//       value:
//         formData.value || formData.label.toLowerCase().replace(/\s+/g, "_"),
//     };

//     if (editingItem) {
//       toast({
//         title: "Status updated",
//         description: `${finalFormData.label} has been updated successfully.`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } else {
//       toast({
//         title: "Status added",
//         description: `${finalFormData.label} has been added successfully.`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     }

//     onClose();
//     setFormErrors({});
//   };

//   const getRandomColor = (type) => {
//     const colors = {
//       main: [
//         "#06B6D4",
//         "#8B5CF6",
//         "#3B82F6",
//         "#EC4899",
//         "#22C55E",
//         "#EF4444",
//         "#F97316",
//         "#6B7280",
//       ],
//       sub: [
//         "#6366F1",
//         "#F59E0B",
//         "#EF4444",
//         "#10B981",
//         "#84CC16",
//         "#0EA5E9",
//         "#A855F7",
//         "#EC4899",
//       ],
//     };
//     return colors[type][Math.floor(Math.random() * colors[type].length)];
//   };

//   const generateBgColor = (color) => color + "20";

//   const StatusBadge = ({ status }) => (
//     <Badge
//       px={3}
//       py={1}
//       borderRadius="full"
//       bg={status.bgColor || generateBgColor(status.color)}
//       color={status.textColor || status.color}
//       fontWeight="500"
//       fontSize="sm"
//       whiteSpace="nowrap"
//     >
//       {status.label}
//     </Badge>
//   );

//   return (
//     <Box bg={bgColor} borderRadius="md" boxShadow="sm">
//       {/* Header with Add Buttons */}
//       <Flex
//         p={4}
//         justify="space-between"
//         align="center"
//         borderBottom="1px"
//         borderColor={borderColor}
//       >
//         <Text fontSize="lg" fontWeight="semibold">
//           Lead Status Management
//         </Text>
//         <Flex gap={3}>
//           <Button
//             leftIcon={<AddIcon />}
//             colorScheme="blue"
//             size="sm"
//             onClick={() => handleAddNew("main")}
//           >
//             Add Main Status
//           </Button>
//           <Button
//             leftIcon={<AddIcon />}
//             colorScheme="green"
//             size="sm"
//             onClick={() => handleAddNew("sub")}
//             isDisabled={mainStatuses.length === 0}
//           >
//             Add Sub Status
//           </Button>
//         </Flex>
//       </Flex>

//       <Tabs>
//         <TabList px={4} pt={2}>
//           <Tab>Main Status ({mainStatuses.length})</Tab>
//           <Tab>Sub Status ({subStatuses.length})</Tab>
//         </TabList>

//         <TabPanels>
//           {/* Main Status Tab */}
//           <TabPanel p={0}>
//             <Box maxHeight="70vh" overflowY="auto" scrollBehavior="smooth">
//               <Table variant="striped" size="sm">
//                 <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
//                   <Tr h="12">
//                     {mainStatusColumns.map((col) => (
//                       <Th
//                         key={col.accessor}
//                         minW={col?.width ? `${col.width}px` : "100px"}
//                         textAlign="center"
//                         py="4"
//                         fontSize="sm"
//                         fontWeight="semibold"
//                         color="gray.700"
//                         textTransform="capitalize"
//                       >
//                         {col.Header}
//                       </Th>
//                     ))}
//                   </Tr>
//                 </Thead>

//                 <Tbody>
//                   {isLoading ? (
//                     <TableLoading
//                       columns={mainStatusColumns}
//                       length={5}
//                       py="4"
//                     />
//                   ) : mainStatuses.length > 0 ? (
//                     mainStatuses
//                       .sort((a, b) => a.order - b.order)
//                       .map((status) => (
//                         <Tr key={status.value} _hover={{ bg: hoverBg }}>
//                           <Td textAlign="center">{status.order}</Td>
//                           <Td textAlign="center">
//                             <StatusBadge status={status} />
//                           </Td>
//                           <Td textAlign="center" fontWeight="500">
//                             {status.label}
//                           </Td>
//                           <Td textAlign="center">
//                             <Badge colorScheme="gray">{status.value}</Badge>
//                           </Td>
//                           <Td textAlign="center">
//                             <Flex align="center" justify="center" gap={2}>
//                               <Box
//                                 w="20px"
//                                 h="20px"
//                                 borderRadius="md"
//                                 bg={status.color}
//                               />
//                               <Box
//                                 w="20px"
//                                 h="20px"
//                                 borderRadius="md"
//                                 bg={
//                                   status.bgColor ||
//                                   generateBgColor(status.color)
//                                 }
//                               />
//                               <Text fontSize="xs" color="gray.500">
//                                 {status.color}
//                               </Text>
//                             </Flex>
//                           </Td>
//                           <Td textAlign="center">
//                             {status.meta_id ? (
//                               <Badge colorScheme="purple">
//                                 {status.meta_id}
//                               </Badge>
//                             ) : (
//                               "—"
//                             )}
//                           </Td>
//                           <Td textAlign="center">
//                             <Badge colorScheme="blue">
//                               {status.statuses?.length || 0}
//                             </Badge>
//                           </Td>
//                           <Td textAlign="center">
//                             <Flex gap={1} justify="center">
//                               <IconButton
//                                 icon={<EditIcon />}
//                                 size="xs"
//                                 colorScheme="blue"
//                                 variant="ghost"
//                                 onClick={() => handleEdit(status, "main")}
//                                 aria-label="Edit status"
//                               />
//                               <IconButton
//                                 icon={<DeleteIcon />}
//                                 size="xs"
//                                 colorScheme="red"
//                                 variant="ghost"
//                                 onClick={() => handleDelete(status, "main")}
//                                 aria-label="Delete status"
//                               />
//                             </Flex>
//                           </Td>
//                         </Tr>
//                       ))
//                   ) : (
//                     <Tr>
//                       <Td colSpan={mainStatusColumns.length + 1} py="10">
//                         <NoData label="main statuses" />
//                       </Td>
//                     </Tr>
//                   )}
//                 </Tbody>
//               </Table>
//             </Box>
//           </TabPanel>

//           {/* Sub Status Tab */}
//           <TabPanel p={0}>
//             <Box p={4} borderBottom="1px" borderColor={borderColor}>
//               <Select
//                 placeholder="Filter by Main Status"
//                 w="250px"
//                 size="sm"
//                 onChange={(e) => {
//                   const mainStatus = mainStatuses.find(
//                     (m) => m.value === e.target.value,
//                   );
//                   setSelectedMainStatus(mainStatus);
//                   if (mainStatus) {
//                     const filteredSubs = mainStatuses
//                       .flatMap((m) =>
//                         (m.statuses || []).map((sub) => ({
//                           ...sub,
//                           parentLabel: m.label,
//                           parentValue: m.value,
//                         })),
//                       )
//                       .filter((sub) => sub.parentValue === e.target.value);
//                     setSubStatuses(filteredSubs);
//                   } else {
//                     const allSubStatuses = mainStatuses.flatMap((main) =>
//                       (main.statuses || []).map((sub) => ({
//                         ...sub,
//                         parentLabel: main.label,
//                         parentValue: main.value,
//                       })),
//                     );
//                     setSubStatuses(allSubStatuses);
//                   }
//                 }}
//               >
//                 <option value="">All Main Statuses</option>
//                 {mainStatuses.map((main) => (
//                   <option key={main.value} value={main.value}>
//                     {main.label}
//                   </option>
//                 ))}
//               </Select>
//             </Box>

//             <Box maxHeight="60vh" overflowY="auto">
//               <Table variant="striped" size="sm">
//                 <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
//                   <Tr h="12">
//                     {subStatusColumns.map((col) => (
//                       <Th
//                         key={col.accessor}
//                         minW={col?.width ? `${col.width}px` : "100px"}
//                         textAlign="center"
//                         py="2"
//                         fontSize="sm"
//                         fontWeight="semibold"
//                         color="gray.700"
//                         textTransform="capitalize"
//                       >
//                         {col.Header}
//                       </Th>
//                     ))}
//                   </Tr>
//                 </Thead>

//                 <Tbody>
//                   {isLoading ? (
//                     <TableLoading
//                       columns={subStatusColumns}
//                       length={5}
//                       py="4"
//                     />
//                   ) : subStatuses.length > 0 ? (
//                     subStatuses.map((status) => (
//                       <Tr
//                         key={`${status.parentValue}_${status.value}`}
//                         _hover={{ bg: hoverBg }}
//                       >
//                         <Td textAlign="center">
//                           <StatusBadge status={status} />
//                         </Td>
//                         <Td textAlign="center" fontWeight="500">
//                           {status.label}
//                         </Td>
//                         <Td textAlign="center">
//                           <Badge colorScheme="gray">{status.value}</Badge>
//                         </Td>
//                         <Td textAlign="center">
//                           <Flex align="center" justify="center" gap={2}>
//                             <Box
//                               w="20px"
//                               h="20px"
//                               borderRadius="md"
//                               bg={status.color}
//                             />
//                             <Box
//                               w="20px"
//                               h="20px"
//                               borderRadius="md"
//                               bg={
//                                 status.bgColor || generateBgColor(status.color)
//                               }
//                             />
//                             <Text fontSize="xs" color="gray.500">
//                               {status.color}
//                             </Text>
//                           </Flex>
//                         </Td>
//                         <Td textAlign="center">
//                           <Badge colorScheme="teal">{status.parentLabel}</Badge>
//                         </Td>
//                         <Td textAlign="center">
//                           {status.meta_id ? (
//                             <Badge colorScheme="purple">{status.meta_id}</Badge>
//                           ) : (
//                             "—"
//                           )}
//                         </Td>
//                         <Td textAlign="center">
//                           <Flex gap={1} justify="center">
//                             <IconButton
//                               icon={<EditIcon />}
//                               size="xs"
//                               colorScheme="blue"
//                               variant="ghost"
//                               onClick={() => handleEdit(status, "sub")}
//                               aria-label="Edit substatus"
//                             />
//                             <IconButton
//                               icon={<DeleteIcon />}
//                               size="xs"
//                               colorScheme="red"
//                               variant="ghost"
//                               onClick={() => handleDelete(status, "sub")}
//                               aria-label="Delete substatus"
//                             />
//                           </Flex>
//                         </Td>
//                       </Tr>
//                     ))
//                   ) : (
//                     <Tr>
//                       <Td colSpan={subStatusColumns.length + 1} py="10">
//                         <NoData label="sub statuses" />
//                       </Td>
//                     </Tr>
//                   )}
//                 </Tbody>
//               </Table>
//             </Box>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>

//       {/* Add/Edit Modal */}
//       <Modal isOpen={isOpen} onClose={onClose} size="lg">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             {editingItem ? "Edit Status" : "Add New Status"}
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <FormControl isInvalid={formErrors.label} mb={4}>
//               <FormLabel>
//                 Label <span style={{ color: "red" }}>*</span>
//               </FormLabel>
//               <Input
//                 size="sm"
//                 value={formData.label}
//                 onChange={(e) =>
//                   setFormData({ ...formData, label: e.target.value })
//                 }
//                 placeholder="Enter display label"
//               />
//               <FormErrorMessage>{formErrors.label}</FormErrorMessage>
//             </FormControl>

//             <FormControl isInvalid={formErrors.value} mb={4}>
//               <FormLabel>Value (unique identifier)</FormLabel>
//               <Input
//                 size="sm"
//                 value={formData.value}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
//                   })
//                 }
//                 placeholder="e.g., new_status"
//               />
//               <FormErrorMessage>{formErrors.value}</FormErrorMessage>
//             </FormControl>

//             {formData.parentStatus !== undefined && (
//               <FormControl isInvalid={formErrors.parentStatus} mb={4}>
//                 <FormLabel>
//                   Parent Main Status <span style={{ color: "red" }}>*</span>
//                 </FormLabel>
//                 <Select
//                   size="sm"
//                   value={formData.parentStatus}
//                   onChange={(e) =>
//                     setFormData({ ...formData, parentStatus: e.target.value })
//                   }
//                   placeholder="Select main status"
//                 >
//                   {mainStatuses.map((main) => (
//                     <option key={main.value} value={main.value}>
//                       {main.label}
//                     </option>
//                   ))}
//                 </Select>
//                 <FormErrorMessage>{formErrors.parentStatus}</FormErrorMessage>
//               </FormControl>
//             )}

//             <FormControl mb={4}>
//               <FormLabel>Order</FormLabel>
//               <Input
//                 size="sm"
//                 type="number"
//                 value={formData.order}
//                 onChange={(e) =>
//                   setFormData({ ...formData, order: parseInt(e.target.value) })
//                 }
//                 min={1}
//               />
//             </FormControl>

//             <FormControl mb={4}>
//               <FormLabel>Color</FormLabel>
//               <Flex gap={4} align="center">
//                 <Input
//                   type="color"
//                   value={formData.color}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       color: e.target.value,
//                       bgColor: generateBgColor(e.target.value),
//                       textColor: e.target.value,
//                     })
//                   }
//                   w="100px"
//                   h="35px"
//                   p={1}
//                 />
//                 <Button
//                   size="sm"
//                   leftIcon={<FaPalette />}
//                   onClick={() => {
//                     const randomColor = getRandomColor(
//                       formData.parentStatus !== undefined ? "sub" : "main",
//                     );
//                     setFormData({
//                       ...formData,
//                       color: randomColor,
//                       bgColor: generateBgColor(randomColor),
//                       textColor: randomColor,
//                     });
//                   }}
//                 >
//                   Random
//                 </Button>
//               </Flex>
//             </FormControl>

//             <FormControl mb={4}>
//               <FormLabel>Meta ID</FormLabel>
//               <Input
//                 size="sm"
//                 value={formData.meta_id || ""}
//                 onChange={(e) =>
//                   setFormData({ ...formData, meta_id: e.target.value })
//                 }
//                 placeholder="e.g., Lead_Interested"
//               />
//             </FormControl>

//             <Box p={3} bg="gray.50" borderRadius="md">
//               <Text fontSize="sm" fontWeight="bold" mb={2}>
//                 Preview:
//               </Text>
//               <Badge
//                 px={4}
//                 py={2}
//                 borderRadius="full"
//                 bg={formData.bgColor}
//                 color={formData.textColor}
//                 fontSize="md"
//               >
//                 {formData.label || "Preview Status"}
//               </Badge>
//             </Box>
//           </ModalBody>

//           <ModalFooter>
//             <Button variant="ghost" size="sm" mr={3} onClick={onClose}>
//               Cancel
//             </Button>
//             <Button colorScheme="blue" size="sm" onClick={handleSubmit}>
//               {editingItem ? "Update" : "Save"}
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// });

// LeadStatus.displayName = "LeadStatus";

// export default LeadStatus;

import React, { useState, useEffect, memo, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Badge,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  FormErrorMessage,
  Text,
  useToast,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaPalette } from "react-icons/fa";
import NoData from "components/Message/NoData";
import TableLoading from "components/loading/TableLoading";
import { useLeadStatuses } from "hooks/leads/useLeadStatuses";

const LeadStatus = memo(() => {
  const { leadStatusMaps, isLoading: apiLoading } = useLeadStatuses();

  const [mainStatuses, setMainStatuses] = useState([]);
  const [subStatuses, setSubStatuses] = useState([]);
  const [selectedMainStatus, setSelectedMainStatus] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    value: "",
    label: "",
    color: "#06B6D4",
    bgColor: "#CFFAFE",
    textColor: "#0E7490",
    order: 1,
    parentStatus: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const thBg = useColorModeValue("brand.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  // Process API data
  useEffect(() => {
    if (leadStatusMaps?.data) {
      processStatusData(leadStatusMaps.data);
    } else if (!apiLoading) {
      setIsLoading(false);
    }
  }, [leadStatusMaps, apiLoading]);

  const processStatusData = (apiData) => {
    // Transform main statuses
    const mainStatusList = Object.entries(leadStatusMaps.maps.mainStatusMap)
      .map(([value, label], index) => {
        const statusData = apiData.find((item) => item.value === value) || {};
        return {
          value,
          label,
          color: statusData.color || getRandomColorForValue(value),
          bgColor:
            statusData.bgColor ||
            generateBgColor(getRandomColorForValue(value)),
          textColor: statusData.textColor || getRandomColorForValue(value),
          order: statusData.order || index + 1,
        };
      })
      .sort((a, b) => a.order - b.order);

    setMainStatuses(mainStatusList);

    // Transform sub statuses
    const subStatusList = Object.entries(leadStatusMaps.maps.subStatusMap).map(
      ([value, label]) => {
        let parentLabel = null;
        let statusData = null;

        for (const main of apiData) {
          const found = main.statuses?.find((sub) => sub.value === value);
          if (found) {
            parentLabel = leadStatusMaps.maps.mainStatusMap[main.value];
            statusData = found;
            break;
          }
        }

        return {
          value,
          label,
          color: statusData?.color || getRandomColorForValue(value, "sub"),
          bgColor:
            statusData?.bgColor ||
            generateBgColor(getRandomColorForValue(value, "sub")),
          textColor:
            statusData?.textColor || getRandomColorForValue(value, "sub"),
          parentLabel,
        };
      },
    );

    setSubStatuses(subStatusList);
    setIsLoading(false);
  };

  const getRandomColorForValue = (value, type = "main") => {
    const colors = {
      main: {
        new: "#06B6D4",
        contacted: "#8B5CF6",
        qualified: "#3B82F6",
        closing: "#EC4899",
        deal: "#22C55E",
        not_qualified: "#EF4444",
        unreachable_after_attempts: "#F97316",
        junk: "#6B7280",
        lost: "#EF4444",
        show: "#14B8A6",
        seller: "#06B6D4",
      },
      sub: {
        fresh_lead: "#6366F1",
        no_response: "#F59E0B",
        unreachable: "#EF4444",
        whatsapp_sent: "#10B981",
        callback_requested: "#06B6D4",
        busy: "#F97316",
        interested: "#22C55E",
        budget_confirmed: "#14B8A6",
        not_ready_yet: "#A855F7",
        ready_to_view: "#F59E0B",
        viewing_meeting_scheduled: "#8B5CF6",
        negotiation_stage: "#EC4899",
        offer_accepted: "#10B981",
        mou_signed: "#3B82F6",
        deal_completed: "#22C55E",
        budget_issue: "#F59E0B",
        no_budget: "#EF4444",
        wrong_requirement: "#8B5CF6",
        fake_lead: "#EF4444",
        broker: "#EF4444",
        wrong_number: "#8B5CF6",
        client_backed_out: "#F43F5E",
        not_interested_anymore: "#F97316",
      },
    };

    if (type === "main" && colors.main[value]) return colors.main[value];
    if (type === "sub" && colors.sub[value]) return colors.sub[value];

    const defaultColors =
      type === "main"
        ? [
            "#06B6D4",
            "#8B5CF6",
            "#3B82F6",
            "#EC4899",
            "#22C55E",
            "#EF4444",
            "#F97316",
            "#6B7280",
          ]
        : [
            "#6366F1",
            "#F59E0B",
            "#EF4444",
            "#10B981",
            "#84CC16",
            "#0EA5E9",
            "#A855F7",
            "#EC4899",
          ];

    const hash = value
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return defaultColors[hash % defaultColors.length];
  };

  const handleAddNew = (type) => {
    setEditingItem(null);
    setFormData({
      value: "",
      label: "",
      color: type === "main" ? "#06B6D4" : "#6366F1",
      bgColor: type === "main" ? "#CFFAFE" : "#EEF2FF",
      textColor: type === "main" ? "#0E7490" : "#3730A3",
      order: type === "main" ? mainStatuses.length + 1 : 1,
      parentStatus: type === "sub" ? selectedMainStatus?.value || "" : "",
    });
    onOpen();
  };

  const handleEdit = (item, type) => {
    setEditingItem(item);
    setFormData({
      value: item.value || "",
      label: item.label || "",
      color: item.color || "#06B6D4",
      bgColor: item.bgColor || "#CFFAFE",
      textColor: item.textColor || "#0E7490",
      order: item.order || 1,
      parentStatus: item.parentValue || item.parentStatus || "",
    });
    onOpen();
  };

  const handleDelete = (item, type) => {
    if (window.confirm(`Are you sure you want to delete "${item.label}"?`)) {
      toast({
        title: "Status deleted",
        description: `${item.label} has been deleted successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = () => {
    const errors = {};
    if (!formData.value) errors.value = "Value is required";
    if (!formData.label) errors.label = "Label is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    toast({
      title: editingItem ? "Status updated" : "Status added",
      description: `${formData.label} has been ${editingItem ? "updated" : "added"} successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
    setFormErrors({});
  };

  const getRandomColor = (type) => {
    const colors = {
      main: [
        "#06B6D4",
        "#8B5CF6",
        "#3B82F6",
        "#EC4899",
        "#22C55E",
        "#EF4444",
        "#F97316",
        "#6B7280",
      ],
      sub: [
        "#6366F1",
        "#F59E0B",
        "#EF4444",
        "#10B981",
        "#84CC16",
        "#0EA5E9",
        "#A855F7",
        "#EC4899",
      ],
    };
    return colors[type][Math.floor(Math.random() * colors[type].length)];
  };

  const generateBgColor = (color) => color + "20";

  const StatusBadge = ({ status }) => (
    <Badge
      px={3}
      py={1}
      borderRadius="full"
      bg={status.bgColor || generateBgColor(status.color)}
      color={status.textColor || status.color}
      fontWeight="500"
      fontSize="sm"
      whiteSpace="nowrap"
    >
      {status.label}
    </Badge>
  );

  const loading = isLoading || apiLoading;

  return (
    <Box bg={bgColor} borderRadius="md" boxShadow="sm">
      {/* Header with Add Buttons */}
      <Flex
        p={4}
        justify="space-between"
        align="center"
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="semibold">
          Lead Status Management
        </Text>
        <Flex gap={3}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            size="sm"
            onClick={() => handleAddNew("main")}
          >
            Add Main Status
          </Button>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="green"
            size="sm"
            onClick={() => handleAddNew("sub")}
            isDisabled={mainStatuses.length === 0}
          >
            Add Sub Status
          </Button>
        </Flex>
      </Flex>

      <Tabs>
        <TabList px={4} pt={2}>
          <Tab>Main Status ({mainStatuses.length})</Tab>
          <Tab>Sub Status ({subStatuses.length})</Tab>
        </TabList>

        <TabPanels>
          {/* Main Status Tab */}
          <TabPanel p={0}>
            <Box maxHeight="70vh" overflowY="auto" scrollBehavior="smooth">
              <Table variant="striped" size="sm">
                <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
                  <Tr>
                    <Th textAlign="center" width="100px">
                      Order
                    </Th>
                    <Th textAlign="center">Status</Th>
                    <Th textAlign="center" width="120px">
                      Actions
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={3} py="4">
                        <TableLoading
                          columns={[
                            { width: 100 },
                            { width: 200 },
                            { width: 120 },
                          ]}
                          length={5}
                        />
                      </Td>
                    </Tr>
                  ) : mainStatuses.length > 0 ? (
                    mainStatuses.map((status) => (
                      <Tr key={status.value} _hover={{ bg: hoverBg }}>
                        <Td textAlign="center">{status.order}</Td>
                        <Td textAlign="center">
                          <StatusBadge status={status} />
                        </Td>
                        <Td textAlign="center">
                          <Flex gap={1} justify="center">
                            <IconButton
                              icon={<EditIcon />}
                              size="xs"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEdit(status, "main")}
                              aria-label="Edit status"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="xs"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDelete(status, "main")}
                              aria-label="Delete status"
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={3} py="10" textAlign="center">
                        <NoData label="main statuses" />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {/* Sub Status Tab */}
          <TabPanel p={0}>
            <Box p={4} borderBottom="1px" borderColor={borderColor}>
              <Select
                placeholder="Filter by Main Status"
                w="250px"
                size="sm"
                onChange={(e) => {
                  const mainStatus = mainStatuses.find(
                    (m) => m.label === e.target.value,
                  );
                  setSelectedMainStatus(mainStatus);
                }}
              >
                <option value="">All Main Statuses</option>
                {mainStatuses.map((main) => (
                  <option key={main.value} value={main.label}>
                    {main.label}
                  </option>
                ))}
              </Select>
            </Box>

            <Box maxHeight="60vh" overflowY="auto">
              <Table variant="striped" size="sm">
                <Thead position="sticky" top={0} bg={thBg} zIndex={1}>
                  <Tr>
                    <Th textAlign="center">Status</Th>
                    <Th textAlign="center" width="120px">
                      Actions
                    </Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={2} py="4">
                        <TableLoading
                          columns={[{ width: 200 }, { width: 120 }]}
                          length={5}
                        />
                      </Td>
                    </Tr>
                  ) : subStatuses.length > 0 ? (
                    subStatuses
                      .filter(
                        (status) =>
                          !selectedMainStatus ||
                          status.parentLabel === selectedMainStatus.label,
                      )
                      .map((status) => (
                        <Tr key={status.value} _hover={{ bg: hoverBg }}>
                          <Td textAlign="center">
                            <StatusBadge status={status} />
                          </Td>
                          <Td textAlign="center">
                            <Flex gap={1} justify="center">
                              <IconButton
                                icon={<EditIcon />}
                                size="xs"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEdit(status, "sub")}
                                aria-label="Edit substatus"
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(status, "sub")}
                                aria-label="Delete substatus"
                              />
                            </Flex>
                          </Td>
                        </Tr>
                      ))
                  ) : (
                    <Tr>
                      <Td colSpan={2} py="10" textAlign="center">
                        <NoData label="sub statuses" />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingItem ? "Edit Status" : "Add New Status"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={formErrors.label} mb={4}>
              <FormLabel>
                Label <span style={{ color: "red" }}>*</span>
              </FormLabel>
              <Input
                size="sm"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Enter display label"
              />
              <FormErrorMessage>{formErrors.label}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={formErrors.value} mb={4}>
              <FormLabel>Value</FormLabel>
              <Input
                size="sm"
                value={formData.value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                  })
                }
                placeholder="e.g., new_status"
              />
              <FormErrorMessage>{formErrors.value}</FormErrorMessage>
            </FormControl>

            {formData.parentStatus !== undefined && (
              <FormControl mb={4}>
                <FormLabel>Parent Main Status</FormLabel>
                <Select
                  size="sm"
                  value={formData.parentStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, parentStatus: e.target.value })
                  }
                  placeholder="Select main status"
                >
                  {mainStatuses.map((main) => (
                    <option key={main.value} value={main.value}>
                      {main.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl mb={4}>
              <FormLabel>Order</FormLabel>
              <Input
                size="sm"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                min={1}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Color</FormLabel>
              <Flex gap={4} align="center">
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      color: e.target.value,
                      bgColor: generateBgColor(e.target.value),
                      textColor: e.target.value,
                    })
                  }
                  w="100px"
                  h="35px"
                  p={1}
                />
                <Button
                  size="sm"
                  leftIcon={<FaPalette />}
                  onClick={() => {
                    const randomColor = getRandomColor(
                      formData.parentStatus !== undefined ? "sub" : "main",
                    );
                    setFormData({
                      ...formData,
                      color: randomColor,
                      bgColor: generateBgColor(randomColor),
                      textColor: randomColor,
                    });
                  }}
                >
                  Random
                </Button>
              </Flex>
            </FormControl>

            <Box p={3} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Preview:
              </Text>
              <Badge
                px={4}
                py={2}
                borderRadius="full"
                bg={formData.bgColor}
                color={formData.textColor}
                fontSize="md"
              >
                {formData.label || "Preview Status"}
              </Badge>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" size="sm" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" size="sm" onClick={handleSubmit}>
              {editingItem ? "Update" : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});

LeadStatus.displayName = "LeadStatus";

export default LeadStatus;
