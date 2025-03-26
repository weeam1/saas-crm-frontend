
// components/BankAccountCard.jsx
import {
    Flex,
    Text,
    VStack,
    Divider,
    IconButton,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { DeleteIcon } from "@chakra-ui/icons";
  
  const BankAccountCard = ({ bank, onDelete, isDeleting, isCurrentDeleting }) => {
    const textColor = useColorModeValue("gray.700", "gray.200");
    const bankBg = useColorModeValue("gray.50", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
  
    return (
      <VStack
        spacing={4}
        align="stretch"
        bg={bankBg}
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="md"
        transition="all 0.3s"
        _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
        position="relative"
      >
        <IconButton
          aria-label="Delete bank account"
          icon={<DeleteIcon />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          onClick={() => onDelete(bank)}
          isLoading={isDeleting && isCurrentDeleting}
        />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            Account Holder
          </Text>
          <Text fontSize="md" color={textColor}>
            {bank?.account_holder_name || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            Account Number
          </Text>
          <Text fontSize="md" color={textColor}>
            {bank?.account_number || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            IBAN
          </Text>
          <Text fontSize="md" color={textColor}>
            {bank?.iban || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            SWIFT Code
          </Text>
          <Text fontSize="md" color={textColor}>
            {bank?.swift_code || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            Bank Name
          </Text>
          <Text fontSize="md" color={textColor}>
            {bank?.bank_name || "-"}
          </Text>
        </Flex>
        <Divider borderColor={borderColor} />
        <Flex justify="space-between" py={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="uppercase">
            Branch Address
          </Text>
          <Text fontSize="md" color={textColor}>
            {bank?.branch_address || "-"}
          </Text>
        </Flex>
      </VStack>
    );
  };
  
  export default BankAccountCard;