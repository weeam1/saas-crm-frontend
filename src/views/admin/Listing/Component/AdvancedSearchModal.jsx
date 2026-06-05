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
  NumberInput,
  NumberInputField,
  Box,
  Text,
  useBreakpointValue,
  Divider,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import moment from "moment";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { useModalColors } from "hooks/useModalColors";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  listingTypes,
  unitTypes,
  initialFilters,
  clearFilter,
  countries,
}) => {
  const colors = useModalColors();
  const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

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
    (year) => ({
      value: year.toString(),
      label: year.toString(),
    })
  );
  years.unshift({ value: "", label: "All Years" });

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
      projectName: initialFilters.projectName || "",
      location: initialFilters.location || "",
      listingType: initialFilters.listingType || "",
      unitType: initialFilters.unitType || "",
      minPrice: initialFilters.minPrice || "",
      maxPrice: initialFilters.maxPrice || "",
      minArea: initialFilters.minArea || "",
      maxArea: initialFilters.maxArea || "",
      month: initialFilters.month || "",
      year: initialFilters.year || "",
      country: initialFilters.country || "",
      startFrom: initialFilters.startFrom
        ? new Date(initialFilters.startFrom)
        : null,
      startTo: initialFilters.startTo ? new Date(initialFilters.startTo) : null,
      ...initialFilters,
    },
    onSubmit: (values) => {
      let cleanedValues = {
        ...values,
        startFrom: values.startFrom ? toUTCString(values.startFrom) : undefined,
        startTo: values.startTo ? toUTCString(values.startTo) : undefined,
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
        projectName: "",
        location: "",
        listingType: "",
        unitType: "",
        minPrice: "",
        maxPrice: "",
        minArea: "",
        maxArea: "",
        month: "",
        year: "",
        country: "",
        startFrom: null,
        startTo: null,
      },
    });
  };

  const cleanedInitialFilters = useMemo(() => {
    const clean = {
      projectName: initialFilters.projectName || "",
      location: initialFilters.location || "",
      listingType: initialFilters.listingType || "",
      unitType: initialFilters.unitType || "",
      minPrice: initialFilters.minPrice || "",
      maxPrice: initialFilters.maxPrice || "",
      minArea: initialFilters.minArea || "",
      maxArea: initialFilters.maxArea || "",
      month: initialFilters.month || "",
      year: initialFilters.year || "",
      country: initialFilters.country || "",
      startFrom: initialFilters.startFrom || null,
      startTo: initialFilters.startTo || null,
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
          projectName: "",
          location: "",
          listingType: "",
          unitType: "",
          minPrice: "",
          maxPrice: "",
          minArea: "",
          maxArea: "",
          month: "",
          year: "",
          country: "",
          startFrom: null,
          startTo: null,
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
          projectName: initialFilters.projectName || "",
          location: initialFilters.location || "",
          listingType: initialFilters.listingType || "",
          unitType: initialFilters.unitType || "",
          minPrice: initialFilters.minPrice || "",
          maxPrice: initialFilters.maxPrice || "",
          minArea: initialFilters.minArea || "",
          maxArea: initialFilters.maxArea || "",
          month: initialFilters.month || "",
          year: initialFilters.year || "",
          country: initialFilters.country || "",
          startFrom: initialFilters.startFrom
            ? new Date(initialFilters.startFrom)
            : null,
          startTo: initialFilters.startTo
            ? new Date(initialFilters.startTo)
            : null,
        },
      });
    }
  }, [isOpen, initialFilters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg={colors.overlayBg} backdropFilter="blur(4px)" />
      <ModalContent
        mx={{ base: 3, md: 8 }}
        w={{ base: "95vw", md: "600px", lg: "650px" }}
        maxW="95vw"
        bg={colors.viewBg}
        borderRadius="2xl"
        boxShadow={colors.modalShadow}
        border="1px solid"
        borderColor={colors.borderColor}
        overflow="hidden"
      >
        <ModalHeader
          bg={colors.viewHeaderBg}
          color={colors.viewHeaderText}
          py={3}
          px={5}
          borderTopRadius="2xl"
          fontWeight="semibold"
          borderBottom="1px solid"
          borderColor={colors.viewHeaderBorder}
        >
          Advanced Search
        </ModalHeader>
        <ModalCloseButton color={colors.viewHeaderText} top={3} right={3} _hover={{ bg: colors.closeBtnHoverBg }} />

        <form onSubmit={formik.handleSubmit}>
          <ModalBody px={6} pt={5} pb={2} maxH="65vh" overflowY="auto" bg={colors.viewBg}>
            <VStack spacing={3} align="stretch">
              <FormControl>
                <FormLabel fontWeight="medium" color={colors.labelColor}>Project Name</FormLabel>
                <Input
                  name="projectName"
                  placeholder="e.g. project name"
                  value={formik.values.projectName}
                  onChange={formik.handleChange}
                  bg={colors.bgInput}
                  borderColor={colors.borderColor}
                  color={colors.headingText}
                  _placeholder={{ color: colors.mutedText }}
                  _hover={{ borderColor: colors.accentGold }}
                  _focus={{
                    borderColor: colors.accentGold,
                    boxShadow: `0 0 0 1px ${colors.accentGold}`,
                  }}
                />
              </FormControl>

              <SimpleGrid columns={colSpan} gap={3}>
                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Location</FormLabel>
                  <Input
                    name="location"
                    placeholder="e.g. location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _placeholder={{ color: colors.mutedText }}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Country</FormLabel>
                  <Select
                    name="country"
                    placeholder="Select Country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                  >
                    {countries?.map((country) => (
                      <option key={country.code} value={country.name} style={{ background: colors.viewBg, color: colors.headingText }}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={colSpan} gap={3}>
                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Listing Type</FormLabel>
                  <Select
                    name="listingType"
                    placeholder="All Listing Types"
                    value={formik.values.listingType}
                    onChange={formik.handleChange}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                  >
                    {listingTypes?.map((type) => (
                      <option key={type._id} value={type._id} style={{ background: colors.viewBg, color: colors.headingText }}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Unit Type</FormLabel>
                  <Select
                    name="unitType"
                    placeholder="All Unit Types"
                    value={formik.values.unitType}
                    onChange={formik.handleChange}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                  >
                    {unitTypes?.map((type) => (
                      <option key={type._id} value={type._id} style={{ background: colors.viewBg, color: colors.headingText }}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <Divider my={2} borderColor={colors.borderColor} />

              {/* Date Range Section */}
              <Box>
                <Text fontSize="md" fontWeight="semibold" mb={2} color={colors.headingText}>
                  Date Range
                </Text>
                <SimpleGrid columns={colSpan} gap={3}>
                  <FormControl>
                    <FormLabel fontWeight="medium" color={colors.labelColor}>Start Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.startFrom}
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
                    <FormLabel fontWeight="medium" color={colors.labelColor}>End Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.startTo}
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

              <Divider my={2} borderColor={colors.borderColor} />

              <SimpleGrid columns={colSpan} gap={3}>
                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Month</FormLabel>
                  <Select
                    name="month"
                    placeholder="Select Month"
                    value={formik.values.month}
                    onChange={formik.handleChange}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value} style={{ background: colors.viewBg, color: colors.headingText }}>
                        {month.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Year</FormLabel>
                  <Input
                    type="number"
                    name="year"
                    placeholder="e.g. year "
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    bg={colors.bgInput}
                    borderColor={colors.borderColor}
                    color={colors.headingText}
                    _placeholder={{ color: colors.mutedText }}
                    _hover={{ borderColor: colors.accentGold }}
                    _focus={{
                      borderColor: colors.accentGold,
                      boxShadow: `0 0 0 1px ${colors.accentGold}`,
                    }}
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={2} borderColor={colors.borderColor} />

              <SimpleGrid columns={colSpan} gap={3}>
                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Min Price (AED)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.minPrice}
                    onChange={(value) =>
                      formik.setFieldValue("minPrice", value)
                    }
                  >
                    <NumberInputField
                      placeholder="Minimum price"
                      bg={colors.bgInput}
                      borderColor={colors.borderColor}
                      color={colors.headingText}
                      _placeholder={{ color: colors.mutedText }}
                      _hover={{ borderColor: colors.accentGold }}
                      _focus={{
                        borderColor: colors.accentGold,
                        boxShadow: `0 0 0 1px ${colors.accentGold}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Max Price (AED)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.maxPrice}
                    onChange={(value) =>
                      formik.setFieldValue("maxPrice", value)
                    }
                  >
                    <NumberInputField
                      placeholder="Maximum price"
                      bg={colors.bgInput}
                      borderColor={colors.borderColor}
                      color={colors.headingText}
                      _placeholder={{ color: colors.mutedText }}
                      _hover={{ borderColor: colors.accentGold }}
                      _focus={{
                        borderColor: colors.accentGold,
                        boxShadow: `0 0 0 1px ${colors.accentGold}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={colSpan} gap={3}>
                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Min Area (sqft)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.minArea}
                    onChange={(value) => formik.setFieldValue("minArea", value)}
                  >
                    <NumberInputField
                      placeholder="Minimum area"
                      bg={colors.bgInput}
                      borderColor={colors.borderColor}
                      color={colors.headingText}
                      _placeholder={{ color: colors.mutedText }}
                      _hover={{ borderColor: colors.accentGold }}
                      _focus={{
                        borderColor: colors.accentGold,
                        boxShadow: `0 0 0 1px ${colors.accentGold}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontWeight="medium" color={colors.labelColor}>Max Area (sqft)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.maxArea}
                    onChange={(value) => formik.setFieldValue("maxArea", value)}
                  >
                    <NumberInputField
                      placeholder="Maximum area"
                      bg={colors.bgInput}
                      borderColor={colors.borderColor}
                      color={colors.headingText}
                      _placeholder={{ color: colors.mutedText }}
                      _hover={{ borderColor: colors.accentGold }}
                      _focus={{
                        borderColor: colors.accentGold,
                        boxShadow: `0 0 0 1px ${colors.accentGold}`,
                      }}
                    />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter
            position="sticky"
            bottom="0"
            bg={colors.viewFooterBg}
            borderTop="1px solid"
            borderColor={colors.viewFooterBorder}
            py={3}
            px={5}
            zIndex="10"
            justifyContent="flex-end"
            gap={3}
          >
            <Button
              variant="outline"
              onClick={handleClear}
              isDisabled={isFilterUnchangedValueEmpty}
              borderRadius={"md"}
            >
              Clear Search
            </Button>
            <Button
              variant="brand"
              type="submit"
              isDisabled={isFilterUnchanged}
              borderRadius={"md"}
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