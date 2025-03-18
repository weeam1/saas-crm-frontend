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
} from "@chakra-ui/react";
import { InfoIcon, CopyIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { CiMenuKebab } from "react-icons/ci";
import { FaEye, FaHistory } from "react-icons/fa";
import { handleCopy } from "../utils/utils";
import { getUserNameById } from "utils";
import { formattedDate } from "utils/helpers";
import LeadCycleModal from "../components/LeadCard/LeadCycleModal";
import LeadsModal from "../../lead/LeadsModal";
import { leadStatus } from "utils/options";

const getLabelByValue = (value) => {
  const status = leadStatus.find((status) => status.value === value);
  return status ? status.label : "N/A";
};

const LeadCard = ({
  leadId,
  leadName,
  nationality,
  city,
  sourceContent,
  timeToCall,
  mStatus,
  leadStatus: leadStatusValue,
  approvalStatus: initialApprovalStatus,
  agentId,
  approved,
  approvedDate,
  rejectedDate,
  createdDate,
  tab = "All",
  approveChangeHandler,
  _id,
  refreshData,
}) => {
  const formattedCreatedDate = formattedDate(createdDate);
  const formattedApprovedDate = formattedDate(approvedDate);
  const formattedRejectedDate = formattedDate(rejectedDate);

  const users = useSelector((state) => state.user?.users) || [];
  const agentName = getUserNameById(agentId, users);

  const [localApprovalStatus, setLocalApprovalStatus] = useState(
    initialApprovalStatus
  );
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [leadsModal, setLeadsModal] = useState({ isOpen: false, lid: null });

  useEffect(() => {
    setLocalApprovalStatus(initialApprovalStatus);
  }, [initialApprovalStatus]);

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          borderColor: "#cdcdcd",
          buttonBg: "#FFEB3B",
          buttonHoverBg: "#FFB300",
          buttonColor: "black",
        };
      case "rejected":
        return {
          borderColor: "#c73434",
          buttonBg: "#FF4B4B",
          buttonHoverBg: "#D32F2F",
          buttonColor: "white",
        };
      case "accepted":
        return {
          borderColor: "#34c759",
          buttonBg: "#4BFF79",
          buttonHoverBg: "#32BD00",
          buttonColor: "white",
        };
      default:
        return {
          borderColor: "#cdcdcd",
          buttonBg: "#FFEB3B",
          buttonHoverBg: "#FFB300",
          buttonColor: "black",
        };
    }
  };

  const { borderColor, buttonBg, buttonHoverBg, buttonColor } =
    getStatusStyles(localApprovalStatus);

  const handleApprovalChange = async (action) => {
    if (action === "accept") {
      setIsAcceptLoading(true);
    } else {
      setIsRejectLoading(true);
    }

    try {
      await approveChangeHandler(action, leadId, agentId, _id);
      setLocalApprovalStatus(action === "accept" ? "accepted" : "rejected");
    } catch (error) {
      console.error("Approval change failed:", error);
    } finally {
      if (action === "accept") {
        setIsAcceptLoading(false);
      } else {
        setIsRejectLoading(false);
      }
    }
  };

  const handleViewLeadCycle = () => {
    console.log("Opening LeadCycleModal for lead:", leadId || _id);
    setIsCycleModalOpen(true);
  };

  const handleCloseCycleModal = () => {
    setIsCycleModalOpen(false);
  };

  const handleLeadsModal = (lid) => {
    console.log("Opening LeadsModal with lid:", lid);
    setLeadsModal({
      isOpen: true,
      lid,
    });
  };

  const renderActionSection = () => {
    const statusLower = localApprovalStatus?.toLowerCase();

    if (tab === "All") {
      if (statusLower === "accepted") {
        return (
          <VStack w="100%" spacing={1} align="start">
            <Text fontSize="9px" color="gray.500" fontFamily="DM Sans">
              Approved on
            </Text>
            <Text fontSize="12px" color="gray.500" fontFamily="DM Sans">
              {formattedApprovedDate || "N/A"}
            </Text>
            <Box
              bg="#4BFF79"
              w="100%"
              p={1}
              borderRadius="5px"
              textAlign="center"
            >
              <Text
                fontSize="xs"
                color="black"
                fontWeight="bold"
                fontFamily="DM Sans"
              >
                Accepted
              </Text>
            </Box>
          </VStack>
        );
      } else if (statusLower === "rejected") {
        return (
          <VStack w="100%" spacing={1} align="start">
            <Text fontSize="9px" color="gray.500" fontFamily="DM Sans">
              Rejected on
            </Text>
            <Text fontSize="12px" color="gray.500" fontFamily="DM Sans">
              {formattedRejectedDate || "N/A"}
            </Text>
            <Box
              bg="#FF4B4B"
              w="100%"
              p={1}
              borderRadius="5px"
              textAlign="center"
            >
              <Text
                fontSize="xs"
                color="white"
                fontWeight="bold"
                fontFamily="DM Sans"
              >
                Rejected
              </Text>
            </Box>
          </VStack>
        );
      } else {
        return (
          <HStack spacing={2} w="100%" mt={10}>
            <Button
              bg="#3FFC6E"
              color="white"
              size="xs"
              w="50%"
              maxW="100px"
              fontFamily="DM Sans"
              borderRadius="5px"
              _hover={{ bg: "#32BD00" }}
              onClick={() => handleApprovalChange("accept")}
              isLoading={isAcceptLoading}
              isDisabled={isAcceptLoading || isRejectLoading}
            >
              Accept
            </Button>
            <Button
              bg="#FF6363"
              color="white"
              size="xs"
              w="50%"
              maxW="100px"
              fontFamily="DM Sans"
              borderRadius="5px"
              _hover={{ bg: "#D32F2F" }}
              onClick={() => handleApprovalChange("reject")}
              isLoading={isRejectLoading}
              isDisabled={isAcceptLoading || isRejectLoading}
            >
              Reject
            </Button>
          </HStack>
        );
      }
    } else if (tab === "Accepted") {
      return (
        <Box bg="#4BFF79" w="100%" p={1} borderRadius="5px" textAlign="center">
          <Text
            fontSize="xs"
            color="black"
            fontWeight="bold"
            fontFamily="DM Sans"
          >
            Accepted
          </Text>
        </Box>
      );
    } else if (tab === "Rejected") {
      return (
        <VStack w="100%" spacing={1} align="start">
          <Text fontSize="9px" color="gray.500" fontFamily="DM Sans">
            Rejected on
          </Text>
          <Text fontSize="12px" color="gray.500" fontFamily="DM Sans">
            {formattedRejectedDate || "N/A"}
          </Text>
          <Box
            bg="#FF4B4B"
            w="100%"
            p={1}
            borderRadius="5px"
            textAlign="center"
          >
            <Text
              fontSize="xs"
              color="white"
              fontWeight="bold"
              fontFamily="DM Sans"
            >
              Rejected
            </Text>
          </Box>
        </VStack>
      );
    } else if (tab === "Pending") {
      return (
        <Box bg="#FFEB3B" w="100%" p={1} borderRadius="5px" textAlign="center">
          <Text
            fontSize="xs"
            color="black"
            fontWeight="bold"
            fontFamily="DM Sans"
          >
            Pending
          </Text>
        </Box>
      );
    }
  };

  return (
    <Box
      borderRadius="lg"
      p={3}
      w="100%"
      h="320px"
      overflow="hidden"
      bg="white"
      border="1px solid"
      borderColor={borderColor}
      transition="box-shadow 0.2s ease-in-out"
      _hover={{
        boxShadow: "0 15px 20px -3px #E2E8F0, 0 4px 6px -2px #E2E8F0",
      }}
    >
      <CardHeader
        id={leadId}
        onViewLeadCycle={handleViewLeadCycle}
        onViewLead={handleLeadsModal}
        leadId={leadId || _id}
      />
      <HStack align="start" spacing={2} w="100%" h="calc(100% - 30px)" flex="2">
        <VStack align="start" spacing={2} flex="2" w="60%" minW={0}>
          <Text
            fontSize="12px"
            fontWeight="bold"
            fontFamily="DM Sans"
            isTruncated
          >
            {leadName || "N/A"}
          </Text>
          <HStack spacing={4} w="100%" alignItems="flex-start">
            <VStack align="start" spacing={1} flex="1" minW={0}>
              <Text
                fontSize="10px"
                color="#BEBEBE"
                fontFamily="DM Sans"
                lineHeight="1.2"
              >
                Source Content
              </Text>
              <Text
                fontSize="10px"
                color="#FFBB00"
                fontFamily="DM Sans"
                isTruncated
                lineHeight="1.2"
              >
                {sourceContent || "N/A"}
              </Text>
            </VStack>
            <VStack align="start" spacing={1} flex="1" minW={0}>
              <Text
                fontSize="10px"
                color="#FFBB00"
                fontFamily="DM Sans"
                lineHeight="1.2"
              >
                Time To Call
              </Text>
              <Text
                fontSize="10px"
                color="#36BE05"
                fontFamily="DM Sans"
                isTruncated
                lineHeight="1.2"
              >
                {timeToCall || "N/A"}
              </Text>
            </VStack>
          </HStack>
          <HStack spacing={2} w="100%">
            <InputPair
              label="M Status"
              value={mStatus}
              bg="#E5B668"
              width="85px"
              color="white"
            />
            <InputPair
              label="Status"
              value={getLabelByValue(leadStatusValue)} // Use the utility function here
              bg="#FEEFEE"
              width="85px"
              color="black"
            />
          </HStack>
          <VStack align="start" spacing={0} height="3rem" w="100%">
            <Text fontSize="xs" color="#C1C1C1" fontFamily="DM Sans">
              Requested by
            </Text>
            <Text
              fontSize="xs"
              color="gray.500"
              fontFamily="DM Sans"
              isTruncated
            >
              {agentName || "N/A"}
            </Text>
          </VStack>
          <Box flex="1" w="100%" display="flex" alignItems="flex-end">
            {renderActionSection()}
          </Box>
        </VStack>
        <VStack
          align="start"
          spacing={2}
          flex="1"
          w="40%"
          minW={0}
          h="100%"
          justify="space-between"
        >
          <VStack spacing={2} w="100%" align="start" pl={2}>
            <InfoPair
              label="City"
              value={<Text fontWeight="bold">{city || "N/A"}</Text>}
            />
            <InfoPair
              label="Country"
              value={<Text fontWeight="bold">{nationality || "N/A"}</Text>}
            />
          </VStack>

          <VStack align="start" spacing={1} w="100%" pl={2}>
            <Text
              fontSize="xs"
              color="#AEBAC9"
              fontWeight="bold"
              fontFamily="DM Sans"
            >
              Info
            </Text>
            {[
              { label: "Budget", value: "N/A" },
              { label: "Campaign", value: "N/A" },
              { label: "Campaign Url", value: "N/A" },
              { label: "Medium", value: "N/A" },
              { label: "In UAE?", value: "Yes" },
            ].map((item) => (
              <HStack
                key={item.label}
                w="100%"
                justify="space-between"
                spacing={0}
                lineHeight="18px"
              >
                <Text
                  fontSize="10px"
                  color="black"
                  fontWeight={500}
                  fontFamily="DM Sans"
                >
                  {item.label}
                </Text>
                <Tooltip label={item.value} placement="right" hasArrow>
                  <Icon
                    as={InfoIcon}
                    color="blue.300"
                    boxSize={3.5}
                    cursor="pointer"
                  />
                </Tooltip>
              </HStack>
            ))}
            {/* Moved Lead time here */}
          </VStack>
        </VStack>
      </HStack>
      <Text
        fontSize="10px"
        fontFamily="'DM Sans', sans-serif"
        display="flex"
        justifyContent="flex-end"
      >
        <Box as="span" color="#171923">
          Lead time:{" "}
        </Box>
        <Box as="span" color="black">
          {formattedCreatedDate}
        </Box>
      </Text>
      {isCycleModalOpen && (
        <LeadCycleModal
          isOpen={isCycleModalOpen}
          onClose={handleCloseCycleModal}
          leadId={leadId || _id}
        />
      )}

      {leadsModal.isOpen && (
        <LeadsModal
          leadsModal={leadsModal}
          onClose={() => setLeadsModal({ isOpen: false, lid: null })}
          reFreshData={refreshData}
          isInLeadPool
        />
      )}
    </Box>
  );
};

// Rest of the components (CardHeader, InfoPair, InputPair, ContactPair) remain unchanged
const CardHeader = ({ id, onViewLeadCycle, onViewLead, leadId }) => (
  <HStack justifyContent="space-between" w="100%">
    <HStack>
      <Icon
        as={FaEye}
        color="#C1C1C1"
        boxSize={3}
        cursor="pointer"
        onClick={() => onViewLead(leadId)}
        _hover={{ color: "blue.500" }}
      />
    </HStack>
    <Menu>
      <MenuButton>
        <Icon as={CiMenuKebab} color="#C1C1C1" cursor="pointer" boxSize={4} />
      </MenuButton>
      <MenuList>
        <MenuItem icon={<FaHistory fontSize={15} />} onClick={onViewLeadCycle}>
          View Lead Cycle
        </MenuItem>
      </MenuList>
    </Menu>
  </HStack>
);

const InfoPair = ({ label, value, color = "#ff0307" }) => (
  <VStack align="start" spacing={0} flex="1" minW={0}>
    <Text fontSize="9px" color="#C1C1C1" fontFamily="DM Sans">
      {label}
    </Text>
    <Text fontSize="10px" color={color} fontFamily="DM Sans" isTruncated>
      {value || "N/A"}
    </Text>
  </VStack>
);

const InputPair = ({
  label,
  value,
  bg,
  color,
  width = { base: "60px", md: "70px" },
}) => (
  <VStack align="start" spacing={0} flex="1" minW={0}>
    <Text fontSize="9px" color="#C1C1C1" fontFamily="DM Sans">
      {label}
    </Text>
    <InputGroup w={width}>
      <Input
        size="xs"
        value={value || "N/A"}
        h="1.3rem"
        bg={bg}
        color={color}
        border="1px solid"
        borderRadius="5px"
        borderColor="gray.300"
        fontSize="xs"
        fontFamily="DM Sans"
        _focus={{ borderColor: "#B79045", boxShadow: "0 0 0 1px #B79045" }}
        _hover={{ borderColor: "#B79045" }}
        pr="1.5rem"
        isDisabled
        pl={label === "Status" ? "3px" : undefined}
      />
      <InputRightElement
        pointerEvents="none"
        h="1.3rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="1.5rem"
      >
        <Icon as={ChevronDownIcon} color={color} boxSize={4} />
      </InputRightElement>
    </InputGroup>
  </VStack>
);

const ContactPair = ({ label, value, color }) => (
  <VStack align="start" spacing={0} flex="1" minW={0}>
    <HStack spacing={1}>
      <Text fontSize="12px" color="#C1C1C1" fontFamily="DM Sans">
        {label}
      </Text>
      <Tooltip>
        <Icon
          as={CopyIcon}
          color="gray.500"
          cursor="pointer"
          boxSize={3}
          onClick={() => handleCopy(value)}
        />
      </Tooltip>
    </HStack>
    <Text
      fontSize={label === "Phone" ? "12px" : "xs"}
      color={color}
      fontFamily="DM Sans"
      isTruncated
    >
      {value || "N/A"}
    </Text>
  </VStack>
);

export default LeadCard;
