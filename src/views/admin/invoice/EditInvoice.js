import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
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
import { useEffect, useState } from "react";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import * as yup from "yup";
import { toast } from "react-toastify";
import DropdownImg from "../../../assets/img/Invoice/mdi_menu-down.svg";

const invoiceSchema = yup.object().shape({
  developer_id: yup.string().required("Developer is required"),
  bank_account_id: yup.string().required("Bank account is required"),
  claimType: yup.string().required("Claim type is required"), // Added validation for claimType
});

const Edit = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const selectedInvoice = Array.isArray(props.data)
    ? props.data.find((invoice) => invoice._id === props.selectedId)
    : null;
  const invoiceNo = selectedInvoice?.invoiceNo || null;

  const {
    data: invoiceList,
    isFetching: invoiceFetching,
    error: invoiceError,
    refetch: refetchInvoices,
  } = useFetchItemsQuery(
    {
      path: `/invoices/${invoiceNo || props.selectedId}`,
    },
    {
      skip: !props.isOpen || (!props.selectedId && !invoiceNo) || !user._id,
    }
  );

  const { data: developersData, error: developersError } = useFetchItemsQuery(
    { path: "/developer/getALL" },
    { skip: !props.isOpen }
  );

  const { data: bankAccountsData, error: bankAccountsError } =
    useFetchItemsQuery({ path: "/bankAccount/get" }, { skip: !props.isOpen });

  const [updateItem, { isLoading: mutationLoading }] = useUpdateItemMutation();

  const initialValues = {
    developer_id: selectedInvoice?.developer?._id || "",
    bank_account_id: selectedInvoice?.bank_account?._id || "",
    claimType: selectedInvoice?.claimType || "", // Added claimType to initialValues
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: invoiceSchema,
    onSubmit: (values) => {
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== "")
      );
      EditData(filteredValues);
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    isValid,
    dirty,
  } = formik;

  const EditData = async (formValues) => {
    try {
      setIsLoading(true);

      const payload = {
        developer: formValues.developer_id,
        bank_account: formValues.bank_account_id,
        claimType: formValues.claimType, // Added claimType to the payload
      };

      const response = await updateItem({
        path: `/invoices/${invoiceNo || props.selectedId}`,
        method: "PUT",
        body: payload,
      }).unwrap();
      if (response) {
        toast.success("Invoice updated successfully!");
        refetchInvoices();

        if (props.fetchData) {
          props.fetchData({
            pageIndex: props.pageIndex || 0,
            pageSize: props.pageSize || 4,
          });
        }
        if (props.setAction) props.setAction((prev) => !prev);
        props.onClose();
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (e) {
      console.error("Error updating invoice:", e);
      toast.error(e?.data?.message || e.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    props.onClose();
    if (props.setSelectedId) props.setSelectedId(null);
    formik.resetForm();
  };

  useEffect(() => {
    if (invoiceList && !invoiceFetching && (props.selectedId || invoiceNo)) {
      let editData;
      if (Array.isArray(invoiceList?.data)) {
        editData = invoiceList.data.find(
          (invoice) => invoice._id === props.selectedId
        );
      } else if (invoiceList?.data && typeof invoiceList.data === "object") {
        editData =
          invoiceList.data._id === props.selectedId ? invoiceList.data : null;
      }

      if (editData) {
        const updatedValues = {
          developer_id: editData?.developer?._id || "",
          bank_account_id: editData?.bank_account?._id || "",
          claimType: editData?.claimType || "", // Added claimType to updatedValues
        };
        setValues(updatedValues);
      } else {
        console.error("Invoice not found for ID:", props.selectedId);
        toast.error("Invoice not found!");
      }
    }
  }, [invoiceList, invoiceFetching, props.selectedId, invoiceNo, setValues]);

  const modalSize = useBreakpointValue({
    base: { width: "90%", height: "auto" },
    md: { width: "602px", height: "auto", maxHeight: "80vh" },
  });

  const customDropdownIcon = (
    <Icon as={() => <img src={DropdownImg} alt="dropdown" />} boxSize={6} />
  );

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        onClose={handleClose}
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
          borderRadius="10px"
          boxShadow="lg"
        >
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontSize={{ base: "20px", md: "24px" }}
            fontWeight="bold"
            fontFamily="DM Sans, sans-serif"
            px={6}
            py={4}
            borderBottom="1px solid #E2E8F0"
          >
            Edit Invoice {invoiceNo ? `#${invoiceNo}` : ""}
            <IconButton
              onClick={handleClose}
              icon={<CloseIcon />}
              aria-label="Close"
              size="sm"
              variant="ghost"
              color="gray.600"
              _hover={{ color: "gray.800", bg: "gray.100" }}
            />
          </ModalHeader>
          <ModalBody overflowY="auto" px={6} py={4}>
            <form onSubmit={handleSubmit}>
              <Grid templateColumns="repeat(12, 1fr)" gap={4}>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight="medium"
                    fontFamily="DM Sans, sans-serif"
                    color="gray.700"
                    mb={1}
                  >
                    Developer Name
                  </FormLabel>
                  <Select
                    fontSize="14px"
                    name="developer_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.developer_id || ""}
                    placeholder={
                      developersData?.data?.length > 0
                        ? "Choose Developer"
                        : "No developer added"
                    }
                    borderColor={
                      errors.developer_id && touched.developer_id
                        ? "red.300"
                        : "gray.300"
                    }
                    fontFamily="DM Sans, sans-serif"
                    icon={customDropdownIcon}
                    borderRadius="6px"
                    height="40px"
                    _focus={{
                      borderColor: "#B79045",
                      boxShadow: "0 0 0 1px #B79045",
                    }}
                  >
                    {developersData?.data?.map((developer) => (
                      <option key={developer._id} value={developer._id}>
                        {developer.developer_name}
                      </option>
                    ))}
                  </Select>
                  {errors.developer_id && touched.developer_id && (
                    <FormLabel color="red.500" fontSize="12px" mt={1}>
                      {errors.developer_id}
                    </FormLabel>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight="medium"
                    fontFamily="DM Sans, sans-serif"
                    color="gray.700"
                    mb={1}
                  >
                    Bank Account
                  </FormLabel>
                  <Select
                    fontSize="14px"
                    name="bank_account_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.bank_account_id || ""}
                    placeholder={
                      bankAccountsData?.data?.length > 0
                        ? "Choose Bank Account"
                        : "No bank account added"
                    }
                    borderColor={
                      errors.bank_account_id && touched.bank_account_id
                        ? "red.300"
                        : "gray.300"
                    }
                    fontFamily="DM Sans, sans-serif"
                    icon={customDropdownIcon}
                    borderRadius="6px"
                    height="40px"
                    _focus={{
                      borderColor: "#B79045",
                      boxShadow: "0 0 0 1px #B79045",
                    }}
                  >
                    {bankAccountsData?.data?.map((bank) => (
                      <option key={bank._id} value={bank._id}>
                        {bank.account_holder_name} - {bank.account_number}
                      </option>
                    ))}
                  </Select>
                  {errors.bank_account_id && touched.bank_account_id && (
                    <FormLabel color="red.500" fontSize="12px" mt={1}>
                      {errors.bank_account_id}
                    </FormLabel>
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight="medium"
                    fontFamily="DM Sans, sans-serif"
                    color="gray.700"
                    mb={1}
                  >
                    Claim Type
                  </FormLabel>
                  <Select
                    fontSize="14px"
                    name="claimType"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.claimType || ""}
                    placeholder="Select Claim Type"
                    borderColor={
                      errors.claimType && touched.claimType
                        ? "red.300"
                        : "gray.300"
                    }
                    fontFamily="DM Sans, sans-serif"
                    icon={customDropdownIcon}
                    borderRadius="6px"
                    height="40px"
                    _focus={{
                      borderColor: "#B79045",
                      boxShadow: "0 0 0 1px #B79045",
                    }}
                  >
                    <option value="Full">Full</option>
                    <option value="Installment">Installment</option>
                  </Select>
                  {errors.claimType && touched.claimType && (
                    <FormLabel color="red.500" fontSize="12px" mt={1}>
                      {errors.claimType}
                    </FormLabel>
                  )}
                </GridItem>
              </Grid>
            </form>
          </ModalBody>
          <ModalFooter
            justifyContent="flex-end"
            px={6}
            py={4}
            borderTop="1px solid #E2E8F0"
          >
            <Button
              bg="#CCCACA"
              color="black"
              width={{ base: "80px", md: "100px" }}
              height="40px"
              fontSize="14px"
              borderRadius="6px"
              fontFamily="DM Sans, sans-serif"
              sx={{ textTransform: "capitalize" }}
              onClick={handleClose}
              mr={3}
              _hover={{ bg: "#B0AEAE" }}
            >
              Cancel
            </Button>
            <Button
              bg="#B79045"
              color="white"
              width={{ base: "80px", md: "100px" }}
              height="40px"
              fontSize="14px"
              fontFamily="DM Sans, sans-serif"
              borderRadius="6px"
              sx={{ textTransform: "capitalize" }}
              disabled={isLoading || mutationLoading || !isValid || !dirty}
              type="submit"
              onClick={handleSubmit}
              _hover={{ bg: "#A47B38" }}
              _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              {isLoading || mutationLoading ? <Spinner /> : "Save"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Edit;
