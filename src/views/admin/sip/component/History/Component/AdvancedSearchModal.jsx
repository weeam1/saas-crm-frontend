import React, { useMemo, useEffect } from "react";
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
  useBreakpointValue,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import moment from "moment";
import CustomDatePicker from "components/datetime/CustomDatePicker";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  clearFilter,
}) => {
  const [openCalendar, setOpenCalendar] = React.useState(null);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) => {
    return date
      ? moment(date).utcOffset(0, true).startOf("day").toISOString()
      : null;
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
      let cleanedValues = {
        ...values,
        start_date: values.start_date
          ? toUTCString(values.start_date)
          : undefined,
        end_date: values.end_date ? toUTCString(values.end_date) : undefined,
      };
      cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === "" ? undefined : value,
        ])
      );
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
    onApplyFilters({});
    onClose();
  };

  const cleanedInitialFilters = useMemo(() => {
    const clean = {
      call_from: initialFilters.call_from || "",
      call_to: initialFilters.call_to || "",
      clid: initialFilters.clid || "",
      start_date: initialFilters.start_date || null,
      end_date: initialFilters.end_date || null,
      disposition: initialFilters.disposition || "",
    };
    return clean;
  }, [initialFilters]);

  const isFilterUnchanged = useMemo(() => {
    return Object.entries(cleanedInitialFilters).every(
      ([key, val]) => formik.values[key] === val
    );
  }, [formik.values, cleanedInitialFilters]);

  useEffect(() => {
    if (!clearFilter) {
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
    }
  }, [clearFilter]);

  const isFilterUnchangedValueEmpty = useMemo(() => {
    return Object.values(formik.values).every(
      (val) => val === "" || val === undefined || val === null
    );
  }, [formik.values]);

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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent
        mx={{ base: 2, sm: 4, md: 8 }}
        w={{ base: "95vw", sm: "90vw", md: "500px" }}
        maxW="100vw"
      >
        <ModalHeader>Advanced search</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <VStack spacing={4} overflow="scroll" height="65vh" pb={5}>
              <FormControl>
                <FormLabel>CAll From</FormLabel>
                <Input
                  name="call_from"
                  placeholder="e.g. caller from"
                  value={formik.values.call_from}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Call To</FormLabel>
                <Input
                  name="call_to"
                  placeholder="e.g. called to"
                  value={formik.values.call_to}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>CLID</FormLabel>
                <Input
                  name="clid"
                  placeholder="e.g. CLID"
                  value={formik.values.clid}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              {/* Date Range Section */}
              <Box w="full" pt={2}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
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
                    <FormLabel>End Date</FormLabel>
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

              <FormControl mb={6}>
                <FormLabel>Disposition</FormLabel>
                <Select
                  name="disposition"
                  placeholder="Select Disposition"
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

          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={handleClear}
              isDisabled={isFilterUnchangedValueEmpty}
            >
              Clear Search
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isDisabled={isFilterUnchanged}
            >
              Apply Search
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedSearchModal;
