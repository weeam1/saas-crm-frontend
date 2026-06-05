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

const AdvancedSearch = ({
  isOpen,
  onClose,
  onSearch,
  initialValues,
  refetch,
}) => {
  const defaultValues = {
    leadName: "",
    leadIntId: "",
    callMedium: "",
    callQuality: "",
    reason: "",
    extension: "",
  };
  const [hasInteracted, setHasInteracted] = useState(false);
  const [formValues, setFormValues] = useState(initialValues || defaultValues);

  const {
    headerBg,
    headerText,
    closeBtnColor,
    closeBtnHoverBg,
    bg,
    bgDeep,
    bgInput,
    borderColor,
    borderFocus,
    labelColor,
    bodyText,
    mutedText,
    modalShadow,
    overlayBg,
    primaryBtnBg,
    primaryBtnText,
    primaryBtnHoverBg,
    primaryBtnShadow,
    secondaryBtnBg,
    closeBtnBg,
    secondaryBtnText,
    secondaryBtnBorder,
    secondaryBtnHoverBg,
    secondaryBtnHoverText,
  } = useModalColors();

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
    extension: Yup.string(),
  });

  const handleClear = (resetForm) => {
    resetForm();
    setHasInteracted(false);
  };

  const handleSubmit = (values) => {
    const cleanedValues = Object.keys(values).reduce((acc, key) => {
      if (values[key] && values[key].trim() !== "") {
        acc[key] = values[key].trim();
      }
      return acc;
    }, {});
    setHasInteracted(false);
    onSearch(cleanedValues);
    onClose();
    if (isMounted.current) setFormValues(values);
  };

  // Styles for select options (dark theme)
  const optionStyle = {
    background: bgInput,
    color: bodyText,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay bg={overlayBg} backdropFilter="blur(2px)" />
      <ModalContent
        bg={bg}
        borderRadius="xl"
        boxShadow={modalShadow}
        mx="2"
        overflow="hidden"
      >
        <ModalHeader
          bg={headerBg}
          color={headerText}
          borderTopRadius="xl"
          py={4}
          px={6}
          borderBottom="1px solid"
          borderColor={borderColor}
          w="100%"
        >
          Advanced Search
        </ModalHeader>

        <ModalCloseButton
          color={closeBtnColor}
          bg={closeBtnBg}
          _focus={{ outline: "none" }}
          _hover={{ bg: closeBtnHoverBg }}
        />

        <ModalBody p={6} bg={bgDeep}>
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              handleChange,
              dirty,
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
                      fontSize="sm"
                      fontWeight="500"
                      color={labelColor}
                      mb="1"
                    >
                      Lead Name
                    </FormLabel>
                    <Input
                      onFocus={() => setHasInteracted(true)}
                      type="text"
                      name="leadName"
                      placeholder="Enter lead name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.leadName}
                      bg={bgInput}
                      borderColor={borderColor}
                      color={bodyText}
                      _placeholder={{ color: mutedText }}
                      _focus={{
                        borderColor: borderFocus,
                        boxShadow: `0 0 0 1px ${borderFocus}`,
                      }}
                      _hover={{ borderColor: borderFocus }}
                    />
                    {errors.leadName && touched.leadName && (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        {errors.leadName}
                      </Text>
                    )}
                  </GridItem>

                  {/* Lead ID */}
                  <GridItem>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="500"
                      color={labelColor}
                      mb="1"
                    >
                      Lead ID
                    </FormLabel>
                    <Input
                      onFocus={() => setHasInteracted(true)}
                      type="text"
                      name="leadIntId"
                      placeholder="Enter lead ID (12345)"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.leadIntId}
                      bg={bgInput}
                      borderColor={borderColor}
                      color={bodyText}
                      _placeholder={{ color: mutedText }}
                      _focus={{
                        borderColor: borderFocus,
                        boxShadow: `0 0 0 1px ${borderFocus}`,
                      }}
                      _hover={{ borderColor: borderFocus }}
                    />
                    {errors.leadIntId && touched.leadIntId && (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        {errors.leadIntId}
                      </Text>
                    )}
                  </GridItem>

                  {/* Call Medium */}
                  <GridItem>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="500"
                      color={labelColor}
                      mb="1"
                    >
                      Call Medium
                    </FormLabel>
                    <Select
                      onFocus={() => setHasInteracted(true)}
                      name="callMedium"
                      placeholder="Select call medium"
                      value={values.callMedium}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      bg={bgInput}
                      borderColor={borderColor}
                      color={bodyText}
                      _focus={{
                        borderColor: borderFocus,
                        boxShadow: `0 0 0 1px ${borderFocus}`,
                      }}
                      _hover={{ borderColor: borderFocus }}
                      iconColor={bodyText}
                    >
                      <option value="external_sim" style={optionStyle}>External SIM</option>
                      <option value="whatsapp" style={optionStyle}>WhatsApp</option>
                      <option value="dialer" style={optionStyle}>Dialer</option>
                    </Select>
                    {errors.callMedium && touched.callMedium && (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        {errors.callMedium}
                      </Text>
                    )}
                  </GridItem>

                  {/* Call Quality */}
                  <GridItem>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="500"
                      color={labelColor}
                      mb="1"
                    >
                      Call Quality
                    </FormLabel>
                    <Select
                      onFocus={() => setHasInteracted(true)}
                      name="callQuality"
                      placeholder="Select call quality"
                      value={values.callQuality}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      bg={bgInput}
                      borderColor={borderColor}
                      color={bodyText}
                      _focus={{
                        borderColor: borderFocus,
                        boxShadow: `0 0 0 1px ${borderFocus}`,
                      }}
                      _hover={{ borderColor: borderFocus }}
                      iconColor={bodyText}
                    >
                      <option value="very_bad" style={optionStyle}>Very Bad</option>
                      <option value="bad" style={optionStyle}>Bad</option>
                      <option value="average" style={optionStyle}>Average</option>
                      <option value="good" style={optionStyle}>Good</option>
                      <option value="excellent" style={optionStyle}>Excellent</option>
                    </Select>
                    {errors.callQuality && touched.callQuality && (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        {errors.callQuality}
                      </Text>
                    )}
                  </GridItem>

                  {/* Reason */}
                  <GridItem>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="500"
                      color={labelColor}
                      mb="1"
                    >
                      Reason
                    </FormLabel>
                    <Input
                      onFocus={() => setHasInteracted(true)}
                      type="text"
                      name="reason"
                      placeholder="Enter reason"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.reason}
                      bg={bgInput}
                      borderColor={borderColor}
                      color={bodyText}
                      _placeholder={{ color: mutedText }}
                      _focus={{
                        borderColor: borderFocus,
                        boxShadow: `0 0 0 1px ${borderFocus}`,
                      }}
                      _hover={{ borderColor: borderFocus }}
                    />
                    {errors.reason && touched.reason && (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        {errors.reason}
                      </Text>
                    )}
                  </GridItem>

                  {/* Extension */}
                  <GridItem colSpan={{ base: 1 }}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="500"
                      color={labelColor}
                      mb="1"
                    >
                      Extension ID
                    </FormLabel>
                    <Input
                      onFocus={() => setHasInteracted(true)}
                      type="text"
                      name="extension"
                      placeholder="Enter extension id"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.extension}
                      bg={bgInput}
                      borderColor={borderColor}
                      color={bodyText}
                      _placeholder={{ color: mutedText }}
                      _focus={{
                        borderColor: borderFocus,
                        boxShadow: `0 0 0 1px ${borderFocus}`,
                      }}
                      _hover={{ borderColor: borderFocus }}
                    />
                    {errors.extension && touched.extension && (
                      <Text color="red.500" fontSize="xs" mt={1}>
                        {errors.extension}
                      </Text>
                    )}
                  </GridItem>
                </Grid>

                <Flex mt={6} justifyContent="flex-end" gap={3}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleClear(resetForm)}
                    bg={secondaryBtnBg}
                    color={secondaryBtnText}
                    borderColor={secondaryBtnBorder}
                    _hover={{
                      bg: secondaryBtnHoverBg,
                      color: secondaryBtnHoverText,
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    bg={primaryBtnBg}
                    color={primaryBtnText}
                    size="sm"
                    type="submit"
                    isDisabled={!dirty && !hasInteracted}
                    _hover={{
                      bg: primaryBtnHoverBg,
                      boxShadow: primaryBtnShadow,
                    }}
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