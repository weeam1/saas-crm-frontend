import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Grid,
  GridItem,
  FormLabel,
  Input,
  Text,
  Select,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useModalColors } from "hooks/useModalColors";

const AdvancedSearch = ({ isOpen, onClose, onSearch, initialValues }) => {
  const defaultValues = {
    leadName: "",
    leadIntId: "",
    callMedium: "",
    callQuality: "",
    reason: "",
    // userId: "",
    extension: "",
  };

  const [formValues, setFormValues] = useState(initialValues || defaultValues);
  const { headerBg, primaryBtnBg, headerText } = useModalColors();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isOpen) {
      setFormValues(initialValues || defaultValues);
    }
  }, [isOpen, initialValues]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const validationSchema = Yup.object({
    leadName: Yup.string(),
    leadIntId: Yup.string(),
    callMedium: Yup.string(),
    callQuality: Yup.string(),
    reason: Yup.string(),
    // userId: Yup.string(),
    extension: Yup.string(),
  });

  const handleSubmit = (values) => {
    // Clean up empty values
    const cleanedValues = Object.keys(values).reduce((acc, key) => {
      if (values[key] && values[key].trim() !== "") {
        acc[key] = values[key].trim();
      }
      return acc;
    }, {});

    onSearch(cleanedValues);
    onClose();
    if (isMounted.current) setFormValues(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent mx="2" borderRadius="xl" boxShadow="xl">
        <ModalHeader
          bg={headerBg}
          color={headerText}
          borderTopRadius="xl"
          py={4}
          w="100%"
        >
          Advanced Search
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="4">
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              resetForm,
            }) => (
              <Form>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                >
                  {/* Lead Name */}
                  <GridItem>
                    <FormLabel
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      mb="1"
                    >
                      Lead Name
                    </FormLabel>
                    <Input
                      type="text"
                      name="leadName"
                      placeholder="Enter lead name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.leadName}
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    {errors.leadName && touched.leadName && (
                      <Text color="red.500">{errors.leadName}</Text>
                    )}
                  </GridItem>

                  {/* Lead ID (leadIntId in API) */}
                  <GridItem>
                    <FormLabel
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      mb="1"
                    >
                      Lead ID
                    </FormLabel>
                    <Input
                      type="text"
                      name="leadIntId"
                      placeholder="Enter lead ID (12345)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.leadIntId}
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    {errors.leadIntId && touched.leadIntId && (
                      <Text color="red.500">{errors.leadIntId}</Text>
                    )}
                  </GridItem>

                  {/* Call Medium */}
                  <GridItem>
                    <FormLabel
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      mb="1"
                    >
                      Call Medium
                    </FormLabel>
                    <Select
                      name="callMedium"
                      placeholder="Select call medium"
                      value={values.callMedium}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    >
                      <option value="external_sim">External SIM</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="dialer">Dialer</option>
                    </Select>

                    {errors.callMedium && touched.callMedium && (
                      <Text color="red.500">{errors.callMedium}</Text>
                    )}
                    {errors.callMedium && touched.callMedium && (
                      <Text color="red.500">{errors.callMedium}</Text>
                    )}
                  </GridItem>

                  {/* Call Quality */}
                  <GridItem>
                    <FormLabel
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      mb="1"
                    >
                      Call Quality
                    </FormLabel>

                    <Select
                      name="callQuality"
                      placeholder="Select call quality"
                      value={values.callQuality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    >
                      <option value="very_bad">Very Bad</option>
                      <option value="bad">Bad</option>
                      <option value="average">Average</option>
                      <option value="good">Good</option>
                      <option value="excellent">Excellent</option>
                    </Select>

                    {errors.callQuality && touched.callQuality && (
                      <Text color="red.500">{errors.callQuality}</Text>
                    )}
                  </GridItem>

                  {/* Reason */}
                  <GridItem>
                    <FormLabel
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      mb="1"
                    >
                      Reason
                    </FormLabel>
                    <Input
                      type="text"
                      name="reason"
                      placeholder="Enter reason"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.reason}
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    {errors.reason && touched.reason && (
                      <Text color="red.500">{errors.reason}</Text>
                    )}
                  </GridItem>

                  {/* User ID */}
                  {/* <GridItem>
                    <FormLabel
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      mb="1"
                    >
                      User ID
                    </FormLabel>
                    <Input
                      type="text"
                      name="userId"
                      placeholder="Enter user ID"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.userId}
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    {errors.userId && touched.userId && (
                      <Text color="red.500">{errors.userId}</Text>
                    )}
                  </GridItem> */}

                  {/* Extension */}
                  <GridItem colSpan={{ base: 1 }}>
                    <FormLabel
                      fontSize="md"
                      fontWeight="500"
                      color="gray.800"
                      mb="1"
                    >
                      Extension ID
                    </FormLabel>
                    <Input
                      type="text"
                      name="extension"
                      placeholder="Enter extension id"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.extension}
                      borderColor="gray.300"
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                      }}
                    />
                    {errors.extension && touched.extension && (
                      <Text color="red.500">{errors.extension}</Text>
                    )}
                  </GridItem>
                </Grid>

                <Flex mt={4} justifyContent="flex-end">
                  <Button
                    mr={3}
                    colorScheme="gray"
                    variant="outline"
                    size="sm"
                    rounded="md"
                    onClick={() => resetForm()}
                  >
                    Clear
                  </Button>
                  <Button
                    bg={primaryBtnBg}
                    color="white"
                    _hover={{ bg: "brand.600", color: "white" }}
                    _active={{ bg: "brand.600" }}
                    rounded="md"
                    size="sm"
                    type="submit"
                  >
                    Search
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedSearch;
