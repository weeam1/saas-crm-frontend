import { CloseIcon, AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  Select,
  Text,
  Flex,
  useColorModeValue,
  Avatar,
  Center,
  Box,
  Stack,
  useDisclosure,
  FormControl,
  Badge,
  ModalCloseButton,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { developerSchema } from "schema/developerSchema";
import { useUpdateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { useDispatch } from "react-redux";
import { apiSlice } from "api/apiSlice";
import * as Yup from "yup";
import { useUserActivityLog } from "hooks/useUserActivityLog";
import { useModalColors } from "hooks/useModalColors";

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email format").optional(),
});

const Edit = (props) => {
  const {
    onClose,
    isOpen,
    fetchData,
    data,
    setAction,
    selectedId,
    pageIndex,
    pageSize,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [updateItemMutation, { isLoading: mutationLoading }] =
    useUpdateItemMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(data?.imageUrl || null);
  const fileInputRef = useRef(null);
  const [contacts, setContacts] = useState(data?.contactDetails || []);
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  const dispatch = useDispatch();

  const {
    bg,
    headerBg,
    primaryBtnBg,
    secondaryBtnBg,
    headerText,
    closeBtnColor,
    footerBg,
    borderColor,
  } = useModalColors();

  const {
    isOpen: isContactModalOpen,
    onOpen: onContactModalOpen,
    onClose: onContactModalClose,
  } = useDisclosure();

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

  const { createUserLog } = useUserActivityLog();

  const {
    data: agenciesResponse,
    isLoading: isAgenciesLoading,
    isError: isAgenciesError,
  } = useFetchItemsQuery({ path: "/agencies" });

  const agencies = agenciesResponse?.doc || [];

  const initialValues = {
    trn: data?.trn || "",
    developer_name: data?.developer_name || "",
    address: data?.address || "",
    email: data?.email || "",
    country: data?.country || "",
    phoneNumber: data?.phoneNumber || "",
    agency: data?.agency?._id || "",
  };

  const contactFormik = useFormik({
    initialValues: {
      name: "",
      role: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema: contactSchema,
    onSubmit: (values, { resetForm }) => {
      if (!values.name || !values.role || !values.phoneNumber) {
        toast.error("Validation Error");
        return;
      }

      if (editingContactIndex !== null) {
        // Update existing contact
        const updatedContacts = [...contacts];
        updatedContacts[editingContactIndex] = values;
        setContacts(updatedContacts);
      } else {
        // Add new contact
        setContacts([...contacts, values]);
      }
      resetForm();
      setEditingContactIndex(null);
      onContactModalClose();
    },
  });

  const formik = useFormik({
    initialValues,
    validationSchema: developerSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateData(values);
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

  const handleAddContact = () => {
    contactFormik.resetForm();
    setEditingContactIndex(null);
    onContactModalOpen();
  };

  const handleEditContact = (index) => {
    contactFormik.setValues(contacts[index]);
    setEditingContactIndex(index);
    onContactModalOpen();
  };

  const handleRemoveContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

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

  const updateData = async (values) => {
    // Validate all contacts have required fields
    const hasInvalidContacts = contacts.some(
      (contact) => !contact.name || !contact.role || !contact.phoneNumber
    );

    if (hasInvalidContacts) {
      toast.error("Validation Error");
      return;
    }

    const formData = new FormData();

    // Append all form values
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // Append contacts as JSON string only if all are valid
    if (contacts.length > 0) {
      formData.append("contactDetails", JSON.stringify(contacts));
    }

    // Append the image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      setIsLoading(true);
      const response = await updateItemMutation({
        path: `/developer/edit/${selectedId}`,
        body: formData,
      }).unwrap();
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Developer",
        entityType: "Developer",
        entityId: response.data._id,
        status: "success",
        message: `"${user?.fullName}" updated developer "${response?.data?.developer_name || "Untitled"}".`,
      });
      if (response.status === "success") {
        toast.success("Developer updated successfully");
        fetchData({ pageIndex, pageSize });
        dispatch(apiSlice.util.invalidateTags(["Developers"]));
        setAction((prev) => !prev);
        resetForm();
        setSelectedFile(null);
        setPreviewImage(null);
        onClose();
      } else {
        if (response?.message) {
          const errorMsg = response.message.toLowerCase();
          if (errorMsg.includes("trn")) {
            setFieldError("trn", "Developer with this TRN already exists");
          } else if (errorMsg.includes("email")) {
            setFieldError("email", "Developer with this email already exists");
          } else {
            toast.error("Error updating developer");
          }
        }
      }
    } catch (e) {
      const errorMsg =
        e?.data?.message || "Failed to update the developer. Please try again.";
      console.error("Update Error:", e);
      toast.error("Error updating developer");
      createUserLog({
        userId: user?._id,
        action: "UPDATE",
        entity: "Developer",
        entityType: "Developer",
        entityId: selectedId || null,
        status: e?.status === "500" ? "error" : "fail",
        message: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = () => {
    const hasValidContacts = contacts.every(
      (contact) => contact.name && contact.role && contact.phoneNumber
    );

    return (
      values.trn.trim() !== "" &&
      values.developer_name.trim() !== "" &&
      values.email.trim() !== "" &&
      values.address.trim() !== "" &&
      values.country.trim() !== "" &&
      values.phoneNumber.trim() !== "" &&
      isValid &&
      (contacts.length === 0 || hasValidContacts)
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
  const textColor = useColorModeValue(brandColors[800], "white");

  return (
    <>
      <Modal
        size="3xl"
        isOpen={isOpen}
        onClose={() => {
          resetForm();
          removeImage();
          setContacts(data?.contactDetails || []);
          onClose();
        }}
        borderRadius="xl"
        isCentered
        scrollBehavior="outside"
        overflow="hide"
      >
        <ModalOverlay />
        <ModalContent borderRadius="2xl" shadow="xl" overflow="hidden">
          <ModalHeader
            justifyContent="space-between"
            display="flex"
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
          >
            Edit Developer
            <ModalCloseButton
              onClick={() => {
                resetForm();
                removeImage();
                setContacts(data?.contactDetails || []);
                onClose();
              }}
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <ModalBody
              borderRadius="md"
              spacing={4}
              overflow="scroll"
              height="65vh"
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
                        <Button size="sm" variant="outline">
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
                      errors.country && touched.country
                        ? "red.300"
                        : borderColor
                    }
                    focusBorderColor={brandColors[500]}
                  />
                  {errors.country && touched.country && (
                    <Text mb="10px" color="red" fontSize="sm">
                      {errors.country}
                    </Text>
                  )}
                </GridItem>

                {/* Agency (for superAdmin only) */}
                {role === "superAdmin" && (
                  <GridItem>
                    <FormLabel fontSize="sm" fontWeight="500" mb="8px">
                      Agency
                    </FormLabel>
                    <Select
                      placeholder="Select Agency"
                      value={values.agency}
                      name="agency"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      borderColor={
                        errors.agency && touched.agency
                          ? "red.300"
                          : borderColor
                      }
                      focusBorderColor={brandColors[500]}
                      isDisabled={isAgenciesLoading || isAgenciesError}
                    >
                      {agencies.map((agency) => (
                        <option key={agency._id} value={agency._id}>
                          {agency.name}
                        </option>
                      ))}
                    </Select>
                    {isAgenciesLoading && (
                      <Text fontSize="sm" mt={1}>
                        Loading agencies...
                      </Text>
                    )}
                    {isAgenciesError && (
                      <Text color="red" fontSize="sm" mt={1}>
                        Failed to load agencies
                      </Text>
                    )}
                    {errors.agency && touched.agency && (
                      <Text mb="10px" color="red" fontSize="sm">
                        {errors.agency}
                      </Text>
                    )}
                  </GridItem>
                )}

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
                      errors.address && touched.address
                        ? "red.300"
                        : borderColor
                    }
                    focusBorderColor={brandColors[500]}
                  />
                  {errors.address && touched.address && (
                    <Text mb="10px" color="red" fontSize="sm">
                      {errors.address}
                    </Text>
                  )}
                </GridItem>

                {/* Contact Details Section */}
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <Flex justify="space-between" align="center" mb={4}>
                    <FormLabel fontSize="sm" fontWeight="500" mb="0">
                      Contact Details
                    </FormLabel>
                    <Button
                      leftIcon={<AddIcon />}
                      size="sm"
                      variant="outline"
                      onClick={handleAddContact}
                      borderRadius={"md"}
                    >
                      Add Contact
                    </Button>
                  </Flex>

                  {contacts.length === 0 ? (
                    <Box
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={borderColor}
                      textAlign="center"
                    >
                      <Text color="gray.500">No contacts added yet</Text>
                    </Box>
                  ) : (
                    <Stack spacing={3}>
                      {contacts.map((contact, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          borderColor={borderColor}
                          bg={brandColors[200]}
                        >
                          <Flex justify="space-between" align="center">
                            <Box>
                              <Flex align="center" mb={1}>
                                <Text fontWeight="bold" mr={2}>
                                  {contact.name}
                                </Text>
                                <Badge colorScheme="brand" variant="subtle">
                                  {contact.role}
                                </Badge>
                              </Flex>
                              <Text fontSize="sm">{contact.phoneNumber}</Text>
                              {contact.email && (
                                <Text fontSize="sm" color={textColor}>
                                  {contact.email}
                                </Text>
                              )}
                            </Box>
                            <Flex>
                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                aria-label="Edit contact"
                                variant="ghost"
                                colorScheme="brand"
                                onClick={() => handleEditContact(index)}
                                mr={1}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                aria-label="Delete contact"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleRemoveContact(index)}
                              />
                            </Flex>
                          </Flex>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter
              bg={footerBg}
              borderTop="1px solid"
              borderColor={borderColor}
              py={3}
              px={5}
              justifyContent="flex-end"
              gap={3}
            >
              {/* <Button
                colorScheme="outline"
                size="sm"
                borderRadius="md"
                onClick={() => {
                  resetForm();
                  removeImage();
                  setContacts(data?.contactDetails || []);
                  onClose();
                }}
                minWidth="100px"
                mr={3}
              >
                Cancel
              </Button> */}
              <Button
                onClick={() => {
                  resetForm();
                  removeImage();
                  setContacts(data?.contactDetails || []);
                  onClose();
                }}
                variant="outline"
                size="sm"
                borderRadius={"md"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                size="sm"
                borderRadius="md"
                disabled={isLoading || mutationLoading || !isFormComplete()}
                _hover={{ bg: brandColors[700] }}
                minWidth="100px"
              >
                {isLoading || mutationLoading ? <Spinner /> : "Update"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Contact Form Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => {
          contactFormik.resetForm();
          setEditingContactIndex(null);
          onContactModalClose();
        }}
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalHeader
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {editingContactIndex !== null ? "Edit Contact" : "Add Contact"}
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </ModalHeader>
          <ModalBody p={6}>
            <form onSubmit={contactFormik.handleSubmit}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500">
                    Name
                  </FormLabel>
                  <Input
                    name="name"
                    value={contactFormik.values.name}
                    onChange={contactFormik.handleChange}
                    onBlur={contactFormik.handleBlur}
                    isInvalid={
                      contactFormik.touched.name && contactFormik.errors.name
                    }
                    placeholder="Enter Name"
                    focusBorderColor={brandColors[500]}
                    borderColor={borderColor}
                  />
                  {contactFormik.touched.name && contactFormik.errors.name && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {contactFormik.errors.name}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500">
                    Role
                  </FormLabel>
                  <Input
                    name="role"
                    value={contactFormik.values.role}
                    onChange={contactFormik.handleChange}
                    onBlur={contactFormik.handleBlur}
                    isInvalid={
                      contactFormik.touched.role && contactFormik.errors.role
                    }
                    placeholder="Enter Role"
                    focusBorderColor={brandColors[500]}
                    borderColor={borderColor}
                  />
                  {contactFormik.touched.role && contactFormik.errors.role && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {contactFormik.errors.role}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500">
                    Phone Number
                  </FormLabel>
                  <Input
                    name="phoneNumber"
                    value={contactFormik.values.phoneNumber}
                    onChange={contactFormik.handleChange}
                    onBlur={contactFormik.handleBlur}
                    placeholder="Enter Phone Number"
                    isInvalid={
                      contactFormik.touched.phoneNumber &&
                      contactFormik.errors.phoneNumber
                    }
                    focusBorderColor={brandColors[500]}
                    borderColor={borderColor}
                  />
                  {contactFormik.touched.phoneNumber &&
                    contactFormik.errors.phoneNumber && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {contactFormik.errors.phoneNumber}
                      </Text>
                    )}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500">
                    Email (Optional)
                  </FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={contactFormik.values.email}
                    onChange={contactFormik.handleChange}
                    onBlur={contactFormik.handleBlur}
                    isInvalid={
                      contactFormik.touched.email && contactFormik.errors.email
                    }
                    placeholder="Enter Email"
                    focusBorderColor={brandColors[500]}
                    borderColor={borderColor}
                  />
                  {contactFormik.touched.email &&
                    contactFormik.errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {contactFormik.errors.email}
                      </Text>
                    )}
                </FormControl>
              </Stack>
            </form>
          </ModalBody>
          <ModalFooter
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            py={3}
            px={5}
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"
              size="sm"
              borderRadius="md"
              onClick={() => {
                contactFormik.resetForm();
                setEditingContactIndex(null);
                onContactModalClose();
              }}
              minWidth="100px"
              mr={3}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              size="sm"
              borderRadius="md"
              onClick={() => contactFormik.handleSubmit()}
              _hover={{ bg: brandColors[700] }}
              fontFamily="'DM Sans', sans-serif"
              minWidth="100px"
            >
              {editingContactIndex !== null ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Edit;
