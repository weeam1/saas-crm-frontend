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
      h="370px"
      borderColor="gray.300"
      borderRadius="md"
      p={{ base: 2, md: 4 }} // Responsive padding
      bg="white"
      boxShadow="md"
      width="100%" // Ensure full width of parent
      maxWidth={{ base: "100%", md: "md" }} // Full width on small screens, md (768px) on medium and up
      overflowX="hidden" // Prevent horizontal overflow
    >
      {/* Header */}
      <HStack justifyContent="space-between" mb={{ base: 1, md: 2 }} w="100%">
        <HStack>
          <Icon as={FaEye} color="gray.500" />
          <Text fontWeight="bold" color="gray.600">
            2141
          </Text>
        </HStack>
        <Icon as={BsThreeDotsVertical} color="gray.500" cursor="pointer" />
      </HStack>

      {/* Name & Budget/Time */}
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
          Faisal Al Karim
        </Text>
        <VStack
          align="start"
          spacing={{ base: 1, md: 2 }}
          flex="1"
          minWidth="0"
        >
          <VStack align="start" spacing={0}>
            <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
              Budget
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="#FFBB00"
            >
              14 Million
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
              11:50 PM
            </Text>
          </VStack>
        </VStack>
      </HStack>

      {/* Country & Nationality */}
      <HStack
        spacing={{ base: 2, md: 8 }}
        align="start"
        mt={{ base: 2, md: 4 }}
        mb={{ base: 2, md: 4 }}
        flexWrap="wrap"
      >
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            Country
          </Text>
          <Text fontSize={{ base: "sm", md: "sm" }} color="red.500">
            Saudi Arabia
          </Text>
        </VStack>
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            Nationality
          </Text>
          <Text fontSize={{ base: "sm", md: "sm" }} color="red.500">
            PAK
          </Text>
        </VStack>
      </HStack>

      {/* M Status & Status */}
      <HStack
        spacing={{ base: 2, md: 8 }}
        align="start"
        mt={{ base: 2, md: 4 }}
        mb={{ base: 2, md: 4 }}
        flexWrap="wrap"
      >
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            M Status
          </Text>
          <Input
            size="sm"
            placeholder="Hot"
            w={{ base: "70px", md: "85px" }}
            bg="#f6e0b7"
            border="1px solid"
            borderColor="gray.300"
          />
        </VStack>
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            Status
          </Text>
          <Input
            size="sm"
            placeholder="Meeting"
            textColor="#FFF049"
            w={{ base: "75px", md: "90px" }}
            bg="gray.100"
            border="1px solid"
            borderColor="gray.300"
            _placeholder={{ color: "#FFF049" }}
          />
        </VStack>
      </HStack>

      {/* Contact Info */}
      <HStack
        mt={{ base: 2, md: 3 }}
        spacing={{ base: 2, md: 8 }}
        mb={{ base: 2, md: 4 }}
        flexWrap="wrap"
      >
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            Phone
          </Text>
          <Text fontSize={{ base: "sm", md: "sm" }} color="blue.500">
            ************
          </Text>
        </VStack>
        <VStack align="start" spacing={0} flex="1" minWidth="0">
          <Text fontSize={{ base: "xs", md: "xs" }} color="gray.500">
            WhatsApp
          </Text>
          <Text fontSize={{ base: "sm", md: "sm" }} color="green.500">
            ************
          </Text>
        </VStack>
      </HStack>

      {/* Lead Note */}
      <VStack
        align="start"
        mt={{ base: 2, md: 4 }}
        p={{ base: 1, md: 2 }}
        bg="gray.100"
        borderRadius="md"
        mb={{ base: 2, md: 4 }}
        w="100%"
      >
        <Text
          fontSize={{ base: "xs", md: "xs" }}
          color="gray.500"
          fontWeight="bold"
        >
          Lead Note
        </Text>
        <Text fontSize={{ base: "sm", md: "sm" }} color="black">
          Interested
        </Text>
      </VStack>

      {/* Buy Button */}
      <Button
        mt={{ base: 2, md: 4 }}
        colorScheme="green"
        width="100%"
        mb={{ base: 2, md: 4 }}
      >
        Buy for 50 coins
      </Button>

      {/* Info Section */}
      <VStack mt={{ base: 2, md: 3 }} align="start" mb={{ base: 2, md: 4 }}>
        <Text
          fontSize={{ base: "xs", md: "xs" }}
          color="gray.500"
          fontWeight="bold"
        >
          Info
        </Text>
        {[
          "Source Content",
          "Campaign",
          "Campaign Url",
          "Medium",
          "In UAE?",
        ].map((item) => (
          <HStack key={item} w="100%">
            <Text fontSize={{ base: "sm", md: "sm" }} color="black">
              {item}
            </Text>
            <Tooltip label={item} aria-label={item}>
              <Icon as={BiInfoCircle} color="blue.400" cursor="pointer" />
            </Tooltip>
          </HStack>
        ))}
      </VStack>

      {/* Lead Time */}
      <Text
        mt={{ base: 2, md: 3 }}
        fontSize={{ base: "xs", md: "xs" }}
        color="gray.500"
      >
        lead time <b>Thu, Feb 13, 2025</b>
      </Text>
    </Box>
  );
};

export default LeadCard;
