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
    <Modal isOpen={isOpen} onClose={onClose} size={["full", "xl", "2xl"]}>
      <ModalOverlay />
      <ModalContent
        mx={{ base: 0, md: 4 }}
        maxW={["100%", "600px", "800px"]}
        pb={4}
        borderRadius={["none", "lg"]}
      >
        <ModalHeader 
          bg={headerBg} 
          color="white" 
          borderTopRadius={["none", "lg"]}
          py={3}
        >
          <Flex justify="space-between" align="center">
            <Text fontSize="md" fontWeight="semibold">Advanced Filters</Text>
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
          <ModalBody px={4} py={4}>
            <VStack spacing={5} maxH="65vh" overflowY="auto" pr={2}>
              {/* User Selection */}
              <FormControl width="100%">
                <FormLabel mb={1} fontSize="sm" fontWeight="medium">User</FormLabel>
                <SearchUsers
                  selectedUserId={formik.values.userId}
                  users={usersData?.doc || []}
                  onSelectUser={handleSelectUser}
                />
              </FormControl>

              {/* Date Range Section */}
              <Box width="100%">
                <Text fontSize="sm" fontWeight="semibold" mb={3}>
                  Date Range
                </Text>
                <SimpleGrid columns={colSpan} gap={4}>
                  <FormControl>
                    <FormLabel mb={1} fontSize="sm" fontWeight="medium">From Date</FormLabel>
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
                    <FormLabel mb={1} fontSize="sm" fontWeight="medium">To Date</FormLabel>
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
                </SimpleGrid>
              </Box>

              <SimpleGrid columns={colSpan} gap={4} w="full">
                <FormControl>
                  <FormLabel mb={1} fontSize="sm" fontWeight="medium">Status</FormLabel>
                  <Select
                    name="status"
                    placeholder="Select status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                    size="md"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel mb={1} fontSize="sm" fontWeight="medium">Module</FormLabel>
                  <Select
                    name="entity"
                    placeholder="Select module"
                    value={formik.values.entity}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                    size="md"
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
                  <FormLabel mb={1} fontSize="sm" fontWeight="medium">Action</FormLabel>
                  <Select
                    name="action"
                    placeholder="Select action"
                    value={formik.values.action}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                    size="md"
                  >
                    {actionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel mb={1} fontSize="sm" fontWeight="medium">Security Level</FormLabel>
                  <Select
                    name="securityLevel"
                    placeholder="Select level"
                    value={formik.values.securityLevel}
                    onChange={formik.handleChange}
                    focusBorderColor="brand.500"
                    size="md"
                  >
                    {levelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter px={4} pt={0}>
            <Button
              variant="outline"
              mr={3}
              onClick={handleClear}
              isDisabled={isFilterEmpty}
              size="md"
            >
              Clear Filters
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isDisabled={isFilterUnchanged}
              size="md"
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