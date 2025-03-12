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
import CardHeader from "./LeadCard/CardHeader";
import InfoPair from "./LeadCard/InfoPair";
import InputPair from "./LeadCard/InputPair";
import LeadCycleModal from "./LeadCard/LeadCycleModal";
import LeadsModal from "../../lead/LeadsModal";

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
  createdDate,
  lastNote,
  sendRequest,
  cancelRequest,
  buyLoading,
  refreshData,
}) => {
  const formattedCreatedDate = formattedDate(createdDate);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [cancelLoading, setCancelLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadsModal, setLeadsModal] = useState({ isOpen: false, lid: null });

  useEffect(() => {
    console.log("leadsModal state updated:", leadsModal);
  }, [leadsModal]);

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

  const handleLeadsModal = (lid) => {
    console.log("handleLeadsModal called with lid:", lid);
    setLeadsModal({
      isOpen: true,
      lid,
    });
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
          <Text
            fontSize="12px"
            fontWeight="bold"
            fontFamily="DM Sans"
            cursor="pointer"
            _hover={{ color: "blue.500" }}
            onClick={() => {
              console.log("Name clicked, leadId:", leadId || _id);
              handleLeadsModal(leadId || _id);
            }}
          >
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

      {/* Modal for Leads */}
      {leadsModal.isOpen && (
        <LeadsModal
          leadsModal={leadsModal}
          onClose={() => {
            console.log("Closing LeadsModal");
            setLeadsModal({ isOpen: false, lid: null });
          }}
          reFreshData={refreshData}
          isInLeadPool
        />
      )}
    </Box>
  );
};

export default LeadCard;
