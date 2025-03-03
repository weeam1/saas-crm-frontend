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
      {value}
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
        value={value}
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
      {value}
    </Text>
  </VStack>
);

const LeadCard = ({
  id,
  name,
  country,
  city,
  sourceContent,
  timeToCall,
  mStatus,
  status,
  phone,
  whatsapp,
  leadTime,
  note,
  buttonText = "Buy for 50 coins",
  buttonBg = "#34C759",
  buttonColor = "white",
  buttonHoverBg = "#32BD00",
}) => {
  const displayButtonText =
    status && status.toLowerCase() === "new" ? "Buy for 300 coins" : buttonText;

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
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
          buttonBg: buttonBg,
          buttonHoverBg: buttonHoverBg,
          buttonColor: buttonColor,
        };
    }
  };

  const {
    borderColor,
    buttonBg: dynamicButtonBg,
    buttonHoverBg: dynamicButtonHoverBg,
    buttonColor: dynamicButtonColor,
  } = getStatusStyles(status);

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
            {name}
          </Text>
          <HStack spacing={0.5} w="100%" flexWrap="wrap">
            <InfoPair label="City" value={city} />
            <InfoPair label="Country" value={country} />
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
              value={status}
              bg="#FEEFEE"
              color="black"
            />
          </HStack>
          <HStack spacing={0.5} w="100%" flexWrap="wrap">
            <ContactPair label="Phone" value={phone} color="#7869FF" />
            <ContactPair label="WhatsApp" value={whatsapp} color="#32BD00" />
          </HStack>
          <VStack align="start" spacing={0} width="100%">
            <HStack>
              <Text fontSize="xs" color="#C1C1C1" fontFamily="DM Sans">
                Lead Note
              </Text>
              <Icon as={InfoIcon} boxSize={3} color="#63B3ED" />
            </HStack>
            <Text fontSize="xs" color="gray.500" fontFamily="DM Sans">
              {note}
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
            >
              {displayButtonText}
            </Button>
          </VStack>
        </VStack>
        {/* Right Side */}
        <VStack
          align="start"
          spacing={2}
          flex="1"
          minWidth="0"
          h="100%"
          ml="15px"
          justify="space-between" // Push Info to bottom
        >
          {/* Top Section: Time To Call and Source Content */}
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
                {timeToCall}
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
                {sourceContent}
              </Text>
            </VStack>
          </VStack>

          {/* Bottom Section: Info */}
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
          Lead time: {leadTime}
        </Text>
      </HStack>
    </Box>
  );
};

export default LeadCard;
