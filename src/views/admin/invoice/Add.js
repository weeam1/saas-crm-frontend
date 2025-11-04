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
  useBreakpointValue,
  Text,
  ModalCloseButton,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCreateItemMutation } from "api/apiSlice";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import useUserSession from "hooks/useUserSession";
import { useModalColors } from "hooks/useModalColors";

// Validation schema for entry
const entrySchema = yup.object().shape({
  unit_no: yup.string().required("Unit No is required"),
  name_of_referring_party: yup.string().required("Referring party is required"),
  commission_percentage: yup
    .number()
    .typeError("Commission percentage must be a valid number")
    .required("Commission percentage is required")
    .min(0, "Commission must be positive value")
    .max(99, "Commission must be less than 100"),
  unit_price: yup
    .number()
    .typeError("Unit price must be a valid number")
    .required("Unit price is required")
    .min(1, "Unit price cannot be negative or zero"),
  vat_percentage: yup
    .number()
    .typeError("VAT percentage must be a valid number")
    .required("VAT percentage is required")
    .min(0, "VAT percentage cannot be negative")
    .lessThan(100, "VAT percentage must be less than 100"),
});

function calculateTotal(unitPrice, commissionPercentage, vatPercentage) {
  const totalCommissionExclVat = (commissionPercentage / 100) * unitPrice;

  const vatAmount = (vatPercentage / 100) * totalCommissionExclVat;

  const totalCommissionInclVat = totalCommissionExclVat + vatAmount;
  const total_amount = unitPrice + totalCommissionInclVat;
  return {
    total_commission_excl_vat: totalCommissionExclVat,
    vat_amount: vatAmount,
    total_commission_incl_vat: totalCommissionInclVat,
    total_amount: total_amount,
  };
}

const AddEntryModal = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createItemMutation, { isLoading: mutationLoading }] =
    useCreateItemMutation();
  const location = useLocation();

  const navigate = useNavigate();

  const { user } = useUserSession();
  const { createUserLog } = useUserActivityLog();

  const { bg, headerBg, headerText, footerBg, borderColor } = useModalColors();

  const queryParams = new URLSearchParams(location.search);
  const incomingPayment = queryParams.get("incomingPayment");
  const initialValues = {
    unit_no: "",
    name_of_referring_party: "",
    commission_percentage: "",
    unit_price: "",
    vat_percentage: "",
    total_commission_excl_vat: 0,
    vat_amount: 0,
    total_commission_incl_vat: 0,
    total_amount: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: entrySchema,
    onSubmit: (values, { resetForm }) => {
      AddData(values, resetForm);
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
    resetForm,
    isValid,
    dirty,
  } = formik;

  useEffect(() => {
    if (
      values.unit_price ||
      values.commission_percentage ||
      values.vat_percentage
    ) {
      const {
        total_commission_excl_vat,
        vat_amount,
        total_commission_incl_vat,
        total_amount,
      } = calculateTotal(
        Number(values.unit_price ?? 1),
        Number(values.commission_percentage ?? 0),
        Number(values.vat_percentage ?? 0)
      );
      setValues({
        ...values,
        total_commission_excl_vat,
        vat_amount,
        total_commission_incl_vat,
        total_amount,
      });
    }
  }, [
    values.unit_price,
    values.commission_percentage,
    values.vat_percentage,
    setValues,
  ]);

  const AddData = async (entryValues, resetForm) => {
    try {
      setIsLoading(true);

      const payload = {
        invoice: props.invoiceId,
        unit_no: entryValues.unit_no,
        name_of_referring_party: entryValues.name_of_referring_party,
        commission_percentage: Number(entryValues.commission_percentage),
        unit_price: Number(entryValues.unit_price),
        total_commission_excl_vat: Number(
          entryValues.total_commission_excl_vat
        ),
        vat_percentage: Number(entryValues.vat_percentage),
        vat_amount: Number(entryValues.vat_amount),
        total_amount: Number(entryValues.total_amount),
        total_commission_incl_vat: Number(
          entryValues.total_commission_incl_vat
        ),
      };

      const response = await createItemMutation({
        path: "/invoices/entries/",
        body: payload,
      }).unwrap();

      if (!response?.data) {
        throw new Error("Failed to create invoice and entry");
      }
      /// enitries
      const invoiceId = response.data.invoice._id;

      toast.success("Invoice and entry added successfully!");
      if (props.fetchData) props.fetchData();
      if (props.setAction) props.setAction((prev) => !prev);
      resetForm();
      props.onClose();
      if (props.onSuccess) props.onSuccess(invoiceId);
      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Invoice",
        entityType: "InvoiceEntry",
        entityId: response?.data?.invoice._id,
        status: "success",
        message: `"${user?.fullName}" created the invoice entry and referring party is "${response?.data?.name_of_referring_party || "Untitled"}".`,
      });
    } catch (e) {
      console.error("Error:", e);
      toast.error(e?.data?.message || e.message || "Operation failed");
      const errorMsg =
        e?.data?.message ||
        "Failed to creating invoice entry. Please try again.";
      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Invoice",
        entityType: "InvoiceEntry",
        status: e?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    props.onClose();
  };

  const modalSize = useBreakpointValue({
    base: { width: "90%", height: "auto" },
    md: { width: "602px", height: "auto", maxHeight: "80vh" },
  });

  return (
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
        m="2"
        borderRadius="2xl"
        bg={bg}
        shadow="2xl"
        overflow="hidden"
        maxH="85vh"
      >
        <ModalHeader
          display="flex"
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
            Add Invoice Entry
          </Text>

          <ModalCloseButton
            onClick={handleCancel}
            position="absolute"
            right="12px"
            top="10px"
            color={headerText}
            _hover={{ bg: "whiteAlpha.200" }}
          />
        </ModalHeader>
        <ModalBody
          p={5}
          overflowY="auto"
          scrollBehavior="smooth"
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "10px",
            },
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  Unit No
                </FormLabel>
                <Input
                  fontSize="14px"
                  name="unit_no"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.unit_no}
                  placeholder="Enter Unit No (e.g., A-101)"
                  borderColor={
                    errors.unit_no && touched.unit_no ? "red.300" : "gray.300"
                  }
                  borderRadius="6px"
                  height="40px"
                  _focus={{
                    borderColor: "#B79045",
                    boxShadow: "0 0 0 1px #B79045",
                  }}
                />
                {errors.unit_no && touched.unit_no && (
                  <FormLabel color="red.500" fontSize="12px" mt={1}>
                    {errors.unit_no}
                  </FormLabel>
                )}
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  Name of Referring Party
                </FormLabel>
                <Input
                  fontSize="14px"
                  name="name_of_referring_party"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name_of_referring_party}
                  placeholder="Enter Referring Party"
                  borderColor={
                    errors.name_of_referring_party &&
                    touched.name_of_referring_party
                      ? "red.300"
                      : "gray.300"
                  }
                  borderRadius="6px"
                  height="40px"
                  _focus={{
                    borderColor: "#B79045",
                    boxShadow: "0 0 0 1px #B79045",
                  }}
                />
                {errors.name_of_referring_party &&
                  touched.name_of_referring_party && (
                    <FormLabel color="red.500" fontSize="12px" mt={1}>
                      {errors.name_of_referring_party}
                    </FormLabel>
                  )}
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  Unit Price
                </FormLabel>
                <Input
                  fontSize="14px"
                  type="number"
                  name="unit_price"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.unit_price}
                  placeholder="Enter Unit Price"
                  borderColor={
                    errors.unit_price && touched.unit_price
                      ? "red.300"
                      : "gray.300"
                  }
                  borderRadius="6px"
                  height="40px"
                  _focus={{
                    borderColor: "#B79045",
                    boxShadow: "0 0 0 1px #B79045",
                  }}
                />
                {errors.unit_price && touched.unit_price && (
                  <FormLabel color="red.500" fontSize="12px" mt={1}>
                    {errors.unit_price}
                  </FormLabel>
                )}
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  Commission Percentage (%)
                </FormLabel>
                <Input
                  fontSize="14px"
                  type="number"
                  name="commission_percentage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.commission_percentage}
                  placeholder="Enter Commission %"
                  borderColor={
                    errors.commission_percentage &&
                    touched.commission_percentage
                      ? "red.300"
                      : "gray.300"
                  }
                  borderRadius="6px"
                  height="40px"
                  _focus={{
                    borderColor: "#B79045",
                    boxShadow: "0 0 0 1px #B79045",
                  }}
                />
                {errors.commission_percentage &&
                  touched.commission_percentage && (
                    <FormLabel color="red.500" fontSize="12px" mt={1}>
                      {errors.commission_percentage}
                    </FormLabel>
                  )}
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  VAT Percentage (%)
                </FormLabel>
                <Input
                  fontSize="14px"
                  type="number"
                  name="vat_percentage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.vat_percentage}
                  placeholder="Enter VAT %"
                  borderColor={
                    errors.vat_percentage && touched.vat_percentage
                      ? "red.300"
                      : "gray.300"
                  }
                  borderRadius="6px"
                  height="40px"
                  _focus={{
                    borderColor: "#B79045",
                    boxShadow: "0 0 0 1px #B79045",
                  }}
                />
                {errors.vat_percentage && touched.vat_percentage && (
                  <FormLabel color="red.500" fontSize="12px" mt={1}>
                    {errors.vat_percentage}
                  </FormLabel>
                )}
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  Total Commission Excl. VAT
                </FormLabel>
                <Input
                  fontSize="14px"
                  type="text"
                  value={values.total_commission_excl_vat.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                  isReadOnly
                  borderColor="gray.300"
                  borderRadius="6px"
                  height="40px"
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  VAT Amount
                </FormLabel>
                <Input
                  fontSize="14px"
                  type="text"
                  value={values.vat_amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  isReadOnly
                  borderColor="gray.300"
                  borderRadius="6px"
                  height="40px"
                />
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="medium"
                  color="gray.700"
                  mb={1}
                >
                  Total Commission Incl. VAT
                </FormLabel>
                <Input
                  fontSize="14px"
                  type="text"
                  value={values.total_commission_incl_vat.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                  isReadOnly
                  borderColor="gray.300"
                  borderRadius="6px"
                  height="40px"
                />
              </GridItem>
              {/* <GridItem colSpan={{ base: 12, md: 6 }}>
								<FormLabel
									fontSize='14px'
									fontWeight='medium'
									color='gray.700'
									mb={1}
								>
									Total Amount
								</FormLabel>
								<Input
									fontSize='14px'
									type='text'
									value={values.total_amount.toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
									isReadOnly
									borderColor='gray.300'
									borderRadius='6px'
									height='40px'
								/>
							</GridItem> */}
            </Grid>
          </form>
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
            variant="outline"
            bg="#CCCACA"
            color="black"
            borderRadius="md"
            size="sm"
            onClick={handleCancel}
            mr={3}
          >
            Cancel
          </Button>
          <Button
            bg="#B79045"
            color="white"
            borderRadius="md"
            size="sm"
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
  );
};

export default AddEntryModal;
