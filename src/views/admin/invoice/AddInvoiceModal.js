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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFetchItemsQuery } from "api/apiSlice";
import * as yup from "yup";
import DropdownImg from "../../../assets/img/Invoice/mdi_menu-down.svg";
import { setDevelopers, setBankAccounts } from "../../../redux/invoiceSlice";
import { useParams } from "react-router-dom";
import AddEntryModal from "./AddInvoiceEntry"; // Import the Add Entry Modal

// Validation schema for invoice
const invoiceSchema = yup.object().shape({
  developer_id: yup.string().required("Developer is required"),
  bank_account_id: yup.string().required("Bank account is required"),
  claimType: yup.string().required("Claim type is required"),
});

const AddInvoice = (props) => {
  const { id } = useParams(); // developer_id from URL params
  const [isLoading, setIsLoading] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const dispatch = useDispatch();

  const { developers, bankAccounts, isDevelopersLoaded, isBankAccountsLoaded } =
    useSelector((state) => state.invoiceModalData);

  const {
    data: developersData,
    isLoading: developersLoading,
    error: developersError,
  } = useFetchItemsQuery(
    { path: "/developer/getALL" },
    { skip: !props.isOpen || isDevelopersLoaded }
  );

  const {
    data: bankAccountsData,
    isLoading: bankAccountsLoading,
    error: bankAccountsError,
  } = useFetchItemsQuery(
    { path: "/bankAccount/get" },
    { skip: !props.isOpen || isBankAccountsLoaded }
  );

  useEffect(() => {
    if (developersData?.data && !isDevelopersLoaded) {
      dispatch(setDevelopers(developersData.data));
    }
    if (bankAccountsData?.data && !isBankAccountsLoaded) {
      dispatch(setBankAccounts(bankAccountsData.data));
    }
  }, [
    developersData,
    bankAccountsData,
    isDevelopersLoaded,
    isBankAccountsLoaded,
    dispatch,
  ]);

  const initialValues = {
    developer_id: id || "",
    bank_account_id: "",
    claimType: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: invoiceSchema,
    onSubmit: (values) => {
      handleNext(values);
    },
    enableReinitialize: true,
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    isValid,
    dirty,
  } = formik;

  const handleNext = (formValues) => {
    setInvoiceData(formValues);
    setIsEntryModalOpen(true);
  };

  const handleCancel = () => {
    resetForm();
    props.onClose();
  };

  const modalSize = useBreakpointValue({
    base: { width: "90%", height: "auto" },
    md: { width: "602px", height: "250px" },
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
            Add Invoice
            <IconButton
              onClick={props.onClose}
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
              <Grid templateColumns="repeat(12, 1fr)" gap={3}>
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Bank Account
                  </FormLabel>
                  <Select
                    fontSize="16px"
                    name="bank_account_id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={
                      bankAccountsLoading
                        ? "Loading bank accounts..."
                        : bankAccounts.length > 0
                          ? "Choose Bank Account"
                          : "No bank accounts available"
                    }
                    value={values.bank_account_id}
                    disabled={bankAccountsLoading || bankAccountsError}
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
                    {bankAccounts.map((bank) => (
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
                <GridItem colSpan={{ base: 12, md: 6 }}>
                  <FormLabel fontSize="16px" fontFamily="DM Sans, sans-serif">
                    Claim Type
                  </FormLabel>
                  <Select
                    fontSize="16px"
                    name="claimType"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.claimType}
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
                    <FormLabel color="red.500" fontSize="14px">
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
              width={{ base: "80px", md: "83px" }}
              height="46px"
              fontSize="16px"
              borderRadius="6px"
              fontFamily="DM Sans, sans-serif"
              sx={{ textTransform: "capitalize" }}
              onClick={handleCancel}
              mr={2}
              _hover={{ bg: "#B0AEAE" }}
            >
              Cancel
            </Button>
            <Button
              bg="#B79045"
              color="white"
              width={{ base: "80px", md: "83px" }}
              height="46px"
              fontSize="16px"
              fontFamily="DM Sans, sans-serif"
              borderRadius="6px"
              sx={{ textTransform: "capitalize" }}
              disabled={isLoading || !isValid || !dirty}
              onClick={handleSubmit}
              _hover={{ bg: "#A17C3A" }}
              _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            >
              {isLoading ? <Spinner /> : "Next"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEntryModalOpen && (
        <AddEntryModal
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
          invoiceData={invoiceData}
          fetchData={props.fetchData}
          setAction={props.setAction}
          onInvoiceClose={props.onClose}
        />
      )}
    </div>
  );
};

export default AddInvoice;
