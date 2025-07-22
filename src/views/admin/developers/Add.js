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
  Flex,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useCreateItemMutation } from "api/apiSlice";

const userSchema = Yup.object().shape({
  trn: Yup.string().required("TRN is required"),
  developer_name: Yup.string().required("Developer Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  address: Yup.string().required("Address is required"),
  country: Yup.string().required("Country is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
});

const AddUser = (props) => {
  const {
    onClose,
    isOpen,
    setAction,
    fetchData,
    pageIndex,
    pageSize,
    refetch,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [createItemMutation, { isLoading: mutationLoading }] =
    useCreateItemMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles[0]);
    },
  });
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role =
    user?.role === "superAdmin" ? "superAdmin" : user?.roles?.[0]?.roleName;

  // const {
  // 	data: agenciesResponse,
  // 	isLoading: isAgenciesLoading,
  // 	isError: isAgenciesError,
  // } = useFetchItemsQuery({ path: '/agencies' });

  // const agencies = agenciesResponse?.doc || [];
  const initialValues = {
    trn: "",
    developer_name: "",
    address: "",
    email: "",
    country: "",
    phoneNumber: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: userSchema,
    onSubmit: (values) => {
      AddData(values);
    },
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
    setFieldError,
    isValid,
    dirty,
    resetForm,
  } = formik;

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const AddData = async (values) => {
    const formData = new FormData();

    // Append all form values
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // Append the image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
			// if (role === 'superAdmin' && !values.agency) {
			// 	setFieldError('agency', 'Agency is required');
			// 	return;
			// }
      setIsLoading(true);
      const response = await createItemMutation({
        path: "/developer/add",
        body: formData,
      }).unwrap();

      if (response.status === "success") {
        toast({
          title: "Developer added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchData({ pageIndex, pageSize });
        setAction((prev) => !prev);
        resetForm();
        setSelectedFile(null);
        setPreviewImage(null);
        onClose();
      } else {
        if (response?.message) {
          const errorMsg = response.message.toLowerCase();
          // if (errorMsg.includes('trn')) {
          // 	setFieldError('trn', 'Developer with this TRN already exists');
          // } else if (errorMsg.includes('email')) {
          // 	setFieldError('email', 'Developer with this email already exists');
          // } else {
          toast({
            title: "Error adding developer",
            description: response.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    } catch (e) {
     if (e?.data?.message) {
				const errorMsg = e.data.message.toLowerCase();
				// if (errorMsg.includes('trn')) {
				// 	setFieldError('trn', 'Developer with this TRN already exists');
				// } else if (errorMsg.includes('email')) {
				// 	setFieldError('email', 'Developer with this email already exists');
				// } else {
				toast.error(e.data.message);
				// }
			} else {
				toast.error('Something went wrong!');
			}
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = () => {
    return (
      values.trn.trim() !== "" &&
      values.developer_name.trim() !== "" &&
      values.email.trim() !== "" &&
      values.address.trim() !== "" &&
      values.country.trim() !== "" &&
      values.phoneNumber.trim() !== "" &&
      isValid
    );
  };

  const brandColors = {
    50: "#fdf4e9",
    100: "#f9e5c8",
    200: "#f5d6a7",
    300: "#f1c786",
    400: "#edb865",
    500: "#e9a944",
    600: "#c78b38",
    700: "#a56d2c",
    800: "#834f20",
    900: "#613114",
  };

  const bgColor = useColorModeValue(brandColors[50], brandColors[800]);
  const borderColor = useColorModeValue(brandColors[200], brandColors[600]);

  return (
    <Modal
      size="3xl"
      isOpen={isOpen}
      onClose={onClose}
      borderRadius="xl"
      isCentered
	  scrollBehavior="outside" 
	  overflow="hide"
    >
      <ModalOverlay />
      <ModalContent
        fontFamily="'DM Sans', sans-serif"
        borderRadius="xl"
      >
        <ModalHeader
          justifyContent="space-between"
          display="flex"
          bg={brandColors[200]}
          color={brandColors[800]}
          borderTopRadius="xl"
        >
          Add Developer
          <IconButton
            onClick={onClose}
            icon={<CloseIcon />}
            variant="ghost"
            color={brandColors[800]}
            _hover={{ bg: brandColors[600], color: "white" }}
          />
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody
            borderRadius={"md"}
			spacing={4} overflow="scroll" height="65vh"
          >
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={4}
              p={4}
            >
              {/* Image Upload */}
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                  Developer Image
                </FormLabel>
                <Flex
                  {...getRootProps()}
                  direction="column"
                  align="center"
                  justify="center"
                  p={6}
                  border="2px dashed"
                  borderColor={isDragActive ? brandColors[500] : borderColor}
                  borderRadius="md"
                  cursor="pointer"
                  bg={useColorModeValue("white", brandColors[700])}
                  _hover={{ borderColor: brandColors[500] }}
                  onClick={handleFileInputClick}
                >
                  <input {...getInputProps()} ref={fileInputRef} />
                  {previewImage ? (
                    <>
                      <Avatar size="xl" src={previewImage} mb={2} />
                      <Button
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                        mt={2}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        Remove Image
                      </Button>
                    </>
                  ) : (
                    <Center flexDirection="column">
                      <Text color={brandColors[500]} mb={2}>
                        {isDragActive
                          ? "Drop the image here"
                          : "Drag & drop image here, or click to select"}
                      </Text>
                      <Button size="sm" colorScheme="brand" variant="outline">
                        Select Image
                      </Button>
                    </Center>
                  )}
                </Flex>
              </GridItem>

              {/* TRN */}
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                  TRN
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.trn}
                  name="trn"
                  placeholder="TRN"
                  fontWeight="500"
                  borderColor={
                    errors.trn && touched.trn ? "red.300" : borderColor
                  }
                  focusBorderColor={brandColors[500]}
                />
                {errors.trn && touched.trn && (
                  <Text mb="10px" color="red" fontSize="sm">
                    {errors.trn}
                  </Text>
                )}
              </GridItem>

              {/* Developer Name */}
              <GridItem>
                <FormLabel fontSize="sm" fontWeight="500" mb="8px">
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
                  borderColor={
                    errors.developer_name && touched.developer_name
                      ? "red.300"
                      : borderColor
                  }
                  focusBorderColor={brandColors[500]}
                />
                {errors.developer_name && touched.developer_name && (
                  <Text mb="10px" color="red" fontSize="sm">
                    {errors.developer_name}
                  </Text>
                )}
              </GridItem>

              {/* Phone Number */}
              <GridItem>
                <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                  Phone Number
                </FormLabel>
                <Input
                  fontSize="sm"
                  type="tel"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phoneNumber}
                  name="phoneNumber"
                  placeholder="Phone Number"
                  fontWeight="500"
                  borderColor={
                    errors.phoneNumber && touched.phoneNumber
                      ? "red.300"
                      : borderColor
                  }
                  focusBorderColor={brandColors[500]}
                />
                {errors.phoneNumber && touched.phoneNumber && (
                  <Text mb="10px" color="red" fontSize="sm">
                    {errors.phoneNumber}
                  </Text>
                )}
              </GridItem>

              {/* Email */}
              <GridItem>
                <FormLabel fontSize="sm" fontWeight="500" mb="8px">
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
                  borderColor={
                    errors.email && touched.email ? "red.300" : borderColor
                  }
                  focusBorderColor={brandColors[500]}
                />
                {errors.email && touched.email && (
                  <Text mb="10px" color="red" fontSize="sm">
                    {errors.email}
                  </Text>
                )}
              </GridItem>

              {/* Country */}
              <GridItem>
                <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                  Country
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.country}
                  name="country"
                  placeholder="Country"
                  fontWeight="500"
                  borderColor={
                    errors.country && touched.country ? "red.300" : borderColor
                  }
                  focusBorderColor={brandColors[500]}
                />
                {errors.country && touched.country && (
                  <Text mb="10px" color="red" fontSize="sm">
                    {errors.country}
                  </Text>
                )}
              </GridItem>

              {/* Address */}
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormLabel fontSize="sm" fontWeight="500" mb="8px">
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
                  borderColor={
                    errors.address && touched.address ? "red.300" : borderColor
                  }
                  focusBorderColor={brandColors[500]}
                />
                {errors.address && touched.address && (
                  <Text mb="10px" color="red" fontSize="sm">
                    {errors.address}
                  </Text>
                )}
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter justifyContent="flex-end" pt={8} pb={6} bg={bgColor}>
            <Button
              bg={brandColors[400]}
              color="white"
              size="sm"
              borderRadius="5px"
              onClick={() => {
                resetForm();
                removeImage();
                onClose();
              }}
              _hover={{ bg: brandColors[500] }}
              fontFamily="'DM Sans', sans-serif"
              minWidth="100px"
              mr={3}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg={brandColors[600]}
              color="white"
              size="sm"
              borderRadius="5px"
              disabled={isLoading || mutationLoading || !isFormComplete()}
              _hover={{ bg: brandColors[700] }}
              fontFamily="'DM Sans', sans-serif"
              minWidth="100px"
            >
              {isLoading || mutationLoading ? <Spinner /> : "Save"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddUser;
