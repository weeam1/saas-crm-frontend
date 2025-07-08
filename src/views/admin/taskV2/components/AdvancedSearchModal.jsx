import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
  Checkbox,
  HStack,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import { format } from "date-fns";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  users,
  clearFilter,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [showOverdue, setShowOverdue] = useState(false);
  const [showTodays, setShowTodays] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(null);
  const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

  console.log("users", users);
  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
      setShowOverdue(initialFilters.overdue || false);
      setShowTodays(initialFilters.todays || false);
    }
  }, [isOpen, initialFilters]);

  const toggleCalendar = (calendar) => {
    setOpenCalendar(openCalendar === calendar ? null : calendar);
  };

  const handleApply = () => {
    const newFilters = { ...filters };
    
    if (showOverdue) {
      newFilters.overdue = true;
    } else {
      delete newFilters.overdue;
    }
    
    if (showTodays) {
      newFilters.todays = true;
    } else {
      delete newFilters.todays;
    }
    
    onApplyFilters(newFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
    setShowOverdue(false);
    setShowTodays(false);
  };

  const isFilterUnchanged = JSON.stringify(filters) === JSON.stringify(initialFilters) && 
    showOverdue === (initialFilters.overdue || false) && 
    showTodays === (initialFilters.todays || false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered // Center the modal
    >
      <ModalOverlay />
      <ModalContent mx={{ base: 2, sm: 4, md: 8 }} w={{ base: "95vw", sm: "90vw", md: "500px" }}>
        <ModalHeader>Advanced Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} overflow="scroll" height="65vh">
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={filters.title || ""}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                placeholder="Search by title"
                focusBorderColor="brand.500"
              />
            </FormControl>

            <SimpleGrid columns={colSpan} gap={4} w="full">
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={filters.status || ""}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  placeholder="Select status"
                  focusBorderColor="brand.500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Task Type</FormLabel>
                <Select
                  value={filters.type || ""}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  placeholder="Select type"
                  focusBorderColor="brand.500"
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Document Collection">Document Collection</option>
                  <option value="Custom">Custom</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Assigned To</FormLabel>
              <Select
                value={filters.assignedTo || ""}
                onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                placeholder="Select assignee"
                focusBorderColor="brand.500"
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Due Date Range</FormLabel>
              <SimpleGrid columns={colSpan} gap={4} w="full">
                <CustomDatePicker
                  selectedDate={filters.dueDateFrom}
                  handleDateChange={(date) =>
                    setFilters({ ...filters, dueDateFrom: date })
                  }
                  placeholder="From date"
                  isCalendarOpen={openCalendar === "dueDateFrom"}
                  toggleCalendar={() => toggleCalendar("dueDateFrom")}
                />
                <CustomDatePicker
                  selectedDate={filters.dueDateTo}
                  handleDateChange={(date) =>
                    setFilters({ ...filters, dueDateTo: date })
                  }
                  placeholder="To date"
                  isCalendarOpen={openCalendar === "dueDateTo"}
                  toggleCalendar={() => toggleCalendar("dueDateTo")}
                />
              </SimpleGrid>
            </FormControl>

            <VStack align="start" w="full">
              <Checkbox
                isChecked={showOverdue}
                onChange={(e) => setShowOverdue(e.target.checked)}
                colorScheme="brand"
              >
                Show overdue tasks
              </Checkbox>
              <Checkbox
                isChecked={showTodays}
                onChange={(e) => setShowTodays(e.target.checked)}
                colorScheme="brand"
              >
                Show today's tasks
              </Checkbox>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={handleClear}
            isDisabled={Object.keys(filters).length === 0 && !showOverdue && !showTodays}
          >
            Clear
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleApply}
            isDisabled={isFilterUnchanged}
          >
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdvancedSearchModal;