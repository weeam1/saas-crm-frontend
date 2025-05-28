import React, { useEffect } from "react";
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
  Select,
  Box,
  VStack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import moment from "moment";
import CustomDatePicker from "components/datetime/CustomDatePicker";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  agencies = [],
  initialFilters = {},
  clearFilter,
}) => {
  const [openCalendar, setOpenCalendar] = React.useState(null);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const toUTCString = (date) => {
    return date
      ? moment(date).utcOffset(0, true).startOf('day').toISOString()
      : null;
  };

  const formik = useFormik({
    initialValues: {
      agency: initialFilters.agency || "",
      from: initialFilters.from ? new Date(initialFilters.from) : null,
      to: initialFilters.to ? new Date(initialFilters.to) : null,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const cleaned = {
        agency: values.agency,
        from: values.from ? toUTCString(values.from) : undefined,
        to: values.to ? toUTCString(values.to) : undefined,
      };
      onApplyFilters(
        Object.fromEntries(
          Object.entries(cleaned).filter(
            ([, v]) => v !== "" && v !== undefined && v !== null
          )
        )
      );
      onClose();
    },
  });

  useEffect(() => {
    if (!clearFilter) {
      formik.resetForm({
        values: {
          agency: "",
          from: null,
          to: null,
        },
      });
    }
    // eslint-disable-next-line
  }, [clearFilter]);

  const handleClear = () => {
    formik.resetForm({
      values: {
        agency: "",
        from: null,
        to: null,
      },
    });
    onApplyFilters({});
    onClose();
  };

  const isFilterUnchanged = React.useMemo(() => {
    const currentValues = {
      agency: formik.values.agency,
      from: formik.values.from ? toUTCString(formik.values.from) : null,
      to: formik.values.to ? toUTCString(formik.values.to) : null,
    };

    const initialValues = {
      agency: initialFilters.agency || "",
      from: initialFilters.from ? toUTCString(new Date(initialFilters.from)) : null,
      to: initialFilters.to ? toUTCString(new Date(initialFilters.to)) : null,
    };

    return (
      currentValues.agency === initialValues.agency &&
      currentValues.from === initialValues.from &&
      currentValues.to === initialValues.to
    );
  }, [formik.values, initialFilters]);

  const isFilterEmpty = React.useMemo(() => {
    return (
      !formik.values.agency && 
      !formik.values.from && 
      !formik.values.to
    );
  }, [formik.values]);

  useEffect(() => {
    if (isOpen) {
      formik.resetForm({
        values: {
          agency: initialFilters.agency || "",
          from: initialFilters.from ? new Date(initialFilters.from) : null,
          to: initialFilters.to ? new Date(initialFilters.to) : null,
        },
      });
    }
    // eslint-disable-next-line
  }, [isOpen, initialFilters]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Advanced Search</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Agency</FormLabel>
                <Select
                  name="agency"
                  placeholder="All"
                  value={formik.values.agency}
                  onChange={formik.handleChange}
                  focusBorderColor="brand.500"
                >
                  <option value="">All</option>
                  {agencies.map((agency) => (
                    <option key={agency._id} value={agency._id}>
                      {agency.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <Box w="full">
                <SimpleGrid columns={2} gap={4}>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.from}
                      handleDateChange={(date) => {
                        formik.setFieldValue("from", date);
                        if (formik.values.to && date && date > formik.values.to) {
                          formik.setFieldValue("to", null);
                        }
                      }}
                      placeholder="Select start date"
                      maxDate={formik.values.to || new Date()}
                      isCalendarOpen={openCalendar === 'from'}
                      toggleCalendar={() => toggleCalendar('from')}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>End Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.to}
                      handleDateChange={(date) => {
                        formik.setFieldValue("to", date);
                        if (formik.values.from && date && date < formik.values.from) {
                          formik.setFieldValue("from", null);
                        }
                      }}
                      placeholder="Select end date"
                      minDate={formik.values.from}
                      maxDate={new Date()}
                      isCalendarOpen={openCalendar === 'to'}
                      toggleCalendar={() => toggleCalendar('to')}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={handleClear}
              isDisabled={isFilterEmpty}
            >
              Clear Search
            </Button>
            <Button
              colorScheme="brand"
              type="submit"
              isDisabled={isFilterUnchanged || isFilterEmpty}
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