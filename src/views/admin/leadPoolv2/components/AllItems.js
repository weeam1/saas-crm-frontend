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
  Grid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { BiCopy } from "react-icons/bi";
import { FcInfo } from "react-icons/fc";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEye } from "react-icons/fa";

const handleCopy = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => {
      console.error("Clipboard error: ", err);
    });
};

const LeadCard = ({
  id,
  name,
  country,
  nationality,
  sourceContent,
  timeToCall,
  mStatus,
  status,
  phone,
  whatsapp,
  leadTime,
}) => {
  return (
    <Box
      border="1px solid"
      borderColor="gray.300"
      borderRadius="lg"
      p={5}
      bg="white"
      boxShadow="md"
      width="100%"
    >
      {/* Header */}
      <HStack justifyContent="space-between" mb={2}>
        <HStack>
          <Icon as={FaEye} color="gray.500" />
          <Text fontWeight="bold" color="gray.600">
            {id}
          </Text>
        </HStack>
        <Icon as={BsThreeDotsVertical} color="gray.500" cursor="pointer" />
      </HStack>

      {/* Name & SourceContent/Time */}
      <HStack justify="space-between">
        <Text fontSize="xl" fontWeight="bold">
          {name}
        </Text>
        <VStack align="start" spacing={2}>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">
              Source Content
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="#FFBB00">
              {sourceContent}
            </Text>
          </VStack>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">
              Time To Call
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="#32BD00">
              {timeToCall}
            </Text>
          </VStack>
        </VStack>
      </HStack>

      {/* Country & Nationality */}
      <HStack spacing={6} align="start" mt={2}>
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="gray.500">
            Country
          </Text>
          <Text fontSize="sm" color="red.500">
            {country}
          </Text>
        </VStack>
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="gray.500">
            Nationality
          </Text>
          <Text fontSize="sm" color="red.500">
            {nationality}
          </Text>
        </VStack>
      </HStack>

      {/* M Status & Status */}
      <HStack spacing={6} align="start" mt={2}>
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="gray.500">
            M Status
          </Text>
          <Input
            size="sm"
            value={mStatus}
            w="85px"
            bg="#f6e0b7"
            border="1px solid"
            borderColor="gray.300"
            readOnly
          />
        </VStack>
        <VStack align="start" spacing={0}>
          <Text fontSize="xs" color="gray.500">
            Status
          </Text>
          <Input
            size="sm"
            value={status}
            w="90px"
            bg="gray.100"
            border="1px solid"
            borderColor="gray.300"
            textColor="#FFF049"
            readOnly
          />
        </VStack>
      </HStack>

      {/* Contact Info */}
      <HStack mt={3} spacing={6}>
        <VStack align="start" spacing={0}>
          <HStack>
            <Text fontSize="xs" color="gray.500">
              Phone
            </Text>
            <Tooltip label="Copy Phone">
              <Icon
                as={BiCopy}
                color="gray.500"
                cursor="pointer"
                ml={1}
                onClick={() => handleCopy(phone)}
              />
            </Tooltip>
          </HStack>
          <Text fontSize="sm" color="blue.500">
            {phone}
          </Text>
        </VStack>
        <VStack align="start" spacing={0}>
          <HStack>
            <Text fontSize="xs" color="gray.500">
              WhatsApp
            </Text>
            <Tooltip label="Copy WhatsApp">
              <Icon
                as={BiCopy}
                color="gray.500"
                cursor="pointer"
                ml={1}
                onClick={() => handleCopy(whatsapp)}
              />
            </Tooltip>
          </HStack>
          <Text fontSize="sm" color="green.500">
            {whatsapp}
          </Text>
        </VStack>
      </HStack>

      {/* Buy Button & Info */}
      <HStack mt={4} width="full" justifyContent="space-between">
        <Button bg="#34C759" color="white" width="60%">
          Buy for 50 coins
        </Button>
        <VStack align="start">
          <Text fontSize="xs" color="gray.500" fontWeight="bold">
            Info
          </Text>
          {["Budget", "Campaign", "Campaign Url", "Medium", "In UAE?"].map(
            (item) => (
              <HStack key={item} width="full" justifyContent="space-between">
                <Text fontSize="sm" color="black">
                  {item}
                </Text>
                <Tooltip label={item}>
                  <Icon as={FcInfo} cursor="pointer" />
                </Tooltip>
              </HStack>
            )
          )}
        </VStack>
      </HStack>

      {/* Lead Time */}
      <HStack width="full" justifyContent="end">
        <Text mt={3} fontSize="xs" color="gray.500">
          Lead time: <b>{leadTime}</b>
        </Text>
      </HStack>
    </Box>
  );
};

// Responsive Grid Layout
const LeadGrid = ({ leads }) => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 4 });

  return (
    <Box bg="gray.100" minH="100vh">
      <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6} p={4}>
        {leads.map((lead, index) => (
          <LeadCard key={index} {...lead} />
        ))}
      </Grid>
    </Box>
  );
};

// Updated Leads Data with sourceContent instead of budget
const leadsData = [
  {
    id: "2141",
    name: "Faisal Al Karim",
    country: "Saudi Arabia",
    nationality: "PAK",
    sourceContent: "14 Million", // Changed from budget to sourceContent
    timeToCall: "11:50 PM",
    mStatus: "Hot",
    status: "Meeting",
    phone: "1234567890",
    whatsapp: "9876543210",
    leadTime: "Thu, Feb 13, 2025",
  },
  {
    id: "2142",
    name: "Ahmed Al Saud",
    country: "United Arab Emirates",
    nationality: "UAE",
    sourceContent: "10 Million", // Changed from budget to sourceContent
    timeToCall: "10:00 PM",
    mStatus: "Warm",
    status: "Call",
    phone: "9876543210",
    whatsapp: "1231231234",
    leadTime: "Fri, Feb 14, 2025",
  },
  {
    id: "2143",
    name: "Ali Bin Khalid",
    country: "Qatar",
    nationality: "QAT",
    sourceContent: "15 Million", // Changed from budget to sourceContent
    timeToCall: "9:00 PM",
    mStatus: "Cold",
    status: "New",
    phone: "5555555555",
    whatsapp: "4444444444",
    leadTime: "Sat, Feb 15, 2025",
  },
  {
    id: "2144",
    name: "Sara Al Maktoum",
    country: "Dubai",
    nationality: "UAE",
    sourceContent: "12 Million",
    timeToCall: "12:00 PM",
    mStatus: "Hot",
    status: "Meeting",
    phone: "6666666666",
    whatsapp: "7777777777",
    leadTime: "Sun, Feb 16, 2025",
  },
  {
    id: "2144",
    name: "Sara Al Maktoum",
    country: "Dubai",
    nationality: "UAE",
    sourceContent: "12 Million",
    timeToCall: "12:00 PM",
    mStatus: "Hot",
    status: "Meeting",
    phone: "6666666666",
    whatsapp: "7777777777",
    leadTime: "Sun, Feb 16, 2025",
  },
  {
    id: "2144",
    name: "Sara Al Maktoum",
    country: "Dubai",
    nationality: "UAE",
    sourceContent: "12 Million",
    timeToCall: "12:00 PM",
    mStatus: "Hot",
    status: "Meeting",
    phone: "6666666666",
    whatsapp: "7777777777",
    leadTime: "Sun, Feb 16, 2025",
  },
  {
    id: "2144",
    name: "Sara Al Maktoum",
    country: "Dubai",
    nationality: "UAE",
    sourceContent: "12 Million",
    timeToCall: "12:00 PM",
    mStatus: "Hot",
    status: "Meeting",
    phone: "6666666666",
    whatsapp: "7777777777",
    leadTime: "Sun, Feb 16, 2025",
  },
];

const App = () => {
  return <LeadGrid leads={leadsData} />;
};

export default App;
