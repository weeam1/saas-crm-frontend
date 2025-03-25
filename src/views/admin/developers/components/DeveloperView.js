import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner,
  VStack,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import AddAccountModal from "./AddBank";
import { toast } from "react-toastify";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import Breadcrumb from "./BreadCrumb";

const DeveloperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: developerResponse,
    isLoading: isDeveloperLoading,
    isError: isDeveloperError,
    error: developerError,
    refetch: refetchDeveloper,
  } = useFetchItemsQuery(
    {
      path: `/developer/get/${id}`,
    },
    { skip: !id }
  );

  const {
    data: bankResponse,
    isLoading: isBankLoading,
    isError: isBankError,
    error: bankError,
  } = useFetchItemsQuery(
    {
      path: `/bankAccount/getByDeveloperId/${id}`,
    },
    { skip: !id }
  );

  const [createBank, { isLoading: isAddingBank }] = useCreateItemMutation();

  const accentColor = "#B79045";
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, white)",
    "linear(to-br, gray.800, gray.900)"
  );
  const textColor = useColorModeValue("gray.700", "gray.200");
  const sectionBg = useColorModeValue("white", "gray.700");
  const bankBg = useColorModeValue("gray.50", "gray.800");

  const developer = developerResponse?.data;
  const bankDetails = bankResponse?.data?.[0];

  const handleAddBank = async (bankData) => {
    try {
      const response = await createBank({
        path: `/bankAccount/add/${id}`,
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
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("Failed to add bank:", err);
    }
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

  if (isDeveloperLoading || isBankLoading) {
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

  const hasBankDetails = bankDetails && Object.keys(bankDetails).length > 0;

  return (
    <Box
      px={{ base: 4, md: 6 }}
      py={8}
      bg={bgGradient}
      minH="100vh"
      maxW="1200px"
      mx="auto"
    >
      <Flex justify="space-between" align="center" mb={10}>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          size="sm"
          bg={accentColor}
          color="white"
          borderRadius="full"
          _hover={{ bg: "#A77F3A", transform: "scale(1.05)" }}
          _active={{ transform: "scale(0.95)" }}
          transition="all 0.2s"
          leftIcon={<ChevronLeftIcon />}
          onClick={() => navigate("/developers")}
        >
          Back
        </Button>
      </Flex>
      <VStack
        spacing={5}
        align="stretch"
        mb={12}
        p={6}
        bg={sectionBg}
        borderRadius="xl"
        boxShadow="md"
        transition="all 0.3s"
        _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
      >
        <Flex justify="space-between" py={2}>
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            TRN:
          </Text>
          <Text fontSize="lg" color={textColor}>
            {developer.trn || "-"}
          </Text>
        </Flex>
        <Flex justify="space-between" py={2}>
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Developer Name:
          </Text>
          <Text fontSize="lg" color={textColor}>
            {developer.developer_name || "-"}
          </Text>
        </Flex>
        <Flex justify="space-between" py={2}>
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Email:
          </Text>
          <Text fontSize="lg" color="teal.500" fontWeight="medium">
            {developer.email || "-"}
          </Text>
        </Flex>
        <Flex justify="space-between" py={2}>
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Address:
          </Text>
          <Text fontSize="lg" color={textColor}>
            {developer.address || "-"}
          </Text>
        </Flex>
      </VStack>

      <Box mb={12}>
        <Heading
          as="h2"
          size="xl"
          mb={6}
          color={textColor}
          fontWeight="extrabold"
          bg="#B79045"
          bgClip="text"
          textAlign="left"
        >
          Bank Details
        </Heading>
        {hasBankDetails ? (
          <VStack
            spacing={4}
            align="stretch"
            bg={bankBg}
            p={6}
            borderRadius="xl"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
          >
            <Flex justify="space-between" py={2}>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                Account Holder:
              </Text>
              <Text fontSize="md" color={textColor}>
                {bankDetails.account_holder_name || "-"}
              </Text>
            </Flex>
            <Flex justify="space-between" py={2}>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                Account Number:
              </Text>
              <Text fontSize="md" color={textColor}>
                {bankDetails.account_number || "-"}
              </Text>
            </Flex>
            <Flex justify="space-between" py={2}>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                IBAN:
              </Text>
              <Text fontSize="md" color={textColor}>
                {bankDetails.iban || "-"}
              </Text>
            </Flex>
            <Flex justify="space-between" py={2}>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                SWIFT Code:
              </Text>
              <Text fontSize="md" color={textColor}>
                {bankDetails.swift_code || "-"}
              </Text>
            </Flex>
            <Flex justify="space-between" py={2}>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                Bank Name:
              </Text>
              <Text fontSize="md" color={textColor}>
                {bankDetails.bank_name || "-"}
              </Text>
            </Flex>
            <Flex justify="space-between" py={2}>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                Branch Address:
              </Text>
              <Text fontSize="md" color={textColor}>
                {bankDetails.branch_address || "-"}
              </Text>
            </Flex>
          </VStack>
        ) : (
          <Box
            textAlign="center"
            p={6}
            bg="yellow.50"
            borderRadius="xl"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
          >
            <Text color="yellow.700" fontWeight="medium" fontSize="lg">
              No bank account added yet
            </Text>
          </Box>
        )}
        <Box my={6}>
          <AddAccountModal onAdd={handleAddBank} isAdding={isAddingBank} />
        </Box>
      </Box>
    </Box>
  );
};

export default DeveloperDetails;
