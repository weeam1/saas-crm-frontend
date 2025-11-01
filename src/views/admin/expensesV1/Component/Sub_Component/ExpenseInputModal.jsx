import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  VStack,
  Button,
  FormLabel,
  SimpleGrid,
  Select,
  useColorModeValue,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useFetchItemsQuery } from "api/apiSlice";
import * as Yup from "yup";
import { useEffect } from "react";

const ExpenseInputModal = ({ isOpen, onClose, data, isEditable, onSubmit }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");

  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
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

  const { data: categories } = useFetchItemsQuery(
    { path: `/expense-category` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      expenseNo: data?.expenseNo || "",
      category: data?.category?._id || "",
      description: data?.description || "",
      amount: data?.amount || "",
      username: data?.addedBy?.username || "",
      fullName: data?.addedBy?.fullName || "",
      location: data?.addedBy?.location || "",
      phoneNumber: data?.addedBy?.phoneNumber || "",
      agencyName: data?.addedBy?.agency?.name || "",
      vat: data?.vat || "",
    },
    validationSchema,
    onSubmit: (values) => {
      const updated = {
        ...data,
        category: values.category,
        description: values.description,
        amount: values.amount,
        vat: values.vat,
      };
      onSubmit?.(updated);
    },
  });

  useEffect(() => {
    if (isOpen) formik.resetForm();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
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
            {isEditable ? "Edit Expense" : "View Expense"}
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
            <VStack spacing={4} align="stretch">
              {isEditable ? (
                <>
                  <div>
                    <FormLabel>Category</FormLabel>
                    <Select
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      placeholder="Select category"
                      focusBorderColor="brand.500"
                    >
                      {categories?.doc?.length > 0 ? (
                        categories.doc.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No category available</option>
                      )}
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <Text color="red.500" fontSize="sm">
                        {formik.errors.category}
                      </Text>
                    )}
                  </div>

                  <div>
                    <FormLabel>Description</FormLabel>
                    <Input
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      placeholder="e.g., Office rent or utilities"
                      focusBorderColor="brand.500"
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <Text color="red.500" fontSize="sm">
                          {formik.errors.description}
                        </Text>
                      )}
                  </div>

                  <div>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      name="amount"
                      type="number"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      placeholder="e.g., 5050"
                      focusBorderColor="brand.500"
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <Text color="red.500" fontSize="sm">
                        {formik.errors.amount}
                      </Text>
                    )}
                  </div>

                  <div>
                    <FormLabel>VAT %</FormLabel>
                    <Input
                      name="vat"
                      type="number"
                      value={formik.values.vat}
                      onChange={formik.handleChange}
                      placeholder="e.g. 15"
                      focusBorderColor="brand.500"
                    />
                    {formik.touched.vat && formik.errors.vat && (
                      <Text color="red.500" fontSize="sm">
                        {formik.errors.vat}
                      </Text>
                    )}
                  </div>
                </>
              ) : (
                <SimpleGrid columns={2} spacing={4}>
                  {[
                    { label: "Expense No", value: formik.values.expenseNo },
                    { label: "Category", value: data?.category?.name },
                    { label: "Description", value: formik.values.description },
                    { label: "Amount", value: formik.values.amount },
                    { label: "Username", value: formik.values.username },
                    { label: "Full Name", value: formik.values.fullName },
                    { label: "Location", value: formik.values.location },
                    { label: "Phone Number", value: formik.values.phoneNumber },
                    { label: "Agency Name", value: formik.values.agencyName },
                    { label: "VAT %", value: formik.values.vat },
                  ].map((field, index) => (
                    <div key={index}>
                      <FormLabel>{field.label}</FormLabel>
                      <Input
                        value={field.value}
                        isReadOnly
                        focusBorderColor="gray.300"
                        bg="gray.50"
                      />
                    </div>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            position="sticky"
            bottom="0"
            zIndex="10"
            py={3}
            px={5}
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              py="2"
              px="5"
              variant="outline"
              onClick={onClose}
              size="sm"
              borderRadius="md"
            >
              Close
            </Button>
            {isEditable && (
              <Button
                colorScheme="brand"
                type="submit"
                size="sm"
                borderRadius="md"
              >
                Submit
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ExpenseInputModal;
