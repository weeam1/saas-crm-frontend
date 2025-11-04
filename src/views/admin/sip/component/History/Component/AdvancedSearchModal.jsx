import React, { useMemo, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Box,
  Text,
  Divider,
  useBreakpointValue,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { toUTCString } from "utils/helpers";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  clearFilter,
}) => {
  const [openCalendar, setOpenCalendar] = useState(null);
  const colSpan = useBreakpointValue({ base: 1, md: 2 });

  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.800");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const formik = useFormik({
    initialValues: {
      call_from: initialFilters.call_from || "",
      call_to: initialFilters.call_to || "",
      clid: initialFilters.clid || "",
      start_date: initialFilters.start_date
        ? new Date(initialFilters.start_date)
        : null,
      end_date: initialFilters.end_date
        ? new Date(initialFilters.end_date)
        : null,
      disposition: initialFilters.disposition || "",
      ...initialFilters,
    },
    onSubmit: (values) => {
      const cleanedValues = {
        ...values,
        start_date: values.start_date
          ? toUTCString(values.start_date)
          : undefined,
        end_date: values.end_date ? toUTCString(values.end_date) : undefined,
      };
      onApplyFilters(cleanedValues);
      onClose();
    },
  });

  const handleClear = () => {
    formik.resetForm({
      values: {
        call_from: "",
        call_to: "",
        clid: "",
        start_date: null,
        end_date: null,
        disposition: "",
      },
    });
  };

  const cleanedInitialFilters = useMemo(
    () => ({
      call_from: initialFilters.call_from || "",
      call_to: initialFilters.call_to || "",
      clid: initialFilters.clid || "",
      start_date: initialFilters.start_date || null,
      end_date: initialFilters.end_date || null,
      disposition: initialFilters.disposition || "",
    }),
    [initialFilters]
  );

  const isFilterUnchanged = useMemo(
    () =>
      Object.entries(cleanedInitialFilters).every(
        ([key, val]) => formik.values[key] === val
      ),
    [formik.values, cleanedInitialFilters]
  );

  useEffect(() => {
    if (!clearFilter) handleClear();
  }, [clearFilter]);

  const isFilterEmpty = useMemo(
    () =>
      Object.values(formik.values).every(
        (val) => val === "" || val === undefined || val === null
      ),
    [formik.values]
  );

  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          call_from: initialFilters.call_from || "",
          call_to: initialFilters.call_to || "",
          clid: initialFilters.clid || "",
          start_date: initialFilters.start_date
            ? new Date(initialFilters.start_date)
            : null,
          end_date: initialFilters.end_date
            ? new Date(initialFilters.end_date)
            : null,
          disposition: initialFilters.disposition || "",
        },
      });
    }
  }, [isOpen, initialFilters]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        shadow="2xl"
        maxW={{ base: "full", sm: "90vw", md: "500px" }}
        overflow="hidden"
        mx={{ base: 3, md: 0 }}
      >
        {/* Header */}
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
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              flex="1"
            >
              Advanced Search
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
        <form onSubmit={formik.handleSubmit}>
          <ModalBody
            p={5}
            overflowY="auto"
            maxH="65vh"
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <VStack spacing={5} align="stretch">
              <FormControl>
                <FormLabel fontWeight="semibold">Call From</FormLabel>
                <Input
                  name="call_from"
                  placeholder="Enter caller number"
                  value={formik.values.call_from}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">Call To</FormLabel>
                <Input
                  name="call_to"
                  placeholder="Enter recipient number"
                  value={formik.values.call_to}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">CLID</FormLabel>
                <Input
                  name="clid"
                  placeholder="Enter CLID"
                  value={formik.values.clid}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <Divider />

              <Box>
                <Text
                  fontWeight="semibold"
                  mb={2}
                  color="gray.600"
                  _dark={{ color: "gray.300" }}
                >
                  Date Range
                </Text>
                <VStack spacing={3} align="stretch">
                  <FormControl>
                    <FormLabel fontWeight="medium">Start Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.start_date}
                      handleDateChange={(date) =>
                        formik.setFieldValue("start_date", date)
                      }
                      placeholder="Select start date"
                      maxDate={formik.values.end_date || new Date()}
                      isCalendarOpen={openCalendar === "start_date"}
                      toggleCalendar={() => toggleCalendar("start_date")}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="medium">End Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.end_date}
                      handleDateChange={(date) =>
                        formik.setFieldValue("end_date", date)
                      }
                      placeholder="Select end date"
                      minDate={formik.values.start_date}
                      maxDate={new Date()}
                      isCalendarOpen={openCalendar === "end_date"}
                      toggleCalendar={() => toggleCalendar("end_date")}
                    />
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              <FormControl>
                <FormLabel fontWeight="semibold">Disposition</FormLabel>
                <Select
                  name="disposition"
                  placeholder="Select disposition"
                  value={formik.values.disposition}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                >
                  <option value="ANSWERED">Answered</option>
                  <option value="NO ANSWER">No Answer</option>
                  <option value="FAILED">Failed</option>
                  <option value="BUSY">Busy</option>
                </Select>
              </FormControl>
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
            <Button
              variant="outline"
              colorScheme="gray"
              size="sm"
              onClick={handleClear}
              borderRadius="md"
              isDisabled={isFilterEmpty}
            >
              Clear
            </Button>
            <Button
              colorScheme="brand"
              size="sm"
              type="submit"
              borderRadius="md"
              isDisabled={isFilterUnchanged}
            >
              Apply
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedSearchModal;
