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
import { useUpdateItemMutation, useFetchItemsQuery } from "api/apiSlice";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
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
    .test('port-range', 'Port must be 1-65535', value => {
      const port = parseInt(value);
      return port > 0 && port <= 65535;
    }),
  sipPassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  sipSimNumber: Yup.string()
    .matches(/^[0-9]*$/, "SIM number must contain only digits")
});

const EditSipSettingModal = ({ isOpen, onClose, onSuccess, sipSetting, users }) => {
  const [updateSipSetting] = useUpdateItemMutation();
  const [suggestions, setSuggestions] = useState({
    sipIp: [],
    sipPort: [],
    sipPassword: []
  });
  const [selectedSuggestions, setSelectedSuggestions] = useState({
    sipIp: null,
    sipPort: null,
    sipPassword: null
  });

  const { data: existingSettings } = useFetchItemsQuery({
    path: "sipSetting",
    params: { limit: 100 }
  });

  useEffect(() => {
    if (existingSettings?.sipSettings?.length > 0) {
      const settings = existingSettings.sipSettings;
      
      // Get unique values and shuffle them
      const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
      };

      const uniqueIps = shuffleArray([...new Set(
        settings.filter(s => s._id !== sipSetting?._id).map(s => s.sipIp)
      )]);
      const uniquePorts = shuffleArray([...new Set(
        settings.filter(s => s._id !== sipSetting?._id).map(s => s.sipPort)
      )]);
      const uniquePasswords = shuffleArray([...new Set(
        settings.filter(s => s._id !== sipSetting?._id).map(s => s.sipPassword)
      )]);

      setSuggestions({
        sipIp: uniqueIps.slice(0, 3),
        sipPort: uniquePorts.slice(0, 3),
        sipPassword: uniquePasswords.slice(0, 3)
      });
    }
  }, [existingSettings, sipSetting]);

  const formik = useFormik({
    initialValues: {
      sipIp: sipSetting?.sipIp || "",
      sipPort: sipSetting?.sipPort || "",
      sipPassword: sipSetting?.sipPassword || "",
      sipSimNumber: sipSetting?.sipSimNumber || ""
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateSipSetting({
          path: `/sipSetting/${sipSetting._id}`,
          body: values
        }).unwrap();
        
        toast.success("SIP Setting updated successfully");
        onSuccess();
        onClose();
      } catch (error) {
        toast.error(error.data?.message || "Error updating SIP Setting");
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleSuggestionClick = (field, value) => {
    formik.setFieldValue(field, value);
    setSelectedSuggestions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveSuggestion = (field) => {
    formik.setFieldValue(field, "");
    setSelectedSuggestions(prev => ({
      ...prev,
      [field]: null
    }));
  };

  const handleClose = () => {
    formik.resetForm();
    setSelectedSuggestions({
      sipIp: null,
      sipPort: null,
      sipPassword: null
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent mx={{ base: 4, sm: 6 }} w="100%" maxW="600px">
        <ModalHeader>Edit SIP Setting</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody overflowY="auto" maxH={{ base: "70vh", md: "75vh" }}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>User</FormLabel>
                <Input
                  value={sipSetting.userId?.fullName || "N/A"}
                  isReadOnly
                  focusBorderColor="#E0B960"
                />
              </FormControl>

              <FormControl>
                <FormLabel>SIP ID</FormLabel>
                <Input
                  value={sipSetting.sipId}
                  isReadOnly
                  focusBorderColor="#E0B960"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Extension ID</FormLabel>
                <Input
                  value={sipSetting.extensionId}
                  isReadOnly
                  focusBorderColor="#E0B960"
                />
              </FormControl>

              <FormControl isInvalid={formik.errors.sipIp && formik.touched.sipIp}>
                <FormLabel>SIP IP</FormLabel>
                <Input
                  name="sipIp"
                  value={formik.values.sipIp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={formik.errors.sipIp ? "red.500" : "#E0B960"}
                />
                {suggestions.sipIp.length > 0 && !formik.values.sipIp && (
                  <Flex mt={2} gap={2} flexWrap="wrap">
                    <Text fontSize="sm" color="gray.500">Suggestions:</Text>
                    {suggestions.sipIp.map((ip, index) => (
                      <Tag 
                        key={index} 
                        size="md" 
                        variant="subtle" 
                        colorScheme="blue"
                        cursor="pointer"
                        onClick={() => handleSuggestionClick('sipIp', ip)}
                      >
                        <TagLabel>{ip}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                )}
                <FormErrorMessage>{formik.errors.sipIp}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.sipPort && formik.touched.sipPort}>
                <FormLabel>SIP Port</FormLabel>
                <Input
                  name="sipPort"
                  value={formik.values.sipPort}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={formik.errors.sipPort ? "red.500" : "#E0B960"}
                />
                {suggestions.sipPort.length > 0 && !formik.values.sipPort && (
                  <Flex mt={2} gap={2} flexWrap="wrap">
                    <Text fontSize="sm" color="gray.500">Suggestions:</Text>
                    {suggestions.sipPort.map((port, index) => (
                      <Tag 
                        key={index} 
                        size="md" 
                        variant="subtle" 
                        colorScheme="blue"
                        cursor="pointer"
                        onClick={() => handleSuggestionClick('sipPort', port)}
                      >
                        <TagLabel>{port}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                )}
                <FormErrorMessage>{formik.errors.sipPort}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.sipPassword && formik.touched.sipPassword}>
                <FormLabel>SIP Password</FormLabel>
                <Input
                  name="sipPassword"
                  type="password"
                  value={formik.values.sipPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  focusBorderColor={formik.errors.sipPassword ? "red.500" : "#E0B960"}
                />
                {suggestions.sipPassword.length > 0 && !formik.values.sipPassword && (
                  <Flex mt={2} gap={2} flexWrap="wrap">
                    <Text fontSize="sm" color="gray.500">Suggestions:</Text>
                    {suggestions.sipPassword.map((pass, index) => (
                      <Tag 
                        key={index} 
                        size="md" 
                        variant="subtle" 
                        colorScheme="blue"
                        cursor="pointer"
                        onClick={() => handleSuggestionClick('sipPassword', pass)}
                      >
                        <TagLabel>••••••••</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                )}
                <FormErrorMessage>{formik.errors.sipPassword}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.sipSimNumber && formik.touched.sipSimNumber}>
                <FormLabel>SIM Number (Optional)</FormLabel>
                <Input
                  name="sipSimNumber"
                  value={formik.values.sipSimNumber}
                  onChange={formik.handleChange}
                  focusBorderColor="#E0B960"
                />
                <FormErrorMessage>{formik.errors.sipSimNumber}</FormErrorMessage>
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
              Update
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditSipSettingModal;