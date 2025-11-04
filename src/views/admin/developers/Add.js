import React, { useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  Grid,
  GridItem,
  IconButton,
  Text,
  Flex,
  Box,
  Stack,
  Center,
  Avatar,
  Badge,
  useDisclosure,
  useColorModeValue,
  ModalCloseButton,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";
import { useCreateItemMutation } from "api/apiSlice";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const userSchema = Yup.object().shape({
  trn: Yup.string().required("TRN is required"),
  developer_name: Yup.string().required("Developer Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  address: Yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  country: Yup.string().required("Country is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
});

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email format").optional(),
});

const AddUser = ({
  isOpen,
  onClose,
  setAction,
  fetchData,
  pageIndex,
  pageSize,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [editingContactIndex, setEditingContactIndex] = useState(null);
  const [createItemMutation, { isLoading: mutationLoading }] =
    useCreateItemMutation();
  const { createUserLog } = useUserActivityLog();

  const {
    isOpen: isContactModalOpen,
    onOpen: onContactModalOpen,
    onClose: onContactModalClose,
  } = useDisclosure();
  const fileInputRef = useRef(null);

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles[0]),
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const formik = useFormik({
    initialValues: {
      trn: "",
      developer_name: "",
      address: "",
      email: "",
      country: "",
      phoneNumber: "",
    },
    validationSchema: userSchema,
    onSubmit: (values) => AddData(values),
  });

  const contactFormik = useFormik({
    initialValues: { name: "", role: "", phoneNumber: "", email: "" },
    validationSchema: contactSchema,
    onSubmit: (values, { resetForm }) => {
      if (editingContactIndex !== null) {
        const updated = [...contacts];
        updated[editingContactIndex] = values;
        setContacts(updated);
      } else {
        setContacts([...contacts, values]);
      }
      resetForm();
      setEditingContactIndex(null);
      onContactModalClose();
    },
  });

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const AddData = async (values) => {
    const invalidContacts = contacts.some(
      (c) => !c.name || !c.role || !c.phoneNumber
    );
    if (invalidContacts)
      return toast.error("Please complete all contact details");

    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.append(key, val));
    if (contacts.length > 0)
      formData.append("contactDetails", JSON.stringify(contacts));
    if (selectedFile) formData.append("image", selectedFile);

    try {
      setIsLoading(true);
      const response = await createItemMutation({
        path: "/developer/add",
        body: formData,
      }).unwrap();
      createUserLog({
        userId: user?._id,
        action: "CREATE",
        entity: "Developer",
        entityId: response.data._id,
        status: "success",
        message: `${user?.fullName} created developer "${response?.data?.developer_name}".`,
      });

      toast.success("Developer added successfully");
      fetchData({ pageIndex, pageSize });
      setAction((prev) => !prev);
      resetState();
    } catch (e) {
      toast.error(e?.data?.message || "Failed to create developer");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    formik.resetForm();
    removeImage();
    setContacts([]);
    onClose();
  };

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

  const handleRemoveContact = (index) =>
    setContacts(contacts.filter((_, i) => i !== index));

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={resetState}
        size="3xl"
        isCentered
        scrollBehavior="inside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent borderRadius="2xl" shadow="xl" overflow="hidden">
          <ModalHeader
            // p={0}
            borderBottom="1px solid"
            borderColor={borderColor}
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            fontWeight="bold"
            fontSize="lg"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            Add Developer
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </ModalHeader>

          <form onSubmit={formik.handleSubmit}>
            <ModalBody
              p={5}
              overflowY="auto"
              maxH="65vh"
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <GridItem colSpan={2}>
                  <FormLabel>Developer Image</FormLabel>
                  <Flex
                    {...getRootProps()}
                    direction="column"
                    align="center"
                    justify="center"
                    p={6}
                    border="2px dashed"
                    borderColor={isDragActive ? "brand.500" : borderColor}
                    borderRadius="md"
                    cursor="pointer"
                  >
                    <input {...getInputProps()} ref={fileInputRef} />
                    {previewImage ? (
                      <>
                        <Avatar size="xl" src={previewImage} mb={2} />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                          }}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Center flexDirection="column">
                        <Text mb={2} color="brand.600">
                          {isDragActive
                            ? "Drop image here"
                            : "Drag & drop or click to select"}
                        </Text>
                        <Button size="sm" variant="outline">
                          Select Image
                        </Button>
                      </Center>
                    )}
                  </Flex>
                </GridItem>

                {[
                  "trn",
                  "developer_name",
                  "phoneNumber",
                  "email",
                  "country",
                  "address",
                ].map((field) => (
                  <GridItem key={field} colSpan={field === "address" ? 2 : 1}>
                    <FormLabel textTransform="capitalize">
                      {field.replace("_", " ")}
                    </FormLabel>
                    <Input
                      name={field}
                      value={formik.values[field]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={field.replace("_", " ")}
                      borderColor={
                        formik.errors[field] && formik.touched[field]
                          ? "red.300"
                          : borderColor
                      }
                      focusBorderColor="brand.500"
                    />
                    {formik.errors[field] && formik.touched[field] && (
                      <Text color="red.500" fontSize="sm">
                        {formik.errors[field]}
                      </Text>
                    )}
                  </GridItem>
                ))}

                <GridItem colSpan={2}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <FormLabel>Contact Details</FormLabel>
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
                      {contacts.map((contact, i) => (
                        <Box
                          key={i}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          borderColor={borderColor}
                        >
                          <Flex justify="space-between" align="center">
                            <Box>
                              <Flex align="center" mb={1}>
                                <Text fontWeight="bold" mr={2}>
                                  {contact.name}
                                </Text>
                                <Badge colorScheme="brand">
                                  {contact.role}
                                </Badge>
                              </Flex>
                              <Text fontSize="sm">{contact.phoneNumber}</Text>
                              {contact.email && (
                                <Text fontSize="sm">{contact.email}</Text>
                              )}
                            </Box>
                            <Flex>
                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditContact(i)}
                                mr={1}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleRemoveContact(i)}
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
              position="sticky"
              bottom="0"
              bg={footerBg}
              borderTop="1px solid"
              borderColor={borderColor}
              py={3}
              px={5}
              justifyContent="flex-end"
              gap={3}
            >
              <Button
                onClick={resetState}
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
                disabled={isLoading || mutationLoading}
                borderRadius={"md"}
              >
                {isLoading || mutationLoading ? <Spinner /> : "Save"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={onContactModalClose}
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="2xl" overflow="hidden">
          <ModalHeader
            borderBottom="1px solid"
            borderColor={borderColor}
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            fontWeight="bold"
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

          <ModalBody p={5}>
            <form onSubmit={contactFormik.handleSubmit}>
              <Stack spacing={4}>
                {["name", "role", "phoneNumber", "email"].map((f) => (
                  <FormControl key={f}>
                    <FormLabel textTransform="capitalize">{f}</FormLabel>
                    <Input
                      name={f}
                      type={f === "email" ? "email" : "text"}
                      value={contactFormik.values[f]}
                      onChange={contactFormik.handleChange}
                      onBlur={contactFormik.handleBlur}
                      placeholder={`Enter ${f}`}
                      borderColor={
                        contactFormik.errors[f] && contactFormik.touched[f]
                          ? "red.300"
                          : borderColor
                      }
                      focusBorderColor="brand.500"
                    />
                    {contactFormik.errors[f] && contactFormik.touched[f] && (
                      <Text color="red.500" fontSize="sm">
                        {contactFormik.errors[f]}
                      </Text>
                    )}
                  </FormControl>
                ))}
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
              onClick={onContactModalClose}
              variant="outline"
              size="sm"
              borderRadius={"md"}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              size="sm"
              onClick={() => contactFormik.handleSubmit()}
              borderRadius={"md"}
            >
              {editingContactIndex !== null ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUser;
