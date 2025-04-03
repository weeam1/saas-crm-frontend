import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  useFetchItemsQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} from "api/apiSlice";
import { toast } from "react-toastify";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Breadcrumb from "./BreadCrumb";
import DeveloperInfo from "./DeveloperInfo";
import BankDetailsSection from "./BankDetailsSection";
import { useState, useRef } from "react";

const DeveloperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: developerResponse,
    isLoading: isDeveloperLoading,
    isError: isDeveloperError,
    error: developerError,
    refetch: refetchDeveloper,
  } = useFetchItemsQuery({ path: `/developer/get/${id}` }, { skip: !id });

  const [createBank, { isLoading: isAddingBank }] = useCreateItemMutation();
  const [deleteBank, { isLoading: isDeletingBank }] = useDeleteItemMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState(null);
  const cancelRef = useRef();

  const accentColor = "#B79045";
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.100, white)",
    "linear(to-br, gray.800, gray.900)"
  );
  const textColor = useColorModeValue("gray.700", "gray.200");

  const developer = developerResponse?.data;

  const handleAddBank = async (bankData) => {
    try {
      const response = await createBank({
        path: `/bankAccount/add`,
        body: bankData,
      }).unwrap();
      toast.success("Bank account added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      refetchDeveloper();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to add bank account. Please try again.",
        { position: "top-right", autoClose: 3000 }
      );
      console.error("Failed to add bank:", err);
    }
  };

  const handleDeleteBank = async () => {
    if (!bankToDelete) return;
    try {
      await deleteBank({
        path: `/bankAccount/delete/${bankToDelete._id}`,
      }).unwrap();
      toast.success("Bank account deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(
        err?.data?.message ||
          "Failed to delete bank account. Please try again.",
        { position: "top-right", autoClose: 3000 }
      );
      console.error("Failed to delete bank:", err);
    } finally {
      setIsOpen(false);
      setBankToDelete(null);
    }
  };

  const openDeleteDialog = (bank) => {
    setBankToDelete(bank);
    setIsOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsOpen(false);
    setBankToDelete(null);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Developers", path: "/developers" },
    { label: "Developer Details" },
  ];

  if (!id) {
    return (
      <Box px={6} py={8} bg={bgGradient} minH="100vh">
        <Text color="red.500" fontWeight="bold" fontSize="xl" mb={4}>
          No developer ID provided
        </Text>
        <Button
          bg={accentColor}
          color="white"
          size="md"
          _hover={{ bg: "#A77F3A" }}
          borderRadius="md"
          onClick={() => navigate("/developers")}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  if (isDeveloperLoading) {
    return (
      <Flex justify="center" align="center" h="100vh" bg={bgGradient}>
        <Spinner size="xl" color={accentColor} thickness="4px" />
      </Flex>
    );
  }

  if (isDeveloperError) {
    return (
      <Box px={6} py={8} bg={bgGradient} minH="100vh">
        <Text color="red.500" fontWeight="bold" fontSize="xl" mb={4}>
          {developerError?.data?.message || "Failed to fetch developer details"}
        </Text>
        <Button
          bg={accentColor}
          color="white"
          size="md"
          _hover={{ bg: "#A77F3A" }}
          borderRadius="md"
          onClick={() => navigate("/developers")}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  if (!developer) {
    return (
      <Box px={6} py={8} bg={bgGradient} minH="100vh">
        <Text color={textColor} fontWeight="bold" fontSize="xl" mb={4}>
          No developer found
        </Text>
        <Button
          bg={accentColor}
          color="white"
          size="md"
          _hover={{ bg: "#A77F3A" }}
          borderRadius="md"
          onClick={() => navigate("/developers")}
        >
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box
      px={{ base: 4, md: 6 }}
      py={8}
      bg={bgGradient}
      minH="100vh"
      w="full"
      maxW="1200px"
      mx="auto"
    >
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        <Breadcrumb items={breadcrumbItems} />
        <Button
          size="md"
          bg={accentColor}
          color="white"
          borderRadius="md"
          _hover={{ bg: "#A77F3A", transform: "scale(1.05)" }}
          _active={{ transform: "scale(0.95)" }}
          transition="all 0.2s"
          leftIcon={<ChevronLeftIcon />}
          onClick={() => navigate("/developers")}
        >
          Back
        </Button>
      </Flex>

      <DeveloperInfo developer={developer} />
      <BankDetailsSection
        data={developer}
        onAddBank={handleAddBank}
        isAddingBank={isAddingBank}
        onDeleteBank={openDeleteDialog}
        isDeletingBank={isDeletingBank}
        bankToDelete={bankToDelete}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              fontFamily="DM Sans"
            >
              Delete Bank Account
            </AlertDialogHeader>
            <AlertDialogBody fontFamily="DM Sans">
              Are you sure you want to delete this bank account? This action
              cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter fontFamily="DM Sans">
              <Button
                ref={cancelRef}
                onClick={closeDeleteDialog}
                w="60px"
                fontSize="14px"
                h="30px"
              >
                Cancel
              </Button>
              <Button
                bg="#A67E3A"
                color="white"
                w="60px"
                fontSize="14px"
                h="30px"
                borderRadius="6px"
                onClick={handleDeleteBank}
                ml={3}
                isLoading={isDeletingBank}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DeveloperDetails;
