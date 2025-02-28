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
      p={{ base: 2, md: 5 }} // Reduced padding on small screens
      boxShadow="md"
      width="100%"
      maxWidth={{ base: "100%", md: "md" }} // Full width on mobile, 768px on md and up
      overflowX="hidden" // Prevent horizontal overflow
    >
      {/* Header */}
      <HStack justifyContent="space-between" mb={{ base: 1, md: 2 }} w="100%">
        <HStack>
          <Icon as={FaEye} color="gray.500" />
          <Text fontWeight="bold" color="gray.600">
            {id}
          </Text>
        </HStack>
        <Icon as={BsThreeDotsVertical} color="gray.500" cursor="pointer" />
      </HStack>

      {/* Name & SourceContent/Time */}
      <HStack
        justify="space-between"
        width="100%"
        mb={{ base: 2, md: 4 }}
        flexWrap="wrap" // Allow wrapping on smaller screens
      >
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="bold"
          flex="1"
          minWidth="0" // Prevent text overflow
        >
          {name}
        </Text>
        <VStack
          align="start"
          spacing={{ base: 1, md: 2 }}
          flex="1"
          minWidth="0"
        >
          <VStack align="start" spacing={0}>
            <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
              Source Content
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="#FFBB00"
            >
              {sourceContent}
            </Text>
          </VStack>
          <VStack align="start" spacing={0}>
            <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
              Time To Call
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="#32BD00"
            >
              {timeToCall}
            </Text>
          </VStack>
        </VStack>
      </HStack>

      {/* Country & Nationality */}
      <HStack
        spacing={{ base: 2, md: 6 }}
        align="start"
        mt={{ base: 2, md: 2 }}
        mb={{ base: 2, md: 4 }}
        flexWrap="wrap"
      >
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            Country
          </Text>
          <Text fontSize={{ base: "sm", md: "sm" }} color="red.500">
            {country}
          </Text>
        </VStack>
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            Nationality
          </Text>
          <Text fontSize={{ base: "sm", md: "sm" }} color="red.500">
            {nationality}
          </Text>
        </VStack>
      </HStack>

      {/* M Status & Status */}
      <HStack
        spacing={{ base: 2, md: 6 }}
        align="start"
        mt={{ base: 2, md: 2 }}
        mb={{ base: 2, md: 4 }}
        flexWrap="wrap"
      >
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            M Status
          </Text>
          <Input
            size="sm"
            value={mStatus}
            w={{ base: "70px", md: "85px" }}
            bg="#f6e0b7"
            border="1px solid"
            borderColor="gray.300"
            readOnly
          />
        </VStack>
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            Status
          </Text>
          <Input
            size="sm"
            value={status}
            w={{ base: "75px", md: "90px" }}
            bg="gray.100"
            border="1px solid"
            borderColor="gray.300"
            textColor="#FFF049"
            readOnly
          />
        </VStack>
      </HStack>

      {/* Contact Info */}
      <HStack
        mt={{ base: 2, md: 3 }}
        spacing={{ base: 2, md: 6 }}
        mb={{ base: 2, md: 4 }}
        flexWrap="wrap"
      >
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <HStack>
            <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
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
          <Text fontSize={{ base: "sm", md: "sm" }} color="blue.500">
            {phone}
          </Text>
        </VStack>
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <HStack>
            <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
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
          <Text fontSize={{ base: "sm", md: "sm" }} color="green.500">
            {whatsapp}
          </Text>
        </VStack>
      </HStack>

      {/* Buy Button & Info */}
      <HStack
        mt={{ base: 2, md: 4 }}
        width="100%"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Button
          bg="yellow.400"
          color="white"
          width={{ base: "100%", md: "60%" }}
          mb={{ base: 2, md: 0 }}
        >
          Pending
        </Button>
        <VStack align="start" spacing={1} flex="1" minWidth="0">
          <Text
            fontSize={{ base: "xs", md: "xs" }}
            color="gray.500"
            fontWeight="bold"
          >
            Info
          </Text>
          {["Budget", "Campaign", "Campaign Url", "Medium", "In UAE?"].map(
            (item) => (
              <HStack
                key={item}
                width="100%"
                justifyContent="space-between"
                mb={1}
              >
                <Text fontSize={{ base: "sm", md: "sm" }} color="black">
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
      <HStack width="100%" justifyContent="flex-end" mt={{ base: 2, md: 3 }}>
        <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
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
      <Grid
        templateColumns={`repeat(${columns}, 1fr)`}
        gap={{ base: 2, md: 6 }}
        p={{ base: 2, md: 4 }}
      >
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
    sourceContent: "14 Million",
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
    sourceContent: "10 Million",
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
    sourceContent: "15 Million",
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
    id: "2145",
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
    id: "2146",
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
    id: "2147",
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
