import {
    Box,
    Text,
    HStack,
    VStack,
    Button,
    Icon,
    Tooltip,
    Input,
  } from "@chakra-ui/react";
  import { BiInfoCircle } from "react-icons/bi";
  import { BsThreeDotsVertical } from "react-icons/bs";
  import { FaEye } from "react-icons/fa";
  
  const LeadCard = () => {
    return (
      <Box
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        p={4}
        maxW="md"
        bg="white"
        boxShadow="md"
      >
        {/* Header */}
        <HStack justifyContent="space-between" mb={2}>
          <HStack>
            <Icon as={FaEye} color="gray.500" />
            <Text fontWeight="bold" color="gray.600">
              2141
            </Text>
          </HStack>
          <Icon as={BsThreeDotsVertical} color="gray.500" cursor="pointer" />
        </HStack>
  
        {/* Name & Budget/Time */}
        <HStack justify="space-between" width="100%">
          <Text fontSize="xl" fontWeight="bold">
            Faisal Al Karim
          </Text>
  
          <VStack align="start" spacing={2}>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500">Budget</Text>
              <Text fontSize="lg" fontWeight="bold" color="#FFBB00">14 Million</Text>
            </VStack>
  
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500">Time To Call</Text>
              <Text fontSize="lg" fontWeight="bold" color="#32BD00">11:50 PM</Text>
            </VStack>
          </VStack>
        </HStack>
  
        {/* Country & Nationality */}
        <HStack spacing={8} align="start" mt={2}>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">Country</Text>
            <Text fontSize="sm" color="red.500">Saudi Arabia</Text>
          </VStack>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">Nationality</Text>
            <Text fontSize="sm" color="red.500">PAK</Text>
          </VStack>
        </HStack>
  
        {/* M Status & Status */}
        <HStack spacing={8} align="start" mt={2}>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">M Status</Text>
            <Input
              size="sm"
              placeholder="Hot"
              w="85px"
              bg="#f6e0b7"
              border="1px solid"
              borderColor="gray.300"
            />
          </VStack>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">Status</Text>
            <Input
              size="sm"
              placeholder="Meeting"
              textColor="#FFF049"
              w="90px"
              bg="gray.100"
              border="1px solid"
              borderColor="gray.300"
              _placeholder={{ color: "#FFF049" }}
            />
          </VStack>
        </HStack>
  
        {/* Contact Info */}
        <HStack mt={3} spacing={8} >
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">Phone</Text>
            <Text fontSize="sm" color="blue.500">************</Text>
          </VStack>
          <VStack align="start" spacing={0}>
            <Text fontSize="xs" color="gray.500">WhatsApp</Text>
            <Text fontSize="sm" color="green.500">************</Text>
          </VStack>
        </HStack>
  
        {/* Buy Button */}
        <Button mt={4} colorScheme="green" width="full">
          Buy for 50 coins
        </Button>
  
        {/* Info Section */}
        <VStack mt={3} align="start">
          <Text fontSize="xs" color="gray.500" fontWeight="bold">Info</Text>
          {["Source Content", "Campaign", "Campaign Url", "Medium", "In UAE?"].map((item) => (
            <HStack key={item}>
              <Text fontSize="sm" color="black">{item}</Text>
              <Tooltip label={item} aria-label={item}>
                <Icon as={BiInfoCircle} color="blue.400" cursor="pointer" />
              </Tooltip>
            </HStack>
          ))}
        </VStack>
  
        {/* Lead Time */}
        <Text mt={3} fontSize="xs" color="gray.500">
          lead time <b>Thu, Feb 13, 2025</b>
        </Text>
      </Box>
    );
  };
  
  export default LeadCard;
  