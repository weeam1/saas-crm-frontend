import React, { useMemo } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  VStack,
  Box,
  Text,
  useBreakpointValue,
  useColorModeValue,
  Flex,
  IconButton
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { FiX } from "react-icons/fi";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import SearchUsers from "views/admin/whatsapp/WhatsappSettings/SearchUsers";

const AdvancedFilter = ({
  isOpen,
  onClose,
  filters,
  applyFilters,
  resetFilters,
  grayColors,
  statusOptions,
  actionOptions,
  levelOptions,
  entityOptions,
  usersData
}) => {
  const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });
  const [openCalendar, setOpenCalendar] = React.useState(null);
  const headerBg = useColorModeValue(grayColors.primary, grayColors.darkest);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const formik = useFormik({
    initialValues: {
      userId: filters.userId || "",
      status: filters.status || "",
      from: filters.from || null,
      to: filters.to || null,
      entity: filters.entity || "",
      action: filters.action || "",
      securityLevel: filters.securityLevel || ""
    },
    onSubmit: (values) => {
      applyFilters(values);
      onClose();
    },
  });

  const handleClear = () => {
    formik.resetForm();
    resetFilters();
  };

  const handleSelectUser = (user) => {
    formik.setFieldValue("userId", user?._id || null);
  };

  const isFilterUnchanged = useMemo(() => {
    return (
      formik.values.userId === filters.userId &&
      formik.values.status === filters.status &&
      formik.values.from === filters.from &&
      formik.values.to === filters.to &&
      formik.values.entity === filters.entity &&
      formik.values.action === filters.action &&
      formik.values.securityLevel === filters.securityLevel
    );
  }, [formik.values, filters]);

  const isFilterEmpty = useMemo(() => {
    return Object.values(formik.values).every(
      (val) => val === "" || val === undefined || val === null
    );
  }, [formik.values]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent
        mx={{ base: 2, sm: 4, md: 8 }}
        w={{ base: "95vw", sm: "90vw", md: "500px" }}
        maxW="100vw"
        pb={2}
        borderRadius="lg"
      >
        <ModalHeader bg={headerBg} color="white" borderTopRadius="lg">
          <Flex justify="space-between" align="center" borderTopRadius="lg">
            <Text fontSize="sm">Advanced Filters</Text>
            <IconButton
              icon={<FiX />}
              variant="ghost"
              color="white"
              _hover={{ bg: grayColors.dark }}
              onClick={onClose}
              aria-label="Close"
              size="sm"
            />
          </Flex>
        </ModalHeader>
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <VStack spacing={4} overflow="scroll" height="65vh">
              {/* User Selection */}
              <FormControl>
                <FormLabel>User</FormLabel>
                <SearchUsers
                  selectedUserId={formik.values.userId}
                  users={usersData?.doc || []}
                  onSelectUser={handleSelectUser}
                />
              </FormControl>

              {/* Date Range Section */}
              <Box width="100%">
                <Text fontSize="md" fontWeight="semibold" mb={3}>
                  Date Range
                </Text>
                <VStack width="100%" alignItems="flex-end">
                  <FormControl>
                    <FormLabel>From Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.from}
                      handleDateChange={(date) =>
                        formik.setFieldValue("from", date)
                      }
                      placeholder="Select from date"
                      maxDate={formik.values.to || new Date()}
                      isCalendarOpen={openCalendar === "from"}
                      toggleCalendar={() => toggleCalendar("from")}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>To Date</FormLabel>
                    <CustomDatePicker
                      selectedDate={formik.values.to}
                      handleDateChange={(date) =>
                        formik.setFieldValue("to", date)
                      }
                      placeholder="Select to date"
                      minDate={formik.values.from}
                      maxDate={new Date()}
                      isCalendarOpen={openCalendar === "to"}
                      toggleCalendar={() => toggleCalendar("to")}
                    />
                  </FormControl>
                </VStack>
              </Box>

              <SimpleGrid columns={colSpan} gap={4} w="full">
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    placeholder="Select status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Module</FormLabel>
                  <Select
                    name="entity"
                    placeholder="Select module"
                    value={formik.values.entity}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    {entityOptions?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={colSpan} gap={4} w="full">
                <FormControl>
                  <FormLabel>Action</FormLabel>
                  <Select
                    name="action"
                    placeholder="Select action"
                    value={formik.values.action}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    {actionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Security Level</FormLabel>
                  <Select
                    name="securityLevel"
                    placeholder="Select level"
                    value={formik.values.securityLevel}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                  >
                    {levelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={handleClear}
              isDisabled={isFilterEmpty}
            >
              Clear Filters
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isDisabled={isFilterUnchanged}
            >
              Apply Filters
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedFilter;