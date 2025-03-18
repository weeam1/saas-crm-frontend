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

      if (
        response &&
        (response.status === 200 || response.status === 201) &&
        response.status === "success"
      ) {
        toast.success("Invoice added successfully!");
        props.onClose();
        if (props.fetchData) props.fetchData();
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

  // Responsive modal size
  const modalSize = useBreakpointValue({
    base: { width: "90%", height: "auto" },
    md: { width: "602px", height: "600px" },
  });

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        size="custom" // Custom size handled via CSS
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          width={modalSize.width}
          height={modalSize.height}
          fontFamily="DM Sans, sans-serif"
          maxW="100vw" // Ensures it doesn't overflow on small screens
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
                {/* Developer and Claim Type side by side */}
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
                  {developersError && (
                    <FormLabel
                      color="red.500"
                      fontSize="16px"
                      fontFamily="DM Sans, sans-serif"
                    >
                      Error loading developers
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
                </GridItem>

                {/* Other fields on separate lines */}
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
                  {bankAccountsError && (
                    <FormLabel
                      color="red.500"
                      fontSize="16px"
                      fontFamily="DM Sans, sans-serif"
                    >
                      Error loading bank accounts
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
