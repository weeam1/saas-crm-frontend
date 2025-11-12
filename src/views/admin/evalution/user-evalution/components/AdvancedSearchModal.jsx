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
  SimpleGrid,
  VStack,
  Box,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import moment from "moment";
import CustomDatePicker from "components/datetime/CustomDatePicker";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = {},
  clearFilter,
}) => {
  const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("brand.300", "brand.100");
  const headerText = useColorModeValue("brand.700", "brand.900");
  const footerBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 13 }, (_, i) => currentYear - 5 + i).map(
    (year) => ({ value: year.toString(), label: year.toString() })
  );
  years.unshift({ value: "", label: "All Years" });

  const [openCalendar, setOpenCalendar] = React.useState(null);
  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) =>
    date instanceof Date && !isNaN(date)
      ? moment(date).utcOffset(0, true).startOf("day").toISOString()
      : null;

  const formik = useFormik({
    initialValues: {
      month: initialFilters.month || "",
      year: initialFilters.year || "",
      startFrom: initialFilters.startFrom
        ? new Date(initialFilters.startFrom)
        : null,
      startTo: initialFilters.startTo ? new Date(initialFilters.startTo) : null,
      filterStatus: initialFilters.filterStatus || "",
    },
    onSubmit: (values) => {
      // Normalize dates
      let cleanedValues = {
        ...values,
        filterStatus:
          values.filterStatus === "all" || !values.filterStatus
            ? undefined
            : values.filterStatus,
        startFrom: toUTCString(values.startFrom),
        startTo: toUTCString(values.startTo),
      };

      // Remove empty values
      cleanedValues = Object.fromEntries(
        Object.entries(cleanedValues).map(([key, value]) => [
          key,
          value === "" || value === null || value === undefined
            ? undefined
            : value,
        ])
      );

      onApplyFilters(cleanedValues);
      onClose();
    },
  });

  const handleClear = () => {
    formik.resetForm({
      values: {
        month: "",
        year: "",
        startFrom: null,
        startTo: null,
        filterStatus: "",
      },
    });
  };

  const cleanedInitialFilters = useMemo(() => {
    return {
      month: initialFilters.month || "",
      year: initialFilters.year || "",
      startFrom: initialFilters.startFrom
        ? new Date(initialFilters.startFrom)
        : null,
      startTo: initialFilters.startTo ? new Date(initialFilters.startTo) : null,
      filterStatus: initialFilters.filterStatus || "",
    };
  }, [initialFilters]);

  const isFilterUnchanged = useMemo(
    () =>
      Object.entries(cleanedInitialFilters).every(
        ([key, val]) => formik.values[key] === val
      ),
    [formik.values, cleanedInitialFilters]
  );

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
        values: cleanedInitialFilters,
      });
    }
  }, [isOpen, cleanedInitialFilters]);

  useEffect(() => {
    if (!clearFilter) handleClear();
  }, [clearFilter]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent
        mx={{ base: 3, md: 8 }}
        w={{ base: "95vw", md: "600px", lg: "650px" }}
        maxW="95vw"
        bg={bgColor}
        borderRadius="2xl"
        boxShadow="xl"
      >
        <ModalHeader
          bg={headerBg}
          color={headerText}
          py={3}
          px={5}
          borderTopRadius="2xl"
          fontWeight="semibold"
        >
          Advanced Search
        </ModalHeader>
        <ModalCloseButton color={headerText} top={3} right={3} />

        <form onSubmit={formik.handleSubmit}>
          <ModalBody px={6} pt={5} pb={2} maxH="65vh" overflowY="auto">
            <VStack spacing={3} align="stretch">
              {/* Date Range */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={2}>
                  Date Range
                </Text>
                <SimpleGrid columns={colSpan} gap={3}>
                  <FormControl>
                    <FormLabel fontWeight="medium">Start Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={
                        formik.values.startFrom
                          ? new Date(formik.values.startFrom)
                          : null
                      }
                      handleDateChange={(date) =>
                        formik.setFieldValue("startFrom", date)
                      }
                      placeholder="Select start date"
                      maxDate={formik.values.startTo || new Date()}
                      isCalendarOpen={openCalendar === "startFrom"}
                      toggleCalendar={() => toggleCalendar("startFrom")}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="medium">End Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={
                        formik.values.startTo
                          ? new Date(formik.values.startTo)
                          : null
                      }
                      handleDateChange={(date) =>
                        formik.setFieldValue("startTo", date)
                      }
                      placeholder="Select end date"
                      minDate={formik.values.startFrom}
                      maxDate={new Date()}
                      isCalendarOpen={openCalendar === "startTo"}
                      toggleCalendar={() => toggleCalendar("startTo")}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider my={2} />

              {/* Month & Year */}
              <SimpleGrid columns={colSpan} gap={3}>
                <FormControl>
                  <FormLabel fontWeight="medium">Month</FormLabel>
                  <Select
                    name="month"
                    placeholder="Select Month"
                    value={formik.values.month}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium">Year</FormLabel>
                  <Input
                    type="number"
                    name="year"
                    placeholder="e.g. 2024"
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={2} />

              {/* Evaluation Status Filter */}
              <SimpleGrid columns={colSpan} gap={3}>
                <FormControl>
                  <FormLabel fontWeight="medium">Evaluation Status</FormLabel>
                  <Select
                    name="filterStatus"
                    value={formik.values.filterStatus}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    <option value="all">All</option>
                    <option value="evaluated">Evaluated</option>
                    <option value="not_evaluated">Not Evaluated</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
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
            <Button
              variant="outline"
              onClick={handleClear}
              isDisabled={isFilterEmpty}
              borderRadius="md"
            >
              Clear Search
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isDisabled={isFilterUnchanged}
              borderRadius="md"
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
