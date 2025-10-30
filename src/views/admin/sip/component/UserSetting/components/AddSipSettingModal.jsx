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
  useColorModeValue,
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
  const user = JSON.parse(localStorage.getItem("user"));
  const { createUserLog } = useUserActivityLog();

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    if (existingSettings) {
		// Get unique values and shuffle them
      const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
      const uniqueIps = shuffleArray([
        ...new Set(existingSettings.map((s) => s.sipIp)),
      ]);
      const uniquePorts = shuffleArray([
        ...new Set(existingSettings.map((s) => s.sipPort)),
      ]);
      setSuggestions({
        sipIp: uniqueIps.slice(0, 3),
        sipPort: uniquePorts.slice(0, 3),
      });
    }
  }, [existingSettings]);

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
          body: { ...values, sipId: values.sipId.toString() },
        }).unwrap();
        createUserLog({
          userId: user?._id,
          action: "CREATE",
          entity: "Call_Logs",
          entityId: response._id,
          entityType: "SipSetting",
          status: "success",
          message: `${user?.fullName} created SIP setting with ID "${
            response?.data?.sipId || "Untitled"
          }".`,
        });
        toast.success("SIP Setting created successfully");
        onSuccess();
        resetForm();
        onClose();
      } catch (error) {
        toast.error(error.data?.message || "Error creating SIP Setting");
        createUserLog({
          userId: user?._id,
          action: "CREATE",
          entity: "Call_Logs",
          entityType: "SipSetting",
          status: "error",
          message:
            error?.data?.message ||
            "Failed to create SIP Setting. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSuggestionClick = (field, value) => {
    formik.setFieldValue(field, value);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleSelectUser = (user) => {
    formik.setFieldValue("userId", user?._id || null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        shadow="2xl"
        maxW={{ base: "full", sm: "90vw", md: "600px" }}
        overflow="hidden"
        mx={{ base: 3, md: 0 }}
      >
        <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
          <Flex
            align="center"
            bg={headerBg}
            color={headerText}
            px={6}
            py={3}
            position="sticky"
            top="0"
            zIndex="10"
            boxShadow="md"
          >
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
              Add New SIP Setting
            </Text>
            <ModalCloseButton
              position="absolute"
              right="12px"
              top="10px"
              color={headerText}
              _hover={{ bg: "whiteAlpha.200" }}
            />
          </Flex>
        </ModalHeader>

        <form onSubmit={formik.handleSubmit}>
          <ModalBody
            p={5}
            overflowY="auto"
            maxH="65vh"
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <VStack spacing={5} align="stretch">
              <FormControl
                isInvalid={formik.errors.userId && formik.touched.userId}
              >
                <FormLabel fontWeight="semibold">User</FormLabel>
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
                <FormLabel fontWeight="semibold">SIP ID</FormLabel>
                <Input
                  name="sipId"
                  placeholder="e.g., 100 or above"
                  value={formik.values.sipId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{formik.errors.sipId}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={formik.errors.sipIp && formik.touched.sipIp}
              >
                <FormLabel fontWeight="semibold">SIP IP</FormLabel>
                <Input
                  name="sipIp"
                  placeholder="e.g., 182.182.2.2"
                  value={formik.values.sipIp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor="brand.500"
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
                <FormLabel fontWeight="semibold">SIP Port</FormLabel>
                <Input
                  name="sipPort"
                  placeholder="e.g., 5060"
                  value={formik.values.sipPort}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor="brand.500"
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
                <FormLabel fontWeight="semibold">SIP Password</FormLabel>
                <Input
                  name="sipPassword"
                  type="password"
                  placeholder="Password"
                  value={formik.values.sipPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor="brand.500"
                />
                <FormErrorMessage>{formik.errors.sipPassword}</FormErrorMessage>
              </FormControl>

              <FormControl
                isInvalid={
                  !!formik.values.sipSimNumber &&
                  formik.errors.sipSimNumber &&
                  formik.touched.sipSimNumber
                }
              >
                <FormLabel fontWeight="semibold">SIM Number (Optional)</FormLabel>
                <Input
                  name="sipSimNumber"
                  placeholder="SIM number if applicable"
                  value={formik.values.sipSimNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor="brand.500"
                />
                {!!formik.values.sipSimNumber && (
                  <FormErrorMessage>
                    {formik.errors.sipSimNumber}
                  </FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter
            position="sticky"
            bottom="0"
            bg={footerBg}
            borderTop="1px solid"
            borderColor={borderColor}
            py={3}
            px={5}
            zIndex="10"
            justifyContent="flex-end"
            gap={3}
          >
            <Button variant="outline" colorScheme="gray" onClick={handleClose} borderRadius={"md"}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={!formik.isValid}
			  borderRadius={"md"}
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
