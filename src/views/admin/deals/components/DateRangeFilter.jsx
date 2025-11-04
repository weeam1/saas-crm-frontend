import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "components/datetime/CustomDatePicker";

import { useFormik } from "formik";
import * as Yup from "yup";
import { buttonStyle } from "utils/btn";

const DateRangeFilter = ({ handleDateFilter, onClose, isOpen }) => {
  const [openCalendar, setOpenCalendar] = useState(null);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) => {
    return date
      ? moment(date).utcOffset(0, true).startOf("day").toISOString()
      : null;
  };

  const formik = useFormik({
    initialValues: { startDate: "", endDate: "" },
    validationSchema: Yup.object({
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
    }),
    onSubmit: (values) => {
      const from = toUTCString(values.startDate);
      const to = toUTCString(values.endDate);
      handleDateFilter({ from, to });
    },
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        shadow="2xl"
		overflow={"hidden"}
        maxW={{ base: "full", sm: "90vw", md: "480px" }}
        mx={{ base: 3, md: 0 }}
      >
        {/* Header */}
        <ModalHeader p={0} borderBottom="1px solid" borderColor={borderColor}>
          <Flex
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
              Date Range Filter
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

        {/* Body */}
        <ModalBody p={5} borderBottom="1px solid" borderColor={borderColor}>
          <VStack width="100%" spacing={4} alignItems="flex-end">
            {/* Start Date */}
            <CustomDatePicker
              selectedDate={formik.values.startDate}
              handleDateChange={(date) => formik.setFieldValue("startDate", date)}
              errors={formik.touched.startDate && formik.errors.startDate}
              label="Start Date"
              placeholder="Select start date"
              maxDate={formik.values.endDate || new Date()}
              isCalendarOpen={openCalendar === "start"}
              toggleCalendar={() => toggleCalendar("start")}
            />

            {/* End Date */}
            <CustomDatePicker
              selectedDate={formik.values.endDate}
              handleDateChange={(date) => formik.setFieldValue("endDate", date)}
              errors={formik.touched.endDate && formik.errors.endDate}
              label="End Date"
              placeholder="Select end date"
              minDate={formik.values.startDate}
              maxDate={new Date()}
              isCalendarOpen={openCalendar === "end"}
              toggleCalendar={() => toggleCalendar("end")}
            />
          </VStack>
        </ModalBody>

        {/* Footer */}
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
          <Button variant="outline" colorScheme="gray" size="sm" borderRadius="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            {...buttonStyle}
            colorScheme="brand"
            size="sm"
            borderRadius="md"
            onClick={formik.handleSubmit}
            isDisabled={!formik.dirty || !formik.isValid}
          >
            Apply Filter
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DateRangeFilter;
