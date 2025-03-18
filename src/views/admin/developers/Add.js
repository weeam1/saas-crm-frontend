import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import { postApi } from "services/api";
import { useFetchItemsQuery, useCreateItemMutation } from "api/apiSlice";

const AddUser = (props) => {
  const { onClose, isOpen, setAction, fetchData } = props;
  const [isLoding, setIsLoding] = useState(false);
  const [roles, setRoles] = useState([]);
  const [createItemMutation, { isLoading: mutationLoading }] =
    useCreateItemMutation();
  const tree = useSelector((state) => state.user);

  const initialValues = {
    trn: "",
    developer_name: "",
    address: "",
    email: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm();
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;
  const AddData = async () => {
    try {
      setIsLoding(true);
      const formValues = { ...values };
      const response = await createItemMutation({
        path: "/developer/add",
        body: formValues,
      }).unwrap();

      if (response.status === "success") {
        fetchData();
        setAction((prev) => !prev);
        toast.success("Developer Added successfully!");
        resetForm();
        onClose();
      } else {
        toast.error(response?.message || "Failed to Add developer");
      }
    } catch (e) {
      console.error("Edit Error:", e);
      toast.error(e?.data?.message || "Something went wrong!");
    } finally {
      setIsLoding(false);
    }
  };

  const fetchRoles = async () => {
    let result = await getApi("api/role-access");
    setRoles(result.data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  console.log(tree);

  return (
    <Modal size="2xl" isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent w="550px" fontFamily="'DM Sans', sans-serif">
        <ModalHeader justifyContent="space-between" display="flex">
          Add Developer
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          <Grid templateColumns="1fr" gap={3}>
            <GridItem>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                TRN
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.trn}
                type="text"
                name="trn"
                placeholder="TRN"
                fontWeight="500"
                fontFamily="'DM Sans', sans-serif"
                borderColor={errors.trn && touched.trn ? "red.300" : null}
              />
              <Text mb="10px" color="red" fontSize="sm">
                {errors.trn && touched.trn && errors.trn}
              </Text>
            </GridItem>

            <GridItem>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Developer Name
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.developer_name}
                name="developer_name"
                placeholder="Developer Name"
                fontWeight="500"
                fontFamily="'DM Sans', sans-serif"
                borderColor={
                  errors.developer_name && touched.developer_name
                    ? "red.300"
                    : null
                }
              />
              <Text mb="10px" color="red" fontSize="sm">
                {errors.developer_name &&
                  touched.developer_name &&
                  errors.developer_name}
              </Text>
            </GridItem>

            <GridItem>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Email
              </FormLabel>
              <Input
                fontSize="sm"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                name="email"
                placeholder="Email Address"
                fontWeight="500"
                fontFamily="'DM Sans', sans-serif"
                borderColor={errors.email && touched.email ? "red.300" : null}
              />
              <Text mb="10px" color="red" fontSize="sm">
                {errors.email && touched.email && errors.email}
              </Text>
            </GridItem>

            <GridItem>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Address
              </FormLabel>
              <Input
                fontSize="sm"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                name="address"
                placeholder="Address"
                fontWeight="500"
                fontFamily="'DM Sans', sans-serif"
                borderColor={
                  errors.address && touched.address ? "red.300" : null
                }
              />
              <Text mb="10px" color="red" fontSize="sm">
                {errors.address && touched.address && errors.address}
              </Text>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter
          justifyContent="flex-end"
          pt={8} // Padding top for space from content
          pb={6} // Padding bottom for space from bottom edge
        >
          <Button
            bg="#CCCACA"
            color="black"
            size="sm"
            borderRadius="5px"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            _hover={{ bg: "#B5B3B3" }}
            fontFamily="'DM Sans', sans-serif"
            minWidth="100px"
            mr={3} // Margin right to separate buttons
          >
            Cancel
          </Button>
          <Button
            bg="#B79045"
            color="white"
            size="sm"
            borderRadius="5px"
            disabled={isLoding}
            onClick={AddData}
            _hover={{ bg: "#A77F3A" }}
            fontFamily="'DM Sans', sans-serif"
            minWidth="100px"
          >
            {isLoding ? <Spinner /> : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUser;
