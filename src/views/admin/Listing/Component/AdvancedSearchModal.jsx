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
} from "@chakra-ui/react";
import { useFormik } from "formik";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  listingTypes,
  unitTypes,
  initialFilters,
  clearFilter,
}) => {
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
      ...initialFilters,
    },
    onSubmit: (values) => {
      const cleanedValues = Object.fromEntries(
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
      },
    });
    onApplyFilters({});
    onClose();
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
        },
      });
    }
  }, [clearFilter]);

  const isFilterUnchangedValueEmpty = useMemo(() => {
    return Object.values(formik.values).every(
      (val) => val === "" || val === undefined
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
        },
      });
    }
  }, [isOpen, initialFilters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Advanced search</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Project Name</FormLabel>
                <Input
                  name="projectName"
                  placeholder="e.g. project name"
                  value={formik.values.projectName}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  placeholder="e.g. location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                />
              </FormControl>

              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl>
                  <FormLabel>Listing Type</FormLabel>
                  <Select
                    name="listingType"
                    placeholder="All Listing Types"
                    value={formik.values.listingType}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    {listingTypes?.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Unit Type</FormLabel>
                  <Select
                    name="unitType"
                    placeholder="All Unit Types"
                    value={formik.values.unitType}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    {unitTypes?.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl>
                  <FormLabel>Month</FormLabel>
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
                  <FormLabel>Year</FormLabel>
                  <Input
                    type="number"
                    name="year"
                    placeholder="e.g. year "
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl>
                  <FormLabel>Min Price (AED)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.minPrice}
                    onChange={(value) =>
                      formik.setFieldValue("minPrice", value)
                    }
                    focusBorderColor="brand.500"
                  >
                    <NumberInputField placeholder="Minimum price" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Max Price (AED)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.maxPrice}
                    onChange={(value) =>
                      formik.setFieldValue("maxPrice", value)
                    }
                    focusBorderColor="brand.500"
                  >
                    <NumberInputField placeholder="Maximum price" />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} gap={4} w="full">
                <FormControl>
                  <FormLabel>Min Area (sqft)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.minArea}
                    onChange={(value) => formik.setFieldValue("minArea", value)}
                    focusBorderColor="brand.500"
                  >
                    <NumberInputField placeholder="Minimum area" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Max Area (sqft)</FormLabel>
                  <NumberInput
                    min={0}
                    value={formik.values.maxArea}
                    onChange={(value) => formik.setFieldValue("maxArea", value)}
                    focusBorderColor="brand.500"
                  >
                    <NumberInputField placeholder="Maximum area" />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
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
