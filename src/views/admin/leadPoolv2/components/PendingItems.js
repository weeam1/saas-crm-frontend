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
  note,
}) => {
  return (
    <Box
      borderRadius="lg"
      boxShadow="md"
      p="4"
      // width="400px"
      // height="370px"
      overflow="hidden"
      bg="white"
    >
      {/* Header */}
      <HStack justifyContent="space-between" w="100%" mb={2}>
        <HStack>
          <Icon as={FaEye} color="gray.500" boxSize={3} />
          <Text fontWeight="bold" color="gray.600" fontSize="sm">
            {id}
          </Text>
        </HStack>
        <Icon
          as={BsThreeDotsVertical}
          color="gray.500"
          cursor="pointer"
          boxSize={3}
        />
      </HStack>

      <HStack align="start" spacing={2} w="100%" h="calc(100% - 40px)">
        {/* Left Side */}
        <VStack align="start" spacing={2} flex="2" minWidth="0" h="100%">
          <Text fontSize="sm" fontWeight="bold">
            {name}
          </Text>

          <HStack spacing={2} w="100%" flexWrap="wrap">
            <VStack align="start" spacing={0} flex="1" minWidth="0">
              <Text fontSize="sm" color="gray.500">
                Country
              </Text>
              <Text fontSize="xs" color="red.500">
                {country}
              </Text>
            </VStack>
            <VStack align="start" spacing={0} flex="1" minWidth="0">
              <Text fontSize="sm" color="gray.500">
                Nationality
              </Text>
              <Text fontSize="xs" color="red.500">
                {nationality}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={2} w="100%" flexWrap="wrap">
            <VStack align="start" spacing={0} flex="1" minWidth="0">
              <Text fontSize="sm" color="gray.500">
                M Status
              </Text>
              <Input
                size="xs"
                value={mStatus}
                w={{ base: "60px", md: "70px" }}
                bg="#f6e0b7"
                border="1px solid"
                borderColor="gray.300"
                readOnly
                fontSize="xs"
              />
            </VStack>
            <VStack align="start" spacing={0} flex="1" minWidth="0">
              <Text fontSize="sm" color="gray.500">
                Status
              </Text>
              <Input
                size="xs"
                value={status}
                w={{ base: "65px", md: "75px" }}
                bg="gray.100"
                border="1px solid"
                borderColor="gray.300"
                textColor="#FFF049"
                readOnly
                fontSize="xs"
              />
            </VStack>
          </HStack>

          <HStack spacing={2} w="100%" flexWrap="wrap">
            <VStack align="start" spacing={0} flex="1" minWidth="0">
              <HStack>
                <Text fontSize="sm" color="gray.500">
                  Phone
                </Text>
                <Tooltip label="Copy Phone">
                  <Icon
                    as={BiCopy}
                    color="gray.500"
                    cursor="pointer"
                    boxSize={3}
                    ml={0.5}
                    onClick={() => handleCopy(phone)}
                  />
                </Tooltip>
              </HStack>
              <Text fontSize="sm" color="blue.500">
                {phone}
              </Text>
            </VStack>
            <VStack align="start" spacing={0} flex="1" minWidth="0">
              <HStack>
                <Text fontSize="sm" color="gray.500">
                  WhatsApp
                </Text>
                <Tooltip label="Copy WhatsApp">
                  <Icon
                    as={BiCopy}
                    color="gray.500"
                    cursor="pointer"
                    boxSize={3}
                    ml={0.5}
                    onClick={() => handleCopy(whatsapp)}
                  />
                </Tooltip>
              </HStack>
              <Text fontSize="xs" color="green.500">
                {whatsapp}
              </Text>
            </VStack>
          </HStack>

          <VStack align="start" spacing={0} width="100%">
            <Text fontSize="xs" color="gray.500">
              Lead Note
            </Text>
            <Text fontSize="xs" color="gray.500">
              {note}
            </Text>
          </VStack>

          <VStack
            h="100%"
            w="100%"
            align="start"
            justify="start"
            flex="1"
            spacing={0}
          >
            <Button bg="#FFEB3B" color="black" size="xs" width="100%">
             Pending
            </Button>
          </VStack>
        </VStack>

        {/* Right Side */}
        <VStack align="start" spacing={2} flex="1" minWidth="0" h="100%">
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">
              Source Content
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="#FFBB00">
              {sourceContent}
            </Text>
          </VStack>

          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">
              Time To Call
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="#32BD00">
              {timeToCall}
            </Text>
          </VStack>

          <VStack h="80%" w="100%" justify="flex-end">
            <VStack align="start" spacing={0} width="100%">
              <Text fontSize="xs" color="gray.500" fontWeight="bold">
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
                  width="100%"
                  justifyContent="space-between"
                >
                  <Text fontSize="13px" color="black">
                    {item.label}
                  </Text>
                  <Tooltip label={item.value} placement="right" hasArrow>
                    <span>
                      <Icon as={FcInfo} cursor="pointer" boxSize={3} />
                    </span>
                  </Tooltip>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </HStack>
      <HStack width="100%" justifyContent="flex-end" mt={2}>
        <Text fontSize="xs" color="gray.500">
          Lead time: <b>{leadTime}</b>
        </Text>
      </HStack>
    </Box>
  );
};
const LeadGrid = ({ leads }) => {
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 });

  return (
    <Box minH="100vh">
      <Grid
        templateColumns={`repeat(${columns}, 1fr)`}
        gap={{ base: 2, md: 2, lg: 2 }}
        p={{ base: 2, md: 2 }}
      >
        {leads.map((lead, index) => (
          <LeadCard key={index} {...lead} />
        ))}
      </Grid>
    </Box>
  );
};

const leadsData = [
  
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
    note: "N/A",
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
    note: "N/A",
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
    note: "N/A",
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
    note: "N/A",
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
    note: "N/A",
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
    note: "N/A",
  },
];

const App = () => {
  return <LeadGrid leads={leadsData} />;
};

export default App;
