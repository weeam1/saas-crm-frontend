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
import { useState } from "react";
import { toast } from "react-toastify";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";
import * as yup from "yup";
import DropdownImg from "../../../assets/img/Invoice/mdi_menu-down.svg";

const invoiceSchema = yup.object().shape({
  developer_id: yup.string().required("Developer is required"),
  bank_account_id: yup.string().required("Bank account is required"),
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
    developer_id: "",
    bank_account_id: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: invoiceSchema,
    onSubmit: (values, { resetForm }) => {
      AddData(values);
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

  const AddData = async (formValues) => {
    try {
      setIsLoading(true);

      const response = await createItemMutation({
        path: "/invoices",
        body: formValues,
      }).unwrap();

      // Log the response to debug its structure
      console.log("API Response:", response);

      // If unwrap() succeeds, the request was successful (status 2xx)
      toast.success("Invoice added successfully!");
      if (props.fetchData) {
        props.fetchData({
          pageIndex: props.pageIndex || 0,
          pageSize: props.pageSize || 4,
        });
      }
      if (props.setAction) props.setAction((prev) => !prev);
      resetForm();
      props.onClose();
    } catch (e) {
      console.error("Error adding invoice:", e);
      const errorMessage =
        e?.data?.message || e?.message || "Failed to add invoice";
      toast.error(errorMessage);
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
              _hover={{ bg: "#B0AEAE" }}
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
              disabled={isLoading || mutationLoading || !isValid || !dirty}
              type="submit"
              onClick={handleSubmit}
              _hover={{ bg: "#A17C3A" }}
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
