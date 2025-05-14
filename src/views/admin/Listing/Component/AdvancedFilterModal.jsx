import React, {useMemo} from "react";
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

const AdvancedFilterModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  listingTypes,
  unitTypes,
  initialFilters,
}) => {
  const formik = useFormik({
    initialValues: {
      projectName: initialFilters.projectName || "",
      location: initialFilters.location || "",
      listingType: initialFilters.listingType || "",
      unitType: initialFilters.unitType || "",
      minPrice: initialFilters.minPrice || "",
      maxPrice: initialFilters.maxPrice || "",
      ...initialFilters,
    },
    onSubmit: (values) => {
      // Convert empty strings to undefined
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
  };
  return clean;
}, [initialFilters]);

const isFilterUnchanged = useMemo(() => {
  return Object.entries(cleanedInitialFilters).every(
    ([key, val]) => formik.values[key] === val
  );
}, [formik.values, cleanedInitialFilters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Advanced Filters</ModalHeader>
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
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={handleClear}>
              Clear Filters
            </Button>
            <Button colorScheme="brand" type="submit"   isDisabled={isFilterUnchanged}>
              Apply Filters
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedFilterModal;
