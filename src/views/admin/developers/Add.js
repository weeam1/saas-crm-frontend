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
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { getApi } from "services/api";
import { useCreateItemMutation } from "api/apiSlice";

const userSchema = Yup.object().shape({
  trn: Yup.string().required("TRN is required"),
  developer_name: Yup.string().required("Developer Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
});

const AddUser = (props) => {
  const { onClose, isOpen, setAction, fetchData, pageIndex, pageSize } = props;
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
      AddData(values, resetForm);
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldError,
    isValid,
    dirty,
    resetForm,
  } = formik;

  const AddData = async (values, resetForm) => {
    try {
      setIsLoding(true);
      const formValues = { ...values };
      const response = await createItemMutation({
        path: "/developer/add",
        body: formValues,
      }).unwrap();

      if (response.status === "success") {
        fetchData({ pageIndex, pageSize });
        setAction((prev) => !prev);
        toast.success("Developer Added successfully!");
        resetForm();
        onClose();
      } else {
        console.log("Server Response (else):", response);
        if (response?.message) {
          const errorMsg = response.message.toLowerCase();
          if (errorMsg.includes("trn")) {
            setFieldError("trn", "Developer with this TRN already exists");
          } else if (errorMsg.includes("email")) {
            setFieldError("email", "Developer with this email already exists");
          } else {
            toast.error(response.message); 
          }
        } else if (response?.errors) {
          Object.keys(response.errors).forEach((field) => {
            setFieldError(field, response.errors[field]);
          });
        } else {
          toast.error("Failed to add developer");
        }
      }
    } catch (e) {
      console.error("Add Error:", e);
      console.log("Server Response (catch):", e.data);
      if (e?.data) {
        const errorData = e.data;
        if (errorData.message) {
          const errorMsg = errorData.message.toLowerCase();
          if (errorMsg.includes("trn")) {
            setFieldError("trn", "Developer with this TRN already exists");
          } else if (errorMsg.includes("email")) {
            setFieldError("email", "Developer with this email already exists");
          } else {
            toast.error(errorData.message); 
          }
        } else if (errorData.errors) {
          Object.keys(errorData.errors).forEach((field) => {
            setFieldError(field, errorData.errors[field]);
          });
        } else {
          toast.error("Something went wrong!");
        }
      } else {
        toast.error("Something went wrong!");
      }
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
        <form onSubmit={handleSubmit}>
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
                  borderColor={
                    errors.trn && (touched.trn || dirty) ? "red.300" : null
                  }
                />
                <Text mb="10px" color="red" fontSize="sm">
                  {(touched.trn || dirty) && errors.trn ? errors.trn : null}
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
                    errors.developer_name && (touched.developer_name || dirty)
                      ? "red.300"
                      : null
                  }
                />
                <Text mb="10px" color="red" fontSize="sm">
                  {(touched.developer_name || dirty) && errors.developer_name
                    ? errors.developer_name
                    : null}
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
                  borderColor={
                    errors.email && (touched.email || dirty) ? "red.300" : null
                  }
                />
                <Text mb="10px" color="red" fontSize="sm">
                  {(touched.email || dirty) && errors.email
                    ? errors.email
                    : null}
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
                    errors.address && (touched.address || dirty)
                      ? "red.300"
                      : null
                  }
                />
                <Text mb="10px" color="red" fontSize="sm">
                  {(touched.address || dirty) && errors.address
                    ? errors.address
                    : null}
                </Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="flex-end" pt={8} pb={6}>
            <Button
              bg="#CCCACA"
              color="black"
              size="sm"
              borderRadius="5px"
              onClick={() => {
                resetForm();
                onClose();
              }}
              _hover={{ bg: "#B5B3B3" }}
              fontFamily="'DM Sans', sans-serif"
              minWidth="100px"
              mr={3}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg="#B79045"
              color="white"
              size="sm"
              borderRadius="5px"
              disabled={isLoding || !isValid || !dirty}
              _hover={{ bg: "#A77F3A" }}
              fontFamily="'DM Sans', sans-serif"
              minWidth="100px"
            >
              {isLoding ? <Spinner /> : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddUser;
