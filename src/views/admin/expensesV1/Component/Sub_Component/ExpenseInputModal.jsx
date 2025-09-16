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
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useFetchItemsQuery } from "api/apiSlice";
import * as Yup from "yup";
import { useEffect } from "react";

const ExpenseInputModal = ({ isOpen, onClose, data, isEditable, onSubmit }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive")
      .min(0, "Amount must be greater than 0"),
    vat: Yup.number()
      .typeError("Amount must be a number")
      .required("Amount is required")
      .positive("Amount must be positive")
      .min(0, "vat must be greater than 0")
      .max(100, "vat must be less than 100"),
  });
  const { data: categories } = useFetchItemsQuery(
    { path: `/expense-category` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      expenseNo: data?.expenseNo || "",
      category: data?.category._id || "",
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
      if (onSubmit) {
        onSubmit(updated);
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        as={isEditable ? "form" : "div"}
        onSubmit={formik.handleSubmit}
      >
        <ModalHeader display="flex" justifyContent="space-between">
          {isEditable ? "Edit Expense" : "View Expense"}
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {isEditable ? (
              <>
                <div>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="type"
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
                    <p style={{ color: "red" }}>{formik.errors.category}</p>
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
                  {formik.touched.description && formik.errors.description && (
                    <p style={{ color: "red" }}>{formik.errors.description}</p>
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
                    <p style={{ color: "red" }}>{formik.errors.amount}</p>
                  )}
                </div>
                <div>
                  <FormLabel>VAT%</FormLabel>
                  <Input
                    name="vat"
                    type="number"
                    value={formik.values.vat}
                    onChange={formik.handleChange}
                    placeholder="e.g. 200.0"
                    focusBorderColor="brand.500"
                  />
                  {formik.touched.vat && formik.errors.vat && (
                    <p style={{ color: "red" }}>{formik.errors.vat}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <SimpleGrid columns={2} spacing={4}>
                  <div>
                    <FormLabel>Expense No</FormLabel>
                    <Input
                      value={formik.values.expenseNo}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Category</FormLabel>
                    <Input
                      value={data?.category?.name}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Description</FormLabel>
                    <Input
                      value={formik.values.description}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      value={formik.values.amount}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Username</FormLabel>
                    <Input
                      value={formik.values.username}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={formik.values.fullName}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={formik.values.location}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      value={formik.values.phoneNumber}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>Agency Name</FormLabel>
                    <Input
                      value={formik.values.agencyName}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                  <div>
                    <FormLabel>VAT %</FormLabel>
                    <Input
                      value={formik.values.vat}
                      isReadOnly
                      focusBorderColor="gray.300"
                      bg="gray.50"
                    />
                  </div>
                </SimpleGrid>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button onClick={onClose}>Close</Button>
          {isEditable && (
            <Button type="submit" variant="brand">
              Submit
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExpenseInputModal;
