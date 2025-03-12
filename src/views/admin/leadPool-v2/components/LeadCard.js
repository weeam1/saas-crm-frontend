// import React, { useState, useEffect, memo, useRef } from "react";
// import {
//   Box,
//   Text,
//   HStack,
//   VStack,
//   Button,
//   Icon,
//   Tooltip,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   Flex,
// } from "@chakra-ui/react";
// import { InfoIcon, CopyIcon, ChevronDownIcon } from "@chakra-ui/icons";
// import { CiMenuKebab } from "react-icons/ci";
// import { FaEye, FaHistory } from "react-icons/fa";
// import { handleCopy } from "../utils/utils";
// import { formattedDate } from "utils/helpers";
// import { toast } from "react-toastify";
// import { getApi } from "services/api";
// import LeadHistoryTimeline from "../leadCycle/components/LeadHistoryTimeline";
// import { HSeparator } from "components/separator/Separator";
// import Spinner from "components/spinner/Spinner";

// // Constants
// const displayButtonText = (approvalStatus) => {
//   switch (approvalStatus?.toLowerCase()) {
//     case "pending":
//       return "Pending";
//     case "rejected":
//       return "Rejected";
//     case "new":
//       return "Buy for 300 coins";
//     default:
//       return "Buy for 50 coins";
//   }
// };

// const getStatusStyles = (approvalStatus) => {
//   switch (approvalStatus?.toLowerCase()) {
//     case "pending":
//       return {
//         borderColor: "#FFEB3B",
//         buttonBg: "#FFEB3B",
//         buttonHoverBg: "#FFB300",
//         buttonColor: "black",
//       };
//     case "rejected":
//       return {
//         borderColor: "#FF3B3B",
//         buttonBg: "#FF3B3B",
//         buttonHoverBg: "#D32F2F",
//         buttonColor: "white",
//       };
//     default:
//       return {
//         borderColor: "#D8D8D9",
//         buttonBg: "#34C759",
//         buttonHoverBg: "#32BD00",
//         buttonColor: "white",
//       };
//   }
// };

// // Memoized Components
// const CardHeader = memo(({ id, onViewLeadCycle }) => (
//   <HStack justifyContent="space-between" w="100%" mb={1}>
//     <HStack>
//       <Icon as={FaEye} color="#C1C1C1" boxSize={3} />
//       <Text color="#BEBEBE" fontSize="12px" fontFamily="DM Sans">
//         {id || "N/A"}
//       </Text>
//     </HStack>
//     <Menu>
//       <MenuButton>
//         <Icon as={CiMenuKebab} color="#C1C1C1" cursor="pointer" boxSize={4} />
//       </MenuButton>
//       <MenuList>
//         <MenuItem icon={<FaHistory fontSize={15} />} onClick={onViewLeadCycle}>
//           View Lead Cycle
//         </MenuItem>
//       </MenuList>
//     </Menu>
//   </HStack>
// ));

// const InfoPair = memo(({ label, value, color = "#ff0307" }) => (
//   <VStack align="start" spacing={0} flex="1" minWidth="0">
//     <Text fontSize="9px" color="#C1C1C1" fontFamily="DM Sans">
//       {label}
//     </Text>
//     <Text fontSize="10px" color={color} fontFamily="DM Sans">
//       {value || "N/A"}
//     </Text>
//   </VStack>
// ));

// const InputPair = memo(
//   ({ label, value, bg, color, width = { base: "60px", md: "70px" } }) => (
//     <VStack align="start" spacing={0} flex="1" minWidth="0">
//       <Text fontSize="9px" color="#C1C1C1" fontFamily="DM Sans">
//         {label}
//       </Text>
//       <InputGroup w={width}>
//         <Input
//           size="xs"
//           value={value || "N/A"}
//           h="1.3rem"
//           bg={bg}
//           color={color}
//           border="1px solid"
//           borderRadius="5px"
//           borderColor="gray.300"
//           fontSize="xs"
//           fontFamily="DM Sans"
//           _focus={{ borderColor: "#B79045", boxShadow: "0 0 0 1px #B79045" }}
//           _hover={{ borderColor: "#B79045" }}
//           pr="1.5rem"
//           disabled={true}
//           pl={label === "Status" ? "3px" : undefined}
//         />
//         <InputRightElement
//           pointerEvents="none"
//           h="1.3rem"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           w="1.5rem"
//         >
//           <Icon as={ChevronDownIcon} color={color} boxSize={4} />
//         </InputRightElement>
//       </InputGroup>
//     </VStack>
//   )
// );

// const ContactPair = memo(({ label, value, color }) => (
//   <VStack align="start" spacing={0} flex="1" minWidth="0">
//     <HStack>
//       <Text fontSize="12px" color="#C1C1C1" fontFamily="DM Sans">
//         {label}
//       </Text>
//       <Tooltip label={`Copy ${label}`}>
//         <Icon
//           as={CopyIcon}
//           color="gray.500"
//           cursor="pointer"
//           boxSize={3}
//           ml={0.5}
//           onClick={() => handleCopy(value || "N/A")}
//         />
//       </Tooltip>
//     </HStack>
//     <Text
//       fontSize={label === "Phone" ? "sm" : "xs"}
//       color={color}
//       fontFamily="DM Sans"
//     >
//       {value || "N/A"}
//     </Text>
//   </VStack>
// ));

// // Optimized Lead Cycle Modal
// const LeadCycleModal = memo(({ isOpen, onClose, leadId }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const user = JSON.parse(localStorage.getItem("user"));
//   const hasFetched = useRef(false); // Track if API has been called

//   const fetchData = async () => {
//     if (hasFetched.current) return; // Prevent multiple calls
//     hasFetched.current = true;
//     setLoading(true);

//     try {
//       const response = await getApi(`api/lead/cycle/${leadId}`);
//       const responseData = response?.data;

//       const timelineData = [];
//       let createdByName = "Unknown";
//       if (responseData.lead?.createBy?.firstName) {
//         createdByName =
//           responseData.lead.createBy.firstName +
//           " " +
//           responseData.lead.createBy.lastName;
//       }
//       timelineData.push({
//         type: "creation",
//         updatedAt: new Date(responseData.lead.createdDate)?.toUTCString(),
//         updatedBy: createdByName,
//         updatedData: "",
//       });
//       responseData?.data?.forEach((updated) =>
//         timelineData.push({
//           type: updated.type,
//           updatedAt: updated.updatedAt,
//           updatedBy:
//             updated.updatedBy?.firstName + " " + updated.updatedBy?.lastName,
//           updatedData: updated.updatedData,
//         })
//       );

//       setData(timelineData);
//     } catch (error) {
//       console.log(error);
//       toast.error("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user && user?._id && leadId && isOpen && !hasFetched.current) {
//       fetchData();
//     }
//     // Cleanup: Reset hasFetched when modal closes
//     return () => {
//       if (!isOpen) hasFetched.current = false;
//     };
//   }, [leadId, isOpen]);

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>Lead Cycle</ModalHeader>
//         <ModalCloseButton />
//         <ModalBody overflow="hidden" width="100%">
//           <Box
//             width="100%"
//             m="0"
//             maxH="400px"
//             overflowY="auto"
//             sx={{
//               "&::-webkit-scrollbar": {
//                 width: "6px",
//               },
//               "&::-webkit-scrollbar-thumb": {
//                 background: "brand.500",
//                 borderRadius: "8px",
//               },
//               "&::-webkit-scrollbar-thumb:hover": {
//                 background: "brand.600",
//               },
//             }}
//           >
//             {loading ? (
//               <Flex justifyContent="center" alignItems="center" width="100%">
//                 <Spinner />
//               </Flex>
//             ) : (
//               <Box>
//                 <HSeparator />
//                 <Box mt={5} pl={10}>
//                   <LeadHistoryTimeline timelineData={data} />
//                 </Box>
//               </Box>
//             )}
//           </Box>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// });

// // Main Component
// const LeadCard = ({
//   _id,
//   intID,
//   leadId,
//   leadName,
//   city,
//   nationality,
//   sourceContent,
//   timetocall,
//   mStatus,
//   r_u_in_uae,
//   leadCampaign,
//   leadStatus,
//   budget,
//   approvalStatus,
//   leadPhoneNumber,
//   leadWhatsappNumber,
//   createdDate,
//   lastNote,
//   sendRequest,
//   cancelRequest,
//   buyLoading,
// }) => {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   const userId = user?._id;
//   const formattedCreatedDate = formattedDate(createdDate);
//   const [cancelLoading, setCancelLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { borderColor, buttonBg, buttonHoverBg, buttonColor } =
//     getStatusStyles(approvalStatus);
//   const isRejected = approvalStatus?.toLowerCase() === "rejected";

//   const handleBuyClick = () => {
//     console.log("Buy clicked for lead:", _id);
//     if (
//       approvalStatus?.toLowerCase() !== "pending" &&
//       approvalStatus?.toLowerCase() !== "rejected"
//     ) {
//       sendRequest(_id);
//     }
//   };

//   const handleCancelClick = async () => {
//     if (approvalStatus?.toLowerCase() === "pending" && cancelRequest) {
//       setCancelLoading(true);
//       try {
//         await cancelRequest(_id, leadId || _id, userId);
//       } catch (error) {
//         console.error("Cancel failed:", error);
//       } finally {
//         setCancelLoading(false);
//       }
//     } else {
//       console.log("Cancel condition not met or cancelRequest missing");
//     }
//   };

//   const handleViewLeadCycle = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   return (
//     <Box
//       borderRadius="lg"
//       p="3"
//       height="320px"
//       overflow="hidden"
//       flex="wrap"
//       _hover={{
//         boxShadow: "0 15px 20px -3px #E2E8F0, 0 4px 6px -2px #E2E8F0",
//       }}
//       transition="box-shadow 0.2s ease-in-out"
//       display="flex"
//       flexDirection="column"
//       border="1px solid"
//       borderColor={borderColor}
//     >
//       <CardHeader id={intID} onViewLeadCycle={handleViewLeadCycle} />
//       <HStack align="start" spacing={1} w="100%" h="calc(100% - 30px)">
//         <VStack align="start" spacing={1} flex="2" minWidth="0" h="100%">
//           <Text fontSize="12px" fontWeight="bold" fontFamily="DM Sans">
//             {leadName || "N/A"}
//           </Text>
//           <HStack spacing={0.5} w="100%" flexWrap="wrap">
//             <InfoPair label="City" value={city} />
//             <InfoPair label="Country" value={nationality} />
//           </HStack>
//           <HStack spacing={0.5} w="100%" flexWrap="wrap">
//             <InputPair
//               label="M Status"
//               value={mStatus}
//               bg="#E5B668"
//               color="white"
//             />
//             <InputPair
//               label="Status"
//               value={leadStatus}
//               bg="#FEEFEE"
//               color="black"
//             />
//           </HStack>
//           <VStack align="start" spacing={0} width="100%">
//             <HStack>
//               <Text fontSize="xs" color="#C1C1C1" fontFamily="DM Sans">
//                 Lead Note
//               </Text>
//               <Tooltip label={lastNote || "N/A"} placement="top" hasArrow>
//                 <Icon
//                   as={InfoIcon}
//                   boxSize={3}
//                   color="#63B3ED"
//                   cursor="pointer"
//                 />
//               </Tooltip>
//             </HStack>
//             <Text
//               fontSize={lastNote?.length > 100 ? "xx-small" : "xs"}
//               color="gray.500"
//               fontFamily="DM Sans"
//             >
//               {lastNote || "N/A"}
//             </Text>
//           </VStack>
//           <VStack
//             h="auto"
//             w="100%"
//             align="start"
//             justify="center"
//             flex="1"
//             spacing={0}
//           >
//             {approvalStatus?.toLowerCase() === "pending" ? (
//               <HStack w="100%" maxWidth="200px" spacing={2}>
//                 <Button
//                   bg="red.500"
//                   color="white"
//                   size="xs"
//                   flex="1"
//                   fontFamily="DM Sans"
//                   borderRadius="5px"
//                   _hover={{ bg: "red.600" }}
//                   onClick={handleCancelClick}
//                   isLoading={cancelLoading}
//                   isDisabled={cancelLoading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   bg={buttonBg}
//                   color={buttonColor}
//                   size="xs"
//                   flex="1"
//                   fontFamily="DM Sans"
//                   borderRadius="5px"
//                   _hover={{ bg: buttonHoverBg }}
//                   isDisabled={true}
//                 >
//                   {displayButtonText(approvalStatus)}
//                 </Button>
//               </HStack>
//             ) : (
//               <Button
//                 bg={buttonBg}
//                 color={buttonColor}
//                 size="xs"
//                 width="100%"
//                 maxWidth="200px"
//                 fontFamily="DM Sans"
//                 borderRadius="5px"
//                 _hover={{ bg: buttonHoverBg }}
//                 flexShrink={0}
//                 onClick={handleBuyClick}
//                 isLoading={buyLoading[_id]}
//                 isDisabled={buyLoading[_id] || isRejected}
//               >
//                 {displayButtonText(approvalStatus)}
//               </Button>
//             )}
//           </VStack>
//         </VStack>
//         <VStack
//           align="start"
//           spacing={2}
//           flex="1"
//           minWidth="0"
//           h="100%"
//           ml="15px"
//           justify="space-between"
//         >
//           <VStack align="start" spacing={2}>
//             <VStack align="start" spacing={0}>
//               <Text
//                 fontSize="xs"
//                 color="#AEBAC9"
//                 fontWeight="bold"
//                 fontFamily="DM Sans"
//               >
//                 Time To Call
//               </Text>
//               <Text fontSize="10px" color="#32BD00" fontFamily="DM Sans">
//                 {timetocall || "N/A"}
//               </Text>
//             </VStack>
//             <VStack align="start" spacing={0}>
//               <Text
//                 fontSize="xs"
//                 color="#AEBAC9"
//                 fontWeight="bold"
//                 fontFamily="DM Sans"
//               >
//                 Source Content
//               </Text>
//               <Text fontSize="10px" color="#FFBB00" fontFamily="DM Sans">
//                 {sourceContent || "N/A"}
//               </Text>
//             </VStack>
//           </VStack>
//           <VStack align="start" spacing={0} width="100%">
//             <Text
//               fontSize="xs"
//               color="#AEBAC9"
//               fontWeight="bold"
//               fontFamily="DM Sans"
//               mb={1}
//             >
//               Info
//             </Text>
//             {[
//               { label: "Budget", value: budget },
//               { label: "Campaign", value: leadCampaign },
//               { label: "Campaign Url", value: null },
//               { label: "Medium", value: null },
//               { label: "In UAE?", value: r_u_in_uae },
//             ].map((item) => (
//               <HStack
//                 key={item.label}
//                 lineHeight="20px"
//                 width="100%"
//                 justifyContent="space-between"
//                 spacing={0}
//                 marginBottom={-1}
//               >
//                 <Text
//                   fontSize="10px"
//                   color="black"
//                   fontWeight={500}
//                   fontFamily="DM Sans"
//                   marginBottom={0}
//                 >
//                   {item.label}
//                 </Text>
//                 <Tooltip label={item.value || "N/A"} placement="right" hasArrow>
//                   <Icon
//                     as={InfoIcon}
//                     color="blue.300"
//                     boxSize={3.5}
//                     cursor="pointer"
//                   />
//                 </Tooltip>
//               </HStack>
//             ))}
//           </VStack>
//         </VStack>
//       </HStack>
//       <HStack width="100%" justifyContent="flex-end" mt={1}>
//         <Text fontSize="10px" color="#32343D" fontFamily="DM Sans">
//           Lead time: {formattedCreatedDate || "N/A"}
//         </Text>
//       </HStack>
//       <LeadCycleModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         leadId={leadId || _id}
//       />
//     </Box>
//   );
// };

// export default LeadCard;


import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  Icon,
  Tooltip,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { InfoIcon, CopyIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { formattedDate } from "utils/helpers";
import CardHeader from "./LeadCard/CardHeader"; // Updated import
import InfoPair from "./LeadCard/InfoPair";       // Updated import
import InputPair from "./LeadCard/InputPair";     // Updated import
import ContactPair from "./LeadCard/ContactPair"; // Updated import
import LeadCycleModal from "./LeadCard/LeadCycleModal"; // Updated import

class TimelineItem {
  constructor(type, updatedAt, updatedBy, updatedData) {
    this.type = type;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.updatedData = updatedData;
  }
}

const LeadCard = ({
  _id,
  intID,
  leadId,
  leadName,
  city,
  nationality,
  sourceContent,
  timetocall,
  mStatus,
  r_u_in_uae,
  leadCampaign,
  leadStatus,
  budget,
  approvalStatus,
  leadPhoneNumber,
  leadWhatsappNumber,
  createdDate,
  lastNote,
  sendRequest,
  cancelRequest,
  buyLoading,
}) => {
  const formattedCreatedDate = formattedDate(createdDate);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [cancelLoading, setCancelLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayButtonText = () => {
    switch (approvalStatus?.toLowerCase()) {
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      case "new":
        return "Buy for 300 coins";
      default:
        return "Buy for 50 coins";
    }
  };

  const handleBuyClick = () => {
    console.log("Buy clicked for lead:", _id);
    if (
      approvalStatus?.toLowerCase() !== "pending" &&
      approvalStatus?.toLowerCase() !== "rejected"
    ) {
      sendRequest(_id);
    }
  };

  const handleCancelClick = async () => {
    if (approvalStatus?.toLowerCase() === "pending" && cancelRequest) {
      setCancelLoading(true);
      try {
        await cancelRequest(_id, leadId || _id, userId);
        setCancelLoading(false);
      } catch (error) {
        console.error("Cancel failed:", error);
        setCancelLoading(false);
      }
    } else {
      console.log("Cancel condition not met or cancelRequest missing");
    }
  };

  const getStatusStyles = (approvalStatus) => {
    switch (approvalStatus?.toLowerCase()) {
      case "pending":
        return {
          borderColor: "#FFEB3B",
          buttonBg: "#FFEB3B",
          buttonHoverBg: "#FFB300",
          buttonColor: "black",
        };
      case "rejected":
        return {
          borderColor: "#FF3B3B",
          buttonBg: "#FF3B3B",
          buttonHoverBg: "#D32F2F",
          buttonColor: "white",
        };
      default:
        return {
          borderColor: "#D8D8D9",
          buttonBg: "#34C759",
          buttonHoverBg: "#32BD00",
          buttonColor: "white",
        };
    }
  };

  const {
    borderColor,
    buttonBg: dynamicButtonBg,
    buttonHoverBg: dynamicButtonHoverBg,
    buttonColor: dynamicButtonColor,
  } = getStatusStyles(approvalStatus);

  const isRejected = approvalStatus?.toLowerCase() === "rejected";

  const handleViewLeadCycle = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      borderRadius="lg"
      p="3"
      height="320px"
      overflow="hidden"
      flex="wrap"
      _hover={{
        boxShadow: "0 15px 20px -3px #E2E8F0, 0 4px 6px -2px #E2E8F0",
      }}
      transition="box-shadow 0.2s ease-in-out"
      display="flex"
      flexDirection="column"
      border="1px solid"
      borderColor={borderColor}
    >
      <CardHeader id={intID} onViewLeadCycle={handleViewLeadCycle} />
      <HStack align="start" spacing={1} w="100%" h="calc(100% - 30px)">
        <VStack align="start" spacing={1} flex="2" minWidth="0" h="100%">
          <Text fontSize="12px" fontWeight="bold" fontFamily="DM Sans">
            {leadName || "N/A"}
          </Text>
          <HStack spacing={0.5} w="100%" flexWrap="wrap">
            <InfoPair label="City" value={city} />
            <InfoPair label="Country" value={nationality} />
          </HStack>
          <HStack spacing={0.5} w="100%" flexWrap="wrap">
            <InputPair
              label="M Status"
              value={mStatus}
              bg="#E5B668"
              color="white"
            />
            <InputPair
              label="Status"
              value={leadStatus}
              bg="#FEEFEE"
              color="black"
            />
          </HStack>
          <VStack align="start" spacing={0} width="100%">
            <HStack>
              <Text fontSize="xs" color="#C1C1C1" fontFamily="DM Sans">
                Lead Note
              </Text>
              <Tooltip label={lastNote || "N/A"} placement="top" hasArrow>
                <span>
                  <Icon
                    as={InfoIcon}
                    boxSize={3}
                    color="#63B3ED"
                    cursor="pointer"
                  />
                </span>
              </Tooltip>
            </HStack>
            <Text
              fontSize={lastNote?.length > 100 ? "xx-small" : "xs"}
              color="gray.500"
              fontFamily="DM Sans"
            >
              {lastNote || "N/A"}
            </Text>
          </VStack>
          <VStack
            h="auto"
            w="100%"
            align="start"
            justify="center"
            flex="1"
            spacing={0}
          >
            {approvalStatus?.toLowerCase() === "pending" ? (
              <HStack w="100%" maxWidth="200px" spacing={2}>
                <Button
                  bg="red.500"
                  color="white"
                  size="xs"
                  flex="1"
                  fontFamily="DM Sans"
                  borderRadius="5px"
                  _hover={{ bg: "red.600" }}
                  onClick={handleCancelClick}
                  isLoading={cancelLoading}
                  isDisabled={cancelLoading}
                >
                  Cancel
                </Button>
                <Button
                  bg={dynamicButtonBg}
                  color={dynamicButtonColor}
                  size="xs"
                  flex="1"
                  fontFamily="DM Sans"
                  borderRadius="5px"
                  _hover={{ bg: dynamicButtonHoverBg }}
                  isDisabled={true}
                >
                  {displayButtonText()}
                </Button>
              </HStack>
            ) : (
              <Button
                bg={dynamicButtonBg}
                color={dynamicButtonColor}
                size="xs"
                width="100%"
                maxWidth="200px"
                fontFamily="DM Sans"
                borderRadius="5px"
                _hover={{ bg: dynamicButtonHoverBg }}
                flexShrink={0}
                onClick={handleBuyClick}
                isLoading={buyLoading[_id]}
                isDisabled={buyLoading[_id] || isRejected}
              >
                {displayButtonText()}
              </Button>
            )}
          </VStack>
        </VStack>
        <VStack
          align="start"
          spacing={2}
          flex="1"
          minWidth="0"
          h="100%"
          ml="15px"
          justify="space-between"
        >
          <VStack align="start" spacing={2}>
            <VStack align="start" spacing={0}>
              <Text
                fontSize="xs"
                color="#AEBAC9"
                fontWeight="bold"
                fontFamily="DM Sans"
              >
                Time To Call
              </Text>
              <Text fontSize="10px" color="#32BD00" fontFamily="DM Sans">
                {timetocall || "N/A"}
              </Text>
            </VStack>
            <VStack align="start" spacing={0}>
              <Text
                fontSize="xs"
                color="#AEBAC9"
                fontWeight="bold"
                fontFamily="DM Sans"
              >
                Source Content
              </Text>
              <Text fontSize="10px" color="#FFBB00" fontFamily="DM Sans">
                {sourceContent || "N/A"}
              </Text>
            </VStack>
          </VStack>
          <VStack align="start" spacing={0} width="100%">
            <Text
              fontSize="xs"
              color="#AEBAC9"
              fontWeight="bold"
              fontFamily="DM Sans"
              mb={1}
            >
              Info
            </Text>
            {[
              { label: "Budget", value: budget || "N/A" },
              { label: "Campaign", value: leadCampaign || "N/A" },
              { label: "Campaign Url", value: "N/A" },
              { label: "Medium", value: "N/A" },
              { label: "In UAE?", value: r_u_in_uae || "N/A" },
            ].map((item) => (
              <HStack
                key={item.label}
                lineHeight="20px"
                width="100%"
                justifyContent="space-between"
                spacing={0}
                marginBottom={-1}
              >
                <Text
                  fontSize="10px"
                  color="black"
                  fontWeight={500}
                  fontFamily="DM Sans"
                  marginBottom={0}
                >
                  {item.label}
                </Text>
                <Tooltip label={item.value} placement="right" hasArrow>
                  <span>
                    <Icon
                      as={InfoIcon}
                      color="blue.300"
                      boxSize={3.5}
                      cursor="pointer"
                    />
                  </span>
                </Tooltip>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </HStack>
      <HStack width="100%" justifyContent="flex-end" mt={1}>
        <Text fontSize="10px" color="#32343D" fontFamily="DM Sans">
          Lead time: {formattedCreatedDate || "N/A"}
        </Text>
      </HStack>

      {/* Modal for Lead Cycle */}
      {isModalOpen && (
        <LeadCycleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          leadId={leadId || _id}
        />
      )}
    </Box>
  );
};

export default LeadCard;