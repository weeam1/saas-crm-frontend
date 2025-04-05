import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import AddAccountModal from "./AddBank"; // Assuming AddBank is AddAccountModal
import BankAccountCard from "./BankAccountCard";
import { useState } from "react";

const BankDetailsSection = ({
  data,
  onAddBank,
  isAddingBank,
  onEditBank,
  isUpdatingBank,
  onDeleteBank,
  isDeletingBank,
  bankToDelete,
}) => {
  const [editBank, setEditBank] = useState(null); // State for editing
  const accentColor = "#B79045";

  const handleEditSubmit = async (bankData) => {
    const result = await onEditBank(bankData);
    if (!result) {
      setEditBank(null); // Close modal on success
    }
    return result; // Pass error back to modal
  };

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
      {data?.bankAccounts && data.bankAccounts.length > 0 ? (
        <VStack spacing={6} align="stretch">
          {data.bankAccounts.map((bank) => (
            <BankAccountCard
              key={bank._id}
              bank={bank}
              onEdit={() => setEditBank(bank)} // Trigger edit
              onDelete={onDeleteBank}
              isDeleting={isDeletingBank}
              isCurrentDeleting={bankToDelete?._id === bank._id}
              isUpdating={isUpdatingBank}
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

      {editBank && (
        <AddAccountModal
          onAdd={handleEditSubmit}
          isAdding={isUpdatingBank}
          initialData={editBank}
          isEditMode={true}
          onClose={() => setEditBank(null)}
        />
      )}
    </Box>
  );
};

export default BankDetailsSection;