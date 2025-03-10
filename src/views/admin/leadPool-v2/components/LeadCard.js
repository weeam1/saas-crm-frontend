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
import { getApi } from "services/api";
import { formattedDate } from "utils/helpers";

const CardHeader = ({ id }) => (
  <HStack justifyContent="space-between" w="100%" mb={1}>
    <HStack>
      <Icon as={FaEye} color="#C1C1C1" boxSize={3} />
      <Text color="#BEBEBE" fontSize="12px" fontFamily="DM Sans">
        {id || "N/A"}
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
          onClick={() => handleCopy(value || "N/A")}
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
  _id,
  intID,
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
  // buyLoading,
  sendRequest,
}) => {
  const formattedCreatedDate = formattedDate(createdDate);
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
    if (
      leadStatus?.toLowerCase() !== "pending" &&
      leadStatus?.toLowerCase() !== "rejected"
    ) {
      sendRequest(_id);
    }
  };
  const getStatusStyles = (leadStatus) => {
    switch (leadStatus?.toLowerCase()) {
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
      <CardHeader id={intID} />
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
          {/* <HStack spacing={0.5} w="100%" flexWrap="wrap">
            <ContactPair
              label="Phone"
              // value={leadPhoneNumber}
              color="#7869FF"
            />
            <ContactPair
              label="WhatsApp"
              value={leadWhatsappNumber}
              color="#32BD00"
            />
          </HStack> */}
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
              // isLoading={buyLoading}
              isDisabled={
                approvalStatus?.toLowerCase() === "pending" ||
                approvalStatus?.toLowerCase() === "rejected"
              }
            >
              {displayButtonText()}
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
    </Box>
  );
};

export default LeadCard;
