import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { developerSchema } from "schema/developerSchema";
import { useUpdateItemMutation } from "api/apiSlice";

// Ensure "DM Sans" is imported
// @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&display=swap');

const Edit = (props) => {
  const { onClose, isOpen, fetchData, data, setEdit, selectedId, setAction } =
    props;

  const initialValues = {
    developer_name: data?.developer_name || "",
    address: data?.address || "",
    trn: data?.trn || "",
    email: data?.email || "",
  };

  const [updateItemMutation, { isLoading: mutationLoading }] =
    useUpdateItemMutation();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
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
  } = formik;

  const EditData = async (formValues) => {
    try {
      setIsLoading(true);
      const response = await updateItemMutation({
        path: `/developer/edit/${selectedId}`,
        body: formValues,
      }).unwrap();

      console.log("Update Response:", response);

      if (response.status === "success") {
        setEdit(false);
        fetchData();
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

  return (
    <Modal isOpen={isOpen} isCentered onClose={handleCloseModal} size="xl">
      <ModalOverlay />
      <ModalContent
        boxShadow="lg"
        borderRadius="md"
        p={4}
        bg="white"
        maxW={{ base: "90%", md: "550px" }}
        fontFamily="'DM Sans', sans-serif"
        fontWeight="500"
      >
        <ModalHeader
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pb={2}
          fontSize="24px"
          fontFamily="'DM Sans', sans-serif"
          fontWeight="500"
        >
          Edit Developer
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            onClick={handleCloseModal}
            aria-label="Close"
          />
        </ModalHeader>
        <ModalBody pt={4}>
          <form onSubmit={handleSubmit}>
            <Grid gap={4} templateColumns="1fr">
              <GridItem>
                <FormLabel
                  fontSize="16px"
                  color="gray.600"
                  mb={1}
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                >
                  Developer Name
                </FormLabel>
                <Input
                  fontSize="16px"
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
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                />
                {errors.developer_name && touched.developer_name && (
                  <Text
                    color="red"
                    fontSize="14px"
                    mt={1}
                    fontFamily="'DM Sans', sans-serif"
                    fontWeight="500"
                    textAlign="left"
                  >
                    {errors.developer_name}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel
                  fontSize="16px"
                  color="gray.600"
                  mb={1}
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                >
                  Address
                </FormLabel>
                <Input
                  fontSize="16px"
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
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                />
                {errors.address && touched.address && (
                  <Text
                    color="red"
                    fontSize="14px"
                    mt={1}
                    fontFamily="'DM Sans', sans-serif"
                    fontWeight="500"
                    textAlign="left"
                  >
                    {errors.address}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel
                  fontSize="16px"
                  color="gray.600"
                  mb={1}
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                >
                  TRN
                </FormLabel>
                <Input
                  fontSize="16px"
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
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                />
                {errors.trn && touched.trn && (
                  <Text
                    color="red"
                    fontSize="14px"
                    mt={1}
                    fontFamily="'DM Sans', sans-serif"
                    fontWeight="500"
                    textAlign="left"
                  >
                    {errors.trn}
                  </Text>
                )}
              </GridItem>
              <GridItem>
                <FormLabel
                  fontSize="16px"
                  color="gray.600"
                  mb={1}
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                >
                  E mail Id
                </FormLabel>
                <Input
                  fontSize="16px"
                  type="email"
                  placeholder="Enter E mail Id"
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
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="500"
                  textAlign="left"
                />
                {errors.email && touched.email && (
                  <Text
                    color="red"
                    fontSize="14px"
                    mt={1}
                    fontFamily="'DM Sans', sans-serif"
                    fontWeight="500"
                    textAlign="left"
                  >
                    {errors.email}
                  </Text>
                )}
              </GridItem>
            </Grid>
            <ModalFooter
              mt={6}
              justifyContent="flex-end"
              pb={4} // Added padding-bottom for space from the bottom
            >
              <Button
                variant="outline"
                size="sm"
                mr={3}
                onClick={handleCloseModal}
                borderRadius="md"
                bg="#CCCACA"
                color="black"
                _hover={{ bg: "#B8B0B0" }}
                fontSize="16px"
                fontFamily="'DM Sans', sans-serif"
                fontWeight="500"
                minWidth="100px" // Increased button width
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
                disabled={isLoading || mutationLoading}
                borderRadius="md"
                fontSize="16px"
                fontFamily="'DM Sans', sans-serif"
                fontWeight="500"
                minWidth="100px" // Increased button width
              >
                {isLoading || mutationLoading ? <Spinner size="sm" /> : "Save"}
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Edit;
