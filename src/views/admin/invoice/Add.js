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
  Icon,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import * as yup from "yup";
import DropdownImg from "../../../assets/img/Invoice/mdi_menu-down.svg";

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
    .strict(true) // Enforce strict number validation
    .typeError("Unit price must be a valid number")
    .required("Unit price is required")
    .min(0, "Unit price cannot be negative"),
  commission: yup
    .number()
    .strict(true) // Enforce strict number validation
    .typeError("Commission must be a valid number")
    .required("Commission is required")
    .min(0.01, "Commission must be greater than 0")
    .max(99, "Commission must be less than 100"),
  claim_type: yup.string().required("Claim type is required"),
  name_of_referring_party: yup.string().required("Referring party is required"),
});

const Add = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch developers data only when modal is open
  const {
    data: developersData,
    isLoading: developersLoading,
    error: developersError,
  } = useFetchItemsQuery(
    { path: "/developer/getALL" },
    {
      skip: !props.isOpen,
    }
  );

  // Fetch bank accounts data only when modal is open
  const {
    data: bankAccountsData,
    isLoading: bankAccountsLoading,
    error: bankAccountsError,
  } = useFetchItemsQuery(
    { path: "/bankAccount/get" },
    {
      skip: !props.isOpen,
    }
  );

  const [createItemMutation, { isLoading: mutationLoading }] =
    useCreateItemMutation();

  const initialValues = {
    unit_no: null,
    invoice_number: null,
    total_amount: 0,
    developer_id: "",
    bank_account_id: "",
    unit_name: "",
    unit_price: "",
    commission: "",
    claim_type: "",
    name_of_referring_party: "",
    developer_name: "",
    bank_details: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: invoiceSchema,
    onSubmit: (values, { resetForm }) => {
      AddData(values);
    },
    enableReinitialize: true, // Ensures form resets when initialValues change
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = formik;

  const AddData = async (formValues) => {
    try {
      setIsLoading(true);

      const response = await createItemMutation({
        path: "/invoice/add",
        body: formValues,
      }).unwrap();

      if (
        response?.status === "success" ||
        response?.code === 200 ||
        response?.code === 201
      ) {
        toast.success("Invoice added successfully!");
        if (props.fetchData) {
          props.fetchData({
            pageIndex: props.pageIndex || 0,
            pageSize: props.pageSize || 4,
          });
        }
        if (props.setAction) props.setAction((prev) => !prev);
        resetForm(); // Reset form after successful submission
        props.onClose();
      } else {
        throw new Error(response?.message || "Failed to add invoice");
      }
    } catch (e) {
      console.error("Error adding invoice:", e);
      toast.error(e?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm(); // Reset form on cancel
    props.onClose();
  };

  const modalSize = useBreakpointValue({
    base: { width: "90%", height: "auto" },
    md: { width: "602px", height: "650px" },
  });

  const customDropdownIcon = (
    <Icon as={() => <img src={DropdownImg} alt="dropdown" />} boxSize={6} />
  );

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size="custom"
        motionPreset="slideInBottom"
        isCentered
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
                      developersData?.data?.length > 0
                        ? "Select developer"
                        : "No developers available"
                    }
                    value={values.developer_id || ""}
                    disabled={developersLoading || developersError}
                    borderColor={
                      errors.developer_id && touched.developer_id
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                    icon={customDropdownIcon}
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
                    value={values.claim_type || ""}
                    placeholder="Select Claim Type"
                    borderColor={
                      errors.claim_type && touched.claim_type ? "red.300" : null
                    }
                    fontFamily="DM Sans, sans-serif"
                    icon={customDropdownIcon}
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
                    value={values.unit_name || ""}
                    placeholder="Enter Unit Name"
                    borderColor={
                      errors.unit_name && touched.unit_name ? "red.300" : null
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
                    Name of Referring Party
                  </FormLabel>
                  <Input
                    fontSize="16px"
                    type="text"
                    name="name_of_referring_party"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_of_referring_party || ""}
                    placeholder="Enter Referring Party"
                    borderColor={
                      errors.name_of_referring_party &&
                      touched.name_of_referring_party
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                  />
                  {errors.name_of_referring_party &&
                    touched.name_of_referring_party && (
                      <FormLabel color="red.500" fontSize="14px">
                        {errors.name_of_referring_party}
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
                    value={values.unit_price || ""}
                    placeholder="Enter Unit Price"
                    borderColor={
                      errors.unit_price && touched.unit_price ? "red.300" : null
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
                    value={values.commission || ""}
                    placeholder="Enter Commission"
                    borderColor={
                      errors.commission && touched.commission ? "red.300" : null
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
                    placeholder={
                      bankAccountsData?.data?.length > 0
                        ? "Choose Bank Account"
                        : "No bank accounts available"
                    }
                    value={values.bank_account_id || ""}
                    disabled={bankAccountsLoading || bankAccountsError}
                    borderColor={
                      errors.bank_account_id && touched.bank_account_id
                        ? "red.300"
                        : null
                    }
                    fontFamily="DM Sans, sans-serif"
                    icon={customDropdownIcon}
                  >
                    {bankAccountsData?.data?.map((bank) => (
                      <option key={bank._id} value={bank._id}>
                        {bank.account_holder_name} - {bank.account_number}
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
              borderRadius="6px"
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
              borderRadius="6px"
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
