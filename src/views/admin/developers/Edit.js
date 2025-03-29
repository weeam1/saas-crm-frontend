import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Box,
  Text,
  Select,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { developerSchema } from "schema/developerSchema";
import { useUpdateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { useDispatch } from "react-redux";
import { apiSlice } from "api/apiSlice";

const Edit = (props) => {
  const {
    onClose,
    isOpen,
    fetchData,
    data,
    setEdit,
    selectedId,
    setAction,
    pageIndex,
    pageSize: pageSizeProp,
  } = props;

  const dispatch = useDispatch();
  const pageSize = pageSizeProp && pageSizeProp > 0 ? pageSizeProp : 10;

  const {
    data: agenciesResponse,
    isLoading: isAgenciesLoading,
    isError: isAgenciesError,
  } = useFetchItemsQuery({ path: "/agencies" });
  const agencies = agenciesResponse?.doc || [];

  const initialValues = {
    developer_name: data?.developer_name || "",
    address: data?.address || "",
    trn: data?.trn || "",
    email: data?.email || "",
    country: data?.country || "",
    agency: data?.agency || "",
  };

  const [updateItemMutation, { isLoading: mutationLoading }] =
    useUpdateItemMutation();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: developerSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      EditData(values);
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    dirty,
  } = formik;

  const EditData = async (formValues) => {
    try {
      setIsLoading(true);
      const response = await updateItemMutation({
        path: `/developer/edit/${selectedId}`,
        body: formValues,
      }).unwrap();
      if (response.status === "success") {
        setEdit(false);
        fetchData({ pageIndex, pageSize });
        dispatch(apiSlice.util.invalidateTags(["Developers"]));
        setAction((prev) => !prev);
        toast.success("Developer updated successfully!");
        resetForm();
        onClose();
      } else {
        toast.error(response?.message || "Failed to update developer");
      }
    } catch (e) {
      console.error("Edit Error:", e);
      toast.error(e?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setEdit(false);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="rgba(0, 0, 0, 0.4)"
      zIndex={14000}
      alignItems="center"
      justifyContent="center"
    >
      <Box
        boxShadow="lg"
        borderRadius="lg"
        p={4}
        bg="white"
        maxW={{ base: "90%", md: "500px" }}
        w="100%"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="500"
        onClick={(e) => e.stopPropagation()}
      >
        <Flex justifyContent="space-between" alignItems="center" pb={2}>
          <Text fontSize="20px" fontWeight="500">
            Edit Developer
          </Text>
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            onClick={handleCloseModal}
            aria-label="Close"
          />
        </Flex>

        <Box pt={4}>
          <form onSubmit={handleSubmit}>
            <Grid gap={4} templateColumns="1fr">
              <GridItem>
                <FormLabel fontSize="14px" color="gray.600">
                  Developer Name
                </FormLabel>
                <Input
                  fontSize="14px"
                  placeholder="Enter Name"
                  value={values.developer_name}
                  name="developer_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  bg="#F2F2F2"
                  border="none"
                  borderRadius="md"
                  _focus={{ borderColor: "gray.300", boxShadow: "none" }}
                  _hover={{ bg: "#E6E6E6" }}
                  borderColor={
                    errors.developer_name && touched.developer_name
                      ? "red.300"
                      : null
                  }
                />
                {errors.developer_name && touched.developer_name && (
                  <Text color="red" fontSize="12px" mt={1}>
                    {errors.developer_name}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel fontSize="14px" color="gray.600">
                  Address
                </FormLabel>
                <Input
                  fontSize="14px"
                  placeholder="Enter Address"
                  value={values.address}
                  name="address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  bg="#F2F2F2"
                  border="none"
                  borderRadius="md"
                  _focus={{ borderColor: "gray.300", boxShadow: "none" }}
                  _hover={{ bg: "#E6E6E6" }}
                  borderColor={
                    errors.address && touched.address ? "red.300" : null
                  }
                />
                {errors.address && touched.address && (
                  <Text color="red" fontSize="12px" mt={1}>
                    {errors.address}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel fontSize="14px" color="gray.600">
                  TRN
                </FormLabel>
                <Input
                  fontSize="14px"
                  placeholder="Enter TRN"
                  value={values.trn}
                  name="trn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  bg="#F2F2F2"
                  border="none"
                  borderRadius="md"
                  _focus={{ borderColor: "gray.300", boxShadow: "none" }}
                  _hover={{ bg: "#E6E6E6" }}
                  borderColor={errors.trn && touched.trn ? "red.300" : null}
                />
                {errors.trn && touched.trn && (
                  <Text color="red" fontSize="12px" mt={1}>
                    {errors.trn}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel fontSize="14px" color="gray.600">
                  Email Id
                </FormLabel>
                <Input
                  fontSize="14px"
                  type="email"
                  placeholder="Enter Email Id"
                  value={values.email}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  bg="#F2F2F2"
                  border="none"
                  borderRadius="md"
                  _focus={{ borderColor: "gray.300", boxShadow: "none" }}
                  _hover={{ bg: "#E6E6E6" }}
                  borderColor={errors.email && touched.email ? "red.300" : null}
                />
                {errors.email && touched.email && (
                  <Text color="red" fontSize="12px" mt={1}>
                    {errors.email}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel fontSize="14px" color="gray.600">
                  Country
                </FormLabel>
                <Input
                  fontSize="14px"
                  placeholder="Enter Country"
                  value={values.country}
                  name="country"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  bg="#F2F2F2"
                  border="none"
                  borderRadius="md"
                  _focus={{ borderColor: "gray.300", boxShadow: "none" }}
                  _hover={{ bg: "#E6E6E6" }}
                  borderColor={
                    errors.country && touched.country ? "red.300" : null
                  }
                />
                {errors.country && touched.country && (
                  <Text color="red" fontSize="12px" mt={1}>
                    {errors.country}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel fontSize="14px" color="gray.600">
                  Agency
                </FormLabel>
                <Select
                  fontSize="14px"
                  placeholder="Select Agency"
                  value={values.agency}
                  name="agency"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  bg="#F2F2F2"
                  border="none"
                  borderRadius="md"
                  _focus={{ borderColor: "gray.300", boxShadow: "none" }}
                  _hover={{ bg: "#E6E6E6" }}
                  borderColor={
                    errors.agency && touched.agency ? "red.300" : null
                  }
                  isDisabled={isAgenciesLoading || isAgenciesError}
                >
                  {agencies.map((agency) => (
                    <option key={agency._id} value={agency._id}>
                      {agency.name} {/* Adjust based on your agency schema */}
                    </option>
                  ))}
                </Select>
                {isAgenciesLoading && (
                  <Text fontSize="12px">Loading agencies...</Text>
                )}
                {isAgenciesError && (
                  <Text color="red" fontSize="12px" mt={1}>
                    Failed to load agencies
                  </Text>
                )}
                {errors.agency && touched.agency && (
                  <Text color="red" fontSize="12px" mt={1}>
                    {errors.agency}
                  </Text>
                )}
              </GridItem>
            </Grid>

            <Flex mt={6} justifyContent="flex-end" pb={4} gap={3}>
              <Button
                variant="outline"
                size="sm"
                h="40px"
                onClick={handleCloseModal}
                borderRadius="md"
                bg="#CCCACA"
                color="black"
                _hover={{ bg: "#B8B0B0" }}
                fontSize="14px"
                minWidth="90px"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="solid"
                bg="#B79045"
                color="white"
                _hover={{ bg: "#A07723" }}
                isLoading={isLoading || mutationLoading}
                disabled={isLoading || mutationLoading || !dirty}
                borderRadius="md"
                fontSize="14px"
                h="40px"
                minWidth="90px"
              >
                {isLoading || mutationLoading ? <Spinner size="sm" /> : "Save"}
              </Button>
            </Flex>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Edit;
