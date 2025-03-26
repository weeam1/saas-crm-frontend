import {
    Box,
    Flex,
    Text,
    VStack,
    Heading,
    useColorModeValue,
  } from "@chakra-ui/react";
  import AddAccountModal from "./AddBank";
  import BankAccountCard from "./BankAccountCard";
  
  const BankDetailsSection = ({
    bankAccounts,
    onAddBank,
    isAddingBank,
    onDeleteBank,
    isDeletingBank,
    bankToDelete,
  }) => {
    const accentColor = "#B79045";
    const hasBankAccounts = bankAccounts.length > 0;
  
    return (
      <Box mb={12} w="full" maxW={{ base: "100%", md: "600px" }} mx="auto">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading
            as="h2"
            size="lg"
            color={accentColor}
            fontWeight="bold"
            textAlign="left"
          >
            Bank Details
          </Heading>
          <AddAccountModal onAdd={onAddBank} isAdding={isAddingBank} />
        </Flex>
        {hasBankAccounts ? (
          <VStack spacing={6} align="stretch">
            {bankAccounts.map((bank, index) => (
              <BankAccountCard
                key={index}
                bank={bank}
                onDelete={onDeleteBank}
                isDeleting={isDeletingBank}
                isCurrentDeleting={bankToDelete?._id === bank._id}
              />
            ))}
          </VStack>
        ) : (
          <Box
            textAlign="center"
            p={6}
            bg="yellow.50"
            borderRadius="xl"
            border="1px dashed"
            borderColor="yellow.300"
            boxShadow="sm"
            transition="all 0.3s"
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
          >
            <Text color="yellow.700" fontWeight="medium" fontSize="lg">
              No bank account added yet
            </Text>
            <Text color="gray.500" fontSize="sm" mt={1}>
              Add a bank account to get started
            </Text>
          </Box>
        )}
      </Box>
    );
  };
  
  export default BankDetailsSection;