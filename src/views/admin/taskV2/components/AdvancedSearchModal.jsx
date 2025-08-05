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
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import CustomDatePicker from "components/datetime/CustomDatePicker";
import SearchUsers from "views/admin/whatsapp/WhatsappSettings/SearchUsers";

const AdvancedSearchModal = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
  users,
  clearFilter,
  user,
  usersData,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [showOverdue, setShowOverdue] = useState(false);
  const [showTodays, setShowTodays] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(null);
  const colSpan = useBreakpointValue({ base: 1, sm: 1, md: 2 });

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

  const isFilterUnchanged =
    JSON.stringify(filters) === JSON.stringify(initialFilters) &&
    showOverdue === (initialFilters.overdue || false) &&
    showTodays === (initialFilters.todays || false);

  const handleSelectUser = (user) => {
    setFilters({ ...filters, assignedTo: user?._id || null });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        mx={{ base: 2, sm: 4, md: 8 }}
        w={{ base: "95vw", sm: "90vw", md: "500px" }}
      >
        <ModalHeader>Advanced Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} overflow="scroll" height="65vh">
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={filters.title || ""}
                onChange={(e) =>
                  setFilters({ ...filters, title: e.target.value })
                }
                placeholder="Search by title"
                focusBorderColor="brand.500"
              />
            </FormControl>

            <SimpleGrid columns={colSpan} gap={4} w="full">
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={filters.status || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  placeholder="Select type"
                  focusBorderColor="brand.500"
                >
                  <option value="Follow-up">Follow-up</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Site Visit">Site Visit</option>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Document Collection">
                    Document Collection
                  </option>
                  <option value="Custom">Custom</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            {(user?.role === "superAdmin" ||
              user?.roles?.[0]?.roleName === "Manager" ||
              user?.roles?.[0]?.roleName === "HR") && (
              <FormControl>
                <FormLabel>Assigned To</FormLabel>
                <SearchUsers
                  selectedUserId={filters.assignedTo || null}
                  users={ user?.roles[0]?.roleName === "Manager" ? users: usersData?.doc || []}
                  onSelectUser={handleSelectUser}
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Due Date Range</FormLabel>
              <VStack width="100%" alignItems="flex-end">
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
                  minDate={filters.dueDateFrom}
                />
              </VStack>
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
            isDisabled={
              Object.keys(filters).length === 0 && !showOverdue && !showTodays
            }
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
