import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useFetchItemsQuery, useUpdateItemMutation } from "api/apiSlice";
import * as yup from "yup";
import { toast } from "react-toastify";
import DropdownImg from "../../../assets/img/Invoice/mdi_menu-down.svg";

const Edit = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    developer_id: "",
    claim_type: "",
    unit_name: "",
    unit_price: "",
    commission: "",
    bank_account_id: "",
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const {
    data: invoiceList,
    isFetching: invoiceFetching,
    error: invoiceError,
    refetch: refetchInvoices,
  } = useFetchItemsQuery(
    {
      path: `/invoice/get?user=${user._id}`,
    },
    {
      skip: !props.isOpen || !props.selectedId || !user._id,
    }
  );

  const { data: developersData, error: developersError } = useFetchItemsQuery(
    { path: "/developer/getALL" },
    { skip: !props.isOpen }
  );

  const { data: bankAccountsData, error: bankAccountsError } =
    useFetchItemsQuery({ path: "/bankAccount/get" }, { skip: !props.isOpen });

  const [updateItem, { isLoading: mutationLoading }] = useUpdateItemMutation();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      developer_id: yup.string(),
      claim_type: yup.string(),
      unit_name: yup.string(),
      unit_price: yup.number().typeError("Unit Price must be a number"),
      commission: yup.number().typeError("Commission must be a number"),
      bank_account_id: yup.string(),
    }),
    onSubmit: (values) => {
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== "")
      );
      EditData(filteredValues);
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
  } = formik;

  const EditData = async (formValues) => {
    try {
      setIsLoading(true);
      const response = await updateItem({
        path: `/invoice/edit/${props?.selectedId}`,
        method: "PUT",
        body: formValues,
      }).unwrap();

      if (
        response?.status === "success" ||
        response?.code === 200 ||
        response?.status === 200
      ) {
        toast.success("Invoice updated successfully!");

        // Refetch the invoice data after successful update
        refetchInvoices();

        // Update initialValues with the response data if available
        if (response.data) {
          const updatedValues = {
            developer_id:
              response.data.developer_id?._id ||
              response.data.developer_id ||
              "",
            claim_type: response.data.claim_type?.toUpperCase() || "",
            unit_name: response.data.unit_name || "",
            unit_price: response.data.unit_price?.toString() || "",
            commission: response.data.commission_percentage?.toString() || "",
            bank_account_id:
              response.data.bank_account_id?._id ||
              response.data.bank_account_id ||
              "",
          };
          setInitialValues(updatedValues);
          setValues(updatedValues); // Sync form values immediately
        }

        if (props.fetchData) {
          props.fetchData({
            pageIndex: props.pageIndex || 0,
            pageSize: props.pageSize || 4,
          });
        }
        if (props.setAction) props.setAction((prev) => !prev);
        props.onClose();
      } else {
        throw new Error(response?.message || "Failed to update invoice");
      }
    } catch (e) {
      console.error("Error updating invoice:", e);
      toast.error(e?.data?.message || "Something went wrong!");
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
    if (invoiceList && !invoiceFetching && props.selectedId) {
      const editData = invoiceList?.data?.find(
        (invoice) => invoice._id === props.selectedId
      );
      if (editData) {
        const updatedValues = {
          developer_id:
            editData?.developer_id?._id || editData?.developer_id || "",
          claim_type: editData?.claim_type?.toUpperCase() || "",
          unit_name: editData?.unit_name || "",
          unit_price: editData?.unit_price?.toString() || "",
          commission: editData?.commission_percentage?.toString() || "",
          bank_account_id:
            editData?.bank_account_id?._id || editData?.bank_account_id || "",
        };
        setInitialValues(updatedValues);
        setValues(updatedValues);
      } else {
        console.error("Invoice not found in list for ID:", props.selectedId);
        toast.error("Invoice not found!");
      }
    }
  }, [invoiceList, invoiceFetching, props.selectedId, setValues]);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleClose}
      size={props.size || "xl"}
      isCentered
    >
      <ModalOverlay />
      <ModalContent fontFamily="'DM Sans', sans-serif">
        <ModalHeader justifyContent="space-between" display="flex">
          Edit Invoice
          <IconButton onClick={handleClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
              <FormControl flex={1}>
                <FormLabel>Developer Name</FormLabel>
                <Select
                  placeholder={
                    developersData?.data?.length > 0
                      ? "Choose Developer"
                      : "No developer added"
                  }
                  name="developer_id"
                  value={values.developer_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.developer_id && !!errors.developer_id}
                  icon={<img src={DropdownImg} alt="Dropdown" />}
                >
                  {developersData?.data?.map((developer) => (
                    <option key={developer._id} value={developer._id}>
                      {developer.developer_name}
                    </option>
                  ))}
                </Select>
                {touched.developer_id && errors.developer_id && (
                  <Text color="red.500" fontSize="sm">
                    {errors.developer_id}
                  </Text>
                )}
              </FormControl>

              <FormControl flex={1}>
                <Select
                  mt={{ base: 0, md: 8 }}
                  placeholder="Choose Claim Type"
                  name="claim_type"
                  value={values.claim_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.claim_type && !!errors.claim_type}
                  icon={<img src={DropdownImg} alt="Dropdown" />}
                >
                  <option value="FULL">FULL</option>
                  <option value="HALF">HALF</option>
                </Select>
                {touched.claim_type && errors.claim_type && (
                  <Text color="red.500" fontSize="sm">
                    {errors.claim_type}
                  </Text>
                )}
              </FormControl>
            </Flex>

            <FormControl mb={4}>
              <FormLabel>Unit Name</FormLabel>
              <Input
                placeholder="Enter Unit Name"
                name="unit_name"
                value={values.unit_name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.unit_name && !!errors.unit_name}
              />
              {touched.unit_name && errors.unit_name && (
                <Text color="red.500" fontSize="sm">
                  {errors.unit_name}
                </Text>
              )}
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Unit Price</FormLabel>
              <Input
                placeholder="Enter Unit Price"
                name="unit_price"
                type="number"
                value={values.unit_price}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.unit_price && !!errors.unit_price}
              />
              {touched.unit_price && errors.unit_price && (
                <Text color="red.500" fontSize="sm">
                  {errors.unit_price}
                </Text>
              )}
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Commission (%)</FormLabel>
              <Input
                placeholder="Enter Commission"
                name="commission"
                type="number"
                value={values.commission}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.commission && !!errors.commission}
              />
              {touched.commission && errors.commission && (
                <Text color="red.500" fontSize="sm">
                  {errors.commission}
                </Text>
              )}
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Bank Account</FormLabel>
              <Select
                placeholder={
                  bankAccountsData?.data?.length > 0
                    ? "Choose Bank Account"
                    : "No bank account added"
                }
                name="bank_account_id"
                value={values.bank_account_id}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.bank_account_id && !!errors.bank_account_id}
                icon={<img src={DropdownImg} alt="Dropdown" />}
              >
                {bankAccountsData?.data?.map((bank) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.account_holder_name} - {bank.account_number}
                  </option>
                ))}
              </Select>
              {touched.bank_account_id && errors.bank_account_id && (
                <Text color="red.500" fontSize="sm">
                  {errors.bank_account_id}
                </Text>
              )}
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            w="104px"
            h="46px"
            bg="#CCCACA"
            borderRadius="6px"
            size="sm"
            sx={{ marginLeft: 2, textTransform: "capitalize" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ textTransform: "capitalize" }}
            bg="#B79045"
            color="white"
            w="104px"
            h="46px"
            ml={2}
            borderRadius="6px"
            size="sm"
            type="submit"
            disabled={isLoading || mutationLoading}
            onClick={handleSubmit}
          >
            {isLoading || mutationLoading ? <Spinner size="sm" /> : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Edit;
