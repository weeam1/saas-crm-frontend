import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Select,
  useBreakpointValue,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import * as yup from "yup";

const invoiceSchema = yup.object().shape({
  unit_no: yup.number().nullable(),
  invoice_number: yup.string().nullable(),
  total_amount: yup
    .number()
    .required("Total amount is required")
    .min(0, "Total amount cannot be negative"),
  developer_id: yup.string().required("Developer is required"),
  bank_account_id: yup.string().required("Bank account is required"),
  unit_name: yup.string().required("Unit name is required"),
  unit_price: yup
    .number()
    .required("Unit price is required")
    .min(0, "Unit price cannot be negative"),
  commission: yup
    .number()
    .required("Commission is required")
    .min(0, "Commission cannot be negative"),
  claim_type: yup.string().required("Claim type is required"),
});

const Add = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: developersData,
    isLoading: developersLoading,
    error: developersError,
  } = useFetchItemsQuery({ path: "/developer/get" });

  const {
    data: bankAccountsData,
    isLoading: bankAccountsLoading,
    error: bankAccountsError,
  } = useFetchItemsQuery({ path: "/bankAccount/get" });

  const [createItemMutation, { isLoading: mutationLoading }] =
    useCreateItemMutation();

  const initialValues = {
    unit_no: null,
    invoice_number: null,
    total_amount: 0,
    developer_id: null,
    bank_account_id: null,
    unit_name: "",
    unit_price: 0,
    commission: 0,
    claim_type: "",
    developer_name: "",
    bank_details: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: invoiceSchema,
    onSubmit: (values, { resetForm }) => {
      AddData(values);
      resetForm();
    },
  });

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    formik;

  const AddData = async (formValues) => {
    try {
      setIsLoading(true);
      console.log("Form Values on Submit:", formValues);

      const response = await createItemMutation({
        path: "/invoice/add",
        body: formValues,
      }).unwrap();

      console.log("API Response:", response);

      if (
        response?.status === "success" ||
        response?.code === 200 ||
        response?.code === 201
      ) {
        toast.success("Invoice added successfully!");
        props.setAction((prev) => !prev);
        if (props.fetchData) props.fetchData();
        formik.resetForm();
        props.onClose();
      } else {
        toast.error(response?.message || "Failed to add invoice");
      }
    } catch (e) {
      console.error("Error adding invoice:", e);
      toast.error(e?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    props.onClose();
  };

  const modalSize = useBreakpointValue({
    base: { width: "90%", height: "auto" },
    md: { width: "602px", height: "600px" },
  });

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size="custom"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          width={modalSize.width}
          height={modalSize.height}
          fontFamily="DM Sans, sans-serif"
          maxW="100vw"
          mx="auto"
        >
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontSize="24px"
            fontWeight="bold"
            fontFamily="DM Sans, sans-serif"
          >
            Add Invoice
            <IconButton
              onClick={props.onClose}
              icon={<CloseIcon />}
              aria-label="Close"
              size="sm"
            />
          </ModalHeader>
          <ModalBody overflowY="auto">
            <form onSubmit={handleSubmit}>
              <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Select Developer
                  </FormLabel>
                  <Select
                    fontSize="16px"
                    name="developer_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={
                      developersLoading
                        ? "Loading developers..."
                        : "Select developer"
                    }
                    value={values["developer_id"] || ""}
                    disabled={developersLoading || developersError}
                    borderColor={
                      errors?.["developer_id"] && touched?.["developer_id"]
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                  >
                    {developersData?.data?.map((developer) => (
                      <option key={developer._id} value={developer._id}>
                        {developer.developer_name}
                      </option>
                    ))}
                  </Select>
                  {errors.developer_id && touched.developer_id && (
                    <FormLabel color="red.500" fontSize="14px">
                      {errors.developer_id}
                    </FormLabel>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Claim Type
                  </FormLabel>
                  <Select
                    fontSize="16px"
                    name="claim_type"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values["claim_type"] || ""}
                    placeholder="Select Claim Type"
                    borderColor={
                      errors?.["claim_type"] && touched?.["claim_type"]
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                  >
                    <option value="full">Full</option>
                    <option value="half">Half</option>
                  </Select>
                  {errors.claim_type && touched.claim_type && (
                    <FormLabel color="red.500" fontSize="14px">
                      {errors.claim_type}
                    </FormLabel>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 12 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Unit Name
                  </FormLabel>
                  <Input
                    fontSize="16px"
                    type="text"
                    name="unit_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values["unit_name"] || ""}
                    placeholder="Enter Unit Name"
                    borderColor={
                      errors?.["unit_name"] && touched?.["unit_name"]
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                  />
                  {errors.unit_name && touched.unit_name && (
                    <FormLabel color="red.500" fontSize="14px">
                      {errors.unit_name}
                    </FormLabel>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 12 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Unit Price
                  </FormLabel>
                  <Input
                    fontSize="16px"
                    type="number"
                    name="unit_price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values["unit_price"] || ""}
                    placeholder="Enter Unit Price"
                    borderColor={
                      errors?.["unit_price"] && touched?.["unit_price"]
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                  />
                  {errors.unit_price && touched.unit_price && (
                    <FormLabel color="red.500" fontSize="14px">
                      {errors.unit_price}
                    </FormLabel>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 12 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Commission
                  </FormLabel>
                  <Input
                    fontSize="16px"
                    type="number"
                    name="commission"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values["commission"] || ""}
                    placeholder="Enter Commission"
                    borderColor={
                      errors?.["commission"] && touched?.["commission"]
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                  />
                  {errors.commission && touched.commission && (
                    <FormLabel color="red.500" fontSize="14px">
                      {errors.commission}
                    </FormLabel>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 12 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Bank Account
                  </FormLabel>
                  <Select
                    fontSize="16px"
                    name="bank_account_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={bankAccountsLoading || bankAccountsError}
                    placeholder={
                      bankAccountsLoading
                        ? "Loading bank accounts..."
                        : "Select bank account"
                    }
                    value={values["bank_account_id"] || ""}
                    borderColor={
                      errors?.["bank_account_id"] &&
                      touched?.["bank_account_id"]
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                  >
                    {bankAccountsData?.data?.map((bankAccount) => (
                      <option key={bankAccount._id} value={bankAccount._id}>
                        {bankAccount.account_holder_name}
                      </option>
                    ))}
                  </Select>
                  {errors.bank_account_id && touched.bank_account_id && (
                    <FormLabel color="red.500" fontSize="14px">
                      {errors.bank_account_id}
                    </FormLabel>
                  )}
                </GridItem>
              </Grid>
            </form>
          </ModalBody>
          <ModalFooter justifyContent="flex-end">
            <Button
              bg="#CCCACA"
              color="black"
              width="83px"
              height="46px"
              fontSize="16px"
              fontFamily="DM Sans, sans-serif"
              sx={{ textTransform: "capitalize" }}
              onClick={handleCancel}
              mr={2}
            >
              Cancel
            </Button>
            <Button
              bg="#B79045"
              color="white"
              width="83px"
              height="46px"
              fontSize="16px"
              fontFamily="DM Sans, sans-serif"
              sx={{ textTransform: "capitalize" }}
              disabled={isLoading || mutationLoading}
              type="submit"
              onClick={handleSubmit}
            >
              {isLoading || mutationLoading ? <Spinner /> : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Add;
