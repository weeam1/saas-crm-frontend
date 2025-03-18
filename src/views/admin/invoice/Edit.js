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
import { getApi } from "services/api";

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

  const { data: developersData, isLoading: developersLoading } =
    useFetchItemsQuery({ path: "/developer/get" });

  const { data: bankAccountsData, isLoading: bankAccountsLoading } =
    useFetchItemsQuery({ path: "/bankAccount/get" });

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
      // Filter out empty strings from the form values
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== "")
      );
      EditData(filteredValues);
    },
  });

  const { errors, touched, values, handleBlur, handleChange, handleSubmit } =
    formik;

  const EditData = async (formValues) => {
    try {
      setIsLoading(true);
      const response = await updateItem({
        path: `/invoice/edit/${props?.selectedId}`,
        method: "PUT",
        body: formValues,
      }).unwrap();
      console.log("Edit API Response:", response);

      if (response.status === 200) {
        props.onClose();
        props.setAction((prev) => !prev);
      }
    } catch (e) {
      console.error("Error updating invoice:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    props.onClose(false);
    if (props.setSelectedId) props.setSelectedId(null);
    formik.resetForm();
  };

  const fetchData = async () => {
    if (props?.selectedId) {
      try {
        setIsLoading(true);
        const response = await getApi("api/invoice/view/", props?.selectedId);
        const editData = response?.data?.invoice || response?.data;
        console.log("Fetched Data:", editData);

        const updatedValues = {
          developer_id:
            editData?.developer_id?._id || editData?.developer_id || "",
          claim_type: editData?.claim_type || "",
          unit_name: editData?.unit_name || "",
          unit_price: editData?.unit_price || "",
          commission: editData?.commission || "",
          bank_account_id:
            editData?.bank_account_id?._id || editData?.bank_account_id || "",
        };
        setInitialValues(updatedValues);
      } catch (e) {
        console.error("Error fetching invoice data:", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (props.isOpen && props.selectedId) {
      fetchData();
    }
  }, [props.isOpen, props.selectedId]);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleClose}
      size={props.size || "xl"}
    >
      <ModalOverlay />
      <ModalContent fontFamily="'DM Sans', sans-serif">
        <ModalHeader justifyContent="space-between" display="flex">
          Edit Invoice
          <IconButton onClick={handleClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          {isLoading || developersLoading || bankAccountsLoading ? (
            <Flex justifyContent="center" alignItems="center" width="100%">
              <Spinner />
            </Flex>
          ) : developersData && bankAccountsData ? (
            <form onSubmit={handleSubmit}>
              <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                <FormControl flex={1}>
                  <FormLabel>Developer</FormLabel>
                  <Select
                    placeholder="Choose Developer"
                    name="developer_id"
                    value={values.developer_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.developer_id && !!errors.developer_id}
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
                  <FormLabel>Claim Type</FormLabel>
                  <Select
                    placeholder="Choose Claim Type"
                    name="claim_type"
                    value={values.claim_type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.claim_type && !!errors.claim_type}
                  >
                    <option value="FULL">FULL</option>
                    <option value="PARTIAL">PARTIAL</option>
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
                  placeholder="Choose Bank Account"
                  name="bank_account_id"
                  value={values.bank_account_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={
                    touched.bank_account_id && !!errors.bank_account_id
                  }
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
          ) : (
            <Text>Error loading developers or bank accounts</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            sx={{ textTransform: "capitalize" }}
            variant="brand"
            size="sm"
            type="submit"
            disabled={isLoading || mutationLoading}
            onClick={handleSubmit}
          >
            {isLoading || mutationLoading ? <Spinner /> : "Update"}
          </Button>
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            sx={{ marginLeft: 2, textTransform: "capitalize" }}
            onClick={handleClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Edit;
