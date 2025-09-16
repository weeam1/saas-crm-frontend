import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
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
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";

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
    .min(0, "Amount must be greater than 0")
      .max(100, "vat must be less than 100"),
});

const AddOutgoingPaymentModal = ({ isOpen, onClose, onSubmit }) => {
  const [isAddCategoryeOpen, setAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const { data: categories, refetch } = useFetchItemsQuery(
    { path: `/expense-category` },
    { refetchOnMountOrArgChange: true, skip: !user._id }
  );
  const [createItemMuation] = useCreateItemMutation();
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

  const handlerCategory = async () => {
    if (newCategory.trim()) {
      try {
        await createItemMuation({
          path: "/expense-category",
          body: { name: newCategory },
        }).unwrap();
        setNewCategory("");
        setAddCategoryOpen(false);
        toast.success("Expense Category added successfully.");
        refetch();
      } catch (error) {
        console.error(error);
        toast.error(error.data.message || "Expense Category not added");
      }
    }
  };

  useEffect(() =>{
    if(isOpen){
      formik.resetForm();
    }
  },[isOpen])
  return (
    <>
      <Modal
        isOpen={isOpen && !isAddCategoryeOpen}
        onClose={onClose}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="space-between">
            Add Office Expense
            <IconButton icon={<CloseIcon />} onClick={onClose} size="sm" />
          </ModalHeader>
          <form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <Grid gap={4}>
                <div>
                  <Flex justify="space-between" align="center">
                    <FormLabel>Category</FormLabel>
                    <Tooltip label="Add a new expense Category" hasArrow>
                      <IconButton
                        icon={<AddIcon />}
                        size="xs"
                        borderRadius="full"
                        aria-label="Add new type"
                        onClick={() => setAddCategoryOpen(true)}
                      />
                    </Tooltip>
                  </Flex>
                  <Select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    placeholder="Select category"
                    focusBorderColor="brand.500"
                  >
                    {categories && categories.doc.length > 0 ? (
                      categories.doc.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No categories available</option>
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
                  <FormLabel>VAT %</FormLabel>
                  <Input
                    name="vat"
                    type="number"
                    value={formik.values.vat}
                    onChange={formik.handleChange}
                    placeholder="e.g., 200.0"
                    focusBorderColor="brand.500"
                  />
                  {formik.touched.vat && formik.errors.vat && (
                    <p style={{ color: "red" }}>{formik.errors.vat}</p>
                  )}
                </div>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" variant="brand" colorScheme="#b79045">
                Add Expense
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryeOpen}
        onClose={() => setAddCategoryOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="space-between">
            Add New Category
            <IconButton
              icon={<CloseIcon />}
              onClick={() => setAddCategoryOpen(false)}
              size="sm"
            />
          </ModalHeader>
          <ModalBody>
            <FormLabel>Category Name</FormLabel>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              focusBorderColor="brand.500"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setAddCategoryOpen(false)}
              variant="ghost"
              mr={3}
            >
              Close
            </Button>
            <Button
              onClick={handlerCategory}
              variant="brand"
              colorScheme="#b79045"
            >
              Add Category
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddOutgoingPaymentModal;
