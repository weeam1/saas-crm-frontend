import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  Input,
  Button,
  Grid,
  IconButton,
  Select,
  Flex,
  Tooltip,
  useColorModeValue,
  FormErrorMessage,
  FormControl,
  Text,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  type: Yup.string().required("Type is required"),
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .positive("Amount must be positive")
    .min(0, "Amount must be greater than 0"),
  vat: Yup.number()
    .typeError("VAT must be a number")
    .required("VAT is required")
    .positive("VAT must be positive")
    .min(0, "VAT must be greater than 0")
    .max(100, "VAT must be less than 100"),
});

const AddOutgoingPaymentModal = ({ isOpen, onClose, onSubmit }) => {
  const [isAddTypeOpen, setAddTypeOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");

  const { data: types, refetch } = useFetchItemsQuery(
    { path: `/expense_types` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const [createItemMutation] = useCreateItemMutation();

  const formik = useFormik({
    initialValues: {
      type: "",
      description: "",
      amount: "",
      vat: "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
      onClose();
    },
  });

  const handleAddType = async () => {
    if (newType.trim()) {
      try {
        await createItemMutation({
          path: "/expense_types",
          body: { name: newType },
        }).unwrap();
        setNewType("");
        setAddTypeOpen(false);
        toast.success("Expense type added successfully.");
        refetch();
      } catch (error) {
        toast.error(error.data?.message || "Expense type not added");
      }
    }
  };

  useEffect(() => {
    if (isOpen) formik.resetForm();
  }, [isOpen]);

  return (
    <>
      {/* Main Modal */}
      <Modal
        isOpen={isOpen && !isAddTypeOpen}
        onClose={onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent
          m="2"
          borderRadius="2xl"
          bg={bgColor}
          shadow="2xl"
          overflow="hidden"
          maxH="85vh"
          display="flex"
          flexDirection="column"
        >
          <Flex
            align="center"
            justify="space-between"
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            borderBottom="1px solid"
            borderColor={borderColor}
            position="sticky"
            top="0"
            zIndex="10"
          >
            <Text fontSize="lg" fontWeight="bold">
              Add Office Expense
            </Text>
            <ModalCloseButton position="static" />
          </Flex>

          <form onSubmit={formik.handleSubmit}>
            <ModalBody
              p={5}
              overflowY="auto"
              maxH="65vh"
              scrollBehavior="smooth"
              sx={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#c1c1c1",
                  borderRadius: "10px",
                },
              }}
            >
              <Grid gap={4}>
                <FormControl
                  isRequired
                  isInvalid={formik.touched.type && formik.errors.type}
                >
                  <Flex justify="space-between" align="center">
                    <FormLabel m={0}>Type</FormLabel>
                    <Tooltip label="Add a new expense type" hasArrow>
                      <IconButton
                        icon={<AddIcon />}
                        size="xs"
                        borderRadius="full"
                        aria-label="Add new type"
                        onClick={() => setAddTypeOpen(true)}
                      />
                    </Tooltip>
                  </Flex>
                  <Select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    placeholder="Select type"
                    focusBorderColor="brand.500"
                  >
                    {types && types.doc.length > 0 ? (
                      types.doc.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No types available</option>
                    )}
                  </Select>
                  <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={
                    formik.touched.description && formik.errors.description
                  }
                >
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="e.g., Office rent or utilities"
                    focusBorderColor="brand.500"
                  />
                  <FormErrorMessage>
                    {formik.errors.description}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={formik.touched.amount && formik.errors.amount}
                >
                  <FormLabel>Amount</FormLabel>
                  <Input
                    name="amount"
                    type="number"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    placeholder="e.g., 5050"
                    focusBorderColor="brand.500"
                  />
                  <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
                </FormControl>

                <FormControl
                  isInvalid={formik.touched.vat && formik.errors.vat}
                >
                  <FormLabel>VAT %</FormLabel>
                  <Input
                    name="vat"
                    type="number"
                    value={formik.values.vat}
                    onChange={formik.handleChange}
                    placeholder="e.g., 15"
                    focusBorderColor="brand.500"
                  />
                  <FormErrorMessage>{formik.errors.vat}</FormErrorMessage>
                </FormControl>
              </Grid>
            </ModalBody>

            <ModalFooter
              bg={footerBg}
              borderTop="1px solid"
              borderColor={borderColor}
              py={3}
              px={5}
              position="sticky"
              bottom="0"
              zIndex="10"
              justifyContent="flex-end"
              gap={3}
            >
              <Button
                variant="outline"
                onClick={onClose}
                size="sm"
                borderRadius="md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                borderRadius="md"
                colorScheme="brand"
                bg="#b79045"
                color="white"
                _hover={{ bg: "#a67e3d" }}
              >
                Add Expense
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Add New Type Modal */}
      <Modal
        isOpen={isAddTypeOpen}
        onClose={() => setAddTypeOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent m="2" borderRadius="2xl" shadow="2xl" overflow="hidden">
          <Flex
            align="center"
            justify="space-between"
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <Text fontSize="lg" fontWeight="bold">
              Add New Type
            </Text>
            <ModalCloseButton position="static" />
          </Flex>

          <ModalBody p={5}>
            <FormControl>
              <FormLabel>Type Name</FormLabel>
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Enter new type"
                focusBorderColor="brand.500"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            py={3}
            px={5}
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              onClick={() => setAddTypeOpen(false)}
              variant="outline"
              size="sm"
              borderRadius="md"
            >
              Close
            </Button>
            <Button
              onClick={handleAddType}
              size="sm"
              borderRadius="md"
              colorScheme="brand"
              bg="#b79045"
              color="white"
              _hover={{ bg: "#a67e3d" }}
            >
              Add Type
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddOutgoingPaymentModal;
