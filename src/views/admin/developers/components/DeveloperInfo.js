import {
    Box,
    Flex,
    Text,
    VStack,
    Heading,
    Divider,
    useColorModeValue,
  } from "@chakra-ui/react";
  
  const DeveloperInfo = ({ developer }) => {
    const accentColor = "#B79045";
    const textColor = useColorModeValue("gray.700", "gray.200");
    const cardBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
  
    return (
      <VStack
        spacing={4}
        align="stretch"
        mb={10}
        p={{ base: 4, md: 6 }}
        bg={cardBg}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="md"
        w="full"
        maxW={{ base: "100%", md: "600px" }}
        mx="auto"
        transition="all 0.3s"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
      >
        <Heading
          as="h1"
          size="lg"
          color={accentColor}
          fontWeight="bold"
          textAlign="left"
          mb={2}
        >
          Developer Information
        </Heading>
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            TRN
          </Text>
          <Text fontSize="md" color={textColor}>
            {developer?.trn || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            Name
          </Text>
          <Text fontSize="md" color={textColor}>
            {developer?.developer_name || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            Email
          </Text>
          <Text fontSize="md" color="teal.500" fontWeight="medium">
            {developer?.email || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            Address
          </Text>
          <Text fontSize="md" color={textColor}>
            {developer?.address || "-"}
          </Text>
        </Flex>
      </VStack>
    );
  };
  
  export default DeveloperInfo;