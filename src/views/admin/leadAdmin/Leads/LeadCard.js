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
} from "@chakra-ui/react";
import { InfoIcon, CopyIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { CiMenuKebab } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { handleCopy } from "../utils/utils";
import { getUserNameById } from "utils";


const LeadCard = ({
  leadId,
  leadName,
  nationality,
  city,
  sourceContent,
  timeToCall,
  mStatus,
  leadStatus,
  approvalStatus: initialApprovalStatus,
  agentId,
  approved,
  createdDate,
  tab = "All",
  approveChangeHandler,
  _id,
}) => {
  const users = useSelector((state) => state.user?.users) || [];
  const agentName = getUserNameById(agentId, users);

  const [localApprovalStatus, setLocalApprovalStatus] = useState(
    initialApprovalStatus
  );
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);

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
          buttonBg: "#FF3B3B",
          buttonHoverBg: "#D32F2F",
          buttonColor: "white",
        };
      case "accepted":
        return {
          borderColor: "#34c759",
          buttonBg: "#34C759",
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
              {approved || "N/A"}
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
        );
      } else {
        return (
          <HStack spacing={2} w="100%">
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
        <Box bg="#FF4B4B" w="100%" p={1} borderRadius="5px" textAlign="center">
          <Text
            fontSize="xs"
            color="white"
            fontWeight="bold"
            fontFamily="DM Sans"
          >
            Rejected
          </Text>
        </Box>
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
      <CardHeader id={leadId} />
      <HStack align="start" spacing={2} w="100%" h="calc(100% - 30px)" flex="1">
        <VStack align="start" spacing={2} flex="2" w="60%" minW={0}>
          <Text
            fontSize="12px"
            fontWeight="bold"
            fontFamily="DM Sans"
            isTruncated
          >
            {leadName || "N/A"}
          </Text>
          <HStack spacing={2} w="100%">
            <InfoPair label="City" value={city} />
            <InfoPair label="Country" value={nationality} />
          </HStack>
          <HStack spacing={2} w="100%">
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
              <Text
                fontSize="10px"
                color="#32BD00"
                fontFamily="DM Sans"
                isTruncated
              >
                {timeToCall || "N/A"}
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
              <Text
                fontSize="10px"
                color="#FFBB00"
                fontFamily="DM Sans"
                isTruncated
              >
                {sourceContent || "N/A"}
              </Text>
            </VStack>
          </VStack>
          <VStack align="start" spacing={1} w="100%">
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
          </VStack>
        </VStack>
      </HStack>
      <HStack w="100%" justify="flex-end" mt={1}>
        <Text fontSize="10px" color="#32343D" fontFamily="DM Sans">
          Lead time: {createdDate || "N/A"}
        </Text>
      </HStack>
    </Box>
  );
};

// Sub-components remain unchanged
const CardHeader = ({ id }) => (
  <HStack justify="space-between" w="100%" mb={1}>
    <HStack spacing={1}>
      <Icon as={FaEye} color="#C1C1C1" boxSize={3} />
    </HStack>
    <Icon as={CiMenuKebab} color="#C1C1C1" cursor="pointer" boxSize={4} />
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
      <Tooltip label={`Copy ${label}`}>
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
