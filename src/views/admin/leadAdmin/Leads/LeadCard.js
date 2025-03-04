import React from "react";
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
import { CiMenuKebab } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { handleCopy } from "../utils/utils";

const CardHeader = ({ id }) => (
  <HStack justifyContent="space-between" w="100%" mb={1}>
    <HStack>
      <Icon as={FaEye} color="#C1C1C1" boxSize={3} />
      <Text color="#BEBEBE" fontSize="12px" fontFamily="DM Sans">
        {id}
      </Text>
    </HStack>
    <Icon as={CiMenuKebab} color="#C1C1C1" cursor="pointer" boxSize={4} />
  </HStack>
);

const InfoPair = ({ label, value, color = "#ff0307" }) => (
  <VStack align="start" spacing={0} flex="1" minWidth="0">
    <Text fontSize="9px" color="#C1C1C1" fontFamily="DM Sans">
      {label}
    </Text>
    <Text fontSize="10px" color={color} fontFamily="DM Sans">
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
  <VStack align="start" spacing={0} flex="1" minWidth="0">
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
        disabled={true}
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
  <VStack align="start" spacing={0} flex="1" minWidth="0">
    <HStack>
      <Text fontSize="12px" color="#C1C1C1" fontFamily="DM Sans">
        {label}
      </Text>
      <Tooltip label={`Copy ${label}`}>
        <Icon
          as={CopyIcon}
          color="gray.500"
          cursor="pointer"
          boxSize={3}
          ml={0.5}
          onClick={() => handleCopy(value)}
        />
      </Tooltip>
    </HStack>
    <Text
      fontSize={label === "Phone" ? "sm" : "xs"}
      color={color}
      fontFamily="DM Sans"
    >
      {value || "N/A"}
    </Text>
  </VStack>
);

const LeadCard = ({
  id,
  leadName,
  nationality,
  city,
  sourceContent,
  timeToCall,
  mStatus,
  approvalStatus,
  leadPhoneNumber,
  approved,
  whatsapp,
  leadTime,
  requested,
  tab = "All",
  onAccept,
  onReject,
}) => {
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
          borderColor: "#c73434",
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

  const renderActionSection = () => {
    const statusLower = approvalStatus?.toLowerCase();

    if (tab === "All") {
      if (statusLower === "accepted") {
        return (
          <VStack width="100%" spacing={1} align="start">
            <HStack spacing={1}>
              <Text fontSize="9px" color="gray.500" fontFamily="DM Sans">
                Approved on
              </Text>
            </HStack>
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
              width="50%"
              maxWidth="100px"
              fontFamily="DM Sans"
              borderRadius="5px"
              _hover={{ bg: "#32BD00" }}
              onClick={onAccept}
            >
              Accept
            </Button>
            <Button
              bg="#FF6363"
              color="white"
              size="xs"
              width="50%"
              maxWidth="100px"
              fontFamily="DM Sans"
              borderRadius="5px"
              _hover={{ bg: "#D32F2F" }}
              onClick={onReject}
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
    } else if (tab === "Pending" || statusLower === "pending") {
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
      <CardHeader id={id} />
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
              value={approvalStatus}
              bg="#FEEFEE"
              color="black"
            />
          </HStack>
          <HStack spacing={0.5} w="100%" flexWrap="wrap">
            <ContactPair
              label="Phone"
              value={leadPhoneNumber}
              color="#7869FF"
            />
            <ContactPair label="WhatsApp" value={whatsapp} color="#32BD00" />
          </HStack>
          <VStack align="start" spacing={0} width="100%">
            <HStack>
              <Text fontSize="xs" color="#C1C1C1" fontFamily="DM Sans">
                Requested by
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500" fontFamily="DM Sans">
              {requested || "N/A"}
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
            {renderActionSection()}
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
              { label: "Budget", value: "N/A" },
              { label: "Campaign", value: "N/A" },
              { label: "Campaign Url", value: "N/A" },
              { label: "Medium", value: "N/A" },
              { label: "In UAE?", value: "Yes" },
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
          Lead time: {leadTime || "N/A"}
        </Text>
      </HStack>
    </Box>
  );
};

export default LeadCard;
