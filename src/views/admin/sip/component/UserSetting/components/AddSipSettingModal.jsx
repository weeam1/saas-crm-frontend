import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  FormErrorMessage,
  Flex,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateItemMutation } from "api/apiSlice";
import { toast } from "react-toastify";
import SearchUsers from "views/admin/whatsapp/WhatsappSettings/SearchUsers";
import { useUserActivityLog } from "hooks/useUserActivityLog";

const validationSchema = Yup.object().shape({
  userId: Yup.string().required("User is required"),
  sipId: Yup.string()
    .required("SIP ID is required")
    .matches(/^[1-9]\d{2,}$/, "Must be 3 digits or more starting from 100")
    .test("min-value", "Must be ≥ 100", (value) => parseInt(value) >= 100),
  sipIp: Yup.string()
    .required("SIP IP is required")
    .matches(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Invalid IP address format"
    ),
  sipPort: Yup.string()
    .required("SIP Port is required")
    .matches(/^[0-9]+$/, "Must be numeric")
    .min(2, "Port must be between 1-65535")
    .max(5, "Port must be between 1-65535")
    .test("port-range", "Port must be 1-65535", (value) => {
      const port = parseInt(value);
      return port > 0 && port <= 65535;
    }),
  sipPassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  sipSimNumber: Yup.string().matches(
    /^[0-9]*$/,
    "SIM number must contain only digits"
  ),
});

const AddSipSettingModal = ({
  isOpen,
  onClose,
  onSuccess,
  existingSettings,
  usersData,
}) => {
  const [createSipSetting] = useCreateItemMutation();
  const [suggestions, setSuggestions] = useState({
    sipIp: [],
    sipPort: [],
  });
  const [selectedSuggestions, setSelectedSuggestions] = useState({
    sipIp: null,
    sipPort: null,
    sipPassword: null,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const { createUserLog } = useUserActivityLog();

  useEffect(() => {
    if (existingSettings) {
      const settings = existingSettings;

      // Get unique values and shuffle them
      const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
      };

      const uniqueIps = shuffleArray([
        ...new Set(settings.map((s) => s.sipIp)),
      ]);
      const uniquePorts = shuffleArray([
        ...new Set(settings.map((s) => s.sipPort)),
      ]);
      const uniquePasswords = shuffleArray([
        ...new Set(settings.map((s) => s.sipPassword)),
      ]);

      setSuggestions({
        sipIp: uniqueIps.slice(0, 3),
        sipPort: uniquePorts.slice(0, 3),
        sipPassword: uniquePasswords.slice(0, 3),
      });
    }
  }, [existingSettings]);

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
      setSelectedSuggestions({
        sipIp: null,
        sipPort: null,
        sipPassword: null,
      });
    }
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      userId: "",
      sipId: "",
      sipIp: "",
      sipPort: "",
      sipPassword: "",
      sipSimNumber: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await createSipSetting({
          path: "/sipSetting",
          body: {
            ...values,
            sipId: values.sipId.toString(),
          },
        }).unwrap();
        createUserLog({
          userId: user?._id,
          action: "CREATE",
          entity: "Sip_Setting",
          entityId: response._id,
          entityType: "SipSetting",
          status: "success",
          message: `${user?.fullName} created sip setting with sip id "${response?.data?.sipId || "Untitled"}".`,
        });
        toast.success("SIP Setting created successfully");
        onSuccess();
        resetForm();
        setSelectedSuggestions({
          sipIp: null,
          sipPort: null,
          sipPassword: null,
        });
        onClose();
      } catch (error) {
        toast.error(error.data?.message || "Error creating SIP Setting");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSuggestionClick = (field, value) => {
    formik.setFieldValue(field, value);
    setSelectedSuggestions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedSuggestions({
      sipIp: null,
      sipPort: null,
      sipPassword: null,
    });
    onClose();
  };

  const handleSelectUser = (user) => {
    formik.setFieldValue("userId", user?._id || null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent mx={{ base: 4, sm: 6 }} w="100%" maxW="600px">
        <ModalHeader>Add New SIP Setting</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody overflowY="auto" maxH={{ base: "70vh", md: "75vh" }}>
            <VStack spacing={4} align="stretch">
              <FormControl
                isInvalid={formik.errors.userId && formik.touched.userId}
              >
                <FormLabel>User</FormLabel>
                <SearchUsers
                  selectedUserId={formik.values.userId || null}
                  users={usersData?.doc || []}
                  onSelectUser={handleSelectUser}
                />
                <FormErrorMessage>{formik.errors.userId}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.sipId && formik.touched.sipId}
              >
                <FormLabel>SIP ID</FormLabel>
                <Input
                  name="sipId"
                  placeholder="e.g., 100, 101, 102 (must be ≥ 100)"
                  value={formik.values.sipId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={formik.errors.sipId ? "red.500" : "#E0B960"}
                />
                <FormErrorMessage>{formik.errors.sipId}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.sipIp && formik.touched.sipIp}
              >
                <FormLabel>SIP IP</FormLabel>
                <Input
                  name="sipIp"
                  placeholder="e.g., 182.182.2.2"
                  value={formik.values.sipIp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={formik.errors.sipIp ? "red.500" : "#E0B960"}
                />
                {suggestions.sipIp.length > 0 && !formik.values.sipIp && (
                  <Flex mt={2} gap={2} flexWrap="wrap">
                    <Text fontSize="sm" color="gray.500">
                      Suggestions:
                    </Text>
                    {suggestions.sipIp.map((ip, index) => (
                      <Tag
                        key={index}
                        size="md"
                        variant="subtle"
                        colorScheme="blue"
                        cursor="pointer"
                        onClick={() => handleSuggestionClick("sipIp", ip)}
                      >
                        <TagLabel>{ip}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                )}
                <FormErrorMessage>{formik.errors.sipIp}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.sipPort && formik.touched.sipPort}
              >
                <FormLabel>SIP Port</FormLabel>
                <Input
                  name="sipPort"
                  placeholder="e.g., 5060"
                  value={formik.values.sipPort}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={
                    formik.errors.sipPort ? "red.500" : "#E0B960"
                  }
                />
                {suggestions.sipPort.length > 0 && !formik.values.sipPort && (
                  <Flex mt={2} gap={2} flexWrap="wrap">
                    <Text fontSize="sm" color="gray.500">
                      Suggestions:
                    </Text>
                    {suggestions.sipPort.map((port, index) => (
                      <Tag
                        key={index}
                        size="md"
                        variant="subtle"
                        colorScheme="blue"
                        cursor="pointer"
                        onClick={() => handleSuggestionClick("sipPort", port)}
                      >
                        <TagLabel>{port}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                )}
                <FormErrorMessage>{formik.errors.sipPort}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  formik.errors.sipPassword && formik.touched.sipPassword
                }
              >
                <FormLabel>SIP Password</FormLabel>
                <Input
                  name="sipPassword"
                  type="password"
                  placeholder="Password"
                  value={formik.values.sipPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={
                    formik.errors.sipPassword ? "red.500" : "#E0B960"
                  }
                />
                <FormErrorMessage>{formik.errors.sipPassword}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  formik.errors.sipSimNumber && formik.touched.sipSimNumber
                }
              >
                <FormLabel>SIM Number (Optional)</FormLabel>
                <Input
                  name="sipSimNumber"
                  placeholder="SIM number if applicable"
                  value={formik.values.sipSimNumber}
                  onChange={formik.handleChange}
                  focusBorderColor="#E0B960"
                />
                <FormErrorMessage>
                  {formik.errors.sipSimNumber}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={!formik.isValid}
            >
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddSipSettingModal;
